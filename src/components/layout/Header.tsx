import React from 'react';
import type { UserRole } from '../../types';
import { db } from '../../db/database';
import { AlertCircle, RotateCcw, HeartPulse, Sun, Moon, LogIn, LogOut, QrCode } from 'lucide-react';

interface Props {
  currentRole: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenEmergency: () => void;
  onResetDemo: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLogout: () => void;
  onSelectRole?: (role: UserRole) => void;
}

export const Header: React.FC<Props> = ({
  currentRole,
  activeTab,
  setActiveTab,
  onOpenEmergency,
  onResetDemo,
  theme,
  onToggleTheme,
  onOpenLogin,
  onOpenRegister,
  onLogout,
  onSelectRole
}) => {
  const currentUser = db.getCurrentUser();

  return (
    <header style={{
      background: 'var(--bg-header)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)',
      transition: 'background 0.2s ease'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('LANDING')}>
          <div style={{
            background: 'linear-gradient(135deg, #00B4D8 0%, #7C3AED 100%)',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
            boxShadow: '0 4px 14px rgba(0, 180, 216, 0.4)'
          }}>
            <HeartPulse size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-heading)', letterSpacing: '-0.02em' }}>
                CHIKITSA<span style={{ color: 'var(--primary-teal)' }}>X</span>
              </span>
              <span className="badge badge-purple" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                AI-HEALTH MVP
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>
              From Symptoms to Care, From Care to Financial Support
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', padding: '4px 0' }}>
          <button
            onClick={() => setActiveTab('LANDING')}
            className={`btn btn-sm ${activeTab === 'LANDING' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Home / Landing
          </button>

          {currentRole === 'PATIENT' && (
            <>
              <button
                onClick={() => setActiveTab('DASHBOARD')}
                className={`btn btn-sm ${activeTab === 'DASHBOARD' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Patient Dashboard
              </button>
              <button
                onClick={() => setActiveTab('HEALTH_PROFILE')}
                className={`btn btn-sm ${activeTab === 'HEALTH_PROFILE' ? 'btn-primary' : 'btn-secondary'}`}
              >
                My Health Profile
              </button>
              <button
                onClick={() => setActiveTab('FIND_HOSPITAL')}
                className={`btn btn-sm ${activeTab === 'FIND_HOSPITAL' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Find Hospitals
              </button>
              <button
                onClick={() => setActiveTab('FINANCIAL_SUPPORT')}
                className={`btn btn-sm ${activeTab === 'FINANCIAL_SUPPORT' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Financial Support & Planner
              </button>
            </>
          )}

          {currentRole === 'DOCTOR' && (
            <button
              onClick={() => setActiveTab('DOCTOR_DASHBOARD')}
              className={`btn btn-sm ${activeTab === 'DOCTOR_DASHBOARD' ? 'btn-purple' : 'btn-secondary'}`}
            >
              Doctor Workspace
            </button>
          )}

          <button
            onClick={() => {
              if (currentRole !== 'HOSPITAL_ADMIN' && onSelectRole) {
                onSelectRole('HOSPITAL_ADMIN');
              }
              setActiveTab('HOSPITAL_DASHBOARD');
            }}
            className={`btn btn-sm ${activeTab === 'HOSPITAL_DASHBOARD' ? 'btn-green' : 'btn-secondary'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <QrCode size={14} /> Hospital QR Scanner & Verification
          </button>
        </nav>

        {/* Controls & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="btn btn-secondary btn-sm"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {theme === 'light' ? <Moon size={16} color="var(--accent-purple)" /> : <Sun size={16} color="#FBBF24" />}
            <span style={{ fontSize: '0.8rem' }}>{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>

          {/* EMERGENCY Button */}
          <button
            onClick={onOpenEmergency}
            className="btn btn-emergency-pulse btn-sm"
            style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <AlertCircle size={16} /> EMERGENCY
          </button>

          {/* User Profile Pill / Auth Buttons */}
          {currentUser ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-main)',
              padding: '4px 10px',
              borderRadius: '12px',
              border: '1px solid var(--border-light)',
              fontSize: '0.82rem'
            }}>
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                alt={currentUser.name}
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.1 }}>
                  {currentUser.name}
                </span>
                <span style={{ color: 'var(--primary-teal-dark)', fontSize: '0.7rem', fontWeight: 600 }}>
                  {currentRole}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Logout Account"
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '4px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={onOpenLogin} className="btn btn-secondary btn-sm">
                <LogIn size={14} /> Sign In
              </button>
              <button onClick={onOpenRegister} className="btn btn-primary btn-sm">
                Register
              </button>
            </div>
          )}

          {/* Reset Demo button */}
          <button
            onClick={onResetDemo}
            title="Reset All Demo Data"
            className="btn btn-secondary btn-sm"
            style={{ padding: '8px', color: 'var(--text-muted)' }}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
