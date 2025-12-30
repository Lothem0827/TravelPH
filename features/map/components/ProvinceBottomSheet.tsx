import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView, Image, FlatList } from 'react-native';
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
import { PROVINCE_EMOJIS } from '@/constants/ProvinceEmojis';
import Button from '@/components/Button';
import Badge from '@/components/Badge';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
// Increase content height to accommodate images and tags
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.75;

const styles = {
    bottomSheetContainer: `absolute left-0 right-0 bg-white rounded-t-3xl z-50 overflow-hidden`,
    handleBar: `w-20 h-1 bg-gray-300 self-center  rounded-full`,
    contentContainer: `px-6 pb-24 items-start w-full`, // pb-24 for footer space
    title: `text-2xl font-bold text-gray-800 font-sans`,
    subtitle: `text-base text-gray-500 mt-1 font-medium italic`,
    sectionTitle: `text-sm font-bold text-gray-400 uppercase mt-6 mb-2 tracking-wider`,
    tagRow: `flex-row flex-wrap gap-2`,
    tagChip: `bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100`,
    tagText: `text-yellow-700 text-sm font-medium`,
    destinationChip: `bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100`,
    destinationText: `text-slate-600 text-sm font-medium`,
    footer: `absolute bottom-0 w-full px-6 py-4 bg-white`,
    buttonContainer: `flex-row justify-between gap-3 w-full`,
    wishlistButton: `flex-1 py-3.5 bg-white border border-slate-300 rounded-xl items-center justify-center active:bg-slate-50`,
    wishlistText: `text-slate-700 font-semibold text-sm text-center`,
    visitedButton: `flex-1 py-3.5 bg-yellow-400 rounded-xl items-center justify-center active:bg-yellow-500 `,
    visitedText: `text-white font-bold text-sm text-center`,
};

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

    const renderVisitedContent = () => {
        const formatVisitDate = (startDate: string, endDate: string) => {
            const start = new Date(startDate);
            const end = new Date(endDate);

            const formatDate = (date: Date) => {
                return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
            };

            if (startDate === endDate) {
                return formatDate(start);
            }
            return `${formatDate(start)} - ${formatDate(end)}`;
        };

        return (
            <>
                {/* Content Area */}
                <GestureDetector gesture={panGesture}>
                    <View className='w-full'>
                        {/* Handle */}
                        <View className="w-full pt-6 pb-6">
                            <View className={styles.handleBar} />
                        </View>


                        {/* Header */}
                        <Text className={styles.title}>
                            {provinceName || "Unknown Province"} {provinceId && PROVINCE_EMOJIS[provinceId]}
                        </Text>

                        {/* Subtext */}
                        {details?.subtext && (
                            <Text className="text-sm text-slate-500 mt-1">{details.subtext}</Text>
                        )}

                        {/* Visited Badge */}
                        <Badge label="VISITED" variant="primary" className="mt-2" />

                        {/* Notes */}
                        {diaryDetails?.notes ? (
                            <Text className={styles.subtitle}>"{diaryDetails.notes}"</Text>
                        ) : (
                            <Text className="text-base text-gray-400 mt-1 font-medium italic">No notes added.</Text>
                        )}

                        {/* Visited Date */}
                        {diaryDetails && (
                            <View className="mt-4">
                                <Text className="text-sm text-slate-500">
                                    📅 Visited: {formatVisitDate(diaryDetails.startDate, diaryDetails.endDate)}
                                </Text>
                            </View>
                        )}

                        {/* What did you do */}
                        <View className="w-full mt-4">
                            <Text className={styles.sectionTitle}>What did you do?</Text>
                            <View className={styles.tagRow}>
                                {diaryDetails?.tags && diaryDetails.tags.length > 0 ? (
                                    diaryDetails.tags.map((tag, i) => (
                                        <Badge
                                            key={`tag-${i}`}
                                            label={tag}
                                            variant="outline"
                                        />
                                    ))
                                ) : (
                                    <Text className="text-gray-400 italic">No activity tags</Text>
                                )}
                            </View>
                        </View>
                    </View>
                </GestureDetector>

                {/* User Images - Scrollable, not draggable */}
                {diaryDetails?.images && diaryDetails.images.length > 0 ? (
                    <FlatList
                        data={diaryDetails.images}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => `img-${index}`}
                        renderItem={({ item: img }) => (
                            <Image
                                source={{ uri: img }}
                                className="w-36 h-36 rounded-xl mr-3 bg-slate-200"
                                resizeMode="cover"
                            />
                        )}
                        className="mt-6"
                        contentContainerStyle={{ paddingRight: 24 }}
                    />
                ) : (
                    <Text className="text-gray-400 italic mt-6">No photos added.</Text>
                )}
            </>
        );
    };

    const renderNotVisitedContent = () => (
        <>
            {/* Content Area */}
            <GestureDetector gesture={panGesture}>
                <View className='w-full'>
                    {/* Handle */}
                    <View className="w-full pt-6 pb-6">
                        <View className={styles.handleBar} />
                    </View>


                    {/* Header */}
                    <Text className={styles.title}>
                        {provinceName || "Unknown Province"} {provinceId && PROVINCE_EMOJIS[provinceId]}
                    </Text>

                    {/* Subtext */}
                    {details?.subtext && (
                        <Text className="text-sm text-slate-500 mt-1">{details.subtext}</Text>
                    )}

                    {/* Wishlist Badge */}
                    {details?.wishlisted && (
                        <Badge label="★ WISHLIST" variant="secondary" className="mt-2" />
                    )}



                    {/* Tags Section */}
                    {details && (
                        <View className="w-full mt-4">
                            {/* Why Love */}
                            <Text className={styles.sectionTitle}>Why people love this place</Text>
                            <View className={styles.tagRow}>
                                {details.loveTags.length > 0 ? details.loveTags.map((tag, i) => (
                                    <Badge
                                        key={i}
                                        label={tag}
                                        variant="outline"
                                    />
                                )) : <Text className="text-gray-400 italic">No tags yet</Text>}
                            </View>

                            {/* Travelers Go */}
                            <Text className={styles.sectionTitle}>Where travelers go</Text>
                            <View className={styles.tagRow}>
                                {details.travelerTags.length > 0 ? details.travelerTags.map((tag, i) => (
                                    <Badge
                                        key={i}
                                        label={tag}
                                        variant="secondary"
                                    />
                                )) : <Text className="text-gray-400 italic">No cities listed</Text>}
                            </View>
                        </View>
                    )}
                </View>
            </GestureDetector>

            {/* Images Horizontal Scroll - Scrollable, not draggable */}
            {details && details.images.length > 0 ? (
                <FlatList
                    data={details.images}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => `default-img-${index}`}
                    renderItem={({ item: img, index }) => (
                        <Image
                            source={typeof img === 'string' && /^\d+$/.test(img) ? Number(img) : { uri: img }}
                            className="w-36 h-36 rounded-xl mr-3 bg-slate-200"
                            resizeMode="cover"
                        />
                    )}
                    className="mt-6"
                    contentContainerStyle={{ paddingRight: 24 }}
                />
            ) : (
                <Text className="text-gray-400 italic mt-6">No photos available.</Text>
            )}
        </>
    );

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
                className={styles.bottomSheetContainer}
                style={[rBottomSheetStyle, { maxHeight: SHEET_HEIGHT, bottom: 0 }]}
            >

                {/* <GestureDetector gesture={panGesture}>
                    <Animated.View className="w-full pt-6 pb-6">
                        <View className={styles.handleBar} />
                    </Animated.View>
                </GestureDetector> */}

                <View className="px-6 pb-48 items-start w-full">
                    {details ? (
                        details.visited ? renderVisitedContent() : renderNotVisitedContent()
                    ) : (
                        <Text className="text-slate-400">Loading...</Text>
                    )}
                </View>

                {/* Buttons - Fixed at bottom */}
                <View className={styles.footer}>
                    {details?.visited ? (
                        <View className={styles.buttonContainer}>
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
