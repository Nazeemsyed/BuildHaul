import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VehicleType } from '../../types';
import { X, Truck, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { TRUCK_IMAGE, TRACTOR_IMAGE, MINI_TRUCK_IMAGE, LOADER_IMAGE } from '../../data/mockData';

export const AddVehicleModal: React.FC = () => {
  const { isAddVehicleModalOpen, setIsAddVehicleModalOpen, addVehicle } = useApp();

  const [name, setName] = useState('');
  const [type, setType] = useState<VehicleType>('Heavy Duty Tractor');
  const [regNumber, setRegNumber] = useState('');
  const [capacityTons, setCapacityTons] = useState(4);
  const [pricePerDay, setPricePerDay] = useState(2000);
  const [location, setLocation] = useState('Vijayawada Auto Nagar');
  const [description, setDescription] = useState('');
  const [driverAvailable, setDriverAvailable] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(TRACTOR_IMAGE);
  const [rcFileName, setRcFileName] = useState('');

  if (!isAddVehicleModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !regNumber.trim()) return;

    addVehicle({
      name,
      type,
      regNumber: regNumber.toUpperCase(),
      capacityTons,
      pricePerDay,
      location,
      description,
      driverAvailable,
      image: selectedPhoto
    });
  };

  const samplePhotos = [
    { label: 'Tractor', img: TRACTOR_IMAGE },
    { label: 'Heavy Tipper', img: TRUCK_IMAGE },
    { label: 'Mini Truck', img: MINI_TRUCK_IMAGE },
    { label: 'Wheel Loader', img: LOADER_IMAGE }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-neutral-100">
        
        <button
          onClick={() => setIsAddVehicleModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-neutral-800 pb-3 mb-5">
          <div className="text-xs font-bold text-amber-400 tracking-wider">FLEET ONBOARDING</div>
          <h2 className="text-xl font-bold text-white">Add Construction Vehicle</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Vehicle Name & Model</label>
            <input
              type="text"
              required
              placeholder="e.g. Mahindra 575 DI Heavy Tractor"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Vehicle Category</label>
              <select
                value={type}
                onChange={e => {
                  const t = e.target.value as VehicleType;
                  setType(t);
                  if (t === 'Heavy Tipper Truck') setSelectedPhoto(TRUCK_IMAGE);
                  else if (t === 'Heavy Duty Tractor') setSelectedPhoto(TRACTOR_IMAGE);
                  else if (t === 'Mini Truck Carrier') setSelectedPhoto(MINI_TRUCK_IMAGE);
                  else setSelectedPhoto(LOADER_IMAGE);
                }}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Heavy Tipper Truck">Heavy Tipper Truck</option>
                <option value="Heavy Duty Tractor">Heavy Duty Tractor</option>
                <option value="Mini Truck Carrier">Mini Truck Carrier</option>
                <option value="Wheel Loader">Wheel Loader</option>
                <option value="Hydraulic Excavator">Hydraulic Excavator</option>
                <option value="Open-Top 4-Wheeler">Open-Top 4-Wheeler</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Registration (RC Number)</label>
              <input
                type="text"
                required
                placeholder="AP 16 XX 1234"
                value={regNumber}
                onChange={e => setRegNumber(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 uppercase font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Capacity (Tons)</label>
              <input
                type="number"
                min={0.5}
                max={30}
                step={0.5}
                value={capacityTons}
                onChange={e => setCapacityTons(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Price per Day (₹)</label>
              <input
                type="number"
                step={100}
                value={pricePerDay}
                onChange={e => setPricePerDay(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Location / Depot Hub</label>
            <input
              type="text"
              required
              placeholder="e.g. Auto Nagar Gate 3, Vijayawada"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Photo Selector */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Select Equipment Photo</label>
            <div className="grid grid-cols-4 gap-2">
              {samplePhotos.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhoto(p.img)}
                  className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all h-16 ${
                    selectedPhoto === p.img ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <img src={p.img} alt={p.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-neutral-950/80 text-[9px] text-center text-white py-0.5 truncate px-1">
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Driver & RC Document mock upload */}
          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3">
            <label className="flex items-center justify-between cursor-pointer text-xs">
              <span className="font-semibold text-neutral-200">Commercial Driver Included with Vehicle</span>
              <input
                type="checkbox"
                checked={driverAvailable}
                onChange={e => setDriverAvailable(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-amber-500"
              />
            </label>

            <div className="border-t border-neutral-800 pt-2 flex items-center justify-between text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span>Upload Registration Certificate (RC):</span>
              </div>
              <label className="cursor-pointer text-amber-400 hover:underline">
                <span>{rcFileName || 'Attach PDF/Photo'}</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={e => setRcFileName(e.target.files?.[0]?.name || 'RC_Uploaded.pdf')}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Hydraulic condition, tire status, trailer dimensions..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAddVehicleModalOpen(false)}
              className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors shadow-md shadow-amber-500/20"
            >
              Publish to Marketplace
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
