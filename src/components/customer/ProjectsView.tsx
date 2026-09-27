import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, VehicleType } from '../../types';
import { 
  Building2, 
  Plus, 
  Truck, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  CheckCircle2, 
  X, 
  ArrowRight,
  Gauge,
  Wallet
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const { projects, createProject, setActiveTab } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // New project state
  const [projectName, setProjectName] = useState('');
  const [projectLocation, setProjectLocation] = useState('Vijayawada');
  const [durationDays, setDurationDays] = useState(60);
  const [budget, setBudget] = useState(350000);
  const [notes, setNotes] = useState('');
  const [tractorCount, setTractorCount] = useState(2);
  const [truckCount, setTruckCount] = useState(1);
  const [miniTruckCount, setMiniTruckCount] = useState(1);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    createProject({
      name: projectName,
      location: projectLocation,
      durationDays,
      estimatedBudget: budget,
      notes,
      fleetAllocations: [
        { type: 'Heavy Duty Tractor', count: tractorCount },
        { type: 'Heavy Tipper Truck', count: truckCount },
        { type: 'Mini Truck Carrier', count: miniTruckCount }
      ]
    });

    setIsCreateModalOpen(false);
    setProjectName('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Title & Add Project */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800 mb-8">
        <div>
          <div className="text-xs font-bold text-amber-400 tracking-wider">ENTERPRISE PROJECT MODE</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Active Jobsite Projects</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Group long-term site logistics, multiple vehicle fleet allocations, daily trips, and cumulative material tonnage.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-md shadow-amber-500/20 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Construction Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="space-y-8">
        {projects.map(proj => {
          const budgetPercent = Math.min(100, Math.round((proj.spentAmount / (proj.estimatedBudget || 1)) * 100));

          return (
            <div
              key={proj.id}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-6"
            >
              {/* Project Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">{proj.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {proj.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      {proj.location}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      Duration: {proj.durationDays} Days (Started {proj.startDate})
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('vehicles')}
                  className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl text-xs transition-colors self-start sm:self-auto flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Assign Additional Machine</span>
                </button>
              </div>

              {/* KPI Stat Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                {/* Vehicles Booked */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="text-[11px] text-neutral-400 mb-1 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-500" />
                    <span>Vehicles Booked</span>
                  </div>
                  <div className="text-2xl font-black text-white font-mono tabular-nums">
                    {proj.fleetAllocations.reduce((acc, curr) => acc + curr.count, 0)} Units
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">
                    {proj.bookedVehicleIds.length} on active deployment
                  </div>
                </div>

                {/* Today's Trips */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="text-[11px] text-neutral-400 mb-1 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Today's Trips</span>
                  </div>
                  <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums">
                    {proj.todayTrips} Round Trips
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">Live site telemetry</div>
                </div>

                {/* Materials Moved */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="text-[11px] text-neutral-400 mb-1 flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-amber-500" />
                    <span>Materials Moved</span>
                  </div>
                  <div className="text-2xl font-black text-white font-mono tabular-nums">
                    {proj.materialsMovedTons} Tons
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">Aggregate, sand & soil</div>
                </div>

                {/* Estimated Spending */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                  <div className="text-[11px] text-neutral-400 mb-1 flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-sky-400" />
                    <span>Estimated Spending</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono tabular-nums">
                    ₹{proj.spentAmount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">
                    of ₹{proj.estimatedBudget.toLocaleString()} ({budgetPercent}%)
                  </div>
                </div>

              </div>

              {/* Fleet Allocation Breakdown */}
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                <div className="text-xs font-semibold text-neutral-300 mb-2.5">
                  Allocated Machine Fleet:
                </div>
                <div className="flex flex-wrap gap-2">
                  {proj.fleetAllocations.map((alloc, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white font-medium flex items-center gap-2"
                    >
                      <Truck className="w-3.5 h-3.5 text-amber-400" />
                      <span>{alloc.type}</span>
                      <span className="font-mono text-amber-400 font-bold">× {alloc.count}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Supervisor Notes */}
              {proj.notes && (
                <div className="text-xs text-neutral-400 bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/80">
                  <strong className="text-neutral-300">Site Log: </strong>
                  {proj.notes}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* CREATE PROJECT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-neutral-100">
            
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-neutral-800 pb-3 mb-5">
              <div className="text-xs font-bold text-amber-400 tracking-wider">PROJECT CREATION</div>
              <h2 className="text-xl font-bold text-white">Create Construction Site Project</h2>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vijayawada House Construction"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Site Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Benz Circle, Vijayawada"
                    value={projectLocation}
                    onChange={e => setProjectLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min={7}
                    max={365}
                    value={durationDays}
                    onChange={e => setDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* Fleet allocation counts */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2.5">
                <div className="text-xs font-bold text-neutral-200">Required Fleet Vehicles:</div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Tractor with Hydraulic Trailer</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTractorCount(Math.max(0, tractorCount - 1))}
                      className="w-6 h-6 bg-neutral-800 rounded text-center leading-none text-white font-bold"
                    >-</button>
                    <span className="w-5 text-center font-mono font-bold text-white">{tractorCount}</span>
                    <button
                      type="button"
                      onClick={() => setTractorCount(tractorCount + 1)}
                      className="w-6 h-6 bg-neutral-800 rounded text-center leading-none text-white font-bold"
                    >+</button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Heavy Tipper Truck (10-16 Ton)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTruckCount(Math.max(0, truckCount - 1))}
                      className="w-6 h-6 bg-neutral-800 rounded text-center leading-none text-white font-bold"
                    >-</button>
                    <span className="w-5 text-center font-mono font-bold text-white">{truckCount}</span>
                    <button
                      type="button"
                      onClick={() => setTruckCount(truckCount + 1)}
                      className="w-6 h-6 bg-neutral-800 rounded text-center leading-none text-white font-bold"
                    >+</button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Mini Truck Carrier (Tata Ace)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMiniTruckCount(Math.max(0, miniTruckCount - 1))}
                      className="w-6 h-6 bg-neutral-800 rounded text-center leading-none text-white font-bold"
                    >-</button>
                    <span className="w-5 text-center font-mono font-bold text-white">{miniTruckCount}</span>
                    <button
                      type="button"
                      onClick={() => setMiniTruckCount(miniTruckCount + 1)}
                      className="w-6 h-6 bg-neutral-800 rounded text-center leading-none text-white font-bold"
                    >+</button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Estimated Budget (₹)</label>
                <input
                  type="number"
                  step={10000}
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Supervisor Notes / Site Scope</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Ground leveling, foundation excavation, and brick carting..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors shadow-md shadow-amber-500/20"
                >
                  Launch Project
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
