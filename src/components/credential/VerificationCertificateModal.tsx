import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, X, Share2 } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { audioService } from '../../services/audioService';

interface VerificationCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMPETENCIES: Array<{ title: string; detail: React.ReactNode }> = [
  {
    title: 'Double-entry ledger invariant',
    detail: <>Zero-sum conservation &Delta;Bal(A) + &Delta;Bal(B) = 0 with deadlock-free locking.</>
  },
  {
    title: 'Idempotent payment gateway and webhook DLQ',
    detail: 'Redis SETNX locking, acquirer circuit breakers and exponential backoff retries.'
  },
  {
    title: 'Black Friday chaos surge resilience',
    detail: 'No single points of failure under surge traffic; replicated database failover.'
  }
];

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

  const handleClose = () => {
    audioService.playTap();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim backdrop-blur-sm">
      <div
        className="glass-strong rounded-xl w-full max-w-xl max-h-[calc(100dvh-2rem)] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="certificate-modal-title"
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4 border-b border-rule">
          <div className="min-w-0">
            <h2 id="certificate-modal-title" className="text-lg font-medium tracking-tight text-ink">
              Proof of engineering competence
            </h2>
            <p className="text-sm text-muted mt-1">
              A shareable credential for the challenges you have solved.
            </p>
          </div>
          <button type="button" onClick={handleClose} className="btn-icon shrink-0" aria-label="Close" title="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-6">
          <dl className="text-sm divide-y divide-rule border-y border-rule">
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="text-muted shrink-0">Issued to</dt>
              <dd className="text-ink font-medium text-right">{candidateName}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="text-muted shrink-0">Credential hash</dt>
              <dd className="font-mono text-xs text-ink-2 truncate">{verificationHash}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="text-muted shrink-0">Issued</dt>
              <dd className="text-ink-2">{issueDate}</dd>
            </div>
          </dl>

          <div>
            <div className="label mb-1">Verified competencies</div>
            <ul className="divide-y divide-rule border-y border-rule">
              {COMPETENCIES.map((c) => (
                <li key={c.title} className="flex items-start gap-2.5 py-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-ok shrink-0 mt-0.5" />
                  <div>
                    <div className="text-ink font-medium">{c.title}</div>
                    <div className="text-muted mt-0.5">{c.detail}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* RazorpayX bounty */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-rule">
            <div className="min-w-0">
              <div className="text-sm font-medium text-ink">₹5,000 engineering bounty</div>
              <div className="text-xs text-muted mt-0.5">
                {bountyClaimed ? 'Sent through RazorpayX.' : 'Paid out through RazorpayX for the fintech challenges.'}
              </div>
            </div>
            <button
              type="button"
              id="btn-open-bounty-modal"
              onClick={() => {
                audioService.playTap();
                setBountyModalOpen(true);
              }}
              className="btn shrink-0"
            >
              {bountyClaimed ? 'View UTR' : 'Claim ₹5,000'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-rule flex flex-wrap items-center justify-end gap-2">
          <button type="button" onClick={handleClose} className="btn-quiet">
            Done
          </button>
          <button type="button" onClick={handleCopyMarkdown} className="btn">
            {copiedMd ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedMd ? 'Badge copied' : 'GitHub badge'}</span>
          </button>
          <button type="button" onClick={handleCopyLink} className="btn-primary">
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link copied' : 'Copy verification URL'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
