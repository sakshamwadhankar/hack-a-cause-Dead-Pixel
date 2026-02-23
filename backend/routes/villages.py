from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Village, Alert
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from wsi_calculator import calculate_wsi

router = APIRouter(prefix="/villages", tags=["villages"])

class VillageResponse(BaseModel):
    id: int
    name: str
    district: str
    latitude: float
    longitude: float
    population: int
    rainfall_current: float
    rainfall_normal: float
    groundwater_current: float
    groundwater_last_year: float
    water_stress_index: float
    stress_level: str
    last_tanker_date: Optional[date]
    days_without_water: int
    
    class Config:
        from_attributes = True

class UpdateWaterRequest(BaseModel):
    days_without_water: int

@router.get("/", response_model=List[VillageResponse])
def get_villages(db: Session = Depends(get_db)):
    villages = db.query(Village).all()
    for village in villages:
        wsi, stress_level = calculate_wsi(village)
        village.water_stress_index = wsi
        village.stress_level = stress_level
    db.commit()
    return villages

@router.get("/critical", response_model=List[VillageResponse])
def get_critical_villages(db: Session = Depends(get_db)):
    villages = db.query(Village).all()
    for village in villages:
        wsi, stress_level = calculate_wsi(village)
        village.water_stress_index = wsi
        village.stress_level = stress_level
    db.commit()
    
    critical_villages = [v for v in villages if v.stress_level in ["critical", "high"]]
    return sorted(critical_villages, key=lambda v: v.water_stress_index, reverse=True)

@router.get("/stats")
def get_village_stats(db: Session = Depends(get_db)):
    villages = db.query(Village).all()
    
    for village in villages:
        wsi, stress_level = calculate_wsi(village)
        village.water_stress_index = wsi
        village.stress_level = stress_level
    db.commit()
    
    critical_count = len([v for v in villages if v.stress_level == "critical"])
    high_count = len([v for v in villages if v.stress_level == "high"])
    moderate_count = len([v for v in villages if v.stress_level == "moderate"])
    safe_count = len([v for v in villages if v.stress_level == "safe"])
    
    avg_wsi = sum(v.water_stress_index for v in villages) / len(villages) if villages else 0
    most_stressed = max(villages, key=lambda v: v.water_stress_index) if villages else None
    
    return {
        "total_villages": len(villages),
        "critical_count": critical_count,
        "high_count": high_count,
        "moderate_count": moderate_count,
        "safe_count": safe_count,
        "avg_wsi": round(avg_wsi, 2),
        "most_stressed_village": {
            "name": most_stressed.name,
            "wsi": most_stressed.water_stress_index
        } if most_stressed else None
    }

@router.get("/{village_id}", response_model=VillageResponse)
def get_village(village_id: int, db: Session = Depends(get_db)):
    village = db.query(Village).filter(Village.id == village_id).first()
    if not village:
        raise HTTPException(status_code=404, detail="Village not found")
    
    wsi, stress_level = calculate_wsi(village)
    village.water_stress_index = wsi
    village.stress_level = stress_level
    db.commit()
    
    return village

@router.put("/{village_id}/update-water")
def update_water_status(village_id: int, request: UpdateWaterRequest, db: Session = Depends(get_db)):
    village = db.query(Village).filter(Village.id == village_id).first()
    if not village:
        raise HTTPException(status_code=404, detail="Village not found")
    
    village.days_without_water = request.days_without_water
    
    wsi, stress_level = calculate_wsi(village)
    village.water_stress_index = wsi
    village.stress_level = stress_level
    
    db.commit()
    db.refresh(village)
    
    return {"message": "Water status updated", "wsi": wsi, "stress_level": stress_level}

@router.get("/{village_id}/alerts")
def get_village_alerts(village_id: int, db: Session = Depends(get_db)):
    alerts = db.query(Alert).filter(
        Alert.village_id == village_id,
        Alert.is_active == True
    ).all()
    return alerts
