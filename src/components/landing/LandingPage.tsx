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
        padding: '60px 20px 80px',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 30%, rgba(0, 180, 216, 0.15) 0%, rgba(10, 25, 47, 0) 70%)',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }} className="badge badge-purple">
            <Sparkles size={14} /> SMART INDIA HACKATHON PROTOTYPE
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #FFFFFF 30%, #00B4D8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Intelligent Healthcare.<br />Affordable Care.
          </h1>

          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
            color: '#CBD5E1',
            maxWidth: '720px',
            margin: '0 auto 36px',
            lineHeight: 1.5
          }}>
            Understand your symptoms, find the right care, and plan the cost — in one connected journey.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={onStartJourney}
              className="btn btn-primary"
              style={{ padding: '16px 32px', fontSize: '1.1rem' }}
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
            marginTop: '40px',
            display: 'inline-block',
            background: 'rgba(0, 180, 216, 0.1)',
            border: '1px solid rgba(0, 180, 216, 0.3)',
            borderRadius: '30px',
            padding: '8px 24px',
            fontSize: '0.9rem',
            color: '#00B4D8',
            fontWeight: 600
          }}>
            "Not just a hospital finder. A complete Care-to-Cost ecosystem."
          </div>
        </div>
      </section>

      {/* 3 Core USP Cards Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>The 3 Pillars of CHIKITSAX</h2>
          <p style={{ color: '#94A3B8' }}>Seamlessly bridging clinical triage with financial feasibility</p>
        </div>

        <div className="grid-cards">
          {/* Card 1: UNDERSTAND */}
          <div className="glass-panel" style={{ padding: '30px', position: 'relative' }}>
            <div style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              marginBottom: '20px'
            }}>
              <Mic size={28} />
            </div>
            <span className="badge badge-purple" style={{ marginBottom: '10px' }}>1. UNDERSTAND</span>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>AI Voice Intake & OCR Record Intelligence</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '16px' }}>
              Speak your symptoms in natural regional language or upload paper prescriptions & lab reports. Our AI extracts structured health parameters instantly.
            </p>
            <ul style={{ listStyle: 'none', color: '#CBD5E1', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#10B981" /> Web Speech-to-Text Voice Intake
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#10B981" /> OCR Prescription & Lab Report Extraction
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#10B981" /> Unified Health Profile & Clinical Triage
              </li>
            </ul>
          </div>

          {/* Card 2: FIND */}
          <div className="glass-panel" style={{ padding: '30px', position: 'relative' }}>
            <div style={{
              background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              marginBottom: '20px'
            }}>
              <Building2 size={28} />
            </div>
            <span className="badge badge-teal" style={{ marginBottom: '10px' }}>2. FIND</span>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>CHIKITSAX Care Score Recommendation</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '16px' }}>
              Ranks tertiary hospitals using a 5-vector algorithm (Clinical Fit 35%, Affordability 25%, Distance 15%, Availability 15%, Financial Support 10%).
            </p>
            <ul style={{ listStyle: 'none', color: '#CBD5E1', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#00B4D8" /> Transparent "Why Recommended?" Reasoning
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#00B4D8" /> Instant OPD Registration & Ref ID
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#00B4D8" /> Secure Token QR Code Visit Pass
              </li>
            </ul>
          </div>

          {/* Card 3: AFFORD */}
          <div className="glass-panel" style={{ padding: '30px', position: 'relative' }}>
            <div style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              marginBottom: '20px'
            }}>
              <Wallet size={28} />
            </div>
            <span className="badge badge-green" style={{ marginBottom: '10px' }}>3. AFFORD</span>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Care-to-Cost & AI Finance Planner</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '16px' }}>
              Calculates your net Financial Gap by stacking Insurance + Ayushman Bharat PM-JAY + NGO/CSR grants, reducing out-of-pocket expenses to zero.
            </p>
            <ul style={{ listStyle: 'none', color: '#CBD5E1', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#10B981" /> Treatment Cost Estimate Generator
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#10B981" /> Government Scheme & NGO Matching
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#10B981" /> Multi-Scenario AI Finance Comparison
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Role Quick Access Banner for Hackathon Demo */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 40px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(0, 180, 216, 0.3)',
          borderRadius: '20px',
          padding: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <span className="badge badge-amber" style={{ marginBottom: '8px' }}>HACKATHON DEMO NAVIGATION</span>
            <h3 style={{ fontSize: '1.5rem', color: '#FFF' }}>Explore Role-Based Protected Dashboards</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem', margin: 0 }}>
              Test the end-to-end connected workflow between Patient, Doctor, and Hospital Staff.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
