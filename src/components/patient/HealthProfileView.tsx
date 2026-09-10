import React, { useState } from 'react';
import { db } from '../../db/database';
import type { PatientProfile } from '../../types';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { Pill, Heart, Phone, MapPin, Edit3, CheckCircle2 } from 'lucide-react';

export const HealthProfileView: React.FC = () => {
  const [profile, setProfile] = useState<PatientProfile>(db.getPatientProfile());
  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState(profile.fullName);
  const [age, setAge] = useState(profile.age);
  const [bloodGroup, setBloodGroup] = useState(profile.bloodGroup);

  const handleSave = () => {
    const updated = db.updatePatientProfile({ fullName, age: Number(age), bloodGroup });
    setProfile(updated);
    setIsEditing(false);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '10px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span className="badge badge-teal">UNIFIED HEALTH RECORD</span>
          <h2 style={{ fontSize: '1.8rem', color: '#FFF', margin: '4px 0 0' }}>My Unified Patient Health Profile</h2>
        </div>

        <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="btn btn-secondary btn-sm">
          {isEditing ? <><CheckCircle2 size={16} color="#10B981" /> Save Changes</> : <><Edit3 size={16} /> Edit Profile</>}
        </button>
      </div>

      <DisclaimerBanner text="AI-assisted summary synthesized from voice intake and uploaded medical records. Always verify clinical information with your treating physician." />

      {/* Main Profile Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Personal Details */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <img src={db.getCurrentUser().avatar} alt={profile.fullName} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="form-control" style={{ padding: '4px 8px' }} />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="form-control" style={{ padding: '4px 8px', width: '70px' }} />
                    <input type="text" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="form-control" style={{ padding: '4px 8px', width: '80px' }} />
                  </div>
                </div>
              ) : (
                <>
                  <h3 style={{ fontSize: '1.3rem', color: '#FFF', margin: 0 }}>{profile.fullName}</h3>
                  <div style={{ color: '#94A3B8', fontSize: '0.82rem' }}>
                    Age {profile.age} • {profile.gender} • Blood Group: <strong style={{ color: '#00B4D8' }}>{profile.bloodGroup}</strong>
                  </div>
                </>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#CBD5E1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} color="#00B4D8" /> <span>{profile.phone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="#00B4D8" /> <span>{profile.address}, {profile.city} ({profile.pincode})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={16} color="#EF4444" /> <span>Emergency Contact: <strong>{profile.emergencyContact.name} ({profile.emergencyContact.relationship})</strong> - {profile.emergencyContact.phone}</span>
            </div>
          </div>
        </div>

        {/* Symptoms & History */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h4 style={{ color: '#00B4D8', fontSize: '0.95rem', textTransform: 'uppercase', marginBottom: '12px' }}>
            Active Symptoms & Medical History
          </h4>

          <div style={{ marginBottom: '14px' }}>
            <div style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '6px' }}>Reported Symptoms:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {profile.symptoms.map((s, i) => (
                <span key={i} className="badge badge-teal">{s}</span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <div style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '4px' }}>Pre-existing Medical Conditions:</div>
            <ul style={{ listStyle: 'none', color: '#FFF', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {profile.medicalHistory.map((m, i) => (
                <li key={i}>• {m}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Medications & Allergies */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h4 style={{ color: '#10B981', fontSize: '0.95rem', textTransform: 'uppercase', marginBottom: '12px' }}>
            Extracted Prescriptions & Allergies
          </h4>

          <div style={{ marginBottom: '14px' }}>
            <div style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '6px' }}>Active Medications (via OCR):</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {profile.medications.map((med, i) => (
                <div key={i} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '8px 12px', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }}>
                  <Pill size={14} color="#10B981" style={{ display: 'inline', marginRight: '6px' }} />
                  {med}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '6px' }}>Known Allergies:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {profile.allergies.map((all, i) => (
                <span key={i} className="badge badge-red">{all}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Profile Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h4 style={{ color: '#FBBF24', fontSize: '0.95rem', textTransform: 'uppercase', marginBottom: '12px' }}>
            Financial & Scheme Eligibility Parameters
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#CBD5E1' }}>
            <div>Insurance Provider: <strong style={{ color: '#FFF' }}>{profile.insuranceProvider || 'Star Health'}</strong></div>
            <div>Policy Number: <strong style={{ color: '#FFF' }}>{profile.policyNumber || 'SH-2024-998124'}</strong></div>
            <div>Ration Card Type: <span className="badge badge-green">{profile.rationCardType} (Eligible for PM-JAY)</span></div>
            <div>Income Bracket: <strong style={{ color: '#FFF' }}>{profile.incomeCategory}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
