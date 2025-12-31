import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import InteractivePHMap from "@/features/map/components/InteractivePHMap";
import ProvinceBottomSheet from "@/features/map/components/ProvinceBottomSheet";
import MapSearchBar from "@/features/map/components/MapSearchBar";
import VisitedBadge from "@/features/map/components/VisitedBadge";
import { useMapScreenLogic } from "@/features/map/hooks/useMapScreenLogic";

export default function MapScreen() {
  const {
    visited,
    provinceColors,
    focusProvince,
    searchQuery,
    filteredProvinces,
    showSuggestions,
    isBottomSheetVisible,
    selectedProvinceData,
    SHEET_HEIGHT,
    handleMapPress,
    handleSearch,
    handleSelectProvince,
    handleAddToWishlist,
    handleMarkAsVisited,
    closeBottomSheet
  } = useMapScreenLogic();

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <View className="flex-1 w-full relative">

        <MapSearchBar
          searchQuery={searchQuery}
          onSearch={handleSearch}
          filteredProvinces={filteredProvinces}
          showSuggestions={showSuggestions}
          onSelectProvince={handleSelectProvince}
        />

        <InteractivePHMap
          width="100%"
          height="100%"
          onMapPress={handleMapPress}
          provinceColors={provinceColors}
          focusProvince={focusProvince}
          bottomSheetHeight={isBottomSheetVisible ? SHEET_HEIGHT : 0}
        />

        {/* Visited Badge */}
        {!isBottomSheetVisible && (
          <VisitedBadge visitedCount={visited.length} />
        )}

        <ProvinceBottomSheet
          isVisible={isBottomSheetVisible}
          onClose={closeBottomSheet}
          provinceName={selectedProvinceData?.val}
          provinceId={selectedProvinceData?.id}
          onAddToWishlist={handleAddToWishlist}
          onMarkVisited={handleMarkAsVisited}
        />
      </View>
    </SafeAreaView>
  );
}

