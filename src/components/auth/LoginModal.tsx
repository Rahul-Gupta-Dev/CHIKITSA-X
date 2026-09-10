import React, { useState } from 'react';
import type { UserRole } from '../../types';
import { db } from '../../db/database';
import { LogIn, UserCheck, Shield, Stethoscope, Building2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole) => void;
  onOpenRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenRegister
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('PATIENT');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    const demoUsers = db.getDemoUsers();
    let matchedUser = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!matchedUser) {
      // Create local user session for custom credentials
      matchedUser = {
        id: `usr-${Date.now()}`,
        email,
        name: email.split('@')[0] || 'Authenticated User',
        role
      };
    } else {
      matchedUser.role = role;
    }

    db.setCurrentUser(matchedUser);
    setError(null);
    onLoginSuccess(role);
    onClose();
  };

  const handleUseDemoAccount = (demoRole: UserRole, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo12345');
    setRole(demoRole);
    const demoUsers = db.getDemoUsers();
    const matched = demoUsers.find(u => u.role === demoRole) || demoUsers[0];
    db.setCurrentUser(matched);
    setError(null);
    onLoginSuccess(demoRole);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '10px', background: 'rgba(0, 180, 216, 0.15)', borderRadius: '12px', color: 'var(--primary-teal)' }}>
              <LogIn size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Sign In to CHIKITSAX</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Access Patient, Doctor, or Hospital Portal</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}>×</button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', color: '#DC2626', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Select Account Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setRole('PATIENT')}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: role === 'PATIENT' ? '2px solid var(--primary-teal)' : '1px solid var(--border-light)',
                  background: role === 'PATIENT' ? 'rgba(0, 180, 216, 0.12)' : 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <UserCheck size={18} color={role === 'PATIENT' ? 'var(--primary-teal)' : 'var(--text-muted)'} />
                Patient
              </button>

              <button
                type="button"
                onClick={() => setRole('DOCTOR')}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: role === 'DOCTOR' ? '2px solid var(--accent-purple)' : '1px solid var(--border-light)',
                  background: role === 'DOCTOR' ? 'rgba(124, 58, 237, 0.12)' : 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Stethoscope size={18} color={role === 'DOCTOR' ? 'var(--accent-purple)' : 'var(--text-muted)'} />
                Doctor
              </button>

              <button
                type="button"
                onClick={() => setRole('HOSPITAL_ADMIN')}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: role === 'HOSPITAL_ADMIN' ? '2px solid var(--accent-green)' : '1px solid var(--border-light)',
                  background: role === 'HOSPITAL_ADMIN' ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Building2 size={18} color={role === 'HOSPITAL_ADMIN' ? 'var(--accent-green)' : 'var(--text-muted)'} />
                Hospital
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g., patient@chikitsax.demo"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '20px' }}>
            <LogIn size={18} /> Sign In
          </button>
        </form>

        {/* Demo Quick Accounts Section */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', marginTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <Shield size={14} color="var(--primary-teal)" />
            SIH DEMO MODE — Quick 1-Click Login
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleUseDemoAccount('PATIENT', 'patient@chikitsax.demo')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', width: '100%' }}
            >
              <span>👤 Patient Demo</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>patient@chikitsax.demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleUseDemoAccount('DOCTOR', 'doctor@chikitsax.demo')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', width: '100%' }}
            >
              <span>👨‍⚕️ Doctor Demo</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>doctor@chikitsax.demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleUseDemoAccount('HOSPITAL_ADMIN', 'hospital@chikitsax.demo')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', width: '100%' }}
            >
              <span>🏥 Hospital Admin Demo</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>hospital@chikitsax.demo</span>
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account yet?{' '}
          <button
            onClick={() => {
              onClose();
              onOpenRegister();
            }}
            style={{ background: 'none', border: 'none', color: 'var(--primary-teal)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};
