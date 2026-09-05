import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Plus,
  Hash,
  Clock,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Lightbulb,
  Play,
  ChevronDown,
  Mic,
  MicOff
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { audioService } from '../../services/audioService';

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

  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
  const templateMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (templateMenuRef.current && !templateMenuRef.current.contains(e.target as Node)) {
        setIsTemplateMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const insertVoiceTranscript = useCallback((spokenText: string) => {
    if (!spokenText.trim()) return;
    const cleanSpoken = spokenText.trim();
    if (!textareaRef.current) {
      onChange(value ? `${value} ${cleanSpoken}` : cleanSpoken);
      return;
    }

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const textBefore = value.substring(0, start);
    const textAfter = value.substring(end);

    const needsSpaceBefore = textBefore.length > 0 && !textBefore.endsWith(' ') && !textBefore.endsWith('\n');
    const inserted = (needsSpaceBefore ? ' ' : '') + cleanSpoken + ' ';
    const nextVal = textBefore + inserted + textAfter;

    onChange(nextVal);
    audioService.playTap();

    setTimeout(() => {
      if (textareaRef.current) {
        const nextPos = start + inserted.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(nextPos, nextPos);
      }
    }, 0);
  }, [value, onChange]);

  const toggleDictation = () => {
    audioService.playTap();
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      alert('Voice dictation (Web Speech API) is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsListening(false);
    } else {
      try {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let text = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              text += event.results[i][0].transcript;
            }
          }
          if (text) {
            insertVoiceTranscript(text);
          }
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition warning:', err?.error || err);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setIsListening(false);
      }
    }
  };

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  const handleRun = () => {
    if (isEvaluating) return;
    audioService.playTap();
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
    <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#2F3E46] text-[#2F3E46] dark:text-[#CAD2C5] overflow-hidden">
      {/* Editor Top Toolbar */}
      <div className="h-10 px-4 border-b border-[#CAD2C5]/40 dark:border-[#52796F]/30 bg-white dark:bg-[#2F3E46] flex items-center justify-between flex-shrink-0 select-none">
        <div className="flex items-center gap-2 text-xs text-[#52796F] dark:text-[#CAD2C5]/70">
          <FileText className="w-3.5 h-3.5 text-[#52796F] dark:text-[#84A98C]" />
          <span className="font-semibold text-[#2F3E46] dark:text-white">Algo-English Editor</span>
          <span className="text-[#CAD2C5] dark:text-[#52796F]">|</span>
          <span className="text-[11px] text-[#52796F] dark:text-[#CAD2C5]/60 font-mono">
            {lines.length} lines • {wordCount} words
          </span>
        </div>

        {/* Right Toolbar Actions */}
        <div className="flex items-center gap-2">
          {/* Cupertino Templates Dropdown */}
          <div className="relative" ref={templateMenuRef}>
            <button
              type="button"
              onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
              className="px-2.5 py-1 rounded-full bg-[#F4F6F4] dark:bg-[#354F52]/60 hover:bg-[#CAD2C5]/30 dark:hover:bg-[#354F52] text-[#2F3E46] dark:text-[#CAD2C5] border border-[#CAD2C5]/80 dark:border-[#52796F]/40 transition-all flex items-center gap-1.5 active:scale-95 text-xs font-medium cursor-pointer"
              title="Insert algorithmic format scaffold"
            >
              <Sparkles className="w-3 h-3 text-[#52796F] dark:text-[#84A98C]" />
              <span>Templates</span>
              <ChevronDown className={`w-3 h-3 text-[#52796F] dark:text-[#CAD2C5]/60 transition-transform duration-150 ${isTemplateMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isTemplateMenuOpen && (
              <div className="absolute right-0 top-8 w-60 bg-white/95 dark:bg-[#2F3E46]/95 backdrop-blur-md rounded-xl border border-[#CAD2C5] dark:border-[#52796F]/50 shadow-apple p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1 text-[10px] font-mono font-bold text-[#52796F] dark:text-[#CAD2C5]/70 uppercase tracking-wider border-b border-[#CAD2C5]/40 dark:border-[#52796F]/30 mb-1">
                  Insert Scaffold
                </div>
                <button
                  type="button"
                  onClick={() => {
                    insertTemplate('We can solve this by maintaining [data structure]. As we iterate through [input], we check [condition] and update [state]. Once [termination], we return [result].');
                    setIsTemplateMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#F4F6F4] dark:hover:bg-[#354F52] text-xs text-[#2F3E46] dark:text-[#CAD2C5] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-md bg-[#CAD2C5]/30 dark:bg-[#354F52] text-[#52796F] dark:text-[#84A98C] flex items-center justify-center font-serif text-xs font-bold">¶</span>
                  <div className="flex-1">
                    <div className="font-semibold text-[#2F3E46] dark:text-white">Flowing Paragraph</div>
                    <div className="text-[10px] text-[#52796F] dark:text-[#CAD2C5]/70">Natural prose invariants</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    insertTemplate('- Maintain [data structure] to store [purpose]\n- For each [element] in [collection]:\n  - Calculate [lookup/condition]\n  - If match found: return [result]\n  - Otherwise: record into [data structure]\n- If no solution found: return [default]');
                    setIsTemplateMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#F4F6F4] dark:hover:bg-[#354F52] text-xs text-[#2F3E46] dark:text-[#CAD2C5] flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-md bg-[#CAD2C5]/30 dark:bg-[#354F52] text-[#52796F] dark:text-[#CAD2C5] flex items-center justify-center text-xs font-bold">•</span>
                  <div className="flex-1">
                    <div className="font-semibold text-[#2F3E46] dark:text-white">Bullet Points</div>
                    <div className="text-[10px] text-[#86868B] dark:text-neutral-400">Hierarchical logic points</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    insertTemplate('Step 1: Initialize [data_structure] to store [purpose].\nStep 2: Traverse [input] and check [condition].\nStep 3: Return [result].');
                    setIsTemplateMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#F5F5F7] dark:hover:bg-white/5 text-xs text-[#1D1D1F] dark:text-neutral-200 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-[#FF9500] flex items-center justify-center font-mono text-[11px] font-bold">1.</span>
                  <div className="flex-1">
                    <div className="font-semibold text-[#1D1D1F] dark:text-white">Numbered Steps</div>
                    <div className="text-[10px] text-[#86868B] dark:text-neutral-400">Sequential algorithm execution</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    insertTemplate('Complexity Analysis:\n- Time Complexity: O(...) because [reason].\n- Space Complexity: O(...) because [reason].');
                    setIsTemplateMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#F5F5F7] dark:hover:bg-white/5 text-xs text-[#1D1D1F] dark:text-neutral-200 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-[#34C759] flex items-center justify-center font-mono text-xs font-bold">∑</span>
                  <div className="flex-1">
                    <div className="font-semibold text-[#1D1D1F] dark:text-white">Complexity Bounds</div>
                    <div className="text-[10px] text-[#86868B] dark:text-neutral-400">Asymptotic time &amp; space</div>
                  </div>
                </button>
              </div>
            )}
          </div>
          {/* Speech-to-Logic Voice Dictation Button */}
          <button
            type="button"
            onClick={toggleDictation}
            className={`px-2.5 py-1 rounded-full border transition-all flex items-center gap-1.5 text-xs font-semibold active:scale-95 shadow-2xs cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white border-red-600 animate-pulse'
                : 'bg-[#F5F5F7] dark:bg-white/[0.06] hover:bg-neutral-200/80 dark:hover:bg-white/10 text-[#1D1D1F] dark:text-neutral-200 border-neutral-200/70 dark:border-white/10'
            }`}
            title={isListening ? 'Click to stop listening' : 'Dictate algorithmic logic aloud using Speech-to-Logic'}
          >
            {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3 text-[#FF3B30]" />}
            <span>{isListening ? 'Listening...' : 'Dictate'}</span>
          </button>

          {/* Solution Button */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Load reference solution? This will replace your current editor content with the optimal solution.')) {
                loadSolution(problemId);
              }
            }}
            className="px-2.5 py-1 rounded-full bg-[#CAD2C5]/30 dark:bg-[#354F52]/60 hover:bg-[#CAD2C5]/50 dark:hover:bg-[#354F52] text-[#52796F] dark:text-[#84A98C] border border-[#CAD2C5] dark:border-[#52796F]/50 transition-all flex items-center gap-1.5 text-xs font-semibold active:scale-95 shadow-2xs cursor-pointer"
            title="Inspect the optimal reference solution"
          >
            <Lightbulb className="w-3 h-3" />
            <span>Solution</span>
          </button>

          {/* Reset Action */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset code to starter scaffold? Any unsaved edits will be cleared.')) {
                resetProblem(problemId);
              }
            }}
            className="p-1 rounded-full hover:bg-[#CAD2C5]/30 dark:hover:bg-white/10 text-[#52796F] dark:text-[#CAD2C5]/70 hover:text-[#2F3E46] dark:hover:text-white transition-colors cursor-pointer"
            title="Reset code to clean state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Primary Run Logic Button */}
          <button
            type="button"
            onClick={handleRun}
            disabled={isEvaluating}
            className="px-3.5 py-1 rounded-full bg-[#84A98C] hover:bg-[#52796F] text-[#2F3E46] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs disabled:opacity-60 cursor-pointer"
            title="Evaluate plain-English algorithm (⌘+Enter)"
          >
            {isEvaluating ? (
              <>
                <Sparkles className="w-3 h-3 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Run Logic</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Voice Dictation Active Banner */}
      {isListening && (
        <div className="bg-red-500/10 dark:bg-red-950/30 border-b border-red-500/20 px-4 py-1.5 flex items-center justify-between text-xs text-red-700 dark:text-red-400">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="font-medium">Voice Dictation Active:</span>
            <span>Speak your algorithm aloud — natural sentences will be automatically transcribed into the editor.</span>
          </div>
          <button
            type="button"
            onClick={toggleDictation}
            className="text-[11px] font-semibold text-red-600 dark:text-red-300 hover:underline cursor-pointer"
          >
            Stop Mic
          </button>
        </div>
      )}

      {/* Editor Body with Monospaced Lines */}
      <div className="flex-1 flex min-h-0 relative font-mono text-[13px] leading-6 overflow-hidden bg-white dark:bg-[#1E272C]">
        {/* Line Numbers Column */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="w-12 bg-[#F4F6F4] dark:bg-[#2F3E46] text-[#52796F] dark:text-[#CAD2C5]/50 select-none py-3 px-2 text-right border-r border-[#CAD2C5]/40 dark:border-[#52796F]/30 overflow-hidden flex-shrink-0 font-mono"
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
          className="flex-1 p-3 bg-transparent text-[#2F3E46] dark:text-[#CAD2C5] placeholder-[#52796F]/60 dark:placeholder-[#CAD2C5]/40 resize-none focus:outline-none overflow-y-auto leading-6 selection:bg-[#52796F] selection:text-[#CAD2C5] dark:selection:bg-[#84A98C] dark:selection:text-[#2F3E46]"
          style={{ tabSize: 2 }}
        />
      </div>
    </div>
  );
};
