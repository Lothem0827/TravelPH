import { Stack } from 'expo-router';
import { initDatabase } from '@/database/init';
import { useTravelStore } from '@/store/useTravelStore';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import '@/global.css';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
    const [loaded, error] = useFonts({
        'Inter-Regular': require('@/assets/fonts/Inter_18pt-Regular.ttf'),
        'Inter-Medium': require('@/assets/fonts/Inter_18pt-Medium.ttf'),
        'Inter-SemiBold': require('@/assets/fonts/Inter_18pt-SemiBold.ttf'),
        'Inter-Bold': require('@/assets/fonts/Inter_18pt-Bold.ttf'),
    });

    useEffect(() => {
        initDatabase();
        useTravelStore.getState().refreshData(); // Load initial data from DB
        if (error) console.error("Font load error:", error);
        if (loaded) console.log("Fonts loaded successfully!");

        if (loaded) {
            // Apply global font styles
            // @ts-ignore
            if (Text.defaultProps == null) Text.defaultProps = {};
            // @ts-ignore
            Text.defaultProps.style = { fontFamily: 'Inter-Regular', ...(Text.defaultProps.style || {}) };

            // @ts-ignore
            if (TextInput.defaultProps == null) TextInput.defaultProps = {};
            // @ts-ignore
            TextInput.defaultProps.style = { fontFamily: 'Inter-Regular', ...(TextInput.defaultProps.style || {}) };

            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }} />
            <StatusBar style="auto" />
        </GestureHandlerRootView>
    );
}
