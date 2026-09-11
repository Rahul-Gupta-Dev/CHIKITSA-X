from typing import List, Dict, Any

class HospitalRecommendationService:
    """
    Care Score Hospital Recommendation Engine for Phase 1.
    Ranks hospitals based on weighted Care Score:
      - Clinical Fit = 35%
      - Affordability = 25%
      - Distance = 15%
      - Availability = 15%
      - Financial Support = 10%
    """
    @staticmethod
    def calculate_care_score(hospital: Dict[str, Any], budget_preference: str = "MEDIUM", target_specialty: str = None) -> float:
        fit = float(hospital.get("clinical_fit_score", 85))
        afford = float(hospital.get("affordability_score", 80))
        dist = float(hospital.get("distance_km", 5.0))
        avail = float(hospital.get("availability_score", 85))
        support = float(hospital.get("support_services_score", 85))

        # Distance score: 100 for < 2km, decays by 5 per km
        distance_score = max(50.0, 100.0 - (dist * 5.0))

        # Adjust affordability score based on budget preference
        if budget_preference == "LOW":
            afford = min(100.0, afford * 1.15)
        elif budget_preference == "HIGH":
            fit = min(100.0, fit * 1.1)

        care_score = (
            (fit * 0.35) +
            (afford * 0.25) +
            (distance_score * 0.15) +
            (avail * 0.15) +
            (support * 0.10)
        )
        return round(care_score, 1)

    @classmethod
    def rank_hospitals(cls, hospitals: List[Dict[str, Any]], budget_preference: str = "MEDIUM") -> List[Dict[str, Any]]:
        ranked = []
        for h in hospitals:
            score = cls.calculate_care_score(h, budget_preference)
            h_copy = dict(h)
            h_copy["chikitsax_care_score"] = score
            ranked.append(h_copy)

        ranked.sort(key=lambda x: x["chikitsax_care_score"], reverse=True)
        return ranked
