import React from "react";
import { View, TouchableOpacity, StatusBar, Platform } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CloseIcon from "@/assets/icons/close-icon.svg";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useGalleryLogic } from "@/features/gallery/hooks/useGalleryLogic";
import GalleryViewer from "@/features/gallery/components/GalleryViewer";
import AppText from "@/components/AppText";

const GalleryScreen = () => {
    const router = useRouter();
    const {
        images,
        provinceName,
        emoji,
        subtext,
        startIndex,
        getImageSource
    } = useGalleryLogic();

    const [isFullScreen, setIsFullScreen] = React.useState(false);


    if (images.length === 0) return null; // Safety check

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View className="px-5 py-3 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                    <CloseIcon width={24} height={24} color="#64748B" />
                </TouchableOpacity>

                <AppText variant="ScreenTitle" className="text-slate-500">
                    {provinceName} &middot; {images.length} photos
                </AppText>

                {/* Dummy view to balance the header for centering */}
                <View className="w-10" />
            </View>

            {/* Content Container */}
            <View className="flex-1 flex-col ">
                {/* Header Text Block */}
                {/* Header Text Block */}
                {!isFullScreen && (
                    <Animated.View
                        entering={FadeIn.duration(300)}
                        exiting={FadeOut.duration(300)}
                        className="px-6 py-6 flex-col gap-2 "
                    >
                        <AppText variant="Heading">
                            {provinceName} <AppText variant="Heading">{emoji}</AppText>
                        </AppText>
                        <AppText variant="Body" className="text-slate-600">
                            {subtext}
                        </AppText>
                    </Animated.View>
                )}

                {/* Gallery Viewer (Main Image + Thumbnails) */}
                <GalleryViewer
                    images={images}
                    startIndex={startIndex}
                    getImageSource={getImageSource}
                    onToggleUI={() => setIsFullScreen(prev => !prev)}
                />
            </View>
        </SafeAreaView>
    );
};

export default GalleryScreen;

