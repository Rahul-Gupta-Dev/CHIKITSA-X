import datetime
import random
import string
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.opd import OPDAppointmentModel
from app.models.qr import QRReferenceModel
from app.models.hospital import HospitalModel
from app.models.doctor import DoctorModel
from app.models.patient import PatientModel
from app.schemas import OPDCreateRequest, OPDResponse

router = APIRouter(prefix="/api/opd", tags=["OPD Registration"])

def generate_ref_id() -> str:
    chars = "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
    return f"CHX-2026-{chars}"

@router.post("", response_model=OPDResponse)
def create_opd_appointment(payload: OPDCreateRequest, db: Session = Depends(get_db)):
    hospital = db.query(HospitalModel).filter(HospitalModel.id == payload.hospital_id).first()
    doctor = db.query(DoctorModel).filter(DoctorModel.id == payload.doctor_id).first()
    patient = db.query(PatientModel).filter(
        (PatientModel.id == payload.patient_id) | (PatientModel.user_id == payload.patient_id)
    ).first()

    ref_id = generate_ref_id()
    while db.query(OPDAppointmentModel).filter(OPDAppointmentModel.reference_id == ref_id).first():
        ref_id = generate_ref_id()

    token = f"TOKEN_SECURE_{ref_id}_{int(datetime.datetime.utcnow().timestamp()*1000)}"
    opd_id = f"opd-{int(datetime.datetime.utcnow().timestamp()*1000)}"

    opd = OPDAppointmentModel(
        id=opd_id,
        reference_id=ref_id,
        patient_id=payload.patient_id,
        patient_name=patient.full_name if patient else "Ramesh Sharma",
        patient_phone=patient.phone if patient else "+91 98765 43210",
        hospital_id=payload.hospital_id,
        hospital_name=hospital.name if hospital else "CarePlus Super Specialty Hospital",
        department=payload.department,
        doctor_id=payload.doctor_id,
        doctor_name=doctor.name if doctor else "Dr. Rajesh Kulkarni",
        appointment_date=payload.date,
        appointment_time=payload.time,
        consultation_fee=doctor.consultation_fee if doctor else 800,
        status="CONFIRMED",
        qr_token=token
    )
    db.add(opd)

    # Automatically create matching QR Reference in the SAME single database source of truth
    qr = QRReferenceModel(
        id=f"qr-{opd_id}",
        reference_id=ref_id,
        token=token,
        patient_id=payload.patient_id,
        hospital_id=payload.hospital_id,
        expires_at=datetime.datetime.utcnow() + datetime.timedelta(days=1),
        is_verified=False
    )
    db.add(qr)

    if patient and patient.care_stage < 6:
        patient.care_stage = 6

    db.commit()
    db.refresh(opd)

    return {
        "id": opd.id,
        "reference_id": opd.reference_id,
        "patient_id": opd.patient_id,
        "patient_name": opd.patient_name,
        "patient_phone": opd.patient_phone,
        "hospital_id": opd.hospital_id,
        "hospital_name": opd.hospital_name,
        "department": opd.department,
        "doctor_id": opd.doctor_id,
        "doctor_name": opd.doctor_name,
        "appointment_date": opd.appointment_date,
        "appointment_time": opd.appointment_time,
        "consultation_fee": opd.consultation_fee,
        "status": opd.status,
        "qr_token": opd.qr_token
    }
