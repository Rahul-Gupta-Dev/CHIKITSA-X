import React, { useState, useEffect } from 'react';
import { hospitalService, mockHospitalService } from '../../services/apiServices';
import type { Hospital } from '../../types';
import { Award, MapPin, Info, ArrowRight, Layers, Activity } from 'lucide-react';

interface Props {
  onSelectHospital: (hospital: Hospital) => void;
  onOpenCompare: () => void;
}

export const HospitalFinder: React.FC<Props> = ({ onSelectHospital, onOpenCompare }) => {
  const [filter, setFilter] = useState<'CARE_SCORE' | 'LOWEST_COST' | 'NEAREST'>('CARE_SCORE');
  const [selectedWhyHosp, setSelectedWhyHosp] = useState<Hospital | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>(() => mockHospitalService.getRankedHospitals(filter));

  useEffect(() => {
    let isMounted = true;
    hospitalService.recommendHospitals(filter, 'usr-patient-1').then((res) => {
      if (isMounted && res) {
        setHospitals(res);
      }
    });
    return () => { isMounted = false; };
  }, [filter]);

  return (
    <div style={{ padding: '10px 0' }}>
      {/* Header & Filter Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-teal">CORE USP</span>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--text-heading)', margin: 0 }}>Smart Hospital Recommendation Engine</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>
            Hospitals ranked by CHIKITSAX Care Score (Clinical Fit 35%, Affordability 25%, Distance 15%, Availability 15%, Financial Support 10%)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', padding: '4px', borderRadius: '12px', display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setFilter('CARE_SCORE')}
              className={`btn btn-sm ${filter === 'CARE_SCORE' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Best Care Score
            </button>
            <button
              onClick={() => setFilter('LOWEST_COST')}
              className={`btn btn-sm ${filter === 'LOWEST_COST' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Lowest Cost
            </button>
            <button
              onClick={() => setFilter('NEAREST')}
              className={`btn btn-sm ${filter === 'NEAREST' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Nearest Distance
            </button>
          </div>

          <button onClick={onOpenCompare} className="btn btn-purple btn-sm">
            <Layers size={16} /> Compare Hospitals
          </button>
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid-hospitals">
        {hospitals.map((hosp) => (
          <div key={hosp.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Image & Header Overlay */}
            <div style={{ position: 'relative', height: '160px' }}>
              <img
                src={hosp.image}
                alt={hosp.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.1) 0%, rgba(15, 23, 42, 0.7) 100%)'
              }} />

              {/* Care Score Pill */}
              <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                <span className="care-score-pill">
                  <Award size={16} /> Care Score: {hosp.chikitsaxCareScore}/100
                </span>
              </div>

              {/* Distance Pill */}
              <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
                <span className="badge badge-teal" style={{ backdropFilter: 'blur(8px)', background: 'rgba(15, 23, 42, 0.8)', color: '#FFF' }}>
                  <MapPin size={12} /> {hosp.distanceKm} km away
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-heading)', margin: 0, lineHeight: 1.3 }}>{hosp.name}</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '14px' }}>{hosp.tagline}</p>

              {/* Key Metrics Container */}
              <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '12px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Est. Cost Range:</span>
                  <strong style={{ color: 'var(--accent-green)' }}>₹{hosp.estimatedCostRange.min.toLocaleString()} – ₹{hosp.estimatedCostRange.max.toLocaleString()}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Emergency Availability:</span>
                  {hosp.emergencyAvailable ? (
                    <span style={{ color: 'var(--accent-green)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Activity size={12} /> 24/7 Available ({hosp.emergencyBedsFree} Beds Free)
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>Routine OPD Only</span>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Financial Support:</span>
                  <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>
                    {hosp.acceptedGovSchemes.length > 0 ? 'Insurance + Gov Scheme' : 'Private Insurance'}
                  </span>
                </div>
              </div>

              {/* Specialties Pill Row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '20px' }}>
                {hosp.specialties.slice(0, 3).map((spec, i) => (
                  <span key={i} className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                    {spec}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSelectedWhyHosp(hosp)}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  <Info size={14} /> Why Recommended?
                </button>

                <button
                  onClick={() => onSelectHospital(hosp)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1.2 }}
                >
                  Select Hospital <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* "Why Recommended?" Transparent Breakdown Modal */}
      {selectedWhyHosp && (
        <div className="modal-overlay" onClick={() => setSelectedWhyHosp(null)}>
          <div className="modal-content" style={{ maxWidth: '580px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-teal">ALGORITHM TRANSPARENCY</span>
                <h3 style={{ color: 'var(--text-heading)', fontSize: '1.3rem', margin: '4px 0 0' }}>
                  Why Recommended: {selectedWhyHosp.name}
                </h3>
              </div>
              <button onClick={() => setSelectedWhyHosp(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}>
                ×
              </button>
            </div>

            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--primary-teal)', borderRadius: '14px', padding: '16px', marginBottom: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL CHIKITSAX CARE SCORE</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-heading)', fontFamily: 'Outfit' }}>
                {selectedWhyHosp.chikitsaxCareScore}<span style={{ fontSize: '1.2rem', color: 'var(--primary-teal)' }}>/100</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ color: 'var(--primary-teal-dark)', fontWeight: 700, fontSize: '0.88rem' }}>✓ Clinical Specialty Fit (35% Weight)</div>
                <div style={{ color: 'var(--text-main)', fontSize: '0.84rem', marginTop: '2px' }}>{selectedWhyHosp.whyRecommended.specialtyMatch}</div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.88rem' }}>✓ Cost & Financial Feasibility (25% Weight)</div>
                <div style={{ color: 'var(--text-main)', fontSize: '0.84rem', marginTop: '2px' }}>{selectedWhyHosp.whyRecommended.costFeasibility}</div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ color: 'var(--accent-purple)', fontWeight: 700, fontSize: '0.88rem' }}>✓ Proximity & Travel Distance (15% Weight)</div>
                <div style={{ color: 'var(--text-main)', fontSize: '0.84rem', marginTop: '2px' }}>{selectedWhyHosp.whyRecommended.proximityReason}</div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ color: 'var(--warning-amber)', fontWeight: 700, fontSize: '0.88rem' }}>✓ OPD & ICU Availability (15% Weight)</div>
                <div style={{ color: 'var(--text-main)', fontSize: '0.84rem', marginTop: '2px' }}>{selectedWhyHosp.whyRecommended.availabilityReason}</div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', padding: '12px', borderRadius: '10px' }}>
                <div style={{ color: 'var(--primary-teal-dark)', fontWeight: 700, fontSize: '0.88rem' }}>✓ Scheme & NGO Partnerships (10% Weight)</div>
                <div style={{ color: 'var(--text-main)', fontSize: '0.84rem', marginTop: '2px' }}>{selectedWhyHosp.whyRecommended.financialSupportReason}</div>
              </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button
                onClick={() => {
                  onSelectHospital(selectedWhyHosp);
                  setSelectedWhyHosp(null);
                }}
                className="btn btn-primary"
              >
                Select {selectedWhyHosp.name} →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
