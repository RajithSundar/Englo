import React from 'react';
import { X } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { AuthView } from './AuthView';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, authMode } = usePlatformStore();

  if (!isAuthModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setAuthModalOpen(false);
      }}
    >
      <div role="dialog" aria-modal="true" className="relative w-full max-w-[420px] my-auto animate-in zoom-in-95 duration-200">
        <button
          id="auth-modal-close-btn"
          onClick={() => setAuthModalOpen(false)}
          className="btn-icon absolute top-5 right-5 z-20 cursor-pointer"
          title="Close"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <AuthView isModal={true} initialMode={authMode} onClose={() => setAuthModalOpen(false)} />
      </div>
    </div>
  );
};
