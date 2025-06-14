
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
      await signInWithEmailAndPassword(auth, email, password);
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
      console.log('Attempting signup for:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        email: firebaseUser.email,
        name: name,
        role: role,
        points: 0,
        badges: [],
        createdAt: new Date()
      });
      
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
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              role: userData.role || 'student',
              name: userData.name,
              points: userData.points || 0,
              badges: userData.badges || []
            });
          } else {
            // Default user data if document doesn't exist
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              role: 'student'
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to basic user data
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            role: 'student'
          });
        }
      } else {
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
