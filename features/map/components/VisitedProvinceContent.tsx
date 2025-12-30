import React from 'react';
import { View, Text, Image, FlatList } from 'react-native';
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
}

const VisitedProvinceContent: React.FC<VisitedProvinceContentProps> = ({
    provinceName,
    provinceId,
    details,
    diaryDetails,
    panGesture,
}) => {
    return (
        <>
            {/* Content Area */}
            <GestureDetector gesture={panGesture}>
                <View className='w-full '>
                    {/* Handle */}
                    <View className="w-full pt-3 pb-8">
                        <View className="w-12 h-1 bg-slate-200 self-center  rounded-full" />
                    </View>

                    <View className='w-full flex-row justify-between flex-wrap gap-2.5 '>
                        <View className="flex-col gap-2">
                            {/* Header */}
                            <Text className="text-3xl font-semibold text-slate-700">
                                {provinceName || "Unknown Province"} {provinceId && PROVINCE_EMOJIS[provinceId]}
                            </Text>

                            {/* Notes */}
                            {diaryDetails?.notes ? (
                                <Text className="font-sans text-slate-600">"{diaryDetails.notes}"</Text>
                            ) : (
                                details?.subtext && (
                                    <Text className="font-sans text-slate-600">{details.subtext}</Text>
                                )
                            )}

                            {/* Visited Date */}
                            {diaryDetails && (
                                <View>
                                    <Text className="text-xs font-sans text-slate-400">
                                        Visited last {formatVisitDate(diaryDetails.startDate, diaryDetails.endDate)}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Visited Badge */}
                        <Badge label="Visited" variant="primary" className="mt-2" />
                    </View>






                    {/* What did you do */}
                    <View
                        className={`w-full mt-5 flex-row items-center ${(diaryDetails?.tags?.length ?? 0) > 0 ? 'justify-between' : 'justify-start'}`}
                    >
                        {/* Tag Container */}
                        {(diaryDetails?.tags?.length ?? 0) > 0 && (
                            <View className="flex-row flex-wrap gap-2 w-3/4">
                                {diaryDetails?.tags?.map((tag, i) => (
                                    <Badge
                                        key={`tag-${i}`}
                                        label={tag}
                                        variant="outline"
                                    />
                                ))}
                            </View>
                        )}

                        {/* Photos Text */}
                        <Text className='text-xs font-medium text-slate-400'>
                            {diaryDetails?.images?.length ?? 0} photos
                        </Text>
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
                            className="w-36 h-36 rounded-2xl mr-3 bg-slate-200"
                            resizeMode="cover"
                        />
                    )}
                    className="mt-3"
                    contentContainerStyle={{ paddingRight: 24 }}
                />
            ) : (
                <Text className="text-gray-400 font-sans italic mt-6">No photos added.</Text>
            )}
        </>
    );
};

export default VisitedProvinceContent;
