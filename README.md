# Pedro Analysis - Enterprise Business Intelligence Suite

![Pedro Analysis](https://img.shields.io/badge/Status-Active-success) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

Pedro Analysis is a state-of-the-art, AI-powered Business Intelligence (BI) and analytics platform designed for streaming media catalogs. It provides a comprehensive, 10-tab executive dashboard with rich data visualizations, automated data quality checks, and AI-generated insights.

## ✨ Key Features

The platform features a modern, responsive **Glassmorphism** UI and an extensive suite of analytical tools broken down into 10 specialized intelligence verticals:

1. **Executive Overview**: High-level KPIs, YoY growth, and cumulative catalog expansion tracking.
2. **Content Intelligence**: Deep dive into top directors, actors, genre distributions, and content categorization.
3. **Audience Intelligence**: Subscriber retention funnels, churn waterfalls, and engagement tracking.
4. **Geographic Intelligence**: Global sourcing metrics and regional content mapping.
5. **Business Intelligence**: CSAT gauges, revenue breakdown bullets, and AI insight matrices.
6. **Quality Metrics**: Runtime distribution histograms, duration density mapping, and genre quality bubble charts.
7. **Financial Analytics**: MRR forecasting, Revenue by tier (Donut), and ARPU tracking.
8. **AI Insights**: Automated, confidence-scored AI recommendations (Opportunity, Risk, Strategy) based on live catalog data.
9. **Reports & Export**: Live data tables for Top Talent and Global Markets, with 1-click PDF/Excel export capabilities.
10. **Data Quality**: Automated, real-time data integrity checks ensuring your metrics are based on complete and accurate datasets.

## 🛠️ Technology Stack

### Frontend
* **Core**: React 18, TypeScript, Vite
* **Styling**: Tailwind CSS (with Glassmorphism aesthetics)
* **Icons**: Lucide React
* **Data Visualization**: Recharts (for standard charts), Nivo (for complex visualizations like ScatterPlots, Treemaps, and Radar charts)

### Backend
* **Core**: Python 3.12, FastAPI
* **Database**: PostgreSQL (SQLAlchemy ORM)
* **Background Tasks**: Celery with Redis broker
* **Authentication**: JWT (JSON Web Tokens)

### Infrastructure
* **Containerization**: Docker & Docker Compose
* **Web Server**: Nginx (for serving the compiled frontend)

## 🚀 Getting Started (Local Development)

The entire application is containerized for seamless local deployment.

### Prerequisites
* [Docker](https://www.docker.com/) and Docker Compose
* Git

### Installation & Execution

1. **Clone the repository:**
   ```bash
   git clone https://github.com/baizo7/Pedro-Analysis.git
   cd Pedro-Analysis
   ```

2. **Start the application stack:**
   This will build the frontend and backend images, set up the PostgreSQL database, and start the Redis instance.
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

3. **Access the Application:**
   * **Frontend UI:** Open your browser to `http://localhost/`
   * **Backend API Docs:** Navigate to `http://localhost:8000/docs` to interact with the FastAPI Swagger UI.

### Bypassing Browser Cache (If updating locally)
If you make UI changes and do not see them reflect at `http://localhost/`, ensure you perform a **Hard Refresh** (`Ctrl+Shift+R` or `Cmd+Shift+R`) to bypass your browser's local cache.

## 📁 Project Structure

```
Pedro-Analysis/
├── backend/                  # FastAPI Python backend
│   ├── app/                  # Application logic (API, Core, DB, Models, Schemas)
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile            # Backend container configuration
├── frontend/                 # React frontend
│   ├── src/                  # React source code (Components, Features, Pages, Utils)
│   ├── public/               # Static assets
│   ├── nginx.conf            # Custom Nginx configuration (with cache-control)
│   ├── package.json          # Node dependencies
│   └── Dockerfile            # Frontend build & serve configuration
├── docker-compose.yml        # Base infrastructure compose file
└── docker-compose.prod.yml   # Full stack production compose file
```

## 📄 License
&copy; 2026 Pedro Analysis. All rights reserved.
