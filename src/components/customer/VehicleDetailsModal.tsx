import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  UserCheck, 
  Fuel, 
  Gauge, 
  Maximize2, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Layers
} from 'lucide-react';

export const VehicleDetailsModal: React.FC = () => {
  const { 
    selectedVehicleForDetails, 
    setSelectedVehicleForDetails, 
    startBookingFlow,
    toggleCompare,
    compareVehicleIds
  } = useApp();

  if (!selectedVehicleForDetails) return null;

  const v = selectedVehicleForDetails;
  const isCompared = compareVehicleIds.includes(v.id);

  const handleBookNow = () => {
    setSelectedVehicleForDetails(null);
    startBookingFlow(v);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-neutral-100">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedVehicleForDetails(null)}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header & Hero Image */}
        <div className="space-y-4">
          <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
            <img
              src={v.image}
              alt={v.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-semibold text-amber-400 border border-neutral-800">
              {v.type}
            </div>
            <div className="absolute bottom-3 right-3 bg-neutral-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-800 text-xs font-mono font-bold text-white">
              RC: {v.regNumber}
            </div>
          </div>

          {/* Title and Rating Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{v.name}</h2>
              <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {v.rating} ({v.reviewCount} site reviews)
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  {v.location} ({v.distanceKm} km away)
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="text-left sm:text-right">
              <div className="text-2xl font-black text-amber-400 font-mono tabular-nums">
                ₹{v.pricePerDay.toLocaleString()}
                <span className="text-xs text-neutral-400 font-normal">/day</span>
              </div>
              <div className="text-[11px] text-neutral-400">
                Driver fee: ₹{v.driverFeePerDay}/day (optional)
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {v.description}
          </p>

          {/* Technical Specifications Grid */}
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wider mb-3">
              TECHNICAL SPECIFICATIONS & CAPACITY
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="text-neutral-400 text-[11px] flex items-center gap-1.5 mb-1">
                  <Gauge className="w-3.5 h-3.5 text-amber-500" />
                  Rated Capacity
                </div>
                <div className="text-sm font-bold text-white font-mono">{v.capacityDisplay}</div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="text-neutral-400 text-[11px] flex items-center gap-1.5 mb-1">
                  <Fuel className="w-3.5 h-3.5 text-amber-500" />
                  Engine & Fuel
                </div>
                <div className="text-sm font-bold text-white">{v.specs.enginePower} · {v.specs.fuelType}</div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="text-neutral-400 text-[11px] flex items-center gap-1.5 mb-1">
                  <Maximize2 className="w-3.5 h-3.5 text-amber-500" />
                  Cargo Dimensions
                </div>
                <div className="text-sm font-bold text-white">{v.specs.bedDimensions}</div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="text-neutral-400 text-[11px] flex items-center gap-1.5 mb-1">
                  <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                  Commercial Operator
                </div>
                <div className="text-sm font-bold text-emerald-400">
                  {v.driverAvailable ? 'Verified Driver Included' : 'Self-Operate Only'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="text-neutral-400 text-[11px] flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  Minimum Rental
                </div>
                <div className="text-sm font-bold text-white">{v.specs.minRentalDays} Day(s)</div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="text-neutral-400 text-[11px] flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  Compliance
                </div>
                <div className="text-sm font-bold text-white">FC & Insurance Active</div>
              </div>

            </div>
          </div>

          {/* Fleet Owner Card */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400">
                {v.ownerName.charAt(0)}
              </div>
              <div>
                <div className="text-xs text-neutral-400">Fleet Owner</div>
                <div className="text-sm font-bold text-white">{v.ownerName}</div>
                <div className="text-xs text-neutral-400 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{v.ownerRating} rating</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400">KYC Verified</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleCompare(v.id)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                  isCompared 
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400' 
                    : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isCompared ? 'In Compare' : 'Add to Compare'}</span>
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex items-center gap-3">
            <button
              onClick={() => setSelectedVehicleForDetails(null)}
              className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl text-xs sm:text-sm transition-colors"
            >
              Back to Catalog
            </button>
            <button
              onClick={handleBookNow}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-lg shadow-amber-500/20"
            >
              Book This Vehicle
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
