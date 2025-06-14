
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface User {
  uid: string;
  email: string;
  role: 'admin' | 'student' | 'staff';
  points?: number;
  badges?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: 'student' | 'staff') => Promise<void>;
  registerUserAsAdmin: (email: string, password: string, role: 'student' | 'staff') => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            ...userDoc.data()
          } as User);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, role: 'student' | 'staff') => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      email,
      role,
      points: 0,
      badges: [],
      createdAt: new Date().toISOString()
    });
  };

  const registerUserAsAdmin = async (email: string, password: string, role: 'student' | 'staff') => {
    // This would typically be done server-side, but for demo purposes
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      email,
      role,
      points: 0,
      badges: [],
      createdAt: new Date().toISOString(),
      registeredBy: user?.uid
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    login,
    register,
    registerUserAsAdmin,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
