import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import AppText from '@/components/AppText';
import ProfileHeader from '@/features/profile/components/ProfileHeader';
import TravelStats from '@/features/profile/components/TravelStats';
import PatchesGrid from '@/features/profile/components/PatchesGrid';
import PreferencesSection from '@/features/profile/components/PreferencesSection';
import EditProfileSheet from '@/features/profile/components/EditProfileSheet';

import CloseIcon from "@/assets/icons/close-icon.svg";

export default function ProfileScreen() {
    const router = useRouter();
    const [isEditSheetVisible, setIsEditSheetVisible] = useState(false);

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="px-5 py-3 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
                    <CloseIcon width={24} height={24} color="#64748B" />
                </TouchableOpacity>

                <AppText variant="ScreenTitle" className="text-slate-500">
                    My Profile
                </AppText>

                {/* Dummy view to balance the header for centering */}
                <View className="w-10" />
            </View>

            <ScrollView
                className="flex-1 px-6"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <ProfileHeader />

                <TravelStats />

                <PatchesGrid />

                <PreferencesSection onEditProfile={() => setIsEditSheetVisible(true)} />
            </ScrollView>

            <EditProfileSheet
                visible={isEditSheetVisible}
                onClose={() => setIsEditSheetVisible(false)}
            />
        </SafeAreaView>
    );
}
