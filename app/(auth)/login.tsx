import { useAuth } from '@/context/auth';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    const { signIn } = useAuth();

    const handleLogin = async () => {
        // After successful login, move to the main app
        await signIn('fake_token');

        router.replace('/(tabs)');
    };

    return (
        <View className='justify-center flex-1 p-6 bg-white'>
            <Text className='text-4xl font-bold text-slate-900'>
                Welcome Back
            </Text>
            <Text className='mt-2 mb-8 text-slate-500'>
                Please sign in to continue.
            </Text>

            <TouchableOpacity
                onPress={handleLogin}
                className='items-center p-4 bg-blue-600 rounded-xl'
            >
                <Text className='text-lg font-bold text-white'>Login</Text>
            </TouchableOpacity>
        </View>
    );
}
