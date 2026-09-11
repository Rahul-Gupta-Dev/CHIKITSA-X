import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.seed import seed_database
from app.routers import (
    health_router,
    patients_router,
    intake_router,
    medical_records_router,
    triage_router,
    hospitals_router,
    opd_router,
    qr_router,
    doctors_router,
    consultations_router,
    consent_router,
    financial_router,
    audit_router,
)

# Initialize database tables
Base.metadata.create_all(bind=engine)

# Seed demo dataset
with SessionLocal() as db_session:
    seed_database(db_session)

app = FastAPI(
    title="CHIKITSAX AI-Powered Smart Healthcare API",
    description="Backend API foundation for Patient Intelligence, Care Navigation & Care-to-Cost Financial Assistance",
    version="1.0.0"
)

# Configure CORS Middleware
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173")
origins = [origin.strip() for origin in cors_origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(health_router)
app.include_router(patients_router)
app.include_router(intake_router)
app.include_router(medical_records_router)
app.include_router(triage_router)
app.include_router(hospitals_router)
app.include_router(opd_router)
app.include_router(qr_router)
app.include_router(doctors_router)
app.include_router(consultations_router)
app.include_router(consent_router)
app.include_router(financial_router)
app.include_router(audit_router)

@app.get("/")
def root():
    return {
        "message": "Welcome to CHIKITSAX Smart Healthcare API Foundation",
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
