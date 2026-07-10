import shutil
import uuid
import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.models.dataset import Dataset, DatasetStatusEnum
from app.schemas.dataset import DatasetResponse
from app.tasks.ingestion import process_dataset

router = APIRouter()

TEMP_DIR = "/tmp/streaminsight_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)

@router.post("/upload", response_model=DatasetResponse)
async def upload_dataset(
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")

    # Get the user's primary organization (simplified for MVP)
    membership = current_user.memberships[0]
    if not membership:
        raise HTTPException(status_code=400, detail="User has no workspace")

    dataset = Dataset(
        organization_id=membership.organization_id,
        name=file.filename,
        status=DatasetStatusEnum.PENDING
    )
    db.add(dataset)
    db.commit()
    db.refresh(dataset)

    file_path = os.path.join(TEMP_DIR, f"{dataset.id}.csv")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Trigger Celery Task
    process_dataset.delay(str(dataset.id), file_path)

    return dataset

@router.get("/", response_model=list[DatasetResponse])
def get_datasets(
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    membership = current_user.memberships[0]
    datasets = db.query(Dataset).filter(Dataset.organization_id == membership.organization_id).order_by(Dataset.created_at.desc()).all()
    return datasets

@router.delete("/{dataset_id}")
def delete_dataset(
    dataset_id: str,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    membership = current_user.memberships[0]
    dataset = db.query(Dataset).filter(
        Dataset.id == dataset_id,
        Dataset.organization_id == membership.organization_id
    ).first()
    
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    db.delete(dataset)
    db.commit()
    return {"status": "success", "message": "Dataset deleted successfully"}
