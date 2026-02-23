from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Village, Tanker, TankerRequest, Alert
from datetime import datetime, timedelta
import random

Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    
    db.query(Alert).delete()
    db.query(TankerRequest).delete()
    db.query(Tanker).delete()
    db.query(Village).delete()
    db.commit()
    
    villages_data = [
        {"name": "Shirpur", "lat": 21.3486, "lng": 74.8811, "pop": 5200, "water": 35, "risk": "high", "rain": 12},
        {"name": "Dhanora", "lat": 21.4123, "lng": 74.9234, "pop": 3800, "water": 58, "risk": "medium", "rain": 28},
        {"name": "Pimpalgaon", "lat": 21.2987, "lng": 74.8456, "pop": 4500, "water": 72, "risk": "low", "rain": 45},
        {"name": "Nandgaon", "lat": 21.3756, "lng": 74.7892, "pop": 6100, "water": 28, "risk": "high", "rain": 8},
        {"name": "Khamgaon", "lat": 21.4567, "lng": 74.9678, "pop": 3200, "water": 65, "risk": "medium", "rain": 35},
        {"name": "Borgaon", "lat": 21.3234, "lng": 74.8123, "pop": 2900, "water": 82, "risk": "low", "rain": 52},
        {"name": "Wadgaon", "lat": 21.3912, "lng": 74.8567, "pop": 4800, "water": 42, "risk": "medium", "rain": 22},
        {"name": "Savkheda", "lat": 21.4345, "lng": 74.9012, "pop": 5500, "water": 25, "risk": "high", "rain": 6},
    ]
    
    villages = []
    for v in villages_data:
        village = Village(
            name=v["name"],
            latitude=v["lat"],
            longitude=v["lng"],
            population=v["pop"],
            water_level=v["water"],
            drought_risk=v["risk"],
            last_rainfall=v["rain"]
        )
        db.add(village)
        villages.append(village)
    
    db.commit()
    
    tankers_data = [
        {"vehicle": "MH-15-AB-1234", "driver": "Rajesh Kumar", "phone": "+91-9876543210", "capacity": 10000, "lat": 21.3500, "lng": 74.8800, "status": "available"},
        {"vehicle": "MH-15-CD-5678", "driver": "Suresh Patil", "phone": "+91-9876543211", "capacity": 12000, "lat": 21.4000, "lng": 74.9000, "status": "available"},
        {"vehicle": "MH-15-EF-9012", "driver": "Mahesh Desai", "phone": "+91-9876543212", "capacity": 8000, "lat": 21.3200, "lng": 74.8500, "status": "available"},
        {"vehicle": "MH-15-GH-3456", "driver": "Ganesh Rao", "phone": "+91-9876543213", "capacity": 10000, "lat": 21.3800, "lng": 74.8900, "status": "assigned"},
        {"vehicle": "MH-15-IJ-7890", "driver": "Ramesh Shah", "phone": "+91-9876543214", "capacity": 15000, "lat": 21.4200, "lng": 74.9200, "status": "available"},
    ]
    
    for t in tankers_data:
        tanker = Tanker(
            vehicle_number=t["vehicle"],
            driver_name=t["driver"],
            driver_phone=t["phone"],
            capacity=t["capacity"],
            current_location_lat=t["lat"],
            current_location_lng=t["lng"],
            status=t["status"]
        )
        db.add(tanker)
    
    db.commit()
    
    high_risk_villages = [v for v in villages if v.drought_risk == "high"]
    for village in high_risk_villages[:2]:
        request = TankerRequest(
            village_id=village.id,
            priority="high",
            status="pending",
            requested_at=datetime.utcnow() - timedelta(hours=random.randint(1, 12))
        )
        db.add(request)
    
    db.commit()
    
    for village in high_risk_villages:
        alert = Alert(
            village_id=village.id,
            alert_type="drought_warning",
            severity="high",
            message=f"Critical water shortage in {village.name}. Immediate action required.",
            created_at=datetime.utcnow() - timedelta(hours=random.randint(1, 24)),
            is_active=True
        )
        db.add(alert)
    
    db.commit()
    db.close()
    
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()
