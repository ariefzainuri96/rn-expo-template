import { ActivityIndicator, Text, View } from 'react-native';

import { useAuth } from '@/context/auth';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function SplashScreen() {
    const { session } = useAuth();

    useEffect(() => {
        setTimeout(() => {
            if (session) {
                console.log('Session exists, navigating to main app');
                router.replace('/(tabs)');
            } else {
                console.log('No session found, navigating to login');
                router.replace('/login');
            }
        }, 700);
    }, []);

    return (
        <View className='items-center justify-center flex-1 bg-slate-900'>
            <Text className='mb-4 text-3xl font-bold text-white'>MY APP</Text>
            <ActivityIndicator size='large' color='#ffffff' />
        </View>
    );
}
