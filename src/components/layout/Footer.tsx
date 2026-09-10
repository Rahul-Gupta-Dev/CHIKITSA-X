import React from 'react';
import { HeartPulse, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      background: 'var(--bg-header)',
      borderTop: '1px solid var(--border-light)',
      padding: '40px 20px 24px',
      color: 'var(--text-secondary)',
      fontSize: '0.88rem',
      marginTop: 'auto'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px', marginBottom: '30px' }}>
        {/* Col 1: Brand info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ background: 'linear-gradient(135deg, #0284C7 0%, #6D28D9 100%)', padding: '6px', borderRadius: '8px', color: '#FFF' }}>
              <HeartPulse size={20} />
            </div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-heading)' }}>
              CHIKITSA<span style={{ color: 'var(--primary-teal)' }}>X</span>
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            AI-Powered Patient Intelligence, Care Navigation & Financial Assistance Platform. Built for Smart India Hackathon.
          </p>
          <div style={{ marginTop: '12px' }} className="badge badge-purple">
            <Sparkles size={13} /> SIH PROTOTYPE MVP
          </div>
        </div>

        {/* Col 2: Care Journey Steps */}
        <div>
          <h4 style={{ color: 'var(--text-heading)', fontSize: '0.95rem', marginBottom: '12px' }}>Care Journey Ecosystem</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <li>• AI Voice Symptom Intake</li>
            <li>• Medical Record Upload & OCR</li>
            <li>• AI-Assisted Clinical Triage</li>
            <li>• CHIKITSAX Care Score Hospital Finder</li>
            <li>• OPD Registration & Digital QR Pass</li>
            <li>• Care-to-Cost Financial Assistance</li>
          </ul>
        </div>

        {/* Col 3: Emergency Helpline */}
        <div>
          <h4 style={{ color: 'var(--text-heading)', fontSize: '0.95rem', marginBottom: '12px' }}>Emergency & Support</h4>
          <div style={{ background: 'rgba(220, 38, 38, 0.08)', border: '1px solid var(--danger-red)', borderRadius: '10px', padding: '12px', marginBottom: '10px' }}>
            <div style={{ color: 'var(--danger-red)', fontWeight: 700, fontSize: '0.85rem' }}>National Medical Emergency</div>
            <div style={{ color: 'var(--danger-red)', fontWeight: 800, fontSize: '1.1rem' }}>Call 108 / 112</div>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Ayushman Bharat PM-JAY Helpline: 14555
          </div>
        </div>

        {/* Col 4: AI Disclaimer */}
        <div>
          <h4 style={{ color: 'var(--text-heading)', fontSize: '0.95rem', marginBottom: '12px' }}>AI Medical Safety Notice</h4>
          <p style={{ fontSize: '0.78rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
            CHIKITSAX AI features provide decision assistance and triage guidance only. Final diagnosis, treatment plans, and emergency evaluations remain the responsibility of certified medical professionals.
          </p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        © 2026 CHIKITSAX Healthcare Platform • Smart India Hackathon Working Prototype
      </div>
    </footer>
  );
};
