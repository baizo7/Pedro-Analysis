import pandas as pd
import os
import uuid
from app.tasks.celery_app import celery_app
from app.db.session import SessionLocal
from app.models.dataset import Dataset, Title, DatasetStatusEnum
from app.models.user import Organization
import logging

logger = logging.getLogger(__name__)

@celery_app.task(bind=True)
def process_dataset(self, dataset_id: str, file_path: str):
    logger.info(f"Starting to process dataset {dataset_id}")
    db = SessionLocal()
    try:
        dataset = db.query(Dataset).filter(Dataset.id == uuid.UUID(dataset_id)).first()
        if not dataset:
            logger.error("Dataset not found")
            return
        
        dataset.status = DatasetStatusEnum.PROCESSING
        db.commit()

        # Read CSV with Pandas
        df = pd.read_csv(file_path)
        
        # Standardize column names (assuming Netflix dataset format)
        df.columns = [c.strip().lower() for c in df.columns]
        
        rows_processed = 0
        batch_size = 1000
        titles = []

        for index, row in df.iterrows():
            title = Title(
                dataset_id=dataset.id,
                show_id=str(row.get('show_id', '')),
                type=str(row.get('type', '')),
                title=str(row.get('title', '')),
                director=str(row.get('director', '')) if pd.notna(row.get('director')) else None,
                cast_members=str(row.get('cast', '')) if pd.notna(row.get('cast')) else None,
                country=str(row.get('country', '')) if pd.notna(row.get('country')) else None,
                release_year=int(row['release_year']) if pd.notna(row.get('release_year')) else None,
                rating=str(row.get('rating', '')) if pd.notna(row.get('rating')) else None,
                duration=str(row.get('duration', '')) if pd.notna(row.get('duration')) else None,
                listed_in=str(row.get('listed_in', '')) if pd.notna(row.get('listed_in')) else None,
                description=str(row.get('description', '')) if pd.notna(row.get('description')) else None
            )
            titles.append(title)
            
            if len(titles) >= batch_size:
                db.add_all(titles)
                db.commit()
                rows_processed += len(titles)
                titles = []
        
        # Add remaining
        if titles:
            db.add_all(titles)
            db.commit()
            rows_processed += len(titles)

        dataset.status = DatasetStatusEnum.READY
        dataset.rows_count = rows_processed
        db.commit()
        logger.info(f"Successfully processed dataset {dataset_id} with {rows_processed} rows.")
    except Exception as e:
        logger.error(f"Error processing dataset: {e}")
        db.rollback()
        dataset = db.query(Dataset).filter(Dataset.id == uuid.UUID(dataset_id)).first()
        if dataset:
            dataset.status = DatasetStatusEnum.FAILED
            db.commit()
    finally:
        # Clean up the temp file
        if os.path.exists(file_path):
            os.remove(file_path)
        db.close()
