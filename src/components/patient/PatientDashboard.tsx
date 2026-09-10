import React, { useState } from 'react';
import { db } from '../../db/database';
import { CareJourneyTimeline } from '../common/CareJourneyTimeline';
import { HospitalPassQR } from './HospitalPassQR';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import {
  Mic,
  FileText,
  User,
  Activity,
  Building2,
  QrCode,
  Wallet,
  Layers,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Lock
} from 'lucide-react';

interface Props {
  onOpenVoiceIntake: () => void;
  onOpenOCR: () => void;
  onOpenHealthProfile: () => void;
  onOpenTriage: () => void;
  onOpenHospitals: () => void;
  onOpenFinancialSupport: () => void;
  onOpenFinancePlanner: () => void;
  onOpenEmergency: () => void;
}

export const PatientDashboard: React.FC<Props> = ({
  onOpenVoiceIntake,
  onOpenOCR,
  onOpenHealthProfile,
  onOpenTriage,
  onOpenHospitals,
  onOpenFinancialSupport,
  onOpenFinancePlanner,
  onOpenEmergency
}) => {
  const profile = db.getPatientProfile();
  const opdList = db.getOPDRegistrations();
  const activeOPD = opdList.length > 0 ? opdList[0] : null;
  const consents = db.getConsents();
  const pendingConsent = consents.find(c => c.status === 'PENDING');

  const [showQRModal, setShowQRModal] = useState(false);

  const handleGrantConsent = (id: string) => {
    db.updateConsentStatus(id, 'GRANTED');
    alert('Consent granted! The treating hospital doctor can now view your authorized health profile.');
    window.location.reload();
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px 0' }}>
      {/* Patient Welcome Header Banner */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: '20px',
        padding: '24px 30px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '1.75rem', color: 'var(--text-heading)', margin: 0 }}>
              Welcome, {profile.fullName}
            </h1>
            <span className="badge badge-teal">PATIENT PORTAL</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Unified Health Record ID: {profile.userId} • Pune, MH
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={onOpenEmergency} className="btn btn-emergency-pulse btn-sm">
            <AlertTriangle size={16} /> Emergency Help
          </button>
          <button onClick={onOpenVoiceIntake} className="btn btn-purple btn-sm">
            <Mic size={16} /> Speak Symptoms
          </button>
        </div>
      </div>

      {/* Pending Consent Request Alert Banner */}
      {pendingConsent && (
        <div style={{
          background: 'rgba(180, 83, 9, 0.08)',
          border: '1px solid var(--warning-amber)',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Lock size={24} color="var(--warning-amber)" />
            <div>
              <div style={{ color: 'var(--text-heading)', fontWeight: 700, fontSize: '0.95rem' }}>
                MEDICAL ACCESS CONSENT REQUESTED: {pendingConsent.hospitalName}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                Doctor ({pendingConsent.doctorName || 'Attending Physician'}) is requesting access to your symptoms and medical record history.
              </div>
            </div>
          </div>

          <button onClick={() => handleGrantConsent(pendingConsent.id)} className="btn btn-green btn-sm">
            <CheckCircle2 size={16} /> Approve & Grant Access
          </button>
        </div>
      )}

      {/* Care Journey 12-Stage Visual Progress Widget */}
      <CareJourneyTimeline currentStage={profile.careStage} />

      <DisclaimerBanner text="AI-assisted guidance only. Professional medical evaluation is required." />

      {/* Active OPD Appointment Card */}
      {activeOPD && (
        <div style={{
          background: 'var(--bg-subtle)',
          border: '1px solid var(--primary-teal)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div>
            <span className="badge badge-teal" style={{ marginBottom: '6px' }}>CONFIRMED OPD APPOINTMENT</span>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--text-heading)', margin: 0 }}>
              Ref ID: <strong style={{ color: 'var(--primary-teal-dark)' }}>{activeOPD.referenceId}</strong>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '4px 0 0' }}>
              {activeOPD.hospitalName} • {activeOPD.doctorName} ({activeOPD.department}) • Slot: {activeOPD.appointmentDate} at {activeOPD.appointmentTime}
            </p>
          </div>

          <button onClick={() => setShowQRModal(true)} className="btn btn-primary">
            <QrCode size={18} /> View Digital QR Visit Pass
          </button>
        </div>
      )}

      {/* 8 Connected Quick Launch Action Cards */}
      <h3 style={{ fontSize: '1.35rem', color: 'var(--text-heading)', marginBottom: '16px' }}>
        Patient Intelligence & Navigation Services
      </h3>

      <div className="grid-cards" style={{ marginBottom: '30px' }}>
        {/* 1. Voice Intake */}
        <div className="glass-panel" style={{ padding: '20px', cursor: 'pointer' }} onClick={onOpenVoiceIntake}>
          <div style={{ background: 'linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', marginBottom: '12px' }}>
            <Mic size={22} />
          </div>
          <h4 style={{ color: 'var(--text-heading)', fontSize: '1.1rem', marginBottom: '6px' }}>1. AI Voice Intake</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '14px' }}>
            Speak symptoms naturally via browser Speech-to-Text or audio samples
          </p>
          <span style={{ color: 'var(--accent-purple)', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Start Voice Recording <ArrowRight size={14} />
          </span>
        </div>

        {/* 2. Medical Record OCR */}
        <div className="glass-panel" style={{ padding: '20px', cursor: 'pointer' }} onClick={onOpenOCR}>
          <div style={{ background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', marginBottom: '12px' }}>
            <FileText size={22} />
          </div>
          <h4 style={{ color: 'var(--text-heading)', fontSize: '1.1rem', marginBottom: '6px' }}>2. Upload Medical Record (OCR)</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '14px' }}>
            Upload PDF/images of prescriptions or lab reports for AI extraction
          </p>
          <span style={{ color: 'var(--primary-teal-dark)', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Upload & Process OCR <ArrowRight size={14} />
          </span>
        </div>

        {/* 3. Health Profile */}
        <div className="glass-panel" style={{ padding: '20px', cursor: 'pointer' }} onClick={onOpenHealthProfile}>
          <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', marginBottom: '12px' }}>
            <User size={22} />
          </div>
          <h4 style={{ color: 'var(--text-heading)', fontSize: '1.1rem', marginBottom: '6px' }}>3. Unified Health Profile</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '14px' }}>
            Consolidated symptoms, OCR medicines, allergies, and vitals
          </p>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            View Health Record <ArrowRight size={14} />
          </span>
        </div>

        {/* 4. AI Triage */}
        <div className="glass-panel" style={{ padding: '20px', cursor: 'pointer' }} onClick={onOpenTriage}>
          <div style={{ background: 'linear-gradient(135deg, #DC2626 0%, #6D28D9 100%)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', marginBottom: '12px' }}>
            <Activity size={22} />
          </div>
          <h4 style={{ color: 'var(--text-heading)', fontSize: '1.1rem', marginBottom: '6px' }}>4. AI Clinical Triage</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '14px' }}>
            Risk Level (Low/Mod/High) and urgency evaluation with reasoning
          </p>
          <span style={{ color: 'var(--danger-red)', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Run Triage Analysis <ArrowRight size={14} />
          </span>
        </div>

        {/* 5. Smart Hospitals */}
        <div className="glass-panel" style={{ padding: '20px', cursor: 'pointer' }} onClick={onOpenHospitals}>
          <div style={{ background: 'linear-gradient(135deg, #0284C7 0%, #15803D 100%)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', marginBottom: '12px' }}>
            <Building2 size={22} />
          </div>
          <h4 style={{ color: 'var(--text-heading)', fontSize: '1.1rem', marginBottom: '6px' }}>5. Care Score Hospitals</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '14px' }}>
            Multi-factor hospital recommendation & side-by-side comparison
          </p>
          <span style={{ color: 'var(--accent-green)', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Find & Compare Hospitals <ArrowRight size={14} />
          </span>
        </div>

        {/* 6. Financial Support */}
        <div className="glass-panel" style={{ padding: '20px', cursor: 'pointer' }} onClick={onOpenFinancialSupport}>
          <div style={{ background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', marginBottom: '12px' }}>
            <Wallet size={22} />
          </div>
          <h4 style={{ color: 'var(--text-heading)', fontSize: '1.1rem', marginBottom: '6px' }}>6. Care-to-Cost Financial Gap</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '14px' }}>
            Stack Insurance + PM-JAY + NGO grants to achieve ₹0 Gap
          </p>
          <span style={{ color: 'var(--accent-green)', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Calculate Financial Support <ArrowRight size={14} />
          </span>
        </div>

        {/* 7. Finance Planner */}
        <div className="glass-panel" style={{ padding: '20px', cursor: 'pointer' }} onClick={onOpenFinancePlanner}>
          <div style={{ background: 'linear-gradient(135deg, #B45309 0%, #92400E 100%)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', marginBottom: '12px' }}>
            <Layers size={22} />
          </div>
          <h4 style={{ color: 'var(--text-heading)', fontSize: '1.1rem', marginBottom: '6px' }}>7. AI Finance Planner</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '14px' }}>
            Multi-scenario comparison comparing out-of-pocket savings
          </p>
          <span style={{ color: 'var(--warning-amber)', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            Compare Scenarios <ArrowRight size={14} />
          </span>
        </div>
      </div>

      {/* Digital QR Modal */}
      {showQRModal && activeOPD && (
        <div className="modal-overlay" onClick={() => setShowQRModal(false)}>
          <div className="modal-content" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'right', marginBottom: '8px' }}>
              <button onClick={() => setShowQRModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.4rem' }}>
                ✕
              </button>
            </div>
            <HospitalPassQR
              opd={activeOPD}
              onSimulateHospitalVerify={() => {
                db.verifyQRPass(activeOPD.referenceId, 'Staff Reception Desk');
                alert(`Appointment ${activeOPD.referenceId} Verified successfully by Staff!`);
                window.location.reload();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
