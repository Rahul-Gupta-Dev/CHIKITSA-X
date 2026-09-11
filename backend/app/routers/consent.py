import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models.consent import ConsentLogModel
from app.schemas import ConsentCreateRequest, ConsentOut

router = APIRouter(prefix="/api/consent", tags=["Patient Access Consent"])

def consent_to_dict(c: ConsentLogModel) -> Dict[str, Any]:
    return {
        "id": c.id,
        "patientId": c.patient_id,
        "hospitalId": c.hospital_id,
        "hospitalName": c.hospital_name,
        "doctorId": c.doctor_id,
        "doctorName": c.doctor_name,
        "status": c.status,
        "accessibleSections": c.accessible_sections or []
    }

@router.post("", response_model=ConsentOut)
def record_consent(payload: ConsentCreateRequest, db: Session = Depends(get_db)):
    existing = db.query(ConsentLogModel).filter(
        ConsentLogModel.patient_id == payload.patient_id,
        ConsentLogModel.hospital_id == payload.hospital_id,
        ConsentLogModel.status == "PENDING"
    ).first()

    if existing:
        if payload.granted:
            existing.status = "GRANTED"
            existing.granted_at = datetime.datetime.utcnow()
        db.commit()
        db.refresh(existing)
        return consent_to_dict(existing)

    cst_id = f"cst-{int(datetime.datetime.utcnow().timestamp()*1000)}"
    consent = ConsentLogModel(
        id=cst_id,
        patient_id=payload.patient_id,
        hospital_id=payload.hospital_id,
        hospital_name=payload.hospital_name,
        doctor_id=payload.doctor_id,
        doctor_name=payload.doctor_name,
        requested_at=datetime.datetime.utcnow(),
        granted_at=datetime.datetime.utcnow() if payload.granted else None,
        status="GRANTED" if payload.granted else "PENDING",
        accessible_sections=["PROFILE", "SYMPTOMS", "OCR_RECORDS", "TRIAGE"]
    )
    db.add(consent)
    db.commit()
    db.refresh(consent)
    return consent_to_dict(consent)

@router.get("/{patient_id}", response_model=List[ConsentOut])
def get_patient_consents(patient_id: str, db: Session = Depends(get_db)):
    consents = db.query(ConsentLogModel).filter(
        ConsentLogModel.patient_id == patient_id
    ).all()
    return [consent_to_dict(c) for c in consents]
