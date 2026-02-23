import { StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

export default function ProfileScreen() {
    return (
        <View>
            <ThemedText>what si to ya</ThemedText>
            <ThemedText>what si to ya</ThemedText>
            <Text className='text-teal-600 bg-red-500 p-4'>
                Tell me what you want, what you really, really want
            </Text>
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
