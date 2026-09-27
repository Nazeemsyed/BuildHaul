import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Truck, 
  Wallet, 
  Calendar, 
  Star, 
  Plus, 
  Check, 
  X, 
  ShieldCheck, 
  UserCheck, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  Clock, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { BookingStatus, Driver, Vehicle } from '../../types';

export const OwnerDashboard: React.FC = () => {
  const { 
    vehicles, 
    bookings, 
    currentUser, 
    setIsAddVehicleModalOpen, 
    setIsOwnerVerificationModalOpen, 
    updateBookingStatus,
    updateVehicle,
    deleteVehicle,
    drivers,
    addDriver
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'fleet' | 'requests' | 'drivers' | 'earnings'>('overview');
  
  // State for Add Driver inline modal
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [driverExp, setDriverExp] = useState(5);

  // Filter items owned by current owner (or show all in demo if role is owner)
  const ownerVehicles = vehicles.filter(v => v.ownerId === currentUser?.id || currentUser?.role === 'owner');
  const ownerBookings = bookings.filter(b => b.ownerId === currentUser?.id || currentUser?.role === 'owner');

  const pendingRequests = ownerBookings.filter(b => b.status === 'Pending');
  const todayBookings = ownerBookings.filter(b => b.status === 'Confirmed' || b.status === 'In Progress');
  const completedBookings = ownerBookings.filter(b => b.status === 'Completed');
  const availableVehiclesCount = ownerVehicles.filter(v => v.availabilityStatus === 'Available').length;
  
  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.vehiclePrice + b.driverFee), 0) + 
    todayBookings.reduce((sum, b) => sum + (b.vehiclePrice + b.driverFee), 0);

  const avgRating = ownerVehicles.length > 0 
    ? (ownerVehicles.reduce((acc, v) => acc + v.rating, 0) / ownerVehicles.length).toFixed(1)
    : '4.9';

  const handleAddDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName.trim() || !driverPhone.trim()) return;

    addDriver({
      name: driverName,
      phone: `+91 ${driverPhone.replace(/\D/g, '').slice(-10)}`,
      licenseNumber: driverLicense.toUpperCase() || 'AP-16-COMMERCIAL',
      experienceYears: driverExp,
      status: 'Available'
    });

    setIsAddDriverOpen(false);
    setDriverName('');
    setDriverPhone('');
    setDriverLicense('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Dashboard Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 tracking-wider">
            <span>FLEET COMMAND CONSOLE</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Fleet Operator
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {currentUser?.companyName || 'Naidu Earthmovers & Transport'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Manage your machinery availability, dispatch commercial operators, approve site bookings, and track revenues.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => setIsOwnerVerificationModalOpen(true)}
            className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>KYC Verification</span>
          </button>
          
          <button
            onClick={() => setIsAddVehicleModalOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-md shadow-amber-500/20 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
        
        {/* Today's Bookings */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-[11px] text-neutral-400 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>Today's Bookings</span>
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {todayBookings.length}
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Active on sites</div>
        </div>

        {/* Available Vehicles */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-[11px] text-neutral-400 mb-1 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Available Fleet</span>
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {availableVehiclesCount} <span className="text-xs text-neutral-500 font-normal">/ {ownerVehicles.length}</span>
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Ready for dispatch</div>
        </div>

        {/* Pending Requests */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-[11px] text-neutral-400 mb-1 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>Pending Requests</span>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono tabular-nums">
            {pendingRequests.length}
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Requires approval</div>
        </div>

        {/* Monthly Earnings */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-[11px] text-neutral-400 mb-1 flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Monthly Earnings</span>
          </div>
          <div className="text-lg sm:text-xl font-black text-white font-mono tabular-nums">
            ₹{totalEarnings.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">+18% vs last month</div>
        </div>

        {/* Total Bookings */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-[11px] text-neutral-400 mb-1 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
            <span>Total Bookings</span>
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {ownerBookings.length}
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Lifetime platform jobs</div>
        </div>

        {/* Ratings */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-[11px] text-neutral-400 mb-1 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Fleet Rating</span>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono tabular-nums">
            {avgRating}★
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Top Rated Operator</div>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl w-fit mb-8 overflow-x-auto max-w-full">
        {(['overview', 'fleet', 'requests', 'drivers', 'earnings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors capitalize whitespace-nowrap ${
              activeTab === tab
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {tab === 'requests' ? `Booking Requests (${pendingRequests.length})` : tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}

      {/* 1. OVERVIEW & PENDING REQUESTS */}
      {(activeTab === 'overview' || activeTab === 'requests') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Pending Contractor Booking Requests</h3>
            <span className="text-xs text-neutral-400 font-mono">{pendingRequests.length} Pending</span>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center bg-neutral-900/40 border border-neutral-800 rounded-2xl text-xs text-neutral-400">
              No pending booking requests at this moment. New requests appear here instantly.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map(b => (
                <div
                  key={b.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={b.vehicleImage}
                      alt={b.vehicleName}
                      className="w-20 h-16 rounded-xl object-cover border border-neutral-800 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{b.vehicleName}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {b.id}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-300">
                        Contractor: <strong className="text-white">{b.customerName}</strong> ({b.customerPhone})
                      </div>
                      <div className="text-xs text-neutral-400">
                        Route: {b.pickupLocation} → {b.destination}
                      </div>
                      <div className="text-xs text-neutral-400">
                        Duration: {b.startDate} ({b.durationDays} Days) · Material: {b.materialType} ({b.quantity})
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-800">
                    <div className="text-right">
                      <div className="text-base font-extrabold text-amber-400 font-mono">
                        ₹{b.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {b.driverRequired ? 'Driver Requested' : 'Self-drive'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateBookingStatus(b.id, 'Cancelled')}
                        className="px-3 py-2 bg-neutral-800 hover:bg-rose-950 hover:text-rose-400 border border-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => updateBookingStatus(b.id, 'Confirmed')}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors shadow-sm"
                      >
                        Accept Booking
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. FLEET INVENTORY MANAGEMENT */}
      {activeTab === 'fleet' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">My Construction Vehicles ({ownerVehicles.length})</h3>
            <button
              onClick={() => setIsAddVehicleModalOpen(true)}
              className="px-3.5 py-1.5 bg-amber-500 text-neutral-950 font-bold rounded-xl text-xs hover:bg-amber-400"
            >
              + Add Vehicle
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ownerVehicles.map(veh => (
              <div
                key={veh.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden p-4 space-y-3"
              >
                <div className="relative h-40 rounded-xl overflow-hidden bg-neutral-950">
                  <img src={veh.image} alt={veh.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-neutral-950/80 px-2 py-0.5 rounded text-[10px] font-mono text-amber-400">
                    RC: {veh.regNumber}
                  </div>
                  <div className="absolute top-2 right-2 bg-neutral-950/80 px-2 py-0.5 rounded text-[10px] font-bold text-white">
                    {veh.availabilityStatus}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white truncate">{veh.name}</h4>
                  <div className="text-xs text-neutral-400">{veh.type} · {veh.capacityDisplay}</div>
                  <div className="text-sm font-black text-amber-400 font-mono mt-1">₹{veh.pricePerDay}/day</div>
                </div>

                {/* Inline Availability Toggles & Actions */}
                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                  <select
                    value={veh.availabilityStatus}
                    onChange={e => updateVehicle(veh.id, { availabilityStatus: e.target.value as any })}
                    className="bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-neutral-200"
                  >
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => deleteVehicle(veh.id)}
                      className="p-1.5 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition-colors"
                      title="Delete vehicle listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. DRIVERS MANAGEMENT */}
      {activeTab === 'drivers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Managed Commercial Drivers ({drivers.length})</h3>
            <button
              onClick={() => setIsAddDriverOpen(true)}
              className="px-3.5 py-1.5 bg-amber-500 text-neutral-950 font-bold rounded-xl text-xs hover:bg-amber-400"
            >
              + Add Driver
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {drivers.map(drv => (
              <div
                key={drv.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-xs">
                      {drv.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{drv.name}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">{drv.phone}</div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    drv.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {drv.status}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs space-y-1">
                  <div className="flex justify-between text-neutral-400">
                    <span>License:</span>
                    <span className="font-mono text-neutral-200">{drv.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Experience:</span>
                    <span className="text-neutral-200">{drv.experienceYears} Years</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Driver Rating:</span>
                    <span className="text-amber-400 font-bold">★ {drv.rating}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* ADD DRIVER MODAL */}
          {isAddDriverOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
                <button
                  onClick={() => setIsAddDriverOpen(false)}
                  className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold text-white mb-4">Add Certified Commercial Driver</h3>
                <form onSubmit={handleAddDriverSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Driver Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. M. Srinivas Rao"
                      value={driverName}
                      onChange={e => setDriverName(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="98480 XXXXX"
                      value={driverPhone}
                      onChange={e => setDriverPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Heavy License (DL Number)</label>
                    <input
                      type="text"
                      required
                      placeholder="AP-16-2018-0049211"
                      value={driverLicense}
                      onChange={e => setDriverLicense(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">Commercial Experience (Years)</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={driverExp}
                      onChange={e => setDriverExp(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddDriverOpen(false)}
                      className="flex-1 py-2 bg-neutral-800 rounded-xl text-xs text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-amber-500 rounded-xl text-xs font-bold text-neutral-950"
                    >
                      Save Driver
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. EARNINGS BREAKDOWN */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">Earnings & Settlement Account</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Revenues are directly settled within 24 hours of trip completion into your registered bank account.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800">
                <div className="text-xs text-neutral-400">Total Net Payout</div>
                <div className="text-2xl font-black text-amber-400 font-mono">₹{totalEarnings.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800">
                <div className="text-xs text-neutral-400">Pending Site Escrow</div>
                <div className="text-2xl font-black text-white font-mono">₹14,400</div>
              </div>
              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800">
                <div className="text-xs text-neutral-400">Settled to Bank (HDFC)</div>
                <div className="text-2xl font-black text-emerald-400 font-mono">₹{(totalEarnings).toLocaleString()}</div>
              </div>
            </div>

            <div className="text-xs text-neutral-400">
              Registered Bank: <strong className="text-white">HDFC Bank (Auto Nagar Branch) · A/C •••• 8821 · IFSC: HDFC0001892</strong>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
