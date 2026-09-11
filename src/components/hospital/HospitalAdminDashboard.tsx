import React, { useState, useEffect } from 'react';
import { db } from '../../db/database';
import { qrService } from '../../services/apiServices';
import type { OPDRegistration, PatientConsent } from '../../types';
import { QrCode, Search, CheckCircle2, AlertCircle, Building2, Lock, Key, Camera } from 'lucide-react';
import { QRCameraScannerModal } from './QRCameraScannerModal';

interface Props {
  onConsentRequested?: () => void;
}

export const HospitalAdminDashboard: React.FC<Props> = ({ onConsentRequested }) => {
  const appointments = db.getOPDRegistrations();
  const initialRefId = appointments.length > 0 ? appointments[0].referenceId : 'CHX-2026-8A92F';

  const [inputRefId, setInputRefId] = useState(initialRefId);
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; opd?: OPDRegistration; message: string } | null>(null);
  const [activeConsent, setActiveConsent] = useState<PatientConsent | null>(null);
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState(false);

  // Sync initial inputRefId if appointments list changes
  useEffect(() => {
    if (appointments.length > 0 && !verificationResult) {
      setInputRefId(appointments[0].referenceId);
    }
  }, [appointments.length]);

  const handleVerify = async (targetId?: string) => {
    const queryId = (targetId || inputRefId).trim();
    if (!queryId) return;

    const res = await qrService.verifyPass(queryId, 'Reception Desk Staff (Anil)');
    setVerificationResult(res);

    if (res.success && res.opd) {
      const consents = db.getConsents();
      const existing = consents.find(c => c.patientId === res.opd?.patientId && c.hospitalId === res.opd?.hospitalId);
      if (existing) setActiveConsent(existing);
    } else {
      setActiveConsent(null);
    }
  };

  const handleCameraScanSuccess = (scannedId: string) => {
    setInputRefId(scannedId);
    handleVerify(scannedId);
  };

  const handleRequestConsentClick = () => {
    if (verificationResult?.opd) {
      const c = db.requestConsent(
        verificationResult.opd.patientId,
        verificationResult.opd.hospitalId,
        verificationResult.opd.hospitalName,
        verificationResult.opd.doctorId,
        verificationResult.opd.doctorName
      );
      setActiveConsent(c);
      if (onConsentRequested) onConsentRequested();
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        borderRadius: '20px',
        padding: '24px 30px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#FFF',
        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Building2 size={24} />
            <h2 style={{ fontSize: '1.6rem', color: '#FFF', margin: 0 }}>Hospital Admin & Staff Verification Desk</h2>
          </div>
          <p style={{ opacity: 0.9, fontSize: '0.9rem', margin: 0 }}>
            CarePlus Super Specialty Hospital • Check-in Scanner & Medical Consent Management
          </p>
        </div>
        <span className="badge badge-green" style={{ background: '#FFF', color: '#059669', fontSize: '0.82rem' }}>
          STAFF LOGGED IN
        </span>
      </div>

      {/* Main Verification Card */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-heading)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <QrCode size={22} color="var(--accent-green)" /> Scan Patient QR / Enter Reference ID
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              Scan patient digital visit pass QR using web camera or enter appointment reference ID
            </p>
          </div>

          <button
            onClick={() => setIsCameraScannerOpen(true)}
            className="btn btn-primary"
            style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}
          >
            <Camera size={20} /> Open Camera QR Scanner
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <input
            type="text"
            value={inputRefId}
            onChange={(e) => setInputRefId(e.target.value)}
            placeholder="Enter Reference ID e.g. CHX-2026-8A92F"
            className="form-control"
            style={{ flex: 1, minWidth: '260px', fontSize: '1.05rem', fontWeight: 600, letterSpacing: '0.05em' }}
          />
          <button onClick={() => handleVerify()} className="btn btn-green" style={{ padding: '12px 24px' }}>
            <Search size={18} /> Verify Appointment
          </button>
        </div>

        {/* Quick Active Appointments List */}
        {appointments.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span>Active Hospital Appointments:</span>
            {appointments.map(a => (
              <button
                key={a.id}
                onClick={() => {
                  setInputRefId(a.referenceId);
                  handleVerify(a.referenceId);
                }}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.78rem', padding: '4px 10px', border: inputRefId === a.referenceId ? '1px solid var(--accent-green)' : '1px solid var(--border-light)' }}
              >
                {a.referenceId} ({a.patientName})
              </button>
            ))}
          </div>
        )}

        {/* Verification Result Card */}
        {verificationResult && (
          <div style={{ marginTop: '24px' }}>
            {verificationResult.success && verificationResult.opd ? (
              <div style={{
                background: 'rgba(21, 128, 61, 0.08)',
                border: '1px solid var(--accent-green)',
                borderRadius: '16px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={28} color="var(--accent-green)" />
                    <div>
                      <div style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '1.1rem' }}>✓ APPOINTMENT VERIFIED SUCCESSFUL</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Staff Verification & Patient Check-in Complete</div>
                    </div>
                  </div>
                  <span className="badge badge-green">CHECK-IN VERIFIED</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.9rem', color: 'var(--text-main)', margin: '16px 0' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Reference ID:</span>
                    <div style={{ fontWeight: 700, color: 'var(--primary-teal)' }}>{verificationResult.opd.referenceId}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Patient Name:</span>
                    <div style={{ fontWeight: 600 }}>{verificationResult.opd.patientName}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Department & Doctor:</span>
                    <div style={{ fontWeight: 600 }}>{verificationResult.opd.doctorName} ({verificationResult.opd.department})</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Date & Time Slot:</span>
                    <div style={{ fontWeight: 600 }}>{verificationResult.opd.appointmentDate} at {verificationResult.opd.appointmentTime}</div>
                  </div>
                </div>

                {/* Patient Consent Status Protocol */}
                <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-purple)', fontWeight: 600, fontSize: '0.9rem' }}>
                      <Lock size={16} /> Patient Medical Record Access Consent Status:
                    </div>
                    <div style={{ color: activeConsent?.status === 'GRANTED' ? 'var(--accent-green)' : 'var(--warning-amber)', fontSize: '0.85rem', marginTop: '2px' }}>
                      {activeConsent?.status === 'GRANTED'
                        ? '✓ GRANTED BY PATIENT: Doctor unlocked clinical profile'
                        : activeConsent?.status === 'PENDING'
                        ? '⏳ PENDING PATIENT APPROVAL: Request sent to patient'
                        : '🔒 NOT REQUESTED YET'}
                    </div>
                  </div>

                  {activeConsent?.status !== 'GRANTED' && (
                    <button onClick={handleRequestConsentClick} className="btn btn-purple btn-sm">
                      <Key size={14} /> Request Patient Medical Access Consent
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid var(--danger-red)', borderRadius: '12px', padding: '16px', color: 'var(--danger-red)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={20} /> {verificationResult.message}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Audit Log Panel */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h4 style={{ color: 'var(--text-heading)', fontSize: '1.1rem', marginBottom: '14px' }}>Recent Hospital Check-in Audit Logs</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
          {db.getAuditLogs().slice(0, 5).map(log => (
            <div key={log.id} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', padding: '10px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>[{log.timestamp}] <strong>{log.action}</strong>: {log.details}</span>
              <span className="badge badge-teal">{log.actorRole}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Camera QR Scanner Modal */}
      <QRCameraScannerModal
        isOpen={isCameraScannerOpen}
        onClose={() => setIsCameraScannerOpen(false)}
        onScanSuccess={handleCameraScanSuccess}
      />
    </div>
  );
};
