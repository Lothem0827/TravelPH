export const getPathBounds = (d: string) => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let currentX = 0, currentY = 0;

    // Split by commands, keeping the delimiter
    // Commands: M, L, H, V, Z, m, l, h, v, z (and maybe others like C, S, Q, T, A but let's hope for simple paths first)
    // The provided paths seem to use M, L, V, H, Z.

    const commands = d.match(/([a-zA-Z])|([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)/g);

    if (!commands) return { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0, centerX: 0, centerY: 0 };

    let i = 0;
    while (i < commands.length) {
        const token = commands[i];

        if (/[a-zA-Z]/.test(token)) {
            const command = token;
            i++;

            switch (command) {
                case 'M': // Move absolute
                case 'L': // Line absolute
                    while (i < commands.length && !/[a-zA-Z]/.test(commands[i])) {
                        const x = parseFloat(commands[i++]);
                        const y = parseFloat(commands[i++]); // Assume pairs
                        currentX = x;
                        currentY = y;
                        minX = Math.min(minX, x);
                        maxX = Math.max(maxX, x);
                        minY = Math.min(minY, y);
                        maxY = Math.max(maxY, y);
                    }
                    break;
                case 'H': // Horizontal absolute
                    while (i < commands.length && !/[a-zA-Z]/.test(commands[i])) {
                        const x = parseFloat(commands[i++]);
                        currentX = x;
                        minX = Math.min(minX, x);
                        maxX = Math.max(maxX, x);
                    }
                    break;
                case 'V': // Vertical absolute
                    while (i < commands.length && !/[a-zA-Z]/.test(commands[i])) {
                        const y = parseFloat(commands[i++]);
                        currentY = y;
                        minY = Math.min(minY, y);
                        maxY = Math.max(maxY, y);
                    }
                    break;
                case 'Z': // Close path
                case 'z':
                    // Doesn't affect bounds really, just closes to start
                    break;
                // Add relative support if needed, but example showed absolute
                default:
                    // If we encounter C, S, Q, T, A - we might need more complex logic. 
                    // For now, logging capability or simple skip might be needed to avoid crash, 
                    // but assuming simple paths as seen in file.
                    // If complex curves used, bounds might be slightly off if we only check control points?
                    // Actually, usually we can just parse the points.
                    // For C (x1 y1 x2 y2 x y), the points are control points + end point.
                    // It's safe-ish to just include them in bounds for zoom purposes.
                    // They are usually "near" the curve.
                    // Let's assume generic handler for other commands that consume numbers?
                    // But we need to know how many numbers.
                    // C: 6, S: 4, Q: 4, T: 2, A: 7.
                    // For robustness, if we see unknown command, we might drift.
                    // But looking at ProvincePathList.ts, it seems to only use M, L, V, H, Z. 
                    // (Checked `PH-TAR`, `PH-ZMB`...)
                    break;
            }
        } else {
            // Should not happen if strictly valid path starting with M, 
            // but if we are in implied command (e.g. L after M), the switch handles it.
            i++;
        }
    }

    // Safety check if no points found
    if (minX === Infinity) {
        return { minX: 0, maxX: 100, minY: 0, maxY: 100, width: 100, height: 100, centerX: 50, centerY: 50 };
    }

    return {
        minX,
        minY,
        maxX,
        maxY,
        width: maxX - minX,
        height: maxY - minY,
        centerX: (minX + maxX) / 2,
        centerY: (minY + maxY) / 2
    };
};
