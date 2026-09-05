import React, { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  Building,
  QrCode,
  Lock,
  Copy,
  Check
} from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white dark:bg-[#2F3E46] rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bounty-modal-title"
      >
        {/* Top Header Card with RazorpayX Branding */}
        <div className="p-6 bg-gradient-to-br from-purple-500/10 via-[#EBF0EB] to-white dark:from-purple-500/20 dark:via-[#2F3E46] dark:to-[#1E272C] border-b border-black/[0.06] dark:border-white/10 relative">
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

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#84A98C] flex items-center justify-center text-white shadow-sm">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#52796F] dark:text-[#84A98C] font-bold">
                  RazorpayX Payouts API
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold">
                  Instant Transfer
                </span>
              </div>
              <h2 id="bounty-modal-title" className="text-lg font-bold text-[#2F3E46] dark:text-white">
                ₹5,000 Interview Bounty
              </h2>
            </div>
          </div>
          <p className="text-xs text-[#52796F] dark:text-neutral-400">
            Awarded for verified mastery of high-throughput payment architectures &amp; double-entry ledger invariants.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {receipt ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#2F3E46] dark:text-white">Bounty Disbursed via RazorpayX!</h3>
                <p className="text-xs text-[#52796F] dark:text-neutral-400 mt-0.5">
                  Direct transfer executed through RazorpayX banking integration.
                </p>
              </div>

              {/* Receipt Card */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/80 dark:border-white/10 text-left font-mono text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#84A98C]">Amount Disbursed:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold">₹5,000.00</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#84A98C]">Status:</span>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase">
                    {receipt.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#84A98C]">Bank UTR:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[#2F3E46] dark:text-white font-bold">{receipt.utr}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyUtr(receipt.utr)}
                      className="p-1 text-[#84A98C] hover:opacity-80 cursor-pointer"
                      title="Copy UTR Reference"
                    >
                      {copiedUtr ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#84A98C]">Payout ID:</span>
                  <span className="text-[#52796F] dark:text-[#84A98C] truncate max-w-[170px]">{receipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#84A98C]">Transfer Mode:</span>
                  <span className="text-neutral-700 dark:text-neutral-300">{receipt.mode}</span>
                </div>
              </div>

              <button
                type="button"
                id="btn-razorpayx-done"
                onClick={() => {
                  audioService.playTap();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-[#84A98C] hover:bg-[#52796F] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          ) : (
            <>
              {/* Challenge Solved Invariant Pill */}
              <div className="p-3 rounded-2xl bg-[#84A98C]/15 dark:bg-[#354F52]/60 border border-[#84A98C]/30 dark:border-white/10 flex items-center gap-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#52796F] dark:text-[#84A98C] shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-[#2F3E46] dark:text-white truncate">
                    Fintech Invariant Verified
                  </div>
                  <div className="text-[11px] text-[#52796F] dark:text-neutral-400 truncate">
                    Razorpay Payment Gateway &amp; Double-Entry Ledger Transfer
                  </div>
                </div>
              </div>

              {/* Mode Segmented Control */}
              <div className="flex items-center bg-neutral-100 dark:bg-white/10 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPayoutMode('upi')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    payoutMode === 'upi'
                      ? 'bg-white dark:bg-[#354F52] text-[#2F3E46] dark:text-white shadow-xs'
                      : 'text-[#52796F] dark:text-neutral-400 hover:text-[#2F3E46]'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>UPI VPA (Instant)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPayoutMode('bank')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    payoutMode === 'bank'
                      ? 'bg-white dark:bg-[#354F52] text-[#2F3E46] dark:text-white shadow-xs'
                      : 'text-[#52796F] dark:text-neutral-400 hover:text-[#2F3E46]'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Bank Account</span>
                </button>
              </div>

              {/* Input Fields */}
              {payoutMode === 'upi' ? (
                <div>
                  <label className="block text-xs font-medium text-[#2F3E46] dark:text-neutral-200 mb-1">
                    Beneficiary UPI ID (VPA)
                  </label>
                  <input
                    type="text"
                    id="razorpayx-vpa-input"
                    value={vpa}
                    onChange={(e) => setVpa(e.target.value)}
                    placeholder="yourname@okhdfcbank"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs text-[#2F3E46] dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#84A98C]/25"
                  />
                  <span className="text-[10px] text-[#84A98C] dark:text-neutral-400 mt-1 block">
                    Funds will be disbursed instantly through RazorpayX UPI rails.
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[#2F3E46] dark:text-neutral-200 mb-1">
                      Bank Account Number
                    </label>
                    <input
                      type="text"
                      id="razorpayx-bank-account-input"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="919876543210"
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs text-[#2F3E46] dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-[#84A98C]/25"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#2F3E46] dark:text-neutral-200 mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      id="razorpayx-bank-ifsc-input"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                      placeholder="HDFC0001234"
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs text-[#2F3E46] dark:text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#84A98C]/25"
                    />
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-300">
                  {errorMessage}
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                id="btn-razorpayx-disburse"
                onClick={handleClaimPayout}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#84A98C] to-[#52796F] hover:from-[#52796F] hover:to-[#354F52] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 disabled:opacity-60 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{isProcessing ? 'Disbursing via RazorpayX...' : 'Disburse ₹5,000 to My Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#84A98C] dark:text-neutral-400">
                <Lock className="w-3 h-3 text-purple-500" />
                <span>Powered by RazorpayX Corporate Payouts &amp; Banking APIs</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
