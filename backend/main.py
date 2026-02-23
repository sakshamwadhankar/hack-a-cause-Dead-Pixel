from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from routes import villages, tankers, alerts
from models import Village

Base.metadata.create_all(bind=engine)

def init_db():
    db = SessionLocal()
    try:
        village_count = db.query(Village).count()
        if village_count == 0:
            print("Database is empty. Running seed data...")
            from seed_data import seed_database
            seed_database()
            print("Database seeded successfully!")
    finally:
        db.close()

app = FastAPI(title="JalRakshak API", version="1.0.0")

@app.on_event("startup")
def startup_event():
    init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(villages.router)
app.include_router(tankers.router)
app.include_router(alerts.router)

@app.get("/")
def root():
    return {"message": "JalRakshak API is running"}

@app.get("/stats")
def get_stats():
    from sqlalchemy.orm import Session
    from models import Village, Tanker, TankerRequest
    from database import get_db
    
    db_gen = get_db()
    db = next(db_gen)
    
    try:
        total_villages = db.query(Village).count()
        high_risk_villages = db.query(Village).filter(Village.drought_risk == "high").count()
        total_tankers = db.query(Tanker).count()
        available_tankers = db.query(Tanker).filter(Tanker.status == "available").count()
        pending_requests = db.query(TankerRequest).filter(TankerRequest.status == "pending").count()
        
        return {
            "total_villages": total_villages,
            "high_risk_villages": high_risk_villages,
            "total_tankers": total_tankers,
            "available_tankers": available_tankers,
            "pending_requests": pending_requests
        }
    finally:
        db.close()
