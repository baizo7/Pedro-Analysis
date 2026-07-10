FROM python:3.12-slim

WORKDIR /app

# Install system dependencies for ML packages
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Make the start script executable
RUN chmod +x start.sh

# Run the startup script (starts both Celery and FastAPI)
CMD ["./start.sh"]
