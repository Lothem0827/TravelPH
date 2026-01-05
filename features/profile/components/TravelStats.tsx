import React, { useMemo } from 'react';
import { View } from 'react-native';
import AppText from '@/components/AppText';
import { useTravelStore } from '@/store/useTravelStore';
import { PROVINCE_CONTENT } from '@/constants/ProvinceData';

const REGIONS = {
    Luzon: 38, // Approximate count for display breakdown
    Visayas: 16,
    Mindanao: 27,
};
// Note: Total is ~81/82. Adjusting logic to be dynamic based on actual data if possible, 
export default function TravelStats() {
    const { visited } = useTravelStore();

    const stats = useMemo(() => {
        const total = visited.length;
        const byRegion = { Luzon: 0, Visayas: 0, Mindanao: 0 };

        visited.forEach(id => {
            const province = PROVINCE_CONTENT.find(p => p.id === id);
            if (province && province.islandGroup) {
                byRegion[province.islandGroup]++;
            }
        });

        return { total, byRegion };
    }, [visited]);

    const RegionStat = ({ label, count, total }: { label: string, count: number, total: number }) => (
        <View className="items-center flex-1">
            <View className="items-baseline flex-row space-x-1">
                <AppText className="text-xl font-semibold text-slate-700">{count}</AppText>
                <AppText className="text-slate-300 text-xs">/{total}</AppText>
            </View>
            <AppText className="text-slate-400 text-xs mt-1">{label}</AppText>
        </View>
    );

    return (
        <View className="bg-white rounded-2xl p-6 shadow-sm mx-1 mb-6">
            <View className="items-center mb-6">
                <AppText className="text-5xl font-bold text-slate-800 tracking-tight">{stats.total}</AppText>
                <AppText className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-2">Provinces Visited</AppText>
                <AppText className="text-slate-300 text-xs mt-1">out of 82</AppText>
            </View>

            <View className="flex-row justify-between border-t border-slate-100 pt-6">
                <RegionStat label="Luzon" count={stats.byRegion.Luzon} total={38} />
                <View className="w-[1px] bg-slate-100 h-full" />
                <RegionStat label="Visayas" count={stats.byRegion.Visayas} total={16} />
                <View className="w-[1px] bg-slate-100 h-full" />
                <RegionStat label="Mindanao" count={stats.byRegion.Mindanao} total={27} />
            </View>
        </View>
    );
}
