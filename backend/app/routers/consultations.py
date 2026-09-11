import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models.consultation import ConsultationModel
from app.models.opd import OPDAppointmentModel
from app.models.patient import PatientModel
from app.schemas import ConsultationCreateRequest, ConsultationOut

router = APIRouter(prefix="/api/consultations", tags=["Doctor Consultations"])

def consultation_to_dict(c: ConsultationModel) -> Dict[str, Any]:
    return {
        "id": c.id,
        "appointmentId": c.appointment_id,
        "referenceId": c.reference_id,
        "patientId": c.patient_id,
        "patientName": c.patient_name,
        "doctorId": c.doctor_id,
        "doctorName": c.doctor_name,
        "hospitalId": c.hospital_id,
        "clinicalNotes": c.clinical_notes,
        "diagnosis": c.diagnosis,
        "investigationsOrdered": c.investigations_ordered or [],
        "prescriptionMedicines": c.prescription_medicines or [],
        "treatmentPlan": c.treatment_plan,
        "status": c.status
    }

@router.post("", response_model=ConsultationOut)
def record_consultation(payload: ConsultationCreateRequest, db: Session = Depends(get_db)):
    opd = db.query(OPDAppointmentModel).filter(OPDAppointmentModel.id == payload.appointment_id).first()
    if not opd:
        raise HTTPException(status_code=404, detail="Associated OPD Appointment not found")

    cons_id = f"cons-{int(datetime.datetime.utcnow().timestamp()*1000)}"
    consultation = ConsultationModel(
        id=cons_id,
        appointment_id=opd.id,
        reference_id=opd.reference_id,
        patient_id=opd.patient_id,
        patient_name=opd.patient_name,
        doctor_id=opd.doctor_id,
        doctor_name=opd.doctor_name,
        hospital_id=opd.hospital_id,
        clinical_notes=payload.clinical_notes,
        diagnosis=payload.diagnosis,
        investigations_ordered=payload.investigations_ordered,
        prescription_medicines=payload.prescription_medicines,
        treatment_plan=payload.treatment_plan,
        status="COMPLETED"
    )
    db.add(consultation)

    opd.status = "COMPLETED"

    patient = db.query(PatientModel).filter(
        (PatientModel.id == opd.patient_id) | (PatientModel.user_id == opd.patient_id)
    ).first()
    if patient and patient.care_stage < 8:
        patient.care_stage = 8

    db.commit()
    db.refresh(consultation)
    return consultation_to_dict(consultation)

@router.get("/{appointment_id}", response_model=ConsultationOut)
def get_consultation(appointment_id: str, db: Session = Depends(get_db)):
    cons = db.query(ConsultationModel).filter(
        (ConsultationModel.appointment_id == appointment_id) | (ConsultationModel.id == appointment_id)
    ).first()
    if not cons:
        raise HTTPException(status_code=404, detail="Consultation record not found")
    return consultation_to_dict(cons)
