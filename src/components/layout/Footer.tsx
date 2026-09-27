import React from 'react';
import { Truck, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-neutral-950 font-black">
                <Truck className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Build<span className="text-amber-500">Haul</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              The right machine. The right site. The right time. Connecting contractors with heavy equipment and commercial vehicle fleets.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% RC & Commercial Verified Fleets</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-white tracking-wider mb-3">VEHICLE FLEET</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('vehicles')} className="hover:text-amber-400 transition-colors">
                  Heavy Tipper Trucks (10–16 Ton)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('vehicles')} className="hover:text-amber-400 transition-colors">
                  Heavy Duty Tractors & Trailers
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('vehicles')} className="hover:text-amber-400 transition-colors">
                  Mini Trucks & Urban Carriers
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('vehicles')} className="hover:text-amber-400 transition-colors">
                  Wheel Loaders & Backhoe Diggers
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('ai-finder')} className="text-amber-400 hover:text-amber-300 transition-colors">
                  AI Vehicle Recommendation Tool
                </button>
              </li>
            </ul>
          </div>

          {/* Operating Hubs */}
          <div>
            <h4 className="text-xs font-semibold text-white tracking-wider mb-3">ACTIVE HUBS</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Vijayawada (Auto Nagar & Benz Circle)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Gannavaram & Airport Corridor</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Amaravati Capital Region & Guntur</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Mangalagiri & Ibrahimpatnam Sand Hub</span>
              </li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 className="text-xs font-semibold text-white tracking-wider mb-3">DISPATCH SUPPORT</h4>
            <div className="space-y-2.5 text-xs">
              <p className="text-neutral-400">
                24/7 Site Assistance & Breakdown Replacement
              </p>
              <div className="flex items-center gap-2 text-white font-mono">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>+91 800-BUILD-HAUL</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>dispatch@buildhaul.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {new Date().getFullYear()} BuildHaul Technologies Inc. All rights reserved.</span>
            <span className="hidden sm:inline text-neutral-700">|</span>
            <span className="inline-flex items-center gap-1.5 font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Firebase Database: buildhaul-65c22
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-neutral-300 cursor-pointer">Fleet Safety Policy</span>
            <span className="hover:text-neutral-300 cursor-pointer">Insurance Coverage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
