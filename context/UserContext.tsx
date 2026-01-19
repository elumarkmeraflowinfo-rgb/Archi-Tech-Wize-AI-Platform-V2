import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  User
} from 'firebase/auth';
import { auth, googleProvider } from '../src/firebase';

export interface PurchasedService {
  id: string;
  name: string;
  type: 'course' | 'agent' | 'project' | 'automation';
  price: string;
  date: string;
  status: 'active' | 'pending_setup' | 'completed';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  gender: string;
  ageRange: string;
  role: string;
  primaryGoal: string;
  interests: string[];
  joinedAt: string;
  lastActive: string;
  accountStatus: 'active' | 'inactive';
  isOnline: boolean;
  purchases: PurchasedService[];
  subscriptionTier?: 'novice' | 'pro' | 'sovereign';
  subscriptionStatus?: 'active' | 'inactive' | 'canceled' | 'past_due';
  subscriptionId?: string;
}

interface UserContextType {
  user: UserProfile | null;
  firebaseUser: User | null;
  isAuthenticated: boolean;
  isVerificationSent: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (email: string, password: string, profileData: Omit<UserProfile, 'id' | 'email' | 'joinedAt' | 'purchases' | 'lastActive' | 'accountStatus' | 'isOnline'>) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => void;
  pendingPurchase: any | null;
  setPendingPurchase: (data: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [pendingPurchase, setPendingPurchase] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fUser) => {
      setFirebaseUser(fUser);
      if (fUser && fUser.emailVerified) {
        // Load profile from local storage if verified
        const savedUser = localStorage.getItem(`aw-profile-${fUser.uid}`);
        if (savedUser) {
          setUser({ ...JSON.parse(savedUser), isOnline: true });
        } else {
          // Create a default profile if none exists
          const defaultUser: UserProfile = {
            id: fUser.uid,
            name: fUser.displayName || fUser.email?.split('@')[0] || 'User',
            email: fUser.email || '',
            gender: 'Not specified',
            ageRange: 'Not specified',
            role: 'Visitor',
            primaryGoal: 'Exploring',
            interests: [],
            joinedAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            accountStatus: 'active',
            isOnline: true,
            purchases: []
          };
          setUser(defaultUser);
          localStorage.setItem(`aw-profile-${fUser.uid}`, JSON.stringify(defaultUser));
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password?: string) => {
    if (!password) {
      // Mock fallback for backwards compatibility if needed, but we should use password
      return false;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (!userCredential.user.emailVerified) {
        setIsVerificationSent(true);
        await signOut(auth);
        return false;
      }
      return true;
    } catch (error: any) {
      console.error("Login failed:", error.message);
      return false;
    }
  };

  const signup = async (email: string, password: string, profileData: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);

      const newUser: UserProfile = {
        id: userCredential.user.uid,
        email,
        joinedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        accountStatus: 'active',
        isOnline: false,
        purchases: [],
        ...profileData
      };

      // Save profile locally (in a real app, this would be a DB call)
      localStorage.setItem(`aw-profile-${userCredential.user.uid}`, JSON.stringify(newUser));

      setIsVerificationSent(true);
      await signOut(auth);
      return true;
    } catch (error: any) {
      console.error("Signup failed:", error.message);
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Google users are usually auto-verified by Firebase
      return true;
    } catch (error: any) {
      console.error("Google Sign-In failed:", error.message);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem(`aw-profile-${user.id}`, JSON.stringify(updated));
  };

  return (
    <UserContext.Provider value={{
      user,
      firebaseUser,
      isAuthenticated: !!user,
      isVerificationSent,
      login,
      signup,
      loginWithGoogle,
      logout,
      updateProfile,
      pendingPurchase,
      setPendingPurchase
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};