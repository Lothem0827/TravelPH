import { Stack } from 'expo-router';
import { initDatabase } from '@/database/init';
import { useTravelStore } from '@/store/useTravelStore';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
    useFonts,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import '@/global.css';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
    const [loaded, error] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
    });

    useEffect(() => {
        initDatabase();
        useTravelStore.getState().refreshData(); // Load initial data from DB
        if (error) console.error("Font load error:", error);
        if (loaded) {
            console.log("Fonts loaded successfully!");
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    if (loaded) {
        SplashScreen.hideAsync();
    }

    if (!loaded && !error) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="gallery" />
                {/* Apply slide_from_bottom animation for diary screens */}
                <Stack.Screen
                    name="diary/[id]"
                    options={{
                        animation: 'slide_from_bottom',
                    }}
                />
                <Stack.Screen
                    name="diary/write"
                    options={{
                        animation: 'slide_from_bottom',
                    }}
                />
            </Stack>
            <StatusBar style="auto" />
        </GestureHandlerRootView>
    );
}
