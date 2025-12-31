import React from "react";
import { View, TouchableOpacity, SafeAreaView, StatusBar, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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


    if (images.length === 0) return null; // Safety check

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View className="px-5 py-3 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                    <Ionicons name="close" size={24} color="#64748B" />
                </TouchableOpacity>

                <AppText variant="Body" className="text-slate-500">
                    {provinceName} &middot; {images.length} photos
                </AppText>

                {/* Dummy view to balance the header for centering */}
                <View className="w-10" />
            </View>

            {/* Content Container */}
            <View className="flex-1 flex-col ">
                {/* Header Text Block */}
                <View className="px-6 py-6 flex-col gap-2 ">
                    <AppText variant="H1">
                        {provinceName} <AppText variant="H1">{emoji}</AppText>
                    </AppText>
                    <AppText variant="Body">
                        {subtext}
                    </AppText>
                </View>

                {/* Gallery Viewer (Main Image + Thumbnails) */}
                <GalleryViewer
                    images={images}
                    startIndex={startIndex}
                    getImageSource={getImageSource}
                />
            </View>
        </SafeAreaView>
    );
};

export default GalleryScreen;

