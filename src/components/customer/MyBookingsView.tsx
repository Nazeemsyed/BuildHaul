import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, BookingStatus } from '../../types';
import { 
  Calendar, 
  MapPin, 
  Truck, 
  Clock, 
  Phone, 
  ShieldCheck, 
  Star, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw,
  Navigation,
  FileText
} from 'lucide-react';

export const MyBookingsView: React.FC = () => {
  const { 
    bookings, 
    currentUser, 
    cancelBooking, 
    setSelectedBookingForReview, 
    setIsReviewModalOpen,
    setActiveTab
  } = useApp();

  const [activeTabFilter, setActiveTabFilter] = useState<'All' | 'Upcoming' | 'Active' | 'Completed' | 'Cancelled'>('All');

  // Filter bookings for current customer (or all for demo)
  const userBookings = bookings.filter(b => {
    if (activeTabFilter === 'Upcoming') return b.status === 'Confirmed' || b.status === 'Pending';
    if (activeTabFilter === 'Active') return b.status === 'Driver Assigned' || b.status === 'In Progress';
    if (activeTabFilter === 'Completed') return b.status === 'Completed';
    if (activeTabFilter === 'Cancelled') return b.status === 'Cancelled';
    return true;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'In Progress':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Confirmed':
      case 'Driver Assigned':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Cancelled':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Pending':
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  const steps: BookingStatus[] = ['Pending', 'Confirmed', 'Driver Assigned', 'In Progress', 'Completed'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800 mb-8">
        <div>
          <div className="text-xs font-bold text-amber-400 tracking-wider">SITE FLEET CONTRACTS</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">My Equipment Bookings</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Track live machine dispatches, driver communications, and verified proof of deliveries.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('vehicles')}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-md shadow-amber-500/20 whitespace-nowrap self-start sm:self-auto"
        >
          + Book Another Machine
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl w-fit mb-8 overflow-x-auto max-w-full">
        {(['All', 'Active', 'Upcoming', 'Completed', 'Cancelled'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTabFilter(tab)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTabFilter === tab
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {tab} Bookings
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {userBookings.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/40 border border-neutral-800 rounded-2xl space-y-3">
          <Truck className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No {activeTabFilter.toLowerCase()} bookings found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            You don't have any bookings in this category. Browse available machinery in the catalog.
          </p>
          <button
            onClick={() => setActiveTab('vehicles')}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white rounded-xl transition-colors"
          >
            Browse Fleet Catalog
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {userBookings.map(b => {
            const currentStepIdx = steps.indexOf(b.status);

            return (
              <div
                key={b.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl"
              >
                {/* Header banner */}
                <div className="p-4 sm:p-5 bg-neutral-950/60 border-b border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      ID: {b.id}
                    </span>
                    <span aria-hidden="true" className="text-neutral-700">·</span>
                    <span className="text-xs text-neutral-400">
                      Booked on {b.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusBadge(b.status)}`}>
                      {b.status}
                    </span>
                    <span className="text-xs font-bold text-white font-mono tabular-nums">
                      ₹{b.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress Stepper (if not cancelled) */}
                {b.status !== 'Cancelled' && (
                  <div className="px-5 pt-4 pb-2 border-b border-neutral-800/50 hidden md:block">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      {steps.map((st, sIdx) => {
                        const isDone = sIdx <= currentStepIdx;
                        const isCurrent = sIdx === currentStepIdx;
                        return (
                          <div key={st} className="flex-1 flex flex-col items-center relative">
                            {/* Line connecting */}
                            {sIdx < steps.length - 1 && (
                              <div
                                className={`absolute top-2.5 left-1/2 w-full h-0.5 z-0 ${
                                  sIdx < currentStepIdx ? 'bg-amber-500' : 'bg-neutral-800'
                                }`}
                              />
                            )}
                            {/* Circle Dot */}
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center z-10 text-[10px] font-bold ${
                                isDone
                                  ? 'bg-amber-500 text-neutral-950 ring-2 ring-amber-500/20'
                                  : 'bg-neutral-800 text-neutral-500'
                              }`}
                            >
                              {isDone ? '✓' : sIdx + 1}
                            </div>
                            <span className={`mt-1 font-medium ${isCurrent ? 'text-amber-400 font-bold' : isDone ? 'text-neutral-300' : 'text-neutral-500'}`}>
                              {st}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Body Details */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Col 1: Vehicle & Image */}
                  <div className="flex gap-4">
                    <img
                      src={b.vehicleImage}
                      alt={b.vehicleName}
                      className="w-24 h-20 rounded-xl object-cover border border-neutral-800 shrink-0"
                    />
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">{b.vehicleName}</h4>
                      <p className="text-xs text-neutral-400">{b.vehicleType}</p>
                      <div className="text-xs text-amber-400/90 font-mono">
                        Material: {b.materialType} ({b.quantity})
                      </div>
                    </div>
                  </div>

                  {/* Col 2: Route & Deployment */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-neutral-500 block text-[10px]">PICKUP</span>
                        <span className="text-neutral-200">{b.pickupLocation}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Navigation className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-neutral-500 block text-[10px]">SITE DESTINATION</span>
                        <span className="text-neutral-200">{b.destination}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-neutral-400 pt-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{b.startDate} · {b.durationDays} Day(s) Deployment</span>
                    </div>
                  </div>

                  {/* Col 3: Driver & Owner Contact */}
                  <div className="space-y-2.5 text-xs bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
                    <div className="flex justify-between items-center pb-1 border-b border-neutral-800">
                      <span className="text-neutral-400">Fleet Owner:</span>
                      <span className="font-semibold text-white">{b.ownerName}</span>
                    </div>

                    {b.assignedDriver ? (
                      <div>
                        <span className="text-neutral-400 block text-[10px]">ASSIGNED COMMERCIAL OPERATOR</span>
                        <div className="font-bold text-emerald-400">{b.assignedDriver.name}</div>
                        <div className="flex items-center gap-1.5 text-neutral-300 font-mono text-[11px] mt-0.5">
                          <Phone className="w-3 h-3 text-amber-500" />
                          <span>{b.assignedDriver.phone}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-neutral-500 italic text-[11px]">
                        Self-operated rental (Customer provides licensed driver)
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-neutral-400">Payment:</span>
                      <span className="font-medium text-emerald-400">{b.paymentStatus} ({b.paymentMethod})</span>
                    </div>
                  </div>

                </div>

                {/* Footer Actions */}
                <div className="px-5 py-3.5 bg-neutral-950/40 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-neutral-400">
                    Need live dispatch assistance? Call <strong className="text-neutral-200 font-mono">+91 800-BUILD-HAUL</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Rate & Review button for Completed bookings */}
                    {b.status === 'Completed' && (
                      <button
                        onClick={() => {
                          setSelectedBookingForReview(b);
                          setIsReviewModalOpen(true);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                          b.review 
                            ? 'bg-neutral-800 text-neutral-300 border border-neutral-700' 
                            : 'bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{b.review ? 'Review Submitted ★' : 'Rate & Review Trip'}</span>
                      </button>
                    )}

                    {/* Cancel button if pending/confirmed */}
                    {(b.status === 'Pending' || b.status === 'Confirmed') && (
                      <button
                        onClick={() => cancelBooking(b.id)}
                        className="px-3 py-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
