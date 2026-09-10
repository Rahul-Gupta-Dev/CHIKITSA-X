import React from 'react';
import { Info } from 'lucide-react';

interface Props {
  text?: string;
  type?: 'CLINICAL' | 'FINANCIAL';
}

export const DisclaimerBanner: React.FC<Props> = ({
  text,
  type = 'CLINICAL'
}) => {
  const defaultText = type === 'CLINICAL'
    ? 'AI-Assisted Intake & Triage only. This does NOT provide a medical diagnosis. Professional medical evaluation by a licensed physician is required.'
    : 'Financial figures, scheme matches, and insurance projections are estimates based on prototype rules and subject to hospital billing verification.';

  return (
    <div style={{
      background: 'rgba(124, 58, 237, 0.1)',
      border: '1px solid rgba(124, 58, 237, 0.3)',
      borderRadius: '10px',
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '0.82rem',
      color: '#C4B5FD',
      margin: '12px 0'
    }}>
      <Info size={16} style={{ flexShrink: 0, color: '#A78BFA' }} />
      <div>
        <strong>AI Transparency Notice:</strong> {text || defaultText}
      </div>
    </div>
  );
};
