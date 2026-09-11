from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# Health Schema
class HealthResponse(BaseModel):
    status: str
    service: str

# User Schemas
class UserBase(BaseModel):
    email: str
    name: str
    role: str
    avatar: Optional[str] = None
    phone: Optional[str] = None
    hospitalId: Optional[str] = None

class UserCreate(UserBase):
    id: Optional[str] = None

class UserOut(UserBase):
    id: str

# Emergency Contact Schema
class EmergencyContact(BaseModel):
    name: str
    relationship: str
    phone: str

# Patient Schemas
class PatientProfileBase(BaseModel):
    userId: str
    fullName: str
    age: int
    gender: str
    bloodGroup: str
    phone: str
    email: str
    address: str
    city: str
    pincode: str
    emergencyContact: Optional[EmergencyContact] = None
    symptoms: List[str] = []
    medicalHistory: List[str] = []
    medications: List[str] = []
    allergies: List[str] = []
    vitalSigns: Optional[Dict[str, str]] = None
    careStage: int = 1
    financialBudgetPreference: str = "MEDIUM"
    hasInsurance: bool = False
    insuranceProvider: Optional[str] = None
    policyNumber: Optional[str] = None
    hasGovernmentCard: bool = False
    rationCardType: Optional[str] = None
    incomeCategory: Optional[str] = None

class PatientProfileCreate(PatientProfileBase):
    id: Optional[str] = None

class PatientProfileUpdate(BaseModel):
    fullName: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    symptoms: Optional[List[str]] = None
    medicalHistory: Optional[List[str]] = None
    medications: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    careStage: Optional[int] = None
    hasInsurance: Optional[bool] = None
    insuranceProvider: Optional[str] = None
    policyNumber: Optional[str] = None
    hasGovernmentCard: Optional[bool] = None
    rationCardType: Optional[str] = None
    incomeCategory: Optional[str] = None

class PatientProfileOut(PatientProfileBase):
    id: str

# Intake Schemas
class IntakeRequest(BaseModel):
    patient_id: str
    transcript: str
    language: Optional[str] = "en"
    duration: Optional[str] = "Recent"
    severity: Optional[str] = "Moderate"
    affected_body_part: Optional[str] = None
    trigger_event: Optional[str] = None

class IntakeResponse(BaseModel):
    id: str
    patient_id: str
    raw_transcript: str
    extracted_symptoms: List[str]
    duration: str
    severity: str
    affected_body_part: Optional[str] = None
    is_emergency_alert: bool

# Medical Record Schemas
class MedicalRecordCreate(BaseModel):
    patient_id: str
    file_name: str
    file_type: str
    category: str
    raw_text: Optional[str] = None
    ocr_extracted_data: Optional[Dict[str, Any]] = None

class MedicalRecordOut(BaseModel):
    id: str
    patient_id: str
    file_name: str
    file_type: str
    category: str
    upload_date: str
    ocr_extracted_data: Dict[str, Any]
    is_verified_by_patient: bool

# Triage Schemas
class TriageRequest(BaseModel):
    patient_id: str
    intake_id: Optional[str] = None

class TriageResponse(BaseModel):
    id: str
    patient_id: str
    risk_level: str
    urgency: str
    recommended_specialties: List[str]
    symptoms_considered: List[str]
    reasoning: List[str]
    next_action: str
    is_emergency_triggered: bool
    disclaimer: str = "AI-assisted triage only. Professional medical evaluation by a licensed physician is required."

# Hospital Schemas
class HospitalOut(BaseModel):
    id: str
    name: str
    code: str
    tagline: str
    address: str
    city: str
    distanceKm: float
    phone: str
    emergencyPhone: str
    rating: float
    reviewCount: int
    emergencyAvailable: bool
    emergencyBedsFree: int
    icuBedsFree: int
    specialties: List[str]
    clinicalFitScore: float
    affordabilityScore: float
    availabilityScore: float
    supportServicesScore: float
    chikitsaxCareScore: float
    estimatedCostRange: Dict[str, int]
    acceptedInsuranceProviders: List[str]
    acceptedGovSchemes: List[str]
    ngoPartnerships: List[str]
    accreditation: List[str]
    opdSlotAvailability: str
    image: Optional[str] = None
    whyRecommended: Optional[Dict[str, str]] = None

class HospitalRecommendRequest(BaseModel):
    patient_id: str
    specialty: Optional[str] = None
    budget_preference: Optional[str] = "MEDIUM"
    max_distance_km: Optional[float] = 15.0

class HospitalRecommendationResponse(BaseModel):
    hospitals: List[Dict[str, Any]]

# Doctor Schemas
class DoctorOut(BaseModel):
    id: str
    hospitalId: str
    hospitalName: str
    name: str
    specialty: str
    qualification: str
    experienceYears: int
    rating: float
    consultationFee: int
    availableDays: List[str]
    availableSlots: List[str]
    avatar: Optional[str] = None

# OPD Registration Schemas
class OPDCreateRequest(BaseModel):
    patient_id: str
    hospital_id: str
    department: str
    doctor_id: str
    date: str
    time: str

class OPDResponse(BaseModel):
    id: str
    reference_id: str
    patient_id: str
    patient_name: str
    patient_phone: str
    hospital_id: str
    hospital_name: str
    department: str
    doctor_id: str
    doctor_name: str
    appointment_date: str
    appointment_time: str
    consultation_fee: int
    status: str
    qr_token: str

# QR Verification Schemas
class QRVerifyResponse(BaseModel):
    verified: bool
    message: str
    reference_id: Optional[str] = None
    appointment: Optional[Dict[str, Any]] = None

class HospitalVerifyRequest(BaseModel):
    reference_id: str
    staff_name: Optional[str] = "Reception Desk Staff"

# Consent Schemas
class ConsentCreateRequest(BaseModel):
    patient_id: str
    hospital_id: str
    hospital_name: str
    doctor_id: Optional[str] = None
    doctor_name: Optional[str] = None
    consent_type: Optional[str] = "MEDICAL_RECORD_SHARING"
    granted: bool = True

class ConsentOut(BaseModel):
    id: str
    patientId: str
    hospitalId: str
    hospitalName: str
    doctorId: Optional[str] = None
    doctorName: Optional[str] = None
    status: str
    accessibleSections: List[str]

# Consultation Schemas
class ConsultationCreateRequest(BaseModel):
    appointment_id: str
    clinical_notes: str
    diagnosis: str
    investigations_ordered: List[str] = []
    prescription_medicines: List[Dict[str, str]] = []
    treatment_plan: str
    estimated_cost: Optional[int] = None

class ConsultationOut(BaseModel):
    id: str
    appointmentId: str
    referenceId: str
    patientId: str
    patientName: str
    doctorId: str
    doctorName: str
    hospitalId: str
    clinicalNotes: str
    diagnosis: str
    investigationsOrdered: List[str]
    prescriptionMedicines: List[Dict[str, str]]
    treatmentPlan: str
    status: str

# Financial Schemas
class FinancialAssessmentRequest(BaseModel):
    patient_id: str
    treatment_cost: float
    hospital_name: Optional[str] = None

class FinancialAssessmentResponse(BaseModel):
    estimated_treatment_cost: float
    insurance_support: float
    government_support: float
    ngo_support: float
    estimated_patient_gap: float
    disclaimer: str = "Estimates only based on current policy rules. Final approval subject to hospital and provider verification."

class FinancePlanRequest(BaseModel):
    patient_id: str
    treatment_cost: float
    insurance_coverage: float = 0.0
    government_support: float = 0.0
    ngo_support: float = 0.0
    additional_savings: float = 0.0

class FinancePlanResponse(BaseModel):
    estimated_cost: float
    insurance_benefit: float
    government_benefit: float
    ngo_benefit: float
    patient_out_of_pocket: float
    remaining_gap: float
    recommendation_tag: str
    disclaimer: str = "Indicative affordability plan only."

# Audit Log Schemas
class AuditLogCreate(BaseModel):
    actor_role: str
    actor_id: str
    action: str
    details: str

class AuditLogOut(BaseModel):
    id: str
    timestamp: str
    actorRole: str
    actorId: str
    action: str
    details: str
