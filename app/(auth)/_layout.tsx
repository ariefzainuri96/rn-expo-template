import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/context/auth';

export default function AuthLayout() {
    const { session } = useAuth();

    if (session) {
        return <Redirect href='/(tabs)' />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='login' />
        </Stack>
    );
}
