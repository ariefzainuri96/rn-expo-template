import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/stores/auth';

export default function NewsLayout() {
    const session = useAuthStore((state) => state.session);

    if (!session) {
        return <Redirect href='/login' />;
    }

    return (
        <Stack screenOptions={{ headerShown: true }}>
            <Stack.Screen name='index' options={{ headerTitle: 'News' }} />
            <Stack.Screen
                name='detail'
                options={{ headerTitle: 'Detail News' }}
            />
        </Stack>
    );
}
