
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    SafeAreaView,
    StatusBar,
    Platform,
    Alert,
    KeyboardAvoidingView,
    Modal,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, DateData } from 'react-native-calendars';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import CalendarIcon from '@/assets/icons/calendar-icon.svg';
import PlusIcon from '@/assets/icons/plus-icon.svg';
import CheckIcon from '@/assets/icons/check-icon.svg';
import { saveDiaryEntry, getDiaryDetails, getProvinceDetails } from '@/database/queries';
import { useTravelStore } from '@/store/useTravelStore';
import Button from '@/components/Button';

const WriteDiaryScreen = () => {
    const router = useRouter();
    const { provinceId } = useLocalSearchParams<{ provinceId: string }>();
    const { refreshData } = useTravelStore();

    // Derived state
    const provinceDetails = provinceId ? getProvinceDetails(provinceId) : null;
    // Check if diary exists for edit mode
    const existingDiary = (provinceId && provinceDetails?.visited) ? getDiaryDetails(provinceId) : null;
    const isEditing = !!existingDiary;

    // Form state
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
    const [notes, setNotes] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [isProcessingImages, setIsProcessingImages] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Calendar navigation state
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isYearPickerVisible, setYearPickerVisible] = useState(false);
    const [pickerYear, setPickerYear] = useState(new Date().getFullYear());
    const [activeDateType, setActiveDateType] = useState<'start' | 'end'>('start');

    useEffect(() => {
        if (existingDiary) {
            const start = new Date(existingDiary.startDate);
            const end = new Date(existingDiary.endDate);
            setStartDate(start);
            setEndDate(end);
            setCurrentMonth(start); // Sync calendar view
            setPickerYear(start.getFullYear());
            setNotes(existingDiary.notes || '');
            setTags(existingDiary.tags || []);
            setImages(existingDiary.images || []);

            // Pre-fill calendar markers
            updateMarkedDates(start, end);
        } else {
            // Default to today
            const today = new Date();
            setCurrentMonth(today);
            setPickerYear(today.getFullYear());
            updateMarkedDates(today, today);
        }
    }, [provinceId]);



    const toDateString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const updateMarkedDates = (start: Date, end: Date) => {
        const range: { [key: string]: any } = {};
        let current = new Date(start);
        const last = new Date(end);

        const startStr = toDateString(current);
        const endStr = toDateString(last);

        range[startStr] = { startingDay: true, color: '#fbbf24', textColor: 'white' }; // yellow-400

        // Loop through dates between start and end
        current.setDate(current.getDate() + 1);
        while (current < last) {
            const str = toDateString(current);
            range[str] = { color: '#fef3c7', textColor: '#4b5563' }; // yellow-100, gray-600
            current.setDate(current.getDate() + 1);
        }

        if (startStr !== endStr) {
            range[endStr] = { endingDay: true, color: '#fbbf24', textColor: 'white' };
        } else {
            // Single day
            range[startStr] = { startingDay: true, endingDay: true, color: '#fbbf24', textColor: 'white' };
        }

        setMarkedDates(range);
    };

    const handleDayPress = (day: DateData) => {
        // Construct date explicitly from components to avoid timezone issues
        const selectedDate = new Date(day.year, day.month - 1, day.day);

        let newStart = startDate;
        let newEnd = endDate;

        if (activeDateType === 'start') {
            newStart = selectedDate;
            newEnd = selectedDate; // Sync end date to start date as requested
        } else {
            newEnd = selectedDate;
            if (newEnd < newStart) {
                newStart = newEnd; // Auto-pull start date
            }
        }

        setStartDate(newStart);
        setEndDate(newEnd);
        updateMarkedDates(newStart, newEnd);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const calculateDuration = () => {
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
        return diffDays === 1 ? '1 Day' : `${diffDays} Days`;
    };

    const handleAddTag = () => {
        if (newTag.trim() && tags.length < 12) {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const changeMonth = (increment: number) => {
        const newDate = new Date(currentMonth);
        // Reset to 1st of month to avoid skipping months (e.g. Jan 31 + 1 month -> Mar 3)
        newDate.setDate(1);
        newDate.setMonth(newDate.getMonth() + increment);
        setCurrentMonth(newDate);
        setPickerYear(newDate.getFullYear());
    };

    const handleMonthSelect = (monthIndex: number) => {
        const newDate = new Date(pickerYear, monthIndex, 1);
        setCurrentMonth(newDate);
        setYearPickerVisible(false);
    };

    const MONTHS = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handlePickImage = async () => {
        if (images.length >= 20) {
            Alert.alert('Maximum photos reached', 'You can add up to 20 photos.');
            return;
        }

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant photo library access.');
            return;
        }

        // Show loading state immediately so it's there when the user returns
        setIsProcessingImages(true);

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 0.8,
            });

            if (result.canceled) {
                setIsProcessingImages(false);
                return;
            }

            // Simulate processing delay for smoothness
            setTimeout(() => {
                const newUris = result.assets.map(asset => asset.uri);
                setImages([...newUris, ...images]);
                setIsProcessingImages(false);
            }, 500);

        } catch (error) {
            setIsProcessingImages(false);
            console.error("Error picking images:", error);
        }
    };


    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!provinceId) return;

        if (images.length === 0) {
            Alert.alert('Missing Photos', 'Please add at least one photo to save this memory.');
            return;
        }

        try {
            await saveDiaryEntry({
                provinceId: provinceId,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                notes,
                tags,
                images,
                id: existingDiary?.id
            });

            await refreshData(); // Update global store (map colors etc)

            // Show success state
            setIsSaved(true);

            // Delay navigation back
            setTimeout(() => {
                router.back();
            }, 1000);

        } catch (error) {
            console.error('Failed to save diary:', error);
            Alert.alert('Error', 'Failed to save diary entry. Please try again.');
        }
    };

    if (!provinceId || !provinceDetails) return (
        <SafeAreaView className="flex-1 bg-white justify-center items-center">
            <Text className="text-gray-500 font-sans">Loading...</Text>
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

                <Text className="text-sm font-sans text-slate-500">
                    {isEditing ? 'Update Memory' : 'Save this adventure'}
                </Text>

                {/* Dummy view for balance */}
                <View className="w-10" />
            </View>

            {/* Main Content wrapped in KeyboardAvoidingView */}
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
                            <Text className="text-3xl font-semibold text-slate-700">
                                {provinceDetails.title} 🌴
                            </Text>
                            <Text className="text-slate-600 font-sans">A place you've been — let's remember it.</Text>
                        </View>

                        {/* Date of Visit */}
                        <View className="flex-col gap-2">
                            <Text className="text-sm font-sans text-slate-500">Date of visit</Text>
                            <View className="flex-row gap-3">
                                {/* Start Date */}
                                <TouchableOpacity
                                    onPress={() => {
                                        setActiveDateType('start');
                                        setShowCalendar(true);
                                        setCurrentMonth(startDate);
                                        setPickerYear(startDate.getFullYear());
                                    }}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3"
                                >
                                    <View className="flex-row items-center gap-2 mb-1">
                                        <CalendarIcon width={14} height={14} />
                                        <Text className="text-xs text-slate-500">From</Text>
                                    </View>
                                    <Text className="text-sm font-semibold text-slate-700">{formatDate(startDate)}</Text>
                                </TouchableOpacity>

                                {/* End Date */}
                                <TouchableOpacity
                                    onPress={() => {
                                        setActiveDateType('end');
                                        setShowCalendar(true);
                                        setCurrentMonth(endDate);
                                        setPickerYear(endDate.getFullYear());
                                    }}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3"
                                >
                                    <View className="flex-row items-center gap-2 mb-1">
                                        <CalendarIcon width={14} height={14} />
                                        <Text className="text-xs text-slate-500">To</Text>
                                    </View>
                                    <Text className="text-sm font-semibold text-slate-700">{formatDate(endDate)}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Notes */}
                        <View className="flex-col gap-2">
                            <Text className="text-sm font-sans text-slate-500">Notes (optional)</Text>
                            <TextInput
                                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-700 min-h-[100px] placeholder:font-sans placeholder:text-slate-400"
                                placeholder="What was the highlight of your trip?"
                                multiline
                                textAlignVertical="top"
                                value={notes}
                                onChangeText={setNotes}
                            />
                        </View>

                        {/* Tags */}
                        <View className="flex-col gap-2">
                            <View className='flex-row items-center justify-between'>
                                <Text className="text-sm font-sans text-slate-500">What did you do?</Text>
                                <Text className="text-xs font-sans text-slate-400">({tags.length}/12)</Text>
                            </View>
                            <View className="flex-row flex-wrap gap-2 mb-2">
                                {tags.map((tag, index) => (
                                    <View key={index} className="border border-yellow-300 rounded-full px-3.5 py-1 flex-row items-center justify-center gap-1">
                                        <Text className="text-yellow-600 text-sm font-medium">{tag}</Text>
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
                                        <Text className="text-white font-medium">Add</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>




                        {/* Photos */}
                        <View className="flex-col gap-0.5">
                            <View className="flex-row items-center justify-between">
                                <Text className="text-sm font-sans text-slate-500">Your memories</Text>
                                <Text className="text-xs font-sans text-slate-400">({images.length}/20)</Text>
                            </View>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                                <View className="flex-row gap-4 py-2">
                                    <TouchableOpacity
                                        onPress={handlePickImage}
                                        className="w-24 h-24 bg-yellow-50 rounded-2xl border border-dashed border-yellow-300 items-center justify-center"
                                        disabled={isProcessingImages}
                                    >
                                        {isProcessingImages ? (
                                            <View className="items-center">
                                                <ActivityIndicator size="small" color="#ca8a04" />
                                                <Text className="text-[10px] text-yellow-600 font-medium mt-1">Adding...</Text>
                                            </View>
                                        ) : (
                                            <PlusIcon width={28} height={28} />
                                        )}
                                    </TouchableOpacity>

                                    {isProcessingImages && (
                                        <>
                                            <View className="w-24 h-24 bg-slate-100 rounded-2xl animate-pulse" />
                                            <View className="w-24 h-24 bg-slate-100 rounded-2xl animate-pulse" />
                                            <View className="w-24 h-24 bg-slate-100 rounded-2xl animate-pulse" />
                                        </>
                                    )}

                                    {images.map((img, index) => (
                                        <View key={index} className="w-24 h-24 rounded-2xl overflow-hidden relative group">
                                            <Image source={{ uri: img }} className="w-full h-full" resizeMode="cover" />
                                            <TouchableOpacity
                                                onPress={() => handleRemoveImage(index)}
                                                className="absolute top-1.5 right-1.5 bg-black/50 rounded-full p-1"
                                            >
                                                <Ionicons name="close" size={12} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>


                    </View>


                    {/* Calendar Modal */}
                    <Modal
                        visible={showCalendar}
                        animationType="fade"
                        transparent={true}
                        onRequestClose={() => setShowCalendar(false)}
                    >
                        <View className="flex-1 bg-black/50 justify-center items-center p-4">
                            <View className="bg-white rounded-2xl w-full max-w-sm overflow-hidden p-4">
                                <Text className="text-lg font-semibold text-slate-700 mb-4 text-center">
                                    {activeDateType === 'start' ? 'Select Start Date' : 'Select End Date'}
                                </Text>

                                {/* Custom Calendar Header */}
                                <View className="flex-row items-center justify-between mb-2 px-2">
                                    <TouchableOpacity onPress={() => changeMonth(-1)} className="p-2">
                                        <Ionicons name="chevron-back" size={24} color="#ca8a04" />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => setYearPickerVisible(!isYearPickerVisible)}>
                                        <Text className="text-lg font-bold text-slate-800">
                                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => changeMonth(1)} className="p-2">
                                        <Ionicons name="chevron-forward" size={24} color="#ca8a04" />
                                    </TouchableOpacity>
                                </View>

                                {isYearPickerVisible ? (
                                    <View className="h-[350px] bg-white">
                                        {/* Year Selector */}
                                        <View className="flex-row items-center justify-center py-4 border-b border-slate-100 mb-2">
                                            <TouchableOpacity onPress={() => setPickerYear(pickerYear - 1)} className="p-2">
                                                <Ionicons name="chevron-back" size={24} color="#ca8a04" />
                                            </TouchableOpacity>
                                            <Text className="text-xl font-bold text-slate-800 mx-8">{pickerYear}</Text>
                                            <TouchableOpacity onPress={() => setPickerYear(pickerYear + 1)} className="p-2">
                                                <Ionicons name="chevron-forward" size={24} color="#ca8a04" />
                                            </TouchableOpacity>
                                        </View>

                                        {/* Month Grid */}
                                        <View className="flex-row flex-wrap justify-between px-2">
                                            {MONTHS.map((month, index) => (
                                                <TouchableOpacity
                                                    key={month}
                                                    className={`w-[30%] py-3 mb-3 rounded-xl items-center ${currentMonth.getMonth() === index && currentMonth.getFullYear() === pickerYear
                                                        ? 'bg-yellow-400'
                                                        : 'bg-slate-50'
                                                        }`}
                                                    onPress={() => handleMonthSelect(index)}
                                                >
                                                    <Text className={`font-medium ${currentMonth.getMonth() === index && currentMonth.getFullYear() === pickerYear
                                                        ? 'text-white'
                                                        : 'text-slate-600'
                                                        }`}>
                                                        {month.slice(0, 3)}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                ) : (
                                    <Calendar
                                        key={toDateString(currentMonth)}
                                        current={toDateString(currentMonth)}
                                        hideArrows={true}
                                        onMonthChange={(date) => {
                                            setCurrentMonth(new Date(date.dateString));
                                            setPickerYear(new Date(date.dateString).getFullYear());
                                        }}
                                        renderHeader={() => null} // Hide default header
                                        markingType={'period'}
                                        markedDates={markedDates}
                                        onDayPress={handleDayPress}
                                        theme={{
                                            todayTextColor: '#ca8a04',
                                            arrowColor: '#ca8a04',
                                            textMonthFontWeight: 'bold',
                                            textDayHeaderFontWeight: 'bold',
                                            stylesheet: {
                                                calendar: {
                                                    header: {
                                                        visible: false // Ensure header is hidden
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                )}
                                <Button
                                    title={`Select (${calculateDuration()})`}
                                    onPress={() => setShowCalendar(false)}
                                    variant="primary"
                                    className="mt-4"
                                />
                            </View>
                        </View>
                    </Modal>


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
