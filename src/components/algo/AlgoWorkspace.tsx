import React from 'react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { Problem } from '../../types';
import { AlgoEditor } from './AlgoEditor';
import { AlgoOutputConsole } from './AlgoOutputConsole';

interface AlgoWorkspaceProps {
  problem: Problem;
}

export const AlgoWorkspace: React.FC<AlgoWorkspaceProps> = ({ problem }) => {
  const {
    algoCodes,
    setAlgoCode,
    algoEvaluations,
    isEvaluating,
    isConsoleExpanded,
    setConsoleExpanded,
    activeConsoleTab,
    setActiveConsoleTab
  } = usePlatformStore();

  const currentCode = algoCodes[problem.id] || problem.defaultAlgoEnglish || '';
  const currentEvaluation = algoEvaluations[problem.id] || null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F4F6F4] dark:bg-[#1E272C]">
      {/* Upper Editor Pane */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <AlgoEditor
          value={currentCode}
          onChange={(code) => setAlgoCode(problem.id, code)}
          disabled={isEvaluating}
          problemId={problem.id}
        />
      </div>

      {/* Bottom Output Console (Collapsible) */}
      <AlgoOutputConsole
        evaluation={currentEvaluation}
        isEvaluating={isEvaluating}
        isExpanded={isConsoleExpanded}
        onToggleExpanded={() => setConsoleExpanded(!isConsoleExpanded)}
        activeTab={activeConsoleTab}
        onSelectTab={(tab) => setActiveConsoleTab(tab)}
      />
    </div>
  );
};
