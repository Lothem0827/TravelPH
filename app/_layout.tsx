import { Stack, useRouter, useSegments } from 'expo-router';
import { initDatabase } from '@/database/init';
import { useTravelStore } from '@/store/useTravelStore';
import { useOnboardingStore } from '@/store/useOnboardingStore';
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

    const { hasOnboarded, _hasHydrated, resetOnboarding } = useOnboardingStore();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        initDatabase();
        useTravelStore.getState().refreshData(); // Load initial data from DB

        if (error) console.error("Font load error:", error);

        if (loaded && _hasHydrated) {
            console.log("Fonts loaded and store hydrated!");
            SplashScreen.hideAsync();
        }
    }, [loaded, error, _hasHydrated]);

    // TEMP: Always show onboarding for development
    useEffect(() => {
        if (_hasHydrated) {
            resetOnboarding();
        }
    }, [_hasHydrated]);

    useEffect(() => {
        if (!loaded || !_hasHydrated) return;

        const inAuthGroup = segments[0] === '(auth)'; // just in case we have auth later

        if (!hasOnboarded) {
            // Redirect to onboarding if not onboarded
            router.replace('/onboarding');
        } else if (hasOnboarded && segments[0] === 'onboarding') {
            // If already onboarded but on onboarding screen (e.g. back button), go to home
            router.replace('/');
        }
    }, [hasOnboarded, loaded, _hasHydrated]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen
                    name="gallery"
                    options={{
                        animation: 'slide_from_bottom',
                    }}
                />
                <Stack.Screen
                    name="profile/index"
                    options={{
                        animation: 'slide_from_bottom',
                        headerShown: false
                    }}
                />
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
                <Stack.Screen
                    name="onboarding"
                    options={{
                        headerShown: false,
                        animation: 'fade',
                        gestureEnabled: false
                    }}
                />
            </Stack>
            <StatusBar style="auto" />
        </GestureHandlerRootView>
    );
}
