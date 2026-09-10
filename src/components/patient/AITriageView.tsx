import React, { useState } from 'react';
import { mockTriageService } from '../../services/apiServices';
import type { TriageResult } from '../../types';
import { db } from '../../db/database';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { Activity, Sparkles, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  onTriageComplete: (result: TriageResult) => void;
  onNavigateHospitals: () => void;
  onNavigateEmergency: () => void;
}

export const AITriageView: React.FC<Props> = ({
  onTriageComplete,
  onNavigateHospitals,
  onNavigateEmergency
}) => {
  const [triage, setTriage] = useState<TriageResult | null>(db.getLatestTriage());
  const [isLoading, setIsLoading] = useState(false);

  const handleRunTriage = async () => {
    setIsLoading(true);
    try {
      const result = await mockTriageService.runClinicalTriage();
      setTriage(result);
      onTriageComplete(result);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', margin: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #00B4D8 100%)', padding: '10px', borderRadius: '12px', color: '#FFF' }}>
            <Activity size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#FFF', margin: 0 }}>AI-Assisted Clinical Triage Engine</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: 0 }}>Risk & Urgency Evaluation based on Unified Symptoms & Medical History</p>
          </div>
        </div>

        <button onClick={handleRunTriage} disabled={isLoading} className="btn btn-purple">
          {isLoading ? 'Synthesizing Triage...' : 'Re-Run AI Triage Analysis'} <Sparkles size={16} />
        </button>
      </div>

      <DisclaimerBanner text="AI-Assisted Triage. Final clinical decisions must be made by qualified healthcare professionals." />

      {triage ? (
        <div style={{ marginTop: '20px' }}>
          {/* Risk Level Banner */}
          <div style={{
            background: triage.riskLevel === 'HIGH'
              ? 'rgba(239, 68, 68, 0.15)'
              : triage.riskLevel === 'MODERATE'
              ? 'rgba(245, 158, 11, 0.15)'
              : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${triage.riskLevel === 'HIGH' ? '#EF4444' : triage.riskLevel === 'MODERATE' ? '#F59E0B' : '#10B981'}`,
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <span className={`badge ${triage.riskLevel === 'HIGH' ? 'badge-red' : triage.riskLevel === 'MODERATE' ? 'badge-amber' : 'badge-green'}`}>
                RISK LEVEL: {triage.riskLevel}
              </span>
              <h3 style={{ fontSize: '1.5rem', color: '#FFF', margin: '6px 0 2px' }}>
                Urgency: {triage.urgency}
              </h3>
              <p style={{ color: '#CBD5E1', fontSize: '0.9rem', margin: 0 }}>
                Recommended Specialty: <strong style={{ color: '#00B4D8' }}>{triage.recommendedSpecialty}</strong>
              </p>
            </div>

            {triage.riskLevel === 'HIGH' ? (
              <button onClick={onNavigateEmergency} className="btn btn-danger btn-emergency-pulse">
                <AlertTriangle size={18} /> Launch Urgent Care Pathway
              </button>
            ) : (
              <button onClick={onNavigateHospitals} className="btn btn-primary">
                Find Recommended Hospitals <ArrowRight size={18} />
              </button>
            )}
          </div>

          {/* Clinical Reasoning Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ color: '#00B4D8', fontSize: '0.9rem', marginBottom: '10px', textTransform: 'uppercase' }}>
                Symptoms Evaluated
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {triage.symptomsConsidered.map((sym, idx) => (
                  <span key={idx} className="badge badge-teal">{sym}</span>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '16px' }}>
              <h4 style={{ color: '#A78BFA', fontSize: '0.9rem', marginBottom: '10px', textTransform: 'uppercase' }}>
                Clinical Reasoning Breakdown
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#CBD5E1' }}>
                {triage.clinicalReasoning.map((r, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <CheckCircle2 size={16} color="#A78BFA" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <p style={{ color: '#94A3B8', marginBottom: '16px' }}>Click below to synthesize voice intake and medical records into a clinical triage guidance report.</p>
          <button onClick={handleRunTriage} disabled={isLoading} className="btn btn-purple">
            Synthesize Triage Report <Sparkles size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
