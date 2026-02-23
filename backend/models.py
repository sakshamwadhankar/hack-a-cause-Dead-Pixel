from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Village(Base):
    __tablename__ = "villages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    district = Column(String)
    region = Column(String, index=True)
    population = Column(Integer)
    latitude = Column(Float)
    longitude = Column(Float)
    rainfall_current = Column(Float)
    rainfall_normal = Column(Float)
    groundwater_current = Column(Float)
    groundwater_last_year = Column(Float)
    water_stress_index = Column(Float)
    stress_level = Column(String)
    last_tanker_date = Column(Date, nullable=True)
    days_without_water = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    tanker_requests = relationship("TankerRequest", back_populates="village")

class Tanker(Base):
    __tablename__ = "tankers"
    
    id = Column(Integer, primary_key=True, index=True)
    vehicle_number = Column(String, unique=True, index=True)
    driver_name = Column(String)
    driver_phone = Column(String)
    capacity_liters = Column(Integer)
    current_location_lat = Column(Float)
    current_location_lng = Column(Float)
    current_village_id = Column(Integer, ForeignKey("villages.id"), nullable=True)
    region = Column(String, index=True)
    status = Column(String)
    last_updated = Column(DateTime, default=datetime.utcnow)
    current_village = relationship("Village")
    assignments = relationship("TankerAssignment", back_populates="tanker")

class TankerRequest(Base):
    __tablename__ = "tanker_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    village_id = Column(Integer, ForeignKey("villages.id"))
    village = relationship("Village", back_populates="tanker_requests")
    requested_at = Column(DateTime, default=datetime.utcnow)
    priority = Column(String)
    status = Column(String)
    assigned_tanker_id = Column(Integer, ForeignKey("tankers.id"), nullable=True)
    assigned_tanker = relationship("Tanker")
    fulfilled_at = Column(DateTime, nullable=True)

class TankerAssignment(Base):
    __tablename__ = "tanker_assignments"
    
    id = Column(Integer, primary_key=True, index=True)
    tanker_id = Column(Integer, ForeignKey("tankers.id"))
    village_id = Column(Integer, ForeignKey("villages.id"))
    assigned_at = Column(DateTime, default=datetime.utcnow)
    delivered_at = Column(DateTime, nullable=True)
    status = Column(String)
    priority_score = Column(Float)
    estimated_arrival_minutes = Column(Integer)
    liters_delivered = Column(Integer, nullable=True)
    notes = Column(String, nullable=True)
    tanker = relationship("Tanker", back_populates="assignments")
    village = relationship("Village")

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    village_id = Column(Integer, ForeignKey("villages.id"))
    village = relationship("Village")
    alert_type = Column(String)
    severity = Column(String)
    message = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

class Driver(Base):
    __tablename__ = "drivers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, nullable=False, index=True)
    vehicle_number = Column(String)
    district = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class DriverOTP(Base):
    __tablename__ = "driver_otps"
    
    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String, nullable=False, index=True)
    otp = Column(String, nullable=False)
    expires_at = Column(DateTime)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class DriverSession(Base):
    __tablename__ = "driver_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"))
    token = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)
    is_active = Column(Boolean, default=True)
    driver = relationship("Driver")
