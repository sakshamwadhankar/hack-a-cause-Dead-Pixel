from database import SessionLocal
from allocation_engine import auto_allocate_tankers, calculate_distance_km
from models import Village, Tanker

db = SessionLocal()

print("Testing allocation engine...")
print("\n1. Testing distance calculation:")
lat1, lng1 = 18.3967, 77.1131
lat2, lng2 = 17.7500, 76.7500
distance = calculate_distance_km(lat1, lng1, lat2, lng2)
print(f"Distance between Udgir and Nilanga: {distance:.2f} km")

print("\n2. Available tankers:")
tankers = db.query(Tanker).filter(Tanker.status == "available").all()
for t in tankers:
    print(f"  - {t.vehicle_number}: {t.driver_name} ({t.capacity_liters}L)")

print("\n3. Critical villages:")
villages = db.query(Village).filter(Village.stress_level.in_(["critical", "high"])).all()
for v in villages:
    print(f"  - {v.name}: WSI={v.water_stress_index}, Days without water={v.days_without_water}")

print("\n4. Running auto-allocation...")
result = auto_allocate_tankers(db)
print(f"Assignments created: {result['assignments_created']}")
print(f"Villages covered: {', '.join(result['villages_covered'])}")
print(f"Tankers dispatched: {', '.join(result['tankers_dispatched'])}")

db.close()
print("\n✅ Allocation engine test complete!")
