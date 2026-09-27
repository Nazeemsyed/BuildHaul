import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  User as UserIcon, 
  Phone, 
  Mail, 
  MapPin, 
  Lock, 
  ShieldCheck, 
  Briefcase, 
  Truck, 
  LogOut,
  Bell,
  CheckCircle2
} from 'lucide-react';
import { UserRole } from '../../types';

export const UserProfileModal: React.FC = () => {
  const { 
    isProfileModalOpen, 
    setIsProfileModalOpen, 
    currentUser, 
    updateUserProfile, 
    logout,
    switchRole 
  } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [whatsappNotif, setWhatsappNotif] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setPhone(currentUser.phone);
      setAddress(currentUser.address || 'Plot 42, Benz Circle, Vijayawada, AP');
      setCompanyName(currentUser.companyName || '');
      setRole(currentUser.role);
      setEmailNotif(currentUser.notificationPreferences?.email ?? true);
      setSmsNotif(currentUser.notificationPreferences?.sms ?? true);
      setWhatsappNotif(currentUser.notificationPreferences?.whatsapp ?? true);
    }
  }, [currentUser]);

  if (!isProfileModalOpen || !currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      address,
      companyName,
      role,
      notificationPreferences: {
        email: emailNotif,
        sms: smsNotif,
        whatsapp: whatsappNotif,
        bookingAlerts: true
      }
    });

    if (role !== currentUser.role) {
      switchRole(role);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsProfileModalOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-neutral-100">
        
        <button
          onClick={() => setIsProfileModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-neutral-800 pb-4 mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-400 tracking-wider">ACCOUNT SETTINGS</div>
            <h2 className="text-2xl font-bold text-white tracking-tight">User Profile & Fleet ID</h2>
          </div>
          <button
            onClick={() => {
              logout();
              setIsProfileModalOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors border border-rose-500/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {savedSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Profile Updated Successfully!</h3>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            
            {/* Avatar header */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 font-extrabold text-xl">
                {name.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white text-base truncate">{name}</div>
                <div className="text-xs text-neutral-400 font-mono">{phone}</div>
                <div className="text-xs text-amber-400 capitalize mt-0.5">{role} Account</div>
              </div>
            </div>

            {/* Name & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Company / Fleet Brand</label>
                <input
                  type="text"
                  placeholder="e.g. Varma Infra Projects"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Phone Number (+91)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Dispatch / Office Address</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* User Type Switcher */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                    role === 'customer' ? 'bg-amber-500/10 border-amber-500 text-white font-bold' : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-amber-500" />
                  <span>Customer / Contractor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                    role === 'owner' ? 'bg-amber-500/10 border-amber-500 text-white font-bold' : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                  }`}
                >
                  <Truck className="w-4 h-4 text-amber-500" />
                  <span>Vehicle Fleet Owner</span>
                </button>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2.5">
              <div className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                <span>Site Dispatch Alerts & Notifications</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                  <input
                    type="checkbox"
                    checked={smsNotif}
                    onChange={e => setSmsNotif(e.target.checked)}
                    className="rounded border-neutral-700 bg-neutral-900 text-amber-500"
                  />
                  <span>SMS OTP</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                  <input
                    type="checkbox"
                    checked={whatsappNotif}
                    onChange={e => setWhatsappNotif(e.target.checked)}
                    className="rounded border-neutral-700 bg-neutral-900 text-amber-500"
                  />
                  <span>WhatsApp</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                  <input
                    type="checkbox"
                    checked={emailNotif}
                    onChange={e => setEmailNotif(e.target.checked)}
                    className="rounded border-neutral-700 bg-neutral-900 text-amber-500"
                  />
                  <span>Email</span>
                </label>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl text-xs transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors shadow-md shadow-amber-500/20"
              >
                Save Profile
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
