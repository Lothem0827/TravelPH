import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useTravelStore } from '@/store/useTravelStore';
import FlagIcon from '@/assets/icons/flag-icon.svg';

export default function ProvinceStats() {
    const { visited, wishlisted } = useTravelStore();

    const visitedCount = visited.length;
    const wishlistCount = wishlisted.length;

    return (
        <View className={styles.container}>
            {/* Visited Stat */}
            <View className={styles.statItem}>
                <FlagIcon width={14} height={14} color="#FACC15" />
                <Text className={styles.text}>
                    {visitedCount > 0 && <Text className={styles.boldText}>{visitedCount} </Text>}
                    Visited
                </Text>
            </View>


            {/* Wishlist Stat */}
            <View className={styles.statItem}>
                <FlagIcon width={14} height={14} color="#94A3B8" />
                <Text className={styles.text}>
                    {wishlistCount > 0 && <Text className={styles.boldText}>{wishlistCount} </Text>}
                    Wishlist
                </Text>
            </View>
        </View>
    );
}

const styles = {
    container: `flex-row items-center bg-white rounded-full px-4 py-3 gap-3`,
    statItem: `flex-row items-center gap-1`,
    text: `text-slate-500  text-sm`,
    boldText: `font-bold text-slate-700`,
};
