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

type Point = { x: number; y: number };

// Helper to calculate polygon area (signed)
const getPolygonArea = (points: Point[]): number => {
    let area = 0;
    for (let i = 0; i < points.length; i++) {
        let j = (i + 1) % points.length;
        area += points[i].x * points[j].y;
        area -= points[j].x * points[i].y;
    }
    return area / 2;
};

// Helper to calculate polygon centroid
const getPolygonCentroid = (points: Point[]): Point => {
    let area = getPolygonArea(points);
    // Use absolute area for centroid weighting references, but standard formula uses signed area
    // If area is 0, return first point
    if (area === 0) return points[0];

    let cx = 0;
    let cy = 0;
    for (let i = 0; i < points.length; i++) {
        let j = (i + 1) % points.length;
        let factor = (points[i].x * points[j].y - points[j].x * points[i].y);
        cx += (points[i].x + points[j].x) * factor;
        cy += (points[i].y + points[j].y) * factor;
    }
    area *= 6;
    return { x: cx / area, y: cy / area };
};

export const getCentroidFromPath = (d: string): { x: number, y: number } | null => {
    // 1. Parse path into separate polygons (handling 'M' as new subpath)
    const contours: Point[][] = [];
    let currentPoly: Point[] = [];

    // Normalize path: add spaces around commands, split by spaces
    const tokens = d.replace(/([a-zA-Z])/g, ' $1 ').trim().split(/[\s,]+/);

    let x = 0;
    let y = 0;

    let i = 0;
    while (i < tokens.length) {
        const command = tokens[i];

        if (command === 'M' || command === 'L') {
            // Move or Line to coords
            x = parseFloat(tokens[i + 1]);
            y = parseFloat(tokens[i + 2]);
            if (!isNaN(x) && !isNaN(y)) {
                if (command === 'M') {
                    if (currentPoly.length > 0) contours.push(currentPoly);
                    currentPoly = [];
                }
                currentPoly.push({ x, y });
            }
            i += 3;
        } else if (command === 'H') {
            // Horizontal Line
            x = parseFloat(tokens[i + 1]);
            if (!isNaN(x)) currentPoly.push({ x, y });
            i += 2;
        } else if (command === 'V') {
            // Vertical Line
            y = parseFloat(tokens[i + 1]);
            if (!isNaN(y)) currentPoly.push({ x, y });
            i += 2;
        } else if (command === 'Z') {
            // Close Path
            // Ideally close it by pushing start point, but centroid algo handles open arrays if we wrap indices correctly
            // We'll push start point if distinct to be sure
            if (currentPoly.length > 0) {
                const start = currentPoly[0];
                const end = currentPoly[currentPoly.length - 1];
                if (start.x !== end.x || start.y !== end.y) {
                    currentPoly.push({ ...start });
                }
            }
            i += 1;
        } else {
            // Unexpected or relative command (not handled well by this simple parser, assuming absolute)
            // Try to skip or just increment
            i++;
        }
    }
    if (currentPoly.length > 0) contours.push(currentPoly);

    if (contours.length === 0) return null;

    // 2. Find Largest Polygon by Area
    let maxArea = 0;
    let bestCentroid: Point | null = null;

    contours.forEach(poly => {
        if (poly.length < 3) return;
        const area = Math.abs(getPolygonArea(poly));
        if (area > maxArea) {
            maxArea = area;
            bestCentroid = getPolygonCentroid(poly);
        }
    });

    return bestCentroid;
};
