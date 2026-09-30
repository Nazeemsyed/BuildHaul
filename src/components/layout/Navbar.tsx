import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Truck, 
  Bell, 
  User as UserIcon, 
  Sparkles, 
  Menu, 
  X, 
  ShieldCheck, 
  Briefcase, 
  ChevronDown,
  Layers,
  ArrowRightLeft
} from 'lucide-react';
import { UserRole } from '../../types';
import { FirebaseStatusModal } from '../common/FirebaseStatusModal';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    userRole, 
    activeTab, 
    setActiveTab, 
    switchRole,
    logout,
    notifications, 
    setIsNotificationDrawerOpen, 
    setIsAuthModalOpen, 
    setAuthModalMode,
    setAuthNoticeMessage,
    setIsProfileModalOpen,
    compareVehicleIds,
    setIsCompareModalOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNavClick = (tab: string) => {
    if ((tab === 'bookings' || tab === 'projects' || tab === 'dashboard' || tab === 'admin') && !currentUser) {
      setAuthNoticeMessage(`Please sign in or create an account to access ${tab === 'bookings' ? 'your machinery bookings' : tab === 'projects' ? 'infrastructure projects' : 'your dashboard'}.`);
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      setMobileMenuOpen(false);
      return;
    }
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const roles: { role: UserRole; label: string; icon: any }[] = [
    { role: 'customer', label: 'Customer / Contractor', icon: Briefcase },
    { role: 'owner', label: 'Vehicle Fleet Owner', icon: Truck },
    { role: 'admin', label: 'Platform Admin', icon: ShieldCheck }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single element Brand Wordmark */}
        <button 
          onClick={() => handleNavClick('home')} 
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-neutral-950 font-black shadow-lg shadow-amber-500/20 group-hover:bg-amber-400 transition-colors">
            <Truck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors">
              Build<span className="text-amber-500">Haul</span>
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Clean text links with active indicator) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-300">
          <button 
            onClick={() => handleNavClick('home')} 
            className={`transition-colors hover:text-white ${activeTab === 'home' ? 'text-amber-400 font-semibold' : ''}`}
          >
            Home
          </button>
          
          <button 
            onClick={() => handleNavClick('vehicles')} 
            className={`transition-colors hover:text-white ${activeTab === 'vehicles' ? 'text-amber-400 font-semibold' : ''}`}
          >
            Find Vehicles
          </button>

          <button 
            onClick={() => handleNavClick('ai-finder')} 
            className={`flex items-center gap-1.5 transition-colors hover:text-amber-300 ${activeTab === 'ai-finder' ? 'text-amber-400 font-semibold' : ''}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            AI Vehicle Finder
          </button>

          <button 
            onClick={() => handleNavClick('projects')} 
            className={`transition-colors hover:text-white ${activeTab === 'projects' ? 'text-amber-400 font-semibold' : ''}`}
          >
            Projects
          </button>

          <button 
            onClick={() => handleNavClick('bookings')} 
            className={`transition-colors hover:text-white ${activeTab === 'bookings' ? 'text-amber-400 font-semibold' : ''}`}
          >
            My Bookings
          </button>

          {/* Contextual Dashboard Link */}
          {userRole === 'admin' ? (
            <button 
              onClick={() => handleNavClick('admin')} 
              className={`transition-colors hover:text-amber-400 ${activeTab === 'admin' ? 'text-amber-400 font-semibold' : ''}`}
            >
              Admin Panel
            </button>
          ) : (
            <button 
              onClick={() => handleNavClick('dashboard')} 
              className={`transition-colors hover:text-amber-400 ${activeTab === 'dashboard' ? 'text-amber-400 font-semibold' : ''}`}
            >
              {userRole === 'owner' ? 'Owner Dashboard' : 'Dashboard'}
            </button>
          )}
        </nav>

        {/* Zone 3: Actions & Profile */}
        <div className="flex items-center gap-3">
          
          {/* Firebase Cloud Database Status Indicator */}
          <button 
            onClick={() => setIsFirebaseModalOpen(true)}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 text-[11px] text-emerald-400 font-mono transition-colors cursor-pointer group"
            title="Click to view Firebase project & Firestore database sync status"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse group-hover:scale-125 transition-transform" />
            <span>Firebase DB: buildhaul-65c22</span>
          </button>

          {/* Compare Counter (if vehicles queued) */}
          {compareVehicleIds.length > 0 && (
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold bg-neutral-900 border border-neutral-700 hover:border-amber-500/50 rounded-lg text-amber-400 transition-colors"
              title="Compare Vehicles"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Compare ({compareVehicleIds.length})</span>
            </button>
          )}

          {/* Quick Demo Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 transition-all hover:bg-neutral-800"
              title="Switch demo persona for testing"
            >
              <ArrowRightLeft className="w-3 h-3 text-amber-500" />
              <span className="hidden sm:inline text-neutral-400">Role:</span>
              <span className="font-semibold text-white capitalize">{userRole}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl py-1 z-50">
                <div className="px-3 py-2 border-b border-neutral-800 text-[11px] font-semibold text-neutral-400 tracking-wider">
                  PREVIEW ROLE
                </div>
                {roles.map(r => {
                  const Icon = r.icon;
                  const isSelected = userRole === r.role;
                  return (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchRole(r.role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors ${
                        isSelected ? 'bg-amber-500/10 text-amber-400 font-semibold' : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-neutral-400'}`} />
                      <span>{r.label}</span>
                    </button>
                  );
                })}

                <div className="border-t border-neutral-800 my-1" />
                <button
                  onClick={() => {
                    logout();
                    setRoleDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Browse as Guest (Signed Out)</span>
                </button>
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <button
            onClick={() => setIsNotificationDrawerOpen(true)}
            className="relative p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-neutral-950 font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Auth Button or User Menu */}
          {currentUser ? (
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors"
              title="View & Edit Profile"
            >
              <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <span className="text-xs font-medium text-white max-w-[90px] truncate hidden sm:inline">
                {currentUser.name}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-medium text-neutral-200 hover:text-white transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-400 hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-neutral-800 bg-neutral-950 px-4 pt-3 pb-5 space-y-2">
          <button 
            onClick={() => handleNavClick('home')} 
            className={`w-full text-left py-2 px-3 rounded-lg text-sm ${activeTab === 'home' ? 'bg-amber-500/10 text-amber-400 font-semibold' : 'text-neutral-300'}`}
          >
            Home
          </button>
          <button 
            onClick={() => handleNavClick('vehicles')} 
            className={`w-full text-left py-2 px-3 rounded-lg text-sm ${activeTab === 'vehicles' ? 'bg-amber-500/10 text-amber-400 font-semibold' : 'text-neutral-300'}`}
          >
            Find Vehicles
          </button>
          <button 
            onClick={() => handleNavClick('ai-finder')} 
            className={`w-full flex items-center gap-2 text-left py-2 px-3 rounded-lg text-sm ${activeTab === 'ai-finder' ? 'bg-amber-500/10 text-amber-400 font-semibold' : 'text-neutral-300'}`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            AI Vehicle Finder
          </button>
          <button 
            onClick={() => handleNavClick('projects')} 
            className={`w-full text-left py-2 px-3 rounded-lg text-sm ${activeTab === 'projects' ? 'bg-amber-500/10 text-amber-400 font-semibold' : 'text-neutral-300'}`}
          >
            Projects
          </button>
          <button 
            onClick={() => handleNavClick('bookings')} 
            className={`w-full text-left py-2 px-3 rounded-lg text-sm ${activeTab === 'bookings' ? 'bg-amber-500/10 text-amber-400 font-semibold' : 'text-neutral-300'}`}
          >
            My Bookings
          </button>
          <button 
            onClick={() => handleNavClick(userRole === 'admin' ? 'admin' : 'dashboard')} 
            className={`w-full text-left py-2 px-3 rounded-lg text-sm ${activeTab === 'dashboard' || activeTab === 'admin' ? 'bg-amber-500/10 text-amber-400 font-semibold' : 'text-neutral-300'}`}
          >
            {userRole === 'admin' ? 'Admin Panel' : userRole === 'owner' ? 'Owner Dashboard' : 'Dashboard'}
          </button>
          {currentUser ? (
            <button 
              onClick={() => {
                setIsProfileModalOpen(true);
                setMobileMenuOpen(false);
              }} 
              className="w-full flex items-center gap-2 text-left py-2 px-3 rounded-lg text-sm text-neutral-300 hover:text-white"
            >
              <UserIcon className="w-4 h-4 text-amber-400" />
              <span>Profile & Settings ({currentUser.name})</span>
            </button>
          ) : (
            <div className="pt-2 border-t border-neutral-800 flex gap-2">
              <button 
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }} 
                className="flex-1 py-2 text-center rounded-lg text-xs font-semibold bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 transition-colors"
              >
                Log In
              </button>
              <button 
                onClick={() => {
                  setAuthModalMode('signup');
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }} 
                className="flex-1 py-2 text-center rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}

      {/* Firebase Database Sync & Status Modal */}
      <FirebaseStatusModal 
        isOpen={isFirebaseModalOpen} 
        onClose={() => setIsFirebaseModalOpen(false)} 
      />
    </header>
  );
};
