from celery import Celery
import os

# Ensure the backend is run with correct env vars, defaulting to local docker-compose redis
REDIS_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "streaminsight_tasks",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["app.tasks.ingestion"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)
