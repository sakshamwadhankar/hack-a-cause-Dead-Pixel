from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Village, Alert
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/villages", tags=["villages"])

class VillageResponse(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float
    population: int
    water_level: float
    drought_risk: str
    last_rainfall: float
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[VillageResponse])
def get_villages(db: Session = Depends(get_db)):
    villages = db.query(Village).all()
    return villages

@router.get("/{village_id}", response_model=VillageResponse)
def get_village(village_id: int, db: Session = Depends(get_db)):
    village = db.query(Village).filter(Village.id == village_id).first()
    if not village:
        raise HTTPException(status_code=404, detail="Village not found")
    return village

@router.get("/{village_id}/alerts")
def get_village_alerts(village_id: int, db: Session = Depends(get_db)):
    alerts = db.query(Alert).filter(
        Alert.village_id == village_id,
        Alert.is_active == True
    ).all()
    return alerts
