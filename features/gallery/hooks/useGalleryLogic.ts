import { useLocalSearchParams } from "expo-router";
import { getProvinceDetails, getDiaryDetails } from "@/database/queries";
import { PROVINCE_EMOJIS } from "@/constants/ProvinceEmojis";
import { formatVisitDate } from "@/utils/dateUtils";

export const useGalleryLogic = () => {
    const { provinceId, initialIndex } = useLocalSearchParams<{ provinceId: string; initialIndex: string }>();

    // Fetch Data
    const provinceDetails = provinceId ? getProvinceDetails(provinceId) : null;
    const diaryDetails = (provinceId && provinceDetails?.visited) ? getDiaryDetails(provinceId) : null;

    // Determine content source
    const images = (provinceDetails?.visited && diaryDetails)
        ? (diaryDetails.images || [])
        : (provinceDetails?.images || []);

    const provinceName = provinceDetails?.title || "Province";
    const emoji = provinceId ? PROVINCE_EMOJIS[provinceId] : "";
    const subtext = (provinceDetails?.visited && diaryDetails)
        ? `Visited ${formatVisitDate(diaryDetails.startDate, diaryDetails.endDate, 'long')}`
        : provinceDetails?.subtext || "";

    const startIndex = initialIndex ? parseInt(initialIndex, 10) : 0;

    // Helper to resolve image source
    const getImageSource = (img: any) => {
        if (typeof img === "string" && /^\d+$/.test(img)) {
            return Number(img); // Handle require() IDs passed as strings
        }
        return typeof img === "string" ? { uri: img } : img;
    };

    return {
        images,
        provinceName,
        emoji,
        subtext,
        startIndex,
        getImageSource
    };
};
