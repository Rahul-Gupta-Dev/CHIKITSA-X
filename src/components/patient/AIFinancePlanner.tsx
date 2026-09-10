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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '850px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span className="badge badge-purple">AI SCENARIO PLANNER</span>
            <h3 style={{ color: 'var(--text-heading)', fontSize: '1.4rem', margin: '4px 0 0' }}>Care-to-Cost AI Finance Scenario Comparison</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}>
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
                  background: isSelected ? 'rgba(2, 132, 199, 0.08)' : 'var(--bg-subtle)',
                  border: `2px solid ${isSelected ? 'var(--primary-teal)' : 'var(--border-light)'}`,
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
                  <h4 style={{ color: 'var(--text-heading)', fontSize: '1.05rem', margin: '6px 0 12px' }}>{scen.scenarioTitle}</h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem', color: 'var(--text-main)', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Estimated Cost:</span>
                      <strong style={{ color: 'var(--text-heading)' }}>₹{scen.estimatedCost.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Insurance:</span>
                      <span style={{ color: 'var(--primary-teal-dark)', fontWeight: 600 }}>-₹{scen.insuranceBenefit.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Gov Scheme:</span>
                      <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>-₹{scen.governmentBenefit.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>NGO Aid:</span>
                      <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>-₹{scen.ngoBenefit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '10px 12px', borderRadius: '10px', marginTop: 'auto' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>NET PATIENT OUT-OF-POCKET GAP:</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: scen.remainingGap === 0 ? 'var(--accent-green)' : 'var(--warning-amber)', fontFamily: 'Outfit' }}>
                    ₹{scen.remainingGap.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Savings Insight Banner */}
        <div style={{ background: 'rgba(21, 128, 61, 0.1)', border: '1px solid var(--accent-green)', borderRadius: '14px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.95rem' }}>
              💡 Potential Out-of-Pocket Savings: ₹15,000
            </div>
            <div style={{ color: 'var(--text-main)', fontSize: '0.82rem', marginTop: '2px' }}>
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
