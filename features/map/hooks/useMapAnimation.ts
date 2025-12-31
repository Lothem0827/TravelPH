import React from "react";
import { withTiming } from "react-native-reanimated";
import { PROVINCE_PATHS } from "@/constants/ProvincePathList";
import { getPathBounds } from "@/utils/svgUtils";
import { VIEW_BOX_WIDTH, VIEW_BOX_HEIGHT, MAP_SAFETY_MARGIN } from "../utils/mapUtils";
import { SharedValue } from "react-native-reanimated";

interface UseMapAnimationProps {
    scale: SharedValue<number>;
    savedScale: SharedValue<number>;
    translateX: SharedValue<number>;
    savedTranslateX: SharedValue<number>;
    translateY: SharedValue<number>;
    savedTranslateY: SharedValue<number>;
    dimensions: { width: number; height: number };
    focusProvince: string | null;
    selectedProvince: string | null;
    setSelectedProvince: (id: string | null) => void;
    bottomSheetHeight: number;
}

export const useMapAnimation = ({
    scale,
    savedScale,
    translateX,
    savedTranslateX,
    translateY,
    savedTranslateY,
    dimensions,
    focusProvince,
    selectedProvince,
    setSelectedProvince,
    bottomSheetHeight,
}: UseMapAnimationProps) => {

    React.useEffect(() => {
        if (focusProvince && dimensions.width > 0 && dimensions.height > 0) {
            const province = PROVINCE_PATHS.find((p) => p.id === focusProvince);
            if (province) {
                const bounds = getPathBounds(province.d);
                const sBase = Math.min(
                    dimensions.width / VIEW_BOX_WIDTH,
                    dimensions.height / VIEW_BOX_HEIGHT
                );

                const viewCenterX = dimensions.width / 2;
                const viewCenterY = dimensions.height / 2;

                const scaledSvgWidth = VIEW_BOX_WIDTH * sBase;
                const scaledSvgHeight = VIEW_BOX_HEIGHT * sBase;
                const offsetX = (dimensions.width - scaledSvgWidth) / 2;
                const offsetY = (dimensions.height - scaledSvgHeight) / 2;

                const targetCenterX = bounds.centerX * sBase + offsetX;
                const targetCenterY = bounds.centerY * sBase + offsetY;

                const targetScaleX = (dimensions.width * 0.3) / (bounds.width * sBase);
                const targetScaleY = (dimensions.height * 0.3) / (bounds.height * sBase);
                const nextScale = Math.min(Math.max(Math.min(targetScaleX, targetScaleY), 1), 3);

                // Calculate Loose Bounds
                const maxTranslateX = (dimensions.width * (1 + nextScale)) / 2 - MAP_SAFETY_MARGIN;
                const maxTranslateY = (dimensions.height * (1 + nextScale)) / 2 - MAP_SAFETY_MARGIN;

                const deltaX = targetCenterX - viewCenterX;
                const deltaY = targetCenterY - viewCenterY;

                let nextTranslateX = -deltaX * nextScale;
                let nextTranslateY = -deltaY * nextScale;

                // Clamp translation
                nextTranslateX = Math.min(Math.max(nextTranslateX, -maxTranslateX), maxTranslateX);
                nextTranslateY = Math.min(Math.max(nextTranslateY, -maxTranslateY), maxTranslateY);

                scale.value = withTiming(nextScale, { duration: 1000 });
                translateX.value = withTiming(nextTranslateX, { duration: 1000 });
                translateY.value = withTiming(nextTranslateY, { duration: 1000 });

                savedScale.value = nextScale;
                savedTranslateX.value = nextTranslateX;
                savedTranslateY.value = nextTranslateY;

                setSelectedProvince(focusProvince);
            }
        }
    }, [focusProvince, dimensions]);

    // Pan map when bottom sheet becomes visible to keep selected province visible
    React.useEffect(() => {
        if (bottomSheetHeight > 0 && selectedProvince && dimensions.width > 0 && dimensions.height > 0) {
            const province = PROVINCE_PATHS.find((p) => p.id === selectedProvince);
            if (province) {
                // Standard logic
                const bounds = getPathBounds(province.d);
                const sBase = Math.min(
                    dimensions.width / VIEW_BOX_WIDTH,
                    dimensions.height / VIEW_BOX_HEIGHT
                );

                const visibleHeight = dimensions.height - bottomSheetHeight;
                // const viewCenterX = dimensions.width / 2;
                const viewCenterY = visibleHeight / 1; // Panning to roughly the center of the visible area

                const scaledSvgWidth = VIEW_BOX_WIDTH * sBase;
                const scaledSvgHeight = VIEW_BOX_HEIGHT * sBase;
                const offsetX = (dimensions.width - scaledSvgWidth) / 2;
                const offsetY = (dimensions.height - scaledSvgHeight) / 2;

                const targetCenterX = bounds.centerX * sBase + offsetX;
                const targetCenterY = bounds.centerY * sBase + offsetY;

                const currentScale = scale.value;
                const deltaX = targetCenterX - (dimensions.width / 2); // Center X is always center of screen
                const deltaY = targetCenterY - viewCenterY;

                const zoomReductionFactor = 1 / (currentScale);
                let nextTranslateX = -deltaX * currentScale * zoomReductionFactor;
                let nextTranslateY = -deltaY * currentScale * zoomReductionFactor;

                // Clamp to loose bounds
                const maxTranslateX = (dimensions.width * (1 + currentScale)) / 2 - MAP_SAFETY_MARGIN;
                const maxTranslateY = (dimensions.height * (1 + currentScale)) / 2 - MAP_SAFETY_MARGIN;

                nextTranslateX = Math.min(Math.max(nextTranslateX, -maxTranslateX), maxTranslateX);
                nextTranslateY = Math.min(Math.max(nextTranslateY, -maxTranslateY), maxTranslateY);

                translateX.value = withTiming(nextTranslateX, { duration: 600 });
                translateY.value = withTiming(nextTranslateY, { duration: 600 });

                savedTranslateX.value = nextTranslateX;
                savedTranslateY.value = nextTranslateY;
            }
        }
    }, [bottomSheetHeight, selectedProvince, dimensions]);

    // Reset map when bottom sheet closes
    React.useEffect(() => {
        if (bottomSheetHeight === 0 && (scale.value !== 1 || translateX.value !== 0 || translateY.value !== 0)) {
            // Animate back to default state
            scale.value = withTiming(1, { duration: 600 });
            translateX.value = withTiming(0, { duration: 600 });
            translateY.value = withTiming(0, { duration: 600 });

            savedScale.value = 1;
            savedTranslateX.value = 0;
            savedTranslateY.value = 0;

            // Clear selected province
            setSelectedProvince(null);
        }
    }, [bottomSheetHeight]);

    const handleBackgroundPress = (event: any) => {
        if (dimensions.width === 0 || dimensions.height === 0) return;

        const { locationX, locationY } = event.nativeEvent;

        const sBase = Math.min(
            dimensions.width / VIEW_BOX_WIDTH,
            dimensions.height / VIEW_BOX_HEIGHT
        );

        const scaledSvgWidth = VIEW_BOX_WIDTH * sBase;
        const scaledSvgHeight = VIEW_BOX_HEIGHT * sBase;
        const offsetX = (dimensions.width - scaledSvgWidth) / 2;
        const offsetY = (dimensions.height - scaledSvgHeight) / 2;

        const targetCenterX = locationX * sBase + offsetX;
        const targetCenterY = locationY * sBase + offsetY;

        const currentScale = scale.value;
        const nextScale = currentScale < 2 ? 2 : 2;

        const viewCenterX = dimensions.width / 2;
        const viewCenterY = dimensions.height / 2;

        // Calculate Loop Bounds
        const maxTranslateX = (dimensions.width * (1 + nextScale)) / 2 - MAP_SAFETY_MARGIN;
        const maxTranslateY = (dimensions.height * (1 + nextScale)) / 2 - MAP_SAFETY_MARGIN;

        let nextTranslateX = (viewCenterX / nextScale) - targetCenterX;
        let nextTranslateY = (viewCenterY / nextScale) - targetCenterY;

        // Clamp
        nextTranslateX = Math.min(Math.max(nextTranslateX, -maxTranslateX), maxTranslateX);
        nextTranslateY = Math.min(Math.max(nextTranslateY, -maxTranslateY), maxTranslateY);

        scale.value = withTiming(nextScale, { duration: 500 });
        translateX.value = withTiming(nextTranslateX, { duration: 500 });
        translateY.value = withTiming(nextTranslateY, { duration: 500 });

        savedScale.value = nextScale;
        savedTranslateX.value = nextTranslateX;
        savedTranslateY.value = nextTranslateY;
    };

    return { handleBackgroundPress };
};
