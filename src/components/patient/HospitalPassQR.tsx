import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import type { OPDRegistration } from '../../types';
import { QrCode, ShieldCheck, Building2, Calendar, User, Stethoscope } from 'lucide-react';

interface Props {
  opd: OPDRegistration;
  onSimulateHospitalVerify?: () => void;
}

export const HospitalPassQR: React.FC<Props> = ({ opd, onSimulateHospitalVerify }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && opd) {
      const qrPayload = JSON.stringify({
        referenceId: opd.referenceId,
        token: opd.qrToken,
        hospitalId: opd.hospitalId,
        patientId: opd.patientId,
        system: 'CHIKITSAX_SECURE_TOKEN_PASS'
      });

      QRCode.toCanvas(canvasRef.current, qrPayload, {
        width: 180,
        margin: 2,
        color: {
          dark: '#0A192F',
          light: '#FFFFFF'
        }
      }, (err) => {
        if (err) console.error('QR rendering error:', err);
      });
    }
  }, [opd]);

  return (
    <div className="glass-panel" style={{ padding: '24px', margin: '20px 0', border: '1px solid #00B4D8' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'linear-gradient(135deg, #00B4D8 0%, #10B981 100%)', padding: '10px', borderRadius: '12px', color: '#FFF' }}>
            <QrCode size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#FFF', margin: 0 }}>Digital Hospital Visit Pass</h3>
              <span className={`badge ${opd.status === 'VERIFIED' ? 'badge-green' : 'badge-teal'}`}>
                STATUS: {opd.status}
              </span>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: 0 }}>Present this QR pass at the hospital reception staff desk</p>
          </div>
        </div>

        {onSimulateHospitalVerify && opd.status !== 'VERIFIED' && (
          <button onClick={onSimulateHospitalVerify} className="btn btn-green btn-sm">
            <ShieldCheck size={16} /> Simulate Staff QR Check-in
          </button>
        )}
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #1C2541 0%, #0B132B 100%)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        {/* Left: Details */}
        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            UNIQUE REFERENCE IDENTIFIER
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#00B4D8', fontFamily: 'Outfit', letterSpacing: '0.05em', marginBottom: '16px' }}>
            {opd.referenceId}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#CBD5E1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} color="#00B4D8" /> <span>Patient: <strong>{opd.patientName}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={16} color="#00B4D8" /> <span>Hospital: <strong>{opd.hospitalName}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Stethoscope size={16} color="#00B4D8" /> <span>Doctor: <strong>{opd.doctorName}</strong> ({opd.department})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} color="#00B4D8" /> <span>Slot: <strong>{opd.appointmentDate} at {opd.appointmentTime}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Rendered QR Canvas Code */}
        <div style={{
          background: '#FFF',
          padding: '16px',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
        }}>
          <canvas ref={canvasRef} />
          <div style={{ marginTop: '8px', fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
            SECURE TOKEN ENCRYPTED
          </div>
        </div>
      </div>

      <div style={{ marginTop: '14px', fontSize: '0.78rem', color: '#94A3B8', textAlign: 'center' }}>
        <strong>Privacy Note:</strong> Raw medical health records are NOT stored inside this QR payload. Only an encrypted reference token is encoded for verification.
      </div>
    </div>
  );
};
