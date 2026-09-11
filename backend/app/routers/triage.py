import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.triage import TriageResultModel
from app.models.patient import PatientModel
from app.models.intake import IntakeSessionModel
from app.schemas import TriageRequest, TriageResponse
from app.services.triage_service import TriageService

router = APIRouter(prefix="/api/triage", tags=["Clinical Triage"])

@router.post("", response_model=TriageResponse)
def perform_triage(payload: TriageRequest, db: Session = Depends(get_db)):
    patient = db.query(PatientModel).filter(
        (PatientModel.id == payload.patient_id) | (PatientModel.user_id == payload.patient_id)
    ).first()

    symptoms = patient.symptoms if (patient and patient.symptoms) else ["Chest Tightness", "Shortness of Breath"]
    history = patient.medical_history if (patient and patient.medical_history) else ["Hypertension"]

    is_emergency = False
    severity = "Moderate"

    intake = None
    if payload.intake_id:
        intake = db.query(IntakeSessionModel).filter(IntakeSessionModel.id == payload.intake_id).first()
    else:
        intake = db.query(IntakeSessionModel).filter(
            IntakeSessionModel.patient_id == payload.patient_id
        ).order_by(IntakeSessionModel.timestamp.desc()).first()

    if intake:
        symptoms = intake.extracted_symptoms or symptoms
        is_emergency = intake.is_emergency_alert
        severity = intake.severity

    eval_result = TriageService.evaluate_triage(symptoms, history, is_emergency, severity)

    triage_id = f"trg-{int(datetime.datetime.utcnow().timestamp()*1000)}"
    triage = TriageResultModel(
        id=triage_id,
        patient_id=payload.patient_id,
        risk_level=eval_result["risk_level"],
        urgency=eval_result["urgency"],
        symptoms_considered=eval_result["symptoms_considered"],
        clinical_reasoning=eval_result["clinical_reasoning"],
        recommended_specialty=eval_result["recommended_specialty"],
        recommended_next_step=eval_result["recommended_next_step"],
        is_emergency_triggered=eval_result["is_emergency_triggered"]
    )
    db.add(triage)

    if patient and patient.care_stage < 4:
        patient.care_stage = 4

    db.commit()
    db.refresh(triage)

    return {
        "id": triage.id,
        "patient_id": triage.patient_id,
        "risk_level": triage.risk_level,
        "urgency": triage.urgency,
        "recommended_specialties": [triage.recommended_specialty],
        "symptoms_considered": triage.symptoms_considered,
        "reasoning": triage.clinical_reasoning,
        "next_action": triage.recommended_next_step,
        "is_emergency_triggered": triage.is_emergency_triggered,
        "disclaimer": "AI-assisted triage decision support only. Does not provide a disease diagnosis. Final clinical decisions are made by qualified healthcare professionals."
    }
