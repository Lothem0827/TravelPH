import React, { useRef, useState } from 'react';
import { View, FlatList, ViewToken, TouchableOpacity, useWindowDimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import AppText from '@/components/AppText';
import OnboardingSlide from '../components/OnboardingSlide';

const slides = [
    {
        id: '1',
        title: 'Welcome to your travel diary',
        subtitle: 'A quiet space to mark where you’ve been and remember the journeys that mattered.',
        iconName: 'map', // Placeholder
        color: '#60A5FA' // Blue 400
    },
    {
        id: '2',
        title: 'Tap a province',
        subtitle: 'Tap any province you’ve visited to add it to your diary. You can always change this later.',
        iconName: 'mouse-pointer',
        color: '#FACC15' // Yellow 400
    },
    {
        id: '3',
        title: 'Add memories, your way',
        subtitle: 'Write notes, add dates, and save photos from your trip. Nothing is shared. Everything stays on your device.',
        iconName: 'book-open',
        color: '#F472B6' // Pink 400
    },
    {
        id: '4',
        title: 'See your journey grow',
        subtitle: 'Watch your travels unfold across Luzon, Visayas, and Mindanao.',
        iconName: 'award',
        color: '#34D399' // Emerald 400
    }
];

export default function OnboardingScreen() {
    const { width } = useWindowDimensions();
    const router = useRouter();
    const { completeOnboarding } = useOnboardingStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0 && viewableItems[0].index !== null) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            handleFinish();
        }
    };

    const handleFinish = async () => {
        completeOnboarding();
        router.replace('/');
    };

    const handleSkip = () => {
        completeOnboarding();
        router.replace('/');
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Skip Button */}
            <View className="h-16 justify-center items-end px-6 pt-2">
                {currentIndex < slides.length - 1 && (
                    <TouchableOpacity onPress={handleSkip}>
                        <AppText className="text-slate-400 font-medium">Skip</AppText>
                    </TouchableOpacity>
                )}
            </View>

            <View className="flex-3">
                <FlatList
                    data={slides}
                    renderItem={({ item }) => (
                        <OnboardingSlide
                            title={item.title}
                            subtitle={item.subtitle}
                            icon={<Feather name={item.iconName as any} size={100} color={item.color} />}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={flatListRef}
                    scrollEventThrottle={32}
                />
            </View>

            {/* Pagination & Next Button */}
            <View className="flex-1 justify-between items-center pb-12 px-8">
                {/* Paginator */}
                <View className="flex-row space-x-2 h-16">
                    {slides.map((_, i) => {
                        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                        const dotWidth = i === currentIndex ? 24 : 8;
                        const opacity = i === currentIndex ? 1 : 0.3;

                        return (
                            <View
                                key={i.toString()}
                                style={{ width: dotWidth, opacity }}
                                className="h-2 rounded-full bg-slate-800 transition-all duration-300"
                            />
                        );
                    })}
                </View>

                {/* Primary Button */}
                <TouchableOpacity
                    className="w-full bg-slate-800 py-4 rounded-xl items-center shadow-md active:bg-slate-700"
                    onPress={handleNext}
                >
                    <AppText className="text-white font-semibold text-lg">
                        {currentIndex === slides.length - 1 ? "Start my journey" : "Next"}
                    </AppText>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
