from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models.doctor import DoctorModel
from app.models.opd import OPDAppointmentModel
from app.schemas import DoctorOut

router = APIRouter(prefix="/api/doctors", tags=["Doctors"])

def doctor_to_dict(d: DoctorModel) -> Dict[str, Any]:
    return {
        "id": d.id,
        "hospitalId": d.hospital_id,
        "hospitalName": d.hospital_name,
        "name": d.name,
        "specialty": d.specialty,
        "qualification": d.qualification,
        "experienceYears": d.experience_years,
        "rating": d.rating,
        "consultationFee": d.consultation_fee,
        "availableDays": d.available_days or [],
        "availableSlots": d.available_slots or [],
        "avatar": d.avatar
    }

@router.get("", response_model=List[DoctorOut])
def get_doctors(hospital_id: str = None, db: Session = Depends(get_db)):
    query = db.query(DoctorModel)
    if hospital_id:
        query = query.filter(DoctorModel.hospital_id == hospital_id)
    doctors = query.all()
    return [doctor_to_dict(d) for d in doctors]

@router.get("/{doctor_id}", response_model=DoctorOut)
def get_doctor(doctor_id: str, db: Session = Depends(get_db)):
    doc = db.query(DoctorModel).filter(DoctorModel.id == doctor_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor_to_dict(doc)

@router.get("/{doctor_id}/appointments")
def get_doctor_appointments(doctor_id: str, db: Session = Depends(get_db)):
    appointments = db.query(OPDAppointmentModel).filter(
        OPDAppointmentModel.doctor_id == doctor_id
    ).order_by(OPDAppointmentModel.created_at.desc()).all()
    return [
        {
            "id": a.id,
            "referenceId": a.reference_id,
            "patientId": a.patient_id,
            "patientName": a.patient_name,
            "patientPhone": a.patient_phone,
            "department": a.department,
            "appointmentDate": a.appointment_date,
            "appointmentTime": a.appointment_time,
            "status": a.status
        }
        for a in appointments
    ]
