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
import { usePlatformStore } from './store/usePlatformStore';
import { PROBLEMS } from './data/problems';

export default function App() {
  const { activeView, setActiveView, activeProblemId } = usePlatformStore();

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setActiveView('dashboard');
        setTimeout(() => {
          const input = document.getElementById('ledger-search-input') as HTMLInputElement | null;
          input?.focus();
          input?.select();
        }, 60);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [setActiveView]);

  const activeProblem =
    PROBLEMS.find((p) => p.id === activeProblemId) || PROBLEMS[0];

  if (activeView === 'landing') {
    return (
      <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] font-sans selection:bg-[#0071E3] selection:text-[#FFFFFF]">
        <LandingPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] flex flex-col font-sans selection:bg-[#0071E3] selection:text-[#FFFFFF]">
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
            initialSplitPercentage={32}
            minPercentage={25}
            maxPercentage={50}
            leftPane={<ProblemDescription problem={activeProblem} />}
            rightPane={<SystemDesignWorkspace problem={activeProblem} />}
          />
        )}
      </main>

      {/* Automated Test Suite Modal */}
      <AutomatedTestSuiteModal />

      {/* Quick Authentication Modal */}
      <AuthModal />
    </div>
  );
}
