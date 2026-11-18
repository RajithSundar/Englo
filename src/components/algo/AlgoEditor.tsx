import React, { useRef, useState, useEffect, useCallback } from 'react';
import { RotateCcw, Lightbulb, Play, ChevronDown, Mic, MicOff, Loader2 } from 'lucide-react';
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
  const [isFocused, setIsFocused] = useState(false);
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


  const menuItemClass =
    'w-full text-left px-2.5 py-2 rounded-lg text-sm text-ink-2 hover:text-ink hover:bg-paper-3 flex items-start gap-2.5 transition-colors cursor-pointer';

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-paper text-ink overflow-hidden">
      {/* Toolbar */}
      <div className="h-12 px-4 border-b border-rule flex items-center justify-between gap-3 flex-shrink-0 select-none">
        <div className="flex items-baseline gap-3 min-w-0">
          <span className="text-sm font-medium text-ink">Your answer</span>
          <span className="hidden sm:inline text-xs text-muted truncate">
            {lines.length} lines, {wordCount} words
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Format menu: templates plus the rarely used reference solution */}
          <div className="relative" ref={templateMenuRef}>
            <button
              type="button"
              onClick={() => setIsTemplateMenuOpen(!isTemplateMenuOpen)}
              className="btn-quiet h-8"
              aria-haspopup="menu"
              aria-expanded={isTemplateMenuOpen}
              title="Insert a format scaffold"
            >
              <span>Format</span>
              <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform duration-150 ${isTemplateMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isTemplateMenuOpen && (
              <div role="menu" className="glass-strong absolute right-0 top-10 w-64 rounded-xl p-1.5 z-50">
                <div className="label px-2.5 pt-1 pb-1.5">Insert a scaffold</div>
                {TEMPLATES.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      insertTemplate(t.text);
                      setIsTemplateMenuOpen(false);
                    }}
                    className={menuItemClass}
                  >
                    <span className="w-5 shrink-0 text-center font-mono text-xs text-muted leading-5">{t.glyph}</span>
                    <span className="flex-1">
                      <span className="block text-ink">{t.name}</span>
                      <span className="block text-xs text-muted">{t.note}</span>
                    </span>
                  </button>
                ))}
                <div className="my-1.5 h-px bg-rule" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsTemplateMenuOpen(false);
                    if (window.confirm('Load reference solution? This will replace your current editor content with the optimal solution.')) {
                      loadSolution(problemId);
                    }
                  }}
                  className={menuItemClass}
                  title="Inspect the optimal reference solution"
                >
                  <Lightbulb className="w-4 h-4 mt-0.5 shrink-0 text-muted" />
                  <span className="flex-1 text-ink">Show reference solution</span>
                </button>
              </div>
            )}
          </div>

          {/* Voice dictation */}
          <button
            type="button"
            onClick={toggleDictation}
            aria-pressed={isListening}
            className={`btn-quiet h-8 ${isListening ? 'text-bad hover:text-bad' : ''}`}
            title={isListening ? 'Stop dictation' : 'Dictate your answer aloud'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span className="hidden lg:inline">{isListening ? 'Listening' : 'Dictate'}</span>
          </button>

          {/* Reset to starter */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset code to starter scaffold? Any unsaved edits will be cleared.')) {
                resetProblem(problemId);
              }
            }}
            className="btn-quiet h-8"
            title="Reset to the starter text"
            aria-label="Reset to the starter text"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <span className="hidden md:inline-flex items-center gap-1 ml-2 mr-1" aria-hidden="true">
            <span className="kbd">Ctrl</span>
            <span className="kbd">Enter</span>
          </span>

          {/* Run */}
          <button
            type="button"
            onClick={handleRun}
            disabled={isEvaluating}
            className="btn-primary h-8 ml-1"
            title="Evaluate your plain-English algorithm (Ctrl/Cmd + Enter)"
          >
            {isEvaluating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Checking</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dictation status */}
      {isListening && (
        <div className="px-4 py-2 border-b border-rule flex items-center justify-between gap-3 text-sm text-ink-2">
          <span className="flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-bad shrink-0" />
            <span className="truncate">Listening. What you say is typed at the cursor.</span>
          </span>
          <button type="button" onClick={toggleDictation} className="text-sm font-medium text-bad hover:underline cursor-pointer shrink-0">
            Stop
          </button>
        </div>
      )}

      {/* Editor body */}
      <div className="flex-1 flex min-h-0 relative font-mono text-[14px] leading-7 overflow-hidden">
        {/* Line numbers */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="w-12 text-muted/60 select-none py-4 pr-3 text-right overflow-hidden flex-shrink-0"
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="h-7 leading-7 text-xs">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Neon spine on the active editor */}
        <div
          aria-hidden="true"
          className={`absolute left-12 top-4 bottom-4 w-[2px] rounded-full bg-accent shadow-glow-1 transition-opacity duration-200 ${
            isFocused ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <textarea
          ref={textareaRef}
          id="algo-english-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          aria-label="Your plain-English algorithm"
          placeholder={PLACEHOLDER}
          spellCheck={false}
          className="flex-1 py-4 pl-5 pr-4 bg-transparent text-ink resize-none focus:outline-none focus-visible:outline-none overflow-y-auto leading-7"
          style={{ tabSize: 2 }}
        />
      </div>
    </div>
  );
};

const PLACEHOLDER = `Describe your algorithm in whatever format feels natural: a paragraph, bullet points or numbered steps.

For example:
- Keep a hash map 'seen' from number to index
- For each number at index i:
  - If (target - number) is in 'seen': return [seen[target - number], i]
  - Otherwise: record seen[number] = i
- Time: O(N), Space: O(N)`;

const TEMPLATES = [
  {
    glyph: '¶',
    name: 'Paragraph',
    note: 'Plain prose',
    text: 'We can solve this by maintaining [data structure]. As we iterate through [input], we check [condition] and update [state]. Once [termination], we return [result].',
  },
  {
    glyph: '•',
    name: 'Bullet points',
    note: 'Nested logic points',
    text: '- Maintain [data structure] to store [purpose]\n- For each [element] in [collection]:\n  - Calculate [lookup/condition]\n  - If match found: return [result]\n  - Otherwise: record into [data structure]\n- If no solution found: return [default]',
  },
  {
    glyph: '1.',
    name: 'Numbered steps',
    note: 'One step per line',
    text: 'Step 1: Initialize [data_structure] to store [purpose].\nStep 2: Traverse [input] and check [condition].\nStep 3: Return [result].',
  },
  {
    glyph: 'O',
    name: 'Complexity',
    note: 'Time and space bounds',
    text: 'Complexity Analysis:\n- Time Complexity: O(...) because [reason].\n- Space Complexity: O(...) because [reason].',
  },
];
