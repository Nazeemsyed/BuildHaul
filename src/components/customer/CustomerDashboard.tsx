import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Truck, 
  Calendar, 
  Wallet, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Star, 
  Clock, 
  CheckCircle2, 
  MapPin,
  TrendingUp,
  Layers
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { 
    currentUser, 
    bookings, 
    projects, 
    vehicles, 
    setActiveTab, 
    setSelectedVehicleForBooking, 
    setIsBookingModalOpen 
  } = useApp();

  const userBookings = bookings.filter(b => b.customerId === currentUser?.id || currentUser?.role === 'customer');
  const activeBookings = userBookings.filter(b => b.status === 'In Progress' || b.status === 'Driver Assigned');
  const upcomingBookings = userBookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending');
  const totalSpent = userBookings.filter(b => b.paymentStatus === 'Paid').reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 tracking-wider">
            <span>CONTRACTOR LOGISTICS PORTAL</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">Verified Contractor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {currentUser?.name || 'Rahul Varma'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            {currentUser?.companyName || 'Varma Infra & Builders'} · Active site machinery & dispatch overview.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('ai-finder')}
            className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-amber-400 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Sizing Tool</span>
          </button>
          
          <button
            onClick={() => setActiveTab('vehicles')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-md shadow-amber-500/20 flex items-center gap-1.5"
          >
            <Truck className="w-4 h-4" />
            <span>Hire Vehicles</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-[11px] text-neutral-400 mb-1 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-amber-500" />
            <span>Machines On Site</span>
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {activeBookings.length}
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Active deployments</div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-[11px] text-neutral-400 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>Upcoming Dispatches</span>
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {upcomingBookings.length}
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Confirmed trips</div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-[11px] text-neutral-400 mb-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Projects</span>
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {projects.length}
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Commercial sites</div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
          <div className="text-[11px] text-neutral-400 mb-1 flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total Logistics Spend</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono tabular-nums">
            ₹{totalSpent.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-500 mt-0.5">Across all completed jobs</div>
        </div>
      </div>

      {/* Grid: Active Dispatches + Quick Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Active Bookings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Current & Recent Machinery Bookings</span>
            </h3>
            <button
              onClick={() => setActiveTab('bookings')}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              View all ({userBookings.length}) →
            </button>
          </div>

          <div className="space-y-3">
            {userBookings.slice(0, 3).map(b => (
              <div
                key={b.id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img src={b.vehicleImage} alt={b.vehicleName} className="w-16 h-12 rounded-lg object-cover" />
                  <div>
                    <div className="font-bold text-white text-sm">{b.vehicleName}</div>
                    <div className="text-xs text-neutral-400 font-mono">
                      ID: {b.id} · {b.materialType} ({b.quantity})
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Destination: {b.destination}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-amber-400">₹{b.totalAmount.toLocaleString()}</div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-950 text-neutral-300 border border-neutral-800">
                      {b.status}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Action Cards & Projects preview */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Active Site Projects</h3>

          <div className="space-y-3">
            {projects.slice(0, 2).map(proj => (
              <div key={proj.id} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-sm">{proj.name}</h4>
                    <p className="text-xs text-neutral-400">{proj.location}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded">
                    {proj.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 font-mono">
                  <div className="bg-neutral-950 p-2 rounded-lg">
                    <span className="text-neutral-500 text-[10px] block font-sans">Today's Trips</span>
                    <span className="font-bold text-white">{proj.todayTrips} Loads</span>
                  </div>
                  <div className="bg-neutral-950 p-2 rounded-lg">
                    <span className="text-neutral-500 text-[10px] block font-sans">Materials</span>
                    <span className="font-bold text-emerald-400">{proj.materialsMovedTons} Tons</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('projects')}
            className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Open Project Operations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
