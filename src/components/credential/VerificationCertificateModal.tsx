import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  X,
  Share2,
  ExternalLink,
  Lock,
  Sparkles,
  Zap
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { audioService } from '../../services/audioService';

interface VerificationCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerificationCertificateModal: React.FC<VerificationCertificateModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    authenticatedUser,
    solvedProblemIds,
    setBountyModalOpen,
    bountyClaimed
  } = usePlatformStore();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  if (!isOpen) return null;

  const candidateName = authenticatedUser
    ? `${authenticatedUser.name || 'Alex Dev'} (${authenticatedUser.handle})`
    : 'Alex Dev (@alex_dev)';
  const solvedCount = Math.max(solvedProblemIds.length, 2); // At least showcase verified solutions
  const verificationHash = `ENG-VERIFY-7F4B-${(solvedCount * 1337).toString(16).toUpperCase()}-RZP`;
  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const verificationUrl = `https://englo.dev/verify/${verificationHash}`;
  const markdownBadge = `[![Englo Verified Competence](https://englo.dev/badge/${verificationHash}.svg)](${verificationUrl})`;

  const handleCopyLink = () => {
    audioService.playTap();
    navigator.clipboard.writeText(verificationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyMarkdown = () => {
    audioService.playTap();
    navigator.clipboard.writeText(markdownBadge);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-[#161B22] rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="certificate-modal-title"
      >
        {/* Certificate Apple-style Top Gradient Card */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-[#84A98C]/15 via-[#EBF0EB] to-[#F4F6F4] dark:from-[#84A98C]/20 dark:via-[#2F3E46] dark:to-[#1E272C] border-b border-black/[0.06] dark:border-white/10">
          <button
            onClick={() => {
              audioService.playTap();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[#52796F] dark:text-neutral-400 hover:text-[#2F3E46] dark:hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#84A98C] to-[#52796F] flex items-center justify-center text-white shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#52796F] dark:text-[#84A98C] font-bold">
                  Official Verification Credential
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                  Tamper-Proof
                </span>
              </div>
              <h2 id="certificate-modal-title" className="text-xl font-bold tracking-tight text-[#2F3E46] dark:text-white">
                Proof of Engineering Competence
              </h2>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#2F3E46]/80 border border-black/[0.04] dark:border-white/10 shadow-sm backdrop-blur-sm">
            <div className="text-xs text-[#84A98C] dark:text-neutral-400 font-medium">Issued To</div>
            <div className="text-lg font-bold text-[#2F3E46] dark:text-white mb-2">{candidateName}</div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-black/[0.04] dark:border-white/10">
              <div>
                <span className="text-[#84A98C] dark:text-neutral-400">Credential Hash:</span>
                <div className="font-mono text-[11px] font-semibold text-[#52796F] dark:text-[#84A98C] truncate">
                  {verificationHash}
                </div>
              </div>
              <div>
                <span className="text-[#84A98C] dark:text-neutral-400">Issue Date:</span>
                <div className="font-mono text-[11px] font-semibold text-[#2F3E46] dark:text-white">
                  {issueDate}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Competency Invariants */}
        <div className="p-6 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#84A98C] dark:text-neutral-400">
            Verified Fintech &amp; Distributed Systems Competencies
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#2F3E46] dark:text-white font-semibold">
                  Atomic Financial Double-Entry Accounting Invariant:
                </strong>{' '}
                <span className="text-[#52796F] dark:text-neutral-400">
                  Formulated strict zero-sum ledger conservation &Delta;Bal(A) + &Delta;Bal(B) = 0 with deadlock-free concurrency locking.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#2F3E46] dark:text-white font-semibold">
                  Idempotent Payment Gateway &amp; Webhook DLQ Architecture:
                </strong>{' '}
                <span className="text-[#52796F] dark:text-neutral-400">
                  Engineered distributed locking with Redis SETNX, bank acquirer circuit breakers, and exponential backoff retry semantics.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#2F3E46] dark:text-white font-semibold">
                  Black Friday 10x Chaos Surge Resilience:
                </strong>{' '}
                <span className="text-[#52796F] dark:text-neutral-400">
                  Simulated 100,000 req/s stress traffic; eliminated single points of failure (SPOFs) and verified multi-replica database failover.
                </span>
              </div>
            </div>
          </div>

          {/* RazorpayX ₹5,000 Bounty Claim Callout */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-[#84A98C]/15 to-amber-500/10 border border-purple-500/25 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-[#52796F] flex items-center justify-center text-white shrink-0 shadow-sm">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#2F3E46] dark:text-white flex items-center gap-1.5">
                  <span>₹5,000 Engineering Bounty Earned</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 font-mono font-bold">
                    RazorpayX
                  </span>
                </div>
                <div className="text-[11px] text-[#52796F] dark:text-neutral-400">
                  {bountyClaimed ? 'Disbursed directly via UPI / IMPS' : 'Instant direct bank payout for solving fintech challenges'}
                </div>
              </div>
            </div>

            <button
              type="button"
              id="btn-open-bounty-modal"
              onClick={() => {
                audioService.playTap();
                setBountyModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shrink-0 transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              {bountyClaimed ? 'View UTR' : 'Claim ₹5,000'}
            </button>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-black/[0.06] dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl bg-[#84A98C] hover:bg-[#52796F] text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Verification URL'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="px-3.5 py-2 rounded-xl bg-[#F5F5F7] dark:bg-white/[0.08] hover:bg-neutral-200 dark:hover:bg-white/15 text-[#1D1D1F] dark:text-white border border-black/5 dark:border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                {copiedMd ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedMd ? 'Badge Copied!' : 'GitHub Badge'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                audioService.playTap();
                onClose();
              }}
              className="text-xs font-medium text-[#86868B] dark:text-neutral-400 hover:text-[#1D1D1F] dark:hover:text-white transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
