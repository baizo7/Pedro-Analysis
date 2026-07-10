#!/bin/bash

# Start Celery worker in the background
echo "Starting Celery worker..."
celery -A app.tasks.celery_app worker --loglevel=info &

# Start FastAPI in the foreground
echo "Starting FastAPI server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000
