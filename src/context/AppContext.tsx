import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  Vehicle, 
  Booking, 
  Project, 
  Driver, 
  OwnerVerification, 
  PlatformNotification, 
  BookingStatus 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_VEHICLES, 
  INITIAL_BOOKINGS, 
  INITIAL_PROJECTS, 
  INITIAL_DRIVERS, 
  INITIAL_VERIFICATIONS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';
import { FirestoreService } from '../services/firestoreService';
import { auth, onAuthStateChanged, FirebaseUser } from '../lib/firebase';

// Local storage helper keys
const STORAGE_KEYS = {
  USERS: 'buildhaul_users_v2',
  CURRENT_USER: 'buildhaul_session_user_v3',
  VEHICLES: 'buildhaul_vehicles_v2',
  BOOKINGS: 'buildhaul_bookings_v2',
  PROJECTS: 'buildhaul_projects_v2',
  DRIVERS: 'buildhaul_drivers_v2',
  VERIFICATIONS: 'buildhaul_verifications_v2',
  NOTIFICATIONS: 'buildhaul_notifications_v2'
};

const getStoredItem = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
};

const setStoredItem = <T,>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed to store ${key} in localStorage`, e);
  }
};

interface AppContextType {
  currentUser: User | null;
  userRole: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Data
  users: User[];
  vehicles: Vehicle[];
  bookings: Booking[];
  projects: Project[];
  drivers: Driver[];
  verifications: OwnerVerification[];
  notifications: PlatformNotification[];
  compareVehicleIds: string[];
  
  // Modals & Selection
  selectedVehicleForBooking: Vehicle | null;
  setSelectedVehicleForBooking: (v: Vehicle | null) => void;
  selectedVehicleForDetails: Vehicle | null;
  setSelectedVehicleForDetails: (v: Vehicle | null) => void;
  selectedBookingForReview: Booking | null;
  setSelectedBookingForReview: (b: Booking | null) => void;
  
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  authNoticeMessage: string | null;
  setAuthNoticeMessage: (msg: string | null) => void;
  
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;
  isAddVehicleModalOpen: boolean;
  setIsAddVehicleModalOpen: (open: boolean) => void;
  isOwnerVerificationModalOpen: boolean;
  setIsOwnerVerificationModalOpen: (open: boolean) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  
  // Pending booking data for payment step
  pendingBookingData: Partial<Booking> | null;
  setPendingBookingData: (b: Partial<Booking> | null) => void;
  
  // Search state passed from Hero
  heroSearchFilters: { location?: string; type?: string; date?: string; duration?: string } | null;
  setHeroSearchFilters: (f: { location?: string; type?: string; date?: string; duration?: string } | null) => void;

  // Gated Booking flow action
  startBookingFlow: (vehicle: Vehicle) => void;

  // Actions
  login: (user: User) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  signUpUser: (user: User) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  
  // Vehicle management
  addVehicle: (vehicleData: Partial<Vehicle>) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  approveVehicle: (id: string, approved: boolean) => void;
  
  // Booking management
  createBooking: (booking: Partial<Booking>) => Booking;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  cancelBooking: (id: string) => void;
  addReview: (bookingId: string, review: NonNullable<Booking['review']>) => void;
  
  // Projects
  createProject: (project: Partial<Project>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  
  // Drivers
  addDriver: (driver: Partial<Driver>) => void;
  
  // Verifications
  submitVerification: (verification: Partial<OwnerVerification>) => void;
  reviewVerification: (id: string, status: 'Verified' | 'Rejected', notes?: string) => void;
  
  // Compare
  toggleCompare: (vehicleId: string) => void;
  removeFromCompare: (vehicleId: string) => void;
  clearCompare: () => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // Admin User operations
  suspendUser: (id: string) => void;
  activateUser: (id: string) => void;
  deleteUser: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistent data initialization
  const [users, setUsers] = useState<User[]>(() => getStoredItem(STORAGE_KEYS.USERS, INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredItem<User | null>(STORAGE_KEYS.CURRENT_USER, null));
  const [userRole, setUserRole] = useState<UserRole>(() => currentUser?.role || 'customer');
  const [activeTab, setActiveTab] = useState<string>('home');
  
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => getStoredItem(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES));
  const [bookings, setBookings] = useState<Booking[]>(() => getStoredItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS));
  const [projects, setProjects] = useState<Project[]>(() => getStoredItem(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS));
  const [drivers, setDrivers] = useState<Driver[]>(() => getStoredItem(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS));
  const [verifications, setVerifications] = useState<OwnerVerification[]>(() => getStoredItem(STORAGE_KEYS.VERIFICATIONS, INITIAL_VERIFICATIONS));
  const [notifications, setNotifications] = useState<PlatformNotification[]>(() => getStoredItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS));
  const [compareVehicleIds, setCompareVehicleIds] = useState<string[]>([]);
  
  // Modal states
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState<Vehicle | null>(null);
  const [pendingVehicleForBooking, setPendingVehicleForBooking] = useState<Vehicle | null>(null);
  const [selectedVehicleForDetails, setSelectedVehicleForDetails] = useState<Vehicle | null>(null);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const [pendingBookingData, setPendingBookingData] = useState<Partial<Booking> | null>(null);
  const [heroSearchFilters, setHeroSearchFilters] = useState<{ location?: string; type?: string; date?: string; duration?: string } | null>(null);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');
  const [authNoticeMessage, setAuthNoticeMessage] = useState<string | null>(null);

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [isOwnerVerificationModalOpen, setIsOwnerVerificationModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    setStoredItem(STORAGE_KEYS.USERS, users);
  }, [users]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.CURRENT_USER, currentUser);
    if (currentUser) {
      setUserRole(currentUser.role);
    }
  }, [currentUser]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.BOOKINGS, bookings);
  }, [bookings]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.VEHICLES, vehicles);
  }, [vehicles]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.PROJECTS, projects);
  }, [projects]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.DRIVERS, drivers);
  }, [drivers]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.VERIFICATIONS, verifications);
  }, [verifications]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications]);

  // Trigger login or signup process when visitor opens the website and is not logged in
  useEffect(() => {
    const savedUser = getStoredItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!savedUser) {
      setAuthNoticeMessage('Welcome to BuildHaul! Please sign in or create an account to start booking machinery.');
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    }
  }, []);

  // Sync with Firebase Auth state (e.g. for Google Sign-In)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        setUsers(prev => {
          const existing = prev.find(u => u.email.toLowerCase() === fbUser.email?.toLowerCase() || u.id === fbUser.uid);
          if (existing) {
            setCurrentUser(existing);
            setUserRole(existing.role);
          } else {
            const newUser: User = {
              id: fbUser.uid,
              name: fbUser.displayName || 'Contractor',
              email: fbUser.email || '',
              phone: fbUser.phoneNumber || '+91 98480 23114',
              role: 'customer',
              avatar: fbUser.photoURL || undefined,
              isVerified: true,
              createdAt: new Date().toISOString().split('T')[0]
            };
            setCurrentUser(newUser);
            setUserRole('customer');
            return [...prev, newUser];
          }
          return prev;
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync & Seed with Firestore on mount
  useEffect(() => {
    const syncFromFirestore = async () => {
      try {
        // Automatically ensure collections & documents exist in Firestore database
        await FirestoreService.seedAllDataToFirestore();

        const remoteBookings = await FirestoreService.fetchBookings();
        if (remoteBookings && remoteBookings.length > 0) {
          setBookings(prev => {
            const map = new Map();
            [...prev, ...remoteBookings].forEach(b => map.set(b.id, b));
            return Array.from(map.values());
          });
        }
      } catch (e) {
        console.warn('Initial Firestore sync/seed note:', e);
      }
    };
    syncFromFirestore();
  }, []);

  // Gated booking flow: Ensures user is signed up/signed in before booking
  const startBookingFlow = (vehicle: Vehicle) => {
    if (!currentUser) {
      setPendingVehicleForBooking(vehicle);
      setAuthNoticeMessage(`Please sign up or sign in to book ${vehicle.name}. Your booking details and progress will be securely saved to your account.`);
      setAuthModalMode('signup');
      setIsAuthModalOpen(true);
      return;
    }

    setSelectedVehicleForBooking(vehicle);
    setIsBookingModalOpen(true);
  };

  const login = (user: User) => {
    setCurrentUser(user);
    setUserRole(user.role);
    setIsAuthModalOpen(false);
    setAuthNoticeMessage(null);

    // If user was trying to book a vehicle before signing in, proceed to booking
    if (pendingVehicleForBooking) {
      setSelectedVehicleForBooking(pendingVehicleForBooking);
      setPendingVehicleForBooking(null);
      setIsBookingModalOpen(true);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setUserRole('customer');
    setActiveTab('home');
    setStoredItem(STORAGE_KEYS.CURRENT_USER, null);
    setAuthNoticeMessage('You have logged out. Sign in or register to continue managing machinery.');
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const switchRole = (role: UserRole) => {
    setUserRole(role);
    const targetUser = users.find(u => u.role === role) || {
      id: `usr-${role}-demo`,
      name: role === 'owner' ? 'Ramesh Naidu (Fleet Owner)' : role === 'admin' ? 'BuildHaul Admin' : 'Rahul Varma (Contractor)',
      email: `${role}@buildhaul.in`,
      phone: '+91 98480 23114',
      role: role,
      createdAt: '2025-01-01'
    };
    setCurrentUser(targetUser);
    
    // Automatically transition to the relevant screen for best UX
    if (role === 'admin') {
      setActiveTab('admin');
    } else if (role === 'owner') {
      setActiveTab('dashboard');
    }
  };

  const signUpUser = (newUser: User) => {
    setUsers(prev => {
      const exists = prev.some(u => u.id === newUser.id || u.phone === newUser.phone || u.email === newUser.email);
      if (exists) {
        return prev.map(u => (u.phone === newUser.phone || u.email === newUser.email ? newUser : u));
      }
      return [newUser, ...prev];
    });

    setCurrentUser(newUser);
    setUserRole(newUser.role);
    setIsAuthModalOpen(false);
    setAuthNoticeMessage(null);
    
    // Save to Firestore
    FirestoreService.saveUser(newUser).catch(err => console.warn('Firestore user save note:', err));

    // Trigger welcome notification
    const welcomeNotif: PlatformNotification = {
      id: `notif-${Date.now()}`,
      userId: newUser.id,
      title: 'Welcome to BuildHaul!',
      message: `Your account (${newUser.phone}) has been verified successfully. Start discovering construction vehicles.`,
      type: 'otp',
      read: false,
      timestamp: 'Just now'
    };
    setNotifications(prev => [welcomeNotif, ...prev]);

    // If user was in the middle of booking a vehicle, seamlessly continue!
    if (pendingVehicleForBooking) {
      setSelectedVehicleForBooking(pendingVehicleForBooking);
      setPendingVehicleForBooking(null);
      setIsBookingModalOpen(true);
    }
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    FirestoreService.saveUser(updated).catch(err => console.warn('Firestore profile update note:', err));
  };

  const addVehicle = (vehicleData: Partial<Vehicle>) => {
    const newVehicle: Vehicle = {
      id: `veh-${Date.now().toString().slice(-4)}`,
      name: vehicleData.name || 'Custom Construction Vehicle',
      type: vehicleData.type || 'Heavy Duty Tractor',
      regNumber: vehicleData.regNumber || 'AP 16 XX 0000',
      capacityTons: vehicleData.capacityTons || 3,
      capacityDisplay: `${vehicleData.capacityTons || 3} Ton`,
      pricePerDay: vehicleData.pricePerDay || 2000,
      location: vehicleData.location || 'Vijayawada',
      distanceKm: 4.0,
      driverAvailable: vehicleData.driverAvailable ?? true,
      driverFeePerDay: 700,
      availabilityStatus: 'Available',
      rating: 5.0,
      reviewCount: 0,
      ownerId: currentUser?.id || 'usr-owner-1',
      ownerName: currentUser?.companyName || currentUser?.name || 'Owner Fleet',
      ownerPhone: currentUser?.phone || '+91 94401 88231',
      ownerRating: 5.0,
      image: vehicleData.image || (vehicleData.type === 'Heavy Tipper Truck' ? INITIAL_VEHICLES[0].image : INITIAL_VEHICLES[1].image),
      description: vehicleData.description || 'Verified commercial vehicle in prime condition.',
      specs: {
        fuelType: 'Diesel',
        enginePower: '50 HP',
        bedDimensions: '12ft x 6ft',
        minRentalDays: 1,
        maxPayloadKg: (vehicleData.capacityTons || 3) * 1000,
        yearOfMake: 2024
      },
      coordinates: { lat: 16.5062, lng: 80.6480 },
      isApproved: true,
      documentsVerified: false
    };

    setVehicles(prev => [newVehicle, ...prev]);
    setIsAddVehicleModalOpen(false);
    FirestoreService.saveVehicle(newVehicle).catch(err => console.warn('Firestore vehicle save note:', err));

    // Notification
    const notif: PlatformNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser?.id || 'usr-owner-1',
      title: 'Vehicle Listed Successfully',
      message: `${newVehicle.name} (${newVehicle.regNumber}) has been added to your fleet and is live for bookings.`,
      type: 'system',
      read: false,
      timestamp: 'Just now'
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  };

  const approveVehicle = (id: string, approved: boolean) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, isApproved: approved, documentsVerified: approved } : v));
  };

  const createBooking = (bookingData: Partial<Booking>): Booking => {
    const bookingId = `BH-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking: Booking = {
      id: bookingId,
      customerId: currentUser?.id || 'usr-customer-1',
      customerName: currentUser?.name || 'Rahul Varma',
      customerPhone: currentUser?.phone || '+91 98480 23114',
      vehicleId: bookingData.vehicleId || 'veh-001',
      vehicleName: bookingData.vehicleName || 'BharatBenz Heavy Tipper',
      vehicleType: bookingData.vehicleType || 'Heavy Tipper Truck',
      vehicleImage: bookingData.vehicleImage || INITIAL_VEHICLES[0].image,
      ownerId: bookingData.ownerId || 'usr-owner-1',
      ownerName: bookingData.ownerName || 'Naidu Earthmovers',
      ownerPhone: bookingData.ownerPhone || '+91 94401 88231',
      startDate: bookingData.startDate || new Date().toISOString().split('T')[0],
      endDate: bookingData.endDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      durationDays: bookingData.durationDays || 1,
      pickupLocation: bookingData.pickupLocation || 'Auto Nagar, Vijayawada',
      destination: bookingData.destination || 'Amaravati Site',
      materialType: bookingData.materialType || 'Sand',
      quantity: bookingData.quantity || '1 Load',
      driverRequired: bookingData.driverRequired ?? true,
      vehiclePrice: bookingData.vehiclePrice || 4800,
      driverFee: bookingData.driverFee || 800,
      platformFee: bookingData.platformFee || 280,
      gstAmount: bookingData.gstAmount || 1058,
      totalAmount: bookingData.totalAmount || 6938,
      status: 'Confirmed',
      assignedDriver: bookingData.driverRequired ? {
        name: 'M. Jagadeesh',
        phone: '+91 97011 44520',
        license: 'AP-16-2018-0049211'
      } : undefined,
      paymentStatus: 'Paid',
      paymentMethod: bookingData.paymentMethod || 'UPI (Google Pay)',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBookings(prev => [newBooking, ...prev]);

    // Save to Firestore Database
    FirestoreService.saveBooking(newBooking).catch(err => console.warn('Firestore booking save note:', err));

    // Add notification for customer
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: newBooking.customerId,
        title: 'Booking Confirmed & Saved!',
        message: `Your booking ${newBooking.id} for ${newBooking.vehicleName} is saved to your account and confirmed with the fleet owner.`,
        type: 'booking',
        read: false,
        timestamp: 'Just now'
      },
      ...prev
    ]);

    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    FirestoreService.updateBookingStatus(id, status).catch(err => console.warn('Firestore booking status update note:', err));
  };

  const cancelBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'Cancelled' as const } : b));
    FirestoreService.updateBookingStatus(id, 'Cancelled').catch(err => console.warn('Firestore booking cancel note:', err));
  };

  const addReview = (bookingId: string, review: NonNullable<Booking['review']>) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, review } : b));
    
    // Also recalculate vehicle rating
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (targetBooking) {
      setVehicles(prev => prev.map(v => {
        if (v.id === targetBooking.vehicleId) {
          const newCount = v.reviewCount + 1;
          const newRating = Number(((v.rating * v.reviewCount + review.overallRating) / newCount).toFixed(1));
          return { ...v, rating: newRating, reviewCount: newCount };
        }
        return v;
      }));
    }
    setIsReviewModalOpen(false);
  };

  const createProject = (projectData: Partial<Project>) => {
    const newProj: Project = {
      id: `proj-${Date.now().toString().slice(-4)}`,
      customerId: currentUser?.id || 'usr-customer-1',
      name: projectData.name || 'New Construction Site Project',
      location: projectData.location || 'Vijayawada Bypass',
      durationDays: projectData.durationDays || 30,
      startDate: projectData.startDate || new Date().toISOString().split('T')[0],
      status: 'Active',
      fleetAllocations: projectData.fleetAllocations || [{ type: 'Heavy Duty Tractor', count: 1 }],
      bookedVehicleIds: [],
      todayTrips: 0,
      materialsMovedTons: 0,
      estimatedBudget: projectData.estimatedBudget || 150000,
      spentAmount: 0,
      notes: projectData.notes || 'Site excavation and foundation setup.'
    };
    setProjects(prev => [newProj, ...prev]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addDriver = (driverData: Partial<Driver>) => {
    const newDriver: Driver = {
      id: `drv-${Date.now().toString().slice(-4)}`,
      ownerId: currentUser?.id || 'usr-owner-1',
      name: driverData.name || 'Driver Name',
      phone: driverData.phone || '+91 98000 00000',
      licenseNumber: driverData.licenseNumber || 'AP-16-COMMERCIAL',
      experienceYears: driverData.experienceYears || 5,
      rating: 4.8,
      status: 'Available',
      currentVehicleId: driverData.currentVehicleId
    };
    setDrivers(prev => [newDriver, ...prev]);
  };

  const submitVerification = (verificationData: Partial<OwnerVerification>) => {
    const newVerif: OwnerVerification = {
      id: `ver-${Date.now().toString().slice(-4)}`,
      ownerId: currentUser?.id || 'usr-owner-1',
      ownerName: currentUser?.companyName || currentUser?.name || 'Owner Fleet',
      ownerPhone: currentUser?.phone || '+91 94401 88231',
      idProofName: verificationData.idProofName || 'Identity_Proof_Doc.pdf',
      rcDocName: verificationData.rcDocName || 'Vehicle_RC_Certificate.pdf',
      licenseName: verificationData.licenseName || 'Commercial_Driving_License.pdf',
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Pending',
      notes: 'Submitted for verification by owner.'
    };
    setVerifications(prev => [newVerif, ...prev]);
    setIsOwnerVerificationModalOpen(false);
  };

  const reviewVerification = (id: string, status: 'Verified' | 'Rejected', notes?: string) => {
    setVerifications(prev => prev.map(v => v.id === id ? { ...v, status, notes: notes || v.notes } : v));
  };

  const toggleCompare = (vehicleId: string) => {
    setCompareVehicleIds(prev => {
      if (prev.includes(vehicleId)) {
        return prev.filter(id => id !== vehicleId);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, vehicleId];
    });
  };

  const removeFromCompare = (vehicleId: string) => {
    setCompareVehicleIds(prev => prev.filter(id => id !== vehicleId));
  };

  const clearCompare = () => {
    setCompareVehicleIds([]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const suspendUser = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isVerified: false } : u));
  };

  const activateUser = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isVerified: true } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userRole,
        activeTab,
        setActiveTab,
        users,
        vehicles,
        bookings,
        projects,
        drivers,
        verifications,
        notifications,
        compareVehicleIds,
        selectedVehicleForBooking,
        setSelectedVehicleForBooking,
        selectedVehicleForDetails,
        setSelectedVehicleForDetails,
        selectedBookingForReview,
        setSelectedBookingForReview,
        isBookingModalOpen,
        setIsBookingModalOpen,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        authNoticeMessage,
        setAuthNoticeMessage,
        startBookingFlow,
        isCompareModalOpen,
        setIsCompareModalOpen,
        isAddVehicleModalOpen,
        setIsAddVehicleModalOpen,
        isOwnerVerificationModalOpen,
        setIsOwnerVerificationModalOpen,
        isReviewModalOpen,
        setIsReviewModalOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        pendingBookingData,
        setPendingBookingData,
        heroSearchFilters,
        setHeroSearchFilters,
        login,
        logout,
        switchRole,
        signUpUser,
        updateUserProfile,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        approveVehicle,
        createBooking,
        updateBookingStatus,
        cancelBooking,
        addReview,
        createProject,
        updateProject,
        addDriver,
        submitVerification,
        reviewVerification,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        markNotificationRead,
        markAllNotificationsRead,
        suspendUser,
        activateUser,
        deleteUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
