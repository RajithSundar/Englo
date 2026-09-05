import React from 'react';
import { X } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { AuthView } from './AuthView';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, authMode } = usePlatformStore();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-[440px] animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          id="auth-modal-close-btn"
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/20 text-[#86868B] hover:text-[#1D1D1F] dark:text-neutral-400 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Inner Auth View */}
        <AuthView isModal={true} initialMode={authMode} onClose={() => setAuthModalOpen(false)} />
      </div>
    </div>
  );
};
