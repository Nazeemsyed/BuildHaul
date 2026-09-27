import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Truck, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  X, 
  Search, 
  Filter, 
  BarChart3, 
  Bell, 
  Settings, 
  FileText, 
  Star, 
  Trash2, 
  UserX, 
  UserCheck, 
  CreditCard,
  Building2,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Database,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { BookingStatus, UserRole } from '../../types';
import { FirestoreService } from '../../services/firestoreService';
import { firebaseConfig } from '../../lib/firebase';

export const AdminDashboard: React.FC = () => {
  const { 
    users, 
    vehicles, 
    bookings, 
    projects, 
    drivers, 
    verifications, 
    reviewVerification, 
    approveVehicle, 
    deleteVehicle, 
    updateBookingStatus,
    suspendUser, 
    activateUser, 
    deleteUser 
  } = useApp();

  const [adminSection, setAdminSection] = useState<
    'dashboard' | 'users' | 'owners' | 'customers' | 'vehicles' | 'bookings' | 'projects' | 'drivers' | 'reviews' | 'payments' | 'reports' | 'notifications' | 'settings'
  >('dashboard');

  // Search & filter states
  const [userSearch, setUserSearch] = useState('');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('All');
  const [adminActionMessage, setAdminActionMessage] = useState('');
  const [isSyncingFirebase, setIsSyncingFirebase] = useState(false);
  const [firebaseStatusMsg, setFirebaseStatusMsg] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  const handleSyncToFirebase = async () => {
    try {
      setIsSyncingFirebase(true);
      setFirebaseStatusMsg(null);
      const res = await FirestoreService.seedAllDataToFirestore();
      setFirebaseStatusMsg({
        type: 'success',
        text: `Cloud sync complete! Pushed ${res.users} users, ${res.vehicles} vehicles, ${res.bookings} bookings, and ${res.projects} projects to Firebase Firestore.`
      });
    } catch (err: any) {
      setFirebaseStatusMsg({
        type: 'error',
        text: `Sync error: ${err?.message || 'Failed to sync'}`
      });
    } finally {
      setIsSyncingFirebase(false);
    }
  };

  const handleTestPing = async () => {
    try {
      setIsSyncingFirebase(true);
      const res = await FirestoreService.testConnection();
      setFirebaseStatusMsg({
        type: res.success ? 'success' : 'error',
        text: `${res.message} (Database: ${res.databaseId})`
      });
    } catch (err: any) {
      setFirebaseStatusMsg({
        type: 'error',
        text: `Ping error: ${err?.message || 'Failed to ping'}`
      });
    } finally {
      setIsSyncingFirebase(false);
    }
  };

  // Platform Metrics
  const totalUsers = users.length;
  const totalOwners = users.filter(u => u.role === 'owner').length;
  const totalCustomers = users.filter(u => u.role === 'customer').length;
  const totalVehicles = vehicles.length;
  const activeBookings = bookings.filter(b => b.status === 'In Progress' || b.status === 'Driver Assigned').length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const completedBookings = bookings.filter(b => b.status === 'Completed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'Cancelled').length;
  const totalRevenue = bookings
    .filter(b => b.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const notifyAdmin = (msg: string) => {
    setAdminActionMessage(msg);
    setTimeout(() => setAdminActionMessage(''), 3000);
  };

  const navItems: { key: typeof adminSection; label: string; icon: any; count?: number }[] = [
    { key: 'dashboard', label: 'Dashboard Overview', icon: BarChart3 },
    { key: 'users', label: 'All Users', icon: Users, count: totalUsers },
    { key: 'owners', label: 'Fleet Owners', icon: Building2, count: totalOwners },
    { key: 'customers', label: 'Customers & Contractors', icon: Users, count: totalCustomers },
    { key: 'vehicles', label: 'Vehicles & Machinery', icon: Truck, count: totalVehicles },
    { key: 'bookings', label: 'Booking Operations', icon: Calendar, count: bookings.length },
    { key: 'projects', label: 'Construction Projects', icon: Building2, count: projects.length },
    { key: 'drivers', label: 'Commercial Drivers', icon: UserCheck, count: drivers.length },
    { key: 'reviews', label: 'Reviews & Ratings', icon: Star },
    { key: 'payments', label: 'Escrow & Payments', icon: CreditCard },
    { key: 'reports', label: 'Analytics Reports', icon: TrendingUp },
    { key: 'notifications', label: 'System Alerts', icon: Bell },
    { key: 'settings', label: 'Platform Settings', icon: Settings }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ROOT PLATFORM ADMINISTRATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            BuildHaul Operations Control Center
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Complete platform governance, KYC approvals, fleet moderation, and financial escrow settlement.
          </p>
        </div>

        {adminActionMessage && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{adminActionMessage}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Sidebar + Admin Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-1 space-y-1 bg-neutral-900 border border-neutral-800 p-3 rounded-2xl h-fit">
          <div className="text-[11px] font-bold text-neutral-400 px-3 py-2 uppercase tracking-wider">
            Admin Modules
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isSelected = adminSection === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setAdminSection(item.key)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                    : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-neutral-950' : 'text-neutral-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    isSelected ? 'bg-neutral-950 text-amber-400 font-bold' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* WORKSPACE AREA */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* SECTION: DASHBOARD OVERVIEW */}
          {adminSection === 'dashboard' && (
            <div className="space-y-6">

              {/* Firebase Cloud Database Status & Sync Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">Firebase Cloud Firestore Database</h3>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-semibold border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live Connected
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        Project: <strong className="text-neutral-200 font-mono">{firebaseConfig.projectId}</strong> · DB: <span className="font-mono text-amber-300 text-[11px]">{firebaseConfig.firestoreDatabaseId}</span>
                      </p>
                      <p className="text-[11px] text-neutral-500 mt-1">
                        *In Firebase Console, use the database dropdown at top of Cloud Firestore to select your database.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                      onClick={handleSyncToFirebase}
                      disabled={isSyncingFirebase}
                      className="py-2 px-3 bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingFirebase ? 'animate-spin' : ''}`} />
                      <span>{isSyncingFirebase ? 'Pushing Data...' : 'Push All Data to Firebase'}</span>
                    </button>
                    <button
                      onClick={handleTestPing}
                      disabled={isSyncingFirebase}
                      className="py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-neutral-700 cursor-pointer"
                    >
                      <span>Ping Test</span>
                    </button>
                  </div>
                </div>

                {firebaseStatusMsg && (
                  <div className={`mt-3 p-2.5 rounded-lg text-xs flex items-center gap-2 animate-in fade-in ${
                    firebaseStatusMsg.type === 'success' 
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{firebaseStatusMsg.text}</span>
                  </div>
                )}
              </div>
              
              {/* Top Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="text-xs text-neutral-400">Total Users</div>
                  <div className="text-2xl font-black text-white font-mono mt-1">{totalUsers}</div>
                  <div className="text-[10px] text-neutral-500">{totalOwners} Owners · {totalCustomers} Clients</div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="text-xs text-neutral-400">Total Fleet Vehicles</div>
                  <div className="text-2xl font-black text-white font-mono mt-1">{totalVehicles}</div>
                  <div className="text-[10px] text-emerald-400">Active Listings</div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="text-xs text-neutral-400">Platform GMV Revenue</div>
                  <div className="text-2xl font-black text-amber-400 font-mono mt-1">₹{totalRevenue.toLocaleString()}</div>
                  <div className="text-[10px] text-emerald-400">100% Escrow Settled</div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="text-xs text-neutral-400">Active Bookings</div>
                  <div className="text-2xl font-black text-sky-400 font-mono mt-1">{activeBookings}</div>
                  <div className="text-[10px] text-neutral-500">Live on jobsites</div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="text-xs text-neutral-400">Pending Approvals</div>
                  <div className="text-2xl font-black text-amber-400 font-mono mt-1">{pendingBookings}</div>
                  <div className="text-[10px] text-amber-400">Dispatch Queue</div>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                  <div className="text-xs text-neutral-400">Completed Trips</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{completedBookings}</div>
                  <div className="text-[10px] text-neutral-500">{cancelledBookings} Cancelled</div>
                </div>
              </div>

              {/* Owner KYC Verification Queue */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>Owner Verification Queue ({verifications.length})</span>
                  </h3>
                  <span className="text-xs text-neutral-400">Live Compliance Audit</span>
                </div>

                <div className="space-y-3">
                  {verifications.map(ver => (
                    <div
                      key={ver.id}
                      className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-white text-sm">{ver.ownerName}</div>
                        <div className="text-neutral-400 font-mono">{ver.ownerPhone} · Submitted {ver.submittedAt}</div>
                        <div className="text-neutral-400 flex flex-wrap gap-2 text-[11px] pt-1">
                          <span className="px-2 py-0.5 bg-neutral-900 rounded border border-neutral-800">ID: {ver.idProofName}</span>
                          <span className="px-2 py-0.5 bg-neutral-900 rounded border border-neutral-800">RC: {ver.rcDocName}</span>
                          <span className="px-2 py-0.5 bg-neutral-900 rounded border border-neutral-800">DL: {ver.licenseName}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                          ver.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          ver.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {ver.status}
                        </span>

                        {ver.status === 'Pending' && (
                          <div className="flex items-center gap-1.5 ml-2">
                            <button
                              onClick={() => {
                                reviewVerification(ver.id, 'Verified');
                                notifyAdmin(`Verified fleet credentials for ${ver.ownerName}`);
                              }}
                              className="px-2.5 py-1.5 bg-emerald-500 text-neutral-950 font-bold rounded-lg text-xs hover:bg-emerald-400"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                reviewVerification(ver.id, 'Rejected');
                                notifyAdmin(`Rejected verification for ${ver.ownerName}`);
                              }}
                              className="px-2.5 py-1.5 bg-neutral-800 text-rose-400 hover:bg-rose-950 font-bold rounded-lg text-xs"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* SECTION: USERS MANAGEMENT */}
          {(adminSection === 'users' || adminSection === 'owners' || adminSection === 'customers') && (
            <div className="space-y-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-base font-bold text-white capitalize">
                  {adminSection === 'owners' ? 'Vehicle Fleet Owners' : adminSection === 'customers' ? 'Customer & Contractor Accounts' : 'Platform Users Directory'}
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, email, phone..."
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 w-64"
                  />
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-neutral-400 border-b border-neutral-800">
                    <tr>
                      <th className="py-2.5 px-3">User</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Contact</th>
                      <th className="py-2.5 px-3">KYC Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {users
                      .filter(u => {
                        if (adminSection === 'owners') return u.role === 'owner';
                        if (adminSection === 'customers') return u.role === 'customer';
                        return true;
                      })
                      .filter(u => {
                        if (!userSearch.trim()) return true;
                        const q = userSearch.toLowerCase();
                        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q);
                      })
                      .map(u => (
                        <tr key={u.id} className="hover:bg-neutral-800/40">
                          <td className="py-3 px-3">
                            <div className="font-bold text-white">{u.name}</div>
                            <div className="text-[11px] text-neutral-400">{u.companyName || u.email}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="capitalize px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-neutral-300">{u.phone}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.isVerified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                            }`}>
                              {u.isVerified ? 'Active & Verified' : 'Suspended'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right space-x-1.5">
                            {u.isVerified ? (
                              <button
                                onClick={() => {
                                  suspendUser(u.id);
                                  notifyAdmin(`Suspended user ${u.name}`);
                                }}
                                className="p-1 hover:text-amber-400 text-neutral-400"
                                title="Suspend user"
                              >
                                <UserX className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  activateUser(u.id);
                                  notifyAdmin(`Activated user ${u.name}`);
                                }}
                                className="p-1 hover:text-emerald-400 text-neutral-400"
                                title="Activate user"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                deleteUser(u.id);
                                notifyAdmin(`Deleted user record`);
                              }}
                              className="p-1 hover:text-rose-400 text-neutral-400"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: VEHICLES MANAGEMENT */}
          {adminSection === 'vehicles' && (
            <div className="space-y-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-base font-bold text-white">All Machinery Fleet Listings ({vehicles.length})</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by RC, model, owner..."
                    value={vehicleSearch}
                    onChange={e => setVehicleSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 w-64"
                  />
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div className="space-y-3">
                {vehicles
                  .filter(v => {
                    if (!vehicleSearch.trim()) return true;
                    const q = vehicleSearch.toLowerCase();
                    return v.name.toLowerCase().includes(q) || v.regNumber.toLowerCase().includes(q) || v.ownerName.toLowerCase().includes(q);
                  })
                  .map(veh => (
                    <div
                      key={veh.id}
                      className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img src={veh.image} alt={veh.name} className="w-16 h-12 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-white text-sm">{veh.name}</div>
                          <div className="text-neutral-400 font-mono">
                            RC: {veh.regNumber} · {veh.capacityDisplay} · {veh.location}
                          </div>
                          <div className="text-amber-400 font-mono">
                            ₹{veh.pricePerDay}/day · Owner: {veh.ownerName}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          veh.isApproved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {veh.isApproved ? 'Listing Approved' : 'Pending Approval'}
                        </span>

                        <button
                          onClick={() => {
                            approveVehicle(veh.id, !veh.isApproved);
                            notifyAdmin(`Toggled listing approval for ${veh.name}`);
                          }}
                          className={`px-3 py-1 rounded-lg font-bold text-xs ${
                            veh.isApproved ? 'bg-neutral-800 text-neutral-300' : 'bg-amber-500 text-neutral-950 hover:bg-amber-400'
                          }`}
                        >
                          {veh.isApproved ? 'Suspend' : 'Approve'}
                        </button>

                        <button
                          onClick={() => {
                            deleteVehicle(veh.id);
                            notifyAdmin(`Removed vehicle ${veh.name}`);
                          }}
                          className="p-1.5 text-neutral-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* SECTION: BOOKING OPERATIONS */}
          {adminSection === 'bookings' && (
            <div className="space-y-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-base font-bold text-white">Central Bookings Management ({bookings.length})</h3>
                <div className="flex items-center gap-2">
                  <select
                    value={bookingFilterStatus}
                    onChange={e => setBookingFilterStatus(e.target.value)}
                    className="bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs rounded-xl px-2.5 py-1.5"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-neutral-400 border-b border-neutral-800">
                    <tr>
                      <th className="py-2.5 px-3">Booking ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Machine</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 font-mono">
                    {bookings
                      .filter(b => bookingFilterStatus === 'All' || b.status === bookingFilterStatus)
                      .map(b => (
                        <tr key={b.id} className="hover:bg-neutral-800/40">
                          <td className="py-3 px-3 font-bold text-amber-400">{b.id}</td>
                          <td className="py-3 px-3 font-sans">
                            <div className="font-semibold text-white">{b.customerName}</div>
                            <div className="text-[10px] text-neutral-400">{b.customerPhone}</div>
                          </td>
                          <td className="py-3 px-3 font-sans">
                            <div className="text-neutral-200">{b.vehicleName}</div>
                            <div className="text-[10px] text-neutral-500">{b.pickupLocation}</div>
                          </td>
                          <td className="py-3 px-3 text-white font-bold">₹{b.totalAmount.toLocaleString()}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-200">
                              {b.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-sans">
                            {b.status !== 'Cancelled' && (
                              <button
                                onClick={() => {
                                  updateBookingStatus(b.id, 'Cancelled');
                                  notifyAdmin(`Cancelled booking ${b.id}`);
                                }}
                                className="px-2.5 py-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-md text-[11px]"
                              >
                                Cancel Override
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION: REPORTS & ANALYTICS */}
          {adminSection === 'reports' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Monthly Revenue Trends */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-neutral-300 tracking-wider">MONTHLY REVENUE TREND (₹ LAKHS)</h4>
                  <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
                    {[
                      { month: 'Apr', val: 45, display: '4.5L' },
                      { month: 'May', val: 62, display: '6.2L' },
                      { month: 'Jun', val: 78, display: '7.8L' },
                      { month: 'Jul', val: 95, display: '9.5L' },
                      { month: 'Aug', val: 110, display: '11.0L' },
                      { month: 'Sep', val: 142, display: '14.2L' }
                    ].map(bar => (
                      <div key={bar.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <span className="text-[10px] text-amber-400 font-mono">{bar.display}</span>
                        <div
                          style={{ height: `${(bar.val / 150) * 100}%` }}
                          className="w-full bg-amber-500 rounded-t-md hover:bg-amber-400 transition-colors"
                        />
                        <span className="text-[10px] text-neutral-400 font-medium">{bar.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Vehicle Distribution */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-neutral-300 tracking-wider">EQUIPMENT SHARE BY TRIPS</h4>
                  <div className="space-y-2.5 pt-2">
                    {[
                      { name: 'Heavy Tipper Truck (10-16 Ton)', pct: 45, count: '184 trips' },
                      { name: 'Heavy Duty Tractor & Trailer', pct: 32, count: '128 trips' },
                      { name: 'Mini Truck Urban Carrier', pct: 15, count: '62 trips' },
                      { name: 'Wheel Loader & Excavators', pct: 8, count: '31 trips' }
                    ].map(eq => (
                      <div key={eq.name} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-neutral-200">{eq.name}</span>
                          <span className="text-amber-400 font-mono font-bold">{eq.pct}% ({eq.count})</span>
                        </div>
                        <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden">
                          <div style={{ width: `${eq.pct}%` }} className="bg-amber-500 h-full rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Active Locations Ranking */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold text-neutral-300 tracking-wider">TOP LOGISTICS HUBS IN CAPITAL REGION</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                    <div className="text-amber-400 font-bold text-sm">1. Vijayawada (Auto Nagar)</div>
                    <div className="text-xs text-neutral-400 mt-1">214 vehicle dispatches/mo</div>
                  </div>
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                    <div className="text-amber-400 font-bold text-sm">2. Amaravati Capital Core</div>
                    <div className="text-xs text-neutral-400 mt-1">168 vehicle dispatches/mo</div>
                  </div>
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                    <div className="text-amber-400 font-bold text-sm">3. Gannavaram Airport Corridor</div>
                    <div className="text-xs text-neutral-400 mt-1">112 vehicle dispatches/mo</div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* SECTION: PLATFORM SETTINGS */}
          {adminSection === 'settings' && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white">BuildHaul Platform Parameters</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Platform Escrow Fee (%)</label>
                  <input
                    type="number"
                    defaultValue={5}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">GST Rate (%)</label>
                  <input
                    type="number"
                    defaultValue={18}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Base Commercial Driver Wage (₹/Day)</label>
                  <input
                    type="number"
                    defaultValue={800}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 font-medium">Active Dispatch Radius (km)</label>
                  <input
                    type="number"
                    defaultValue={40}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => notifyAdmin('Platform configuration saved successfully!')}
                className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors"
              >
                Save Global Settings
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
