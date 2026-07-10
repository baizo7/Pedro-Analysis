# Pedro Analysis - Enterprise Business Intelligence Suite

![Pedro Analysis](https://img.shields.io/badge/Status-Active-success) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)

Pedro Analysis is a state-of-the-art, AI-powered Business Intelligence (BI) and analytics platform designed for streaming media catalogs. It provides a comprehensive executive dashboard with rich data visualizations, automated data quality checks, and background AI-generated insights via Celery.

## ✨ Key Features

The platform features a modern, responsive **Glassmorphism** UI and an extensive suite of analytical tools:

1. **Executive Overview**: High-level KPIs, YoY growth, and cumulative catalog expansion tracking.
2. **Content Intelligence**: Deep dive into top directors, actors, genre distributions, and content categorization.
3. **Audience Intelligence**: Subscriber retention funnels, churn waterfalls, and engagement tracking.
4. **Business & Financial Intelligence**: CSAT gauges, MRR forecasting, and ARPU tracking.
5. **Quality Metrics**: Runtime distribution histograms, duration density mapping, and genre quality bubble charts.
6. **AI Insights**: Automated, confidence-scored AI recommendations (Opportunity, Risk, Strategy) calculated in the background based on live catalog data.
7. **Cloud Ready**: Configured for 100% Free-Tier cloud deployment using a Serverless Database, Redis Queue, Render Dual-Boot Container, and Vercel Edge routing.

## 🛠️ Technology Stack

### Frontend (Hosted on Vercel)
* **Core**: React 18, TypeScript, Vite
* **Styling**: Tailwind CSS (Glassmorphism aesthetics)
* **Icons**: Lucide React
* **Data Visualization**: Recharts, Nivo (ScatterPlots, Treemaps, and Radar charts)

### Backend (Hosted on Render - Dual Boot Free Tier)
* **Core**: Python 3.12, FastAPI
* **Database**: Neon Serverless PostgreSQL (SQLAlchemy ORM)
* **Background Tasks**: Celery with Upstash Serverless Redis broker
* **Authentication**: JWT (JSON Web Tokens)
* **Architecture**: Configured with a `start.sh` script to run both the FastAPI Web Server and Celery `solo` pool Worker within the same 512MB memory limit for zero-cost deployment.

## 🚀 Cloud Deployment Guide

This project is configured to be deployed easily and for free using modern cloud providers.

### 1. Database & Cache
1. Create a free Serverless Postgres database on **Neon.tech**. Copy the `DATABASE_URL`.
2. Create a free Serverless Redis database on **Upstash.com**. Copy the secure `rediss://...` URL.

### 2. Backend (Render)
1. Fork this repository and create a new **Web Service** on Render.
2. Select the `backend` directory as your root.
3. Add the following Environment Variables:
   - `DATABASE_URL`: (Your Neon Postgres URL)
   - `CELERY_BROKER_URL`: (Your Upstash Redis URL)
   - `REDIS_URL`: (Your Upstash Redis URL)
   - `SECRET_KEY`: (A random secure string)
4. Deploy! The custom `start.sh` script and `render.yaml` configurations handle the rest, launching both the API and Background Worker in a single free container while gracefully handling Upstash SSL connections.

### 3. Frontend (Vercel)
1. Create a new project on **Vercel** pointing to your forked repository.
2. Set the Framework Preset to **Vite**.
3. Set the Root Directory to `frontend`.
4. Add the following Environment Variable:
   - `VITE_API_URL`: (Your Render backend URL, e.g., `https://pedro-analysis.onrender.com`)
5. Deploy! Vercel will automatically read `vercel.json` to handle React Router SPA fallbacks.

## 📁 Project Structure

```
Pedro-Analysis/
├── backend/                  # FastAPI Python backend
│   ├── app/                  # Application logic (API, Core, DB, Models, Tasks)
│   ├── requirements.txt      # Python dependencies
│   ├── start.sh              # Dual-boot script for free-tier Render deployments
│   └── Dockerfile            # Backend container configuration
├── frontend/                 # React frontend
│   ├── src/                  # React source code (Components, Features, Pages, Lib)
│   ├── vercel.json           # Vercel configuration for SPA routing
│   ├── package.json          # Node dependencies
│   └── Dockerfile            # Frontend configuration (for local docker use)
├── docker-compose.yml        # Infrastructure compose file (Local Dev)
└── render.yaml               # Render Blueprint configuration
```

## 📄 License
&copy; 2026 Pedro Analysis. All rights reserved.
