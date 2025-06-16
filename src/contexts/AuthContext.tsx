
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useToast } from '../hooks/use-toast';

interface User {
  uid: string;
  email: string;
  role: 'admin' | 'student' | 'staff';
  name?: string;
  points?: number;
  badges?: string[];
  assignedBuildings?: string[]; // For staff
  preferences?: {
    notifications: boolean;
    language: string;
    accessibility: boolean;
    bookmarks: string[];
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  setTestUser: (role: 'admin' | 'student' | 'staff') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Valid roles for the application
const VALID_ROLES = ['admin', 'student', 'staff'] as const;

const validateRole = (role: string): role is 'admin' | 'student' | 'staff' => {
  return VALID_ROLES.includes(role as any);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // Set to false for testing
  const { toast } = useToast();

  // TEST MODE: Set a test user directly
  const setTestUser = (role: 'admin' | 'student' | 'staff') => {
    const testUsers = {
      admin: {
        uid: 'test-admin-uid',
        email: 'admin@afit.edu.ng',
        role: 'admin' as const,
        name: 'Test Administrator',
      },
      staff: {
        uid: 'test-staff-uid',
        email: 'staff@afit.edu.ng',
        role: 'staff' as const,
        name: 'Test Staff Member',
        assignedBuildings: ['building-1', 'building-2'],
        preferences: {
          notifications: true,
          language: 'en',
          accessibility: false,
          bookmarks: []
        }
      },
      student: {
        uid: 'test-student-uid',
        email: 'student@afit.edu.ng',
        role: 'student' as const,
        name: 'Test Student',
        points: 150,
        badges: ['Newcomer', 'Explorer'],
        preferences: {
          notifications: true,
          language: 'en',
          accessibility: false,
          bookmarks: ['building-1', 'event-1']
        }
      }
    };
    
    setUser(testUsers[role]);
    toast({
      title: "Test Mode",
      description: `Logged in as ${role}`,
    });
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful for:', userCredential.user.email);
      toast({
        title: "Success",
        description: "Successfully logged in!",
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Failed to log in",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string, role: string) => {
    try {
      console.log('Attempting signup for:', email, 'with role:', role);
      
      // Validate role before creating account
      if (!validateRole(role)) {
        throw new Error('Invalid role selected');
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Create user document in Firestore with validated role
      const userData = {
        email: firebaseUser.email,
        name: name,
        role: role as 'admin' | 'student' | 'staff',
        points: role === 'student' ? 0 : undefined, // Only students get points
        badges: role === 'student' ? [] : undefined, // Only students get badges
        createdAt: new Date(),
        lastActive: new Date()
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      console.log('User document created:', userData);
      
      toast({
        title: "Success",
        description: `Account created successfully! Welcome ${role}.`,
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user:', user?.email);
      // In test mode, just clear the user
      setUser(null);
      toast({
        title: "Success",
        description: "Successfully logged out!",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  // Comment out Firebase auth listener for testing
  /*
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log('Auth state changed:', firebaseUser?.email);
      setLoading(true);
      
      if (firebaseUser) {
        try {
          console.log('Fetching user data from Firestore for:', firebaseUser.uid);
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User data retrieved:', userData);
            
            // Validate role from database
            const userRole = userData.role;
            if (!validateRole(userRole)) {
              console.error('Invalid role in database:', userRole);
              // Set as student by default for invalid roles
              userData.role = 'student';
            }
            
            const user: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              role: userData.role,
              name: userData.name,
              points: userData.points || 0,
              badges: userData.badges || []
            };
            
            console.log('Setting user state:', user);
            setUser(user);
          } else {
            console.log('User document does not exist, creating default student user');
            // Create default user document for existing Firebase users without Firestore data
            const defaultUserData = {
              email: firebaseUser.email,
              name: firebaseUser.displayName || 'User',
              role: 'student' as const,
              points: 0,
              badges: [],
              createdAt: new Date(),
              lastActive: new Date()
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), defaultUserData);
            
            const defaultUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              role: 'student',
              name: defaultUserData.name,
              points: 0,
              badges: []
            };
            
            console.log('Created and set default user:', defaultUser);
            setUser(defaultUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to basic user data with student role
          const fallbackUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            role: 'student',
            name: firebaseUser.displayName || 'User',
            points: 0,
            badges: []
          };
          console.log('Using fallback user data:', fallbackUser);
          setUser(fallbackUser);
        }
      } else {
        console.log('No authenticated user, setting user to null');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  */

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, setTestUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
