import React, { useState, useMemo } from "react";
import { Svg, G, Rect, Defs, ClipPath, Circle, Image } from "react-native-svg";
import { View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedProps,
    withSpring,
} from "react-native-reanimated";

import { PROVINCE_PATHS, ProvincePath as ProvincePathType } from "@/constants/ProvincePathList";
import { useMapGestures } from "@/features/map/hooks/useMapGestures";
import { useMapAnimation } from "@/features/map/hooks/useMapAnimation";
import { VIEW_BOX_WIDTH, VIEW_BOX_HEIGHT, getCentroidFromPath } from "@/features/map/utils/mapUtils";
import ProvincePath from "./ProvincePath";

// Animated Components
const AnimatedG = Animated.createAnimatedComponent(G);

interface ThumbnailMarkerProps {
    x: number;
    y: number;
    size: number;
    imageUri: string;
    clipPathId: string;
    onPress: () => void;
}

// eslint-disable-next-line react/display-name
const ThumbnailMarker: React.FC<ThumbnailMarkerProps> = React.memo(({ x, y, size, imageUri, clipPathId, onPress }) => {
    const progress = useSharedValue(0);

    React.useEffect(() => {
        progress.value = withSpring(1, { damping: 20, stiffness: 300 });
    }, []);

    const animatedProps = useAnimatedProps(() => {
        const scale = progress.value;
        const translateY = (1 - progress.value) * 10; // Slide up from 10 units below

        return {
            transform: [
                { translateX: x + size / 2 }, // Pivot adjustment for scale
                { translateY: y + size / 2 + translateY },
                { scale: scale },
                { translateX: -(x + size / 2) }, // Pivot adjustment
                { translateY: -(y + size / 2) },
            ]
        };
    });

    const halfSize = size / 2;

    return (
        <AnimatedG animatedProps={animatedProps}>
            <Image
                x={x}
                y={y}
                width={size}
                height={size}
                href={{ uri: imageUri }}
                clipPath={`url(#${clipPathId})`}
                preserveAspectRatio="xMidYMid slice"
                onPress={onPress}
            />
            <Circle
                cx={x + halfSize}
                cy={y + halfSize}
                r={halfSize}
                stroke="white"
                strokeWidth="1"
                fill="none"
                onPress={onPress}
            />
        </AnimatedG>
    );
});

interface InteractivePHMapProps {
    onMapPress?: (provinceId: string) => void;
    width?: number | string;
    height?: number | string;
    color?: string; // Default color
    provinceColors?: { [key: string]: string };
    focusProvince?: string | null;
    bottomSheetHeight?: number; // Height of bottom sheet to account for when panning
    visitedImages?: Record<string, string>;
}

const InteractivePHMap: React.FC<InteractivePHMapProps> = ({
    onMapPress,
    color = "#D7DFEA", // Map bg color
    provinceColors = {},
    focusProvince,
    bottomSheetHeight = 0,
    visitedImages = {}
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

    const [areThumbnailsVisible, setAreThumbnailsVisible] = useState(true);
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleInteractionStart = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setAreThumbnailsVisible(false);
    };

    const handleInteractionEnd = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            setAreThumbnailsVisible(true);
        }, 1000);
    };

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
        onInteractionStart: handleInteractionStart,
        onInteractionEnd: handleInteractionEnd,
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
        // Also hide thumbnails on press
        handleInteractionStart();
        handleInteractionEnd();

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

    // Calculate centroids for provinces that have visited images
    const provinceDataWithCentroids = useMemo(() => {
        return PROVINCE_PATHS.map((province) => {
            if (visitedImages[province.id]) {
                const centroid = getCentroidFromPath(province.d);
                return { ...province, centroid };
            }
            return province;
        });
    }, [visitedImages]);

    const THUMBNAIL_SIZE = 28;
    const HALF_SIZE = THUMBNAIL_SIZE / 2;

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
                        <Defs>
                            {areThumbnailsVisible && provinceDataWithCentroids.map((province) => {
                                const centroid = (province as any).centroid;
                                if (!centroid) return null;
                                return (
                                    <ClipPath key={`clip-${province.id}-${THUMBNAIL_SIZE}`} id={`clip-${province.id}-${THUMBNAIL_SIZE}`}>
                                        <Circle cx={centroid.x} cy={centroid.y} r={HALF_SIZE} />
                                    </ClipPath>
                                );
                            })}
                        </Defs>

                        <Rect
                            x="0"
                            y="0"
                            width={VIEW_BOX_WIDTH}
                            height={VIEW_BOX_HEIGHT}
                            fill="transparent"
                            onPress={handleBackgroundPress}
                        />
                        <G>
                            {/* Render Province Paths */}
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

                            {/* Render Thumbnails */}
                            {areThumbnailsVisible && provinceDataWithCentroids.map((province) => {
                                const centroid = (province as any).centroid;
                                const imageUri = visitedImages[province.id];
                                if (!centroid || !imageUri) return null;

                                return (
                                    <ThumbnailMarker
                                        key={`thumb-${province.id}`}
                                        x={centroid.x - HALF_SIZE}
                                        y={centroid.y - HALF_SIZE}
                                        size={THUMBNAIL_SIZE}
                                        imageUri={imageUri}
                                        clipPathId={`clip-${province.id}-${THUMBNAIL_SIZE}`}
                                        onPress={() => handlePress(province.id)}
                                    />
                                );
                            })}
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
