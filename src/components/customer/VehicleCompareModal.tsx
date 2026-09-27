import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Star, MapPin, Check, Minus, Truck } from 'lucide-react';

export const VehicleCompareModal: React.FC = () => {
  const { 
    isCompareModalOpen, 
    setIsCompareModalOpen, 
    compareVehicleIds, 
    vehicles, 
    removeFromCompare, 
    startBookingFlow
  } = useApp();

  if (!isCompareModalOpen) return null;

  const comparedVehicles = vehicles.filter(v => compareVehicleIds.includes(v.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-neutral-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
          <div>
            <div className="text-xs font-bold text-amber-400 tracking-wider">SIDE-BY-SIDE MATRIX</div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Compare Equipment Fleet</h2>
          </div>
          <button
            onClick={() => setIsCompareModalOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {comparedVehicles.length === 0 ? (
          <div className="text-center py-12 text-neutral-400">
            No vehicles selected for comparison. Add vehicles from the Find Vehicles catalog.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="p-3 text-neutral-400 font-medium w-40">Attribute</th>
                  {comparedVehicles.map(v => (
                    <th key={v.id} className="p-3 min-w-[200px] text-white">
                      <div className="relative mb-2">
                        <img
                          src={v.image}
                          alt={v.name}
                          className="w-full h-28 object-cover rounded-xl border border-neutral-800"
                        />
                        <button
                          onClick={() => removeFromCompare(v.id)}
                          className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-rose-600 rounded-md text-white transition-colors"
                          title="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="font-bold text-sm text-white truncate">{v.name}</div>
                      <div className="text-[11px] text-neutral-400 truncate">{v.type}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-normal">
                
                {/* Price / Day */}
                <tr>
                  <td className="p-3 font-semibold text-neutral-300">Price per Day</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3 font-mono font-bold text-sm text-amber-400 tabular-nums">
                      ₹{v.pricePerDay.toLocaleString()}
                    </td>
                  ))}
                </tr>

                {/* Rated Capacity */}
                <tr>
                  <td className="p-3 font-semibold text-neutral-300">Rated Payload Capacity</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3 font-bold text-white font-mono">
                      {v.capacityDisplay} ({v.capacityTons}T)
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr>
                  <td className="p-3 font-semibold text-neutral-300">Machine Rating</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3">
                      <div className="flex items-center gap-1 font-bold text-white">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{v.rating}</span>
                        <span className="text-neutral-400 font-normal">({v.reviewCount} reviews)</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Distance & Location */}
                <tr>
                  <td className="p-3 font-semibold text-neutral-300">Location & Distance</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3 text-neutral-300">
                      <div>{v.location}</div>
                      <div className="text-[10px] text-amber-400 font-mono">{v.distanceKm} km to site</div>
                    </td>
                  ))}
                </tr>

                {/* Driver Availability */}
                <tr>
                  <td className="p-3 font-semibold text-neutral-300">Driver Availability</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3">
                      {v.driverAvailable ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Available (+₹{v.driverFeePerDay}/d)
                        </span>
                      ) : (
                        <span className="text-neutral-500 flex items-center gap-1">
                          <Minus className="w-3.5 h-3.5" /> Self-drive only
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Owner Rating */}
                <tr>
                  <td className="p-3 font-semibold text-neutral-300">Fleet Owner</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3 text-neutral-300">
                      <div className="font-medium text-white">{v.ownerName}</div>
                      <div className="text-[11px] text-neutral-400">★ {v.ownerRating} Owner Trust Score</div>
                    </td>
                  ))}
                </tr>

                {/* Engine Power */}
                <tr>
                  <td className="p-3 font-semibold text-neutral-300">Power & Fuel</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3 text-neutral-300 font-mono">
                      {v.specs.enginePower} · {v.specs.fuelType}
                    </td>
                  ))}
                </tr>

                {/* Bed Dimensions */}
                <tr>
                  <td className="p-3 font-semibold text-neutral-300">Bed Dimensions</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3 text-neutral-300 font-mono">
                      {v.specs.bedDimensions}
                    </td>
                  ))}
                </tr>

                {/* Action CTA */}
                <tr>
                  <td className="p-3 font-semibold text-neutral-300">Action</td>
                  {comparedVehicles.map(v => (
                    <td key={v.id} className="p-3">
                      <button
                        onClick={() => {
                          setIsCompareModalOpen(false);
                          startBookingFlow(v);
                        }}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors"
                      >
                        Book Machine
                      </button>
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};
