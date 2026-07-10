from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.core import security
from app.core.config import settings
from app.models.user import User, Organization, Membership, RoleEnum
from app.schemas.user import UserCreate, UserResponse, Token, LoginRequest
import uuid
import re

router = APIRouter()

def create_slug(name: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

@router.post("/register", response_model=UserResponse)
def register_user(user_in: UserCreate, db: Session = Depends(deps.get_db)):
    # Check if user exists
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    # Create Organization / Workspace
    org_slug = create_slug(user_in.organization_name)
    # Ensure slug is unique
    existing_org = db.query(Organization).filter(Organization.slug == org_slug).first()
    if existing_org:
        org_slug = f"{org_slug}-{uuid.uuid4().hex[:6]}"

    org = Organization(name=user_in.organization_name, slug=org_slug)
    db.add(org)
    db.flush() # Get org id

    # Create User
    user = User(
        email=user_in.email,
        password_hash=security.get_password_hash(user_in.password),
        first_name=user_in.first_name,
        last_name=user_in.last_name,
    )
    db.add(user)
    db.flush()

    # Create Membership
    membership = Membership(
        user_id=user.id,
        organization_id=org.id,
        role=RoleEnum.ADMIN
    )
    db.add(membership)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=Token)
def login_access_token(
    login_req: LoginRequest, db: Session = Depends(deps.get_db)
):
    user = db.query(User).filter(User.email == login_req.email).first()
    if not user or not security.verify_password(login_req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_user: User = Depends(deps.get_current_user),
):
    return current_user
