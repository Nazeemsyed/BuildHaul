import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Vehicle, VehicleType } from '../../types';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  UserCheck, 
  Truck, 
  SlidersHorizontal, 
  Layers, 
  Map as MapIcon, 
  Grid, 
  Check, 
  ArrowUpDown,
  Navigation,
  Sparkles
} from 'lucide-react';

export const VehicleMarketplace: React.FC = () => {
  const { 
    vehicles, 
    setSelectedVehicleForDetails, 
    startBookingFlow,
    toggleCompare,
    compareVehicleIds,
    heroSearchFilters,
    setActiveTab
  } = useApp();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>(heroSearchFilters?.type || 'All');
  const [selectedLocation, setSelectedLocation] = useState<string>(heroSearchFilters?.location || 'All');
  const [maxPrice, setMaxPrice] = useState<number>(8000);
  const [minCapacity, setMinCapacity] = useState<number>(0);
  const [requireDriver, setRequireDriver] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'distance' | 'priceAsc' | 'priceDesc' | 'rating'>('distance');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedMapVehicle, setSelectedMapVehicle] = useState<Vehicle | null>(null);

  // Filter logic
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      // Type
      if (selectedType !== 'All' && v.type !== selectedType) return false;
      
      // Location
      if (selectedLocation !== 'All' && !v.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      
      // Price
      if (v.pricePerDay > maxPrice) return false;
      
      // Capacity
      if (v.capacityTons < minCapacity) return false;
      
      // Driver
      if (requireDriver && !v.driverAvailable) return false;
      
      // Rating
      if (v.rating < minRating) return false;
      
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = v.name.toLowerCase().includes(q);
        const matchType = v.type.toLowerCase().includes(q);
        const matchLoc = v.location.toLowerCase().includes(q);
        const matchReg = v.regNumber.toLowerCase().includes(q);
        if (!matchName && !matchType && !matchLoc && !matchReg) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      if (sortBy === 'priceAsc') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'priceDesc') return b.pricePerDay - a.pricePerDay;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [vehicles, selectedType, selectedLocation, maxPrice, minCapacity, requireDriver, minRating, searchQuery, sortBy]);

  const vehicleTypes: string[] = [
    'All',
    'Heavy Tipper Truck',
    'Heavy Duty Tractor',
    'Mini Truck Carrier',
    'Wheel Loader'
  ];

  const locations: string[] = [
    'All',
    'Vijayawada',
    'Auto Nagar',
    'Gollapudi',
    'Gannavaram',
    'Mangalagiri',
    'Amaravati',
    'Guntur'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Title & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
            <span>HEAVY FLEET DIRECTORY</span>
            <span aria-hidden="true">·</span>
            <span>{filteredVehicles.length} MACHINES AVAILABLE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Find Construction Vehicles
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Verified equipment with direct fleet owner booking and GPS proximity dispatch.
          </p>
        </div>

        {/* View Controls & Sort */}
        <div className="flex items-center gap-2.5">
          {/* Segmented Grid / Map Toggle */}
          <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                viewMode === 'map' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Live Radar Map</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-amber-500 appearance-none font-medium"
            >
              <option value="distance">Sort: Nearest Distance</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-2.5 w-3 h-3 text-neutral-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Layout: Filters Column + Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* FILTERS SIDEBAR */}
        <div className="lg:col-span-1 space-y-6 bg-neutral-900/60 border border-neutral-800 p-5 rounded-2xl h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              <span>Filters</span>
            </div>
            {(selectedType !== 'All' || selectedLocation !== 'All' || requireDriver || minCapacity > 0) && (
              <button
                onClick={() => {
                  setSelectedType('All');
                  setSelectedLocation('All');
                  setMaxPrice(8000);
                  setMinCapacity(0);
                  setRequireDriver(false);
                  setMinRating(0);
                  setSearchQuery('');
                }}
                className="text-[11px] text-amber-400 hover:underline"
              >
                Reset all
              </button>
            )}
          </div>

          {/* Search Query */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Search Vehicle or RC
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. BharatBenz, AP 16..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-500" />
            </div>
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Vehicle Category
            </label>
            <div className="space-y-1">
              {vehicleTypes.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedType === t 
                      ? 'bg-amber-500/10 text-amber-400 font-semibold' 
                      : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-white'
                  }`}
                >
                  <span>{t}</span>
                  {selectedType === t && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Location Hub */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Operational Zone / City
            </label>
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>
                  {loc === 'All' ? 'All Operating Locations' : loc}
                </option>
              ))}
            </select>
          </div>

          {/* Load Capacity Filter */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-300 mb-1.5">
              <span>Minimum Capacity</span>
              <span className="text-amber-400 font-mono">{minCapacity > 0 ? `${minCapacity} Ton` : 'Any'}</span>
            </div>
            <input
              type="range"
              min={0}
              max={16}
              step={1}
              value={minCapacity}
              onChange={e => setMinCapacity(Number(e.target.value))}
              className="w-full accent-amber-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1 font-mono">
              <span>0 Ton</span>
              <span>8 Ton</span>
              <span>16 Ton</span>
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-300 mb-1.5">
              <span>Max Day Rate</span>
              <span className="text-amber-400 font-mono">₹{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={10000}
              step={500}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-500 bg-neutral-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1 font-mono">
              <span>₹1,000</span>
              <span>₹10,000</span>
            </div>
          </div>

          {/* Driver Toggle */}
          <div className="pt-2 border-t border-neutral-800">
            <label className="flex items-center justify-between cursor-pointer select-none">
              <span className="text-xs font-semibold text-neutral-300">Driver Required Only</span>
              <input
                type="checkbox"
                checked={requireDriver}
                onChange={e => setRequireDriver(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-amber-500 focus:ring-0"
              />
            </label>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Minimum Rating
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[0, 4.5, 4.8].map(r => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`py-1.5 text-xs rounded-lg border transition-colors ${
                    minRating === r
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {r === 0 ? 'All' : `${r}★+`}
                </button>
              ))}
            </div>
          </div>

          {/* AI Banner Shortcut */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Sizing</span>
            </div>
            <p className="text-neutral-400 text-[11px] mb-2 leading-relaxed">
              Describe your material & excavation scope to get payload calculations.
            </p>
            <button
              onClick={() => setActiveTab('ai-finder')}
              className="text-amber-400 hover:underline text-[11px] font-bold"
            >
              Open AI Recommender →
            </button>
          </div>

        </div>

        {/* RESULTS GRID / MAP VIEW */}
        <div className="lg:col-span-3">
          
          {/* MAP VIEW */}
          {viewMode === 'map' && (
            <div className="mb-8 space-y-4">
              <div className="relative h-96 w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 p-4">
                
                {/* SVG Stylized Radar Map Background */}
                <div className="absolute inset-0 bg-neutral-950">
                  <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f59e0b" strokeWidth="0.5" strokeOpacity="0.3"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                    {/* Simulated River Krishna & Bypass arterials */}
                    <path d="M 0 120 Q 200 160 450 140 T 900 240" fill="none" stroke="#38bdf8" strokeWidth="3" opacity="0.4" />
                    <path d="M 80 0 L 160 400" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
                    <path d="M 300 0 L 350 400" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
                    <circle cx="280" cy="180" r="140" fill="none" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
                  </svg>
                </div>

                {/* Map Overlay Badge */}
                <div className="absolute top-4 left-4 z-10 bg-neutral-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-800 text-xs flex items-center gap-2">
                  <Navigation className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  <span className="font-semibold text-white">Vijayawada & Amaravati Fleet Zone</span>
                  <span className="text-neutral-400">· Real-time Proximity</span>
                </div>

                {/* Plotted Vehicle Pin Markers */}
                <div className="absolute inset-0 p-8 flex items-center justify-center">
                  {filteredVehicles.map((veh, idx) => {
                    const isSelected = selectedMapVehicle?.id === veh.id;
                    // Distribute mock coordinates visually
                    const positions = [
                      { top: '35%', left: '42%' },
                      { top: '48%', left: '28%' },
                      { top: '25%', left: '72%' },
                      { top: '65%', left: '48%' },
                      { top: '75%', left: '22%' },
                      { top: '40%', left: '55%' },
                    ];
                    const pos = positions[idx % positions.length];

                    return (
                      <div
                        key={veh.id}
                        style={{ top: pos.top, left: pos.left }}
                        onClick={() => setSelectedMapVehicle(veh)}
                        className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group z-20"
                      >
                        <div className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 shadow-xl ${
                          isSelected 
                            ? 'bg-amber-500 text-neutral-950 font-bold border-white scale-110 ring-4 ring-amber-500/30' 
                            : 'bg-neutral-900/90 text-white border-neutral-700 hover:border-amber-500 hover:scale-105'
                        }`}>
                          <Truck className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-300" />
                          <span className="text-[11px] whitespace-nowrap font-mono">
                            ₹{veh.pricePerDay}/d
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Map Selected Vehicle Card Popup */}
                {selectedMapVehicle && (
                  <div className="absolute bottom-4 left-4 right-4 z-30 max-w-sm bg-neutral-900 border border-neutral-700 rounded-xl p-3 shadow-2xl flex items-center gap-3">
                    <img
                      src={selectedMapVehicle.image}
                      alt={selectedMapVehicle.name}
                      className="w-16 h-14 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{selectedMapVehicle.name}</h4>
                      <p className="text-[11px] text-neutral-400">{selectedMapVehicle.capacityDisplay} · {selectedMapVehicle.location}</p>
                      <div className="text-xs font-bold text-amber-400 font-mono">₹{selectedMapVehicle.pricePerDay}/day</div>
                    </div>
                    <button
                      onClick={() => setSelectedVehicleForDetails(selectedMapVehicle)}
                      className="px-2.5 py-1.5 bg-amber-500 text-neutral-950 text-xs font-bold rounded-lg hover:bg-amber-400"
                    >
                      Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* GRID OF VEHICLES */}
          {filteredVehicles.length === 0 ? (
            <div className="p-12 text-center bg-neutral-900/40 border border-neutral-800 rounded-2xl space-y-3">
              <Truck className="w-10 h-10 text-neutral-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No vehicles match your active criteria</h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Try widening your price range, clearing capacity constraints, or searching another neighboring zone.
              </p>
              <button
                onClick={() => {
                  setSelectedType('All');
                  setSelectedLocation('All');
                  setMaxPrice(8000);
                  setMinCapacity(0);
                  setRequireDriver(false);
                  setMinRating(0);
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white rounded-xl transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredVehicles.map(veh => {
                const isCompared = compareVehicleIds.includes(veh.id);

                return (
                  <div
                    key={veh.id}
                    className="group bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between"
                  >
                    
                    {/* Top: Image & Header badges */}
                    <div>
                      <div className="relative h-48 w-full bg-neutral-950 overflow-hidden">
                        <img
                          src={veh.image}
                          alt={veh.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Type badge */}
                        <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-amber-400 border border-neutral-800">
                          {veh.type}
                        </div>

                        {/* Availability Pill */}
                        <div className="absolute top-3 right-3 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{veh.availabilityStatus}</span>
                        </div>

                        {/* Compare Quick Toggle Checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleCompare(veh.id)}
                          className={`absolute bottom-3 left-3 px-2 py-1 rounded-md text-[11px] font-medium backdrop-blur-md border transition-colors flex items-center gap-1.5 ${
                            isCompared
                              ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold'
                              : 'bg-neutral-950/80 text-neutral-300 border-neutral-800 hover:text-white'
                          }`}
                        >
                          <Layers className="w-3 h-3" />
                          <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                        </button>

                        {/* Distance Badge */}
                        <div className="absolute bottom-3 right-3 bg-neutral-950/80 backdrop-blur-md px-2 py-1 rounded-md text-[11px] font-mono text-neutral-300 border border-neutral-800 flex items-center gap-1">
                          <Navigation className="w-3 h-3 text-amber-500" />
                          <span>{veh.distanceKm} km</span>
                        </div>
                      </div>

                      {/* Content body */}
                      <div className="p-4 sm:p-5 space-y-3">
                        
                        {/* Title and Rating */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                              {veh.name}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-neutral-400 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="truncate">{veh.location}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 px-2 py-1 bg-neutral-950 border border-neutral-800 rounded-md shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-white font-mono">{veh.rating}</span>
                          </div>
                        </div>

                        {/* Specs Strip */}
                        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                          <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800/80">
                            <span className="text-[10px] text-neutral-500 block">Payload</span>
                            <span className="font-semibold text-neutral-200 font-mono">{veh.capacityDisplay}</span>
                          </div>
                          
                          <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800/80">
                            <span className="text-[10px] text-neutral-500 block">Driver</span>
                            <span className="font-semibold text-emerald-400 flex items-center gap-1">
                              <UserCheck className="w-3 h-3" />
                              {veh.driverAvailable ? 'Available' : 'Self-drive'}
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Bottom: Price and Actions */}
                    <div className="p-4 sm:p-5 pt-0 border-t border-neutral-800/60 mt-2">
                      <div className="flex items-center justify-between pt-3">
                        <div>
                          <div className="text-xl font-extrabold text-amber-400 font-mono tabular-nums">
                            ₹{veh.pricePerDay.toLocaleString()}
                            <span className="text-xs text-neutral-400 font-normal">/day</span>
                          </div>
                          <div className="text-[10px] text-neutral-500">
                            Driver: +₹{veh.driverFeePerDay}/d
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedVehicleForDetails(veh)}
                            className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl transition-colors"
                          >
                            View Details
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => startBookingFlow(veh)}
                            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl transition-colors shadow-sm"
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
