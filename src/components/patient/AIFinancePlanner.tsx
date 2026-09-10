import React, { useState } from 'react';
import { mockFinanceService } from '../../services/apiServices';
import { db } from '../../db/database';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AIFinancePlanner: React.FC<Props> = ({ isOpen, onClose }) => {
  const latestCost = db.getLatestCostEstimate();
  const baseCost = latestCost ? latestCost.estimatedCostRange.min : 120000;

  const scenarios = mockFinanceService.getFinanceScenarios(baseCost);
  const [selectedScenario, setSelectedScenario] = useState<string>(scenarios[0].id);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '850px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span className="badge badge-purple">AI SCENARIO PLANNER</span>
            <h3 style={{ color: '#FFF', fontSize: '1.4rem', margin: '4px 0 0' }}>Care-to-Cost AI Finance Scenario Comparison</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <DisclaimerBanner type="FINANCIAL" text="Financial figures are calculated based on hospital tier tariffs and scheme eligibility logic." />

        {/* Scenarios Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', margin: '20px 0' }}>
          {scenarios.map((scen) => {
            const isSelected = selectedScenario === scen.id;

            return (
              <div
                key={scen.id}
                onClick={() => setSelectedScenario(scen.id)}
                style={{
                  background: isSelected ? 'rgba(0, 180, 216, 0.15)' : 'rgba(15, 23, 42, 0.7)',
                  border: `2px solid ${isSelected ? '#00B4D8' : 'rgba(255, 255, 255, 0.12)'}`,
                  borderRadius: '16px',
                  padding: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s'
                }}
              >
                <div>
                  <span className={`badge ${scen.remainingGap === 0 ? 'badge-green' : 'badge-teal'}`} style={{ marginBottom: '8px' }}>
                    {scen.recommendationTag}
                  </span>
                  <h4 style={{ color: '#FFF', fontSize: '1.05rem', margin: '6px 0 12px' }}>{scen.scenarioTitle}</h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: '#CBD5E1', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94A3B8' }}>Estimated Cost:</span>
                      <strong>₹{scen.estimatedCost.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94A3B8' }}>Insurance:</span>
                      <span style={{ color: '#00B4D8' }}>-₹{scen.insuranceBenefit.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94A3B8' }}>Gov Scheme:</span>
                      <span style={{ color: '#10B981' }}>-₹{scen.governmentBenefit.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94A3B8' }}>NGO Aid:</span>
                      <span style={{ color: '#A78BFA' }}>-₹{scen.ngoBenefit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(10, 25, 47, 0.8)', padding: '10px 12px', borderRadius: '10px', marginTop: 'auto' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>NET PATIENT OUT-OF-POCKET GAP:</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: scen.remainingGap === 0 ? '#10B981' : '#F59E0B', fontFamily: 'Outfit' }}>
                    ₹{scen.remainingGap.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Savings Insight Banner */}
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', borderRadius: '14px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#10B981', fontWeight: 700, fontSize: '0.95rem' }}>
              💡 Potential Out-of-Pocket Savings: ₹15,000
            </div>
            <div style={{ color: '#CBD5E1', fontSize: '0.82rem', marginTop: '2px' }}>
              By choosing Scenario B (AIIMS Referral) or applying full MJPJAY Gov scheme in Scenario C, your net financial gap becomes ₹0.
            </div>
          </div>
          <button onClick={onClose} className="btn btn-green">
            Confirm Preferred Scenario ✓
          </button>
        </div>
      </div>
    </div>
  );
};
