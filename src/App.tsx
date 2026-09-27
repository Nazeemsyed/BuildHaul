import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/customer/HeroSection';
import { VehicleMarketplace } from './components/customer/VehicleMarketplace';
import { AiVehicleFinder } from './components/customer/AiVehicleFinder';
import { ProjectsView } from './components/customer/ProjectsView';
import { MyBookingsView } from './components/customer/MyBookingsView';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { OwnerDashboard } from './components/owner/OwnerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { VehicleDetailsModal } from './components/customer/VehicleDetailsModal';
import { VehicleCompareBar } from './components/customer/VehicleCompareBar';
import { VehicleCompareModal } from './components/customer/VehicleCompareModal';
import { BookingModal } from './components/booking/BookingModal';
import { PaymentModal } from './components/booking/PaymentModal';
import { ReviewModal } from './components/customer/ReviewModal';
import { AddVehicleModal } from './components/owner/AddVehicleModal';
import { OwnerVerificationModal } from './components/owner/OwnerVerificationModal';
import { UserProfileModal } from './components/profile/UserProfileModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { 
  Truck, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Users, 
  Gauge, 
  CheckCircle2, 
  ChevronRight,
  Headphones
} from 'lucide-react';
import { TRACTOR_IMAGE, TRUCK_IMAGE, MINI_TRUCK_IMAGE, LOADER_IMAGE } from './data/mockData';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, userRole } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
      <Navbar />

      <main className="flex-1">
        {/* HOME VIEW */}
        {activeTab === 'home' && (
          <div>
            <HeroSection />

            {/* Popular Vehicle Categories Bento Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-b border-neutral-800">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
                    <span>EXPLORE CATEGORIES</span>
                    <span aria-hidden="true">·</span>
                    <span>STANDARDIZED DAY RATES</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Machinery for Every Construction Stage
                  </h2>
                </div>

                <button
                  onClick={() => setActiveTab('vehicles')}
                  className="text-amber-400 hover:text-amber-300 font-semibold text-xs sm:text-sm flex items-center gap-1 group self-start sm:self-auto"
                >
                  <span>View All 500+ Vehicles</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                {/* 1. Heavy Tipper Trucks */}
                <div
                  onClick={() => setActiveTab('vehicles')}
                  className="group relative cursor-pointer bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-2xl overflow-hidden p-4 flex flex-col justify-between transition-all duration-200"
                >
                  <div className="h-44 w-full rounded-xl overflow-hidden bg-neutral-950 mb-3">
                    <img
                      src={TRUCK_IMAGE}
                      alt="Heavy Tipper Trucks"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      Heavy Tipper Trucks
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                      10 to 16 Ton hydraulic tippers for sand, blue metal gravel & muck hauling.
                    </p>
                    <div className="text-xs font-mono font-bold text-amber-400 mt-2">
                      From ₹4,500/day
                    </div>
                  </div>
                </div>

                {/* 2. Tractors & Trailers */}
                <div
                  onClick={() => setActiveTab('vehicles')}
                  className="group relative cursor-pointer bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-2xl overflow-hidden p-4 flex flex-col justify-between transition-all duration-200"
                >
                  <div className="h-44 w-full rounded-xl overflow-hidden bg-neutral-950 mb-3">
                    <img
                      src={TRACTOR_IMAGE}
                      alt="Heavy Duty Tractors"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      Tractors & Hydraulic Trailers
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                      3 to 5 Ton capacity workhorses for brick delivery, soil leveling & rural approach sites.
                    </p>
                    <div className="text-xs font-mono font-bold text-amber-400 mt-2">
                      From ₹1,800/day
                    </div>
                  </div>
                </div>

                {/* 3. Mini Trucks */}
                <div
                  onClick={() => setActiveTab('vehicles')}
                  className="group relative cursor-pointer bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-2xl overflow-hidden p-4 flex flex-col justify-between transition-all duration-200"
                >
                  <div className="h-44 w-full rounded-xl overflow-hidden bg-neutral-950 mb-3">
                    <img
                      src={MINI_TRUCK_IMAGE}
                      alt="Mini Truck Carriers"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      Mini Trucks (Tata Ace)
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                      Urban agile 4-wheelers for cement bags, electrical fittings & tight street access.
                    </p>
                    <div className="text-xs font-mono font-bold text-amber-400 mt-2">
                      From ₹1,200/day
                    </div>
                  </div>
                </div>

                {/* 4. Wheel Loaders */}
                <div
                  onClick={() => setActiveTab('vehicles')}
                  className="group relative cursor-pointer bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 rounded-2xl overflow-hidden p-4 flex flex-col justify-between transition-all duration-200"
                >
                  <div className="h-44 w-full rounded-xl overflow-hidden bg-neutral-950 mb-3">
                    <img
                      src={LOADER_IMAGE}
                      alt="Wheel Loaders & Earthmovers"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      Wheel Loaders & Excavators
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                      High-breakout loaders for fast stockpile transfer, trench backfilling & site grading.
                    </p>
                    <div className="text-xs font-mono font-bold text-amber-400 mt-2">
                      From ₹6,500/day
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* AI Sizing Highlight Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-b border-neutral-800">
              <div className="relative rounded-3xl bg-neutral-900 border border-neutral-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Machine Finder</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    "I need to move 5 tons of sand from Vijayawada to Gannavaram."
                  </h2>

                  <p className="text-sm text-neutral-300 leading-relaxed">
                    Don't guess machine tonnages. Our intelligent site calculator analyzes material densities, route restrictions, axle load limits, and matches you with verified fleet operators within seconds.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => setActiveTab('ai-finder')}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
                    >
                      <span>Try AI Vehicle Sizer</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Why Contractors Choose BuildHaul */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
              <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
                <div className="text-xs font-bold text-amber-400 tracking-wider">PLATFORM STANDARDS</div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Engineered for Active Jobsites</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">100% Commercial RC & DL Verified</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Every truck, tractor, and loader undergoes Vahan registration verification, fitness certificate audits, and commercial driver background checks.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Guaranteed Punctual Dispatch</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Vehicles depart with live GPS telemetry. If a machine encounters a mechanical delay, our emergency fleet network deploys a replacement within 90 minutes.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Dedicated Site Escrow Protection</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Rental payments remain safely locked in escrow until the machine arrives and passes site inspection by your supervisor.
                  </p>
                </div>

              </div>
            </section>
          </div>
        )}

        {/* FIND VEHICLES VIEW */}
        {activeTab === 'vehicles' && <VehicleMarketplace />}

        {/* AI VEHICLE FINDER VIEW */}
        {activeTab === 'ai-finder' && <AiVehicleFinder />}

        {/* PROJECTS VIEW */}
        {activeTab === 'projects' && <ProjectsView />}

        {/* MY BOOKINGS VIEW */}
        {activeTab === 'bookings' && <MyBookingsView />}

        {/* DASHBOARD VIEW (Contextual) */}
        {activeTab === 'dashboard' && (
          userRole === 'owner' ? <OwnerDashboard /> :
          userRole === 'admin' ? <AdminDashboard /> :
          <CustomerDashboard />
        )}

        {/* ADMIN PANEL VIEW */}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Floating Compare Bar */}
      <VehicleCompareBar />

      {/* Modals */}
      <AuthModal />
      <VehicleDetailsModal />
      <VehicleCompareModal />
      <BookingModal />
      <PaymentModal />
      <ReviewModal />
      <AddVehicleModal />
      <OwnerVerificationModal />
      <UserProfileModal />
      <NotificationDrawer />

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
