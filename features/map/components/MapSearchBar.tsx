import React from "react";
import { View, TextInput, FlatList, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import SearchIcon from "@/assets/icons/search-icon.svg";
import ProvinceStats from "./ProvinceStats";
import AppText from "@/components/AppText";
import { useProfileStore } from "@/store/useProfileStore";

interface ProvinceItem {
    id: string;
    val: string;
}

interface MapSearchBarProps {
    searchQuery: string;
    onSearch: (text: string) => void;
    filteredProvinces: ProvinceItem[];
    showSuggestions: boolean;
    onSelectProvince: (item: ProvinceItem) => void;
}

const MapSearchBar: React.FC<MapSearchBarProps> = ({
    searchQuery,
    onSearch,
    filteredProvinces,
    showSuggestions,
    onSelectProvince,
}) => {
    const router = useRouter();
    const { avatarUri } = useProfileStore();

    return (
        <View className="absolute top-4 left-4 right-4 z-50 flex-col gap-2">
            <View className="flex-row gap-3">
                <View className="flex-1 flex-row items-center bg-white rounded-full shadow-sm px-4 h-14 space-x-4 gap-1.5">
                    <SearchIcon width={20} height={20} />
                    <TextInput
                        className="flex-1 h-full font-sans text-slate-700 placeholder:text-slate-400 placeholder:font-sans"
                        placeholder="Search Province (e.g. Cebu)"
                        value={searchQuery}
                        onChangeText={onSearch}
                    />
                </View>

                {/* Profile Entry Point */}
                <TouchableOpacity
                    className="h-14 w-14 rounded-full bg-white shadow-sm items-center justify-center border-2 border-white overflow-hidden"
                    onPress={() => router.push('/profile')}
                >
                    {avatarUri ? (
                        <Image source={{ uri: avatarUri }} className="w-full h-full" />
                    ) : (
                        <View className="w-full h-full bg-slate-100 items-center justify-center">
                            <Feather name="user" size={24} color="#94a3b8" />
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {showSuggestions && filteredProvinces.length > 0 && (
                <View className="bg-white mt-1 rounded-lg shadow-lg max-h-60 mx-1">
                    <FlatList
                        data={filteredProvinces}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="p-3 border-b border-slate-100"
                                onPress={() => onSelectProvince(item)}
                            >
                                <AppText variant="Body" className="text-slate-700">{item.val}</AppText>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

            <View className="self-start">
                <ProvinceStats />
            </View>
        </View>
    );
};

export default MapSearchBar;
