import React, { useState } from 'react';
import {
  Layers,
  ArrowRight,
  Mail,
  Lock,
  User,
  AtSign,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

interface AuthViewProps {
  initialMode?: 'login' | 'register';
  isModal?: boolean;
  onClose?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode,
  isModal = false,
  onClose
}) => {
  const { authMode, setAuthMode, authenticateUser, setActiveView } = usePlatformStore();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode || authMode || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [track, setTrack] = useState<'algo' | 'system_design' | 'both'>('both');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate handle when name or email changes in register mode
  const handleNameChange = (val: string) => {
    setName(val);
    if (!handle || handle.startsWith('@')) {
      const sanitized = val.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (sanitized) setHandle(`@${sanitized}`);
    }
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (mode === 'register' && !handle && val.includes('@')) {
      const part = val.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      if (part) setHandle(`@${part}`);
    }
  };

  // Quick 1-click Demo Sign-In
  const handleQuickDemo = (demoType: 'staff' | 'candidate' | 'evaluator') => {
    if (demoType === 'staff' || demoType === 'candidate') {
      authenticateUser('alex.dev@englo.sh', '@alex_dev', 'Alex Dev', 'Staff Software Engineer');
    } else if (demoType === 'evaluator') {
      authenticateUser('hiring.manager@razorpay.com', '@hiring_manager', 'Hiring Manager', 'Hiring Manager (Evaluator)');
    }
    if (onClose) onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid engineering email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setError('Please enter your full name or handle.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const cleanHandle = handle.trim() ? (handle.startsWith('@') ? handle : `@${handle}`) : `@${email.split('@')[0]}`;
      authenticateUser(email.trim(), cleanHandle, name.trim() || email.split('@')[0], track === 'algo' ? 'Algorithm Specialist' : track === 'system_design' ? 'System Architect' : 'Staff Software Engineer');
      if (onClose) onClose();
    }, 450);
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 25;
    if (password.length >= 10) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9!@#$%^&*]/.test(password)) score += 25;
    return score;
  };

  const passwordScore = getPasswordStrength();

  return (
    <div className={`flex-1 overflow-y-auto w-full h-full flex flex-col justify-center items-center py-10 px-4 select-none ${isModal ? 'min-h-0 py-2 px-0 overflow-visible' : 'bg-[#F4F6F4] dark:bg-[#1E272C]'}`}>
      {/* Top return breadcrumb if on full view */}
      {!isModal && (
        <div className="w-full max-w-[440px] mb-4 flex items-center justify-between">
          <button
            onClick={() => setActiveView('landing')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#52796F] hover:text-[#2F3E46] dark:hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Englo Overview</span>
          </button>
        </div>
      )}

      {/* Main Apple Squircle Card */}
      <div className="w-full max-w-[440px] bg-white dark:bg-[#2F3E46] rounded-3xl border border-black/[0.06] dark:border-white/10 shadow-apple p-7 sm:p-9 relative overflow-hidden text-[#2F3E46] dark:text-[#CAD2C5]">
        {/* Soft atmospheric ambient glow at top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-gradient-to-b from-[#84A98C]/15 dark:from-[#52796F]/20 to-transparent blur-2xl -z-10 pointer-events-none" />

        {/* Brand Icon & Heading */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-11 h-11 rounded-2xl bg-[#84A98C] flex items-center justify-center text-white shadow-sm mb-3.5">
            <Layers className="w-5 h-5 text-white" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#2F3E46] dark:text-white">
            {mode === 'login' ? 'Sign in to Englo Studio' : 'Create Engineer ID'}
          </h2>

          <p className="text-xs text-[#52796F] dark:text-neutral-400 mt-1 max-w-xs leading-relaxed">
            {mode === 'login'
              ? 'Resume your algorithmic reasoning progress and system design topologies.'
              : 'Master algorithms with pure logic and Cupertino precision.'}
          </p>
        </div>

        {/* Segmented Control Switcher */}
        <div className="flex items-center bg-[#EBF0EB] dark:bg-white/[0.06] p-1 rounded-full border border-[#CAD2C5] dark:border-white/10 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setAuthMode('login');
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white dark:bg-white/15 text-[#2F3E46] dark:text-white shadow-xs'
                : 'text-[#52796F] dark:text-neutral-400 hover:text-[#2F3E46] dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setAuthMode('register');
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white dark:bg-white/15 text-[#2F3E46] dark:text-white shadow-xs'
                : 'text-[#52796F] dark:text-neutral-400 hover:text-[#2F3E46] dark:hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-4 p-3 rounded-xl border border-red-200/80 dark:border-red-800/60 bg-red-50/60 dark:bg-red-950/40 text-xs text-[#FF3B30] dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* SSO Quick Buttons */}
        <div className="space-y-2 mb-5">
          <button
            type="button"
            onClick={() => handleQuickDemo('staff')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1D1D1F] hover:bg-black dark:bg-white/10 dark:hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            {/* Apple Logo SVG */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.7-7.9-11.98-14.59-6.09-9.58-10.74-20.2-13.95-31.87-3.21-11.66-4.82-22.84-4.82-33.52 0-14.07 3.34-25.75 10.02-35.03 6.68-9.28 15.14-14.07 25.39-14.37 4.14 0 9.03 1.21 14.67 3.63 5.64 2.42 9.53 3.69 11.65 3.82 1.63-.24 5.75-1.57 12.35-3.99 6.6-2.42 11.95-3.51 16.06-3.26 13.98.85 24.84 5.99 32.58 15.42-12.18 7.39-18.17 17.58-17.97 30.56.2 10.3 4.17 18.99 11.9 26.07 7.74 7.08 17.06 11.04 27.97 11.89-2.31 7.22-5.31 14.52-8.99 21.91zM119.22 31.84c0-7.39 2.66-14.41 7.99-21.06 5.33-6.65 11.89-10.78 19.68-12.38.35 1.48.53 2.92.53 4.31 0 7.39-2.77 14.5-8.31 21.32-5.54 6.82-12.14 10.9-19.89 12.24z"/>
            </svg>
            <span>Continue with Apple</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('candidate')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#F5F5F7] dark:bg-white/[0.06] hover:bg-neutral-200/80 dark:hover:bg-white/10 text-[#1D1D1F] dark:text-white border border-neutral-200 dark:border-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            {/* GitHub Logo SVG */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-neutral-200 dark:border-white/10 w-full" />
          <span className="bg-white dark:bg-[#2F3E46] px-3 text-[11px] text-[#84A98C] dark:text-neutral-400 uppercase font-mono font-medium tracking-wider shrink-0">
            or with email
          </span>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Registration Fields */}
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-[#2F3E46] dark:text-neutral-200 mb-1">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-[#84A98C] dark:text-neutral-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Ada Lovelace"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-[#F4F6F4] dark:bg-[#1E272C] text-xs text-[#2F3E46] dark:text-white placeholder:text-[#84A98C] dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#84A98C]/25 focus:border-[#84A98C] focus:bg-white dark:focus:bg-[#1E272C] transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#2F3E46] dark:text-neutral-200 mb-1">
                  Engineer Handle
                </label>
                <div className="relative flex items-center">
                  <AtSign className="w-4 h-4 text-[#84A98C] dark:text-neutral-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="@handle"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-[#F4F6F4] dark:bg-[#1E272C] text-xs font-mono text-[#2F3E46] dark:text-white placeholder:text-[#84A98C] dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#84A98C]/25 focus:border-[#84A98C] focus:bg-white dark:focus:bg-[#1E272C] transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Target Engineering Track */}
              <div>
                <label className="block text-[11px] font-semibold text-[#2F3E46] dark:text-neutral-200 mb-1">
                  Primary Engineering Focus
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTrack('algo')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border transition-all text-center cursor-pointer ${
                      track === 'algo'
                        ? 'border-[#84A98C] bg-[#84A98C]/15 dark:bg-[#354F52]/40 text-[#52796F] dark:text-[#84A98C] font-semibold'
                        : 'border-neutral-200 dark:border-white/10 bg-white dark:bg-[#1E272C] text-[#52796F] dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-white/20'
                    }`}
                  >
                    Algorithms
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrack('system_design')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border transition-all text-center cursor-pointer ${
                      track === 'system_design'
                        ? 'border-[#84A98C] bg-[#84A98C]/15 dark:bg-[#354F52]/40 text-[#52796F] dark:text-[#84A98C] font-semibold'
                        : 'border-neutral-200 dark:border-white/10 bg-white dark:bg-[#1E272C] text-[#52796F] dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-white/20'
                    }`}
                  >
                    Architecture
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrack('both')}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border transition-all text-center cursor-pointer ${
                      track === 'both'
                        ? 'border-[#84A98C] bg-[#84A98C]/15 dark:bg-[#354F52]/40 text-[#52796F] dark:text-[#84A98C] font-semibold'
                        : 'border-neutral-200 dark:border-white/10 bg-white dark:bg-[#1E272C] text-[#52796F] dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-white/20'
                    }`}
                  >
                    Dual Studio
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-[11px] font-semibold text-[#2F3E46] dark:text-neutral-200 mb-1">
              Work or Personal Email
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[#84A98C] dark:text-neutral-400 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="engineer@company.com"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-[#F4F6F4] dark:bg-[#1E272C] text-xs text-[#2F3E46] dark:text-white placeholder:text-[#84A98C] dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#84A98C]/25 focus:border-[#84A98C] focus:bg-white dark:focus:bg-[#1E272C] transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-semibold text-[#2F3E46] dark:text-neutral-200">
                Password
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('Demo Reset: You can use any 6+ character password or click 1-Click Demo Login.')}
                  className="text-[10px] text-[#52796F] dark:text-[#84A98C] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-[#84A98C] dark:text-neutral-400 absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-[#F4F6F4] dark:bg-[#1E272C] text-xs font-mono text-[#2F3E46] dark:text-white placeholder:text-[#84A98C] dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#84A98C]/25 focus:border-[#84A98C] focus:bg-white dark:focus:bg-[#1E272C] transition-all shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 absolute right-3 text-[#84A98C] hover:text-[#2F3E46] dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength meter for registration */}
            {mode === 'register' && password && (
              <div className="mt-2 space-y-1">
                <div className="h-1 w-full bg-[#EBF0EB] dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordScore < 50
                        ? 'bg-[#E07A5F] w-1/3'
                        : passwordScore < 100
                        ? 'bg-[#D4A373] w-2/3'
                        : 'bg-[#84A98C] w-full'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#84A98C] dark:text-neutral-400">
                  <span>Strength</span>
                  <span>{passwordScore < 50 ? 'Weak' : passwordScore < 100 ? 'Good' : 'Cupertino Grade'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#52796F] dark:text-neutral-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-neutral-300 dark:border-neutral-700 text-[#84A98C] focus:ring-[#84A98C]"
              />
              <span>Remember me on this device</span>
            </label>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#84A98C] hover:bg-[#52796F] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(132,169,140,0.25)] hover:shadow-[0_6px_20px_rgba(132,169,140,0.35)] transition-all active:scale-[0.98] disabled:opacity-75 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to Studio' : 'Create Account & Enter'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Fast Demo Pills */}
        <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-white/10 flex flex-col gap-2 items-center justify-center">
          <button
            type="button"
            id="btn-quick-demo-evaluator"
            onClick={() => handleQuickDemo('evaluator')}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50/70 hover:bg-purple-100/80 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-[11px] font-semibold border border-purple-200/50 dark:border-purple-800/60 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>1-Click Demo Login (Hiring Manager)</span>
          </button>
          <button
            type="button"
            id="btn-quick-demo-staff"
            onClick={() => handleQuickDemo('staff')}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-[#84A98C]/15 hover:bg-[#84A98C]/25 dark:bg-[#354F52]/40 text-[#52796F] dark:text-[#CAD2C5] text-[11px] font-medium border border-[#84A98C]/30 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#84A98C]" />
            <span>1-Click Demo Login (Staff Engineer)</span>
          </button>
        </div>

        {/* Terms footer */}
        <p className="mt-4 text-[10px] text-center text-[#86868B] leading-relaxed">
          By continuing, you agree to Englo Studio’s Terms of Service and Privacy Directives.
        </p>
      </div>
    </div>
  );
};
