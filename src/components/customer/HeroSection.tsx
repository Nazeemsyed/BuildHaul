import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HERO_IMAGE, POPULAR_LOCATIONS } from '../../data/mockData';
import { 
  Search, 
  MapPin, 
  Truck, 
  Calendar, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { VehicleType } from '../../types';

export const HeroSection: React.FC = () => {
  const { 
    setActiveTab, 
    setHeroSearchFilters, 
    currentUser, 
    setIsAuthModalOpen, 
    setAuthModalMode 
  } = useApp();

  const [location, setLocation] = useState('Vijayawada');
  const [vehicleType, setVehicleType] = useState<string>('All');
  const [date, setDate] = useState('2026-09-28');
  const [duration, setDuration] = useState('1');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHeroSearchFilters({
      location: location === 'All' ? undefined : location,
      type: vehicleType === 'All' ? undefined : vehicleType,
      date,
      duration
    });
    setActiveTab('vehicles');
  };

  const vehicleTypes: { label: string; value: string }[] = [
    { label: 'All Equipment Types', value: 'All' },
    { label: 'Heavy Tipper Truck (10-16 Ton)', value: 'Heavy Tipper Truck' },
    { label: 'Heavy Duty Tractor & Trolley', value: 'Heavy Duty Tractor' },
    { label: 'Mini Truck Carrier (Ace/Pick-up)', value: 'Mini Truck Carrier' },
    { label: 'Wheel Loader & Scoop', value: 'Wheel Loader' },
    { label: 'Hydraulic Excavator', value: 'Hydraulic Excavator' },
    { label: 'Open-Top 4-Wheeler', value: 'Open-Top 4-Wheeler' }
  ];

  return (
    <div className="relative overflow-hidden bg-neutral-950 border-b border-neutral-800">
      
      {/* Background Hero Image with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="BuildHaul Construction Fleet Depot"
          className="w-full h-full object-cover object-center opacity-40 brightness-75 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/40" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-neutral-950/50 to-neutral-950" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
        
        {/* Editorial Pill-Free Tagline & Headline */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-400">
            <span>THE RIGHT MACHINE</span>
            <span aria-hidden="true">·</span>
            <span>THE RIGHT SITE</span>
            <span aria-hidden="true">·</span>
            <span>THE RIGHT TIME</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] text-balance">
            Need a vehicle for your construction site?
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 font-normal max-w-2xl leading-relaxed">
            Find the right truck, tractor, or construction vehicle near you. Verified commercial fleets, transparent day rates, and verified machine operators on demand.
          </p>

          {!currentUser && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
              >
                <span>Get Started / Sign Up</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-white font-medium text-xs sm:text-sm transition-all cursor-pointer"
              >
                Sign In
              </button>
              <span className="text-xs text-neutral-400 hidden sm:inline">
                ⚡ Real-time machinery bookings & verified fleets
              </span>
            </div>
          )}
        </div>

        {/* Large Search Component */}
        <div className="mt-10 max-w-5xl bg-neutral-900/90 backdrop-blur-md border border-neutral-800 p-4 sm:p-5 rounded-2xl shadow-2xl">
          <form onSubmit={handleSearchSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              
              {/* Location Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  Site Location
                </label>
                <select
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Vijayawada">Vijayawada (All Hubs)</option>
                  <option value="Vijayawada Auto Nagar">Vijayawada - Auto Nagar</option>
                  <option value="Vijayawada - Gollapudi">Vijayawada - Gollapudi</option>
                  <option value="Gannavaram Airport Road">Gannavaram Airport Road</option>
                  <option value="Mangalagiri Industrial Zone">Mangalagiri Industrial Zone</option>
                  <option value="Amaravati Capital Region">Amaravati Capital Region</option>
                  <option value="Guntur Ring Road">Guntur Ring Road</option>
                </select>
              </div>

              {/* Vehicle Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-500" />
                  Vehicle Type
                </label>
                <select
                  value={vehicleType}
                  onChange={e => setVehicleType(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  {vehicleTypes.map(vt => (
                    <option key={vt.value} value={vt.value}>
                      {vt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  Required Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Duration & Submit */}
              <div className="space-y-1.5 flex flex-col justify-end">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5 mb-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      Duration
                    </label>
                    <select
                      value={duration}
                      onChange={e => setDuration(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="1">1 Day</option>
                      <option value="2">2 Days</option>
                      <option value="3">3 Days</option>
                      <option value="7">1 Week</option>
                      <option value="30">1 Month</option>
                    </select>
                  </div>
                  
                  <button
                    type="submit"
                    className="mt-6 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 whitespace-nowrap"
                  >
                    <Search className="w-4 h-4" />
                    <span>Find Vehicles</span>
                  </button>
                </div>
              </div>

            </div>
          </form>

          {/* Quick AI recommendation shortcut banner */}
          <div className="mt-4 pt-3.5 border-t border-neutral-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Not sure what capacity you need? Tell our AI the site job details.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('ai-finder')}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 group"
            >
              <span>Try AI Vehicle Finder</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Statistics Bar - Exact requirements: 500+ Vehicles, 120+ Owners, 25+ Areas */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl border-t border-neutral-800/80 pt-8">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              500+
            </div>
            <div className="text-xs text-neutral-400 mt-1">Verified Vehicles</div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              120+
            </div>
            <div className="text-xs text-neutral-400 mt-1">Fleet Owners</div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              25+
            </div>
            <div className="text-xs text-neutral-400 mt-1">Active Urban & Industrial Areas</div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
              99.2%
            </div>
            <div className="text-xs text-neutral-400 mt-1">On-Time Site Dispatch</div>
          </div>
        </div>

      </div>
    </div>
  );
};
