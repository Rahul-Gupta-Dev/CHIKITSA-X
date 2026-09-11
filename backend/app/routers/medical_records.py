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

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import List, Optional, Dict, Any

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}

@router.post("", response_model=MedicalRecordOut)
def upload_medical_record(payload: MedicalRecordCreate, db: Session = Depends(get_db)):
    if payload.ocr_extracted_data:
        extracted = payload.ocr_extracted_data
    else:
        raw_text = payload.raw_text or f"Sample extracted medical record for {payload.file_name}"
        extracted = OCRService.extract_medical_fields(raw_text, payload.category, payload.file_name)

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

@router.post("/upload")
async def upload_file_multipart(
    patient_id: str = Form("usr-patient-1"),
    category: str = Form("Prescription"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    ext = "." + file.filename.split(".")[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file format '{ext}'. Supported formats: PDF, JPG, JPEG, PNG."
        )

    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Empty or corrupt file uploaded")
    if len(content) > 15 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum 15MB limit")

    file_type = ext.replace(".", "").upper()
    if file_type == "JPEG":
        file_type = "JPG"

    raw_text = OCRService.extract_text(content, file.filename, category)
    extracted = OCRService.extract_medical_fields(raw_text, category, file.filename)

    rec_id = f"ocr-{int(datetime.datetime.utcnow().timestamp()*1000)}"
    today_str = datetime.datetime.utcnow().strftime("%d %b %Y")

    record = MedicalRecordModel(
        id=rec_id,
        patient_id=patient_id,
        file_name=file.filename,
        file_type=file_type,
        category=category,
        upload_date=today_str,
        ocr_extracted_data=extracted,
        is_verified_by_patient=True
    )
    db.add(record)

    patient = db.query(PatientModel).filter(
        (PatientModel.id == patient_id) | (PatientModel.user_id == patient_id)
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
        "record_id": record.id,
        "patient_id": record.patient_id,
        "file_name": record.file_name,
        "file_type": record.file_type,
        "category": record.category,
        "upload_date": record.upload_date,
        "extraction_status": "development_mock_adapter",
        "extracted_fields": record.ocr_extracted_data,
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
