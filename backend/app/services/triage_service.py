from typing import Dict, Any, List

class TriageService:
    """
    Triage Service Engine for Phase 1.
    Evaluates patient symptoms, medical history, and intake details
    to produce AI-assisted clinical risk triage and specialty recommendations.
    
    IMPORTANT LEGAL / MEDICAL DISCLAIMER:
    AI-Assisted Triage only. This system does NOT provide a medical diagnosis.
    Final clinical decisions remain with qualified healthcare professionals.
    """
    @staticmethod
    def evaluate_triage(symptoms: List[str], medical_history: List[str], is_emergency: bool = False) -> Dict[str, Any]:
        symptoms_str = " ".join(symptoms).lower()
        history_str = " ".join(medical_history).lower()

        has_chest_pain = "chest" in symptoms_str
        has_breathlessness = "breath" in symptoms_str or "shortness" in symptoms_str
        has_cardiac_history = any(term in history_str for term in ["diabetes", "hypertension", "cardiac", "heart", "blood pressure"])

        if is_emergency or (has_chest_pain and has_breathlessness and has_cardiac_history):
            risk_level = "HIGH"
            urgency = "Urgent Evaluation (Immediate)"
            recommended_specialty = "Cardiology & Emergency Medicine"
            recommended_next_step = "Proceed to nearest Tertiary Emergency Room with Trauma Cath Lab immediately."
            is_emergency_triggered = True
            reasoning = [
                "High-risk combination of chest discomfort with exertion and dyspnea.",
                "Co-existing cardiovascular risk factors (Diabetes / Hypertension history noted).",
                "Immediate interventional cardiology screening and ECG recommended within 1 hour."
            ]
        elif has_chest_pain or has_breathlessness:
            risk_level = "MODERATE"
            urgency = "Prompt Consultation (24h)"
            recommended_specialty = "Cardiology & Internal Medicine"
            recommended_next_step = "Schedule priority OPD consultation within 24 hours."
            is_emergency_triggered = False
            reasoning = [
                "Cardiovascular chest discomfort noted with moderate duration.",
                "Patient is on regular anti-hypertensive / diabetic therapy.",
                "Elective Cardiology consultation advised within 24 hours."
            ]
        else:
            risk_level = "LOW"
            urgency = "Routine Consultation"
            recommended_specialty = "General Medicine / Family Physician"
            recommended_next_step = "Schedule routine OPD consultation at convenient time slot."
            is_emergency_triggered = False
            reasoning = [
                "Mild symptom profile without acute red-flag distress indicators.",
                "Routine clinical evaluation and vital check advised."
            ]

        return {
            "risk_level": risk_level,
            "urgency": urgency,
            "symptoms_considered": symptoms,
            "clinical_reasoning": reasoning,
            "recommended_specialty": recommended_specialty,
            "recommended_next_step": recommended_next_step,
            "is_emergency_triggered": is_emergency_triggered
        }
