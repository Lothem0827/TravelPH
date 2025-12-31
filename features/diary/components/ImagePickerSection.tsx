import React from 'react';
import { View, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PlusIcon from '@/assets/icons/plus-icon.svg';
import AppText from '@/components/AppText';
import DraggableFlatList, { ScaleDecorator, RenderItemParams } from 'react-native-draggable-flatlist';

interface ImagePickerSectionProps {
    images: string[];
    onPickImage: () => void;
    onRemoveImage: (index: number) => void;
    onReorderImages?: (images: string[]) => void;
    isProcessing: boolean;
}

const ImagePickerSection: React.FC<ImagePickerSectionProps> = ({
    images,
    onPickImage,
    onRemoveImage,
    onReorderImages,
    isProcessing,
}) => {

    const renderItem = ({ item, drag, isActive, getIndex }: RenderItemParams<string>) => {
        const index = getIndex();
        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onLongPress={drag}
                    activeOpacity={1}
                    className="w-24 h-24 rounded-2xl overflow-hidden relative group mr-4"
                    disabled={isActive}
                >
                    <Image
                        source={{ uri: item }}
                        className={`w-full h-full ${isActive ? 'opacity-70' : 'opacity-100'}`}
                        resizeMode="cover"
                    />
                    <TouchableOpacity
                        onPress={() => index !== undefined && onRemoveImage(index)}
                        className="absolute top-1.5 right-1.5 bg-black/50 rounded-full p-1"
                    >
                        <Ionicons name="close" size={12} color="white" />
                    </TouchableOpacity>
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };

    const renderHeader = () => (
        <View className="flex-row mr-4 gap-4">
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
        </View>
    );

    return (
        <View className="flex-col gap-0.5">
            <View className="flex-row items-center justify-between">
                <AppText variant="Body" className="text-slate-500">Your memories</AppText>
                <AppText variant="Caption" className="text-slate-400">({images.length}/20)</AppText>
            </View>

            <View className="h-28">
                <DraggableFlatList
                    data={images}
                    onDragEnd={({ data }) => onReorderImages?.(data)}
                    keyExtractor={(item) => item}
                    renderItem={renderItem}
                    horizontal
                    ListHeaderComponent={renderHeader}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 2 }}
                />
            </View>
        </View>
    );
};

export default ImagePickerSection;
