import { Pressable, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useAuthStore } from '@/stores/auth';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const signOut = useAuthStore((state) => state.signOut);
    const insets = useSafeAreaInsets();

    return (
        <View style={{ paddingTop: insets.top }} className='p-4'>
            <ThemedText>what si to ya</ThemedText>
            <ThemedText>what si to ya</ThemedText>
            <Text className='p-4 text-teal-600 bg-red-500'>
                Tell me what you want, what you really, really want
            </Text>
            <Pressable
                onPress={async () => {
                    await signOut();

                    router.replace('/login');
                }}
            >
                <Text className='p-4 mt-2 font-bold text-center text-white bg-red-400 rounded-md'>
                    Signout
                </Text>
            </Pressable>
            <Pressable
                onPress={async () => {
                    router.push('/(news)')
                }}
            >
                <Text className='p-4 mt-2 font-bold text-center text-white bg-red-400 rounded-md'>
                    News Index
                </Text>
            </Pressable>
        </View>
    );
}
