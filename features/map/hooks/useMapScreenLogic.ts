import { useState, useMemo, useEffect } from "react";
import { Keyboard, Dimensions } from "react-native";
import { PROVINCES } from "@/constants/ProvinceNames";
import { useTravelStore } from "@/store/useTravelStore";

export const useMapScreenLogic = () => {
    const { visited, wishlisted, addToWishlist, markVisited, shouldCloseSheet } = useTravelStore();

    // Dimensions
    const SHEET_HEIGHT = Dimensions.get('window').height * 0.75;

    // ... (rest of code)

    useEffect(() => {
        if (shouldCloseSheet > 0) {
            setIsBottomSheetVisible(false);
            setFocusProvince(null); // Optional: clear focus too
        }
    }, [shouldCloseSheet]);

    // Map Colors
    const provinceColors = useMemo(() => {
        const colors: { [key: string]: string } = {};
        if (Array.isArray(visited)) {
            visited.forEach(id => colors[id] = "#FACC15"); // Yellow 400
        }
        if (Array.isArray(wishlisted)) {
            wishlisted.forEach(id => colors[id] = "#A3B4CC"); // Slate 400
        }
        return colors;
    }, [visited, wishlisted]);

    // Map Focus State
    const [focusProvince, setFocusProvince] = useState<string | null>(null);

    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProvinces, setFilteredProvinces] = useState<typeof PROVINCES>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Bottom Sheet State
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
    const [selectedProvinceData, setSelectedProvinceData] = useState<{ id: string; val: string } | null>(null);

    // Actions
    const handleMapPress = (provinceId: string) => {
        const province = PROVINCES.find(p => p.id === provinceId);
        if (province) {
            setSelectedProvinceData(province);
        } else {
            setSelectedProvinceData({ id: provinceId, val: "Unknown Province" });
        }
        setIsBottomSheetVisible(true);
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

    const handleAddToWishlist = () => {
        if (selectedProvinceData) {
            addToWishlist(selectedProvinceData.id);
        }
    };

    const handleMarkAsVisited = () => {
        if (selectedProvinceData) {
            markVisited(selectedProvinceData.id);
            setIsBottomSheetVisible(false);
        }
    };

    const closeBottomSheet = () => setIsBottomSheetVisible(false);

    const visitedImages = useTravelStore(state => state.visitedImages);

    return {
        // Data
        visited,
        provinceColors,
        focusProvince,
        searchQuery,
        filteredProvinces,
        showSuggestions,
        isBottomSheetVisible,
        selectedProvinceData,
        SHEET_HEIGHT,
        visitedImages,

        // Actions
        handleMapPress,
        handleSearch,
        handleSelectProvince,
        handleAddToWishlist,
        handleMarkAsVisited,
        closeBottomSheet
    };
};
