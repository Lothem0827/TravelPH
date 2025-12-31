import React from 'react';
import { View, Image, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDiaryDetailsLogic } from '@/features/diary/hooks/useDiaryDetailsLogic';
import { PROVINCE_EMOJIS } from '@/constants/ProvinceEmojis';
import { formatVisitDate } from '@/utils/dateUtils';
import AppText from '@/components/AppText';

const DiaryScreen = () => {
    const {
        diary,
        province,
        nextMemory,
        showAllPhotos,
        displayedImages,
        remainingImagesCount,
        formattedDate,
        emoji,
        handleEdit,
        handleNextMemory,
        handlePhotoPress,
        toggleShowAllPhotos,
        router
    } = useDiaryDetailsLogic();

    if (!diary || !province) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <AppText variant="Body" className="text-gray-500">Loading diary...</AppText>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View className="px-5 py-3 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                    <Ionicons name="close" size={24} color="#64748B" />
                </TouchableOpacity>
                <AppText variant="Body" className="text-slate-500">Your {province.title} diary</AppText>
                <TouchableOpacity onPress={handleEdit} className="p-2 -mr-2">
                    <AppText variant="Action" className="text-yellow-600">Edit</AppText>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
                <View className="px-6 pt-6 flex-col gap-5 ">
                    {/* Hero Title */}
                    <View className="flex-col gap-2">
                        <View className="flex-row items-center">
                            <AppText variant="H1">{province.title}</AppText>
                            <AppText variant="H2" className="ml-1.5">{emoji}</AppText>
                        </View>

                        <View className="flex-col gap-1">
                            {/* Notes */}
                            {diary.notes && (
                                <AppText variant="Body" className="text-slate-600">
                                    {diary.notes}
                                </AppText>
                            )}

                            {/* Date */}
                            <AppText variant="Body" className="text-slate-400">
                                Visited {formattedDate}
                            </AppText>
                        </View>
                    </View>

                    {/* Photos Grid */}
                    <View className='flex-col gap-2.5 '>
                        <AppText variant="Body" className="text-slate-500">
                            {diary.images.length} Photos
                        </AppText>

                        <View className="flex-row flex-wrap gap-2">
                            {displayedImages.map((img, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handlePhotoPress(index)}
                                    className="w-[48%] aspect-square rounded-2xl overflow-hidden bg-slate-100 relative"
                                >
                                    <Image
                                        source={{ uri: img }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                    {/* Overlay for the last image if there are remaining images AND we are not showing all */}
                                    {index === 5 && remainingImagesCount > 0 && !showAllPhotos && (
                                        <View className="absolute inset-0 bg-black/40 justify-center items-center">
                                            <AppText variant="H2" className="text-white text-xl">+{remainingImagesCount}</AppText>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        {diary.images.length > 6 && (
                            <TouchableOpacity
                                className="mt-2 self-center p-2"
                                onPress={toggleShowAllPhotos}
                            >
                                <AppText variant="Body" className="text-slate-500 font-medium">
                                    {showAllPhotos ? "Show less" : `Show all ${diary.images.length} photos`}
                                </AppText>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* What did you do Tags */}
                    <View className='flex-col gap-2.5'>
                        <AppText variant="Body" className="text-slate-500">What did you do?</AppText>
                        <View className="flex-row flex-wrap gap-2">
                            {diary.tags.map((tag, index) => (
                                <View key={index} className="px-4 py-2 rounded-full border border-yellow-200 bg-yellow-50">
                                    <AppText variant="Body" className="text-yellow-700 font-medium">{tag}</AppText>
                                </View>
                            ))}
                            {diary.tags.length === 0 && (
                                <AppText variant="Body" className="text-slate-400 italic">No activities recorded.</AppText>
                            )}
                        </View>
                    </View>


                </View>
                {/* Next Memory*/}
                {nextMemory && (
                    <View className="mt-12 w-full px-6  ">
                        <View className="flex-row items-center justify-between">
                            <AppText variant="Body" className="font-medium text-slate-400">Next memory</AppText>
                        </View>
                        <TouchableOpacity
                            className="mt-2.5 flex-row items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100"
                            onPress={handleNextMemory}
                        >
                            <View className="flex-row items-center">
                                <AppText variant="H2" className="text-slate-700 mr-2">{nextMemory.title}</AppText>
                                <AppText variant="H2">{PROVINCE_EMOJIS[nextMemory.id] || '🇵🇭'}</AppText>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                        </TouchableOpacity>
                        <AppText variant="Caption" className="mt-2 ml-1">Visited {formatVisitDate(nextMemory.visitedDate, nextMemory.visitedDate, 'long')}</AppText>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView >
    );
};

export default DiaryScreen;
