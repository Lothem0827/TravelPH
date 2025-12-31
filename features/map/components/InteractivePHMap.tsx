import React, { useState } from "react";
import Svg, { G, Rect } from "react-native-svg";
import { View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

import { PROVINCE_PATHS, ProvincePath as ProvincePathType } from "@/constants/ProvincePathList";
import { useMapGestures } from "@/features/map/hooks/useMapGestures";
import { useMapAnimation } from "@/features/map/hooks/useMapAnimation";
import { VIEW_BOX_WIDTH, VIEW_BOX_HEIGHT } from "@/features/map/utils/mapUtils";
import ProvincePath from "./ProvincePath";

interface InteractivePHMapProps {
    onMapPress?: (provinceId: string) => void;
    width?: number | string;
    height?: number | string;
    color?: string; // Default color
    provinceColors?: { [key: string]: string };
    focusProvince?: string | null;
    bottomSheetHeight?: number; // Height of bottom sheet to account for when panning
}

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

    // Custom Hooks
    const composed = useMapGestures({
        scale,
        savedScale,
        translateX,
        savedTranslateX,
        translateY,
        savedTranslateY,
        viewWidth,
        viewHeight,
    });

    const { handleBackgroundPress } = useMapAnimation({
        scale,
        savedScale,
        translateX,
        savedTranslateX,
        translateY,
        savedTranslateY,
        dimensions,
        focusProvince: focusProvince || null, // Ensure null if undefined
        selectedProvince,
        setSelectedProvince,
        bottomSheetHeight,
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { scale: scale.value },
            ],
        };
    });

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
                            {PROVINCE_PATHS.map(({ id, d }: ProvincePathType) => (
                                <ProvincePath
                                    key={id}
                                    id={id}
                                    d={d}
                                    fill={provinceColors[id] || color}
                                    onPress={handlePress}
                                    isSelected={selectedProvince === id}
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
