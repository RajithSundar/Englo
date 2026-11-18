import React from 'react';
import { X } from 'lucide-react';
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
  { keys: ['⌘', 'Enter'], description: 'Run the algorithm or simulate the topology' },
  { keys: ['⌘', 'B'], description: 'Toggle dark and light mode' },
  { keys: ['⌘', 'K'], description: 'Focus search' },
  { keys: ['⌘', 'Shift', 'C'], description: 'Open the competence credential' },
  { keys: ['?'], description: 'Show keyboard shortcuts' },
  { keys: ['Esc'], description: 'Close dialogs' }
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    audioService.playTap();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim backdrop-blur-sm">
      <div
        className="glass-strong rounded-xl w-full max-w-md max-h-[calc(100dvh-2rem)] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-modal-title"
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4 border-b border-rule">
          <div className="min-w-0">
            <h2 id="shortcuts-modal-title" className="text-lg font-medium tracking-tight text-ink">
              Keyboard shortcuts
            </h2>
            <p className="text-sm text-muted mt-1">
              Press <kbd className="kbd">?</kbd> anywhere to open this list.
            </p>
          </div>
          <button type="button" onClick={handleClose} className="btn-icon shrink-0" aria-label="Close" title="Close (Esc)">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-2">
          <ul className="divide-y divide-rule">
            {SHORTCUTS.map((item, index) => (
              <li key={index} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="text-ink-2">{item.description}</span>
                <span className="flex items-center gap-1 shrink-0">
                  {item.keys.map((k, i) => (
                    <kbd key={i} className="kbd">
                      {k}
                    </kbd>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-rule flex justify-end">
          <button type="button" onClick={handleClose} className="btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
