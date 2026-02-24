import React, { createContext, useContext, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_KEY } from '@/utils/constant';

// 1. Define what the "Auth" data looks like
interface AuthContextType {
  session: string | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// 2. The Provider component that wraps your app
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for a saved token when the app starts
    const loadStorageData = async () => {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      console.log('Loaded token from storage:', token);
      if (token) setSession(token);
      setIsLoading(false);
    };
    loadStorageData();
  }, []);

  const signIn = async (token: string) => {
    setSession(token);
    await AsyncStorage.setItem(TOKEN_KEY, token);
  };

  const signOut = async () => {
    setSession(null);
    await AsyncStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{ session, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. The actual useAuth hook
export const useAuth = () => useContext(AuthContext);