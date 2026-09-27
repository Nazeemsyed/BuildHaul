import React from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, X, ArrowRight } from 'lucide-react';

export const VehicleCompareBar: React.FC = () => {
  const { compareVehicleIds, vehicles, removeFromCompare, clearCompare, setIsCompareModalOpen } = useApp();

  if (compareVehicleIds.length === 0) return null;

  const comparedVehicles = vehicles.filter(v => compareVehicleIds.includes(v.id));

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-40 w-11/12 max-w-2xl bg-neutral-900/95 backdrop-blur-md border border-neutral-700 rounded-2xl p-3 shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-center justify-between gap-3">
        
        {/* Left: Indicator & Thumbnails */}
        <div className="flex items-center gap-3 overflow-x-auto py-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 pl-1 shrink-0">
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Compare</span>
            <span>({comparedVehicles.length}/4)</span>
          </div>

          <div className="flex items-center gap-2">
            {comparedVehicles.map(v => (
              <div
                key={v.id}
                className="relative group w-12 h-10 rounded-lg overflow-hidden border border-neutral-700 shrink-0 bg-neutral-950"
              >
                <img
                  src={v.image}
                  alt={v.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeFromCompare(v.id)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5 text-rose-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="text-xs text-neutral-400 hover:text-white px-2 py-1 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
