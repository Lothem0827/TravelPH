
import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    SafeAreaView,
    StatusBar,
    Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getProvinceDetails, getDiaryDetails } from "@/database/queries";
import { PROVINCE_EMOJIS } from "@/constants/ProvinceEmojis";
import { formatVisitDate } from "@/utils/dateUtils";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const GalleryScreen = () => {
    const router = useRouter();
    const { provinceId, initialIndex } = useLocalSearchParams<{ provinceId: string; initialIndex: string }>();

    // Fetch Data
    const provinceDetails = provinceId ? getProvinceDetails(provinceId) : null;
    const diaryDetails = (provinceId && provinceDetails?.visited) ? getDiaryDetails(provinceId) : null;

    // Determine content source
    // If visited, show diary images. If not, show province images.
    const images = (provinceDetails?.visited && diaryDetails)
        ? (diaryDetails.images || [])
        : (provinceDetails?.images || []);

    const provinceName = provinceDetails?.title || "Province";
    const emoji = provinceId ? PROVINCE_EMOJIS[provinceId] : "";
    const subtext = (provinceDetails?.visited && diaryDetails)
        ? `Visited ${formatVisitDate(diaryDetails.startDate, diaryDetails.endDate, 'long')}`
        : provinceDetails?.subtext || "";

    const startIndex = initialIndex ? parseInt(initialIndex, 10) : 0;

    // State
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const flatListRef = useRef<FlatList>(null);
    const mainListRef = useRef<FlatList>(null);

    // Initial Scroll
    useEffect(() => {
        if (images.length > 0 && startIndex > 0) {
            // Small timeout to ensure layout is ready
            setTimeout(() => {
                mainListRef.current?.scrollToIndex({ index: startIndex, animated: false });
            }, 0);
        }
    }, []);

    // Scroll thumbnail list when index changes
    useEffect(() => {
        if (flatListRef.current && images.length > 0) {
            if (currentIndex >= 0 && currentIndex < images.length) {
                flatListRef.current.scrollToIndex({
                    index: currentIndex,
                    animated: true,
                    viewPosition: 0.5,
                });
            }
        }
    }, [currentIndex, images.length]);

    // Helper to resolve image source
    const getImageSource = (img: any) => {
        if (typeof img === "string" && /^\d+$/.test(img)) {
            return Number(img); // Handle require() IDs passed as strings
        }
        return typeof img === "string" ? { uri: img } : img;
    };

    if (images.length === 0) return null; // Safety check

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View className="px-5 py-3 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                    <Ionicons name="close" size={24} color="#64748B" />
                </TouchableOpacity>

                <Text className="text-sm font-sans text-slate-500">
                    {provinceName} &middot; {images.length} memories
                </Text>

                {/* Dummy view to balance the header for centering */}
                <View className="w-10" />
            </View>

            {/* Content Container */}
            <View className="flex-1 flex-col ">
                {/* Header Text Block */}
                <View className="px-6 py-6 flex-col gap-2 ">
                    <Text className="text-3xl font-semibold text-slate-700">
                        {provinceName} <Text className="text-3xl">{emoji}</Text>
                    </Text>
                    <Text className="text-slate-600 text-sm font-sans">
                        {subtext}
                    </Text>
                </View>

                {/* Main Image Area */}
                <View className="flex-1 justify-center items-center overflow-hidden bg-slate-100">
                    <FlatList
                        ref={mainListRef}
                        data={images}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(_, index) => `main-${index}`}
                        initialScrollIndex={startIndex}
                        getItemLayout={(_, index) => ({
                            length: SCREEN_WIDTH,
                            offset: SCREEN_WIDTH * index,
                            index,
                        })}
                        onMomentumScrollEnd={(ev) => {
                            const index = Math.round(ev.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                            if (index !== currentIndex) {
                                setCurrentIndex(index);
                            }
                        }}
                        renderItem={({ item }) => (
                            <View style={{ width: SCREEN_WIDTH }} className="flex-1 justify-center items-center">
                                <Image
                                    source={getImageSource(item)}
                                    className="w-full h-full"
                                    resizeMode="contain"
                                />
                            </View>
                        )}
                        onScrollToIndexFailed={(info) => {
                            const wait = new Promise(resolve => setTimeout(resolve, 500));
                            wait.then(() => {
                                mainListRef.current?.scrollToIndex({ index: info.index, animated: false });
                            });
                        }}
                    />
                </View>

                {/* Thumbnails Footer */}
                <View className="h-32 flex-col justify-center py-4">
                    <FlatList
                        ref={flatListRef}
                        data={images}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        extraData={currentIndex} // Ensure re-render on index change
                        keyExtractor={(_, index) => `thumb-${index}`}
                        contentContainerStyle={{ paddingHorizontal: 24, alignItems: 'center' }}
                        renderItem={({ item, index }) => {
                            const isSelected = index === currentIndex;
                            const distance = Math.abs(index - currentIndex);
                            let size = 52; // default
                            if (distance === 0) size = 64; // active
                            else if (distance === 1) size = 58; // adjacent

                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        setCurrentIndex(index);
                                        mainListRef.current?.scrollToIndex({ index, animated: true });
                                    }}
                                    className={`mr-3 rounded-2xl overflow-hidden border-2 ${isSelected ? 'border-yellow-400 opacity-100' : 'border-transparent opacity-60'}`}
                                    style={{
                                        width: size,
                                        height: size,
                                    }}
                                >
                                    <Image
                                        source={getImageSource(item)}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            );
                        }}
                        getItemLayout={(data, index) => (
                            { length: 84, offset: 84 * index, index } // 72px width + 12px margin (mr-3)
                        )}
                        onScrollToIndexFailed={(info) => {
                            const wait = new Promise(resolve => setTimeout(resolve, 500));
                            wait.then(() => {
                                flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                            });
                        }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default GalleryScreen;
