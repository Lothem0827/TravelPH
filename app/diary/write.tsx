import React from 'react';
import { View, TouchableOpacity, TextInput, ScrollView, SafeAreaView, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CheckIcon from '@/assets/icons/check-icon.svg';
import Button from '@/components/Button';
import AppText from '@/components/AppText';
import { useDiaryWriteLogic } from '@/features/diary/hooks/useDiaryWriteLogic';
import ImagePickerSection from '@/features/diary/components/ImagePickerSection';
import { DiaryDateInput, DiaryCalendarModal } from '@/features/diary/components/DiaryDateSection';

const WriteDiaryScreen = () => {
    const router = useRouter();
    const {
        // State
        provinceDetails,
        isEditing,
        isSaved,
        notes,
        setNotes,
        tags,
        newTag,
        setNewTag,
        startDate,
        endDate,
        showCalendar,
        setShowCalendar,
        markedDates,
        images,
        isProcessingImages,
        currentMonth,
        isYearPickerVisible,
        setYearPickerVisible,
        pickerYear,
        setPickerYear,
        activeDateType,
        setActiveDateType,

        // Actions
        handleFormatNotes,
        handleAddTag,
        handleRemoveTag,
        handlePickImage,
        handleRemoveImage,
        handleSubmit,
        handleDayPress,
        changeMonth,
        handleMonthSelect,
        formatDate,
        calculateDuration,
        toDateString
    } = useDiaryWriteLogic();

    if (!provinceDetails) return (
        <SafeAreaView className="flex-1 bg-white justify-center items-center">
            <AppText variant="Body" className="text-gray-500">Loading...</AppText>
        </SafeAreaView>
    );

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View className="px-5 py-3 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                    <Ionicons name="close" size={24} color="#64748B" />
                </TouchableOpacity>

                <AppText variant="Body" className="text-slate-500">
                    {isEditing ? 'Update Memory' : 'Save this adventure'}
                </AppText>

                <View className="w-10" />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView
                    className="px-6 py-6 "
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: 24 }}
                >
                    <View className="flex-col gap-5 ">
                        {/* Province Name */}
                        <View className="flex-col gap-2 mb-3">
                            <AppText variant="H1">
                                {provinceDetails.title} 🌴
                            </AppText>
                            <AppText variant="Body" className="text-slate-600">A place you've been — let's remember it.</AppText>
                        </View>

                        {/* Date Input */}
                        <DiaryDateInput
                            startDate={startDate}
                            endDate={endDate}
                            onDateClick={(type) => {
                                setActiveDateType(type);
                                setShowCalendar(true);
                            }}
                            formatDate={formatDate}
                        />

                        {/* Notes */}
                        <View className="flex-col gap-2">
                            <AppText variant="Body" className="text-slate-500">Notes (optional)</AppText>
                            <TextInput
                                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-700 min-h-[100px] placeholder:font-sans placeholder:text-slate-400"
                                placeholder="What was the highlight of your trip?"
                                multiline
                                textAlignVertical="top"
                                value={notes}
                                onChangeText={setNotes}
                                onBlur={handleFormatNotes}
                            />
                        </View>

                        {/* Tags */}
                        <View className="flex-col gap-2">
                            <View className='flex-row items-center justify-between'>
                                <AppText variant="Body" className="text-slate-500">What did you do?</AppText>
                                <AppText variant="Caption" className="text-slate-400">({tags.length}/12)</AppText>
                            </View>
                            <View className="flex-row flex-wrap gap-2 mb-2">
                                {tags.map((tag, index) => (
                                    <View key={index} className="border border-yellow-300 rounded-full px-3.5 py-1 flex-row items-center justify-center gap-1">
                                        <AppText variant="Action" className="text-yellow-600">{tag}</AppText>
                                        <TouchableOpacity onPress={() => handleRemoveTag(index)}>
                                            <Ionicons name="close" size={14} color="#CA8A04" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                            {tags.length < 12 && (
                                <View className="flex-row gap-2 ">
                                    <TextInput
                                        className="flex-1 bg-slate-50 rounded-lg   text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3.5 placeholder:font-sans placeholder:text-slate-400"
                                        placeholder="e.g., Diving, Hiking"
                                        value={newTag}
                                        onChangeText={setNewTag}
                                        onSubmitEditing={handleAddTag}
                                    />
                                    <TouchableOpacity
                                        onPress={handleAddTag}
                                        className={`px-4 py-2 font-sans text-sm rounded-xl justify-center ${newTag.trim() && tags.length < 12 ? 'bg-slate-700' : 'bg-slate-200'}`}
                                        disabled={!newTag.trim() || tags.length >= 12}
                                    >
                                        <AppText variant="BodyBold" className="text-white font-medium">Add</AppText>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        {/* Photos */}
                        <ImagePickerSection
                            images={images}
                            onPickImage={handlePickImage}
                            onRemoveImage={handleRemoveImage}
                            isProcessing={isProcessingImages}
                        />

                    </View>

                    <DiaryCalendarModal
                        visible={showCalendar}
                        onClose={() => setShowCalendar(false)}
                        activeDateType={activeDateType}
                        currentMonth={currentMonth}
                        pickerYear={pickerYear}
                        isYearPickerVisible={isYearPickerVisible}
                        markedDates={markedDates}
                        setYearPickerVisible={setYearPickerVisible}
                        changeMonth={changeMonth}
                        setPickerYear={setPickerYear}
                        handleMonthSelect={handleMonthSelect}
                        handleDayPress={handleDayPress}
                        calculateDuration={calculateDuration}
                        toDateString={toDateString}
                    />

                </ScrollView>

                <View className="px-6 py-4 mt-2 bg-white">
                    <Button
                        title={isSaved ? 'Saved' : (isEditing ? 'Update Visit' : 'Save visit')}
                        onPress={handleSubmit}
                        variant={isSaved ? 'secondary' : 'primary'}
                        icon={isSaved ? <CheckIcon width={20} height={20} /> : undefined}
                        className="w-full"
                        disabled={isSaved}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView >
    );
};

export default WriteDiaryScreen;
