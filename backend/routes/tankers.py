from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Tanker, TankerRequest, Village
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/tankers", tags=["tankers"])

class TankerResponse(BaseModel):
    id: int
    vehicle_number: str
    driver_name: str
    driver_phone: str
    capacity: int
    current_location_lat: float
    current_location_lng: float
    status: str
    assigned_village_id: Optional[int] = None
    
    class Config:
        from_attributes = True

class TankerRequestCreate(BaseModel):
    village_id: int
    priority: str

class TankerAssignment(BaseModel):
    tanker_id: int
    request_id: int

@router.get("/", response_model=List[TankerResponse])
def get_tankers(db: Session = Depends(get_db)):
    tankers = db.query(Tanker).all()
    return tankers

@router.get("/requests")
def get_tanker_requests(db: Session = Depends(get_db)):
    requests = db.query(TankerRequest).filter(
        TankerRequest.status.in_(["pending", "assigned"])
    ).all()
    return requests

@router.post("/requests")
def create_tanker_request(request: TankerRequestCreate, db: Session = Depends(get_db)):
    village = db.query(Village).filter(Village.id == request.village_id).first()
    if not village:
        raise HTTPException(status_code=404, detail="Village not found")
    
    new_request = TankerRequest(
        village_id=request.village_id,
        priority=request.priority,
        status="pending"
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

@router.post("/assign")
def assign_tanker(assignment: TankerAssignment, db: Session = Depends(get_db)):
    tanker = db.query(Tanker).filter(Tanker.id == assignment.tanker_id).first()
    request = db.query(TankerRequest).filter(TankerRequest.id == assignment.request_id).first()
    
    if not tanker or not request:
        raise HTTPException(status_code=404, detail="Tanker or request not found")
    
    tanker.status = "assigned"
    tanker.assigned_village_id = request.village_id
    request.status = "assigned"
    request.assigned_tanker_id = tanker.id
    
    db.commit()
    return {"message": "Tanker assigned successfully"}

@router.put("/{tanker_id}/complete")
def complete_delivery(tanker_id: int, db: Session = Depends(get_db)):
    tanker = db.query(Tanker).filter(Tanker.id == tanker_id).first()
    if not tanker:
        raise HTTPException(status_code=404, detail="Tanker not found")
    
    request = db.query(TankerRequest).filter(
        TankerRequest.assigned_tanker_id == tanker_id,
        TankerRequest.status == "assigned"
    ).first()
    
    if request:
        request.status = "completed"
        request.fulfilled_at = datetime.utcnow()
    
    tanker.status = "available"
    tanker.assigned_village_id = None
    
    db.commit()
    return {"message": "Delivery completed successfully"}
