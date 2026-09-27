import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Truck, 
  ArrowRight,
  Receipt,
  Download,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import { Booking } from '../../types';

export const PaymentModal: React.FC = () => {
  const { 
    isPaymentModalOpen, 
    setIsPaymentModalOpen, 
    pendingBookingData, 
    createBooking, 
    setActiveTab 
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'sitepay'>('upi');
  const [upiId, setUpiId] = useState('contractor@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!isPaymentModalOpen || !pendingBookingData) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const methodName = 
        paymentMethod === 'upi' ? `UPI (${upiId})` :
        paymentMethod === 'card' ? 'Credit/Debit Card (•••• 4921)' :
        paymentMethod === 'netbanking' ? 'Net Banking (HDFC Bank)' : 'Site Pay / Pay on Arrival';

      const booking = createBooking({
        ...pendingBookingData,
        paymentMethod: methodName,
        paymentStatus: paymentMethod === 'sitepay' ? 'Pending' : 'Paid',
        status: 'Confirmed'
      });

      setConfirmedBooking(booking);
      setIsProcessing(false);
    }, 1200);
  };

  const handleFinish = () => {
    setIsPaymentModalOpen(false);
    setConfirmedBooking(null);
    setActiveTab('bookings');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-neutral-100">
        
        {/* Close Button */}
        {!confirmedBooking && (
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {confirmedBooking ? (
          /* BOOKING CONFIRMATION SCREEN */
          <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">Booking Confirmed!</h2>
              <p className="text-xs text-neutral-400">
                Booking ID: <strong className="font-mono text-amber-400 text-sm">{confirmedBooking.id}</strong>
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Vehicle:</span>
                <span className="font-bold text-white">{confirmedBooking.vehicleName}</span>
              </div>

              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Fleet Owner:</span>
                <span className="font-semibold text-neutral-200">{confirmedBooking.ownerName}</span>
              </div>

              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Pickup Location:</span>
                <span className="font-medium text-neutral-200 truncate max-w-[240px]">{confirmedBooking.pickupLocation}</span>
              </div>

              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Deployment Date:</span>
                <span className="font-mono text-neutral-200">{confirmedBooking.startDate} ({confirmedBooking.durationDays} Days)</span>
              </div>

              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Status:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  {confirmedBooking.status}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 text-sm font-bold">
                <span className="text-white">Total Amount Paid:</span>
                <span className="text-amber-400 font-mono tabular-nums">₹{confirmedBooking.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 text-left flex items-start gap-2">
              <Truck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                The fleet operator has received your request. Driver details and live tracking will activate 2 hours before site dispatch.
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <span>Track Machine in My Bookings</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* PAYMENT CHECKOUT FORM */
          <div className="space-y-6">
            <div className="border-b border-neutral-800 pb-4">
              <div className="text-xs font-bold text-amber-400 tracking-wider">CHECKOUT & ESCROW</div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Review & Secure Payment</h2>
            </div>

            {/* Bill Summary */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Vehicle Rental ({pendingBookingData.durationDays}d)</span>
                <span className="text-white font-mono">₹{pendingBookingData.vehiclePrice?.toLocaleString()}</span>
              </div>

              {pendingBookingData.driverRequired && (
                <div className="flex justify-between text-neutral-400">
                  <span>Driver Fee</span>
                  <span className="text-white font-mono">₹{pendingBookingData.driverFee?.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-400">
                <span>Platform Escrow Fee (5%)</span>
                <span className="text-white font-mono">₹{pendingBookingData.platformFee?.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-neutral-400">
                <span>GST (18%)</span>
                <span className="text-white font-mono">₹{pendingBookingData.gstAmount?.toLocaleString()}</span>
              </div>

              <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-sm font-bold text-white">
                <span>Total Amount</span>
                <span className="text-amber-400 text-lg font-mono tabular-nums">
                  ₹{pendingBookingData.totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-neutral-300">
                Select Payment Method
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-left text-xs transition-colors flex items-center gap-2.5 ${
                    paymentMethod === 'upi'
                      ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-amber-500" />
                  <div>
                    <div>Instant UPI</div>
                    <div className="text-[10px] text-neutral-500 font-normal">GPay / PhonePe / QR</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border text-left text-xs transition-colors flex items-center gap-2.5 ${
                    paymentMethod === 'netbanking'
                      ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-amber-500" />
                  <div>
                    <div>Net Banking</div>
                    <div className="text-[10px] text-neutral-500 font-normal">All Major Indian Banks</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-left text-xs transition-colors flex items-center gap-2.5 ${
                    paymentMethod === 'card'
                      ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-amber-500" />
                  <div>
                    <div>Card</div>
                    <div className="text-[10px] text-neutral-500 font-normal">Visa, RuPay, Master</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('sitepay')}
                  className={`p-3 rounded-xl border text-left text-xs transition-colors flex items-center gap-2.5 ${
                    paymentMethod === 'sitepay'
                      ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Truck className="w-4 h-4 text-amber-500" />
                  <div>
                    <div>Pay on Arrival</div>
                    <div className="text-[10px] text-neutral-500 font-normal">Pay upon site inspection</div>
                  </div>
                </button>
              </div>

              {/* UPI ID Input if UPI selected */}
              {paymentMethod === 'upi' && (
                <div className="mt-3">
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Enter UPI VPA / PhonePe ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    placeholder="98480XXXXX@ybl or user@okhdfcbank"
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              )}
            </div>

            {/* Escrow Trust note */}
            <div className="flex items-center gap-2 text-xs text-neutral-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Funds held safely in BuildHaul Site Escrow until vehicle arrives at pickup.</span>
            </div>

            {/* Pay Button */}
            <form onSubmit={handlePay}>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                    <span>Processing Secure Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{pendingBookingData.totalAmount?.toLocaleString()} & Confirm Booking</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
