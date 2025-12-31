import React from 'react';
import { View, Image, FlatList, TouchableOpacity } from 'react-native';
import AppText from '@/components/AppText';
import { GestureDetector, PanGesture } from 'react-native-gesture-handler';
import { ProvinceDetails, DiaryDetails } from '@/database/queries';
import { PROVINCE_EMOJIS } from '@/constants/ProvinceEmojis';
import Badge from '@/components/Badge';
import { formatVisitDate } from '@/utils/dateUtils';

interface VisitedProvinceContentProps {
    provinceName?: string;
    provinceId: string | undefined;
    details: ProvinceDetails | null;
    diaryDetails: DiaryDetails | null;
    panGesture: PanGesture;
    onImagePress: (index: number) => void;
}

const VisitedProvinceContent: React.FC<VisitedProvinceContentProps> = ({
    provinceName,
    provinceId,
    details,
    diaryDetails,
    panGesture,
    onImagePress,
}) => {
    return (
        <>
            {/* Content Area */}
            <GestureDetector gesture={panGesture}>
                <View className='w-full px-6 flex-col gap-5 '>
                    {/* Handle */}
                    <View className="w-full pt-3  ">
                        <View className="w-12 h-1 bg-slate-200 self-center  rounded-full" />
                    </View>

                    <View className='w-full flex-row justify-between gap-2.5 '>
                        <View className="flex-col gap-2">
                            <View className='flex-row flex-wrap gap-2 justify-between items-center w-full'>

                                {/* Header */}
                                <View className="flex-row items-center">
                                    <AppText variant="Heading">
                                        {provinceName || "Unknown Province"}
                                    </AppText>
                                    <AppText variant="H2" className="ml-1.5">{PROVINCE_EMOJIS[provinceId as string] || '🇵🇭'}</AppText>
                                </View>

                                {/* Visited Badge */}
                                <Badge label="Visited" variant="primary" />
                            </View>

                            {/* Notes */}
                            {diaryDetails?.notes ? (
                                <AppText variant="Body">"{diaryDetails.notes}"</AppText>
                            ) : (
                                details?.subtext && (
                                    <AppText variant="Body">{details.subtext}</AppText>
                                )
                            )}

                            {/* Visited Date */}
                            {diaryDetails && (
                                <View>
                                    <AppText variant="BodySmall">
                                        Visited last {formatVisitDate(diaryDetails.startDate, diaryDetails.endDate)}
                                    </AppText>
                                </View>
                            )}
                        </View>


                    </View>







                    {/* What did you do */}
                    <View
                        className={`w-full flex-row  items-center ${(diaryDetails?.tags?.length ?? 0) > 0 ? 'justify-between' : 'justify-start'}`}
                    >
                        {/* Tag Container */}
                        {(diaryDetails?.tags?.length ?? 0) > 0 && (
                            <View className="flex-row flex-wrap gap-2">
                                {diaryDetails?.tags?.slice(0, 3).map((tag, i) => (
                                    <Badge
                                        key={`tag-${i}`}
                                        label={tag}
                                        variant="outline"
                                    />
                                ))}
                            </View>
                        )}

                        {/* Photos Text */}
                        {/* <Text className='text-xs font-medium text-slate-400'>
                            {diaryDetails?.images?.length ?? 0} photos
                        </Text> */}
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
                    renderItem={({ item: img, index }) => (
                        <TouchableOpacity onPress={() => onImagePress(index)}>
                            <Image
                                source={{ uri: img }}
                                className="w-36 h-36 rounded-2xl mr-3 bg-slate-200"
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    )}
                    className="px-6 pb-6 pt-3.5 mb-20"

                />
            ) : (
                <AppText variant="Body" className="text-gray-400 italic mt-6 ml-6">No photos added.</AppText>
            )}
        </>
    );
};

export default VisitedProvinceContent;
