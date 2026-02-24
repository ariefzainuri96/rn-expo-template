import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/auth';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const { signOut } = useAuth();
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
        </View>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});
