import type {
  SymptomIntake,
  MedicalRecord,
  TriageResult,
  Hospital,
  Doctor,
  PatientProfile,
  OPDRegistration,
  TreatmentCostEstimate,
  SchemeEligibilityResult,
  CareToCostAssessment,
  FinanceScenario
} from '../types';
import { db } from '../db/database';
import { apiClient } from './apiClient';

/**
 * Real FastAPI Backend Services with LocalDB Fallback (Phase 1B)
 */
export const patientService = {
  getProfile: async (patientId: string = 'usr-patient-1'): Promise<PatientProfile> => {
    try {
      const data = await apiClient.get<any>(`/patients/${patientId}/profile`);
      if (data && (data.id || data.userId)) {
        return {
          id: data.id || 'pat-sharma-1',
          userId: data.userId || data.user_id || patientId,
          fullName: data.fullName || data.full_name || '',
          age: data.age || 0,
          gender: data.gender || 'Other',
          bloodGroup: data.bloodGroup || data.blood_group || 'O+',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          city: data.city || '',
          pincode: data.pincode || '',
          emergencyContact: data.emergencyContact || data.emergency_contact || { name: '', relationship: '', phone: '' },
          symptoms: data.symptoms || [],
          medicalHistory: data.medicalHistory || data.medical_history || [],
          medications: data.medications || [],
          allergies: data.allergies || [],
          vitalSigns: data.vitalSigns || data.vital_signs,
          careStage: data.careStage || data.care_stage || 1,
          financialBudgetPreference: data.financialBudgetPreference || data.financial_budget_preference || 'MEDIUM',
          hasInsurance: Boolean(data.hasInsurance ?? data.has_insurance),
          insuranceProvider: data.insuranceProvider || data.insurance_provider,
          policyNumber: data.policyNumber || data.policy_number,
          hasGovernmentCard: Boolean(data.hasGovernmentCard ?? data.has_government_card),
          rationCardType: data.rationCardType || data.ration_card_type,
          incomeCategory: data.incomeCategory || data.income_category
        };
      }
    } catch (err) {
      console.warn('[patientService] FastAPI endpoint unavailable, falling back to LocalDB:', err);
    }
    return db.getPatientProfile();
  },

  updateProfile: async (updatedFields: Partial<PatientProfile>, patientId: string = 'usr-patient-1'): Promise<PatientProfile> => {
    try {
      const data = await apiClient.put<any>(`/patients/${patientId}`, updatedFields);
      if (data && (data.id || data.userId)) {
        db.updatePatientProfile(updatedFields);
        return {
          ...db.getPatientProfile(),
          fullName: data.fullName || data.full_name || updatedFields.fullName,
          age: data.age ?? updatedFields.age,
          bloodGroup: data.bloodGroup || data.blood_group || updatedFields.bloodGroup
        };
      }
    } catch (err) {
      console.warn('[patientService] FastAPI update failed, falling back to LocalDB:', err);
    }
    return db.updatePatientProfile(updatedFields);
  }
};

export const hospitalService = {
  getHospitals: async (): Promise<Hospital[]> => {
    try {
      const data = await apiClient.get<Hospital[]>('/hospitals');
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('[hospitalService] FastAPI /hospitals endpoint unavailable, falling back to LocalDB:', err);
    }
    return db.getHospitals();
  },

  getHospitalById: async (id: string): Promise<Hospital | undefined> => {
    try {
      const data = await apiClient.get<Hospital>(`/hospitals/${id}`);
      if (data && data.id) return data;
    } catch (err) {
      console.warn(`[hospitalService] FastAPI /hospitals/${id} unavailable, falling back to LocalDB:`, err);
    }
    return db.getHospitals().find(h => h.id === id);
  },

  recommendHospitals: async (
    filter: 'CARE_SCORE' | 'LOWEST_COST' | 'NEAREST' = 'CARE_SCORE',
    patientId: string = 'usr-patient-1'
  ): Promise<Hospital[]> => {
    try {
      const profile = db.getPatientProfile();
      const response = await apiClient.post<{ hospitals?: Hospital[]; recommendations?: any[] }>('/hospitals/recommend', {
        patient_id: patientId,
        budget_preference: profile.financialBudgetPreference || 'MEDIUM',
        specialty: 'Cardiology'
      });
      if (response && Array.isArray(response.hospitals) && response.hospitals.length > 0) {
        let list = response.hospitals;
        if (filter === 'LOWEST_COST') {
          list = [...list].sort((a, b) => a.estimatedCostRange.min - b.estimatedCostRange.min);
        } else if (filter === 'NEAREST') {
          list = [...list].sort((a, b) => a.distanceKm - b.distanceKm);
        } else {
          list = [...list].sort((a, b) => (b.chikitsaxCareScore || b.care_score || 0) - (a.chikitsaxCareScore || a.care_score || 0));
        }
        return list;
      }
    } catch (err) {
      console.warn('[hospitalService] FastAPI recommendation failed, falling back to LocalDB:', err);
    }
    return mockHospitalService.getRankedHospitals(filter);
  }
};

export const doctorService = {
  getDoctors: async (hospitalId?: string): Promise<Doctor[]> => {
    try {
      const endpoint = hospitalId ? `/doctors?hospital_id=${hospitalId}` : '/doctors';
      const data = await apiClient.get<Doctor[]>(endpoint);
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (err) {
      console.warn('[doctorService] FastAPI /doctors endpoint unavailable, falling back to LocalDB:', err);
    }
    return db.getDoctors();
  },

  getDoctorById: async (doctorId: string): Promise<Doctor | undefined> => {
    try {
      const data = await apiClient.get<Doctor>(`/doctors/${doctorId}`);
      if (data && data.id) return data;
    } catch (err) {
      console.warn(`[doctorService] FastAPI /doctors/${doctorId} unavailable, falling back to LocalDB:`, err);
    }
    return db.getDoctors().find(d => d.id === doctorId);
  }
};

export const opdService = {
  bookAppointment: async (
    hospitalId: string,
    hospitalName: string,
    department: string,
    doctorId: string,
    doctorName: string,
    appointmentDate: string,
    appointmentTime: string
  ): Promise<OPDRegistration> => {
    try {
      const payload = {
        patient_id: 'usr-patient-1',
        hospital_id: hospitalId,
        doctor_id: doctorId,
        department,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        date: appointmentDate,
        time: appointmentTime
      };
      const res = await apiClient.post<any>('/opd', payload);
      if (res && res.reference_id) {
        const opdRecord: OPDRegistration = {
          id: res.id || res.appointment_id || `opd-${Date.now()}`,
          referenceId: res.reference_id,
          patientId: res.patient_id || 'usr-patient-1',
          patientName: res.patient_name || 'Ramesh Sharma',
          patientPhone: res.patient_phone || '+91 98765 43210',
          hospitalId,
          hospitalName: res.hospital_name || res.hospital || hospitalName,
          department,
          doctorId,
          doctorName: res.doctor_name || res.doctor || doctorName,
          appointmentDate: res.appointment_date || appointmentDate,
          appointmentTime: res.appointment_time || appointmentTime,
          consultationFee: res.consultation_fee || 800,
          status: 'CONFIRMED',
          createdAt: new Date().toLocaleDateString('en-IN'),
          qrToken: res.qr_token || `TOKEN_SECURE_${res.reference_id}_${Date.now()}`
        };
        db.createOPDRegistration(opdRecord);
        return opdRecord;
      }
    } catch (err) {
      console.warn('[opdService] Backend /api/opd failed, falling back to LocalDB:', err);
    }
    return mockOPDService.bookAppointment(hospitalId, hospitalName, department, doctorId, doctorName, appointmentDate, appointmentTime);
  },

  getAppointmentByRef: async (referenceId: string): Promise<OPDRegistration | null> => {
    try {
      const res = await apiClient.get<any>(`/opd/reference/${referenceId}`);
      if (res && res.reference_id) {
        return {
          id: res.id || res.appointment_id,
          referenceId: res.reference_id,
          patientId: res.patient_id || 'usr-patient-1',
          patientName: res.patient_name || 'Ramesh Sharma',
          patientPhone: res.patient_phone || '+91 98765 43210',
          hospitalId: res.hospital_id || 'hosp-1',
          hospitalName: res.hospital_name || res.hospital || 'CarePlus Super Specialty Hospital',
          department: res.department,
          doctorId: res.doctor_id || 'doc-1',
          doctorName: res.doctor_name || res.doctor || 'Dr. Rajesh Kulkarni',
          appointmentDate: res.appointment_date,
          appointmentTime: res.appointment_time,
          consultationFee: res.consultation_fee || 800,
          status: (res.status || 'CONFIRMED').toUpperCase() as any,
          createdAt: new Date().toLocaleDateString('en-IN'),
          qrToken: res.qr_token || `TOKEN_SECURE_${res.reference_id}`
        };
      }
    } catch (err) {
      console.warn(`[opdService] Backend /api/opd/reference/${referenceId} failed, checking LocalDB:`, err);
    }
    const local = db.getOPDRegistrations().find(o => o.referenceId === referenceId);
    return local || null;
  }
};

export const qrService = {
  generateQR: async (appointmentId: string): Promise<{ reference_id: string; secure_token: string; qr_payload: string }> => {
    try {
      const res = await apiClient.post<any>('/qr', { appointment_id: appointmentId });
      if (res && res.reference_id) {
        return {
          reference_id: res.reference_id,
          secure_token: res.secure_token || res.token,
          qr_payload: res.qr_payload || `CHIKITSAX_SECURE_PASS:${res.reference_id}:${res.secure_token || res.token}`
        };
      }
    } catch (err) {
      console.warn('[qrService] Backend /api/qr failed, falling back to LocalDB format:', err);
    }
    const local = db.getOPDRegistrations().find(o => o.id === appointmentId || o.referenceId === appointmentId);
    const ref = local ? local.referenceId : appointmentId;
    const tok = local ? local.qrToken : `TOKEN_SECURE_${ref}`;
    return {
      reference_id: ref,
      secure_token: tok,
      qr_payload: `CHIKITSAX_SECURE_PASS:${ref}:${tok}`
    };
  },

  verifyPass: async (referenceId: string, staffName: string = 'Reception Desk Staff'): Promise<{ success: boolean; opd?: OPDRegistration; message: string }> => {
    try {
      const res = await apiClient.post<any>('/hospital/verify', { reference_id: referenceId, staff_name: staffName });
      if (res) {
        const isSuccess = Boolean(res.verified);
        let opdRecord: OPDRegistration | undefined = undefined;
        if (res.appointment) {
          opdRecord = {
            id: res.appointment.id || `opd-${res.reference_id}`,
            referenceId: res.reference_id || referenceId,
            patientId: res.appointment.patientId || 'usr-patient-1',
            patientName: res.appointment.patientName || 'Ramesh Sharma',
            patientPhone: res.appointment.patientPhone || '+91 98765 43210',
            hospitalId: 'hosp-1',
            hospitalName: res.appointment.hospitalName || res.hospital || 'CarePlus Super Specialty Hospital',
            department: res.appointment.department || res.department || 'Cardiology',
            doctorId: 'doc-1',
            doctorName: res.appointment.doctorName || res.doctor || 'Dr. Rajesh Kulkarni',
            appointmentDate: res.appointment.appointmentDate || res.appointment_date || 'Today',
            appointmentTime: res.appointment.appointmentTime || res.appointment_time || '11:30 AM',
            consultationFee: 800,
            status: 'VERIFIED',
            createdAt: new Date().toLocaleDateString('en-IN'),
            qrToken: `TOKEN_SECURE_${res.reference_id}`
          };
          db.createOPDRegistration(opdRecord);
        }
        return {
          success: isSuccess,
          opd: opdRecord,
          message: res.message || (isSuccess ? 'Verification successful' : 'Verification failed')
        };
      }
    } catch (err) {
      console.warn('[qrService] Backend /api/hospital/verify failed, falling back to LocalDB:', err);
    }
    return db.verifyQRPass(referenceId, staffName);
  }
};

/**
 * 1. AI Voice Intake API Service
 */
export const voiceService = {
  processVoiceTranscript: async (transcriptText: string, patientId: string = 'usr-patient-1'): Promise<SymptomIntake> => {
    try {
      const response = await apiClient.post<any>('/intake', {
        patient_id: patientId,
        transcript: transcriptText,
        language: 'en-IN',
        duration: '30s'
      });
      if (response && (response.id || response.intake_id)) {
        const intakeId = response.id || response.intake_id;
        const intake: SymptomIntake = {
          id: intakeId,
          patientId: response.patient_id || patientId,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          rawTranscript: response.raw_transcript || transcriptText,
          extractedSymptoms: response.extracted_symptoms || [],
          duration: response.duration || '24 Hours',
          severity: response.severity || 'Moderate',
          affectedBodyPart: response.affected_body_part || 'General',
          isEmergencyAlert: Boolean(response.is_emergency_alert)
        };
        db.addSymptomIntake(intake);
        return intake;
      }
    } catch (err) {
      console.warn('[voiceService] FastAPI /api/intake failed, falling back to LocalDB:', err);
    }
    return mockVoiceService.processVoiceTranscript(transcriptText);
  }
};

export const mockVoiceService = {
  processVoiceTranscript: async (transcriptText: string): Promise<SymptomIntake> => {
    const lower = transcriptText.toLowerCase();
    const symptoms: string[] = [];

    if (lower.includes('chest') || lower.includes('discomfort') || lower.includes('pressure')) symptoms.push('Chest Discomfort');
    if (lower.includes('breath') || lower.includes('breathing') || lower.includes('shortness')) symptoms.push('Shortness of Breath');
    if (lower.includes('fatigue') || lower.includes('tired') || lower.includes('weak')) symptoms.push('Fatigue');
    if (lower.includes('headache') || lower.includes('head') || lower.includes('migraine')) symptoms.push('Headache');
    if (lower.includes('dizzy') || lower.includes('dizziness')) symptoms.push('Dizziness');
    if (lower.includes('fever') || lower.includes('temperature') || lower.includes('chills')) symptoms.push('Fever');
    if (lower.includes('throat') || lower.includes('sore') || lower.includes('swallow')) symptoms.push('Sore Throat');
    if (lower.includes('cough') || lower.includes('cold') || lower.includes('sneeze')) symptoms.push('Cough & Cold');
    if (lower.includes('stomach') || lower.includes('abdominal') || lower.includes('nausea') || lower.includes('vomit') || lower.includes('belly')) symptoms.push('Abdominal Discomfort');
    if (lower.includes('back') || lower.includes('joint') || lower.includes('muscle') || lower.includes('leg')) symptoms.push('Joint / Muscle Pain');

    if (symptoms.length === 0) {
      symptoms.push(`Symptom: ${transcriptText.trim().substring(0, 35)}`);
    }

    let severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical' = 'Moderate';
    let isEmergency = false;

    if (lower.includes('severe') || lower.includes('intense') || lower.includes('radiating') || lower.includes('unbearable') || lower.includes('critical')) {
      severity = 'Severe';
      if (lower.includes('chest') || lower.includes('breath') || lower.includes('heart')) {
        isEmergency = true;
      }
    } else if (lower.includes('mild') || lower.includes('slight') || lower.includes('minor')) {
      severity = 'Mild';
    }

    let bodySystem = 'General / Constitutional';
    if (symptoms.some(s => s.includes('Chest') || s.includes('Breath'))) bodySystem = 'Cardiovascular / Thoracic';
    else if (symptoms.some(s => s.includes('Throat') || s.includes('Cough'))) bodySystem = 'Respiratory / ENT';
    else if (symptoms.some(s => s.includes('Abdominal'))) bodySystem = 'Gastrointestinal';
    else if (symptoms.some(s => s.includes('Headache') || s.includes('Dizziness'))) bodySystem = 'Neurological';

    let duration = '12 Hours';
    if (lower.includes('yesterday')) duration = '24 Hours';
    else if (lower.includes('2 days') || lower.includes('two days')) duration = '2 Days';
    else if (lower.includes('3 days') || lower.includes('three days')) duration = '3 Days';
    else if (lower.includes('week')) duration = '1 Week';

    const intake: SymptomIntake = {
      id: `intake-${Date.now()}`,
      patientId: db.getPatientProfile().userId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rawTranscript: transcriptText,
      extractedSymptoms: symptoms,
      duration,
      severity,
      affectedBodyPart: bodySystem,
      isEmergencyAlert: isEmergency
    };

    db.addSymptomIntake(intake);
    return intake;
  }
};

/**
 * 2. Medical Record OCR Upload API Service
 */
export const ocrService = {
  processUploadedFile: async (
    fileName: string,
    fileType: 'PDF' | 'JPG' | 'PNG',
    category: 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Radiology Report' | 'Other',
    fileObject?: File,
    patientId: string = 'usr-patient-1'
  ): Promise<MedicalRecord> => {
    try {
      let res: any;
      if (fileObject && fileObject.size > 0 && typeof FormData !== 'undefined') {
        const formData = new FormData();
        formData.append('patient_id', patientId);
        formData.append('category', category);
        formData.append('file', fileObject, fileName);
        res = await apiClient.postFormData<any>('/medical-records/upload', formData);
      } else {
        res = await apiClient.post<any>('/medical-records', {
          patient_id: patientId,
          file_name: fileName,
          file_type: fileType,
          category: category
        });
      }
      if (res && (res.id || res.record_id)) {
        const recId = res.id || res.record_id;
        const record: MedicalRecord = {
          id: recId,
          patientId: res.patient_id || patientId,
          fileName: res.file_name || fileName,
          fileType: (res.file_type || fileType).toUpperCase() as any,
          category: res.category || category,
          uploadDate: res.upload_date || new Date().toLocaleDateString('en-IN'),
          ocrExtractedData: res.ocr_extracted_data || res.extracted_fields || {},
          isVerifiedByPatient: Boolean(res.is_verified_by_patient ?? true)
        };
        db.addMedicalRecord(record);
        return record;
      }
    } catch (err) {
      console.warn('[ocrService] FastAPI /api/medical-records upload failed, falling back to LocalDB:', err);
    }
    return mockOCRService.processUploadedFile(fileName, fileType, category);
  }
};

export const mockOCRService = {
  processUploadedFile: async (
    fileName: string,
    fileType: 'PDF' | 'JPG' | 'PNG',
    category: 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Radiology Report' | 'Other'
  ): Promise<MedicalRecord> => {
    let ocrData: MedicalRecord['ocrExtractedData'] = {};

    if (category === 'Prescription') {
      ocrData = {
        doctorName: 'Dr. S. K. Mehta (MD Med)',
        hospitalName: 'Ruby General Clinic',
        previousCondition: 'Extracted from uploaded ' + fileName,
        medicinesExtracted: ['Metformin 500mg (1-0-1)', 'Telmisartan 40mg (1-0-0)', 'Atorvastatin 10mg (0-0-1)'],
        allergiesExtracted: ['Penicillin']
      };
    } else if (category === 'Lab Report') {
      ocrData = {
        labResults: [
          { testName: 'HbA1c (Glycated Hemoglobin)', value: '7.4', unit: '%', range: '< 5.7%' },
          { testName: 'Fasting Blood Glucose', value: '142', unit: 'mg/dL', range: '70 - 100 mg/dL' },
          { testName: 'Serum Creatinine', value: '0.95', unit: 'mg/dL', range: '0.7 - 1.2 mg/dL' }
        ],
        diagnosisExtracted: 'Extracted Lab Metrics from ' + fileName
      };
    } else {
      ocrData = {
        previousCondition: 'Extracted Record Summary',
        medicinesExtracted: ['Prescribed Medication from ' + fileName],
        diagnosisExtracted: 'Clinical observations extracted from file ' + fileName
      };
    }

    const record: MedicalRecord = {
      id: `rec-${Date.now()}`,
      patientId: db.getPatientProfile().userId,
      fileName,
      fileType,
      category,
      uploadDate: new Date().toLocaleDateString('en-IN'),
      ocrExtractedData: ocrData,
      isVerifiedByPatient: false
    };

    db.addMedicalRecord(record);
    return record;
  }
};

/**
 * 3. AI Triage Engine Service
 */
export const triageService = {
  runClinicalTriage: async (patientId: string = 'usr-patient-1'): Promise<TriageResult> => {
    try {
      const response = await apiClient.post<any>('/triage', { patient_id: patientId });
      if (response && (response.id || response.patient_id)) {
        const triage: TriageResult = {
          id: response.id || `tri-${Date.now()}`,
          patientId: response.patient_id || patientId,
          timestamp: new Date().toLocaleString('en-IN'),
          riskLevel: (response.risk_level || 'MODERATE').toUpperCase() as any,
          urgency: response.urgency || 'Prompt Consultation (24h)',
          symptomsConsidered: response.symptoms_considered || [],
          clinicalReasoning: response.reasoning || response.clinical_reasoning || [],
          recommendedSpecialty: Array.isArray(response.recommended_specialties)
            ? response.recommended_specialties.join(' / ')
            : response.recommended_specialty || 'General Medicine',
          recommendedNextStep: response.next_action || response.recommended_next_step || 'Consult Outpatient OPD',
          isEmergencyTriggered: Boolean(response.is_emergency_triggered || response.risk_level === 'HIGH')
        };
        db.saveTriageResult(triage);
        return triage;
      }
    } catch (err) {
      console.warn('[triageService] FastAPI /api/triage failed, falling back to LocalDB:', err);
    }
    return mockTriageService.runClinicalTriage();
  }
};

export const mockTriageService = {
  runClinicalTriage: async (): Promise<TriageResult> => {
    const profile = db.getPatientProfile();
    const intakes = db.getSymptomIntakes();
    const latestIntake = intakes.length > 0 ? intakes[0] : null;

    const hasChestSymptoms = profile.symptoms.some(s => s.toLowerCase().includes('chest'));
    const hasThroatFever = profile.symptoms.some(s => s.toLowerCase().includes('throat') || s.toLowerCase().includes('fever') || s.toLowerCase().includes('cough'));
    const isSevere = latestIntake?.severity === 'Severe' || latestIntake?.severity === 'Critical';

    let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' = 'MODERATE';
    let urgency: TriageResult['urgency'] = 'Prompt Consultation (24h)';
    let specialty = 'Cardiology & Internal Medicine';
    const reasoning: string[] = [];

    if (hasChestSymptoms && isSevere) {
      riskLevel = 'HIGH';
      urgency = 'Urgent Evaluation (Immediate)';
      specialty = 'Cardiology / Emergency Care';
      reasoning.push('Reported severe chest discomfort / cardiovascular pressure');
      reasoning.push('Recommendation: Seek immediate cardiac evaluation or emergency trauma care');
    } else if (hasChestSymptoms) {
      riskLevel = 'MODERATE';
      urgency = 'Prompt Consultation (24h)';
      specialty = 'Cardiology & Internal Medicine';
      reasoning.push('Cardiovascular chest discomfort noted with moderate duration');
      reasoning.push('Elective Cardiology consultation advised within 24 hours');
    } else if (hasThroatFever) {
      riskLevel = 'LOW';
      urgency = 'Routine Consultation';
      specialty = 'General Medicine / ENT';
      reasoning.push(`Active symptoms evaluated: ${profile.symptoms.join(', ')}`);
      reasoning.push('No acute cardiac red flags detected. Routine Outpatient OPD registration recommended.');
    } else {
      riskLevel = 'LOW';
      urgency = 'Routine Consultation';
      specialty = 'General Outpatient Medicine';
      reasoning.push(`Extracted symptoms evaluated: ${profile.symptoms.join(', ') || 'Mild Malaise'}`);
      reasoning.push('Routine Outpatient OPD booking suitable');
    }

    const triage: TriageResult = {
      id: `tri-${Date.now()}`,
      patientId: profile.userId,
      timestamp: new Date().toLocaleString('en-IN'),
      riskLevel,
      urgency,
      symptomsConsidered: profile.symptoms,
      clinicalReasoning: reasoning,
      recommendedSpecialty: specialty,
      recommendedNextStep: urgency === 'Urgent Evaluation (Immediate)'
        ? 'Proceed to nearest Emergency Trauma center or activate Emergency Pathway'
        : `Compare and select recommended ${specialty} OPD Hospital for registration`,
      isEmergencyTriggered: riskLevel === 'HIGH'
    };

    db.saveTriageResult(triage);
    return triage;
  }
};


/**
 * 4. Smart Hospital Recommendation Engine (CHIKITSAX Care Score)
 */
export const mockHospitalService = {
  getRankedHospitals: (filter?: 'CARE_SCORE' | 'LOWEST_COST' | 'NEAREST'): Hospital[] => {
    const hospitals = db.getHospitals();

    // Calculate CHIKITSAX Care Score formula for each
    const scored = hospitals.map(h => {
      const careScore = Math.round(
        (h.clinicalFitScore * 0.35) +
        (h.affordabilityScore * 0.25) +
        ((100 - (h.distanceKm * 5)) * 0.15) +
        (h.availabilityScore * 0.15) +
        (h.supportServicesScore * 0.10)
      );
      return { ...h, chikitsaxCareScore: Math.min(99, Math.max(70, careScore)) };
    });

    if (filter === 'LOWEST_COST') {
      return scored.sort((a, b) => a.estimatedCostRange.min - b.estimatedCostRange.min);
    } else if (filter === 'NEAREST') {
      return scored.sort((a, b) => a.distanceKm - b.distanceKm);
    }
    // Default: Sort by Care Score
    return scored.sort((a, b) => b.chikitsaxCareScore - a.chikitsaxCareScore);
  },

  getEmergencyHospitals: (): Hospital[] => {
    return db.getHospitals().filter(h => h.emergencyAvailable).sort((a, b) => a.distanceKm - b.distanceKm);
  }
};

/**
 * 5. OPD Registration & Secure QR Service
 */
export const mockOPDService = {
  bookAppointment: async (
    hospitalId: string,
    hospitalName: string,
    department: string,
    doctorId: string,
    doctorName: string,
    appointmentDate: string,
    appointmentTime: string
  ): Promise<OPDRegistration> => {
    await new Promise(r => setTimeout(r, 500));

    const profile = db.getPatientProfile();
    const randomHex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '8A92F');
    const referenceId = `CHX-2026-${randomHex}`;
    const qrToken = `TOKEN_SECURE_${referenceId}_${Date.now()}`;

    const opd: OPDRegistration = {
      id: `opd-${Date.now()}`,
      referenceId,
      patientId: profile.userId,
      patientName: profile.fullName,
      patientPhone: profile.phone,
      hospitalId,
      hospitalName,
      department,
      doctorId,
      doctorName,
      appointmentDate,
      appointmentTime,
      consultationFee: 800,
      status: 'CONFIRMED',
      createdAt: new Date().toLocaleDateString('en-IN'),
      qrToken
    };

    db.createOPDRegistration(opd);
    return opd;
  }
};

/**
 * 6. Doctor Consultation & Cost Estimate Service
 */
export const mockDoctorService = {
  createTreatmentCostEstimate: async (
    hospitalId: string,
    hospitalName: string,
    procedureName: string,
    roomCategory: string,
    procedureCost: number,
    roomCharges: number,
    investigationCost: number,
    medicationCost: number,
    otherCharges: number
  ): Promise<TreatmentCostEstimate> => {
    await new Promise(r => setTimeout(r, 400));

    const totalMin = Math.round((procedureCost + roomCharges + investigationCost + medicationCost + otherCharges) * 0.9);
    const totalMax = Math.round((procedureCost + roomCharges + investigationCost + medicationCost + otherCharges) * 1.15);

    const estimate: TreatmentCostEstimate = {
      id: `est-${Date.now()}`,
      patientId: db.getPatientProfile().userId,
      hospitalId,
      hospitalName,
      procedureName,
      roomCategory,
      estimatedCostRange: { min: totalMin, max: totalMax },
      breakdown: {
        procedureCost,
        roomCharges,
        investigationCost,
        medicationCost,
        otherCharges
      },
      confidenceLevel: 'MEDIUM',
      createdAt: new Date().toLocaleDateString('en-IN')
    };

    db.saveCostEstimate(estimate);
    return estimate;
  }
};

/**
 * 7. Financial Support & Gap Calculation Service
 */
export const mockFinanceService = {
  checkGovSchemeEligibility: (): SchemeEligibilityResult[] => {
    const profile = db.getPatientProfile();
    const schemes = db.getGovSchemes();

    return schemes.map(s => {
      const isIncomeEligible = Boolean(profile.rationCardType === 'BPL' || profile.incomeCategory?.includes('<'));

      return {
        schemeId: s.id,
        schemeName: s.schemeName,
        isEligible: isIncomeEligible,
        matchingCriteria: isIncomeEligible
          ? ['BPL Ration Card Holder', 'Income below statutory ceiling', 'Empaneled Specialty Match']
          : ['General Ration Category'],
        potentialSupportAmount: isIncomeEligible ? Math.min(s.maxBenefitAmount, 150000) : 0,
        applicationStatus: isIncomeEligible ? 'APPLIED' : 'NOT_APPLIED'
      };
    });
  },

  calculateCareToCost: (
    estimatedCost: number,
    insuranceAmount: number,
    govSchemeAmount: number,
    ngoAmount: number,
    selfPayAmount: number
  ): CareToCostAssessment => {
    const totalAid = insuranceAmount + govSchemeAmount + ngoAmount + selfPayAmount;
    const gap = Math.max(0, estimatedCost - totalAid);

    const assessment: CareToCostAssessment = {
      id: `ctc-${Date.now()}`,
      patientId: db.getPatientProfile().userId,
      hospitalName: 'CarePlus Super Specialty Hospital',
      estimatedTreatmentCost: estimatedCost,
      insuranceCoverage: insuranceAmount,
      governmentSupport: govSchemeAmount,
      ngoAssistance: ngoAmount,
      patientSelfContribution: selfPayAmount,
      financialGap: gap,
      isFundingComplete: gap === 0,
      calculatedAt: new Date().toLocaleString('en-IN')
    };

    db.saveCareToCostAssessment(assessment);
    return assessment;
  },

  getFinanceScenarios: (baseCost: number): FinanceScenario[] => {
    return [
      {
        id: 'scen-a',
        scenarioTitle: 'Scenario A: Selected Hospital (CarePlus Tertiary)',
        hospitalName: 'CarePlus Super Specialty',
        estimatedCost: baseCost,
        insuranceBenefit: 60000,
        governmentBenefit: 30000,
        ngoBenefit: 15000,
        patientOutofPocket: 15000,
        remainingGap: 0,
        recommendationTag: 'CURRENT SELECTION'
      },
      {
        id: 'scen-b',
        scenarioTitle: 'Scenario B: AIIMS Public Referral (Full Subsidy)',
        hospitalName: 'AIIMS Regional Emergency Center',
        estimatedCost: 35000,
        insuranceBenefit: 0,
        governmentBenefit: 35000,
        ngoBenefit: 0,
        patientOutofPocket: 0,
        remainingGap: 0,
        recommendationTag: 'LOWEST OUT-OF-POCKET'
      },
      {
        id: 'scen-c',
        scenarioTitle: 'Scenario C: Community Hospital (Empaneled MJPJAY)',
        hospitalName: 'City Community Health Center',
        estimatedCost: 55000,
        insuranceBenefit: 30000,
        governmentBenefit: 25000,
        ngoBenefit: 0,
        patientOutofPocket: 0,
        remainingGap: 0,
        recommendationTag: 'ZERO GAP ALTERNATIVE'
      }
    ];
  }
};
