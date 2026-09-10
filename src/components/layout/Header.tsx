import React from 'react';
import type { UserRole } from '../../types';
import { db } from '../../db/database';
import { AlertCircle, RotateCcw, HeartPulse } from 'lucide-react';

interface Props {
  currentRole: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenEmergency: () => void;
  onResetDemo: () => void;
}

export const Header: React.FC<Props> = ({
  currentRole,
  activeTab,
  setActiveTab,
  onOpenEmergency,
  onResetDemo
}) => {
  const currentUser = db.getCurrentUser();

  return (
    <header style={{
      background: 'rgba(10, 25, 47, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
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
              <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit', color: '#FFF', letterSpacing: '-0.02em' }}>
                CHIKITSA<span style={{ color: '#00B4D8' }}>X</span>
              </span>
              <span className="badge badge-purple" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                AI-HEALTH MVP
              </span>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.75rem', margin: 0 }}>
              From Symptoms to Care, From Care to Financial Support
            </p>
          </div>
        </div>

        {/* Dynamic Navigation according to Role */}
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

          {currentRole === 'HOSPITAL_ADMIN' && (
            <button
              onClick={() => setActiveTab('HOSPITAL_DASHBOARD')}
              className={`btn btn-sm ${activeTab === 'HOSPITAL_DASHBOARD' ? 'btn-green' : 'btn-secondary'}`}
            >
              Hospital QR Scanner & Verification
            </button>
          )}
        </nav>

        {/* Actions & Emergency Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Always Visible EMERGENCY Button */}
          <button
            onClick={onOpenEmergency}
            className="btn btn-emergency-pulse btn-sm"
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <AlertCircle size={16} /> EMERGENCY HELP
          </button>

          {/* User Profile info pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: '0.82rem',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontWeight: 600, color: '#FFF', lineHeight: 1.2 }}>
                {currentUser.name}
              </div>
              <div style={{ color: '#00B4D8', fontSize: '0.72rem' }}>
                {currentRole}
              </div>
            </div>
          </div>

          {/* Reset Demo button */}
          <button
            onClick={onResetDemo}
            title="Reset All Demo Data"
            className="btn btn-secondary btn-sm"
            style={{ padding: '8px', color: '#94A3B8' }}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
