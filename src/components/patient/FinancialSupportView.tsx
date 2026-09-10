import React, { useState } from 'react';
import { mockFinanceService } from '../../services/apiServices';
import { db } from '../../db/database';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { ShieldCheck, Award, HeartHandshake, CheckCircle2, Layers } from 'lucide-react';

interface Props {
  onOpenPlanner: () => void;
}

export const FinancialSupportView: React.FC<Props> = ({ onOpenPlanner }) => {
  const latestCost = db.getLatestCostEstimate();
  const estimatedCost = latestCost ? latestCost.estimatedCostRange.min : 120000;

  const [insuranceAmount] = useState(60000);
  const [govSchemeAmount] = useState(30000);
  const [ngoAmount, setNgoAmount] = useState(15000);
  const [selfPayAmount, setSelfPayAmount] = useState(15000);

  const [isInsuranceApplied, setIsInsuranceApplied] = useState(true);
  const [isSchemeApplied, setIsSchemeApplied] = useState(true);

  const schemeEligibility = mockFinanceService.checkGovSchemeEligibility();
  const ngoList = db.getNGOSupport();

  const totalFunding = (isInsuranceApplied ? insuranceAmount : 0) +
                       (isSchemeApplied ? govSchemeAmount : 0) +
                       ngoAmount +
                       selfPayAmount;

  const financialGap = Math.max(0, estimatedCost - totalFunding);

  const handleApplyNGO = (ngoId: string) => {
    db.updateNGOStatus(ngoId, 'APPLIED');
    setNgoAmount(ngoAmount + 10000);
  };

  const handleSaveAssessment = () => {
    mockFinanceService.calculateCareToCost(
      estimatedCost,
      isInsuranceApplied ? insuranceAmount : 0,
      isSchemeApplied ? govSchemeAmount : 0,
      ngoAmount,
      selfPayAmount
    );
    alert('Care-to-Cost Financial Assessment Saved successfully!');
  };

  return (
    <div style={{ padding: '10px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span className="badge badge-green">CORE FINTECH MODULE</span>
          <h2 style={{ fontSize: '1.8rem', color: '#FFF', margin: '4px 0 0' }}>Care-to-Cost & Financial Assistance Platform</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', margin: 0 }}>
            Bridge your medical treatment gap by combining Insurance + Ayushman Bharat PM-JAY + NGO/CSR Grants
          </p>
        </div>

        <button onClick={onOpenPlanner} className="btn btn-purple">
          <Layers size={18} /> Launch AI Finance Scenario Planner
        </button>
      </div>

      <DisclaimerBanner type="FINANCIAL" text="All scheme eligibility, insurance cashless approvals, and NGO grants are estimated based on prototype rules." />

      {/* Main Financial Gap Calculation Card */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '28px', border: '1px solid #10B981' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>CURRENT TREATMENT COST ESTIMATE</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FFF', fontFamily: 'Outfit' }}>
              ₹{estimatedCost.toLocaleString()}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>REMAINING FINANCIAL GAP</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: financialGap === 0 ? '#10B981' : '#F59E0B', fontFamily: 'Outfit' }}>
              ₹{financialGap.toLocaleString()}
            </div>
            {financialGap === 0 && <span className="badge badge-green">✓ 100% FUNDED - ZERO GAP</span>}
          </div>
        </div>

        {/* Live Formula Stack Visualizer */}
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.82rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            Care-to-Cost Funding Stack Breakdown:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', textAlign: 'center' }}>
            <div style={{ background: 'rgba(0, 180, 216, 0.15)', border: '1px solid #00B4D8', borderRadius: '12px', padding: '12px' }}>
              <div style={{ color: '#00B4D8', fontSize: '0.78rem', fontWeight: 600 }}>1. Private Insurance</div>
              <div style={{ color: '#FFF', fontWeight: 700, fontSize: '1.2rem', marginTop: '2px' }}>
                ₹{(isInsuranceApplied ? insuranceAmount : 0).toLocaleString()}
              </div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', borderRadius: '12px', padding: '12px' }}>
              <div style={{ color: '#10B981', fontSize: '0.78rem', fontWeight: 600 }}>2. PM-JAY / Gov Scheme</div>
              <div style={{ color: '#FFF', fontWeight: 700, fontSize: '1.2rem', marginTop: '2px' }}>
                ₹{(isSchemeApplied ? govSchemeAmount : 0).toLocaleString()}
              </div>
            </div>

            <div style={{ background: 'rgba(124, 58, 237, 0.15)', border: '1px solid #7C3AED', borderRadius: '12px', padding: '12px' }}>
              <div style={{ color: '#A78BFA', fontSize: '0.78rem', fontWeight: 600 }}>3. NGO / CSR Grants</div>
              <div style={{ color: '#FFF', fontWeight: 700, fontSize: '1.2rem', marginTop: '2px' }}>
                ₹{ngoAmount.toLocaleString()}
              </div>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #F59E0B', borderRadius: '12px', padding: '12px' }}>
              <div style={{ color: '#FBBF24', fontSize: '0.78rem', fontWeight: 600 }}>4. Patient Out-of-Pocket</div>
              <div style={{ color: '#FFF', fontWeight: 700, fontSize: '1.2rem', marginTop: '2px' }}>
                ₹{selfPayAmount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Interactive Self-Pay Slider */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '4px' }}>
              <span>Adjust Patient Out-of-Pocket Self Contribution:</span>
              <strong style={{ color: '#FBBF24' }}>₹{selfPayAmount.toLocaleString()}</strong>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={selfPayAmount}
              onChange={(e) => setSelfPayAmount(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#F59E0B', cursor: 'pointer' }}
            />
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <button onClick={handleSaveAssessment} className="btn btn-green">
            <CheckCircle2 size={16} /> Save Care-to-Cost Assessment
          </button>
        </div>
      </div>

      {/* 3 Columns for Insurance, Gov Schemes, NGO */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Column 1: Insurance */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <ShieldCheck size={22} color="#00B4D8" />
            <h3 style={{ fontSize: '1.15rem', color: '#FFF', margin: 0 }}>Insurance Coverage Desk</h3>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '10px', marginBottom: '14px', fontSize: '0.85rem' }}>
            <div style={{ color: '#FFF', fontWeight: 600 }}>Star Health Comprehensive Policy</div>
            <div style={{ color: '#94A3B8' }}>Policy: SH-2024-998124 • Cashless Active</div>
            <div style={{ color: '#10B981', fontWeight: 600, marginTop: '4px' }}>Sum Insured: ₹5,00,000</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '14px' }}>
            <span>Include Cashless Claim (₹60,000):</span>
            <input
              type="checkbox"
              checked={isInsuranceApplied}
              onChange={(e) => setIsInsuranceApplied(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#00B4D8' }}
            />
          </div>

          <button onClick={() => alert('Insurance Pre-authorization Claim Submitted!')} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
            Submit Pre-Auth Cashless Claim
          </button>
        </div>

        {/* Column 2: Government Schemes */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Award size={22} color="#10B981" />
            <h3 style={{ fontSize: '1.15rem', color: '#FFF', margin: 0 }}>Government Scheme Matching</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
            {schemeEligibility.map(scheme => (
              <div key={scheme.schemeId} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px 12px', borderRadius: '10px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#FFF', fontWeight: 600 }}>
                  <span>{scheme.schemeName.substring(0, 35)}...</span>
                  <span style={{ color: '#10B981' }}>+₹{(scheme.potentialSupportAmount/1000).toFixed(0)}k</span>
                </div>
                <div style={{ color: '#94A3B8', fontSize: '0.75rem', marginTop: '2px' }}>
                  {scheme.matchingCriteria.join(' • ')}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '14px' }}>
            <span>Include Ayushman Bharat PM-JAY Aid:</span>
            <input
              type="checkbox"
              checked={isSchemeApplied}
              onChange={(e) => setIsSchemeApplied(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#10B981' }}
            />
          </div>
        </div>

        {/* Column 3: NGO / CSR Assistance */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <HeartHandshake size={22} color="#A78BFA" />
            <h3 style={{ fontSize: '1.15rem', color: '#FFF', margin: 0 }}>NGO & CSR Financial Grants</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ngoList.map(ngo => (
              <div key={ngo.id} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px 12px', borderRadius: '10px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#FFF', fontWeight: 600 }}>
                  <span>{ngo.organizationName}</span>
                  <span style={{ color: '#A78BFA' }}>Up to ₹{ngo.maxAssistanceAmount.toLocaleString()}</span>
                </div>
                <div style={{ color: '#94A3B8', fontSize: '0.75rem', margin: '2px 0 6px' }}>{ngo.supportType}</div>
                <button
                  onClick={() => handleApplyNGO(ngo.id)}
                  disabled={ngo.applicationStatus === 'APPLIED'}
                  className="btn btn-purple btn-sm"
                  style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                >
                  {ngo.applicationStatus === 'APPLIED' ? '✓ Applied' : 'Request Financial Aid'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
