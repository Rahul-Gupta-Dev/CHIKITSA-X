import type {
  SymptomIntake,
  MedicalRecord,
  TriageResult,
  Hospital,
  OPDRegistration,
  TreatmentCostEstimate,
  SchemeEligibilityResult,
  CareToCostAssessment,
  FinanceScenario
} from '../types';
import { db } from '../db/database';

/**
 * 1. AI Voice Intake API Service
 */
export const mockVoiceService = {
  processVoiceTranscript: async (transcriptText: string): Promise<SymptomIntake> => {
    // Simulate API processing delay
    await new Promise(r => setTimeout(r, 600));

    const lower = transcriptText.toLowerCase();
    const symptoms: string[] = [];

    if (lower.includes('chest') || lower.includes('pain') || lower.includes('discomfort')) symptoms.push('Chest Discomfort');
    if (lower.includes('breath') || lower.includes('breathing') || lower.includes('shortness')) symptoms.push('Shortness of Breath');
    if (lower.includes('fatigue') || lower.includes('tired') || lower.includes('weak')) symptoms.push('Fatigue on Walking');
    if (lower.includes('headache') || lower.includes('dizzy')) symptoms.push('Dizziness');
    if (lower.includes('fever') || lower.includes('temperature')) symptoms.push('Fever');

    if (symptoms.length === 0) symptoms.push('Reported Malaise', 'Unspecified Chest Pressure');

    let severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical' = 'Moderate';
    let isEmergency = false;

    if (lower.includes('severe') || lower.includes('intense') || lower.includes('radiating') || lower.includes('arm')) {
      severity = 'Severe';
      isEmergency = true;
    } else if (lower.includes('mild')) {
      severity = 'Mild';
    }

    const intake: SymptomIntake = {
      id: `intake-${Date.now()}`,
      patientId: db.getPatientProfile().userId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rawTranscript: transcriptText,
      extractedSymptoms: symptoms,
      duration: lower.includes('yesterday') ? '24 Hours' : lower.includes('days') ? '3 Days' : '12 Hours',
      severity,
      affectedBodyPart: 'Cardiovascular / Thoracic',
      isEmergencyAlert: isEmergency
    };

    db.addSymptomIntake(intake);
    return intake;
  }
};

/**
 * 2. Medical Record OCR Upload API Service
 */
export const mockOCRService = {
  processUploadedFile: async (
    fileName: string,
    fileType: 'PDF' | 'JPG' | 'PNG',
    category: 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Radiology Report' | 'Other'
  ): Promise<MedicalRecord> => {
    await new Promise(r => setTimeout(r, 800)); // Simulate OCR extraction pipeline

    let ocrData: MedicalRecord['ocrExtractedData'] = {};

    if (category === 'Prescription') {
      ocrData = {
        doctorName: 'Dr. S. K. Mehta (MD Med)',
        hospitalName: 'Ruby General Clinic',
        previousCondition: 'Hypertension & Type 2 Diabetes',
        medicinesExtracted: ['Metformin 500mg (1-0-1)', 'Telmisartan 40mg (1-0-0)', 'Atorvastatin 10mg (0-0-1)'],
        allergiesExtracted: ['Penicillin']
      };
    } else if (category === 'Lab Report') {
      ocrData = {
        labResults: [
          { testName: 'HbA1c (Glycated Hemoglobin)', value: '7.4', unit: '%', range: '< 5.7%' },
          { testName: 'Fasting Blood Glucose', value: '142', unit: 'mg/dL', range: '70 - 100 mg/dL' },
          { testName: 'Serum Creatinine', value: '0.95', unit: 'mg/dL', range: '0.7 - 1.2 mg/dL' },
          { testName: 'Total Cholesterol', value: '215', unit: 'mg/dL', range: '< 200 mg/dL' }
        ],
        diagnosisExtracted: 'Mild Dyslipidemia & Sub-optimal Glycemic Control'
      };
    } else if (category === 'Discharge Summary') {
      ocrData = {
        previousCondition: 'Observation for Chest Pain (Non-cardiac 2023)',
        medicinesExtracted: ['Aspirin 75mg OD', 'Clopidogrel 75mg OD'],
        diagnosisExtracted: 'Stable Angina Evaluation Recommended'
      };
    } else {
      ocrData = {
        previousCondition: 'Routine Health Checkup',
        medicinesExtracted: ['Vitamin D3 60k IU'],
        diagnosisExtracted: 'Mild Vitamin D Deficiency'
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
export const mockTriageService = {
  runClinicalTriage: async (): Promise<TriageResult> => {
    await new Promise(r => setTimeout(r, 700));

    const profile = db.getPatientProfile();
    const intakes = db.getSymptomIntakes();
    const latestIntake = intakes.length > 0 ? intakes[0] : null;

    const hasChestSymptoms = profile.symptoms.some(s => s.toLowerCase().includes('chest'));
    const isSevere = latestIntake?.severity === 'Severe' || latestIntake?.severity === 'Critical';

    let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' = 'MODERATE';
    let urgency: TriageResult['urgency'] = 'Prompt Consultation (24h)';
    const reasoning: string[] = [];

    if (hasChestSymptoms && isSevere) {
      riskLevel = 'HIGH';
      urgency = 'Urgent Evaluation (Immediate)';
      reasoning.push('Reported severe chest tightness combined with acute onset shortness of breath');
      reasoning.push('Pre-existing risk factors present: Type 2 Diabetes Mellitus & Mild Hypertension');
      reasoning.push('Recommendation: Seek immediate cardiac evaluation or emergency care');
    } else if (hasChestSymptoms) {
      riskLevel = 'MODERATE';
      urgency = 'Prompt Consultation (24h)';
      reasoning.push('Cardiovascular chest discomfort noted with moderate duration');
      reasoning.push('Patient is on Metformin & Telmisartan (Diabetic + Hypertensive history)');
      reasoning.push('Elective Cardiology consultation advised within 24 hours');
    } else {
      riskLevel = 'LOW';
      urgency = 'Routine Consultation';
      reasoning.push('Mild constitutional symptoms without active signs of cardiac compromise');
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
      recommendedSpecialty: 'Cardiology & Internal Medicine',
      recommendedNextStep: urgency === 'Urgent Evaluation (Immediate)'
        ? 'Proceed to nearest Emergency Trauma center or activate Emergency Pathway'
        : 'Compare and select recommended Cardiology OPD Hospital for registration',
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
