from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models.hospital import HospitalModel
from app.schemas import HospitalOut, HospitalRecommendRequest, HospitalRecommendationResponse
from app.services.hospital_service import HospitalRecommendationService

router = APIRouter(prefix="/api/hospitals", tags=["Hospitals"])

def hospital_to_dict(h: HospitalModel) -> Dict[str, Any]:
    return {
        "id": h.id,
        "name": h.name,
        "code": h.code,
        "tagline": h.tagline,
        "address": h.address,
        "city": h.city,
        "distanceKm": h.distance_km,
        "phone": h.phone,
        "emergencyPhone": h.emergency_phone,
        "rating": h.rating,
        "reviewCount": h.review_count,
        "emergencyAvailable": h.emergency_available,
        "emergencyBedsFree": h.emergency_beds_free,
        "icuBedsFree": h.icu_beds_free,
        "specialties": h.specialties or [],
        "clinicalFitScore": h.clinical_fit_score,
        "affordabilityScore": h.affordability_score,
        "availabilityScore": h.availability_score,
        "supportServicesScore": h.support_services_score,
        "chikitsaxCareScore": h.chikitsax_care_score,
        "estimatedCostRange": h.estimated_cost_range,
        "acceptedInsuranceProviders": h.accepted_insurance_providers or [],
        "acceptedGovSchemes": h.accepted_gov_schemes or [],
        "ngoPartnerships": h.ngo_partnerships or [],
        "accreditation": h.accreditation or [],
        "opdSlotAvailability": h.opd_slot_availability,
        "image": h.image,
        "whyRecommended": h.why_recommended
    }

@router.get("", response_model=List[HospitalOut])
def get_all_hospitals(db: Session = Depends(get_db)):
    hospitals = db.query(HospitalModel).all()
    return [hospital_to_dict(h) for h in hospitals]

@router.get("/{hospital_id}", response_model=HospitalOut)
def get_hospital(hospital_id: str, db: Session = Depends(get_db)):
    h = db.query(HospitalModel).filter(HospitalModel.id == hospital_id).first()
    if not h:
        raise HTTPException(status_code=404, detail="Hospital not found")
    return hospital_to_dict(h)

@router.post("/recommend", response_model=HospitalRecommendationResponse)
def recommend_hospitals(payload: HospitalRecommendRequest, db: Session = Depends(get_db)):
    hospitals = db.query(HospitalModel).all()
    h_dicts = [hospital_to_dict(h) for h in hospitals]
    ranked = HospitalRecommendationService.rank_hospitals(h_dicts, payload.budget_preference or "MEDIUM")
    return {"hospitals": ranked}
