import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { getProvinceDetails, ProvinceDetails, getDiaryDetails, DiaryDetails } from '@/database/queries';
import Button from '@/components/Button';
import VisitedProvinceContent from './VisitedProvinceContent';
import NotVisitedProvinceContent from './NotVisitedProvinceContent';
import { PROVINCE_EMOJIS } from '@/constants/ProvinceEmojis';
import { formatVisitDate } from '@/utils/dateUtils';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
// Increase content height to accommodate images and tags
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.75;

interface ProvinceBottomSheetProps {
    isVisible: boolean;
    provinceName?: string;
    provinceId: string | undefined;
    onClose: () => void;
    onAddToWishlist: () => void;
    onMarkVisited: () => void;
}

const ProvinceBottomSheet: React.FC<ProvinceBottomSheetProps> = ({
    isVisible,
    provinceName,
    provinceId,
    onClose,
    onAddToWishlist,
    onMarkVisited,
}) => {
    const router = useRouter();
    const translateY = useSharedValue(SCREEN_HEIGHT);
    const [details, setDetails] = useState<ProvinceDetails | null>(null);
    const [diaryDetails, setDiaryDetails] = useState<DiaryDetails | null>(null);

    const context = useSharedValue({ y: 0 });

    // Gesture only for the handle bar area
    const panGesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            // Only allow dragging down (positive Y) from the 0 position
            const newY = event.translationY + context.value.y;
            if (newY >= 0) {
                translateY.value = newY;
            }
        })
        .onEnd(() => {
            if (translateY.value > 100) {
                // Close if dragged down more than 100px
                translateY.value = withTiming(SCREEN_HEIGHT);
                runOnJS(onClose)();
            } else {
                // Snap back to 0 (fully visible)
                translateY.value = withTiming(0);
            }
        });

    useEffect(() => {
        if (isVisible) {
            // Fetch details when opening
            if (provinceId) {
                try {
                    const data = getProvinceDetails(provinceId);
                    setDetails(data);

                    if (data?.visited) {
                        try {
                            const diary = getDiaryDetails(provinceId);
                            setDiaryDetails(diary);
                        } catch (error) {
                            console.error('Error fetching diary details:', error);
                            setDiaryDetails(null);
                        }
                    } else {
                        setDiaryDetails(null);
                    }
                } catch (error) {
                    console.error('Error fetching province details:', error);
                }
            }
            translateY.value = withTiming(0, { duration: 300 });
        } else {
            translateY.value = withTiming(SCREEN_HEIGHT);
        }
    }, [isVisible, provinceId]);

    const rBottomSheetStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    if (!isVisible && translateY.value === SCREEN_HEIGHT) return null;

    const handleOpenDiaryScreen = () => {
        if (provinceId) {
            // Close bottom sheet first? Or keep it? 
            // If we push, the bottom sheet stays mounted but hidden? 
            // Better to close it so when we come back we see the map?
            // User flow: Click "I've been here" -> Full screen form -> Save -> Back to Map.
            // When back to map, the province is now visited. So we probably want the bottom sheet to close or refresh.
            // Let's close it for now.
            onClose();
            router.push({
                pathname: "/diary/write",
                params: { provinceId }
            });
        }
    };

    const handleImagePress = (index: number) => {
        if (provinceId) {
            router.push({
                pathname: "/gallery",
                params: { provinceId, initialIndex: index.toString() }
            });
        }
    };

    return (
        <>
            <Animated.View
                className="absolute left-0 right-0 bg-white rounded-t-3xl z-50 overflow-hidden"
                style={[rBottomSheetStyle, { maxHeight: SHEET_HEIGHT, bottom: 0 }]}
            >

                <View className="items-start w-full">
                    {details ? (
                        details.visited ? (
                            <VisitedProvinceContent
                                provinceName={provinceName}
                                provinceId={provinceId}
                                details={details}
                                diaryDetails={diaryDetails}
                                panGesture={panGesture}
                                onImagePress={handleImagePress}
                            />
                        ) : (
                            <NotVisitedProvinceContent
                                provinceName={provinceName}
                                provinceId={provinceId}
                                details={details}
                                panGesture={panGesture}
                                onImagePress={handleImagePress}
                            />
                        )
                    ) : (
                        <Text className="text-slate-400 font-sans">Loading...</Text>
                    )}
                </View>

                {/* Buttons - Fixed at bottom */}
                <View className="absolute bottom-0 w-full px-6 py-6 bg-white ">
                    {details?.visited ? (
                        <View className="flex-row justify-between gap-3 w-full">
                            <Button
                                title="View Diary"
                                onPress={() => provinceId && router.push(`/diary/${provinceId}`)}
                                variant="primary"
                            />
                        </View>
                    ) : (
                        <View className="flex-col gap-3 w-full">
                            <Button
                                title="Add to wishlist"
                                onPress={onAddToWishlist}
                                variant="outline"
                            />

                            <Button

                                title="I've been here"
                                onPress={handleOpenDiaryScreen}
                                variant="primary"
                            />
                        </View>
                    )}
                </View>
            </Animated.View>



        </>
    );
};



export default ProvinceBottomSheet;
