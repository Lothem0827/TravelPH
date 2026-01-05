import React from 'react';
import { View, Image, ScrollView, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDiaryDetailsLogic } from '@/features/diary/hooks/useDiaryDetailsLogic';
import { PROVINCE_EMOJIS } from '@/constants/ProvinceEmojis';
import { formatVisitDate } from '@/utils/dateUtils';
import AppText from '@/components/AppText';
import KebabIcon from '@/assets/icons/kebab-icon.svg';
import CloseIcon from '@/assets/icons/close-icon.svg';
import DiaryActionSheet from '@/features/diary/components/DiaryActionSheet';
import DeleteConfirmationSheet from '@/features/diary/components/DeleteConfirmationSheet';

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
        router,
        // Menu & Delete Logic
        showMenu,
        setShowMenu,
        showDeleteConfirm,
        setShowDeleteConfirm,
        handleDelete
    } = useDiaryDetailsLogic();

    if (!diary || !province) {
        return (
            <SafeAreaView className="flex-1 bg-white justify-center items-center">
                <AppText variant="Body" className="text-gray-500">Loading diary...</AppText>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View className="px-5 py-3 flex-row items-center justify-between ">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                    <CloseIcon width={24} height={24} color="#64748B" />
                </TouchableOpacity>
                <AppText variant="ScreenTitle">Your {province.title} diary</AppText>
                <TouchableOpacity onPress={() => setShowMenu(true)} className="p-2 -mr-2">
                    <KebabIcon width={24} height={24} />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
                <View className="px-6 pt-6 flex-col gap-5 ">
                    {/* Hero Title */}
                    <View className="flex-col gap-2">
                        <View className="flex-row items-center">
                            <AppText variant="Heading">{province.title}</AppText>
                            <AppText variant="Body" className="ml-1.5">{emoji}</AppText>
                        </View>

                        {/* Notes */}
                        {diary.notes && (
                            <AppText variant="Body">
                                {diary.notes}
                            </AppText>
                        )}

                        {/* Date */}
                        <AppText variant="BodySmall" >
                            Visited {formattedDate}
                        </AppText>
                    </View>

                    {/* Photos Grid */}
                    <View className='flex-col gap-2.5 '>
                        <AppText variant="Label">

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
                                            <AppText variant="Heading" className="text-white text-xl">+{remainingImagesCount}</AppText>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        {diary.images.length > 6 && (
                            <TouchableOpacity
                                className="self-center p-2"
                                onPress={toggleShowAllPhotos}
                            >
                                <AppText variant="AlertText" >
                                    {showAllPhotos ? "Show less" : `Show all ${diary.images.length} photos`}
                                </AppText>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* What did you do Tags */}
                    <View className='flex-col gap-2.5'>
                        <AppText variant="Label">What did you do?</AppText>
                        <View className="flex-row flex-wrap gap-2">
                            {diary.tags.map((tag, index) => (
                                <View key={index} className="px-4 py-2 rounded-full border border-yellow-200 bg-yellow-50">
                                    <AppText variant="PillText">{tag}</AppText>
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
                            <AppText variant="Label">Next memory</AppText>
                        </View>
                        <TouchableOpacity
                            className="mt-2.5 flex-row items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100"
                            onPress={handleNextMemory}
                        >
                            <View className="flex-row items-center">
                                <AppText variant="BodyBoldLarge" className="text-slate-700 mr-2">{nextMemory.title}</AppText>
                                <AppText variant="Body">{PROVINCE_EMOJIS[nextMemory.id] || '🇵🇭'}</AppText>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                        </TouchableOpacity>
                        <AppText variant="BodySmall" className="mt-2 ml-1">Visited {formatVisitDate(nextMemory.visitedDate, nextMemory.visitedDate, 'long')}</AppText>
                    </View>
                )}
            </ScrollView>

            <DiaryActionSheet
                visible={showMenu}
                onClose={() => setShowMenu(false)}
                onEdit={handleEdit}
                onDelete={() => {
                    setShowMenu(false);
                    setShowDeleteConfirm(true);
                }}
            />

            <DeleteConfirmationSheet
                visible={showDeleteConfirm}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </SafeAreaView >
    );
};

export default DiaryScreen;
