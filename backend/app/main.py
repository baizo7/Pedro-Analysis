from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, dataset, analytics, ai, reports, subscriptions, chat
from app.db.session import engine
from app.models.user import Base as UserBase
from app.models.dataset import Base as DatasetBase

# Create database tables (For local dev, usually handled by Alembic in prod)
UserBase.metadata.create_all(bind=engine)
DatasetBase.metadata.create_all(bind=engine)

app = FastAPI(
    title="StreamInsight AI API",
    description="Backend API for StreamInsight AI SaaS Platform",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(dataset.router, prefix="/api/v1/datasets", tags=["datasets"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["ai"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])
app.include_router(subscriptions.router, prefix="/api/v1/subscriptions", tags=["subscriptions"])

@app.get("/")
async def root():
    return {"message": "Welcome to StreamInsight AI API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
