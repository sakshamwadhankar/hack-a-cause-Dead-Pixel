import math
from sqlalchemy.orm import Session
from models import Village, Tanker, TankerAssignment
from wsi_calculator import calculate_wsi
from datetime import datetime

def calculate_distance_km(lat1, lng1, lat2, lng2):
    R = 6371
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lng = math.radians(lng2 - lng1)
    
    a = math.sin(delta_lat / 2) ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lng / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    distance = R * c
    return distance

def calculate_estimated_time(distance_km):
    average_speed_kmh = 40
    time_hours = distance_km / average_speed_kmh
    time_minutes = int(time_hours * 60)
    return time_minutes

def get_priority_score(village, tanker):
    wsi, _ = calculate_wsi(village)
    
    population_factor = min(100, village.population / 1000)
    
    distance_km = calculate_distance_km(
        tanker.current_location_lat,
        tanker.current_location_lng,
        village.latitude,
        village.longitude
    )
    distance_factor = max(0, 100 - distance_km * 2)
    
    priority = (wsi * 0.6) + (population_factor * 0.2) + (distance_factor * 0.2)
    
    return round(priority, 2)

def auto_allocate_tankers(db: Session):
    available_tankers = db.query(Tanker).filter(Tanker.status == "available").all()
    
    if not available_tankers:
        return {
            "assignments_created": 0,
            "villages_covered": [],
            "tankers_dispatched": [],
            "message": "No available tankers"
        }
    
    all_villages = db.query(Village).all()
    for village in all_villages:
        wsi, stress_level = calculate_wsi(village)
        village.water_stress_index = wsi
        village.stress_level = stress_level
    db.commit()
    
    critical_villages = [v for v in all_villages if v.stress_level in ["critical", "high"]]
    
    assigned_village_ids = db.query(TankerAssignment.village_id).filter(
        TankerAssignment.status.in_(["pending", "in_transit"])
    ).all()
    assigned_village_ids = [v[0] for v in assigned_village_ids]
    
    villages_needing_tankers = [v for v in critical_villages if v.id not in assigned_village_ids]
    villages_needing_tankers.sort(key=lambda v: v.water_stress_index, reverse=True)
    
    assignments_created = []
    villages_covered = []
    tankers_dispatched = []
    
    for village in villages_needing_tankers:
        if not available_tankers:
            break
        
        best_tanker = None
        best_score = -1
        
        for tanker in available_tankers:
            score = get_priority_score(village, tanker)
            if score > best_score:
                best_score = score
                best_tanker = tanker
        
        if best_tanker:
            distance_km = calculate_distance_km(
                best_tanker.current_location_lat,
                best_tanker.current_location_lng,
                village.latitude,
                village.longitude
            )
            estimated_time = calculate_estimated_time(distance_km)
            
            assignment = TankerAssignment(
                tanker_id=best_tanker.id,
                village_id=village.id,
                status="pending",
                priority_score=best_score,
                estimated_arrival_minutes=estimated_time
            )
            db.add(assignment)
            
            best_tanker.status = "dispatched"
            best_tanker.current_village_id = village.id
            best_tanker.last_updated = datetime.utcnow()
            
            assignments_created.append(assignment)
            villages_covered.append(village.name)
            tankers_dispatched.append(best_tanker.vehicle_number)
            
            available_tankers.remove(best_tanker)
    
    db.commit()
    
    return {
        "assignments_created": len(assignments_created),
        "villages_covered": villages_covered,
        "tankers_dispatched": tankers_dispatched
    }

def get_optimized_route(tanker_id: int, db: Session):
    assignments = db.query(TankerAssignment).filter(
        TankerAssignment.tanker_id == tanker_id,
        TankerAssignment.status.in_(["pending", "in_transit"])
    ).all()
    
    assignments.sort(key=lambda a: a.priority_score, reverse=True)
    
    route = []
    for assignment in assignments:
        village = db.query(Village).filter(Village.id == assignment.village_id).first()
        if village:
            route.append({
                "assignment_id": assignment.id,
                "village_name": village.name,
                "village_id": village.id,
                "latitude": village.latitude,
                "longitude": village.longitude,
                "priority_score": assignment.priority_score,
                "estimated_arrival_minutes": assignment.estimated_arrival_minutes,
                "status": assignment.status
            })
    
    return route
