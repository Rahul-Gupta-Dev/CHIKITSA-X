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
        background: 'linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%)',
        borderRadius: '20px',
        padding: '24px 30px',
        marginBottom: '24px',
        color: '#FFF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Stethoscope size={24} color="#FFF" />
            <h2 style={{ fontSize: '1.6rem', color: '#FFF', margin: 0 }}>Doctor Clinical Consultation Desk</h2>
          </div>
          <p style={{ opacity: 0.9, fontSize: '0.9rem', margin: 0, color: '#F1F5F9' }}>
            Dr. Rajesh Kulkarni (Senior Cardiologist) • CarePlus Super Specialty Hospital
          </p>
        </div>
        <span className="badge badge-purple" style={{ background: '#FFF', color: '#6D28D9', fontSize: '0.82rem', fontWeight: 700 }}>
          DOCTOR WORKSPACE
        </span>
      </div>

      <DisclaimerBanner text="AI information is decision-support only. Doctor verification and clinical evaluation is required." />

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left: Patient Authorized Medical File */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--text-heading)', fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={20} color="var(--accent-purple)" /> Patient Clinical Profile
            </h3>
            <span className={`badge ${isConsentGranted ? 'badge-green' : 'badge-amber'}`}>
              {isConsentGranted ? '✓ CONSENT GRANTED' : '🔒 CONSENT PENDING'}
            </span>
          </div>

          {!isConsentGranted ? (
            <div style={{ background: 'rgba(180, 83, 9, 0.1)', border: '1px solid var(--warning-amber)', borderRadius: '12px', padding: '20px', textAlign: 'center', color: 'var(--warning-amber)' }}>
              <Lock size={36} style={{ margin: '0 auto 10px' }} />
              <h4 style={{ color: 'var(--text-heading)', marginBottom: '6px' }}>Patient Access Restricted</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
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
              <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '1.1rem' }}>{profile.fullName} (Age {profile.age}, {profile.gender})</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '2px 0 8px' }}>Ref ID: {opds[0]?.referenceId || 'CHX-2026-8A92F'} • Blood Group: {profile.bloodGroup}</div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', fontSize: '0.8rem', textAlign: 'center' }}>
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '6px', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>BP:</span> <strong style={{ color: 'var(--accent-green)', display: 'block' }}>{profile.vitalSigns?.bp}</strong>
                  </div>
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '6px', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Pulse:</span> <strong style={{ color: 'var(--accent-green)', display: 'block' }}>{profile.vitalSigns?.pulse}</strong>
                  </div>
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '6px', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>SpO2:</span> <strong style={{ color: 'var(--accent-green)', display: 'block' }}>{profile.vitalSigns?.spo2}</strong>
                  </div>
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '6px', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Temp:</span> <strong style={{ color: 'var(--accent-green)', display: 'block' }}>{profile.vitalSigns?.temp}</strong>
                  </div>
                </div>
              </div>

              {/* Symptoms & Voice Transcript */}
              <div>
                <h4 style={{ color: 'var(--primary-teal-dark)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 700 }}>Active Reported Symptoms</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {profile.symptoms.map((s, i) => (
                    <span key={i} className="badge badge-teal">{s}</span>
                  ))}
                </div>
              </div>

              {/* OCR Medical History & Medicines */}
              <div>
                <h4 style={{ color: 'var(--accent-purple)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 700 }}>Extracted Medical History & Prescriptions</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  <div><strong>History:</strong> {profile.medicalHistory.join(', ')}</div>
                  <div><strong>Medicines:</strong> {profile.medications.join(', ')}</div>
                  <div><strong>Allergies:</strong> <span style={{ color: 'var(--danger-red)' }}>{profile.allergies.join(', ')}</span></div>
                </div>
              </div>

              {/* AI Triage Banner */}
              {triage && (
                <div style={{ background: 'rgba(109, 40, 217, 0.08)', border: '1px solid var(--accent-purple)', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', fontWeight: 700 }}>AI TRIAGE RECOMMENDATION:</div>
                  <div style={{ color: 'var(--text-heading)', fontWeight: 700, fontSize: '0.95rem' }}>{triage.riskLevel} RISK • {triage.urgency}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Doctor Clinical Entry & Treatment Plan */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-heading)', fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="var(--accent-green)" /> Clinical Notes & Treatment Plan
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
            <div style={{ marginTop: '16px', background: 'rgba(21, 128, 61, 0.12)', border: '1px solid var(--accent-green)', borderRadius: '10px', padding: '12px', color: 'var(--accent-green)', fontSize: '0.85rem', fontWeight: 600 }}>
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
