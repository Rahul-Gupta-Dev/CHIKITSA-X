import React, { useState } from 'react';
import { mockHospitalService } from '../../services/apiServices';
import type { Hospital } from '../../types';
import { AlertTriangle, Phone, Navigation, Activity, X, ShieldAlert } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectHospital: (hospital: Hospital) => void;
}

export const EmergencyModal: React.FC<Props> = ({ isOpen, onClose, onSelectHospital }) => {
  const [step, setStep] = useState<'CONFIRM' | 'PATHWAY'>('CONFIRM');
  const emergencyHospitals = mockHospitalService.getEmergencyHospitals();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ border: '2px solid #EF4444', maxWidth: '640px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#EF4444', padding: '10px', borderRadius: '12px', color: '#FFF' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: '#FFF', margin: 0 }}>URGENT CARE PATHWAY</h2>
              <p style={{ color: '#F87171', fontSize: '0.85rem', margin: 0 }}>Emergency Medical Assistance & Rapid Hospital Locator</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '8px' }}>
            <X size={20} />
          </button>
        </div>

        {step === 'CONFIRM' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <ShieldAlert size={54} color="#EF4444" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: '#FFF' }}>Is this a medical emergency?</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px' }}>
              If you or someone nearby is experiencing severe chest pain, extreme shortness of breath, sudden weakness, or uncontrolled bleeding, please seek immediate emergency care.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '420px', margin: '0 auto' }}>
              <button
                onClick={() => setStep('PATHWAY')}
                className="btn btn-danger"
                style={{ padding: '16px', fontSize: '1.05rem', fontWeight: 700 }}
              >
                YES — I NEED URGENT CARE NOW
              </button>
              <button
                onClick={onClose}
                className="btn btn-secondary"
                style={{ padding: '12px' }}
              >
                NO — CONTINUE ROUTINE CARE JOURNEY
              </button>
            </div>

            <div style={{ marginTop: '24px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '12px', padding: '12px', fontSize: '0.82rem', color: '#FCA5A5' }}>
              <strong>AI Safety Notice:</strong> CHIKITSAX performs emergency risk guidance only. It does not replace emergency dispatch (Call 108/112 in India) or clinical emergency triage.
            </div>
          </div>
        ) : (
          <div>
            {/* Risk Guidance Box */}
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F87171', fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>
                <AlertTriangle size={18} /> HIGH PRIORITY URGENCY EVALUATION
              </div>
              <p style={{ color: '#FCA5A5', fontSize: '0.88rem', margin: 0 }}>
                Your condition requires prompt medical attention. Below are the nearest emergency-equipped tertiary hospitals with active Trauma ICUs.
              </p>
            </div>

            <h4 style={{ color: '#CBD5E1', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Nearest Emergency Facilities (Live Mock Data)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '380px', overflowY: 'auto' }}>
              {emergencyHospitals.slice(0, 3).map((hosp) => (
                <div key={hosp.id} style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '14px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ color: '#FFF', fontSize: '1.1rem', marginBottom: '4px' }}>{hosp.name}</h4>
                      <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: 0 }}>{hosp.address}</p>
                    </div>
                    <span className="badge badge-red" style={{ fontSize: '0.8rem' }}>
                      <Activity size={12} /> {hosp.distanceKm} km away
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: '#CBD5E1', margin: '12px 0' }}>
                    <div>
                      <span style={{ color: '#94A3B8' }}>Emergency Beds:</span> <strong style={{ color: '#10B981' }}>{hosp.emergencyBedsFree} Available</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8' }}>ICU Beds:</span> <strong style={{ color: '#10B981' }}>{hosp.icuBedsFree} Free</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8' }}>Specialty:</span> <strong style={{ color: '#A78BFA' }}>Cardiac & Emergency</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <a
                      href={`tel:${hosp.emergencyPhone}`}
                      className="btn btn-danger btn-sm"
                      style={{ textDecoration: 'none' }}
                      onClick={() => alert(`Calling Emergency Desk: ${hosp.emergencyPhone}`)}
                    >
                      <Phone size={14} /> Call Emergency ({hosp.emergencyPhone})
                    </a>

                    <button
                      onClick={() => {
                        window.open(`https://maps.google.com/?q=${encodeURIComponent(hosp.name + ' ' + hosp.city)}`, '_blank');
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      <Navigation size={14} /> Get Directions
                    </button>

                    <button
                      onClick={() => {
                        onSelectHospital(hosp);
                        onClose();
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ marginLeft: 'auto' }}
                    >
                      Select Emergency Facility
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button onClick={() => setStep('CONFIRM')} className="btn btn-secondary btn-sm">
                ← Back to Emergency Options
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
