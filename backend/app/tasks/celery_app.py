import os
from celery import Celery

# Get URLs and strip whitespace/quotes
celery_url = os.getenv("CELERY_BROKER_URL", "").strip().strip('"').strip("'")
fallback_url = os.getenv("REDIS_URL", "").strip().strip('"').strip("'")

# Bulletproof fallback logic: Use CELERY_BROKER_URL, then REDIS_URL, then localhost
REDIS_URL = celery_url if celery_url else (fallback_url if fallback_url else "redis://localhost:6379/0")

# Auto-correct Upstash URLs to use SSL scheme if user accidentally pasted redis://
if "upstash.io" in REDIS_URL and REDIS_URL.startswith("redis://"):
    REDIS_URL = REDIS_URL.replace("redis://", "rediss://", 1)

# Upstash/serverless Redis instances using rediss:// require specific SSL configurations in Celery
broker_use_ssl = None
if REDIS_URL.startswith("rediss://"):
    import ssl
    broker_use_ssl = {
        'ssl_cert_reqs': ssl.CERT_NONE
    }

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
    broker_use_ssl=broker_use_ssl,
    redis_backend_use_ssl=broker_use_ssl
)
