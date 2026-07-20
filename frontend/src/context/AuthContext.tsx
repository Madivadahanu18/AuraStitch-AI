import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserType {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'tailor' | 'weaver' | 'supplier' | 'admin';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  onboardingCompleted: boolean;
}

interface AuthContextType {
  user: UserType | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserType>;
  register: (name: string, email: string, password: string, role: string, extraFields?: Record<string, any>) => Promise<UserType>;
  logout: () => void;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<UserType> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        verificationStatus: data.verificationStatus,
        onboardingCompleted: data.onboardingCompleted
      });
      setToken(data.token);
      localStorage.setItem('currentUser', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string, extraFields: Record<string, any> = {}): Promise<UserType> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, ...extraFields })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        verificationStatus: data.verificationStatus,
        onboardingCompleted: data.onboardingCompleted
      });
      setToken(data.token);
      localStorage.setItem('currentUser', JSON.stringify(data));
      localStorage.setItem('token', data.token);

      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  const completeOnboarding = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_URL}/auth/onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id })
      });
      const data = await response.json();
      if (response.ok) {
        const updatedUser = { ...user, onboardingCompleted: true };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify({ ...data, token }));
      }
    } catch (error) {
      console.error('Onboarding update failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
