
import React, { useState, useRef, useEffect } from "react";
import {
    Modal,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    StatusBar,
    Platform,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import CloseIcon from "@/assets/icons/close-icon.svg";
import AppText from "@/components/AppText";

interface ImageViewerModalProps {
    visible: boolean;
    onClose: () => void;
    images: any[]; // can be string uris or require numbers
    initialIndex: number;
    provinceName: string;
    emoji?: string;
    isVisited: boolean;
    subtext: string; // Date range for visited, description for not visited
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
    visible,
    onClose,
    images,
    initialIndex,
    provinceName,
    emoji = "",
    subtext,
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const flatListRef = useRef<FlatList>(null);
    const mainListRef = useRef<FlatList>(null);

    useEffect(() => {
        if (visible) {
            setCurrentIndex(initialIndex);
            // Wait for render, then scroll to initial
            setTimeout(() => {
                mainListRef.current?.scrollToIndex({ index: initialIndex, animated: false });
            }, 0);
        }
    }, [visible, initialIndex]);

    // Scroll thumbnail list when index changes
    useEffect(() => {
        if (visible && flatListRef.current && images.length > 0) {
            // Ensure index is within bounds before scrolling
            if (currentIndex >= 0 && currentIndex < images.length) {
                flatListRef.current.scrollToIndex({
                    index: currentIndex,
                    animated: true,
                    viewPosition: 0.5,
                });
            }
        }
    }, [currentIndex, visible, images.length]);

    if (!visible) return null;

    // Helper to resolve image source
    const getImageSource = (img: any) => {
        if (typeof img === "string" && /^\d+$/.test(img)) {
            return Number(img); // Handle require() IDs passed as strings
        }
        return typeof img === "string" ? { uri: img } : img;
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={onClose}
        >
            <SafeAreaView className="flex-1 bg-black/90">
                <StatusBar barStyle="dark-content" backgroundColor="white" />

                {/* Header */}
                <View className="px-4 py-3 flex-row items-center justify-between border-b border-gray-100">
                    <TouchableOpacity onPress={onClose} className="p-2 -ml-2">
                        <CloseIcon width={28} height={28} color="#64748B" />
                    </TouchableOpacity>

                    <AppText variant="BodyBold" className="text-lg text-slate-700">
                        {provinceName}
                    </AppText>

                    {/* Dummy view to balance the header for centering */}
                    <View className="w-10" />
                </View>

                {/* Content Container */}
                <View className="flex-1 flex-col ">
                    {/* Header Text Block */}
                    <View className="px-6 pt-2 pb-6">
                        <AppText variant="Heading" className="text-3xl text-slate-800">
                            {provinceName} <AppText variant="Heading" className="text-3xl">{emoji}</AppText>
                        </AppText>
                        <AppText variant="Body" className="text-slate-500 font-sans text-base mt-1">
                            {subtext}
                        </AppText>
                    </View>

                    {/* Main Image Area */}
                    {/* Main Image Area */}
                    <View className="flex-1 justify-center items-center bg-slate-50 overflow-hidden">
                        <FlatList

                            ref={mainListRef}
                            data={images}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(_, index) => `main-${index}`}
                            initialScrollIndex={initialIndex}
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
                    <View className="h-32 bg-white border-t border-slate-100 flex-col justify-center py-4">
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
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setCurrentIndex(index);
                                            mainListRef.current?.scrollToIndex({ index, animated: true });
                                        }}
                                        className={`mr-3 rounded-lg overflow-hidden border-2 ${isSelected ? 'border-yellow-400 opacity-100' : 'border-transparent opacity-60'}`}
                                        style={{
                                            width: 72,
                                            height: 72,
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
        </Modal>
    );
};

export default ImageViewerModal;
