import React from 'react';
import {
  Mic,
  Building2,
  Wallet,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Sparkles
} from 'lucide-react';

interface Props {
  onStartJourney: () => void;
  onOpenEmergency: () => void;
  onSelectRole: (role: 'PATIENT' | 'DOCTOR' | 'HOSPITAL_ADMIN') => void;
}

export const LandingPage: React.FC<Props> = ({
  onStartJourney,
  onOpenEmergency,
  onSelectRole
}) => {
  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '50px 20px 60px',
        textAlign: 'center',
        background: 'var(--bg-subtle)',
        borderRadius: '24px',
        border: '1px solid var(--border-light)',
        marginBottom: '40px',
        marginTop: '10px'
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }} className="badge badge-purple">
            <Sparkles size={14} /> SMART INDIA HACKATHON PROTOTYPE
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '18px',
            color: 'var(--text-heading)'
          }}>
            Intelligent Healthcare.<br />
            <span style={{ color: 'var(--primary-teal)' }}>Affordable Care.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '700px',
            margin: '0 auto 32px',
            lineHeight: 1.55,
            fontWeight: 500
          }}>
            Understand your symptoms, find the right care, and plan the cost — in one connected journey.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={onStartJourney}
              className="btn btn-primary"
              style={{ padding: '16px 32px', fontSize: '1.05rem' }}
            >
              Start Your Care Journey <ArrowRight size={20} />
            </button>

            <button
              onClick={onOpenEmergency}
              className="btn btn-emergency-pulse"
              style={{ padding: '16px 28px', fontSize: '1.05rem' }}
            >
              <AlertTriangle size={20} /> Emergency Help
            </button>
          </div>

          {/* Banner */}
          <div style={{
            marginTop: '36px',
            display: 'inline-block',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: '30px',
            padding: '8px 24px',
            fontSize: '0.88rem',
            color: 'var(--primary-teal-dark)',
            fontWeight: 600,
            boxShadow: 'var(--shadow-sm)'
          }}>
            "Not just a hospital finder. A complete Care-to-Cost ecosystem."
          </div>
        </div>
      </section>

      {/* 3 Core USP Cards Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 0 50px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '8px', color: 'var(--text-heading)' }}>The 3 Pillars of CHIKITSAX</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Seamlessly bridging clinical triage with financial feasibility</p>
        </div>

        <div className="grid-cards">
          {/* Card 1: UNDERSTAND */}
          <div className="glass-panel" style={{ padding: '28px', position: 'relative' }}>
            <div style={{
              background: 'linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%)',
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              marginBottom: '18px'
            }}>
              <Mic size={26} />
            </div>
            <span className="badge badge-purple" style={{ marginBottom: '10px' }}>1. UNDERSTAND</span>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: 'var(--text-heading)' }}>AI Voice Intake & OCR Record Intelligence</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.55, marginBottom: '16px' }}>
              Speak symptoms in natural regional language or upload paper prescriptions & lab reports. Our AI extracts structured health parameters instantly.
            </p>
            <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="var(--accent-green)" /> Web Speech-to-Text Voice Intake
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="var(--accent-green)" /> OCR Prescription & Lab Report Extraction
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="var(--accent-green)" /> Unified Health Profile & Clinical Triage
              </li>
            </ul>
          </div>

          {/* Card 2: FIND */}
          <div className="glass-panel" style={{ padding: '28px', position: 'relative' }}>
            <div style={{
              background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              marginBottom: '18px'
            }}>
              <Building2 size={26} />
            </div>
            <span className="badge badge-teal" style={{ marginBottom: '10px' }}>2. FIND</span>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: 'var(--text-heading)' }}>CHIKITSAX Care Score Recommendation</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.55, marginBottom: '16px' }}>
              Ranks tertiary hospitals using a 5-vector algorithm (Clinical Fit 35%, Affordability 25%, Distance 15%, Availability 15%, Financial Support 10%).
            </p>
            <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="var(--primary-teal)" /> Transparent "Why Recommended?" Reasoning
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="var(--primary-teal)" /> Instant OPD Registration & Ref ID
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="var(--primary-teal)" /> Secure Token QR Code Visit Pass
              </li>
            </ul>
          </div>

          {/* Card 3: AFFORD */}
          <div className="glass-panel" style={{ padding: '28px', position: 'relative' }}>
            <div style={{
              background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              marginBottom: '18px'
            }}>
              <Wallet size={26} />
            </div>
            <span className="badge badge-green" style={{ marginBottom: '10px' }}>3. AFFORD</span>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px', color: 'var(--text-heading)' }}>Care-to-Cost & AI Finance Planner</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.55, marginBottom: '16px' }}>
              Calculates your net Financial Gap by stacking Insurance + Ayushman Bharat PM-JAY + NGO/CSR grants, reducing out-of-pocket expenses to zero.
            </p>
            <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="var(--accent-green)" /> Treatment Cost Estimate Generator
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="var(--accent-green)" /> Government Scheme & NGO Matching
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="var(--accent-green)" /> Multi-Scenario AI Finance Comparison
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Role Quick Access Banner for Hackathon Demo */}
      <section style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: '20px',
          padding: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div>
            <span className="badge badge-amber" style={{ marginBottom: '8px' }}>HACKATHON DEMO NAVIGATION</span>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--text-heading)', marginBottom: '4px' }}>Explore Role-Based Protected Dashboards</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              Test the end-to-end connected workflow between Patient, Doctor, and Hospital Staff.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => onSelectRole('PATIENT')} className="btn btn-primary btn-sm">
              Launch Patient Flow
            </button>
            <button onClick={() => onSelectRole('DOCTOR')} className="btn btn-purple btn-sm">
              Launch Doctor Desk
            </button>
            <button onClick={() => onSelectRole('HOSPITAL_ADMIN')} className="btn btn-green btn-sm">
              Launch Hospital QR Scanner
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
