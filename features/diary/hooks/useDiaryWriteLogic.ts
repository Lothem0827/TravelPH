import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { DateData } from 'react-native-calendars';
import { saveDiaryEntry, getDiaryDetails, getProvinceDetails } from '@/database/queries';
import { useTravelStore } from '@/store/useTravelStore';
import { toSentenceCase } from '@/utils/textUtils';

export const useDiaryWriteLogic = () => {
    const router = useRouter();
    const { provinceId } = useLocalSearchParams<{ provinceId: string }>();
    const { refreshData } = useTravelStore();

    // Derived state
    const provinceDetails = provinceId ? getProvinceDetails(provinceId) : null;
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
            setCurrentMonth(start);
            setPickerYear(start.getFullYear());
            setNotes(existingDiary.notes || '');
            setTags(existingDiary.tags || []);
            setImages(existingDiary.images || []);
            updateMarkedDates(start, end);
        } else {
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

        range[startStr] = { startingDay: true, color: '#fbbf24', textColor: 'white' };

        current.setDate(current.getDate() + 1);
        while (current < last) {
            const str = toDateString(current);
            range[str] = { color: '#fef3c7', textColor: '#4b5563' };
            current.setDate(current.getDate() + 1);
        }

        if (startStr !== endStr) {
            range[endStr] = { endingDay: true, color: '#fbbf24', textColor: 'white' };
        } else {
            range[startStr] = { startingDay: true, endingDay: true, color: '#fbbf24', textColor: 'white' };
        }

        setMarkedDates(range);
    };

    const handleDayPress = (day: DateData) => {
        const selectedDate = new Date(day.year, day.month - 1, day.day);

        let newStart = startDate;
        let newEnd = endDate;

        if (activeDateType === 'start') {
            newStart = selectedDate;
            newEnd = selectedDate;
        } else {
            newEnd = selectedDate;
            if (newEnd < newStart) {
                newStart = newEnd;
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
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays === 1 ? '1 Day' : `${diffDays} Days`;
    };

    const handleAddTag = () => {
        if (newTag.trim() && tags.length < 12) {
            setTags([...tags, toSentenceCase(newTag.trim())]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const changeMonth = (increment: number) => {
        const newDate = new Date(currentMonth);
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
                notes: toSentenceCase(notes),
                tags,
                images,
                id: existingDiary?.id
            });

            await refreshData();
            setIsSaved(true);

            setTimeout(() => {
                router.back();
            }, 1000);

        } catch (error) {
            console.error('Failed to save diary:', error);
            Alert.alert('Error', 'Failed to save diary entry. Please try again.');
        }
    };

    return {
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
        toDateString,
        setCurrentMonth,
        handleFormatNotes: () => setNotes(toSentenceCase(notes))
    };
};
