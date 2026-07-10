#!/bin/bash

# Start Celery worker in the background (using 'solo' pool to drastically reduce memory usage for Free Tier)
echo "Starting Celery worker..."
celery -A app.tasks.celery_app worker --pool=solo --loglevel=info &

# Start FastAPI in the foreground
echo "Starting FastAPI server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000
