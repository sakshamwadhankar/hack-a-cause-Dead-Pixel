from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Village, Tanker, TankerRequest, Alert, TankerAssignment
from datetime import datetime, timedelta
import random
from wsi_calculator import calculate_wsi

Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    
    db.query(TankerAssignment).delete()
    db.query(Alert).delete()
    db.query(TankerRequest).delete()
    db.query(Tanker).delete()
    db.query(Village).delete()
    db.commit()
    
    marathwada_villages = [
        {"name": "Udgir", "district": "Latur", "region": "marathwada", "pop": 45000, "lat": 18.3967, "lng": 77.1131, 
         "rainfall_current": 180, "rainfall_normal": 340, "groundwater_current": 8.5, 
         "groundwater_last_year": 5.2, "days_without_water": 4},
        {"name": "Nilanga", "district": "Latur", "region": "marathwada", "pop": 32000, "lat": 17.7500, "lng": 76.7500,
         "rainfall_current": 210, "rainfall_normal": 340, "groundwater_current": 7.2,
         "groundwater_last_year": 6.1, "days_without_water": 2},
        {"name": "Ausa", "district": "Latur", "region": "marathwada", "pop": 28000, "lat": 18.2500, "lng": 76.5167,
         "rainfall_current": 150, "rainfall_normal": 340, "groundwater_current": 9.8,
         "groundwater_last_year": 6.8, "days_without_water": 6},
        {"name": "Osmanabad", "district": "Osmanabad", "region": "marathwada", "pop": 55000, "lat": 18.1667, "lng": 76.0333,
         "rainfall_current": 195, "rainfall_normal": 360, "groundwater_current": 6.5,
         "groundwater_last_year": 5.0, "days_without_water": 1},
        {"name": "Tuljapur", "district": "Osmanabad", "region": "marathwada", "pop": 38000, "lat": 17.9833, "lng": 75.9167,
         "rainfall_current": 120, "rainfall_normal": 360, "groundwater_current": 11.2,
         "groundwater_last_year": 7.5, "days_without_water": 9},
        {"name": "Paranda", "district": "Osmanabad", "region": "marathwada", "pop": 21000, "lat": 18.2667, "lng": 75.6167,
         "rainfall_current": 90, "rainfall_normal": 360, "groundwater_current": 13.5,
         "groundwater_last_year": 8.2, "days_without_water": 12},
        {"name": "Beed", "district": "Beed", "region": "marathwada", "pop": 62000, "lat": 18.9833, "lng": 75.7500,
         "rainfall_current": 220, "rainfall_normal": 380, "groundwater_current": 5.8,
         "groundwater_last_year": 4.9, "days_without_water": 0},
        {"name": "Ambejogai", "district": "Beed", "region": "marathwada", "pop": 41000, "lat": 18.7333, "lng": 76.3833,
         "rainfall_current": 175, "rainfall_normal": 380, "groundwater_current": 7.9,
         "groundwater_last_year": 6.2, "days_without_water": 3},
        {"name": "Kaij", "district": "Beed", "region": "marathwada", "pop": 19000, "lat": 18.8500, "lng": 76.0167,
         "rainfall_current": 100, "rainfall_normal": 380, "groundwater_current": 12.1,
         "groundwater_last_year": 8.9, "days_without_water": 8},
        {"name": "Nanded", "district": "Nanded", "region": "marathwada", "pop": 78000, "lat": 19.1500, "lng": 77.3167,
         "rainfall_current": 230, "rainfall_normal": 370, "groundwater_current": 4.5,
         "groundwater_last_year": 4.1, "days_without_water": 0},
        {"name": "Mukhed", "district": "Nanded", "region": "marathwada", "pop": 26000, "lat": 17.7167, "lng": 77.6667,
         "rainfall_current": 145, "rainfall_normal": 370, "groundwater_current": 10.3,
         "groundwater_last_year": 7.1, "days_without_water": 5},
        {"name": "Biloli", "district": "Nanded", "region": "marathwada", "pop": 31000, "lat": 18.2000, "lng": 77.7333,
         "rainfall_current": 168, "rainfall_normal": 370, "groundwater_current": 8.8,
         "groundwater_last_year": 6.5, "days_without_water": 3},
        {"name": "Deoni", "district": "Latur", "region": "marathwada", "pop": 17000, "lat": 17.9667, "lng": 76.8833,
         "rainfall_current": 80, "rainfall_normal": 340, "groundwater_current": 14.2,
         "groundwater_last_year": 9.1, "days_without_water": 15},
        {"name": "Washi", "district": "Osmanabad", "region": "marathwada", "pop": 23000, "lat": 18.3667, "lng": 76.2167,
         "rainfall_current": 110, "rainfall_normal": 360, "groundwater_current": 12.8,
         "groundwater_last_year": 8.4, "days_without_water": 10},
        {"name": "Jintur", "district": "Parbhani", "region": "marathwada", "pop": 35000, "lat": 19.6000, "lng": 76.6833,
         "rainfall_current": 190, "rainfall_normal": 390, "groundwater_current": 7.1,
         "groundwater_last_year": 5.8, "days_without_water": 2},
    ]
    
    nagpur_villages = [
        {"name": "Nagpur City", "district": "Nagpur", "region": "nagpur", "pop": 2405665, "lat": 21.1458, "lng": 79.0882,
         "rainfall_current": 420, "rainfall_normal": 1034, "groundwater_current": 6.2,
         "groundwater_last_year": 5.1, "days_without_water": 0},
        {"name": "Kamptee", "district": "Nagpur", "region": "nagpur", "pop": 95000, "lat": 21.2167, "lng": 79.1833,
         "rainfall_current": 380, "rainfall_normal": 1034, "groundwater_current": 7.8,
         "groundwater_last_year": 5.9, "days_without_water": 1},
        {"name": "Hingna", "district": "Nagpur", "region": "nagpur", "pop": 72000, "lat": 21.0833, "lng": 78.9167,
         "rainfall_current": 290, "rainfall_normal": 1034, "groundwater_current": 9.5,
         "groundwater_last_year": 6.8, "days_without_water": 3},
        {"name": "Katol", "district": "Nagpur", "region": "nagpur", "pop": 41000, "lat": 21.2667, "lng": 78.5833,
         "rainfall_current": 210, "rainfall_normal": 1034, "groundwater_current": 12.3,
         "groundwater_last_year": 7.2, "days_without_water": 7},
        {"name": "Saoner", "district": "Nagpur", "region": "nagpur", "pop": 35000, "lat": 21.3833, "lng": 78.9167,
         "rainfall_current": 180, "rainfall_normal": 1034, "groundwater_current": 13.8,
         "groundwater_last_year": 8.1, "days_without_water": 9},
        {"name": "Ramtek", "district": "Nagpur", "region": "nagpur", "pop": 52000, "lat": 21.3833, "lng": 79.3167,
         "rainfall_current": 350, "rainfall_normal": 1034, "groundwater_current": 8.1,
         "groundwater_last_year": 6.2, "days_without_water": 2},
        {"name": "Parseoni", "district": "Nagpur", "region": "nagpur", "pop": 28000, "lat": 21.3333, "lng": 79.1000,
         "rainfall_current": 160, "rainfall_normal": 1034, "groundwater_current": 14.5,
         "groundwater_last_year": 9.3, "days_without_water": 11},
        {"name": "Narkhed", "district": "Nagpur", "region": "nagpur", "pop": 31000, "lat": 21.4500, "lng": 78.5833,
         "rainfall_current": 140, "rainfall_normal": 1034, "groundwater_current": 15.2,
         "groundwater_last_year": 9.8, "days_without_water": 13},
        {"name": "Kalmeshwar", "district": "Nagpur", "region": "nagpur", "pop": 26000, "lat": 21.2167, "lng": 78.8167,
         "rainfall_current": 200, "rainfall_normal": 1034, "groundwater_current": 11.7,
         "groundwater_last_year": 7.5, "days_without_water": 5},
        {"name": "Mauda", "district": "Nagpur", "region": "nagpur", "pop": 22000, "lat": 21.2500, "lng": 79.6500,
         "rainfall_current": 390, "rainfall_normal": 1034, "groundwater_current": 7.2,
         "groundwater_last_year": 5.8, "days_without_water": 1},
        {"name": "Umred", "district": "Nagpur", "region": "nagpur", "pop": 44000, "lat": 20.8500, "lng": 79.3167,
         "rainfall_current": 310, "rainfall_normal": 1034, "groundwater_current": 8.9,
         "groundwater_last_year": 6.4, "days_without_water": 2},
        {"name": "Bhiwapur", "district": "Nagpur", "region": "nagpur", "pop": 19000, "lat": 20.7667, "lng": 79.6500,
         "rainfall_current": 170, "rainfall_normal": 1034, "groundwater_current": 13.1,
         "groundwater_last_year": 8.7, "days_without_water": 8},
        {"name": "Kuhi", "district": "Nagpur", "region": "nagpur", "pop": 17000, "lat": 20.8833, "lng": 79.5333,
         "rainfall_current": 145, "rainfall_normal": 1034, "groundwater_current": 14.8,
         "groundwater_last_year": 9.5, "days_without_water": 12},
        {"name": "Mouda", "district": "Nagpur", "region": "nagpur", "pop": 33000, "lat": 21.2667, "lng": 79.6167,
         "rainfall_current": 360, "rainfall_normal": 1034, "groundwater_current": 7.5,
         "groundwater_last_year": 5.9, "days_without_water": 1},
        {"name": "Wardha Road Village", "district": "Nagpur", "region": "nagpur", "pop": 29000, "lat": 21.0500, "lng": 79.2000,
         "rainfall_current": 250, "rainfall_normal": 1034, "groundwater_current": 10.2,
         "groundwater_last_year": 7.1, "days_without_water": 4},
    ]
    
    all_villages = marathwada_villages + nagpur_villages
    villages = []
    for v in all_villages:
        village = Village(
            name=v["name"],
            district=v["district"],
            region=v["region"],
            latitude=v["lat"],
            longitude=v["lng"],
            population=v["pop"],
            rainfall_current=v["rainfall_current"],
            rainfall_normal=v["rainfall_normal"],
            groundwater_current=v["groundwater_current"],
            groundwater_last_year=v["groundwater_last_year"],
            days_without_water=v["days_without_water"]
        )
        
        wsi, stress_level = calculate_wsi(village)
        village.water_stress_index = wsi
        village.stress_level = stress_level
        
        db.add(village)
        villages.append(village)
    
    db.commit()
    
    tankers_data = [
        {"vehicle": "TN-LAT-001", "driver": "Ramesh Patil", "phone": "9876543210", "capacity": 10000, "lat": 18.4088, "lng": 76.5604, "region": "marathwada", "status": "available"},
        {"vehicle": "TN-LAT-002", "driver": "Suresh Jadhav", "phone": "9765432109", "capacity": 8000, "lat": 17.7500, "lng": 76.7500, "region": "marathwada", "status": "available"},
        {"vehicle": "TN-OSM-001", "driver": "Vijay Shinde", "phone": "9654321098", "capacity": 12000, "lat": 18.1667, "lng": 76.0333, "region": "marathwada", "status": "available"},
        {"vehicle": "TN-BED-001", "driver": "Anil Deshmukh", "phone": "9543210987", "capacity": 10000, "lat": 18.9833, "lng": 75.7500, "region": "marathwada", "status": "available"},
        {"vehicle": "TN-NAN-001", "driver": "Pradeep More", "phone": "9432109876", "capacity": 9000, "lat": 19.1500, "lng": 77.3167, "region": "marathwada", "status": "available"},
        {"vehicle": "TN-NGP-001", "driver": "Ravi Thakur", "phone": "9321098765", "capacity": 11000, "lat": 21.1458, "lng": 79.0882, "region": "nagpur", "status": "available"},
        {"vehicle": "TN-NGP-002", "driver": "Sunil Wankhede", "phone": "9210987654", "capacity": 9500, "lat": 21.2167, "lng": 79.1833, "region": "nagpur", "status": "available"},
        {"vehicle": "TN-NGP-003", "driver": "Ajay Meshram", "phone": "9109876543", "capacity": 10500, "lat": 21.3833, "lng": 79.3167, "region": "nagpur", "status": "available"},
    ]
    
    for t in tankers_data:
        tanker = Tanker(
            vehicle_number=t["vehicle"],
            driver_name=t["driver"],
            driver_phone=t["phone"],
            capacity_liters=t["capacity"],
            current_location_lat=t["lat"],
            current_location_lng=t["lng"],
            region=t["region"],
            status=t["status"]
        )
        db.add(tanker)
    
    db.commit()
    
    critical_villages = [v for v in villages if v.stress_level in ["critical", "high"]]
    for village in critical_villages[:3]:
        request = TankerRequest(
            village_id=village.id,
            priority="high" if village.stress_level == "critical" else "medium",
            status="pending",
            requested_at=datetime.utcnow() - timedelta(hours=random.randint(1, 12))
        )
        db.add(request)
    
    db.commit()
    
    for village in critical_villages:
        alert = Alert(
            village_id=village.id,
            alert_type="drought_warning",
            severity="high" if village.stress_level == "critical" else "medium",
            message=f"Water stress index {village.water_stress_index} in {village.name}. Immediate action required.",
            created_at=datetime.utcnow() - timedelta(hours=random.randint(1, 24)),
            is_active=True
        )
        db.add(alert)
    
    db.commit()
    db.close()
    
    print("Database seeded successfully with 30 villages (15 Marathwada + 15 Nagpur)!")

if __name__ == "__main__":
    seed_database()
