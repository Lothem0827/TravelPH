import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AppText from '@/components/AppText';
import { useProfileStore } from '@/store/useProfileStore';

export default function ProfileHeader() {
    const { displayName, bio, avatarUri, setProfile } = useProfileStore();

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setProfile({ avatarUri: result.assets[0].uri });
        }
    };

    return (
        <View className="items-center py-6">
            <TouchableOpacity
                onPress={handlePickImage}
                className="relative mb-4"
                activeOpacity={0.8}
            >
                <View className="w-28 h-28 rounded-full border-4 border-white shadow-sm bg-slate-100 items-center justify-center overflow-hidden">
                    {avatarUri ? (
                        <Image source={{ uri: avatarUri }} className="w-full h-full" />
                    ) : (
                        <Feather name="user" size={48} color="#cbd5e1" />
                    )}
                </View>
                <View className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-sm border border-slate-100">
                    <Feather name="camera" size={16} color="#64748b" />
                </View>
            </TouchableOpacity>

            <AppText variant="Heading" className="text-2xl text-slate-800 mb-1">
                {displayName || 'Traveler'}
            </AppText>

            <AppText variant="Body" className="text-slate-500 text-center px-8" numberOfLines={2}>
                {bio || 'Write a short note about your journey...'}
            </AppText>
        </View>
    );
}
