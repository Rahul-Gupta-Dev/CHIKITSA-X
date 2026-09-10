import React, { useState } from 'react';
import { mockDoctorService } from '../../services/apiServices';
import type { TreatmentCostEstimate } from '../../types';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { Calculator, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  hospitalName: string;
  onClose: () => void;
  onEstimateGenerated: (estimate: TreatmentCostEstimate) => void;
}

export const TreatmentCostGenerator: React.FC<Props> = ({
  isOpen,
  hospitalName,
  onClose,
  onEstimateGenerated
}) => {
  const [procedureName, setProcedureName] = useState('Coronary Angiography & Stenting Evaluation');
  const [roomCategory, setRoomCategory] = useState('Semi-Private AC Ward');
  const [procedureCost, setProcedureCost] = useState(65000);
  const [roomCharges, setRoomCharges] = useState(15000);
  const [investigationCost, setInvestigationCost] = useState(12000);
  const [medicationCost, setMedicationCost] = useState(8000);
  const [otherCharges, setOtherCharges] = useState(5000);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const est = await mockDoctorService.createTreatmentCostEstimate(
        'hosp-1',
        hospitalName,
        procedureName,
        roomCategory,
        procedureCost,
        roomCharges,
        investigationCost,
        medicationCost,
        otherCharges
      );
      onEstimateGenerated(est);
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  const totalCalc = procedureCost + roomCharges + investigationCost + medicationCost + otherCharges;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, #10B981 0%, #00B4D8 100%)', padding: '8px', borderRadius: '10px', color: '#FFF' }}>
              <Calculator size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#FFF', margin: 0 }}>Treatment Cost Estimate Generator</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: 0 }}>Generate indicative cost range for financial planning</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <DisclaimerBanner type="FINANCIAL" text="Treatment costs are indicative estimates based on current hospital procedure tariffs. Final billing depends on actual clinical duration." />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
          <div>
            <label className="form-label">Procedure / Treatment Name:</label>
            <input
              type="text"
              value={procedureName}
              onChange={(e) => setProcedureName(e.target.value)}
              className="form-control"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label">Room / Bed Category:</label>
              <select value={roomCategory} onChange={(e) => setRoomCategory(e.target.value)} className="form-control">
                <option value="General Ward" style={{ background: '#1C2541' }}>General Ward</option>
                <option value="Semi-Private AC Ward" style={{ background: '#1C2541' }}>Semi-Private AC Ward</option>
                <option value="Private Deluxe Room" style={{ background: '#1C2541' }}>Private Deluxe Room</option>
                <option value="Cardiac ICU" style={{ background: '#1C2541' }}>Cardiac ICU</option>
              </select>
            </div>

            <div>
              <label className="form-label">Procedure Charges (₹):</label>
              <input
                type="number"
                value={procedureCost}
                onChange={(e) => setProcedureCost(Number(e.target.value))}
                className="form-control"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label className="form-label">Room (₹):</label>
              <input
                type="number"
                value={roomCharges}
                onChange={(e) => setRoomCharges(Number(e.target.value))}
                className="form-control"
              />
            </div>

            <div>
              <label className="form-label">Investigations (₹):</label>
              <input
                type="number"
                value={investigationCost}
                onChange={(e) => setInvestigationCost(Number(e.target.value))}
                className="form-control"
              />
            </div>

            <div>
              <label className="form-label">Medicines (₹):</label>
              <input
                type="number"
                value={medicationCost}
                onChange={(e) => setMedicationCost(Number(e.target.value))}
                className="form-control"
              />
            </div>

            <div>
              <label className="form-label">Other (₹):</label>
              <input
                type="number"
                value={otherCharges}
                onChange={(e) => setOtherCharges(Number(e.target.value))}
                className="form-control"
              />
            </div>
          </div>
        </div>

        {/* Live Calculation Output Card */}
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', borderRadius: '14px', padding: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#94A3B8', fontSize: '0.82rem' }}>INDICATIVE ESTIMATED COST RANGE</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10B981', fontFamily: 'Outfit' }}>
              ₹{Math.round(totalCalc * 0.9).toLocaleString()} – ₹{Math.round(totalCalc * 1.15).toLocaleString()}
            </div>
          </div>
          <span className="badge badge-green">CONFIDENCE: MEDIUM</span>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleGenerate} disabled={isGenerating} className="btn btn-green">
            {isGenerating ? 'Calculating Estimate...' : 'Save & Pass to Financial Planner ✓'}
          </button>
        </div>
      </div>
    </div>
  );
};
