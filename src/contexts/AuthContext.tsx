
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
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Create user document in Firestore
      const userData = {
        email: firebaseUser.email,
        name: name,
        role: role,
        points: 0,
        badges: [],
        createdAt: new Date()
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      console.log('User document created:', userData);
      
      toast({
        title: "Success",
        description: "Account created successfully!",
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
      await signOut(auth);
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log('Auth state changed:', firebaseUser?.email);
      
      if (firebaseUser) {
        try {
          console.log('Fetching user data from Firestore for:', firebaseUser.uid);
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User data retrieved:', userData);
            
            const user: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              role: userData.role || 'student',
              name: userData.name,
              points: userData.points || 0,
              badges: userData.badges || []
            };
            
            console.log('Setting user state:', user);
            setUser(user);
          } else {
            console.log('User document does not exist, creating default user');
            // Default user data if document doesn't exist
            const defaultUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              role: 'student'
            };
            setUser(defaultUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to basic user data
          const fallbackUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            role: 'student'
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

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
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
