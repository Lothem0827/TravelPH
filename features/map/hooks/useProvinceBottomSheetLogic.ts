import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { getProvinceDetails, ProvinceDetails, getDiaryDetails, DiaryDetails } from '@/database/queries';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface UseProvinceBottomSheetLogicProps {
    isVisible: boolean;
    provinceId: string | undefined;
    onClose: () => void;
    onAddToWishlist: () => void;
}

export const useProvinceBottomSheetLogic = ({
    isVisible,
    provinceId,
    onClose,
    onAddToWishlist,
}: UseProvinceBottomSheetLogicProps) => {
    const router = useRouter();
    const translateY = useSharedValue(SCREEN_HEIGHT);
    const [details, setDetails] = useState<ProvinceDetails | null>(null);
    const [diaryDetails, setDiaryDetails] = useState<DiaryDetails | null>(null);
    const [isWishlisted, setIsWishlisted] = useState(false);

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
            // Initialize wishlisted state
            setIsWishlisted(false);
        } else {
            translateY.value = withTiming(SCREEN_HEIGHT);
        }
    }, [isVisible, provinceId]);

    // Update isWishlisted when details change
    useEffect(() => {
        setIsWishlisted(details?.wishlisted || false);
    }, [details]);

    const rBottomSheetStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    const handleOpenDiaryScreen = () => {
        if (provinceId) {
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

    const handleAddToWishlist = () => {
        if (isWishlisted) {
            // Remove from wishlist
            onAddToWishlist(); // This will toggle in the database
            setIsWishlisted(false);

            // Refresh province details after database update
            setTimeout(() => {
                if (provinceId) {
                    const updatedDetails = getProvinceDetails(provinceId);
                    setDetails(updatedDetails);
                }
            }, 100);
        } else {
            // Add to wishlist
            onAddToWishlist();
            setIsWishlisted(true);

            // Refresh province details after database update
            setTimeout(() => {
                if (provinceId) {
                    const updatedDetails = getProvinceDetails(provinceId);
                    setDetails(updatedDetails);
                }
            }, 100);
        }
    };

    return {
        rBottomSheetStyle,
        details,
        diaryDetails,
        isWishlisted,
        panGesture,
        handleOpenDiaryScreen,
        handleImagePress,
        handleAddToWishlist,
        translateYValue: translateY,
    };
};
