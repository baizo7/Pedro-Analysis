import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
import enum

class DatasetStatusEnum(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    READY = "ready"
    FAILED = "failed"

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    status = Column(Enum(DatasetStatusEnum), default=DatasetStatusEnum.PENDING, nullable=False)
    rows_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    organization = relationship("Organization")
    titles = relationship("Title", back_populates="dataset", cascade="all, delete")

class Title(Base):
    __tablename__ = "titles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    dataset_id = Column(UUID(as_uuid=True), ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False)
    
    # Original Streaming metadata fields
    show_id = Column(String, nullable=True) # e.g. s1, s2
    type = Column(String, index=True) # Movie or TV Show
    title = Column(String, index=True)
    director = Column(String, nullable=True)
    cast_members = Column(Text, nullable=True) # Stored as comma-separated or json later
    country = Column(String, nullable=True)
    date_added = Column(DateTime, nullable=True)
    release_year = Column(Integer, index=True)
    rating = Column(String, nullable=True)
    duration = Column(String, nullable=True) # e.g. "90 min" or "2 Seasons"
    listed_in = Column(Text, nullable=True) # Genres
    description = Column(Text, nullable=True)
    
    dataset = relationship("Dataset", back_populates="titles")
