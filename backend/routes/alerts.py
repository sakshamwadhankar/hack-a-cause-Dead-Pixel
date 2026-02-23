from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Alert
from typing import List

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("/")
def get_active_alerts(db: Session = Depends(get_db)):
    alerts = db.query(Alert).filter(Alert.is_active == True).all()
    return alerts

@router.put("/{alert_id}/dismiss")
def dismiss_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if alert:
        alert.is_active = False
        db.commit()
    return {"message": "Alert dismissed"}
