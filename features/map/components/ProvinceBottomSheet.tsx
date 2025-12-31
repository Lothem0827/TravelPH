import React from 'react';
import { View, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';
import Button from '@/components/Button';
import VisitedProvinceContent from './VisitedProvinceContent';
import NotVisitedProvinceContent from './NotVisitedProvinceContent';
import AppText from '@/components/AppText';
import CheckIcon from '@/assets/icons/check-icon.svg';
import { useProvinceBottomSheetLogic } from '@/features/map/hooks/useProvinceBottomSheetLogic';

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

    const {
        rBottomSheetStyle,
        details,
        diaryDetails,
        isWishlisted,
        panGesture,
        handleOpenDiaryScreen,
        handleImagePress,
        handleAddToWishlist,
        translateYValue,
    } = useProvinceBottomSheetLogic({
        isVisible,
        provinceId,
        onClose,
        onAddToWishlist
    });

    if (!isVisible && translateYValue.value === SCREEN_HEIGHT) return null;

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
                        <AppText variant="Body" className="text-slate-400">Loading...</AppText>
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
                                title={isWishlisted ? 'Added to wishlist' : 'Add to wishlist'}
                                onPress={handleAddToWishlist}
                                variant={isWishlisted ? 'secondary' : 'outline'}
                                icon={isWishlisted ? <CheckIcon width={20} height={20} /> : undefined}
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
