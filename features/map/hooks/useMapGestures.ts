import { Gesture } from "react-native-gesture-handler";
import { SharedValue, runOnJS } from "react-native-reanimated";
import { clamp, getBounds } from "../utils/mapUtils";

interface UseMapGesturesProps {
    scale: SharedValue<number>;
    savedScale: SharedValue<number>;
    translateX: SharedValue<number>;
    savedTranslateX: SharedValue<number>;
    translateY: SharedValue<number>;
    savedTranslateY: SharedValue<number>;
    viewWidth: SharedValue<number>;
    viewHeight: SharedValue<number>;
    onInteractionStart?: () => void;
    onInteractionEnd?: () => void;
}

export const useMapGestures = ({
    scale,
    savedScale,
    translateX,
    savedTranslateX,
    translateY,
    savedTranslateY,
    viewWidth,
    viewHeight,
    onInteractionStart,
    onInteractionEnd,
}: UseMapGesturesProps) => {

    // Pan Gesture
    const panGesture = Gesture.Pan()
        .onStart(() => {
            if (onInteractionStart) {
                runOnJS(onInteractionStart)();
            }
        })
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
            if (onInteractionEnd) {
                runOnJS(onInteractionEnd)();
            }
        });

    // Pinch Gesture
    const pinchGesture = Gesture.Pinch()
        .onStart(() => {
            if (onInteractionStart) {
                runOnJS(onInteractionStart)();
            }
        })
        .onUpdate((e) => {
            // Minimum zoom is 1, maximum zoom is 3
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
            if (onInteractionEnd) {
                runOnJS(onInteractionEnd)();
            }
        });

    const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

    return composedGesture;
};
