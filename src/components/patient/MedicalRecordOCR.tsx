import React, { useState } from 'react';
import { mockOCRService } from '../../services/apiServices';
import type { MedicalRecord } from '../../types';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { FileText, Upload, CheckCircle2, Edit3, Plus, Trash2, X, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRecordSaved: (record: MedicalRecord) => void;
}

export const MedicalRecordOCR: React.FC<Props> = ({ isOpen, onClose, onRecordSaved }) => {
  const [fileType, setFileType] = useState<'PDF' | 'JPG' | 'PNG'>('PDF');
  const [category, setCategory] = useState<MedicalRecord['category']>('Prescription');
  const [selectedFileName, setSelectedFileName] = useState('Prescription_Cardiology_2024.pdf');

  const [step, setStep] = useState<'UPLOAD' | 'PROCESSING' | 'REVIEW'>('UPLOAD');
  const [extractedRecord, setExtractedRecord] = useState<MedicalRecord | null>(null);

  // Editable fields
  const [editedMedicines, setEditedMedicines] = useState<string[]>([]);
  const [editedDiagnosis, setEditedDiagnosis] = useState('');
  const [editedCondition, setEditedCondition] = useState('');

  const handleStartUpload = async () => {
    setStep('PROCESSING');
    try {
      const rec = await mockOCRService.processUploadedFile(selectedFileName, fileType, category);
      setExtractedRecord(rec);

      // Populate editable fields
      setEditedMedicines(rec.ocrExtractedData.medicinesExtracted || []);
      setEditedDiagnosis(rec.ocrExtractedData.diagnosisExtracted || '');
      setEditedCondition(rec.ocrExtractedData.previousCondition || '');

      setStep('REVIEW');
    } catch {
      setStep('UPLOAD');
    }
  };

  const handleSaveToProfile = () => {
    if (!extractedRecord) return;
    const finalRecord: MedicalRecord = {
      ...extractedRecord,
      ocrExtractedData: {
        ...extractedRecord.ocrExtractedData,
        medicinesExtracted: editedMedicines,
        diagnosisExtracted: editedDiagnosis,
        previousCondition: editedCondition
      },
      isVerifiedByPatient: true
    };
    onRecordSaved(finalRecord);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '680px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, #00B4D8 0%, #7C3AED 100%)', padding: '8px', borderRadius: '10px', color: '#FFF' }}>
              <FileText size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#FFF', margin: 0 }}>Medical Record Upload & OCR Engine</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: 0 }}>Extract medicines & diagnostics from prescriptions or lab reports</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <DisclaimerBanner text="AI/OCR extracted information — verify and edit extracted details before saving to your health profile." />

        {step === 'UPLOAD' && (
          <div>
            {/* Category selection */}
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Document Category:</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                {(['Prescription', 'Lab Report', 'Discharge Summary', 'Radiology Report', 'Other'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setSelectedFileName(`${cat.replace(/\s+/g, '_')}_Demo_Record.pdf`);
                    }}
                    className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.82rem' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* File format */}
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">File Format:</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {(['PDF', 'JPG', 'PNG'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFileType(fmt)}
                    className={`btn btn-sm ${fileType === fmt ? 'btn-purple' : 'btn-secondary'}`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Drag & Drop Simulation Zone */}
            <div style={{
              border: '2px dashed rgba(0, 180, 216, 0.4)',
              borderRadius: '14px',
              padding: '36px 20px',
              textAlign: 'center',
              background: 'rgba(10, 25, 47, 0.5)',
              marginBottom: '20px',
              cursor: 'pointer'
            }}>
              <Upload size={40} color="#00B4D8" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#FFF', fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>
                Selected Document: <span style={{ color: '#00B4D8' }}>{selectedFileName}</span>
              </p>
              <p style={{ color: '#94A3B8', fontSize: '0.82rem' }}>
                Click below to process document with CHIKITSAX OCR Engine
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleStartUpload} className="btn btn-primary">
                Upload & Process OCR <Sparkles size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 'PROCESSING' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid rgba(0, 180, 216, 0.2)',
              borderTopColor: '#00B4D8',
              borderRadius: '50%',
              margin: '0 auto 20px',
              animation: 'spin 1s linear infinite'
            }} />
            <h4 style={{ color: '#FFF', fontSize: '1.2rem', marginBottom: '8px' }}>OCR Image Scanning & Text Extraction...</h4>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Extracting active medicines, previous diagnoses, and lab values</p>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {step === 'REVIEW' && extractedRecord && (
          <div>
            <div style={{ background: 'rgba(0, 180, 216, 0.1)', border: '1px solid rgba(0, 180, 216, 0.3)', borderRadius: '12px', padding: '14px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00B4D8', fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>
                <CheckCircle2 size={18} /> Extracted Document Summary ({category})
              </div>
              <p style={{ color: '#CBD5E1', fontSize: '0.82rem', margin: 0 }}>
                File: {extractedRecord.fileName} • Doctor/Clinic: {extractedRecord.ocrExtractedData.doctorName || 'General Clinic'}
              </p>
            </div>

            {/* Editable Extracted Medicines */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Edit3 size={14} color="#00B4D8" /> Extracted Medicines (Editable):
                </label>
                <button
                  onClick={() => setEditedMedicines([...editedMedicines, 'New Medicine 10mg OD'])}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '2px 8px' }}
                >
                  <Plus size={12} /> Add Medicine
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {editedMedicines.map((med, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={med}
                      onChange={(e) => {
                        const copy = [...editedMedicines];
                        copy[idx] = e.target.value;
                        setEditedMedicines(copy);
                      }}
                      className="form-control"
                      style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                    />
                    <button
                      onClick={() => setEditedMedicines(editedMedicines.filter((_, i) => i !== idx))}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Editable Lab Values / Diagnosis */}
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Extracted Previous Condition / Diagnosis:</label>
              <input
                type="text"
                value={editedCondition || editedDiagnosis || 'Type 2 Diabetes Mellitus'}
                onChange={(e) => setEditedCondition(e.target.value)}
                className="form-control"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button onClick={() => setStep('UPLOAD')} className="btn btn-secondary">
                Upload Different File
              </button>
              <button onClick={handleSaveToProfile} className="btn btn-green">
                Confirm & Add to Health Profile ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
