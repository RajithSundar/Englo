/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ResizableSplitPane } from './components/ResizableSplitPane';
import { ProblemDescription } from './components/ProblemDescription';
import { AlgoWorkspace } from './components/algo/AlgoWorkspace';
import { SystemDesignWorkspace } from './components/canvas/SystemDesignWorkspace';
import { AutomatedTestSuiteModal } from './components/testing/AutomatedTestSuiteModal';
import { LandingPage } from './components/landing/LandingPage';
import { AuthView } from './components/auth/AuthView';
import { AuthModal } from './components/auth/AuthModal';
import { VerificationCertificateModal } from './components/credential/VerificationCertificateModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { RazorpayCheckoutModal } from './components/checkout/RazorpayCheckoutModal';
import { RazorpayXBountyModal } from './components/payout/RazorpayXBountyModal';
import { usePlatformStore } from './store/usePlatformStore';
import { PROBLEMS } from './data/problems';

export default function App() {
  const {
    activeView,
    setActiveView,
    activeProblemId,
    isCertificateModalOpen,
    setCertificateModalOpen,
    isShortcutsModalOpen,
    setShortcutsModalOpen,
    isCheckoutModalOpen,
    setCheckoutModalOpen,
    isBountyModalOpen,
    setBountyModalOpen,
    toggleDarkMode
  } = usePlatformStore();

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea';

      // ⌘/Ctrl + K: Focus ledger search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setActiveView('dashboard');
        setTimeout(() => {
          const input = document.getElementById('ledger-search-input') as HTMLInputElement | null;
          input?.focus();
          input?.select();
        }, 60);
        return;
      }

      // ⌘/Ctrl + B: Toggle dark/light theme
      if ((e.metaKey || e.ctrlKey) && (e.key === 'b' || e.key === 'B') && !e.shiftKey) {
        e.preventDefault();
        toggleDarkMode();
        return;
      }

      // ⌘/Ctrl + Shift + C: Open Verified Credential Modal
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        setCertificateModalOpen(!isCertificateModalOpen);
        return;
      }

      // ?: Open keyboard shortcuts (if not inside textarea or input)
      if (e.key === '?' && !isInput) {
        e.preventDefault();
        setShortcutsModalOpen(!isShortcutsModalOpen);
        return;
      }

      // Escape: Close open modals
      if (e.key === 'Escape') {
        if (isCertificateModalOpen) setCertificateModalOpen(false);
        if (isShortcutsModalOpen) setShortcutsModalOpen(false);
        if (isCheckoutModalOpen) setCheckoutModalOpen(false);
        if (isBountyModalOpen) setBountyModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [
    setActiveView,
    toggleDarkMode,
    isCertificateModalOpen,
    setCertificateModalOpen,
    isShortcutsModalOpen,
    setShortcutsModalOpen,
    isCheckoutModalOpen,
    setCheckoutModalOpen,
    isBountyModalOpen,
    setBountyModalOpen
  ]);

  const activeProblem =
    PROBLEMS.find((p) => p.id === activeProblemId) || PROBLEMS[0];

  if (activeView === 'landing') {
    return (
      <div className="min-h-screen bg-[#F4F6F4] dark:bg-[#1E272C] text-[#2F3E46] dark:text-[#CAD2C5] font-sans selection:bg-[#52796F] selection:text-[#CAD2C5]">
        <LandingPage />
        {/* Quick Authentication Modal */}
        <AuthModal />
        {/* Automated Test Suite Modal */}
        <AutomatedTestSuiteModal />
        {/* Verification Certificate Modal */}
        <VerificationCertificateModal
          isOpen={isCertificateModalOpen}
          onClose={() => setCertificateModalOpen(false)}
        />
        {/* Keyboard Shortcuts Sheet Modal */}
        <KeyboardShortcutsModal
          isOpen={isShortcutsModalOpen}
          onClose={() => setShortcutsModalOpen(false)}
        />
        {/* Razorpay Standard B2B Checkout Modal */}
        <RazorpayCheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setCheckoutModalOpen(false)}
        />
        {/* RazorpayX ₹5,000 Bounty Disbursement Modal */}
        <RazorpayXBountyModal
          isOpen={isBountyModalOpen}
          onClose={() => setBountyModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F4F6F4] dark:bg-[#1E272C] text-[#2F3E46] dark:text-[#CAD2C5] flex flex-col font-sans selection:bg-[#52796F] selection:text-[#CAD2C5] overflow-hidden">
      {/* Global Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'auth' && <AuthView />}

        {activeView === 'algo_workspace' && (
          <ResizableSplitPane
            initialSplitPercentage={36}
            minPercentage={26}
            maxPercentage={52}
            leftPane={<ProblemDescription problem={activeProblem} />}
            rightPane={<AlgoWorkspace problem={activeProblem} />}
          />
        )}

        {activeView === 'system_design_workspace' && (
          <ResizableSplitPane
            initialSplitPercentage={24}
            minPercentage={18}
            maxPercentage={45}
            leftPane={<ProblemDescription problem={activeProblem} />}
            rightPane={<SystemDesignWorkspace problem={activeProblem} />}
          />
        )}
      </main>

      {/* Automated Test Suite Modal */}
      <AutomatedTestSuiteModal />

      {/* Quick Authentication Modal */}
      <AuthModal />

      {/* Verification Certificate Modal */}
      <VerificationCertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setCertificateModalOpen(false)}
      />

      {/* Keyboard Shortcuts Sheet Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />

      {/* Razorpay Standard B2B Checkout Modal */}
      <RazorpayCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
      />

      {/* RazorpayX ₹5,000 Bounty Disbursement Modal */}
      <RazorpayXBountyModal
        isOpen={isBountyModalOpen}
        onClose={() => setBountyModalOpen(false)}
      />
    </div>
  );
}
