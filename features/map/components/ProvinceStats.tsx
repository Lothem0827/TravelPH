import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTravelStore } from '@/store/useTravelStore';
import FlagIcon from '@/assets/icons/flag-icon.svg';
import AppText from '@/components/AppText';

export default function ProvinceStats() {
    const { visited, wishlisted } = useTravelStore();

    const visitedCount = visited.length;
    const wishlistCount = wishlisted.length;

    return (
        <View className="flex-row items-center bg-white rounded-full px-4 py-3 gap-3">
            {/* Visited Stat */}
            <View className="flex-row items-center gap-1">
                <FlagIcon width={14} height={14} color="#FACC15" />
                <AppText variant="Body" className="text-slate-500">
                    {visitedCount > 0 && <AppText variant="BodyBold" className="text-slate-700">{visitedCount} </AppText>}
                    Visited
                </AppText>
            </View>


            {/* Wishlist Stat */}
            <View className="flex-row items-center gap-1">
                <FlagIcon width={14} height={14} color="#CBD5E1" />
                <AppText variant="Body" className="text-slate-500">
                    {wishlistCount > 0 && <AppText variant="BodyBold" className="text-slate-700">{wishlistCount} </AppText>}
                    Wishlist
                </AppText>
            </View>
        </View>
    );
}
