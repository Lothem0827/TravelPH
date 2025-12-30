import { useState, useMemo } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InteractivePHMap from "@/features/map/components/InteractivePHMap";
import ProvinceBottomSheet from "@/features/map/components/ProvinceBottomSheet";
import { PROVINCES } from "@/constants/ProvinceNames";
import { useTravelStore } from "@/store/useTravelStore";
import SearchIcon from "@/assets/icons/search-icon.svg";
import ProvinceStats from "@/features/map/components/ProvinceStats";

export default function MapScreen() {
  const { visited, wishlisted, addToWishlist, markVisited } = useTravelStore();

  const provinceColors = useMemo(() => {
    const colors: { [key: string]: string } = {};
    if (Array.isArray(visited)) {
      visited.forEach(id => colors[id] = "#FACC15"); // Yellow 400
    }
    if (Array.isArray(wishlisted)) {
      wishlisted.forEach(id => colors[id] = "#94A3B8"); // Slate 400
    }
    return colors;
  }, [visited, wishlisted]);

  const [focusProvince, setFocusProvince] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProvinces, setFilteredProvinces] = useState<typeof PROVINCES>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Bottom Sheet State
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [selectedProvinceData, setSelectedProvinceData] = useState<{ id: string; val: string } | null>(null);

  const handleMapPress = (provinceId: string) => {
    console.log("Clicked province:", provinceId);

    // Show Bottom Sheet
    const province = PROVINCES.find(p => p.id === provinceId);
    if (province) {
      setSelectedProvinceData(province);
      setIsBottomSheetVisible(true);
    } else {
      setSelectedProvinceData({ id: provinceId, val: "Unknown Province" });
      setIsBottomSheetVisible(true);
    }
  };

  const handleAddToWishlist = () => {
    if (selectedProvinceData) {
      addToWishlist(selectedProvinceData.id);
      // Don't close here - let ProvinceBottomSheet handle the close timing
    }
  };

  const handleMarkAsVisited = () => {
    if (selectedProvinceData) {
      markVisited(selectedProvinceData.id);
      setIsBottomSheetVisible(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 0) {
      const filtered = PROVINCES.filter((p) =>
        p.val.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProvinces(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredProvinces([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectProvince = (item: { id: string; val: string }) => {
    setSearchQuery(item.val);
    setShowSuggestions(false);
    setFocusProvince(item.id);
    setSelectedProvinceData(item);
    setIsBottomSheetVisible(true);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <View className="flex-1 w-full relative">
        {/* Search Input & Stats Stack */}
        <View className="absolute top-4 left-4 right-4 z-50 flex-col gap-2">
          <View className="flex-row items-center bg-white rounded-full shadow-sm px-4 h-14 space-x-4 gap-1.5">
            <SearchIcon width={20} height={20} />
            <TextInput
              className="flex-1 h-full font-sans text-slate-700 placeholder:text-slate-400 placeholder:font-sans"
              placeholder="Search Province (e.g. Cebu)"
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>

          {showSuggestions && filteredProvinces.length > 0 && (
            <View className="bg-white mt-1 rounded-lg shadow-lg max-h-60">
              <FlatList
                data={filteredProvinces}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="p-3 border-b border-slate-100"
                    onPress={() => handleSelectProvince(item)}
                  >
                    <Text className="text-slate-700 font-sans">{item.val}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          <View className="self-start">
            <ProvinceStats />
          </View>
        </View>

        <InteractivePHMap
          width="100%"
          height="100%"
          onMapPress={handleMapPress}
          provinceColors={provinceColors}
          focusProvince={focusProvince}
        />

        <ProvinceBottomSheet
          isVisible={isBottomSheetVisible}
          onClose={() => setIsBottomSheetVisible(false)}
          provinceName={selectedProvinceData?.val}
          provinceId={selectedProvinceData?.id}
          onAddToWishlist={handleAddToWishlist}
          onMarkVisited={handleMarkAsVisited}
        />
      </View>
    </SafeAreaView>
  );
}
