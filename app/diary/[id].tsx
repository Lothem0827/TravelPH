import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { getDiaryDetails, getProvinceDetails, getNextVisitedProvince, DiaryDetails, ProvinceDetails } from '@/database/queries';
import { PROVINCE_EMOJIS } from '@/constants/ProvinceEmojis';
import { Ionicons } from '@expo/vector-icons';
import { formatVisitDate } from '@/utils/dateUtils';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

const DiaryScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [diary, setDiary] = useState<DiaryDetails | null>(null);
    const [province, setProvince] = useState<ProvinceDetails | null>(null);
    const [nextMemory, setNextMemory] = useState<{ id: string; title: string; visitedDate: string } | null>(null);
    const [showAllPhotos, setShowAllPhotos] = useState(false);

    const refreshDiary = () => {
        if (id) {
            const diaryData = getDiaryDetails(id);
            const provinceData = getProvinceDetails(id);
            const nextData = getNextVisitedProvince(id);

            setDiary(diaryData);
            setProvince(provinceData);
            setNextMemory(nextData);
        }
    };

    useFocusEffect(
        useCallback(() => {
            refreshDiary();
        }, [id])
    );

    const handleEdit = () => {
        router.push({
            pathname: "/diary/write",
            params: { provinceId: id as string }
        });
    };




    if (!diary || !province) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <Text className="text-gray-500 font-sans">Loading diary...</Text>
            </SafeAreaView>
        );
    }

    const displayedImages = showAllPhotos ? diary.images : diary.images.slice(0, 6);
    const remainingImagesCount = Math.max(0, diary.images.length - 6);

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View className="px-5 py-3 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                    <Ionicons name="close" size={24} color="#64748B" />
                </TouchableOpacity>
                <Text className="text-sm font-sans text-slate-500">Your {province.title} diary</Text>
                <TouchableOpacity onPress={handleEdit} className="p-2 -mr-2">
                    <Text className="text-yellow-600 font-medium text-sm">Edit</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
                <View className="px-6 pt-6 flex-col gap-5 ">
                    {/* Hero Title */}

                    <View className="flex-col gap-2">
                        <View className="flex-row items-center">
                            <Text className="text-3xl font-semibold text-slate-700">{province.title}</Text>
                            <Text className="text-lg font-sans ml-1.5">{PROVINCE_EMOJIS[id as string] || '🇵🇭'}</Text>
                        </View>

                        <View className="flex-col gap-1">
                            {/* Notes */}
                            {diary.notes && (
                                <Text className="text-slate-600 font-sans">
                                    {diary.notes}
                                </Text>
                            )}

                            {/* Date */}
                            <Text className="text-sm font-sans text-slate-400">
                                Visited {formatVisitDate(diary.startDate, diary.endDate, 'long')}
                            </Text>
                        </View>
                    </View>



                    {/* Photos Grid */}
                    <View className='flex-col gap-2.5 '>
                        <Text className="text-sm font-sans text-slate-500 ">
                            {diary.images.length} Photos
                        </Text>

                        <View className="flex-row flex-wrap gap-2">
                            {displayedImages.map((img, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        if (id) {
                                            router.push({
                                                pathname: "/gallery",
                                                params: { provinceId: id as string, initialIndex: index.toString() }
                                            });
                                        }
                                    }}
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
                                            <Text className="text-white font-semibold text-xl">+{remainingImagesCount}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        {diary.images.length > 6 && (
                            <TouchableOpacity
                                className="mt-2 self-center p-2"
                                onPress={() => setShowAllPhotos(!showAllPhotos)}
                            >
                                <Text className="text-slate-500 font-medium">
                                    {showAllPhotos ? "Show less" : `Show all ${diary.images.length} photos`}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* What did you do Tags */}
                    <View className='flex-col gap-2.5'>
                        <Text className="text-sm font-sans text-slate-500">What did you do?</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {diary.tags.map((tag, index) => (
                                <View key={index} className="px-4 py-2 rounded-full border border-yellow-200 bg-yellow-50">
                                    <Text className="text-yellow-700 font-medium">{tag}</Text>
                                </View>
                            ))}
                            {diary.tags.length === 0 && (
                                <Text className="text-slate-400 italic font-sans">No activities recorded.</Text>
                            )}
                        </View>
                    </View>


                </View>
                {/* Next Memory*/}
                {nextMemory && (
                    <View className="mt-12 w-full px-6  ">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-sm font-medium text-slate-400">Next memory</Text>
                        </View>
                        <TouchableOpacity
                            className="mt-2.5 flex-row items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100"
                            onPress={() => {
                                router.replace(`/diary/${nextMemory.id}`);
                            }}
                        >
                            <View className="flex-row items-center">
                                <Text className="text-lg font-semibold text-slate-700 mr-2">{nextMemory.title}</Text>
                                <Text className="text-lg font-sans">{PROVINCE_EMOJIS[nextMemory.id] || '🇵🇭'}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                        </TouchableOpacity>
                        <Text className="text-xs text-slate-400 mt-2 ml-1 font-sans">Visited {formatVisitDate(nextMemory.visitedDate, nextMemory.visitedDate, 'long')}</Text>
                    </View>
                )}


            </ScrollView>







        </SafeAreaView >
    );
};

export default DiaryScreen;
