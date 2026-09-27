import { Vehicle, Booking, Project, Driver, OwnerVerification, User, PlatformNotification } from '../types';

export const HERO_IMAGE = '/src/assets/images/buildhaul_hero_fleet_1790522681744.jpg';
export const TRUCK_IMAGE = '/src/assets/images/heavy_tipper_truck_1790522702140.jpg';
export const TRACTOR_IMAGE = '/src/assets/images/heavy_duty_tractor_1790522718039.jpg';
export const MINI_TRUCK_IMAGE = '/src/assets/images/mini_truck_carrier_1790522734364.jpg';
export const LOADER_IMAGE = '/src/assets/images/wheel_loader_excavator_1790522749473.jpg';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-customer-1',
    name: 'Rahul Varma',
    email: 'rahul.varma@infraprojects.in',
    phone: '+91 98480 23114',
    role: 'customer',
    companyName: 'Varma Infra & Builders',
    address: 'Plot 42, Benz Circle, Vijayawada, AP 520010',
    isVerified: true,
    createdAt: '2025-11-14',
    notificationPreferences: {
      email: true,
      sms: true,
      whatsapp: true,
      bookingAlerts: true
    }
  },
  {
    id: 'usr-owner-1',
    name: 'Ramesh Naidu',
    email: 'ramesh.fleets@gmail.com',
    phone: '+91 94401 88231',
    role: 'owner',
    companyName: 'Naidu Earthmovers & Transport',
    address: 'Near Auto Nagar Gate 3, Vijayawada, AP 520007',
    isVerified: true,
    createdAt: '2025-08-20',
    notificationPreferences: {
      email: true,
      sms: true,
      whatsapp: true,
      bookingAlerts: true
    }
  },
  {
    id: 'usr-owner-2',
    name: 'K. Venkatesh Rao',
    email: 'venkat.heavyhaul@gmail.com',
    phone: '+91 91772 34561',
    role: 'owner',
    companyName: 'Krishna Delta Heavy Logistics',
    address: 'NH-16 Bypass, Gannavaram, AP 521101',
    isVerified: true,
    createdAt: '2025-09-10',
    notificationPreferences: {
      email: true,
      sms: true,
      whatsapp: true,
      bookingAlerts: true
    }
  },
  {
    id: 'usr-admin-1',
    name: 'BuildHaul Admin',
    email: 'admin@buildhaul.in',
    phone: '+91 99890 00100',
    role: 'admin',
    companyName: 'BuildHaul Operations HQ',
    address: 'Tech Enclave, Amaravati Road, Vijayawada, AP',
    isVerified: true,
    createdAt: '2025-01-01',
    notificationPreferences: {
      email: true,
      sms: true,
      whatsapp: true,
      bookingAlerts: true
    }
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-001',
    name: 'BharatBenz 2823R Heavy Tipper',
    type: 'Heavy Tipper Truck',
    regNumber: 'AP 16 TE 4821',
    capacityTons: 14,
    capacityDisplay: '14 Ton (16 Cu.M)',
    pricePerDay: 4800,
    location: 'Vijayawada Auto Nagar',
    distanceKm: 3.8,
    driverAvailable: true,
    driverFeePerDay: 800,
    availabilityStatus: 'Available',
    rating: 4.9,
    reviewCount: 42,
    ownerId: 'usr-owner-1',
    ownerName: 'Naidu Earthmovers',
    ownerPhone: '+91 94401 88231',
    ownerRating: 4.9,
    image: TRUCK_IMAGE,
    description: 'High-power 10-wheeler hydraulic tipper ideal for crushed blue metal gravel, river sand, and high-volume foundation transport.',
    specs: {
      fuelType: 'Diesel BS-VI',
      enginePower: '240 HP',
      bedDimensions: '16ft x 7.5ft x 5ft',
      minRentalDays: 1,
      maxPayloadKg: 14000,
      yearOfMake: 2024
    },
    coordinates: { lat: 16.4952, lng: 80.6721 },
    isApproved: true,
    documentsVerified: true
  },
  {
    id: 'veh-002',
    name: 'Mahindra 575 DI Heavy Tractor & Trailer',
    type: 'Heavy Duty Tractor',
    regNumber: 'AP 16 BN 9032',
    capacityTons: 4,
    capacityDisplay: '4 Ton Heavy Trailer',
    pricePerDay: 1800,
    location: 'Vijayawada - Gollapudi',
    distanceKm: 5.2,
    driverAvailable: true,
    driverFeePerDay: 600,
    availabilityStatus: 'Available',
    rating: 4.8,
    reviewCount: 38,
    ownerId: 'usr-owner-1',
    ownerName: 'Naidu Earthmovers',
    ownerPhone: '+91 94401 88231',
    ownerRating: 4.9,
    image: TRACTOR_IMAGE,
    description: 'Rugged hydraulic tipping tractor trailer. Perfect for rural sites, red brick transport, soil grading, and unpaved site approaches.',
    specs: {
      fuelType: 'Diesel',
      enginePower: '45 HP',
      bedDimensions: '11ft x 6ft x 2.5ft',
      minRentalDays: 1,
      maxPayloadKg: 4000,
      yearOfMake: 2023
    },
    coordinates: { lat: 16.5312, lng: 80.5982 },
    isApproved: true,
    documentsVerified: true
  },
  {
    id: 'veh-003',
    name: 'Tata Ace Gold High Deck Mini Truck',
    type: 'Mini Truck Carrier',
    regNumber: 'AP 16 CZ 7712',
    capacityTons: 1.2,
    capacityDisplay: '1.2 Ton (850 kg payload)',
    pricePerDay: 1200,
    location: 'Gannavaram Airport Road',
    distanceKm: 7.4,
    driverAvailable: true,
    driverFeePerDay: 500,
    availabilityStatus: 'Available',
    rating: 4.7,
    reviewCount: 29,
    ownerId: 'usr-owner-2',
    ownerName: 'Krishna Delta Logistics',
    ownerPhone: '+91 91772 34561',
    ownerRating: 4.8,
    image: MINI_TRUCK_IMAGE,
    description: 'Agile 4-wheeler urban material mover. Ideal for cement bags, electrical conduits, plumbing pipes, tiles, and tight street access.',
    specs: {
      fuelType: 'CNG / Diesel',
      enginePower: '30 HP',
      bedDimensions: '7.2ft x 4.9ft x 1.5ft',
      minRentalDays: 1,
      maxPayloadKg: 1200,
      yearOfMake: 2024
    },
    coordinates: { lat: 16.5411, lng: 80.7932 },
    isApproved: true,
    documentsVerified: true
  },
  {
    id: 'veh-004',
    name: 'JCB 432ZX Heavy Wheel Loader',
    type: 'Wheel Loader',
    regNumber: 'AP 16 WL 2021',
    capacityTons: 3.5,
    capacityDisplay: '1.8 Cu.M Bucket / 3.5 Ton',
    pricePerDay: 6500,
    location: 'Mangalagiri Industrial Zone',
    distanceKm: 9.1,
    driverAvailable: true,
    driverFeePerDay: 1000,
    availabilityStatus: 'Available',
    rating: 4.9,
    reviewCount: 19,
    ownerId: 'usr-owner-2',
    ownerName: 'Krishna Delta Logistics',
    ownerPhone: '+91 91772 34561',
    ownerRating: 4.8,
    image: LOADER_IMAGE,
    description: 'Heavy wheel loader with high-breakout bucket for fast stockpile loading of gravel, sand, backfilling trenches, and site leveling.',
    specs: {
      fuelType: 'Diesel Turbo',
      enginePower: '150 HP',
      bedDimensions: 'Front articulated loader',
      minRentalDays: 1,
      maxPayloadKg: 3500,
      yearOfMake: 2023
    },
    coordinates: { lat: 16.4328, lng: 80.5621 },
    isApproved: true,
    documentsVerified: true
  },
  {
    id: 'veh-005',
    name: 'Tata Signa 2825.K Tri-Axle Dumper',
    type: 'Heavy Tipper Truck',
    regNumber: 'AP 16 DG 3390',
    capacityTons: 16,
    capacityDisplay: '16 Ton Heavy Tipper',
    pricePerDay: 5200,
    location: 'Guntur Ring Road',
    distanceKm: 18.5,
    driverAvailable: true,
    driverFeePerDay: 800,
    availabilityStatus: 'Available',
    rating: 4.8,
    reviewCount: 31,
    ownerId: 'usr-owner-1',
    ownerName: 'Naidu Earthmovers',
    ownerPhone: '+91 94401 88231',
    ownerRating: 4.9,
    image: TRUCK_IMAGE,
    description: 'Extra payload tri-axle tipper for highway projects, heavy stone boulders, and large commercial foundation excavation muck disposal.',
    specs: {
      fuelType: 'Diesel BS-VI',
      enginePower: '250 HP',
      bedDimensions: '18ft x 8ft x 5.5ft',
      minRentalDays: 2,
      maxPayloadKg: 16000,
      yearOfMake: 2024
    },
    coordinates: { lat: 16.3067, lng: 80.4365 },
    isApproved: true,
    documentsVerified: true
  },
  {
    id: 'veh-006',
    name: 'John Deere 5310 4WD Heavy Tractor',
    type: 'Heavy Duty Tractor',
    regNumber: 'AP 16 JD 5510',
    capacityTons: 5,
    capacityDisplay: '5 Ton Reinforced Bed',
    pricePerDay: 2100,
    location: 'Amaravati Capital Region',
    distanceKm: 12.0,
    driverAvailable: true,
    driverFeePerDay: 600,
    availabilityStatus: 'Available',
    rating: 4.9,
    reviewCount: 24,
    ownerId: 'usr-owner-1',
    ownerName: 'Naidu Earthmovers',
    ownerPhone: '+91 94401 88231',
    ownerRating: 4.9,
    image: TRACTOR_IMAGE,
    description: 'High torque 4WD tractor equipped with dual-axle hydraulic tipping trolley, suitable for soft soil and mud construction terrains.',
    specs: {
      fuelType: 'Diesel',
      enginePower: '55 HP',
      bedDimensions: '12ft x 6.5ft x 3ft',
      minRentalDays: 1,
      maxPayloadKg: 5000,
      yearOfMake: 2024
    },
    coordinates: { lat: 16.5186, lng: 80.5184 },
    isApproved: true,
    documentsVerified: true
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BH-88421',
    customerId: 'usr-customer-1',
    customerName: 'Rahul Varma',
    customerPhone: '+91 98480 23114',
    vehicleId: 'veh-001',
    vehicleName: 'BharatBenz 2823R Heavy Tipper',
    vehicleType: 'Heavy Tipper Truck',
    vehicleImage: TRUCK_IMAGE,
    ownerId: 'usr-owner-1',
    ownerName: 'Naidu Earthmovers',
    ownerPhone: '+91 94401 88231',
    startDate: '2026-09-28',
    endDate: '2026-09-30',
    durationDays: 3,
    pickupLocation: 'Krishna River Sand Reach, Ibrahimpatnam',
    destination: 'Site 12B, Amaravati Smart City Phase 1',
    materialType: 'Sand',
    quantity: '28 Tons (2 Loads)',
    driverRequired: true,
    vehiclePrice: 14400,
    driverFee: 2400,
    platformFee: 840,
    gstAmount: 3175,
    totalAmount: 20815,
    status: 'In Progress',
    assignedDriver: {
      name: 'M. Jagadeesh',
      phone: '+91 97011 44520',
      license: 'AP-16-2018-0049211'
    },
    paymentStatus: 'Paid',
    paymentMethod: 'UPI (Google Pay)',
    createdAt: '2026-09-25'
  },
  {
    id: 'BH-88319',
    customerId: 'usr-customer-1',
    customerName: 'Rahul Varma',
    customerPhone: '+91 98480 23114',
    vehicleId: 'veh-002',
    vehicleName: 'Mahindra 575 DI Heavy Tractor & Trailer',
    vehicleType: 'Heavy Duty Tractor',
    vehicleImage: TRACTOR_IMAGE,
    ownerId: 'usr-owner-1',
    ownerName: 'Naidu Earthmovers',
    ownerPhone: '+91 94401 88231',
    startDate: '2026-09-29',
    endDate: '2026-09-29',
    durationDays: 1,
    pickupLocation: 'Brick Kiln Zone, Kankipadu',
    destination: 'Plot 42, Benz Circle, Vijayawada',
    materialType: 'Bricks',
    quantity: '3,500 Clay Bricks',
    driverRequired: true,
    vehiclePrice: 1800,
    driverFee: 600,
    platformFee: 120,
    gstAmount: 453,
    totalAmount: 2973,
    status: 'Confirmed',
    assignedDriver: {
      name: 'Ch. Srinivas',
      phone: '+91 98492 11984',
      license: 'AP-16-2019-0081290'
    },
    paymentStatus: 'Paid',
    paymentMethod: 'Net Banking (HDFC)',
    createdAt: '2026-09-26'
  },
  {
    id: 'BH-87902',
    customerId: 'usr-customer-1',
    customerName: 'Rahul Varma',
    customerPhone: '+91 98480 23114',
    vehicleId: 'veh-003',
    vehicleName: 'Tata Ace Gold High Deck Mini Truck',
    vehicleType: 'Mini Truck Carrier',
    vehicleImage: MINI_TRUCK_IMAGE,
    ownerId: 'usr-owner-2',
    ownerName: 'Krishna Delta Logistics',
    ownerPhone: '+91 91772 34561',
    startDate: '2026-09-20',
    endDate: '2026-09-21',
    durationDays: 2,
    pickupLocation: 'UltraTech Cement Depot, Gunadala',
    destination: 'Varma Heights, Labbipet, Vijayawada',
    materialType: 'Cement',
    quantity: '40 Bags (2 Tons)',
    driverRequired: true,
    vehiclePrice: 2400,
    driverFee: 1000,
    platformFee: 170,
    gstAmount: 642,
    totalAmount: 4212,
    status: 'Completed',
    assignedDriver: {
      name: 'Sk. Karimullah',
      phone: '+91 93902 55102',
      license: 'AP-16-2020-0012948'
    },
    paymentStatus: 'Paid',
    paymentMethod: 'UPI (PhonePe)',
    createdAt: '2026-09-18',
    review: {
      vehicleRating: 5,
      driverRating: 5,
      onTimeRating: 5,
      overallRating: 5,
      comment: 'Excellent service! Driver arrived right on schedule at the cement depot. Very clean vehicle and prompt delivery into tight city streets.',
      createdAt: '2026-09-21'
    }
  },
  {
    id: 'BH-89104',
    customerId: 'usr-customer-1',
    customerName: 'Rahul Varma',
    customerPhone: '+91 98480 23114',
    vehicleId: 'veh-004',
    vehicleName: 'JCB 432ZX Heavy Wheel Loader',
    vehicleType: 'Wheel Loader',
    vehicleImage: LOADER_IMAGE,
    ownerId: 'usr-owner-2',
    ownerName: 'Krishna Delta Logistics',
    ownerPhone: '+91 91772 34561',
    startDate: '2026-10-02',
    endDate: '2026-10-04',
    durationDays: 3,
    pickupLocation: 'Mangalagiri Industrial Zone',
    destination: 'Amaravati Commercial Hub site',
    materialType: 'Construction Waste',
    quantity: 'Site Muck & Leveling',
    driverRequired: true,
    vehiclePrice: 19500,
    driverFee: 3000,
    platformFee: 1125,
    gstAmount: 4252,
    totalAmount: 27877,
    status: 'Pending',
    paymentStatus: 'Pending',
    paymentMethod: 'Site Pay / Pay on Arrival',
    createdAt: '2026-09-27'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    customerId: 'usr-customer-1',
    name: 'Vijayawada Commercial Hub Phase 2',
    location: 'Near Benz Circle & Ring Road, Vijayawada',
    durationDays: 60,
    startDate: '2026-09-15',
    status: 'Active',
    fleetAllocations: [
      { type: 'Heavy Duty Tractor', count: 2 },
      { type: 'Heavy Tipper Truck', count: 1 },
      { type: 'Mini Truck Carrier', count: 1 }
    ],
    bookedVehicleIds: ['veh-001', 'veh-002', 'veh-003'],
    todayTrips: 8,
    materialsMovedTons: 145,
    estimatedBudget: 380000,
    spentAmount: 84500,
    notes: 'Basement foundation leveling in progress. Requires steady sand supply and soil disposal to Enikepadu dump yard.'
  },
  {
    id: 'proj-002',
    customerId: 'usr-customer-1',
    name: 'Amaravati Residential Villa Complex',
    location: 'Sector 4, Amaravati Capital Township',
    durationDays: 90,
    startDate: '2026-10-01',
    status: 'Planning',
    fleetAllocations: [
      { type: 'Wheel Loader', count: 1 },
      { type: 'Heavy Tipper Truck', count: 2 },
      { type: 'Heavy Duty Tractor', count: 1 }
    ],
    bookedVehicleIds: [],
    todayTrips: 0,
    materialsMovedTons: 0,
    estimatedBudget: 620000,
    spentAmount: 0,
    notes: 'Ground clearing, boundary grading and internal 40ft road formation.'
  }
];

export const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'drv-01',
    ownerId: 'usr-owner-1',
    name: 'M. Jagadeesh',
    phone: '+91 97011 44520',
    licenseNumber: 'AP-16-2018-0049211',
    experienceYears: 8,
    rating: 4.9,
    status: 'On Trip',
    currentVehicleId: 'veh-001'
  },
  {
    id: 'drv-02',
    ownerId: 'usr-owner-1',
    name: 'Ch. Srinivas',
    phone: '+91 98492 11984',
    licenseNumber: 'AP-16-2019-0081290',
    experienceYears: 6,
    rating: 4.8,
    status: 'Available',
    currentVehicleId: 'veh-002'
  },
  {
    id: 'drv-03',
    ownerId: 'usr-owner-2',
    name: 'Sk. Karimullah',
    phone: '+91 93902 55102',
    licenseNumber: 'AP-16-2020-0012948',
    experienceYears: 5,
    rating: 4.7,
    status: 'Available',
    currentVehicleId: 'veh-003'
  },
  {
    id: 'drv-04',
    ownerId: 'usr-owner-2',
    name: 'K. Nageswara Rao',
    phone: '+91 94903 88122',
    licenseNumber: 'AP-16-2015-0077812',
    experienceYears: 12,
    rating: 5.0,
    status: 'Available',
    currentVehicleId: 'veh-004'
  }
];

export const INITIAL_VERIFICATIONS: OwnerVerification[] = [
  {
    id: 'ver-001',
    ownerId: 'usr-owner-1',
    ownerName: 'Ramesh Naidu (Naidu Earthmovers)',
    ownerPhone: '+91 94401 88231',
    idProofName: 'Aadhaar_Card_Ramesh_Naidu.pdf',
    rcDocName: 'RC_AP16TE4821_BharatBenz.pdf',
    licenseName: 'Commercial_Heavy_DL_AP.pdf',
    submittedAt: '2026-09-12',
    status: 'Verified',
    notes: 'All documents verified with Parivahan portal & Vahan database.'
  },
  {
    id: 'ver-002',
    ownerId: 'usr-owner-2',
    ownerName: 'K. Venkatesh Rao (Krishna Delta Logistics)',
    ownerPhone: '+91 91772 34561',
    idProofName: 'PAN_Card_Venkatesh_Rao.pdf',
    rcDocName: 'RC_JCB_432ZX_AP16WL2021.pdf',
    licenseName: 'Transport_DL_K_Venkatesh.pdf',
    submittedAt: '2026-09-22',
    status: 'Verified',
    notes: 'Authorized fleet operator.'
  },
  {
    id: 'ver-003',
    ownerId: 'usr-owner-new',
    ownerName: 'B. Apparao Heavy Fleet',
    ownerPhone: '+91 98850 11920',
    idProofName: 'Aadhaar_B_Apparao.pdf',
    rcDocName: 'RC_AP16TJ9981_TataLPT.pdf',
    licenseName: 'Heavy_Vehicle_DL.pdf',
    submittedAt: '2026-09-26',
    status: 'Pending',
    notes: 'Awaiting admin RC document verification.'
  }
];

export const INITIAL_NOTIFICATIONS: PlatformNotification[] = [
  {
    id: 'notif-1',
    userId: 'usr-customer-1',
    title: 'Trip in Progress',
    message: 'BharatBenz 2823R (BH-88421) is currently loading sand at Ibrahimpatnam Reach.',
    type: 'booking',
    read: false,
    timestamp: '20 mins ago'
  },
  {
    id: 'notif-2',
    userId: 'usr-customer-1',
    title: 'Booking Confirmed',
    message: 'Mahindra 575 DI Tractor (BH-88319) confirmed for tomorrow 8:00 AM.',
    type: 'booking',
    read: false,
    timestamp: '2 hours ago'
  },
  {
    id: 'notif-3',
    userId: 'usr-owner-1',
    title: 'New Booking Request',
    message: 'New request for Heavy Tipper Truck for 3 days from Rahul Varma.',
    type: 'booking',
    read: true,
    timestamp: '1 day ago'
  },
  {
    id: 'notif-4',
    userId: 'usr-owner-1',
    title: 'Fleet Document Verified',
    message: 'Admin has verified RC documents for AP 16 TE 4821.',
    type: 'verification',
    read: true,
    timestamp: '2 days ago'
  }
];

export const POPULAR_LOCATIONS = [
  'Vijayawada - Benz Circle',
  'Vijayawada - Auto Nagar',
  'Vijayawada - Gollapudi',
  'Gannavaram - Airport Highway',
  'Mangalagiri - AIIMS & IT SEZ',
  'Amaravati - Capital Core Zone',
  'Guntur - Inner Ring Road',
  'Ibrahimpatnam - Sand Reach',
  'Tadepalli - Highway Zone'
];
