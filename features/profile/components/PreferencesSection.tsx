import React, { useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AppText from '@/components/AppText';
import { useTravelStore } from '@/store/useTravelStore';
import { useProfileStore } from '@/store/useProfileStore';
// import { useOnboardingStore } from '@/store/useOnboardingStore';
import { useRouter } from 'expo-router';

interface PreferencesSectionProps {
    onEditProfile: () => void;
}

export default function PreferencesSection({ onEditProfile }: PreferencesSectionProps) {
    const router = useRouter();
    const { resetData } = useTravelStore();
    const { resetProfile } = useProfileStore();
    // const { resetOnboarding } = useOnboardingStore();

    const handleReset = () => {
        Alert.alert(
            "Reset Diary",
            "Are you sure you want to delete all travel history and profile data? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Reset Everything",
                    style: "destructive",
                    onPress: () => {
                        resetData();
                        resetProfile();
                        // Optional: Reset onboarding too? 
                        // The user prompt said "Reset diary (with confirmation)". Usually users expect data reset. 
                        // I will NOT reset onboarding to force them through it again, unless they explicitly want a fresh install feel.
                        // But I'll leave onboarding as is for now, just clearing data.
                        Alert.alert("Reset Complete", "Your diary has been cleared.");
                    }
                }
            ]
        );
    };

    const MenuItem = ({ icon, label, onPress, isDestructive = false }: any) => (
        <TouchableOpacity
            className="flex-row items-center justify-between py-4 border-b border-slate-50 last:border-0"
            onPress={onPress}
        >
            <View className="flex-row items-center space-x-3">
                <View className={`w-8 h-8 rounded-full items-center justify-center ${isDestructive ? 'bg-red-50' : 'bg-slate-50'}`}>
                    <Feather name={icon} size={16} color={isDestructive ? '#ef4444' : '#64748b'} />
                </View>
                <AppText className={isDestructive ? 'text-red-500' : 'text-slate-700'}>{label}</AppText>
            </View>
            <Feather name="chevron-right" size={16} color="#cbd5e1" />
        </TouchableOpacity>
    );

    return (
        <View className="bg-white rounded-2xl p-4 shadow-sm mx-1">
            <MenuItem icon="edit-2" label="Edit Profile" onPress={onEditProfile} />
            <MenuItem icon="info" label="About this app" onPress={() => Alert.alert("About", "PH Travel Diary v1.0\n\nA local-first travel diary for the Philippines.")} />
            <MenuItem icon="trash-2" label="Reset Diary" onPress={handleReset} isDestructive />
        </View>
    );
}
