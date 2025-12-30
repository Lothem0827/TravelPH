import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
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
    onImagePress: (index: number) => void;
}

const NotVisitedProvinceContent: React.FC<NotVisitedProvinceContentProps> = ({
    provinceName,
    provinceId,
    details,
    panGesture,
    onImagePress,
}) => {
    return (
        <>
            {/* Content Area */}
            <GestureDetector gesture={panGesture}>
                <View className='w-full px-6 flex-col gap-5'>
                    {/* Handle */}
                    <View className="w-full pt-3  ">
                        <View className="w-12 h-1 bg-slate-200 self-center  rounded-full" />
                    </View>

                    <View className='w-full flex-row justify-between flex-wrap gap-2.5'>
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
                        <>
                            {/* Why Love */}
                            <View className='flex-col gap-2.5'>
                                <View className="flex-row items-center gap-1">
                                    <HeartIcon width={14} height={14} />
                                    <Text className="text-sm font-sans text-slate-500">Why people love this place</Text>
                                </View>
                                <View className="flex-row flex-wrap gap-2 ">
                                    {details.loveTags.length > 0 ? details.loveTags.map((tag, i) => (
                                        <Badge
                                            key={i}
                                            label={tag}
                                            variant="outline"
                                        />
                                    )) : <Text className="text-gray-400 italic font-sans">No tags yet</Text>}
                                </View>
                            </View>

                            {/* Travelers Go */}
                            <View className='flex-col gap-2.5'>
                                <View className="flex-row items-center gap-1">
                                    <StarIcon width={14} height={14} />
                                    <Text className="text-sm font-sans text-slate-500 ">Where travelers go</Text>
                                </View>
                                <View className="flex-row flex-wrap gap-2 ">
                                    {details.travelerTags.length > 0 ? details.travelerTags.map((tag, i) => (
                                        <Badge
                                            key={i}
                                            label={tag}
                                            variant="outline"
                                        />
                                    )) : <Text className="text-gray-400 italic font-sans">No cities listed</Text>}
                                </View>
                            </View>
                        </>
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
                        <TouchableOpacity onPress={() => onImagePress(index)}>
                            <Image
                                source={typeof img === 'string' && /^\d+$/.test(img) ? Number(img) : { uri: img }}
                                className="w-36 h-36 rounded-xl mr-3 bg-slate-200"
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    )}
                    className=" px-6 py-6 mb-40"
                />
            ) : (
                <Text className="text-gray-400 italic mt-8 font-sans">No photos available.</Text>
            )}
        </>
    );
};

export default NotVisitedProvinceContent;
