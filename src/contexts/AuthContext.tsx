
import React, { createContext, useContext, useEffect, useState } from 'react';

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

  const login = async (email: string, password: string) => {
    // Placeholder for Firebase auth
    setUser({ uid: '1', email, role: 'student' });
  };

  const signup = async (email: string, password: string, name: string, role: string) => {
    // Placeholder for Firebase auth
    setUser({ uid: '1', email, role: role as 'admin' | 'student' | 'staff', name });
  };

  const logout = async () => {
    setUser(null);
  };

  useEffect(() => {
    setLoading(false);
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
