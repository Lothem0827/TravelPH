import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AppText from '@/components/AppText';
import { useTravelStore } from '@/store/useTravelStore';
import { PROVINCE_CONTENT } from '@/constants/ProvinceData';

export default function PatchesGrid() {
    const { visited } = useTravelStore();

    const earnedPatches = useMemo(() => {
        const regionCounts = { Luzon: 0, Visayas: 0, Mindanao: 0 };
        visited.forEach(id => {
            const p = PROVINCE_CONTENT.find(c => c.id === id);
            if (p?.islandGroup) regionCounts[p.islandGroup]++;
        });

        return [
            { id: 'luzon', label: 'Luzon', icon: 'sun', earned: regionCounts.Luzon > 0, color: '#d97706', bg: 'bg-amber-100' },
            { id: 'visayas', label: 'Visayas', icon: 'anchor', earned: regionCounts.Visayas > 0, color: '#0284c7', bg: 'bg-sky-100' },
            { id: 'mindanao', label: 'Mindanao', icon: 'image', earned: regionCounts.Mindanao > 0, color: '#059669', bg: 'bg-emerald-100' },
            { id: 'explorer', label: 'Explorer', icon: 'compass', earned: visited.length >= 10, color: '#7c3aed', bg: 'bg-violet-100' },
        ];
    }, [visited]);

    return (
        <View className="mb-8">
            <AppText className="text-lg font-semibold text-slate-800 mb-4 px-1">Travel Patches</AppText>
            <View className="flex-row justify-between">
                {earnedPatches.map((patch) => (
                    <View key={patch.id} className="items-center w-[22%]">
                        <View className={`w-16 h-16 rounded-full items-center justify-center mb-2 ${patch.earned ? patch.bg : 'bg-slate-100'
                            }`}>
                            <Feather
                                name={patch.icon as any}
                                size={24}
                                color={patch.earned ? patch.color : '#cbd5e1'}
                            />
                        </View>
                        <AppText className={`text-xs text-center ${patch.earned ? 'text-slate-600 font-medium' : 'text-slate-300'}`}>
                            {patch.label}
                        </AppText>
                    </View>
                ))}
            </View>
        </View>
    );
}
