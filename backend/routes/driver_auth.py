from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from database import get_db
from models import Driver, DriverOTP, DriverSession, TankerAssignment, Tanker, Village
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional
import string
from otp_service import generate_otp, send_otp_sms, validate_phone_number
from dotenv import load_dotenv
import os

load_dotenv()
DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() == "true"

router = APIRouter(prefix="/driver", tags=["Driver Auth"])

class SendOTPRequest(BaseModel):
    phone: str

class VerifyOTPRequest(BaseModel):
    phone: str
    otp: str

class MarkDeliveredRequest(BaseModel):
    assignment_id: int
    liters_delivered: int
    notes: Optional[str] = None
    delivery_lat: Optional[float] = None
    delivery_lng: Optional[float] = None

def get_driver_from_token(token: str, db: Session):
    """Validate token and return driver"""
    session = db.query(DriverSession).filter(
        DriverSession.token == token,
        DriverSession.is_active == True,
        DriverSession.expires_at > datetime.utcnow()
    ).first()
    
    if not session:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    driver = db.query(Driver).filter(Driver.id == session.driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    return driver

@router.post("/send-otp")
def send_otp(request: SendOTPRequest, db: Session = Depends(get_db)):
    """Send OTP to driver's phone via Twilio SMS"""
    # Validate phone number format
    if not validate_phone_number(request.phone):
        raise HTTPException(
            status_code=400,
            detail="Invalid phone number. Must be 10 digits starting with 6-9"
        )
    
    # Check if driver exists
    driver = db.query(Driver).filter(Driver.phone == request.phone).first()
    
    if not driver:
        raise HTTPException(
            status_code=404,
            detail="Driver not registered. Contact your district office."
        )
    
    # Generate OTP
    otp = generate_otp()
    
    # Send OTP via Twilio
    sms_result = send_otp_sms(request.phone, otp, driver.name)
    
    # Save OTP to database
    driver_otp = DriverOTP(
        phone=request.phone,
        otp=otp,
        expires_at=datetime.utcnow() + timedelta(minutes=10),
        is_used=False
    )
    db.add(driver_otp)
    db.commit()
    
    response = {
        "message": sms_result.get("message", "OTP sent successfully"),
        "expires_in": "10 minutes",
        "driver_name": driver.name,
        "mode": sms_result.get("mode", "unknown")
    }
    
    # Only include OTP in response if DEMO_MODE is enabled
    if DEMO_MODE or sms_result.get("mode") == "fallback":
        response["demo_otp"] = otp
        response["demo_note"] = "OTP shown for demo/testing only"
    
    return response

@router.post("/verify-otp")
def verify_otp(request: VerifyOTPRequest, db: Session = Depends(get_db)):
    """Verify OTP and create session"""
    # Find latest unused OTP for this phone
    otp_record = db.query(DriverOTP).filter(
        DriverOTP.phone == request.phone,
        DriverOTP.is_used == False,
        DriverOTP.expires_at > datetime.utcnow()
    ).order_by(DriverOTP.created_at.desc()).first()
    
    if not otp_record:
        raise HTTPException(status_code=401, detail="OTP expired or not found")
    
    # Check if OTP matches
    if otp_record.otp != request.otp:
        raise HTTPException(status_code=401, detail="Invalid OTP")
    
    # Mark OTP as used
    otp_record.is_used = True
    
    # Get driver
    driver = db.query(Driver).filter(Driver.phone == request.phone).first()
    
    # Generate session token
    token = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
    
    # Create session
    session = DriverSession(
        driver_id=driver.id,
        token=token,
        expires_at=datetime.utcnow() + timedelta(hours=12),
        is_active=True
    )
    db.add(session)
    db.commit()
    
    return {
        "success": True,
        "token": token,
        "driver": {
            "id": driver.id,
            "name": driver.name,
            "phone": driver.phone,
            "vehicle_number": driver.vehicle_number,
            "district": driver.district
        }
    }

@router.get("/my-assignments")
def get_my_assignments(authorization: str = Header(None), db: Session = Depends(get_db)):
    """Get driver's active assignments"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    driver = get_driver_from_token(token, db)
    
    # Find assignments for this driver's vehicle
    assignments = db.query(TankerAssignment).join(Tanker).filter(
        Tanker.vehicle_number == driver.vehicle_number,
        TankerAssignment.status.in_(["pending", "in_transit"])
    ).all()
    
    result = []
    for assignment in assignments:
        village = assignment.village
        tanker = assignment.tanker
        
        result.append({
            "assignment_id": assignment.id,
            "status": assignment.status,
            "priority_score": assignment.priority_score,
            "estimated_arrival_minutes": assignment.estimated_arrival_minutes,
            "village": {
                "id": village.id,
                "name": village.name,
                "district": village.district,
                "latitude": village.latitude,
                "longitude": village.longitude,
                "population": village.population,
                "days_without_water": village.days_without_water,
                "wsi_score": village.water_stress_index,
                "stress_level": village.stress_level
            },
            "tanker": {
                "vehicle_number": tanker.vehicle_number,
                "capacity_liters": tanker.capacity_liters
            },
            "assigned_at": assignment.assigned_at.isoformat(),
            "google_maps_link": f"https://maps.google.com/?q={village.latitude},{village.longitude}"
        })
    
    return result

@router.post("/mark-delivered")
def mark_delivered(
    request: MarkDeliveredRequest,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """Mark delivery as completed"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    driver = get_driver_from_token(token, db)
    
    # Find assignment
    assignment = db.query(TankerAssignment).filter(
        TankerAssignment.id == request.assignment_id
    ).first()
    
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    # Verify assignment belongs to this driver
    tanker = db.query(Tanker).filter(Tanker.id == assignment.tanker_id).first()
    if tanker.vehicle_number != driver.vehicle_number:
        raise HTTPException(status_code=403, detail="This assignment doesn't belong to you")
    
    # Update assignment
    assignment.status = "delivered"
    assignment.delivered_at = datetime.utcnow()
    assignment.liters_delivered = request.liters_delivered
    assignment.notes = request.notes
    
    # Update village
    village = assignment.village
    village.days_without_water = 0
    village.last_tanker_date = datetime.utcnow().date()
    
    # Recalculate WSI
    from wsi_calculator import calculate_wsi
    wsi, stress_level = calculate_wsi(village)
    village.water_stress_index = wsi
    village.stress_level = stress_level
    
    # Update tanker status
    tanker.status = "available"
    
    db.commit()
    
    return {
        "success": True,
        "message": "Delivery confirmed!",
        "village": village.name,
        "delivered_at": assignment.delivered_at.isoformat()
    }

@router.post("/logout")
def logout(authorization: str = Header(None), db: Session = Depends(get_db)):
    """Logout driver"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    
    # Mark session as inactive
    session = db.query(DriverSession).filter(DriverSession.token == token).first()
    if session:
        session.is_active = False
        db.commit()
    
    return {"success": True, "message": "Logged out successfully"}

@router.get("/profile")
def get_profile(authorization: str = Header(None), db: Session = Depends(get_db)):
    """Get driver profile"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    driver = get_driver_from_token(token, db)
    
    # Count completed deliveries today
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    completed_today = db.query(TankerAssignment).join(Tanker).filter(
        Tanker.vehicle_number == driver.vehicle_number,
        TankerAssignment.status == "delivered",
        TankerAssignment.delivered_at >= today_start
    ).count()
    
    return {
        "id": driver.id,
        "name": driver.name,
        "phone": driver.phone,
        "vehicle_number": driver.vehicle_number,
        "district": driver.district,
        "is_active": driver.is_active,
        "deliveries_today": completed_today
    }
