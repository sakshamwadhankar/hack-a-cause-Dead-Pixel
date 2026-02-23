from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Tanker, TankerRequest, Village, TankerAssignment
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
from allocation_engine import auto_allocate_tankers, get_optimized_route

router = APIRouter(prefix="/tankers", tags=["tankers"])

class TankerResponse(BaseModel):
    id: int
    vehicle_number: str
    driver_name: str
    driver_phone: str
    capacity_liters: int
    current_location_lat: float
    current_location_lng: float
    status: str
    current_village_id: Optional[int] = None
    
    class Config:
        from_attributes = True

class DeliveryRequest(BaseModel):
    village_id: int
    liters_delivered: int
    notes: Optional[str] = None

@router.get("/", response_model=List[TankerResponse])
def get_tankers(db: Session = Depends(get_db)):
    tankers = db.query(Tanker).all()
    return tankers

@router.get("/{tanker_id}", response_model=TankerResponse)
def get_tanker(tanker_id: int, db: Session = Depends(get_db)):
    tanker = db.query(Tanker).filter(Tanker.id == tanker_id).first()
    if not tanker:
        raise HTTPException(status_code=404, detail="Tanker not found")
    return tanker

@router.post("/allocate")
def allocate_tankers(db: Session = Depends(get_db)):
    result = auto_allocate_tankers(db)
    return result

@router.post("/{tanker_id}/deliver")
def deliver_water(tanker_id: int, delivery: DeliveryRequest, db: Session = Depends(get_db)):
    tanker = db.query(Tanker).filter(Tanker.id == tanker_id).first()
    if not tanker:
        raise HTTPException(status_code=404, detail="Tanker not found")
    
    assignment = db.query(TankerAssignment).filter(
        TankerAssignment.tanker_id == tanker_id,
        TankerAssignment.village_id == delivery.village_id,
        TankerAssignment.status.in_(["pending", "in_transit"])
    ).first()
    
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    assignment.status = "delivered"
    assignment.delivered_at = datetime.utcnow()
    assignment.liters_delivered = delivery.liters_delivered
    assignment.notes = delivery.notes
    
    village = db.query(Village).filter(Village.id == delivery.village_id).first()
    if village:
        village.last_tanker_date = date.today()
        village.days_without_water = 0
    
    tanker.status = "available"
    tanker.current_village_id = None
    tanker.last_updated = datetime.utcnow()
    
    db.commit()
    db.refresh(assignment)
    
    return {
        "message": "Delivery completed successfully",
        "assignment": {
            "id": assignment.id,
            "village_id": assignment.village_id,
            "liters_delivered": assignment.liters_delivered,
            "delivered_at": assignment.delivered_at
        }
    }

@router.get("/{tanker_id}/route")
def get_tanker_route(tanker_id: int, db: Session = Depends(get_db)):
    tanker = db.query(Tanker).filter(Tanker.id == tanker_id).first()
    if not tanker:
        raise HTTPException(status_code=404, detail="Tanker not found")
    
    route = get_optimized_route(tanker_id, db)
    return {
        "tanker_id": tanker_id,
        "vehicle_number": tanker.vehicle_number,
        "route": route
    }

@router.get("/assignments/all")
def get_all_assignments(db: Session = Depends(get_db)):
    assignments = db.query(TankerAssignment).all()
    result = []
    for assignment in assignments:
        village = db.query(Village).filter(Village.id == assignment.village_id).first()
        tanker = db.query(Tanker).filter(Tanker.id == assignment.tanker_id).first()
        result.append({
            "id": assignment.id,
            "tanker": {
                "id": tanker.id,
                "vehicle_number": tanker.vehicle_number,
                "driver_name": tanker.driver_name
            } if tanker else None,
            "village": {
                "id": village.id,
                "name": village.name,
                "district": village.district
            } if village else None,
            "status": assignment.status,
            "priority_score": assignment.priority_score,
            "estimated_arrival_minutes": assignment.estimated_arrival_minutes,
            "assigned_at": assignment.assigned_at,
            "delivered_at": assignment.delivered_at,
            "liters_delivered": assignment.liters_delivered
        })
    return result

@router.get("/assignments/active")
def get_active_assignments(db: Session = Depends(get_db)):
    assignments = db.query(TankerAssignment).filter(
        TankerAssignment.status.in_(["pending", "in_transit"])
    ).all()
    result = []
    for assignment in assignments:
        village = db.query(Village).filter(Village.id == assignment.village_id).first()
        tanker = db.query(Tanker).filter(Tanker.id == assignment.tanker_id).first()
        result.append({
            "id": assignment.id,
            "tanker": {
                "id": tanker.id,
                "vehicle_number": tanker.vehicle_number,
                "driver_name": tanker.driver_name
            } if tanker else None,
            "village": {
                "id": village.id,
                "name": village.name,
                "district": village.district,
                "water_stress_index": village.water_stress_index
            } if village else None,
            "status": assignment.status,
            "priority_score": assignment.priority_score,
            "estimated_arrival_minutes": assignment.estimated_arrival_minutes,
            "assigned_at": assignment.assigned_at
        })
    return result
