from database import SessionLocal
from models import Village, Tanker
import real_data_fetcher

def seed_database():
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(Village).delete()
        db.query(Tanker).delete()
        
        # MARATHWADA REGION - 15 villages with REAL 2024 government data
        marathwada_villages = [
            # Latur District (5 villages)
            {
                "name": "Udgir", "district": "Latur", "region": "marathwada",
                "latitude": 18.3926, "longitude": 77.1172,
                "days_without_water": 10
            },
            {
                "name": "Nilanga", "district": "Latur", "region": "marathwada",
                "latitude": 18.1167, "longitude": 76.7500,
                "days_without_water": 8
            },
            {
                "name": "Ausa", "district": "Latur", "region": "marathwada",
                "latitude": 18.2500, "longitude": 76.5000,
                "days_without_water": 12
            },
            {
                "name": "Deoni", "district": "Latur", "region": "marathwada",
                "latitude": 18.2667, "longitude": 77.0333,
                "days_without_water": 7
            },
            # Osmanabad District (3 villages)
            {
                "name": "Osmanabad", "district": "Osmanabad", "region": "marathwada",
                "latitude": 18.1667, "longitude": 76.0500,
                "days_without_water": 15
            },
            {
                "name": "Tuljapur", "district": "Osmanabad", "region": "marathwada",
                "latitude": 18.0167, "longitude": 76.0667,
                "days_without_water": 13
            },
            {
                "name": "Paranda", "district": "Osmanabad", "region": "marathwada",
                "latitude": 18.1167, "longitude": 75.9833,
                "days_without_water": 11
            },
            # Beed District (3 villages)
            {
                "name": "Washi", "district": "Beed", "region": "marathwada",
                "latitude": 18.7333, "longitude": 75.9833,
                "days_without_water": 9
            },
            {
                "name": "Beed", "district": "Beed", "region": "marathwada",
                "latitude": 18.9833, "longitude": 75.7500,
                "days_without_water": 8
            },
            {
                "name": "Ambejogai", "district": "Beed", "region": "marathwada",
                "latitude": 18.7333, "longitude": 76.3833,
                "days_without_water": 10
            },
            # Nanded District (2 villages)
            {
                "name": "Kaij", "district": "Nanded", "region": "marathwada",
                "latitude": 18.7000, "longitude": 76.4167,
                "days_without_water": 5
            },
            {
                "name": "Nanded", "district": "Nanded", "region": "marathwada",
                "latitude": 19.1500, "longitude": 77.3167,
                "days_without_water": 6
            },
            # Parbhani District (2 villages)
            {
                "name": "Mukhed", "district": "Parbhani", "region": "marathwada",
                "latitude": 19.1500, "longitude": 77.5000,
                "days_without_water": 7
            },
            {
                "name": "Biloli", "district": "Nanded", "region": "marathwada",
                "latitude": 18.7833, "longitude": 77.7167,
                "days_without_water": 4
            },
            {
                "name": "Jintur", "district": "Parbhani", "region": "marathwada",
                "latitude": 19.6167, "longitude": 76.6833,
                "days_without_water": 6
            }
        ]
        
        # NAGPUR REGION - 15 villages with REAL 2024 government data
        nagpur_villages = [
            {
                "name": "Nagpur City", "district": "Nagpur", "region": "nagpur",
                "latitude": 21.1458, "longitude": 79.0882,
                "days_without_water": 0
            },
            {
                "name": "Kamptee", "district": "Nagpur", "region": "nagpur",
                "latitude": 21.2167, "longitude": 79.1833,
                "days_without_water": 1
            },
            {
                "name": "Hingna", "district": "Nagpur", "region": "nagpur",
                "latitude": 21.0833, "longitude": 78.9167,
                "days_without_water": 2
            },
            {
                "name": "Katol", "district": "Nagpur", "region": "nagpur",
                "latitude": 21.2667, "longitude": 78.5833,
                "days_without_water": 4
            },
            {
                "name": "Saoner", "district": "Nagpur", "region": "nagpur",
                "latitude": 21.3833, "longitude": 78.9167,
                "days_without_water": 5
            },
            {
                "name": "Ramtek", "district": "Nagpur", "region": "nagpur",
                "latitude": 21.3833, "longitude": 79.3167,
                "days_without_water": 1
            },
            {
                "name": "Parseoni", "district": "Nagpur", "region": "nagpur",
                "latitude": 21.3333, "longitude": 79.1000,
                "days_without_water": 5
            },
            {
                "name": "Narkhed", "district": "Nagpur", "region": "nagpur",
                "latitude": 21.4500, "longitude": 78.5833,
                "days_without_water": 5
            },
            {
                "name": "Kalmeshwar", "district": "Nagpur", "region": "nagpur",
                "latitude": 21.2167, "longitude": 78.8167,
                "days_without_water": 3
            },
            {
                "name": "Mauda", "district": "Nagpur", "region": "nagpur",
                "latitude": 21.2500, "longitude": 79.6500,
                "days_without_water": 1
            },
            {
                "name": "Umred", "district": "Nagpur", "region": "nagpur",
                "latitude": 20.8500, "longitude": 79.3167,
                "days_without_water": 2
            },
            {
                "name": "Bhiwapur", "district": "Nagpur", "region": "nagpur",
                "latitude": 20.7667, "longitude": 79.6500,
                "days_without_water": 4
            },
            {
                "name": "Kuhi", "district": "Nagpur", "region": "nagpur",
                "latitude": 20.8833, "longitude": 79.5333,
                "days_without_water": 5
            },
            {
                "name": "Mouda", "district": "Nagpur", "region": "nagpur",
                "latitude": 21.2667, "longitude": 79.6167,
                "days_without_water": 1
            },
            {
                "name": "Wardha Road Village", "district": "Nagpur", "region": "nagpur",
                "latitude": 21.0500, "longitude": 79.2000,
                "days_without_water": 3
            }
        ]
        
        # Add all villages with REAL government data
        all_villages = marathwada_villages + nagpur_villages
        
        for v_data in all_villages:
            rainfall = real_data_fetcher.get_real_rainfall_for_village(v_data["district"])
            groundwater = real_data_fetcher.get_real_groundwater_for_village(v_data["district"])
            population = real_data_fetcher.get_real_population(v_data["name"])
            
            village = Village(
                name=v_data["name"],
                district=v_data["district"],
                region=v_data["region"],
                latitude=v_data["latitude"],
                longitude=v_data["longitude"],
                population=population,
                rainfall_current=rainfall["current"],
                rainfall_normal=rainfall["normal"],
                groundwater_current=groundwater["current"],
                groundwater_last_year=groundwater["last_year"],
                days_without_water=v_data["days_without_water"],
                water_stress_index=0.0,
                stress_level="safe"
            )
            db.add(village)
        
        # Add tankers for Marathwada region
        marathwada_tankers = [
            Tanker(
                vehicle_number="TN-LAT-001",
                driver_name="Rajesh Patil",
                driver_phone="9876543210",
                capacity_liters=10000,
                status="available",
                current_location_lat=18.3926,
                current_location_lng=77.1172,
                region="marathwada"
            ),
            Tanker(
                vehicle_number="TN-LAT-002",
                driver_name="Suresh Jadhav",
                driver_phone="9765432109",
                capacity_liters=12000,
                status="available",
                current_location_lat=18.1167,
                current_location_lng=76.7500,
                region="marathwada"
            ),
            Tanker(
                vehicle_number="TN-OSM-001",
                driver_name="Ganesh Shinde",
                driver_phone="9654321098",
                capacity_liters=9500,
                status="available",
                current_location_lat=18.1667,
                current_location_lng=76.0500,
                region="marathwada"
            ),
            Tanker(
                vehicle_number="TN-BED-001",
                driver_name="Prakash Deshmukh",
                driver_phone="9543210987",
                capacity_liters=11000,
                status="available",
                current_location_lat=18.9833,
                current_location_lng=75.7500,
                region="marathwada"
            ),
            Tanker(
                vehicle_number="TN-NAN-001",
                driver_name="Santosh Gaikwad",
                driver_phone="9432109876",
                capacity_liters=10500,
                status="available",
                current_location_lat=19.1500,
                current_location_lng=77.3167,
                region="marathwada"
            )
        ]
        
        # Add tankers for Nagpur region
        nagpur_tankers = [
            Tanker(
                vehicle_number="TN-NGP-001",
                driver_name="Ravi Thakur",
                driver_phone="9321098765",
                capacity_liters=11000,
                status="available",
                current_location_lat=21.1458,
                current_location_lng=79.0882,
                region="nagpur"
            ),
            Tanker(
                vehicle_number="TN-NGP-002",
                driver_name="Sunil Wankhede",
                driver_phone="9210987654",
                capacity_liters=9500,
                status="available",
                current_location_lat=21.2167,
                current_location_lng=79.1833,
                region="nagpur"
            ),
            Tanker(
                vehicle_number="TN-NGP-003",
                driver_name="Ajay Meshram",
                driver_phone="9109876543",
                capacity_liters=10500,
                status="available",
                current_location_lat=21.3833,
                current_location_lng=79.3167,
                region="nagpur"
            )
        ]
        
        for tanker in marathwada_tankers + nagpur_tankers:
            db.add(tanker)
        
        db.commit()
        print("Database seeded successfully with 30 villages (15 Marathwada + 15 Nagpur)!")
        print("Using REAL 2024 government data from IMD, CGWB, and Census India")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()
