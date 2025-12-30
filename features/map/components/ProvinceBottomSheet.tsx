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
import AddDiaryScreen from '@/features/diary/AddDiaryScreen';
import Button from '@/components/Button';
import VisitedProvinceContent from './VisitedProvinceContent';
import NotVisitedProvinceContent from './NotVisitedProvinceContent';

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
    const [showDiaryScreen, setShowDiaryScreen] = useState(false);

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
        setShowDiaryScreen(true);
    };

    const handleDiarySaved = () => {
        setShowDiaryScreen(false);
        onMarkVisited(); // This will refresh the data and close the bottom sheet
    };

    return (
        <>
            <Animated.View
                className="absolute left-0 right-0 bg-white rounded-t-3xl z-50 overflow-hidden"
                style={[rBottomSheetStyle, { maxHeight: SHEET_HEIGHT, bottom: 0 }]}
            >

                <View className="px-6 pb-24 items-start w-full">
                    {details ? (
                        details.visited ? (
                            <VisitedProvinceContent
                                provinceName={provinceName}
                                provinceId={provinceId}
                                details={details}
                                diaryDetails={diaryDetails}
                                panGesture={panGesture}
                            />
                        ) : (
                            <NotVisitedProvinceContent
                                provinceName={provinceName}
                                provinceId={provinceId}
                                details={details}
                                panGesture={panGesture}
                            />
                        )
                    ) : (
                        <Text className="text-slate-400 font-sans">Loading...</Text>
                    )}
                </View>

                {/* Buttons - Fixed at bottom */}
                <View className="absolute bottom-0 w-full px-6 py-4 bg-white">
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

            {/* Add Diary Screen Modal */}
            {provinceId && provinceName && (
                <AddDiaryScreen
                    visible={showDiaryScreen}
                    provinceId={provinceId}
                    provinceName={provinceName}
                    onClose={() => setShowDiaryScreen(false)}
                    onSaved={handleDiarySaved}
                />
            )}
        </>
    );
};



export default ProvinceBottomSheet;
