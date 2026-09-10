import React, { useState } from 'react';
import { db } from '../../db/database';
import type { TreatmentCostEstimate, Consultation } from '../../types';
import { TreatmentCostGenerator } from './TreatmentCostGenerator';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { Stethoscope, User, FileText, Lock, CheckCircle2, Calculator } from 'lucide-react';

interface Props {
  onCostEstimateCreated: (est: TreatmentCostEstimate) => void;
}

export const DoctorDashboard: React.FC<Props> = ({ onCostEstimateCreated }) => {
  const profile = db.getPatientProfile();
  const triage = db.getLatestTriage();
  const opds = db.getOPDRegistrations();

  const isConsentGranted = db.isConsentGranted(profile.userId, 'hosp-1');

  const [clinicalNotes, setClinicalNotes] = useState('Patient presented with mild effort-induced chest tightness. Vitals stable. EKG shows normal sinus rhythm without acute ischemic changes.');
  const [diagnosis, setDiagnosis] = useState('Suspected Angina Pectoris / Ischemic Heart Disease Evaluation Required');
  const [treatmentPlan, setTreatmentPlan] = useState('Advised 2D Echocardiogram, Trop-I, and Coronary Angiography evaluation.');
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [savedConsultation, setSavedConsultation] = useState<Consultation | null>(null);

  const handleSaveConsultation = () => {
    const cons: Consultation = {
      id: `cons-${Date.now()}`,
      appointmentId: opds[0]?.id || 'opd-demo',
      referenceId: opds[0]?.referenceId || 'CHX-2026-8A92F',
      patientId: profile.userId,
      patientName: profile.fullName,
      doctorId: 'doc-1',
      doctorName: 'Dr. Rajesh Kulkarni',
      hospitalId: 'hosp-1',
      timestamp: new Date().toLocaleString('en-IN'),
      clinicalNotes,
      diagnosis,
      investigationsOrdered: ['2D Echocardiogram', 'Troponin-I Level', 'Coronary Angiography'],
      prescriptionMedicines: [
        { name: 'Sorbitrate 5mg', dosage: 'Sublingual PRN', duration: '5 days' },
        { name: 'Aspirin 75mg', dosage: '1-0-0', duration: '30 days' }
      ],
      treatmentPlan,
      status: 'COMPLETED'
    };
    db.addConsultation(cons);
    setSavedConsultation(cons);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Doctor Workspace Header */}
      <div style={{
        background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
        borderRadius: '20px',
        padding: '24px 30px',
        marginBottom: '24px',
        color: '#FFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Stethoscope size={24} />
            <h2 style={{ fontSize: '1.6rem', color: '#FFF', margin: 0 }}>Doctor Clinical Consultation Desk</h2>
          </div>
          <p style={{ opacity: 0.9, fontSize: '0.9rem', margin: 0 }}>
            Dr. Rajesh Kulkarni (Senior Cardiologist) • CarePlus Super Specialty Hospital
          </p>
        </div>
        <span className="badge badge-purple" style={{ background: '#FFF', color: '#6D28D9', fontSize: '0.82rem' }}>
          DOCTOR WORKSPACE
        </span>
      </div>

      <DisclaimerBanner text="AI information is decision-support only. Doctor verification and clinical evaluation is required." />

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left: Patient Authorized Medical File */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#FFF', fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={20} color="#7C3AED" /> Patient Clinical Profile
            </h3>
            <span className={`badge ${isConsentGranted ? 'badge-green' : 'badge-amber'}`}>
              {isConsentGranted ? '✓ CONSENT GRANTED' : '🔒 CONSENT PENDING'}
            </span>
          </div>

          {!isConsentGranted ? (
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #F59E0B', borderRadius: '12px', padding: '20px', textAlign: 'center', color: '#FBBF24' }}>
              <Lock size={36} style={{ margin: '0 auto 10px' }} />
              <h4 style={{ color: '#FFF', marginBottom: '6px' }}>Patient Access Restricted</h4>
              <p style={{ fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '12px' }}>
                Full medical history requires patient consent approval. Ask the patient to approve consent on their dashboard or click below to simulate approval.
              </p>
              <button
                onClick={() => {
                  const consent = db.getConsents()[0];
                  if (consent) db.updateConsentStatus(consent.id, 'GRANTED');
                  else db.requestConsent(profile.userId, 'hosp-1', 'CarePlus Hospital');
                  window.location.reload();
                }}
                className="btn btn-green btn-sm"
              >
                Simulate Patient Granting Consent
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Personal Vitals Box */}
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontWeight: 700, color: '#FFF', fontSize: '1.1rem' }}>{profile.fullName} (Age {profile.age}, {profile.gender})</div>
                <div style={{ color: '#94A3B8', fontSize: '0.82rem', margin: '2px 0 8px' }}>Ref ID: {opds[0]?.referenceId || 'CHX-2026-8A92F'} • Blood Group: {profile.bloodGroup}</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', fontSize: '0.8rem', textAlign: 'center' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '6px' }}>
                    <span style={{ color: '#94A3B8' }}>BP:</span> <strong style={{ color: '#10B981', display: 'block' }}>{profile.vitalSigns?.bp}</strong>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '6px' }}>
                    <span style={{ color: '#94A3B8' }}>Pulse:</span> <strong style={{ color: '#10B981', display: 'block' }}>{profile.vitalSigns?.pulse}</strong>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '6px' }}>
                    <span style={{ color: '#94A3B8' }}>SpO2:</span> <strong style={{ color: '#10B981', display: 'block' }}>{profile.vitalSigns?.spo2}</strong>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '6px' }}>
                    <span style={{ color: '#94A3B8' }}>Temp:</span> <strong style={{ color: '#10B981', display: 'block' }}>{profile.vitalSigns?.temp}</strong>
                  </div>
                </div>
              </div>

              {/* Symptoms & Voice Transcript */}
              <div>
                <h4 style={{ color: '#00B4D8', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '6px' }}>Active Reported Symptoms</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {profile.symptoms.map((s, i) => (
                    <span key={i} className="badge badge-teal">{s}</span>
                  ))}
                </div>
              </div>

              {/* OCR Medical History & Medicines */}
              <div>
                <h4 style={{ color: '#A78BFA', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '6px' }}>Extracted Medical History & Prescriptions</h4>
                <div style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>
                  <div><strong>History:</strong> {profile.medicalHistory.join(', ')}</div>
                  <div><strong>Medicines:</strong> {profile.medications.join(', ')}</div>
                  <div><strong>Allergies:</strong> <span style={{ color: '#EF4444' }}>{profile.allergies.join(', ')}</span></div>
                </div>
              </div>

              {/* AI Triage Banner */}
              {triage && (
                <div style={{ background: 'rgba(124, 58, 237, 0.15)', border: '1px solid #7C3AED', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#A78BFA', fontWeight: 600 }}>AI TRIAGE RECOMMENDATION:</div>
                  <div style={{ color: '#FFF', fontWeight: 700, fontSize: '0.95rem' }}>{triage.riskLevel} RISK • {triage.urgency}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Doctor Clinical Entry & Treatment Plan */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: '#FFF', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="#10B981" /> Clinical Notes & Treatment Plan
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label className="form-label">Doctor Clinical Notes:</label>
              <textarea
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                rows={3}
                className="form-control"
              />
            </div>

            <div>
              <label className="form-label">Clinical Diagnosis:</label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="form-control"
              />
            </div>

            <div>
              <label className="form-label">Treatment & Procedure Plan:</label>
              <textarea
                value={treatmentPlan}
                onChange={(e) => setTreatmentPlan(e.target.value)}
                rows={2}
                className="form-control"
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={handleSaveConsultation} className="btn btn-purple">
              <CheckCircle2 size={16} /> Save Clinical Notes & Treatment Plan
            </button>

            <button onClick={() => setIsCostModalOpen(true)} className="btn btn-green">
              <Calculator size={16} /> Generate Treatment Cost Estimate →
            </button>
          </div>

          {savedConsultation && (
            <div style={{ marginTop: '16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', borderRadius: '10px', padding: '12px', color: '#10B981', fontSize: '0.85rem' }}>
              ✓ Consultation saved! Patient can now view treatment plan and proceed to Financial Support.
            </div>
          )}
        </div>
      </div>

      {/* Cost Estimate Generator Modal */}
      <TreatmentCostGenerator
        isOpen={isCostModalOpen}
        hospitalName="CarePlus Super Specialty Hospital"
        onClose={() => setIsCostModalOpen(false)}
        onEstimateGenerated={(est) => {
          onCostEstimateCreated(est);
        }}
      />
    </div>
  );
};
