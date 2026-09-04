import React, { useRef } from 'react';
import {
  FileText,
  Plus,
  Hash,
  Clock,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Lightbulb,
  Play
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

interface AlgoEditorProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  problemId: string;
}

export const AlgoEditor: React.FC<AlgoEditorProps> = ({
  value,
  onChange,
  disabled = false,
  problemId
}) => {
  const {
    resetProblem,
    loadSolution,
    runAlgoEvaluation,
    isEvaluating,
    setConsoleExpanded
  } = usePlatformStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = value.split('\n');
  const lineCount = Math.max(lines.length, 20);
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  // Sync scroll between textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const insertTemplate = (template: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const textBefore = value.substring(0, start);
    const textAfter = value.substring(end);

    const needsNewlineBefore = textBefore.length > 0 && !textBefore.endsWith('\n');
    const insertion = (needsNewlineBefore ? '\n\n' : '') + template + '\n';
    const nextVal = textBefore + insertion + textAfter;

    onChange(nextVal);

    setTimeout(() => {
      if (textareaRef.current) {
        const nextPos = start + insertion.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(nextPos, nextPos);
      }
    }, 0);
  };

  const handleRun = () => {
    if (isEvaluating) return;
    setConsoleExpanded(true);
    runAlgoEvaluation(problemId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      if (!textareaRef.current) return;
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const nextVal = value.substring(0, start) + '  ' + value.substring(end);
      onChange(nextVal);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white text-[#1D1D1F] overflow-hidden">
      {/* Editor Top Toolbar */}
      <div className="h-10 px-4 border-b border-black/[0.06] bg-white flex items-center justify-between flex-shrink-0 select-none">
        <div className="flex items-center gap-2 text-xs text-[#6E6E73]">
          <FileText className="w-3.5 h-3.5 text-[#0071E3]" />
          <span className="font-semibold text-[#1D1D1F]">Algo-English Editor</span>
          <span className="text-neutral-300">|</span>
          <span className="text-[11px] text-[#86868B] font-mono">
            {lines.length} lines • {wordCount} words
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-[#34C759] border border-emerald-200/60">
            Any Format: Paragraphs • Bullets • Steps
          </span>
        </div>

        {/* Right Toolbar Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Prose Snippet Inserters */}
          <div className="hidden xl:flex items-center gap-1.5 text-[11px] mr-1">
            <span className="text-[#86868B] text-[10px] uppercase font-mono font-bold tracking-wider">
              Scaffolds:
            </span>
            <button
              type="button"
              onClick={() => insertTemplate('We can solve this by maintaining [data structure]. As we iterate through [input], we check [condition] and update [state]. Once [termination], we return [result].')}
              className="px-2 py-0.5 rounded-full bg-[#F5F5F7] hover:bg-neutral-200/80 text-[#1D1D1F] border border-neutral-200/60 transition-colors flex items-center gap-1 active:scale-95 text-[11px]"
              title="Insert paragraph format structure"
            >
              <Plus className="w-3 h-3 text-[#0071E3]" />
              <span>Paragraph</span>
            </button>
            <button
              type="button"
              onClick={() => insertTemplate('- Maintain [data structure] to store [purpose]\n- For each [element] in [collection]:\n  - Calculate [lookup/condition]\n  - If match found: return [result]\n  - Otherwise: record into [data structure]\n- If no solution found: return [default]')}
              className="px-2 py-0.5 rounded-full bg-[#F5F5F7] hover:bg-neutral-200/80 text-[#1D1D1F] border border-neutral-200/60 transition-colors flex items-center gap-1 active:scale-95 text-[11px]"
              title="Insert bullet points structure"
            >
              <Plus className="w-3 h-3 text-[#AF00DB]" />
              <span>Bullets</span>
            </button>
            <button
              type="button"
              onClick={() => insertTemplate('Step 1: Initialize [data_structure] to store [purpose].\nStep 2: Traverse [input] and check [condition].\nStep 3: Return [result].')}
              className="px-2 py-0.5 rounded-full bg-[#F5F5F7] hover:bg-neutral-200/80 text-[#1D1D1F] border border-neutral-200/60 transition-colors flex items-center gap-1 active:scale-95 text-[11px]"
              title="Insert numbered step structure"
            >
              <Plus className="w-3 h-3 text-[#FF9500]" />
              <span>Step</span>
            </button>
            <button
              type="button"
              onClick={() => insertTemplate('Complexity Analysis:\n- Time Complexity: O(...) because [reason].\n- Space Complexity: O(...) because [reason].')}
              className="px-2 py-0.5 rounded-full bg-[#F5F5F7] hover:bg-neutral-200/80 text-[#1D1D1F] border border-neutral-200/60 transition-colors flex items-center gap-1 active:scale-95 text-[11px]"
              title="Insert complexity analysis"
            >
              <Plus className="w-3 h-3 text-[#34C759]" />
              <span>Complexity</span>
            </button>
          </div>

          {/* Run Logic Button */}
          <button
            type="button"
            onClick={handleRun}
            disabled={isEvaluating}
            className="px-3 py-1 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs disabled:opacity-60"
            title="Evaluate plain-English algorithm (⌘+Enter)"
          >
            {isEvaluating ? (
              <>
                <Sparkles className="w-3 h-3 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-white" />
                <span>Run Logic</span>
              </>
            )}
          </button>

          {/* Reference Solution Button */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Load reference solution? This will replace your current editor content with the optimal solution.')) {
                loadSolution(problemId);
              }
            }}
            className="px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0071E3] border border-blue-200/70 transition-all flex items-center gap-1 text-xs font-semibold active:scale-95 shadow-2xs"
            title="Inspect the optimal reference algorithmic solution"
          >
            <Lightbulb className="w-3 h-3" />
            <span>Solution</span>
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset code to starter scaffold? Any unsaved edits will be cleared.')) {
                resetProblem(problemId);
              }
            }}
            className="px-2.5 py-1 rounded-full bg-[#F5F5F7] hover:bg-neutral-200 text-[#6E6E73] hover:text-[#1D1D1F] border border-neutral-200/80 transition-all flex items-center gap-1 text-xs active:scale-95"
            title="Reset code to clean starter template"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Editor Body with Monospaced Lines */}
      <div className="flex-1 flex min-h-0 relative font-mono text-[13px] leading-6 overflow-hidden bg-white">
        {/* Line Numbers Column */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="w-12 bg-[#FBFBFD] text-[#86868B] select-none py-3 px-2 text-right border-r border-black/[0.06] overflow-hidden flex-shrink-0 font-mono"
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="h-6 leading-6 text-[12px]">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          id="algo-english-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          disabled={disabled}
          placeholder="Describe your algorithm in whatever format feels natural — continuous prose paragraphs, bulleted explanations, numbered points, or algorithmic logic...

e.g. (Continuous Paragraph):
We can solve this efficiently in O(N) time using a hash map to store numbers and their indices. As we iterate through each element in the array, we calculate the required complement (target - current_number). If the complement already exists in our map, we immediately return both indices; otherwise, we record the current number and continue.

e.g. (Bullet Points):
- Maintain an empty hash map 'seen' mapping numbers to indices
- For each number at index i:
  - If (target - number) is in 'seen': return [seen[target - number], i]
  - Otherwise: record seen[number] = i
- Time: O(N), Space: O(N)"
          spellCheck={false}
          className="flex-1 p-3 bg-transparent text-[#1D1D1F] placeholder-[#86868B] resize-none focus:outline-none overflow-y-auto leading-6 selection:bg-[#0071E3] selection:text-white"
          style={{ tabSize: 2 }}
        />
      </div>
    </div>
  );
};
