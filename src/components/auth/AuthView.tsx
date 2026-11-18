import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, ChevronLeft } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

interface AuthViewProps {
  initialMode?: 'login' | 'register';
  isModal?: boolean;
  onClose?: () => void;
}

const STRENGTH_WORDS = ['', 'Weak', 'Fair', 'Good', 'Strong'];

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

  const switchMode = (next: 'login' | 'register') => {
    setMode(next);
    setAuthMode(next);
    setError(null);
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
  const strengthLevel = passwordScore / 25; // 0..4
  const strengthColor = strengthLevel <= 1 ? 'bg-bad' : strengthLevel === 2 ? 'bg-warn' : 'bg-accent';

  const tracks: { id: 'algo' | 'system_design' | 'both'; label: string }[] = [
    { id: 'algo', label: 'Algorithms' },
    { id: 'system_design', label: 'System design' },
    { id: 'both', label: 'Both' }
  ];

  return (
    <div className={`w-full flex flex-col items-center ${isModal ? '' : 'flex-1 overflow-y-auto h-full justify-center py-10 px-4 bg-paper'}`}>
      {!isModal && (
        <div className="w-full max-w-[420px] mb-4">
          <button onClick={() => setActiveView('landing')} className="btn-quiet -ml-2">
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      )}

      <div className="glass-strong w-full max-w-[420px] rounded-xl p-7 sm:p-8 text-ink">
        <h2 className="text-2xl font-medium tracking-tight text-ink pr-10">
          {mode === 'login' ? 'Sign in' : 'Create your account'}
        </h2>
        <p className="text-sm text-muted mt-1.5">
          {mode === 'login'
            ? 'Pick up where you left off.'
            : 'Save your progress across problems and sessions.'}
        </p>

        <div className="seg w-full mt-6" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            onClick={() => switchMode('login')}
            className="seg-item flex-1 cursor-pointer"
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'register'}
            onClick={() => switchMode('register')}
            className="seg-item flex-1 cursor-pointer"
          >
            Register
          </button>
        </div>

        {error && (
          <div role="alert" className="mt-5 px-3 py-2.5 rounded-lg bg-bad-soft text-sm text-bad flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label htmlFor="auth-name" className="label block mb-1.5">Full name</label>
                <input
                  id="auth-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ada Lovelace"
                  className="field placeholder:text-muted/70"
                />
              </div>

              <div>
                <label htmlFor="auth-handle" className="label block mb-1.5">Handle</label>
                <input
                  id="auth-handle"
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@handle"
                  className="field placeholder:text-muted/70"
                />
              </div>

              <div>
                <span className="label block mb-1.5">Focus</span>
                <div className="seg w-full">
                  {tracks.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      aria-pressed={track === t.id}
                      onClick={() => setTrack(t.id)}
                      className="seg-item flex-1 cursor-pointer"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label htmlFor="auth-email" className="label block mb-1.5">Email</label>
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              className="field placeholder:text-muted/70"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="auth-password" className="label">Password</label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('Demo Reset: You can use any 6+ character password or click 1-Click Demo Login.')}
                  className="text-xs text-muted hover:text-ink transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {mode === 'register' && password && (
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1 grid grid-cols-4 gap-1" aria-hidden="true">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-[3px] rounded-full transition-colors duration-300 ${i <= strengthLevel ? strengthColor : 'bg-rule'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted w-12 text-right">{STRENGTH_WORDS[strengthLevel] || 'Weak'}</span>
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-sm text-ink-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-accent"
            />
            <span>Remember me</span>
          </label>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full cursor-pointer">
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-accent-ink/30 border-t-accent-ink rounded-full animate-spin" />
            ) : (
              <span>{mode === 'login' ? 'Sign in' : 'Create account'}</span>
            )}
          </button>
        </form>

        <p className="mt-4 text-sm text-muted text-center">
          {mode === 'login' ? 'New here? ' : 'Already have an account? '}
          <button
            type="button"
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            className="text-ink hover:text-accent transition-colors cursor-pointer"
          >
            {mode === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </p>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 border-t border-rule" />
          <span className="label shrink-0">Or try a demo account</span>
          <div className="flex-1 border-t border-rule" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            type="button"
            id="btn-quick-demo-evaluator"
            onClick={() => handleQuickDemo('evaluator')}
            className="btn h-8 px-2 text-xs cursor-pointer"
          >
            Hiring manager
          </button>
          <button
            type="button"
            id="btn-quick-demo-staff"
            onClick={() => handleQuickDemo('staff')}
            className="btn h-8 px-2 text-xs cursor-pointer"
          >
            Staff engineer
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('candidate')}
            className="btn h-8 px-2 text-xs cursor-pointer"
          >
            Candidate
          </button>
        </div>
      </div>
    </div>
  );
};
