from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User, Organization
import stripe
import os

router = APIRouter()

# Mock Stripe Setup for MVP
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_mock123")

@router.get("/status")
def get_subscription_status(
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    membership = current_user.memberships[0]
    org = db.query(Organization).filter(Organization.id == membership.organization_id).first()
    
    return {
        "tier": org.subscription_tier,
        "is_active": True,
        "features": ["unlimited_datasets", "ai_insights", "forecasting"] if org.subscription_tier in ["pro", "enterprise"] else ["basic_datasets"]
    }

@router.post("/checkout")
def create_checkout_session(
    tier: str,
    current_user: User = Depends(deps.get_current_user)
):
    """
    Mock endpoint that would normally create a Stripe Checkout Session
    """
    if tier not in ["pro", "enterprise"]:
        raise HTTPException(status_code=400, detail="Invalid subscription tier")
        
    # Return a mock checkout URL for the UI
    return {"checkout_url": f"https://checkout.stripe.com/mock-session-{tier}"}
