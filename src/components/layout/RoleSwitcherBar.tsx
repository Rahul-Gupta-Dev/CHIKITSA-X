import React from 'react';
import type { UserRole } from '../../types';
import { db } from '../../db/database';
import { Shield, User, Stethoscope, Building2 } from 'lucide-react';

interface Props {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const RoleSwitcherBar: React.FC<Props> = ({ currentRole, onRoleChange }) => {
  const demoUsers = db.getDemoUsers();

  const handleSwitch = (role: UserRole) => {
    const targetUser = demoUsers.find(u => u.role === role);
    if (targetUser) {
      db.setCurrentUser(targetUser);
      onRoleChange(role);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(90deg, #0A192F 0%, #1C2541 100%)',
      borderBottom: '1px solid rgba(0, 180, 216, 0.25)',
      padding: '8px 16px',
      fontSize: '0.85rem'
    }} className="flex flex-wrap items-center justify-between gap-3 text-slate-200">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="badge badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Shield size={13} /> SIH DEMO MODE
        </span>
        <span style={{ color: '#94A3B8', fontSize: '0.82rem' }}>Quick Role Switcher for Judges:</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => handleSwitch('PATIENT')}
          className={`btn btn-sm ${currentRole === 'PATIENT' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ gap: '6px' }}
        >
          <User size={14} />
          Patient Demo <span style={{ opacity: 0.75, fontSize: '0.75rem' }}>(patient@chikitsax.demo)</span>
        </button>

        <button
          onClick={() => handleSwitch('DOCTOR')}
          className={`btn btn-sm ${currentRole === 'DOCTOR' ? 'btn-purple' : 'btn-secondary'}`}
          style={{ gap: '6px' }}
        >
          <Stethoscope size={14} />
          Doctor Workspace <span style={{ opacity: 0.75, fontSize: '0.75rem' }}>(doctor@chikitsax.demo)</span>
        </button>

        <button
          onClick={() => handleSwitch('HOSPITAL_ADMIN')}
          className={`btn btn-sm ${currentRole === 'HOSPITAL_ADMIN' ? 'btn-green' : 'btn-secondary'}`}
          style={{ gap: '6px' }}
        >
          <Building2 size={14} />
          Hospital Admin <span style={{ opacity: 0.75, fontSize: '0.75rem' }}>(hospital@chikitsax.demo)</span>
        </button>
      </div>
    </div>
  );
};
