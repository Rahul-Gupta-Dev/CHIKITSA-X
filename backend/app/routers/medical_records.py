import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.medical_record import MedicalRecordModel
from app.models.patient import PatientModel
from app.schemas import MedicalRecordCreate, MedicalRecordOut
from app.services.ocr_service import OCRService

router = APIRouter(prefix="/api/medical-records", tags=["Medical Records"])

@router.post("", response_model=MedicalRecordOut)
def upload_medical_record(payload: MedicalRecordCreate, db: Session = Depends(get_db)):
    if payload.ocr_extracted_data:
        extracted = payload.ocr_extracted_data
    else:
        raw_text = payload.raw_text or f"Sample extracted medical record for {payload.file_name}"
        extracted = OCRService.extract_medical_fields(raw_text, payload.category)

    rec_id = f"ocr-{int(datetime.datetime.utcnow().timestamp()*1000)}"
    today_str = datetime.datetime.utcnow().strftime("%d %b %Y")

    record = MedicalRecordModel(
        id=rec_id,
        patient_id=payload.patient_id,
        file_name=payload.file_name,
        file_type=payload.file_type.upper(),
        category=payload.category,
        upload_date=today_str,
        ocr_extracted_data=extracted,
        is_verified_by_patient=True
    )
    db.add(record)

    # Sync medications and allergies to patient profile
    patient = db.query(PatientModel).filter(
        (PatientModel.id == payload.patient_id) | (PatientModel.user_id == payload.patient_id)
    ).first()
    if patient:
        new_meds = extracted.get("medicinesExtracted", [])
        new_allergies = extracted.get("allergiesExtracted", [])
        merged_meds = list(dict.fromkeys((patient.medications or []) + new_meds))
        merged_allergies = list(dict.fromkeys((patient.allergies or []) + new_allergies))
        patient.medications = merged_meds
        patient.allergies = merged_allergies
        if patient.care_stage < 3:
            patient.care_stage = 3

    db.commit()
    db.refresh(record)

    return {
        "id": record.id,
        "patient_id": record.patient_id,
        "file_name": record.file_name,
        "file_type": record.file_type,
        "category": record.category,
        "upload_date": record.upload_date,
        "ocr_extracted_data": record.ocr_extracted_data,
        "is_verified_by_patient": record.is_verified_by_patient
    }

@router.get("/{patient_id}", response_model=List[MedicalRecordOut])
def get_records_by_patient(patient_id: str, db: Session = Depends(get_db)):
    records = db.query(MedicalRecordModel).filter(
        MedicalRecordModel.patient_id == patient_id
    ).order_by(MedicalRecordModel.created_at.desc()).all()
    return [
        {
            "id": r.id,
            "patient_id": r.patient_id,
            "file_name": r.file_name,
            "file_type": r.file_type,
            "category": r.category,
            "upload_date": r.upload_date,
            "ocr_extracted_data": r.ocr_extracted_data,
            "is_verified_by_patient": r.is_verified_by_patient
        }
        for r in records
    ]
