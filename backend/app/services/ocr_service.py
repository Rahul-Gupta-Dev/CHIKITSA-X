import datetime
from typing import Dict, Any

class OCRService:
    """
    Deterministic Development OCR Service Abstraction for Phase 1.
    Later, external OCR providers (e.g. Google Vision / AWS Textract / Tesseract)
    can implement this same interface.
    """
    @staticmethod
    def extract_text(file_content: bytes, file_name: str) -> str:
        # Dev adapter: Returns clean text representation
        return f"Development OCR text extracted from {file_name}"

    @staticmethod
    def extract_medical_fields(raw_text: str, category: str) -> Dict[str, Any]:
        category_lower = category.lower()
        if "prescription" in category_lower:
            return {
                "previousCondition": "Cardiovascular Evaluation",
                "medicinesExtracted": ["Atorvastatin 20mg OD", "Amlodipine 5mg OD"],
                "allergiesExtracted": ["Penicillin"],
                "diagnosisExtracted": "Essential Hypertension with Mild Dyslipidemia",
                "doctorName": "Dr. Rajesh Kulkarni",
                "hospitalName": "CarePlus Super Specialty Hospital"
            }
        elif "lab" in category_lower:
            return {
                "previousCondition": "Diabetic Health Check",
                "labResults": [
                    {"testName": "HbA1c", "value": "7.1", "unit": "%", "range": "4.0 - 5.6"},
                    {"testName": "Fasting Blood Sugar", "value": "134", "unit": "mg/dL", "range": "70 - 100"},
                    {"testName": "Serum Creatinine", "value": "0.9", "unit": "mg/dL", "range": "0.6 - 1.2"}
                ],
                "doctorName": "Dr. Ananya Roy",
                "hospitalName": "CarePlus Super Specialty Hospital"
            }
        else:
            return {
                "previousCondition": "General Medical Record",
                "medicinesExtracted": ["Metformin 500mg BD"],
                "allergiesExtracted": ["Penicillin"],
                "hospitalName": "CarePlus Hospital"
            }
