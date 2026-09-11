import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.intake import IntakeSessionModel
from app.models.patient import PatientModel
from app.schemas import IntakeRequest, IntakeResponse
from app.services.voice_intake_service import VoiceIntakeService

router = APIRouter(prefix="/api/intake", tags=["Voice Intake"])

@router.post("", response_model=IntakeResponse)
def submit_intake(payload: IntakeRequest, db: Session = Depends(get_db)):
    processed = VoiceIntakeService.process_transcript(payload.transcript)

    intake_id = f"intake-{int(datetime.datetime.utcnow().timestamp()*1000)}"
    intake = IntakeSessionModel(
        id=intake_id,
        patient_id=payload.patient_id,
        raw_transcript=payload.transcript,
        extracted_symptoms=processed["extracted_symptoms"],
        duration=processed["duration"],
        severity=processed["severity"],
        affected_body_part=processed["affected_body_part"],
        is_emergency_alert=processed["is_emergency_alert"]
    )
    db.add(intake)

    # Sync symptoms to patient profile
    patient = db.query(PatientModel).filter(
        (PatientModel.id == payload.patient_id) | (PatientModel.user_id == payload.patient_id)
    ).first()
    if patient:
        existing_symptoms = patient.symptoms or []
        merged = list(dict.fromkeys(existing_symptoms + processed["extracted_symptoms"]))
        patient.symptoms = merged
        if patient.care_stage < 2:
            patient.care_stage = 2

    db.commit()
    db.refresh(intake)

    return {
        "id": intake.id,
        "patient_id": intake.patient_id,
        "raw_transcript": intake.raw_transcript,
        "extracted_symptoms": intake.extracted_symptoms,
        "duration": intake.duration,
        "severity": intake.severity,
        "affected_body_part": intake.affected_body_part,
        "is_emergency_alert": intake.is_emergency_alert
    }
