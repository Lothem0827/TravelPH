import React, { useState } from "react";
import Svg, { Path, G } from "react-native-svg";
import { StyleSheet } from "react-native";
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
}

const VIEW_BOX_WIDTH = 351;
const VIEW_BOX_HEIGHT = 603;

const InteractivePHMap: React.FC<InteractivePHMapProps> = ({
    onMapPress,
    width = "100%",
    height = "100%",
    color = "#E2E8F0", // zinc-300 default
    provinceColors = {},
    focusProvince,
}) => {
    // Zoom and Pan State
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Gestures
    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            translateX.value = savedTranslateX.value + e.translationX;
            translateY.value = savedTranslateY.value + e.translationY;
        })
        .onEnd(() => {
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
        });

    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            //minimum zoom is 1, maximum zoom is 2
            const newScale = Math.min(Math.max(savedScale.value * e.scale, 1), 2);
            scale.value = newScale;

            // Calculate effective scale ratio relative to the start of the gesture
            // to adjust translation proportionally
            const scaleRatio = newScale / savedScale.value;

            translateX.value = savedTranslateX.value * scaleRatio;
            translateY.value = savedTranslateY.value * scaleRatio;
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

                // Visual center of the province at scale 1
                // We need to account for how SVG is positioned (centered by default in 'meet')
                // Offset calculation for "meet" aspect ratio
                const scaledSvgWidth = VIEW_BOX_WIDTH * sBase;
                const scaledSvgHeight = VIEW_BOX_HEIGHT * sBase;
                const offsetX = (dimensions.width - scaledSvgWidth) / 2;
                const offsetY = (dimensions.height - scaledSvgHeight) / 2;

                const targetCenterX = bounds.centerX * sBase + offsetX;
                const targetCenterY = bounds.centerY * sBase + offsetY;

                // Calculate zoom needed
                // We want province width/height to cover say 30% of screen
                const targetScaleX = (dimensions.width * 0.3) / (bounds.width * sBase);
                const targetScaleY = (dimensions.height * 0.3) / (bounds.height * sBase);
                // Limit max zoom to reasonable
                const nextScale = Math.min(Math.max(Math.min(targetScaleX, targetScaleY), 1), 2);

                // Calculate Translate to bring target center to view center
                // distance from center * scale, inverted
                const deltaX = targetCenterX - viewCenterX;
                const deltaY = targetCenterY - viewCenterY;

                const nextTranslateX = -deltaX * nextScale;
                const nextTranslateY = -deltaY * nextScale;

                scale.value = withTiming(nextScale, { duration: 1000 });
                translateX.value = withTiming(nextTranslateX, { duration: 1000 });
                translateY.value = withTiming(nextTranslateY, { duration: 1000 });

                savedScale.value = nextScale;
                savedTranslateX.value = nextTranslateX;
                savedTranslateY.value = nextTranslateY;

                // Also select it
                setSelectedProvince(focusProvince);
            }
        }
    }, [focusProvince, dimensions]);

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
            <Animated.View
                className={styles.container}
                style={animatedStyle}
                onLayout={(event) => {
                    const { width, height } = event.nativeEvent.layout;
                    setDimensions({ width, height });
                }}
            >
                <Svg
                    width={width}
                    height={height}
                    viewBox={`0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`}
                    fill="none"
                >
                    <G>
                        {PROVINCE_PATHS.map(({ id, d }: ProvincePath) => (
                            <Path
                                key={id}
                                id={id}
                                d={d}
                                fill={provinceColors[id] || color}
                                onPress={() => handlePress(id)}
                                stroke={selectedProvince === id ? "#CA8A04" : "#CBD5E1"}
                                strokeWidth={selectedProvince === id ? 1 : 0.26}
                            />
                        ))}
                    </G>
                </Svg>
            </Animated.View>
        </GestureDetector>
    );
};

const styles = {
    container: `flex-1 w-full h-full`,
};

export default InteractivePHMap;

