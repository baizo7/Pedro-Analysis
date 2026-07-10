from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.models.dataset import DatasetStatusEnum

class DatasetBase(BaseModel):
    name: str

class DatasetCreate(DatasetBase):
    pass

class DatasetResponse(DatasetBase):
    id: UUID
    organization_id: UUID
    status: DatasetStatusEnum
    rows_count: int
    created_at: datetime

    class Config:
        from_attributes = True

class TitleResponse(BaseModel):
    id: UUID
    type: str
    title: str
    director: Optional[str]
    country: Optional[str]
    release_year: Optional[int]
    rating: Optional[str]
    duration: Optional[str]
    listed_in: Optional[str]

    class Config:
        from_attributes = True
