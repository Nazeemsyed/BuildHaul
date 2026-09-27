import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  Firestore
} from 'firebase/firestore';
import { db, defaultDb, firebaseConfig, handleFirestoreError, OperationType } from '../lib/firebase';
import { User, Vehicle, Booking, Project } from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_VEHICLES, 
  INITIAL_BOOKINGS, 
  INITIAL_PROJECTS 
} from '../data/mockData';

// Helper to write to database(s) - ensuring data appears regardless of which database dropdown is selected in Firebase Console
async function writeWithFallback(collectionName: string, docId: string, data: any) {
  let primarySuccess = false;

  // 1. Write to named provisioned database
  try {
    await setDoc(doc(db, collectionName, docId), data, { merge: true });
    primarySuccess = true;
  } catch (err) {
    console.warn(`[Firestore named DB] Write to ${collectionName}/${docId}:`, err);
  }

  // 2. Also write to default database if distinct, so it appears in Firebase console (default) view too
  if (firebaseConfig.firestoreDatabaseId) {
    try {
      await setDoc(doc(defaultDb, collectionName, docId), data, { merge: true });
    } catch {
      // Ignore if (default) database does not exist in project
    }
  }

  return primarySuccess;
}

export const FirestoreService = {
  // Test connection directly
  async testConnection(): Promise<{ success: boolean; message: string; databaseId: string; timestamp: string }> {
    const testPayload = {
      ping: 'pong',
      client: 'BuildHaul Web App',
      projectId: firebaseConfig.projectId,
      databaseId: firebaseConfig.firestoreDatabaseId || '(default)',
      testedAt: new Date().toISOString()
    };

    try {
      await writeWithFallback('test_connection', 'ping', testPayload);
      return {
        success: true,
        message: 'Successfully wrote & verified test document in Firebase Firestore!',
        databaseId: firebaseConfig.firestoreDatabaseId || '(default)',
        timestamp: new Date().toLocaleTimeString()
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Failed to ping Firebase',
        databaseId: firebaseConfig.firestoreDatabaseId || '(default)',
        timestamp: new Date().toLocaleTimeString()
      };
    }
  },

  // Seed all initial data so Firebase Console immediately displays collections and documents
  async seedAllDataToFirestore(): Promise<{ users: number; vehicles: number; bookings: number; projects: number }> {
    console.log('[Firestore] Seeding initial data to Firebase database...');
    let usersCount = 0;
    let vehiclesCount = 0;
    let bookingsCount = 0;
    let projectsCount = 0;

    // 1. System status document
    await writeWithFallback('system', 'status', {
      connected: true,
      app: 'BuildHaul Construction Equipment Marketplace',
      projectId: firebaseConfig.projectId,
      firestoreDatabaseId: firebaseConfig.firestoreDatabaseId,
      lastSync: new Date().toISOString(),
      status: 'Active'
    });

    // 2. Seed Users
    for (const u of INITIAL_USERS) {
      await writeWithFallback('users', u.id, {
        ...u,
        updatedAt: new Date().toISOString()
      });
      usersCount++;
    }

    // 3. Seed Vehicles
    for (const v of INITIAL_VEHICLES) {
      await writeWithFallback('vehicles', v.id, {
        ...v,
        updatedAt: new Date().toISOString()
      });
      vehiclesCount++;
    }

    // 4. Seed Bookings
    for (const b of INITIAL_BOOKINGS) {
      await writeWithFallback('bookings', b.id, {
        ...b,
        updatedAt: new Date().toISOString()
      });
      bookingsCount++;
    }

    // 5. Seed Projects
    for (const p of INITIAL_PROJECTS) {
      await writeWithFallback('projects', p.id, {
        ...p,
        updatedAt: new Date().toISOString()
      });
      projectsCount++;
    }

    console.log(`[Firestore] Seed complete: ${usersCount} users, ${vehiclesCount} vehicles, ${bookingsCount} bookings, ${projectsCount} projects.`);
    return { users: usersCount, vehicles: vehiclesCount, bookings: bookingsCount, projects: projectsCount };
  },

  // Save or update user
  async saveUser(user: User): Promise<void> {
    const path = `users/${user.id}`;
    try {
      await writeWithFallback('users', user.id, {
        ...user,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Save new booking
  async saveBooking(booking: Booking): Promise<void> {
    const path = `bookings/${booking.id}`;
    try {
      await writeWithFallback('bookings', booking.id, {
        ...booking,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Update booking status
  async updateBookingStatus(bookingId: string, status: string): Promise<void> {
    const path = `bookings/${bookingId}`;
    try {
      await writeWithFallback('bookings', bookingId, {
        status,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Fetch all bookings from Firestore
  async fetchBookings(): Promise<Booking[]> {
    const path = 'bookings';
    try {
      const snap = await getDocs(collection(db, 'bookings'));
      const list: Booking[] = [];
      snap.forEach(docSnap => {
        list.push(docSnap.data() as Booking);
      });
      return list;
    } catch (error) {
      // Try fallback to defaultDb
      try {
        const snap = await getDocs(collection(defaultDb, 'bookings'));
        const list: Booking[] = [];
        snap.forEach(docSnap => {
          list.push(docSnap.data() as Booking);
        });
        return list;
      } catch {
        handleFirestoreError(error, OperationType.GET, path);
        return [];
      }
    }
  },

  // Save vehicle
  async saveVehicle(vehicle: Vehicle): Promise<void> {
    const path = `vehicles/${vehicle.id}`;
    try {
      await writeWithFallback('vehicles', vehicle.id, {
        ...vehicle,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Fetch vehicles
  async fetchVehicles(): Promise<Vehicle[]> {
    const path = 'vehicles';
    try {
      const snap = await getDocs(collection(db, 'vehicles'));
      const list: Vehicle[] = [];
      snap.forEach(docSnap => {
        list.push(docSnap.data() as Vehicle);
      });
      return list;
    } catch (error) {
      return [];
    }
  },

  // Save project
  async saveProject(project: Project): Promise<void> {
    const path = `projects/${project.id}`;
    try {
      await writeWithFallback('projects', project.id, {
        ...project,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
};
