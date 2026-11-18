import React, { useState } from 'react';
import { CheckCircle2, X, Building, QrCode, Copy, Check } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { audioService } from '../../services/audioService';

interface RazorpayXBountyModalProps {
  isOpen: boolean;
  onClose: () => void;
  problemId?: string;
}

export const RazorpayXBountyModal: React.FC<RazorpayXBountyModalProps> = ({
  isOpen,
  onClose,
  problemId = 'sys-6'
}) => {
  const { authenticatedUser, bountyClaimed, bountyReceipt, claimBounty } = usePlatformStore();

  const [payoutMode, setPayoutMode] = useState<'upi' | 'bank'>('upi');
  const [vpa, setVpa] = useState('alex.dev@okhdfcbank');
  const [accountNumber, setAccountNumber] = useState('919876543210');
  const [ifsc, setIfsc] = useState('HDFC0001234');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<any | null>(bountyReceipt || null);
  const [copiedUtr, setCopiedUtr] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClaimPayout = async () => {
    audioService.playTap();
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const payload: any = {
        candidateEmail: authenticatedUser?.email || 'alex@englo.dev',
        candidateHandle: authenticatedUser?.handle || '@alex_dev',
        amount: 500000, // ₹5,000 in paise
        problemId
      };

      if (payoutMode === 'upi') {
        if (!vpa || !vpa.includes('@')) {
          throw new Error('Please enter a valid UPI VPA address (e.g. name@bank)');
        }
        payload.vpa = vpa.trim();
      } else {
        if (!accountNumber || !ifsc) {
          throw new Error('Please provide valid bank account number and IFSC code');
        }
        payload.accountNumber = accountNumber.trim();
        payload.ifsc = ifsc.trim().toUpperCase();
      }

      const res = await fetch('/api/razorpayx/create-payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`RazorpayX Payout API responded with status ${res.status}`);
      }

      const json = await res.json();
      if (!json.success || !json.payout) {
        throw new Error(json.error || 'Payout could not be authorized');
      }

      audioService.playSuccessChime();
      setReceipt(json.payout);
      claimBounty(json.payout);
    } catch (err: any) {
      console.error('RazorpayX Payout error:', err);
      setErrorMessage(err.message || 'Payout failed.');
      audioService.playAlert();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyUtr = (utr: string) => {
    audioService.playTap();
    navigator.clipboard.writeText(utr);
    setCopiedUtr(true);
    setTimeout(() => setCopiedUtr(false), 2000);
  };

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
        aria-labelledby="bounty-modal-title"
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4 border-b border-rule">
          <div className="min-w-0">
            <h2 id="bounty-modal-title" className="text-lg font-medium tracking-tight text-ink">
              ₹5,000 interview bounty
            </h2>
            <p className="text-sm text-muted mt-1">
              Paid out through RazorpayX for the fintech ledger challenge.
            </p>
          </div>
          <button type="button" onClick={handleClose} className="btn-icon shrink-0" aria-label="Close" title="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-5">
          {receipt ? (
            <>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-ok shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-medium text-ink">Bounty sent</h3>
                  <p className="text-sm text-muted mt-0.5">Transferred through RazorpayX.</p>
                </div>
              </div>

              <dl className="text-sm divide-y divide-rule border-y border-rule">
                <div className="flex justify-between gap-4 py-2.5">
                  <dt className="text-muted">Amount</dt>
                  <dd className="font-mono text-ink">₹5,000.00</dd>
                </div>
                <div className="flex justify-between gap-4 py-2.5">
                  <dt className="text-muted">Status</dt>
                  <dd className="text-ok capitalize">{receipt.status}</dd>
                </div>
                <div className="flex justify-between items-center gap-4 py-2">
                  <dt className="text-muted shrink-0">Bank UTR</dt>
                  <dd className="flex items-center gap-1.5 min-w-0">
                    <span className="font-mono text-ink truncate">{receipt.utr}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyUtr(receipt.utr)}
                      className="btn-quiet h-7 px-1.5 cursor-pointer"
                      title="Copy UTR Reference"
                      aria-label="Copy UTR reference"
                    >
                      {copiedUtr ? <Check className="w-3.5 h-3.5 text-ok" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-2.5">
                  <dt className="text-muted shrink-0">Payout ID</dt>
                  <dd className="font-mono text-xs text-ink-2 truncate">{receipt.id}</dd>
                </div>
                <div className="flex justify-between gap-4 py-2.5">
                  <dt className="text-muted">Transfer mode</dt>
                  <dd className="font-mono text-ink-2">{receipt.mode}</dd>
                </div>
              </dl>
            </>
          ) : (
            <>
              {/* Payout method */}
              <div className="seg w-full" role="tablist" aria-label="Payout method">
                <button
                  type="button"
                  role="tab"
                  aria-selected={payoutMode === 'upi'}
                  onClick={() => setPayoutMode('upi')}
                  className="seg-item flex-1 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>UPI</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={payoutMode === 'bank'}
                  onClick={() => setPayoutMode('bank')}
                  className="seg-item flex-1 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Bank account</span>
                </button>
              </div>

              {payoutMode === 'upi' ? (
                <div>
                  <label htmlFor="razorpayx-vpa-input" className="label block mb-1.5">
                    UPI ID (VPA)
                  </label>
                  <input
                    type="text"
                    id="razorpayx-vpa-input"
                    value={vpa}
                    onChange={(e) => setVpa(e.target.value)}
                    placeholder="yourname@okhdfcbank"
                    className="field font-mono"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="razorpayx-bank-account-input" className="label block mb-1.5">
                      Account number
                    </label>
                    <input
                      type="text"
                      id="razorpayx-bank-account-input"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="919876543210"
                      className="field font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="razorpayx-bank-ifsc-input" className="label block mb-1.5">
                      IFSC code
                    </label>
                    <input
                      type="text"
                      id="razorpayx-bank-ifsc-input"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                      placeholder="HDFC0001234"
                      className="field font-mono uppercase"
                    />
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-lg bg-bad-soft border border-bad/40 text-sm text-bad" role="alert">
                  {errorMessage}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-rule flex flex-wrap items-center justify-end gap-2">
          {receipt ? (
            <button type="button" id="btn-razorpayx-done" onClick={handleClose} className="btn-primary">
              Close receipt
            </button>
          ) : (
            <>
              <button type="button" onClick={handleClose} className="btn-quiet">
                Cancel
              </button>
              <button
                type="button"
                id="btn-razorpayx-disburse"
                onClick={handleClaimPayout}
                disabled={isProcessing}
                className="btn-primary"
              >
                {isProcessing ? 'Sending…' : 'Send ₹5,000 to my account'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
