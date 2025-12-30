import React, { useState } from "react";
import Svg, { Path, G, Rect } from "react-native-svg";
import { StyleSheet, View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS
} from "react-native-reanimated";

import { PROVINCE_PATHS, ProvincePath } from "@/constants/ProvincePathList";
import { getPathBounds } from "@/utils/svgUtils";

interface InteractivePHMapProps {
    onMapPress?: (provinceId: string) => void;
    width?: number | string;
    height?: number | string;
    color?: string; // Default color
    provinceColors?: { [key: string]: string };
    focusProvince?: string | null;
    bottomSheetHeight?: number; // Height of bottom sheet to account for when panning
}

const VIEW_BOX_WIDTH = 351;
const VIEW_BOX_HEIGHT = 603;
const MAP_SAFETY_MARGIN = 200; // Pixels of map that must remain visible (safety margin)

const InteractivePHMap: React.FC<InteractivePHMapProps> = ({
    onMapPress,
    width = "100%",
    height = "100%",
    color = "#D7DFEA", // Map bg color
    provinceColors = {},
    focusProvince,
    bottomSheetHeight = 0,
}) => {
    // Zoom and Pan State
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    // View Dimensions for Gesture Constraints
    const viewWidth = useSharedValue(0);
    const viewHeight = useSharedValue(0);

    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const clamp = (val: number, min: number, max: number) => {
        "worklet";
        return Math.min(Math.max(val, min), max);
    };

    // Bounds Calculation Helper
    const getBounds = (vWidth: number, vHeight: number, s: number) => {
        "worklet";
        const boundX = (vWidth * (1 + s)) / 2 - MAP_SAFETY_MARGIN;
        const boundY = (vHeight * (1 + s)) / 2 - MAP_SAFETY_MARGIN;
        return { boundX, boundY };
    };

    // Gestures
    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            const { boundX, boundY } = getBounds(viewWidth.value, viewHeight.value, scale.value);

            translateX.value = clamp(
                savedTranslateX.value + e.translationX,
                -boundX,
                boundX
            );
            translateY.value = clamp(
                savedTranslateY.value + e.translationY,
                -boundY,
                boundY
            );
        })
        .onEnd(() => {
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
        });

    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            //minimum zoom is 1, maximum zoom is 3
            const newScale = Math.min(Math.max(savedScale.value * e.scale, 1), 3);
            scale.value = newScale;

            // Calculate effective scale ratio relative to the start of the gesture
            const scaleRatio = newScale / savedScale.value;

            const { boundX, boundY } = getBounds(viewWidth.value, viewHeight.value, newScale);

            translateX.value = clamp(
                savedTranslateX.value * scaleRatio,
                -boundX,
                boundX
            );
            translateY.value = clamp(
                savedTranslateY.value * scaleRatio,
                -boundY,
                boundY
            );
        })
        .onEnd(() => {
            savedScale.value = scale.value;
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
        });

    const composed = Gesture.Simultaneous(panGesture, pinchGesture);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { scale: scale.value },
            ],
        };
    });

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
        console.log('useEffect triggered:', { bottomSheetHeight, selectedProvince, dimensions });
        if (bottomSheetHeight > 0 && selectedProvince && dimensions.width > 0 && dimensions.height > 0) {
            console.log('Bottom sheet visible, panning to province:', selectedProvince);
            const province = PROVINCE_PATHS.find((p) => p.id === selectedProvince);
            if (province) {
                // Standard logic
                const bounds = getPathBounds(province.d);
                const sBase = Math.min(
                    dimensions.width / VIEW_BOX_WIDTH,
                    dimensions.height / VIEW_BOX_HEIGHT
                );

                const visibleHeight = dimensions.height - bottomSheetHeight;
                const viewCenterX = dimensions.width / 2;
                const viewCenterY = visibleHeight / 1;

                const scaledSvgWidth = VIEW_BOX_WIDTH * sBase;
                const scaledSvgHeight = VIEW_BOX_HEIGHT * sBase;
                const offsetX = (dimensions.width - scaledSvgWidth) / 2;
                const offsetY = (dimensions.height - scaledSvgHeight) / 2;

                const targetCenterX = bounds.centerX * sBase + offsetX;
                const targetCenterY = bounds.centerY * sBase + offsetY;

                const currentScale = scale.value;
                const deltaX = targetCenterX - viewCenterX;
                const deltaY = targetCenterY - viewCenterY;

                const zoomReductionFactor = 1 / (currentScale);
                let nextTranslateX = -deltaX * currentScale * zoomReductionFactor;
                let nextTranslateY = -deltaY * currentScale * zoomReductionFactor;

                // Clamp to loose bounds
                const maxTranslateX = (dimensions.width * (1 + currentScale)) / 2 - MAP_SAFETY_MARGIN;
                const maxTranslateY = (dimensions.height * (1 + currentScale)) / 2 - MAP_SAFETY_MARGIN;

                nextTranslateX = Math.min(Math.max(nextTranslateX, -maxTranslateX), maxTranslateX);
                nextTranslateY = Math.min(Math.max(nextTranslateY, -maxTranslateY), maxTranslateY);

                console.log('Panning to:', { nextTranslateX, nextTranslateY });

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
            console.log('Bottom sheet closed, resetting map');
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

    // ... (Keep existing middle parts) ...

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

    const handlePress = (id: string) => {
        if (selectedProvince === id) {
            setSelectedProvince(null);
        } else {
            setSelectedProvince(id);
        }

        if (onMapPress) {
            onMapPress(id);
        } else {
            console.log(`Pressed: ${id}`);
        }
    };

    return (
        <GestureDetector gesture={composed}>
            <View
                className={styles.container}
                onLayout={(event) => {
                    const { width, height } = event.nativeEvent.layout;
                    setDimensions({ width, height });
                    viewWidth.value = width;
                    viewHeight.value = height;
                }}
            >
                <Animated.View
                    className={styles.container}
                    style={animatedStyle}
                >
                    <Svg
                        width={dimensions.width}
                        height={dimensions.height}
                        viewBox={`0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`}
                        fill="none"
                    >
                        <Rect
                            x="0"
                            y="0"
                            width={VIEW_BOX_WIDTH}
                            height={VIEW_BOX_HEIGHT}
                            fill="transparent"
                            onPress={handleBackgroundPress}
                        />
                        <G>
                            {PROVINCE_PATHS.map(({ id, d }: ProvincePath) => (
                                <Path
                                    key={id}
                                    id={id}
                                    d={d}
                                    fill={provinceColors[id] || color}
                                    onPress={() => handlePress(id)}
                                    stroke={selectedProvince === id ? "#EAB308" : "#fff"}
                                    strokeWidth={selectedProvince === id ? 1 : 0.26}
                                />
                            ))}
                        </G>
                    </Svg>
                </Animated.View>
            </View>
        </GestureDetector>
    );
};

const styles = {
    container: `flex-1 w-full h-full`,
};

export default InteractivePHMap;

