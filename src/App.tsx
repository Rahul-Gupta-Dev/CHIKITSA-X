import React, { useState } from 'react';
import type { UserRole, Hospital, OPDRegistration } from './types';
import { db } from './db/database';

import { RoleSwitcherBar } from './components/layout/RoleSwitcherBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

import { EmergencyModal } from './components/common/EmergencyModal';
import { LandingPage } from './components/landing/LandingPage';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { VoiceIntakeModal } from './components/patient/VoiceIntakeModal';
import { MedicalRecordOCR } from './components/patient/MedicalRecordOCR';
import { HealthProfileView } from './components/patient/HealthProfileView';
import { AITriageView } from './components/patient/AITriageView';
import { HospitalFinder } from './components/patient/HospitalFinder';
import { HospitalCompare } from './components/patient/HospitalCompare';
import { OPDRegistrationModal } from './components/patient/OPDRegistrationModal';
import { HospitalPassQR } from './components/patient/HospitalPassQR';
import { FinancialSupportView } from './components/patient/FinancialSupportView';
import { AIFinancePlanner } from './components/patient/AIFinancePlanner';

import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { HospitalAdminDashboard } from './components/hospital/HospitalAdminDashboard';

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>(db.getCurrentUser().role);
  const [activeTab, setActiveTab] = useState<string>('LANDING');

  // Modals & Navigation State
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isVoiceIntakeOpen, setIsVoiceIntakeOpen] = useState(false);
  const [isOCROpen, setIsOCROpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isFinancePlannerOpen, setIsFinancePlannerOpen] = useState(false);

  // Active Flow Entities
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isOPDModalOpen, setIsOPDModalOpen] = useState(false);
  const [activeOPDPass, setActiveOPDPass] = useState<OPDRegistration | null>(() => {
    const list = db.getOPDRegistrations();
    return list.length > 0 ? list[0] : null;
  });

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'PATIENT') setActiveTab('DASHBOARD');
    else if (role === 'DOCTOR') setActiveTab('DOCTOR_DASHBOARD');
    else if (role === 'HOSPITAL_ADMIN') setActiveTab('HOSPITAL_DASHBOARD');
  };

  const handleSelectHospital = (hosp: Hospital) => {
    setSelectedHospital(hosp);
    setIsOPDModalOpen(true);
  };

  const handleBookingConfirmed = (opd: OPDRegistration) => {
    setActiveOPDPass(opd);
    setActiveTab('DASHBOARD');
    alert(`Appointment Confirmed! Unique Reference ID: ${opd.referenceId}`);
  };

  const handleResetDemo = () => {
    if (confirm('Reset all demo state back to fresh initial seed data?')) {
      db.resetDemoState();
      window.location.reload();
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Demo Bar for Hackathon Judges */}
      <RoleSwitcherBar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
      />

      {/* Main Navbar Header */}
      <Header
        currentRole={currentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onResetDemo={handleResetDemo}
      />

      {/* Body Content Router */}
      <main style={{ flex: 1, padding: '20px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        {activeTab === 'LANDING' && (
          <LandingPage
            onStartJourney={() => {
              setIsVoiceIntakeOpen(true);
              setActiveTab('DASHBOARD');
            }}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            onSelectRole={handleRoleChange}
          />
        )}

        {activeTab === 'DASHBOARD' && currentRole === 'PATIENT' && (
          <>
            <PatientDashboard
              onOpenVoiceIntake={() => setIsVoiceIntakeOpen(true)}
              onOpenOCR={() => setIsOCROpen(true)}
              onOpenHealthProfile={() => setActiveTab('HEALTH_PROFILE')}
              onOpenTriage={() => setActiveTab('TRIAGE')}
              onOpenHospitals={() => setActiveTab('FIND_HOSPITAL')}
              onOpenFinancialSupport={() => setActiveTab('FINANCIAL_SUPPORT')}
              onOpenFinancePlanner={() => setIsFinancePlannerOpen(true)}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
            />

            {activeOPDPass && (
              <HospitalPassQR
                opd={activeOPDPass}
                onSimulateHospitalVerify={() => {
                  db.verifyQRPass(activeOPDPass.referenceId, 'Staff Reception Desk');
                  alert(`Appointment ${activeOPDPass.referenceId} verified successfully!`);
                  window.location.reload();
                }}
              />
            )}
          </>
        )}

        {activeTab === 'HEALTH_PROFILE' && (
          <HealthProfileView />
        )}

        {activeTab === 'TRIAGE' && (
          <AITriageView
            onTriageComplete={() => db.updateCareStage(4)}
            onNavigateHospitals={() => setActiveTab('FIND_HOSPITAL')}
            onNavigateEmergency={() => setIsEmergencyOpen(true)}
          />
        )}

        {activeTab === 'FIND_HOSPITAL' && (
          <HospitalFinder
            onSelectHospital={handleSelectHospital}
            onOpenCompare={() => setIsCompareOpen(true)}
          />
        )}

        {activeTab === 'FINANCIAL_SUPPORT' && (
          <FinancialSupportView
            onOpenPlanner={() => setIsFinancePlannerOpen(true)}
          />
        )}

        {activeTab === 'DOCTOR_DASHBOARD' && currentRole === 'DOCTOR' && (
          <DoctorDashboard
            onCostEstimateCreated={() => {
              setActiveTab('FINANCIAL_SUPPORT');
              alert('Treatment Cost Estimate saved! Switched to Patient Financial Support View.');
            }}
          />
        )}

        {activeTab === 'HOSPITAL_DASHBOARD' && currentRole === 'HOSPITAL_ADMIN' && (
          <HospitalAdminDashboard
            onConsentRequested={() => {
              alert('Consent access requested! Switch back to Patient role to approve consent.');
            }}
          />
        )}
      </main>

      {/* Global Modals */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onSelectHospital={handleSelectHospital}
      />

      <VoiceIntakeModal
        isOpen={isVoiceIntakeOpen}
        onClose={() => setIsVoiceIntakeOpen(false)}
        onIntakeComplete={() => {
          setActiveTab('TRIAGE');
        }}
      />

      <MedicalRecordOCR
        isOpen={isOCROpen}
        onClose={() => setIsOCROpen(false)}
        onRecordSaved={() => {
          setActiveTab('HEALTH_PROFILE');
        }}
      />

      <OPDRegistrationModal
        isOpen={isOPDModalOpen}
        selectedHospital={selectedHospital}
        onClose={() => setIsOPDModalOpen(false)}
        onBookingConfirmed={handleBookingConfirmed}
      />

      <HospitalCompare
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onSelectHospital={handleSelectHospital}
      />

      <AIFinancePlanner
        isOpen={isFinancePlannerOpen}
        onClose={() => setIsFinancePlannerOpen(false)}
      />

      <Footer />
    </div>
  );
};
