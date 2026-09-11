from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models.patient import PatientModel
from app.models.medical_record import MedicalRecordModel
from app.models.intake import IntakeSessionModel
from app.models.triage import TriageResultModel
from app.schemas import PatientProfileCreate, PatientProfileUpdate, PatientProfileOut

router = APIRouter(prefix="/api/patients", tags=["Patients"])

def patient_to_dict(p: PatientModel) -> Dict[str, Any]:
    return {
        "id": p.id,
        "userId": p.user_id,
        "fullName": p.full_name,
        "age": p.age,
        "gender": p.gender,
        "bloodGroup": p.blood_group,
        "phone": p.phone,
        "email": p.email,
        "address": p.address,
        "city": p.city,
        "pincode": p.pincode,
        "emergencyContact": p.emergency_contact,
        "symptoms": p.symptoms or [],
        "medicalHistory": p.medical_history or [],
        "medications": p.medications or [],
        "allergies": p.allergies or [],
        "vitalSigns": p.vital_signs,
        "careStage": p.care_stage,
        "financialBudgetPreference": p.financial_budget_preference,
        "hasInsurance": p.has_insurance,
        "insuranceProvider": p.insurance_provider,
        "policyNumber": p.policy_number,
        "hasGovernmentCard": p.has_government_card,
        "rationCardType": p.ration_card_type,
        "incomeCategory": p.income_category
    }

@router.get("/{patient_id}")
def get_patient(patient_id: str, db: Session = Depends(get_db)):
    patient = db.query(PatientModel).filter(
        (PatientModel.id == patient_id) | (PatientModel.user_id == patient_id)
    ).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")
    return patient_to_dict(patient)

@router.post("")
def create_patient(payload: PatientProfileCreate, db: Session = Depends(get_db)):
    patient_id = payload.id or f"pat-{payload.fullName.lower().replace(' ', '-')}-1"
    patient = PatientModel(
        id=patient_id,
        user_id=payload.userId,
        full_name=payload.fullName,
        age=payload.age,
        gender=payload.gender,
        blood_group=payload.bloodGroup,
        phone=payload.phone,
        email=payload.email,
        address=payload.address,
        city=payload.city,
        pincode=payload.pincode,
        emergency_contact=payload.emergencyContact.dict() if payload.emergencyContact else None,
        symptoms=payload.symptoms,
        medical_history=payload.medicalHistory,
        medications=payload.medications,
        allergies=payload.allergies,
        vital_signs=payload.vitalSigns,
        care_stage=payload.careStage,
        financial_budget_preference=payload.financialBudgetPreference,
        has_insurance=payload.hasInsurance,
        insurance_provider=payload.insuranceProvider,
        policy_number=payload.policyNumber,
        has_government_card=payload.hasGovernmentCard,
        ration_card_type=payload.rationCardType,
        income_category=payload.incomeCategory
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient_to_dict(patient)

@router.put("/{patient_id}")
def update_patient(patient_id: str, payload: PatientProfileUpdate, db: Session = Depends(get_db)):
    patient = db.query(PatientModel).filter(
        (PatientModel.id == patient_id) | (PatientModel.user_id == patient_id)
    ).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")

    update_data = payload.dict(exclude_unset=True)
    mapping = {
        "fullName": "full_name",
        "bloodGroup": "blood_group",
        "careStage": "care_stage",
        "hasInsurance": "has_insurance",
        "insuranceProvider": "insurance_provider",
        "policyNumber": "policy_number",
        "hasGovernmentCard": "has_government_card",
        "rationCardType": "ration_card_type",
        "incomeCategory": "income_category",
        "medicalHistory": "medical_history"
    }
    for key, val in update_data.items():
        db_key = mapping.get(key, key)
        setattr(patient, db_key, val)

    db.commit()
    db.refresh(patient)
    return patient_to_dict(patient)

@router.get("/{patient_id}/profile")
def get_unified_patient_profile(patient_id: str, db: Session = Depends(get_db)):
    patient = db.query(PatientModel).filter(
        (PatientModel.id == patient_id) | (PatientModel.user_id == patient_id)
    ).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")

    records = db.query(MedicalRecordModel).filter(MedicalRecordModel.patient_id == patient.id).all()
    latest_intake = db.query(IntakeSessionModel).filter(IntakeSessionModel.patient_id == patient.id).order_by(IntakeSessionModel.timestamp.desc()).first()
    latest_triage = db.query(TriageResultModel).filter(TriageResultModel.patient_id == patient.id).order_by(TriageResultModel.timestamp.desc()).first()

    profile_dict = patient_to_dict(patient)
    profile_dict["previousRecordsCount"] = len(records)
    profile_dict["latestIntake"] = {
        "id": latest_intake.id,
        "transcript": latest_intake.raw_transcript,
        "symptoms": latest_intake.extracted_symptoms,
        "severity": latest_intake.severity
    } if latest_intake else None

    profile_dict["latestTriage"] = {
        "id": latest_triage.id,
        "riskLevel": latest_triage.risk_level,
        "urgency": latest_triage.urgency,
        "recommendedSpecialty": latest_triage.recommended_specialty
    } if latest_triage else None

    return profile_dict

@router.get("/{patient_id}/records")
def get_patient_records(patient_id: str, db: Session = Depends(get_db)):
    records = db.query(MedicalRecordModel).filter(
        (MedicalRecordModel.patient_id == patient_id)
    ).all()
    return [
        {
            "id": r.id,
            "patientId": r.patient_id,
            "fileName": r.file_name,
            "fileType": r.file_type,
            "category": r.category,
            "uploadDate": r.upload_date,
            "ocrExtractedData": r.ocr_extracted_data,
            "isVerifiedByPatient": r.is_verified_by_patient
        }
        for r in records
    ]
