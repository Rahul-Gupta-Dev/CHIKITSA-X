from typing import List, Dict, Any

class VoiceIntakeService:
    """
    Voice Intake Service Abstraction for Phase 1.
    Receives transcript captured by browser Speech API and extracts symptoms.
    """
    @staticmethod
    def process_transcript(raw_transcript: str) -> Dict[str, Any]:
        text_lower = raw_transcript.lower()
        extracted_symptoms: List[str] = []
        is_emergency = False
        severity = "Moderate"

        if "chest" in text_lower or "pain" in text_lower or "tightness" in text_lower:
            extracted_symptoms.append("Chest Tightness")
        if "breath" in text_lower or "breathing" in text_lower or "saans" in text_lower:
            extracted_symptoms.append("Shortness of Breath")
        if "fatigue" in text_lower or "tired" in text_lower or "thakavat" in text_lower:
            extracted_symptoms.append("Fatigue on Walking")
        if "fever" in text_lower or "bukhar" in text_lower:
            extracted_symptoms.append("Fever")
        if "headache" in text_lower or "sir dard" in text_lower:
            extracted_symptoms.append("Headache")

        if not extracted_symptoms:
            extracted_symptoms = ["Reported Symptom Discomfort"]

        if any(term in text_lower for term in ["severe", "crushing", "sweating", "dizziness", "faint", "behoshi"]):
            is_emergency = True
            severity = "Severe"
        elif "chest" in text_lower and "breath" in text_lower:
            severity = "Moderate"

        return {
            "extracted_symptoms": extracted_symptoms,
            "duration": "Recent onset (1-3 days)",
            "severity": severity,
            "affected_body_part": "Cardiovascular / Respiratory",
            "is_emergency_alert": is_emergency
        }
