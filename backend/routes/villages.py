from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Village, Alert, TankerAssignment, Tanker
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from wsi_calculator import calculate_wsi

router = APIRouter(prefix="/villages", tags=["villages"])

class VillageResponse(BaseModel):
    id: int
    name: str
    district: str
    region: str
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

@router.get("/regions")
def get_regions(db: Session = Depends(get_db)):
    marathwada_count = db.query(Village).filter(Village.region == "marathwada").count()
    nagpur_count = db.query(Village).filter(Village.region == "nagpur").count()
    
    return [
        {
            "id": "marathwada",
            "name": "Marathwada Region",
            "districts": ["Latur", "Osmanabad", "Beed", "Nanded", "Parbhani"],
            "center_lat": 18.0,
            "center_lng": 76.5,
            "zoom": 8,
            "village_count": marathwada_count
        },
        {
            "id": "nagpur",
            "name": "Nagpur District",
            "districts": ["Nagpur"],
            "center_lat": 21.1458,
            "center_lng": 79.0882,
            "zoom": 10,
            "village_count": nagpur_count
        }
    ]

@router.get("/all-with-status")
def get_villages_with_status(region: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Village)
    if region:
        query = query.filter(Village.region == region)
    
    villages = query.all()
    assignments = db.query(TankerAssignment).filter(
        TankerAssignment.status.in_(["pending", "in_transit"])
    ).all()
    
    assignment_map = {a.village_id: a for a in assignments}
    
    result = []
    for village in villages:
        wsi, stress_level = calculate_wsi(village)
        village.water_stress_index = wsi
        village.stress_level = stress_level
        
        assignment = assignment_map.get(village.id)
        tanker = None
        if assignment:
            tanker = db.query(Tanker).filter(Tanker.id == assignment.tanker_id).first()
        
        result.append({
            "id": village.id,
            "name": village.name,
            "district": village.district,
            "region": village.region,
            "latitude": village.latitude,
            "longitude": village.longitude,
            "population": village.population,
            "rainfall_current": village.rainfall_current,
            "rainfall_normal": village.rainfall_normal,
            "groundwater_current": village.groundwater_current,
            "groundwater_last_year": village.groundwater_last_year,
            "water_stress_index": village.water_stress_index,
            "stress_level": village.stress_level,
            "days_without_water": village.days_without_water,
            "assigned": assignment is not None,
            "tanker_vehicle": tanker.vehicle_number if tanker else None
        })
    
    db.commit()
    return result

@router.get("/", response_model=List[VillageResponse])
def get_villages(region: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Village)
    if region:
        query = query.filter(Village.region == region)
    
    villages = query.all()
    for village in villages:
        wsi, stress_level = calculate_wsi(village)
        village.water_stress_index = wsi
        village.stress_level = stress_level
    db.commit()
    return villages

@router.get("/critical", response_model=List[VillageResponse])
def get_critical_villages(region: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Village)
    if region:
        query = query.filter(Village.region == region)
    
    villages = query.all()
    for village in villages:
        wsi, stress_level = calculate_wsi(village)
        village.water_stress_index = wsi
        village.stress_level = stress_level
    db.commit()
    
    critical_villages = [v for v in villages if v.stress_level in ["critical", "high"]]
    return sorted(critical_villages, key=lambda v: v.water_stress_index, reverse=True)

@router.get("/stats")
def get_village_stats(region: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Village)
    if region:
        query = query.filter(Village.region == region)
    
    villages = query.all()
    
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
