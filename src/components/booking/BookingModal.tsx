import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MaterialType, Vehicle } from '../../types';
import { 
  X, 
  Calendar, 
  MapPin, 
  Clock, 
  UserCheck, 
  Truck, 
  ArrowRight, 
  ShieldCheck, 
  CreditCard 
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const { 
    isBookingModalOpen, 
    setIsBookingModalOpen, 
    selectedVehicleForBooking, 
    vehicles, 
    setIsPaymentModalOpen,
    setPendingBookingData
  } = useApp();

  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null);
  const [startDate, setStartDate] = useState('2026-09-28');
  const [durationDays, setDurationDays] = useState(2);
  const [pickupLocation, setPickupLocation] = useState('Krishna River Sand Reach, Ibrahimpatnam');
  const [destination, setDestination] = useState('Site 14, Amaravati Capital Core');
  const [materialType, setMaterialType] = useState<MaterialType>('Sand');
  const [quantity, setQuantity] = useState('10 Tons (2 Trips)');
  const [driverRequired, setDriverRequired] = useState(true);

  useEffect(() => {
    if (selectedVehicleForBooking) {
      setActiveVehicle(selectedVehicleForBooking);
    } else if (vehicles.length > 0) {
      setActiveVehicle(vehicles[0]);
    }
  }, [selectedVehicleForBooking, vehicles]);

  if (!isBookingModalOpen || !activeVehicle) return null;

  const vehiclePrice = activeVehicle.pricePerDay * durationDays;
  const driverFee = driverRequired ? (activeVehicle.driverFeePerDay * durationDays) : 0;
  const subtotal = vehiclePrice + driverFee;
  const platformFee = Math.round(subtotal * 0.05); // 5%
  const gstAmount = Math.round((subtotal + platformFee) * 0.18); // 18% GST
  const estimatedTotal = subtotal + platformFee + gstAmount;

  const materials: MaterialType[] = [
    'Sand',
    'Bricks',
    'Gravel',
    'Cement',
    'Construction Waste',
    'Soil',
    'Steel & Rebar',
    'Other'
  ];

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    setPendingBookingData({
      vehicleId: activeVehicle.id,
      vehicleName: activeVehicle.name,
      vehicleType: activeVehicle.type,
      vehicleImage: activeVehicle.image,
      ownerId: activeVehicle.ownerId,
      ownerName: activeVehicle.ownerName,
      ownerPhone: activeVehicle.ownerPhone,
      startDate,
      durationDays,
      pickupLocation,
      destination,
      materialType,
      quantity,
      driverRequired,
      vehiclePrice,
      driverFee,
      platformFee,
      gstAmount,
      totalAmount: estimatedTotal
    });

    setIsBookingModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-neutral-100">
        
        {/* Close Button */}
        <button
          onClick={() => setIsBookingModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-neutral-800 pb-4 mb-6">
          <div className="text-xs font-bold text-amber-400 tracking-wider">BOOKING CONFIGURATOR</div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Hire Construction Machine</h2>
        </div>

        {/* Selected Vehicle Preview Banner */}
        <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center gap-3 mb-6">
          <img
            src={activeVehicle.image}
            alt={activeVehicle.name}
            className="w-16 h-12 rounded-lg object-cover border border-neutral-700 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white truncate">{activeVehicle.name}</div>
            <div className="text-xs text-neutral-400">{activeVehicle.type} · {activeVehicle.capacityDisplay}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-amber-400 font-mono">₹{activeVehicle.pricePerDay}/day</div>
            <div className="text-[10px] text-neutral-400">RC: {activeVehicle.regNumber}</div>
          </div>
        </div>

        <form onSubmit={handleProceedToPayment} className="space-y-4">
          
          {/* Date & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Site Deployment Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full pl-3 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Rental Duration (Days)
              </label>
              <select
                value={durationDays}
                onChange={e => setDurationDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value={1}>1 Day</option>
                <option value={2}>2 Days</option>
                <option value={3}>3 Days</option>
                <option value={5}>5 Days</option>
                <option value={7}>1 Week (7 Days)</option>
                <option value={14}>2 Weeks (14 Days)</option>
                <option value={30}>1 Month (30 Days)</option>
              </select>
            </div>
          </div>

          {/* Locations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                Pickup Location / Loading Point
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ibrahimpatnam Sand Reach"
                value={pickupLocation}
                onChange={e => setPickupLocation(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                Site Destination / Unloading Point
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sector 4, Amaravati site"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Material & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Material to Transport
              </label>
              <select
                value={materialType}
                onChange={e => setMaterialType(e.target.value as MaterialType)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              >
                {materials.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Approximate Quantity
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 10 Tons, 3000 bricks"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Driver Required Toggle */}
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-4 h-4 text-amber-500" />
              <div>
                <div className="text-xs font-bold text-white">Commercial Driver Required</div>
                <div className="text-[11px] text-neutral-400">
                  Certified heavy operator with valid transport license (+₹{activeVehicle.driverFeePerDay}/day)
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={driverRequired}
                onChange={e => setDriverRequired(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Price Breakdown Summary */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="text-xs font-bold text-neutral-300 border-b border-neutral-800/80 pb-2">
              ESTIMATED CHARGES
            </div>

            <div className="flex justify-between text-xs text-neutral-300">
              <span>Vehicle Rental ({durationDays} days @ ₹{activeVehicle.pricePerDay}/d)</span>
              <span className="font-mono tabular-nums">₹{vehiclePrice.toLocaleString()}</span>
            </div>

            {driverRequired && (
              <div className="flex justify-between text-xs text-neutral-300">
                <span>Driver Fee ({durationDays} days @ ₹{activeVehicle.driverFeePerDay}/d)</span>
                <span className="font-mono tabular-nums">₹{driverFee.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-xs text-neutral-400">
              <span>Platform Service & Insurance Fee (5%)</span>
              <span className="font-mono tabular-nums">₹{platformFee.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-xs text-neutral-400">
              <span>GST (18%)</span>
              <span className="font-mono tabular-nums">₹{gstAmount.toLocaleString()}</span>
            </div>

            <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-sm font-bold text-white">
              <span>Estimated Total Amount</span>
              <span className="text-lg text-amber-400 font-mono tabular-nums">
                ₹{estimatedTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsBookingModalOpen(false)}
              className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl text-xs sm:text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <span>Confirm & Proceed to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
