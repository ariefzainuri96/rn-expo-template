import 'react-native-reanimated';
import '../global.css';

import { AuthProvider, useAuth } from '@/context/auth';
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native';
import { SplashScreen, Stack, router } from 'expo-router';

import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect } from 'react';

// Keep splash screen visible while we fetch auth state
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
    anchor: '(tabs)',
};

function InitialLayout() {
    const { session, isLoading } = useAuth();
    const colorScheme = useColorScheme();

    useEffect(() => {
        function performNavigation() {
            // 1. If still loading auth state, do nothing
            if (isLoading) return;

            // 2. Wrap in a small check to ensure the router is mounted
            // and navigation happens after the first render cycle.
            const inAuthGroup = false; // logic to check if user is in (auth) group if needed

            if (!session) {
                // Redirect to login if not authenticated
                router.replace('/login');
            } else if (session) {
                // Redirect to tabs if authenticated
                router.replace('/(tabs)');
            }

            // 3. Hide splash screen now that we know where we are going
            SplashScreen.hideAsync();
        }

        performNavigation();
    }, [session, isLoading]);

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
        // We wrap the navigation logic in the Provider here.
        // This ensures useAuth() is available inside InitialLayout.
        <AuthProvider>
            <InitialLayout />
        </AuthProvider>
    );
}
