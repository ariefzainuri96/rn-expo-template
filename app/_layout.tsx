import 'react-native-reanimated';
import '../global.css';

import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native';
import {
    SplashScreen,
    Stack,
    useRootNavigationState,
    useRouter,
} from 'expo-router';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { queryClient } from '@/lib/query-client';
import { useAuthStore } from '@/stores/auth';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';

// Keep splash screen visible while we fetch auth state
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
    anchor: '(tabs)',
};

function InitialLayout() {
    const session = useAuthStore((state) => state.session);
    const isLoading = useAuthStore((state) => state.isLoading);
    const navigationState = useRootNavigationState(); // Add this
    const router = useRouter();
    const colorScheme = useColorScheme();

    useEffect(() => {
        if (isLoading) return;

        const hideSplash = async () => {
            await SplashScreen.hideAsync();
        };

        hideSplash();
    }, [isLoading]);

    return (
        <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
            <Stack>
                <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                <Stack.Screen name='(auth)' options={{ headerShown: false }} />
                <Stack.Screen
                    name='modal'
                    options={{ presentation: 'modal', title: 'Modal' }}
                />
            </Stack>
            <StatusBar style='auto' />
        </ThemeProvider>
    );
}

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <InitialLayout />
            <Toast />
        </QueryClientProvider>
    );
}
