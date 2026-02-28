import { Redirect, Tabs } from 'expo-router';

import { Colors } from '@/constants/theme';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { useAuthStore } from '@/stores/auth';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const session = useAuthStore((state) => state.session);

    if (!session) {
        return <Redirect href='/(auth)/login' />;
    }

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={28} name='house.fill' color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='explore'
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={28}
                            name='paperplane.fill'
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol
                            size={28}
                            name='paperplane.fill'
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
