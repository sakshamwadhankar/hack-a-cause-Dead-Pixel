import httpx
import time

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

def fetch_villages_for_district(district_name, state_name, max_villages=15):
    """Fetch real villages from OpenStreetMap for a district"""
    query = f"""
    [out:json][timeout:30];
    area["name"="{district_name}"]["admin_level"~"5|6"];
    node["place"~"village|town|hamlet"](area);
    out body {max_villages};
    """
    
    try:
        response = httpx.post(
            OVERPASS_URL,
            data={"data": query},
            timeout=30
        )
        data = response.json()
        
        villages = []
        for element in data.get("elements", []):
            tags = element.get("tags", {})
            name = tags.get("name")
            lat = element.get("lat")
            lng = element.get("lon")
            population = tags.get("population", 0)
            
            if name and lat and lng:
                villages.append({
                    "name": name,
                    "district": district_name,
                    "state": state_name,
                    "latitude": float(lat),
                    "longitude": float(lng),
                    "population": int(population) if population else 25000,
                    "region": state_name
                })
        
        print(f"Found {len(villages)} real villages in {district_name}")
        return villages[:max_villages]
        
    except Exception as e:
        print(f"OSM fetch error: {e}")
        return []

def fetch_villages_by_coordinates(district_name, state_name, center_lat, center_lng, max_villages=15):
    """Fallback using bounding box around coordinates"""
    delta = 0.4
    query = f"""
    [out:json][timeout:30];
    node["place"~"village|town"]
    ({center_lat-delta},{center_lng-delta},{center_lat+delta},{center_lng+delta});
    out body {max_villages};
    """
    
    try:
        response = httpx.post(
            OVERPASS_URL,
            data={"data": query},
            timeout=30
        )
        data = response.json()
        
        villages = []
        for element in data.get("elements", []):
            tags = element.get("tags", {})
            name = tags.get("name")
            lat = element.get("lat")
            lng = element.get("lon")
            
            if name and lat and lng:
                villages.append({
                    "name": name,
                    "district": district_name,
                    "state": state_name,
                    "latitude": float(lat),
                    "longitude": float(lng),
                    "population": int(tags.get("population", 25000)),
                    "region": state_name
                })
        
        print(f"Fallback found {len(villages)} villages near {district_name}")
        return villages[:max_villages]
        
    except Exception as e:
        print(f"Fallback fetch error: {e}")
        return []
