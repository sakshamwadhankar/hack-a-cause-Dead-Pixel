from sqlalchemy.orm import Session
from models import Village

def calculate_wsi(village):
    rainfall_deficit = max(0, village.rainfall_normal - village.rainfall_current)
    rainfall_score = min(100, (rainfall_deficit / village.rainfall_normal) * 100)
    
    gw_drop = max(0, village.groundwater_current - village.groundwater_last_year)
    gw_score = min(100, (gw_drop / village.groundwater_last_year) * 100)
    
    days_score = min(100, village.days_without_water * 6.67)
    
    wsi = (rainfall_score * 0.40) + (gw_score * 0.40) + (days_score * 0.20)
    
    if wsi >= 70:
        stress_level = "critical"
    elif wsi >= 50:
        stress_level = "high"
    elif wsi >= 30:
        stress_level = "moderate"
    else:
        stress_level = "safe"
    
    return round(wsi, 2), stress_level

def get_priority_villages(db: Session):
    villages = db.query(Village).all()
    for village in villages:
        wsi, stress_level = calculate_wsi(village)
        village.water_stress_index = wsi
        village.stress_level = stress_level
    
    db.commit()
    
    return sorted(villages, key=lambda v: v.water_stress_index, reverse=True)
