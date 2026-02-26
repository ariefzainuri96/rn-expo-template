import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { IS_LOGIN_KEY, TOKEN_KEY } from '@/utils/constant';

interface AuthState {
    session: string | null;
    isLoading: boolean;
    signIn: (token: string) => Promise<void>;
    signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
    const hydrateSession = async () => {
        try {
            const token = await AsyncStorage.getItem(TOKEN_KEY);
            const isLogin =
                (await AsyncStorage.getItem(IS_LOGIN_KEY)) === 'true';
            set({
                session: token && isLogin ? token : null,
                isLoading: false,
            });
        } catch {
            set({
                session: null,
                isLoading: false,
            });
        }
    };

    hydrateSession();

    return {
        session: null,
        isLoading: true,
        signIn: async (token) => {
            set({ session: token, isLoading: false });
            await Promise.all([
                AsyncStorage.setItem(TOKEN_KEY, token),
                AsyncStorage.setItem(IS_LOGIN_KEY, 'true'),
            ]);
        },
        signOut: async () => {
            set({ session: null, isLoading: false });
            await AsyncStorage.multiRemove([TOKEN_KEY, IS_LOGIN_KEY]);
        },
    };
});
