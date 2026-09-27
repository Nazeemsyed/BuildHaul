export type UserRole = 'customer' | 'owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  address?: string;
  companyName?: string;
  isVerified?: boolean;
  createdAt: string;
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    bookingAlerts: boolean;
  };
}

export type VehicleType = 
  | 'Heavy Tipper Truck'
  | 'Heavy Duty Tractor'
  | 'Mini Truck Carrier'
  | 'Wheel Loader'
  | 'Hydraulic Excavator'
  | 'Open-Top 4-Wheeler';

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  regNumber: string;
  capacityTons: number;
  capacityDisplay: string;
  pricePerDay: number;
  location: string;
  distanceKm: number;
  driverAvailable: boolean;
  driverFeePerDay: number;
  availabilityStatus: 'Available' | 'Booked' | 'Maintenance';
  rating: number;
  reviewCount: number;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerRating: number;
  image: string;
  description: string;
  specs: {
    fuelType: string;
    enginePower: string;
    bedDimensions: string;
    minRentalDays: number;
    maxPayloadKg: number;
    yearOfMake: number;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  isApproved: boolean;
  documentsVerified: boolean;
}

export type BookingStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Driver Assigned'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export type MaterialType = 
  | 'Sand'
  | 'Bricks'
  | 'Gravel'
  | 'Cement'
  | 'Construction Waste'
  | 'Soil'
  | 'Steel & Rebar'
  | 'Other';

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  vehicleId: string;
  vehicleName: string;
  vehicleType: VehicleType;
  vehicleImage: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  pickupLocation: string;
  destination: string;
  materialType: MaterialType;
  quantity: string;
  driverRequired: boolean;
  vehiclePrice: number;
  driverFee: number;
  platformFee: number;
  gstAmount: number;
  totalAmount: number;
  status: BookingStatus;
  assignedDriver?: {
    name: string;
    phone: string;
    license: string;
  };
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  paymentMethod: string;
  createdAt: string;
  review?: {
    vehicleRating: number;
    driverRating: number;
    onTimeRating: number;
    overallRating: number;
    comment: string;
    createdAt: string;
  };
}

export interface Project {
  id: string;
  customerId: string;
  name: string;
  location: string;
  durationDays: number;
  startDate: string;
  status: 'Active' | 'Completed' | 'Planning';
  fleetAllocations: {
    type: VehicleType;
    count: number;
  }[];
  bookedVehicleIds: string[];
  todayTrips: number;
  materialsMovedTons: number;
  estimatedBudget: number;
  spentAmount: number;
  notes: string;
}

export interface Driver {
  id: string;
  ownerId: string;
  name: string;
  phone: string;
  licenseNumber: string;
  experienceYears: number;
  rating: number;
  status: 'Available' | 'On Trip' | 'Off Duty';
  currentVehicleId?: string;
}

export interface OwnerVerification {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  idProofName: string;
  rcDocName: string;
  licenseName: string;
  submittedAt: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  notes?: string;
}

export interface PlatformNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'otp' | 'verification' | 'payment' | 'system';
  read: boolean;
  timestamp: string;
}

export interface AiRecommendationResult {
  recommendedCategory: VehicleType;
  machineTitle: string;
  reason: string;
  payloadBreakdown: string;
  estimatedTrips: number;
  estimatedCostMin: number;
  estimatedCostMax: number;
  alternativeOptions: {
    category: VehicleType;
    reason: string;
  }[];
}
