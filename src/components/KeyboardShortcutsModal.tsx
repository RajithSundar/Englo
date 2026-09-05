import React from 'react';
import { Command, X, Keyboard } from 'lucide-react';
import { audioService } from '../services/audioService';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
}

const SHORTCUTS: ShortcutItem[] = [
  { keys: ['⌘', 'Enter'], description: 'Run Plain-English Algorithm / Simulate Topology' },
  { keys: ['⌘', 'B'], description: 'Toggle Dark / Light Mode' },
  { keys: ['⌘', 'K'], description: 'Focus Search & Filter Ledger' },
  { keys: ['⌘', 'Shift', 'C'], description: 'View Proof of Competence Credential' },
  { keys: ['?'], description: 'Open Keyboard Shortcuts Sheet' },
  { keys: ['Esc'], description: 'Close Modals & Dialogs' }
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#161B22] rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden p-6 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-modal-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-white/10 flex items-center justify-center text-[#1D1D1F] dark:text-white">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h2 id="shortcuts-modal-title" className="text-sm font-bold text-[#1D1D1F] dark:text-white">
                Keyboard Shortcuts
              </h2>
              <div className="text-[11px] text-[#86868B] dark:text-neutral-400">
                Speed up your engineering workflow
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              audioService.playTap();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 text-[#6E6E73] dark:text-neutral-400 hover:text-[#1D1D1F] dark:hover:text-white transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          {SHORTCUTS.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between text-xs py-1 px-1 rounded-lg hover:bg-neutral-50 dark:hover:bg-white/[0.03] transition-colors"
            >
              <span className="text-[#1D1D1F] dark:text-neutral-200 font-medium">
                {item.description}
              </span>
              <div className="flex items-center gap-1">
                {item.keys.map((k, i) => (
                  <kbd
                    key={i}
                    className="min-w-[22px] h-6 px-1.5 flex items-center justify-center font-mono text-[11px] font-semibold text-[#1D1D1F] dark:text-neutral-200 bg-neutral-100 dark:bg-white/10 border border-neutral-200/80 dark:border-white/10 rounded-md shadow-2xs"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-black/[0.06] dark:border-white/10 text-center text-[11px] text-[#86868B] dark:text-neutral-400">
          Press <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-neutral-100 dark:bg-white/10 border border-neutral-200 dark:border-white/10 rounded">?</kbd> anywhere to summon this menu
        </div>
      </div>
    </div>
  );
};
