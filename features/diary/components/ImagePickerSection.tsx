import React from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PlusIcon from '@/assets/icons/plus-icon.svg';
import AppText from '@/components/AppText';

interface ImagePickerSectionProps {
    images: string[];
    onPickImage: () => void;
    onRemoveImage: (index: number) => void;
    isProcessing: boolean;
}

const ImagePickerSection: React.FC<ImagePickerSectionProps> = ({
    images,
    onPickImage,
    onRemoveImage,
    isProcessing,
}) => {
    return (
        <View className="flex-col gap-0.5">
            <View className="flex-row items-center justify-between">
                <AppText variant="Body" className="text-slate-500">Your memories</AppText>
                <AppText variant="Caption" className="text-slate-400">({images.length}/20)</AppText>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                <View className="flex-row gap-4 py-2">
                    <TouchableOpacity
                        onPress={onPickImage}
                        className="w-24 h-24 bg-yellow-50 rounded-2xl border border-dashed border-yellow-300 items-center justify-center"
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <View className="items-center">
                                <ActivityIndicator size="small" color="#ca8a04" />
                                <AppText variant="Caption" className="text-yellow-600 font-medium mt-1">Adding...</AppText>
                            </View>
                        ) : (
                            <PlusIcon width={28} height={28} />
                        )}
                    </TouchableOpacity>

                    {isProcessing && (
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
                                onPress={() => onRemoveImage(index)}
                                className="absolute top-1.5 right-1.5 bg-black/50 rounded-full p-1"
                            >
                                <Ionicons name="close" size={12} color="white" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default ImagePickerSection;
