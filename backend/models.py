from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Village(Base):
    __tablename__ = "villages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    district = Column(String)
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
    capacity = Column(Integer)
    current_location_lat = Column(Float)
    current_location_lng = Column(Float)
    status = Column(String)
    assigned_village_id = Column(Integer, ForeignKey("villages.id"), nullable=True)
    assigned_village = relationship("Village")

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
