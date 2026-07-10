from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api import deps
from app.models.user import User
from app.models.dataset import Dataset, Title
import pandas as pd
import os
import uuid

try:
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import letter
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False

router = APIRouter()

TEMP_DIR = "/tmp/streaminsight_reports"
os.makedirs(TEMP_DIR, exist_ok=True)

@router.get("/export/excel")
def export_excel(
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    membership = current_user.memberships[0]
    org_id = membership.organization_id

    # Fetch aggregated data for report
    type_counts = db.query(Title.type, func.count(Title.id)).join(Dataset)\
                    .filter(Dataset.organization_id == org_id)\
                    .group_by(Title.type).all()
    
    df = pd.DataFrame(type_counts, columns=['Content Type', 'Total Count'])
    
    file_path = os.path.join(TEMP_DIR, f"report_{uuid.uuid4().hex}.xlsx")
    df.to_excel(file_path, index=False, engine='openpyxl')

    return FileResponse(path=file_path, filename="StreamInsight_Executive_Report.xlsx", media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

@router.get("/export/pdf")
def export_pdf(
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    if not REPORTLAB_AVAILABLE:
        raise HTTPException(status_code=501, detail="PDF Generation not available.")

    membership = current_user.memberships[0]
    org_id = membership.organization_id
    org_name = membership.organization.name

    total_titles = db.query(Title).join(Dataset).filter(Dataset.organization_id == org_id).count()

    file_path = os.path.join(TEMP_DIR, f"report_{uuid.uuid4().hex}.pdf")
    
    # Generate basic PDF
    c = canvas.Canvas(file_path, pagesize=letter)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(50, 750, f"StreamInsight AI Executive Report")
    
    c.setFont("Helvetica", 14)
    c.drawString(50, 700, f"Workspace: {org_name}")
    c.drawString(50, 670, f"Total Titles Analyzed: {total_titles:,}")
    c.drawString(50, 640, "Report generated automatically by StreamInsight AI.")
    
    c.save()

    return FileResponse(path=file_path, filename=f"{org_name}_Report.pdf", media_type='application/pdf')
