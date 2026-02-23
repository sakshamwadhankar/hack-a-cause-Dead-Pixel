from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Alert, Village
from wsi_calculator import calculate_wsi
from datetime import datetime
from typing import List

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("/")
def get_active_alerts(db: Session = Depends(get_db)):
    alerts = db.query(Alert).filter(Alert.is_active == True).order_by(
        Alert.severity.desc(),
        Alert.created_at.desc()
    ).all()
    return alerts

@router.post("/generate")
def generate_alerts(db: Session = Depends(get_db)):
    villages = db.query(Village).all()
    
    for village in villages:
        wsi, stress_level = calculate_wsi(village)
        village.water_stress_index = wsi
        village.stress_level = stress_level
    db.commit()
    
    critical_villages = [v for v in villages if v.stress_level in ["critical", "high"]]
    
    alerts_created = []
    for village in critical_villages:
        existing_alert = db.query(Alert).filter(
            Alert.village_id == village.id,
            Alert.is_active == True,
            Alert.alert_type == "drought_warning"
        ).first()
        
        if not existing_alert:
            severity = "high" if village.stress_level == "critical" else "medium"
            message = f"Water stress index {village.water_stress_index} in {village.name}, {village.district}. "
            message += f"Days without water: {village.days_without_water}. Immediate action required."
            
            alert = Alert(
                village_id=village.id,
                alert_type="drought_warning",
                severity=severity,
                message=message,
                is_active=True
            )
            db.add(alert)
            alerts_created.append({
                "village_name": village.name,
                "stress_level": village.stress_level,
                "wsi_score": village.water_stress_index,
                "days_without_water": village.days_without_water,
                "message": message,
                "severity": severity
            })
    
    db.commit()
    
    return {
        "alerts_created": len(alerts_created),
        "alerts": alerts_created
    }

@router.put("/{alert_id}/resolve")
def resolve_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.is_active = False
    db.commit()
    
    return {"message": "Alert resolved successfully"}

@router.put("/{alert_id}/dismiss")
def dismiss_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if alert:
        alert.is_active = False
        db.commit()
    return {"message": "Alert dismissed"}
