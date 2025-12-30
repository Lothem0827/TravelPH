import React from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import { GestureDetector, PanGesture } from 'react-native-gesture-handler';
import { ProvinceDetails } from '@/database/queries';
import { PROVINCE_EMOJIS } from '@/constants/ProvinceEmojis';
import Badge from '@/components/Badge';
import HeartIcon from '@/assets/icons/heart-icon.svg';
import StarIcon from '@/assets/icons/star-icon.svg';

interface NotVisitedProvinceContentProps {
    provinceName?: string;
    provinceId: string | undefined;
    details: ProvinceDetails | null;
    panGesture: PanGesture;
}

const NotVisitedProvinceContent: React.FC<NotVisitedProvinceContentProps> = ({
    provinceName,
    provinceId,
    details,
    panGesture,
}) => {
    return (
        <>
            {/* Content Area */}
            <GestureDetector gesture={panGesture}>
                <View className='w-full'>
                    {/* Handle */}
                    <View className="w-full pt-3 pb-8">
                        <View className="w-12 h-1 bg-slate-200 self-center  rounded-full" />
                    </View>

                    <View className='w-full flex-row justify-between flex-wrap gap-2.5 '>
                        <View className="flex-col gap-2">
                            {/* Header */}
                            <Text className="text-3xl font-semibold text-gray-700">
                                {provinceName || "Unknown Province"} {provinceId && PROVINCE_EMOJIS[provinceId]}
                            </Text>

                            {/* Subtext */}
                            {details?.subtext && (
                                <Text className="text-sm text-slate-500 font-medium">{details.subtext}</Text>
                            )}
                        </View>

                        {/* Wishlist Badge */}
                        {details?.wishlisted && (
                            <Badge label="Wishlist" variant="secondary" />
                        )}
                    </View>




                    {/* Tags Section */}
                    {details && (
                        <View className="w-full mt-6 mb-6">
                            {/* Why Love */}
                            <View className="flex-row items-center gap-1">
                                <HeartIcon width={14} height={14} />
                                <Text className="text-sm font-sans text-slate-500">Why people love this place</Text>
                            </View>
                            <View className="flex-row flex-wrap gap-2 mt-2.5">
                                {details.loveTags.length > 0 ? details.loveTags.map((tag, i) => (
                                    <Badge
                                        key={i}
                                        label={tag}
                                        variant="outline"
                                    />
                                )) : <Text className="text-gray-400 italic font-sans">No tags yet</Text>}
                            </View>

                            {/* Travelers Go */}
                            <View className="flex-row items-center gap-1 mt-6">
                                <StarIcon width={14} height={14} />
                                <Text className="text-sm font-sans text-slate-500 ">Where travelers go</Text>
                            </View>
                            <View className="flex-row flex-wrap gap-2 mt-2.5">
                                {details.travelerTags.length > 0 ? details.travelerTags.map((tag, i) => (
                                    <Badge
                                        key={i}
                                        label={tag}
                                        variant="outline"
                                    />
                                )) : <Text className="text-gray-400 italic font-sans">No cities listed</Text>}
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
                <Text className="text-gray-400 italic mt-6 font-sans">No photos available.</Text>
            )}
        </>
    );
};

export default NotVisitedProvinceContent;
