export const VIEW_BOX_WIDTH = 351;
export const VIEW_BOX_HEIGHT = 603;
export const MAP_SAFETY_MARGIN = 200;

export const clamp = (val: number, min: number, max: number) => {
    "worklet";
    return Math.min(Math.max(val, min), max);
};

export const getBounds = (vWidth: number, vHeight: number, s: number) => {
    "worklet";
    const boundX = (vWidth * (1 + s)) / 2 - MAP_SAFETY_MARGIN;
    const boundY = (vHeight * (1 + s)) / 2 - MAP_SAFETY_MARGIN;
    return { boundX, boundY };
};
