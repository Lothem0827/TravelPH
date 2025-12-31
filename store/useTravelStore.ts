import { create } from 'zustand';
import { getProvinceStatuses, setVisitedStatus, setWishlistStatus, getAllVisitedProvinceImages, ProvinceStatus } from '@/database/queries';

// Colors
const COLOR_VISITED = "#FACC15"; // Yellow 400
const COLOR_WISHLIST = "#94A3B8"; // Slate 400

interface TravelState {
    visited: string[];
    wishlisted: string[];
    visitedImages: Record<string, string>; // Map provinceId -> imageUri
    shouldCloseSheet: number;

    // Actions
    refreshData: () => void;
    addToWishlist: (id: string) => void;
    markVisited: (id: string) => void;
    triggerCloseSheet: () => void;
}

export const useTravelStore = create<TravelState>((set, get) => ({
    visited: [],
    wishlisted: [],
    visitedImages: {},
    shouldCloseSheet: 0,

    refreshData: () => {
        try {
            const provinces = getProvinceStatuses();
            const visited = provinces.filter(p => p.visited).map(p => p.id);
            const wishlisted = provinces.filter(p => p.wishlisted).map(p => p.id);
            const visitedImages = getAllVisitedProvinceImages();

            set({ visited, wishlisted, visitedImages });
        } catch (e) {
            console.error("Failed to load travel data:", e);
        }
    },

    addToWishlist: (id) => {
        // Toggle logic or Add logic? Assuming "Add"
        // If already visited, maybe don't add to wishlist?
        // For simplicity: Set wishlist=1.

        try {
            // Get current wishlist status and toggle it
            const provinces = getProvinceStatuses();
            const province = provinces.find(p => p.id === id);
            const isCurrentlyWishlisted = province?.wishlisted || false;

            // Update DB - toggle the status
            setWishlistStatus(id, !isCurrentlyWishlisted);
            // In a real app we might want to un-visit? 
            // setVisitedStatus(id, false); 

            // Refresh State (Source of Truth is DB)
            get().refreshData();
        } catch (e) {
            console.error("Failed to update wishlist:", e);
        }
    },

    markVisited: (id) => {
        try {
            // Update DB
            setVisitedStatus(id, true);
            // Optionally remove from wishlist
            setWishlistStatus(id, false);

            // Refresh State
            get().refreshData();
        } catch (e) {
            console.error("Failed to mark visited:", e);
        }
    },

    triggerCloseSheet: () => set({ shouldCloseSheet: Date.now() }),
}));
