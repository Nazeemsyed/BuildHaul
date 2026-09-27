import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, Upload, FileText, CheckCircle2 } from 'lucide-react';

export const OwnerVerificationModal: React.FC = () => {
  const { isOwnerVerificationModalOpen, setIsOwnerVerificationModalOpen, submitVerification, currentUser } = useApp();

  const [idProofName, setIdProofName] = useState('Aadhaar_Card_Owner.pdf');
  const [rcDocName, setRcDocName] = useState('Commercial_RC_Book.pdf');
  const [licenseName, setLicenseName] = useState('Commercial_Heavy_DL.pdf');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOwnerVerificationModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitVerification({
      idProofName,
      rcDocName,
      licenseName
    });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsOwnerVerificationModalOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-neutral-100">
        
        <button
          onClick={() => setIsOwnerVerificationModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-neutral-800 pb-3 mb-5">
          <div className="text-xs font-bold text-amber-400 tracking-wider">FLEET TRUST COMPLIANCE</div>
          <h2 className="text-xl font-bold text-white">Owner & Vehicle KYC Verification</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Government compliance verification guarantees the Verified Fleet Badge and higher priority contractor bookings.
          </p>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Documents Submitted Successfully!</h3>
            <p className="text-xs text-neutral-400">
              Admin team will review your ID and RC documents within 2-4 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* 1. Identity Proof */}
            <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1.5">
              <label className="text-xs font-bold text-neutral-200 flex items-center justify-between">
                <span>1. Government ID Proof (Aadhaar / PAN / Passport)</span>
                <span className="text-[10px] text-amber-400 font-mono">Required</span>
              </label>
              <div className="flex items-center justify-between p-2 bg-neutral-900 rounded-lg border border-neutral-800 text-xs">
                <span className="text-neutral-300 truncate max-w-[200px]">{idProofName}</span>
                <label className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer">
                  Change
                  <input
                    type="file"
                    className="hidden"
                    onChange={e => setIdProofName(e.target.files?.[0]?.name || idProofName)}
                  />
                </label>
              </div>
            </div>

            {/* 2. Vehicle Registration Document */}
            <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1.5">
              <label className="text-xs font-bold text-neutral-200 flex items-center justify-between">
                <span>2. Vehicle Registration Certificate (RC)</span>
                <span className="text-[10px] text-amber-400 font-mono">Required</span>
              </label>
              <div className="flex items-center justify-between p-2 bg-neutral-900 rounded-lg border border-neutral-800 text-xs">
                <span className="text-neutral-300 truncate max-w-[200px]">{rcDocName}</span>
                <label className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer">
                  Change
                  <input
                    type="file"
                    className="hidden"
                    onChange={e => setRcDocName(e.target.files?.[0]?.name || rcDocName)}
                  />
                </label>
              </div>
            </div>

            {/* 3. Driving License / Commercial Badge */}
            <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1.5">
              <label className="text-xs font-bold text-neutral-200 flex items-center justify-between">
                <span>3. Commercial Heavy Driving License (LMV/HMV)</span>
                <span className="text-[10px] text-amber-400 font-mono">Required</span>
              </label>
              <div className="flex items-center justify-between p-2 bg-neutral-900 rounded-lg border border-neutral-800 text-xs">
                <span className="text-neutral-300 truncate max-w-[200px]">{licenseName}</span>
                <label className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer">
                  Change
                  <input
                    type="file"
                    className="hidden"
                    onChange={e => setLicenseName(e.target.files?.[0]?.name || licenseName)}
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-neutral-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>All uploads encrypted and verified against Ministry of Road Transport & Highways data.</span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsOwnerVerificationModalOpen(false)}
                className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors shadow-md shadow-amber-500/20"
              >
                Submit for Verification
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
