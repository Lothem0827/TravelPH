import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    runOnJS
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ZoomableImageProps {
    source: any;
    onTap: () => void;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({ source, onTap }) => {
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);

    // Pan translations
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    // Focal point translations
    const pinchTranslateX = useSharedValue(0);
    const pinchTranslateY = useSharedValue(0);
    const originX = useSharedValue(0);
    const originY = useSharedValue(0);

    const center = useSharedValue({ x: SCREEN_WIDTH / 2, y: 0 });

    const pinch = Gesture.Pinch()
        .onStart((event) => {
            originX.value = event.focalX - center.value.x;
            originY.value = event.focalY - center.value.y;
        })
        .onUpdate((event) => {
            scale.value = Math.max(0.7, savedScale.value * event.scale);
            // Calculate focal point offset adjustment
            // We want the point under origin relative to image to stay under the finger
            pinchTranslateX.value = originX.value * (1 - event.scale);
            pinchTranslateY.value = originY.value * (1 - event.scale);
        })
        .onEnd(() => {
            if (scale.value < 1) {
                scale.value = withTiming(1);
                savedScale.value = 1;
                translateX.value = withTiming(0);
                translateY.value = withTiming(0);
                savedTranslateX.value = 0;
                savedTranslateY.value = 0;
                pinchTranslateX.value = withTiming(0);
                pinchTranslateY.value = withTiming(0);
            } else {
                savedScale.value = scale.value;
                // Commit the pinch translation to the total translation
                savedTranslateX.value += pinchTranslateX.value;
                savedTranslateY.value += pinchTranslateY.value;
                translateX.value = savedTranslateX.value; // Sync current tx
                translateY.value = savedTranslateY.value;
                pinchTranslateX.value = 0;
                pinchTranslateY.value = 0;
            }
        });

    const pan = Gesture.Pan()
        .averageTouches(true)
        .manualActivation(true)
        .onTouchesMove((event, state) => {
            // Activate pan only if zoomed in significantly
            if (scale.value > 1.05) {
                state.activate();
            } else {
                state.fail();
            }
        })
        .onUpdate((event) => {
            if (scale.value > 1) {
                const width = SCREEN_WIDTH;
                const height = center.value.y * 2 || SCREEN_WIDTH;

                const limitX = Math.max(0, (width * (scale.value - 1)) / 2);
                const limitY = Math.max(0, (height * (scale.value - 1)) / 2);

                const potentialX = savedTranslateX.value + event.translationX + pinchTranslateX.value;
                const potentialY = savedTranslateY.value + event.translationY + pinchTranslateY.value;

                const clampedX = Math.min(Math.max(potentialX, -limitX), limitX);
                const clampedY = Math.min(Math.max(potentialY, -limitY), limitY);

                translateX.value = clampedX - pinchTranslateX.value;
                translateY.value = clampedY - pinchTranslateY.value;
            }
        })
        .onEnd(() => {
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
        });

    const singleTap = Gesture.Tap()
        .numberOfTaps(1)
        .maxDistance(10)
        .onEnd(() => {
            runOnJS(onTap)();
        });

    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
            if (scale.value > 1) {
                scale.value = withTiming(1);
                savedScale.value = 1;
                translateX.value = withTiming(0);
                translateY.value = withTiming(0);
                savedTranslateX.value = 0;
                savedTranslateY.value = 0;
                pinchTranslateX.value = withTiming(0);
                pinchTranslateY.value = withTiming(0);
            } else {
                // Zoom to 2x at center? Or ideally focal?
                // For simplicity, double tap zooms to center 2x
                scale.value = withTiming(2);
                savedScale.value = 2;
            }
        });

    const composed = Gesture.Simultaneous(
        pinch,
        pan,
        Gesture.Exclusive(doubleTap, singleTap)
    );

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value + pinchTranslateX.value },
            { translateY: translateY.value + pinchTranslateY.value },
            { scale: scale.value },
        ],
    }));

    return (
        <GestureDetector gesture={composed}>
            <Animated.View
                style={[styles.container, { width: SCREEN_WIDTH }]}
                onLayout={(e) => {
                    center.value = {
                        x: e.nativeEvent.layout.width / 2,
                        y: e.nativeEvent.layout.height / 2
                    };
                }}
            >
                <Animated.Image
                    source={source}
                    style={[styles.image, animatedStyle]}
                    resizeMode="contain"
                />
            </Animated.View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default ZoomableImage;
