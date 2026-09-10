import React, { useState } from 'react';
import type { UserRole } from '../../types';
import { db } from '../../db/database';
import { UserPlus, UserCheck, Stethoscope, Building2 } from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (role: UserRole) => void;
  onOpenLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
  onOpenLogin
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('PATIENT');
  const [age, setAge] = useState<number>(32);
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      email,
      name: fullName,
      role,
      phone
    };

    db.setCurrentUser(newUser);

    if (role === 'PATIENT') {
      db.updatePatientProfile({
        fullName,
        email,
        phone: phone || '+91 98765 43210',
        age,
        gender
      });
    }

    setError(null);
    onRegisterSuccess(role);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '10px', background: 'rgba(124, 58, 237, 0.15)', borderRadius: '12px', color: 'var(--accent-purple)' }}>
              <UserPlus size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Create CHIKITSAX Account</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Register for Personalized Care Navigation</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}>×</button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', color: '#DC2626', fontSize: '0.85rem', marginBottom: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '14px' }}>
            <label className="form-label">I am registering as</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setRole('PATIENT')}
                style={{
                  padding: '8px',
                  borderRadius: '10px',
                  border: role === 'PATIENT' ? '2px solid var(--primary-teal)' : '1px solid var(--border-light)',
                  background: role === 'PATIENT' ? 'rgba(0, 180, 216, 0.12)' : 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <UserCheck size={16} /> Patient
              </button>

              <button
                type="button"
                onClick={() => setRole('DOCTOR')}
                style={{
                  padding: '8px',
                  borderRadius: '10px',
                  border: role === 'DOCTOR' ? '2px solid var(--accent-purple)' : '1px solid var(--border-light)',
                  background: role === 'DOCTOR' ? 'rgba(124, 58, 237, 0.12)' : 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Stethoscope size={16} /> Doctor
              </button>

              <button
                type="button"
                onClick={() => setRole('HOSPITAL_ADMIN')}
                style={{
                  padding: '8px',
                  borderRadius: '10px',
                  border: role === 'HOSPITAL_ADMIN' ? '2px solid var(--accent-green)' : '1px solid var(--border-light)',
                  background: role === 'HOSPITAL_ADMIN' ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Building2 size={16} /> Hospital
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Rahul Sharma"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="rahul@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          {role === 'PATIENT' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="form-label">Gender</label>
                <select className="form-control" value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
            <div>
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
            <div>
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-purple" style={{ width: '100%', marginBottom: '16px' }}>
            <UserPlus size={18} /> Register Account
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <button
            onClick={() => {
              onClose();
              onOpenLogin();
            }}
            style={{ background: 'none', border: 'none', color: 'var(--primary-teal)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
