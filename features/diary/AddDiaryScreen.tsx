import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    Modal,
    Platform,
    Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { saveDiaryEntry, DiaryDetails } from '@/database/queries';
import { useTravelStore } from '@/store/useTravelStore';
import AppText from '@/components/AppText';

interface AddDiaryScreenProps {
    visible: boolean;
    provinceId: string;
    provinceName: string;
    onClose: () => void;
    onSaved: () => void;
    initialDetails?: DiaryDetails | null;
}

const AddDiaryScreen: React.FC<AddDiaryScreenProps> = ({
    visible,
    provinceId,
    provinceName,
    onClose,
    onSaved,
    initialDetails,
}) => {
    const { refreshData } = useTravelStore();

    // Form state
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [notes, setNotes] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');
    const [images, setImages] = useState<string[]>([]);

    React.useEffect(() => {
        if (visible) {
            if (initialDetails) {
                setStartDate(new Date(initialDetails?.startDate ?? new Date()));
                setEndDate(new Date(initialDetails?.endDate ?? new Date()));
                setNotes(initialDetails?.notes || '');
                setTags(initialDetails?.tags || []);
                setImages(initialDetails?.images || []);
            } else {
                setStartDate(new Date());
                setEndDate(new Date());
                setNotes('');
                setTags([]);
                setImages([]);
            }
        }
    }, [visible, initialDetails]);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleAddTag = () => {
        if (newTag.trim() && tags.length < 3) {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
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

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            const newImages = result.assets.map(asset => asset.uri);
            const totalImages = images.length + newImages.length;

            if (totalImages > 20) {
                Alert.alert('Too many photos', `You can only add ${20 - images.length} more photo(s).`);
                return;
            }

            setImages([...images, ...newImages]);
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        if (images.length === 0) {
            Alert.alert('Add at least one photo', 'Please add at least one memory photo.');
            return;
        }

        try {
            saveDiaryEntry({
                id: initialDetails?.id,
                provinceId,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                notes: notes.trim(),
                tags,
                images,
            });

            refreshData();
            onSaved();

            // Reset form
            setStartDate(new Date());
            setEndDate(new Date());
            setNotes('');
            setTags([]);
            setImages([]);
        } catch (error) {
            console.error('Error saving diary:', error);
            Alert.alert('Error', 'Failed to save your diary entry.');
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-white pt-12">
                {/* Header */}
                <View className="px-6 py-4 border-b border-slate-100">
                    <TouchableOpacity onPress={onClose} className="absolute left-6 top-4 z-10">
                        <AppText variant="H2" className="text-2xl text-slate-700">✕</AppText>
                    </TouchableOpacity>
                    <AppText variant="BodyBold" className="text-center text-slate-500 font-medium">
                        {initialDetails ? 'Update Memory' : 'Save this adventure'}
                    </AppText>
                </View>

                <ScrollView className="flex-1 px-6 py-6">
                    {/* Province Name */}
                    <AppText variant="H1" className="text-3xl text-slate-800 mb-1">
                        {provinceName} 🌴
                    </AppText>
                    <AppText variant="Body" className="text-slate-500 mb-6 font-sans">A place you've been — let's remember it.</AppText>

                    {/* Date of Visit */}
                    <AppText variant="BodyBold" className="text-slate-600 mb-2">Date of visit</AppText>
                    <View className="bg-slate-50 rounded-xl p-4 mb-6 flex-row items-center justify-between">
                        <TouchableOpacity
                            onPress={() => setShowStartPicker(true)}
                            className="flex-1"
                        >
                            <AppText variant="Body" className="text-slate-700">
                                📅 {formatDate(startDate)}
                                {startDate.getTime() !== endDate.getTime() && ` - ${formatDate(endDate)}`}
                            </AppText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                            <AppText variant="Action" className="text-yellow-600 font-semibold">Edit</AppText>
                        </TouchableOpacity>
                    </View>

                    {showStartPicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, selectedDate) => {
                                if (Platform.OS === 'android') {
                                    setShowStartPicker(false);
                                }
                                if (selectedDate) {
                                    setStartDate(selectedDate);
                                    if (selectedDate > endDate) {
                                        setEndDate(selectedDate);
                                    }
                                }
                            }}
                        />
                    )}

                    {showEndPicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            minimumDate={startDate}
                            onChange={(event, selectedDate) => {
                                if (Platform.OS === 'android') {
                                    setShowEndPicker(false);
                                }
                                if (selectedDate) {
                                    setEndDate(selectedDate);
                                }
                            }}
                        />
                    )}

                    {/* Notes */}
                    <AppText variant="BodyBold" className="text-slate-600 mb-2">Notes (optional)</AppText>
                    <TextInput
                        className="bg-slate-50 rounded-xl p-4 mb-6 text-slate-700 min-h-[100px]"
                        placeholder="What was the highlight of your trip?"
                        placeholderTextColor="#94a3b8"
                        multiline
                        textAlignVertical="top"
                        value={notes}
                        onChangeText={setNotes}
                    />

                    {/* What did you do */}
                    <AppText variant="BodyBold" className="text-slate-600 mb-2">What did you do?</AppText>
                    <View className="flex-row flex-wrap gap-2 mb-3">
                        {tags.map((tag, index) => (
                            <View key={index} className="bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2 flex-row items-center gap-2">
                                <AppText variant="Body" className="text-yellow-700 font-medium">{tag}</AppText>
                                <TouchableOpacity onPress={() => handleRemoveTag(index)}>
                                    <AppText variant="Body" className="text-yellow-600 font-sans">✕</AppText>
                                </TouchableOpacity>
                            </View>
                        ))}
                        {tags.length < 3 && (
                            <View className="flex-row items-center gap-2">
                                <TextInput
                                    className="bg-slate-50 rounded-full px-4 py-2 text-slate-700 min-w-[120px]"
                                    placeholder="Add activity"
                                    placeholderTextColor="#94a3b8"
                                    value={newTag}
                                    onChangeText={setNewTag}
                                    onSubmitEditing={handleAddTag}
                                />
                                <TouchableOpacity
                                    onPress={handleAddTag}
                                    className="bg-yellow-100 rounded-full w-8 h-8 items-center justify-center"
                                >
                                    <AppText variant="Body" className="text-yellow-700 font-semibold">+</AppText>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Your Memories */}
                    <View className="flex-row items-center justify-between mb-2">
                        <AppText variant="BodyBold" className="text-slate-600">Your memories</AppText>
                        <AppText variant="Caption" className="text-slate-400 font-sans">{images.length}/20 Added</AppText>
                    </View>

                    <View className="flex-row flex-wrap gap-3 mb-6">
                        {images.map((uri, index) => (
                            <View key={index} className="relative">
                                <Image
                                    source={{ uri }}
                                    className="w-24 h-32 rounded-xl bg-slate-200"
                                    resizeMode="cover"
                                />
                                <TouchableOpacity
                                    onPress={() => handleRemoveImage(index)}
                                    className="absolute -top-2 -right-2 bg-white rounded-full w-6 h-6 items-center justify-center shadow-md"
                                >
                                    <AppText variant="Body" className="text-slate-600 font-sans">✕</AppText>
                                </TouchableOpacity>
                            </View>
                        ))}

                        {images.length < 20 && (
                            <TouchableOpacity
                                onPress={handlePickImage}
                                className="w-24 h-32 rounded-xl bg-yellow-50 border-2 border-dashed border-yellow-200 items-center justify-center"
                            >
                                <AppText variant="H1" className="text-4xl text-yellow-400 mb-1">📷</AppText>
                                <AppText variant="Caption" className="text-yellow-600 font-medium">Add photos</AppText>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>

                {/* Save Button */}
                <View className="px-6 py-4 border-t border-slate-100">
                    <TouchableOpacity
                        onPress={handleSave}
                        className="bg-yellow-400 rounded-xl py-4 items-center active:bg-yellow-500"
                    >
                        <AppText variant="BodyBold" className="text-white font-semibold text-lg">
                            {initialDetails ? 'Update Visit' : 'Save visit'}
                        </AppText>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default AddDiaryScreen;
