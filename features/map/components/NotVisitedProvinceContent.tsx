import React from 'react';
import { View, Image, FlatList, TouchableOpacity } from 'react-native';
import AppText from '@/components/AppText';
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
                            <View className="flex-row items-center">
                                <AppText variant="Heading">
                                    {provinceName || "Unknown Province"}
                                </AppText>
                                <AppText variant="Body" className="ml-1.5">{PROVINCE_EMOJIS[provinceId as string] || '🇵🇭'}</AppText>
                            </View>
                            {/* Subtext */}
                            {details?.subtext && (
                                <AppText variant="Body">{details.subtext}</AppText>
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
                                    <AppText variant="Label">Why people love this place</AppText>
                                </View>
                                <View className="flex-row flex-wrap gap-2 ">
                                    {details.loveTags.length > 0 ? details.loveTags.map((tag, i) => (
                                        <Badge
                                            key={i}
                                            label={tag}
                                            variant="outline"
                                        />
                                    )) : <AppText variant="Body" className="text-gray-400 italic">No tags yet</AppText>}
                                </View>
                            </View>

                            {/* Travelers Go */}
                            <View className='flex-col gap-2.5'>
                                <View className="flex-row items-center gap-1">
                                    <StarIcon width={14} height={14} />
                                    <AppText variant="Label">Where travelers go</AppText>
                                </View>
                                <View className="flex-row flex-wrap gap-2 ">
                                    {details.travelerTags.length > 0 ? details.travelerTags.map((tag, i) => (
                                        <Badge
                                            key={i}
                                            label={tag}
                                            variant="outline"
                                        />
                                    )) : <AppText variant="Body" className="text-gray-400 italic">No cities listed</AppText>}
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
                <AppText variant="Body" className="text-gray-400 italic mt-8 ml-6">No photos available.</AppText>
            )}
        </>
    );
};

export default NotVisitedProvinceContent;
