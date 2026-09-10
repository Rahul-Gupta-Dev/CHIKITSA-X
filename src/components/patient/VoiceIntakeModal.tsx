import React, { useState, useEffect } from 'react';
import { mockVoiceService } from '../../services/apiServices';
import type { SymptomIntake } from '../../types';
import { DisclaimerBanner } from '../common/DisclaimerBanner';
import { Mic, MicOff, Volume2, CheckCircle, Sparkles, X, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onIntakeComplete: (intake: SymptomIntake) => void;
}

const DEMO_TRANSCRIPTS = [
  "I have been experiencing chest discomfort, mild shortness of breath, and fatigue on walking since yesterday.",
  "Severe sharp chest pain radiating to left shoulder with heavy sweating for the last 2 hours.",
  "Feeling dizzy with persistent mild headache and low energy after walking upstairs."
];

export const VoiceIntakeModal: React.FC<Props> = ({ isOpen, onClose, onIntakeComplete }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<SymptomIntake | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
      setResult(null);
    }
  }, [isOpen]);

  const handleStartListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
        };

        recognition.onerror = () => {
          setIsListening(false);
          setTranscript(DEMO_TRANSCRIPTS[0]);
        };

        recognition.onend = () => setIsListening(false);
        recognition.start();
      } catch {
        simulateVoiceInput(DEMO_TRANSCRIPTS[0]);
      }
    } else {
      simulateVoiceInput(DEMO_TRANSCRIPTS[0]);
    }
  };

  const simulateVoiceInput = (sampleText: string) => {
    setIsListening(true);
    setTranscript('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < sampleText.length) {
        setTranscript(sampleText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsListening(false);
      }
    }, 30);
  };

  const handleProcessIntake = async () => {
    if (!transcript.trim()) return;
    setIsProcessing(true);
    try {
      const intakeData = await mockVoiceService.processVoiceTranscript(transcript);
      setResult(intakeData);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #00B4D8 100%)', padding: '8px', borderRadius: '10px', color: '#FFF' }}>
              <Mic size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#FFF', margin: 0 }}>AI Voice Symptom Intake</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: 0 }}>Speak naturally in regional language or English</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <DisclaimerBanner text="AI-Assisted Intake — Not a Medical Diagnosis. Structured symptoms will be reviewed by a medical professional." />

        {!result ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div
                onClick={isListening ? () => setIsListening(false) : handleStartListening}
                className={isListening ? 'mic-pulse' : ''}
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: isListening
                    ? 'linear-gradient(135deg, #EF4444 0%, #7C3AED 100%)'
                    : 'linear-gradient(135deg, #00B4D8 0%, #7C3AED 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFF',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(0, 180, 216, 0.3)'
                }}
              >
                {isListening ? <MicOff size={36} /> : <Mic size={36} />}
              </div>
            </div>

            <p style={{ fontSize: '0.95rem', color: '#CBD5E1', marginBottom: '16px' }}>
              {isListening ? 'Listening... Speak your symptoms clearly.' : 'Click microphone to start voice recording'}
            </p>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', padding: '12px', marginBottom: '20px', textAlign: 'left' }}>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '8px', fontWeight: 600 }}>
                OR TRY SAMPLE DEMO VOICE TRANSCRIPTS (FOR HACKATHON PRESENTATION):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {DEMO_TRANSCRIPTS.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => simulateVoiceInput(sample)}
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'flex-start', fontSize: '0.8rem', textTransform: 'none', textAlign: 'left' }}
                  >
                    <Volume2 size={13} style={{ color: '#00B4D8', flexShrink: 0 }} /> "{sample.substring(0, 55)}..."
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ textAlign: 'left' }}>Recognized Transcript (Editable):</label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Spoken symptoms will appear here in real-time..."
                rows={3}
                className="form-control"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleProcessIntake}
                disabled={!transcript.trim() || isProcessing}
                className="btn btn-purple"
              >
                {isProcessing ? 'Processing AI Intake...' : 'Extract Symptoms & Continue'} <Sparkles size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 700, fontSize: '1rem', marginBottom: '8px' }}>
                <CheckCircle size={20} /> AI Intake Extraction Completed
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem', color: '#E2E8F0', marginTop: '12px' }}>
                <div>
                  <span style={{ color: '#94A3B8' }}>Extracted Symptoms:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                    {result.extractedSymptoms.map((sym, i) => (
                      <span key={i} className="badge badge-teal">{sym}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <span style={{ color: '#94A3B8' }}>Duration:</span>
                  <div style={{ fontWeight: 600, color: '#FFF', marginTop: '4px' }}>{result.duration}</div>
                </div>

                <div>
                  <span style={{ color: '#94A3B8' }}>Severity Level:</span>
                  <div style={{ marginTop: '4px' }}>
                    <span className={`badge ${result.severity === 'Severe' ? 'badge-red' : 'badge-amber'}`}>
                      {result.severity}
                    </span>
                  </div>
                </div>

                <div>
                  <span style={{ color: '#94A3B8' }}>Body System:</span>
                  <div style={{ fontWeight: 600, color: '#FFF', marginTop: '4px' }}>{result.affectedBodyPart}</div>
                </div>
              </div>
            </div>

            {result.isEmergencyAlert && (
              <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444', borderRadius: '12px', padding: '12px', marginBottom: '16px', color: '#F87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} /> High Severity Flag: Immediate medical evaluation is strongly recommended.
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setResult(null)} className="btn btn-secondary">
                Re-record Intake
              </button>
              <button
                onClick={() => {
                  onIntakeComplete(result);
                  onClose();
                }}
                className="btn btn-primary"
              >
                Save & Update Health Profile →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
