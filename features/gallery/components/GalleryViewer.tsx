import React, { useState, useRef, useEffect } from "react";
import { View, FlatList, Image, TouchableOpacity, Dimensions } from "react-native";

import ZoomableImage from "./ZoomableImage";

interface GalleryViewerProps {
    images: any[];
    startIndex: number;
    getImageSource: (img: any) => any;
    onToggleUI: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const GalleryViewer: React.FC<GalleryViewerProps> = ({ images, startIndex, getImageSource, onToggleUI }) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const flatListRef = useRef<FlatList>(null);
    const mainListRef = useRef<FlatList>(null);
    const [scrollEnabled, setScrollEnabled] = useState(true);

    // Initial Scroll
    useEffect(() => {
        if (images.length > 0 && startIndex > 0) {
            setTimeout(() => {
                mainListRef.current?.scrollToIndex({ index: startIndex, animated: false });
            }, 0);
        }
    }, [startIndex, images]);

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

    return (
        <View className="flex-1 flex-col">
            {/* Main Image Area */}
            <View className="flex-1 justify-center items-center overflow-hidden bg-slate-100">
                <FlatList
                    ref={mainListRef}
                    data={images}
                    horizontal
                    pagingEnabled
                    scrollEnabled={scrollEnabled}
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
                        <View style={{ width: SCREEN_WIDTH, height: '100%' }}>
                            <ZoomableImage
                                source={getImageSource(item)}
                                onTap={onToggleUI}
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
    );
};

export default GalleryViewer;
