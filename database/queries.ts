import { getDb } from './connection';

const db = getDb();

export interface ProvinceStatus {
    id: string;
    visited: boolean;
    wishlisted: boolean;
}

export const getProvinceStatuses = (): ProvinceStatus[] => {
    // Return all provinces that have some status
    return db.getAllSync<ProvinceStatus>(
        'SELECT id, visited, wishlisted FROM provinces WHERE visited = 1 OR wishlisted = 1'
    );
};

export const setVisitedStatus = (id: string, isVisited: boolean) => {
    db.runSync(
        'UPDATE provinces SET visited = ? WHERE id = ?',
        [isVisited ? 1 : 0, id]
    );
};

export const setWishlistStatus = (id: string, isWishlisted: boolean) => {
    db.runSync(
        'UPDATE provinces SET wishlisted = ? WHERE id = ?',
        [isWishlisted ? 1 : 0, id]
    );
};

export const resetProvinces = () => {
    db.runSync('UPDATE provinces SET visited = 0, wishlisted = 0');
    // Optional: Clear diaries if "clean state" implies removing all user data
    db.runSync('DELETE FROM diaries');
    db.runSync('DELETE FROM diary_tags');
    db.runSync('DELETE FROM diary_images');
};

export interface SaveDiaryEntryParams {
    provinceId: string;
    startDate: string;
    endDate: string;
    notes?: string;
    tags: string[];
    images: string[];
}

export const saveDiaryEntry = (params: SaveDiaryEntryParams): void => {
    const { provinceId, startDate, endDate, notes, tags, images } = params;

    db.withTransactionSync(() => {
        // Insert diary entry
        const result = db.runSync(
            'INSERT INTO diaries (province_id, start_date, end_date, notes) VALUES (?, ?, ?, ?)',
            [provinceId, startDate, endDate, notes || '']
        );

        const diaryId = result.lastInsertRowId;

        // Insert tags
        tags.forEach(tag => {
            db.runSync(
                'INSERT INTO diary_tags (diary_id, tag_text) VALUES (?, ?)',
                [diaryId, tag]
            );
        });

        // Insert images
        images.forEach((imageUri, index) => {
            db.runSync(
                'INSERT INTO diary_images (diary_id, image_uri, display_order) VALUES (?, ?, ?)',
                [diaryId, imageUri, index]
            );
        });

        // Mark province as visited and remove from wishlist
        db.runSync(
            'UPDATE provinces SET visited = 1, wishlisted = 0 WHERE id = ?',
            [provinceId]
        );
    });
};

export interface ProvinceDetails {
    id: string;
    title: string;
    subtext: string | null;
    visited: boolean;
    wishlisted: boolean;
    loveTags: string[];
    travelerTags: string[];
    images: string[]; // paths or asset IDs
}

export const getProvinceDetails = (id: string): ProvinceDetails | null => {
    const province = db.getFirstSync<{ id: string, title: string, subtext: string, visited: number, wishlisted: number }>(
        'SELECT * FROM provinces WHERE id = ?',
        [id]
    );

    if (!province) return null;

    const tags = db.getAllSync<{ type: string, tag_text: string }>(
        'SELECT type, tag_text FROM province_tags WHERE province_id = ?',
        [id]
    );

    const images = db.getAllSync<{ image_path: string }>(
        'SELECT image_path FROM province_images WHERE province_id = ? ORDER BY display_order ASC',
        [id]
    );

    return {
        id: province.id,
        title: province.title,
        subtext: province.subtext,
        visited: province.visited === 1,
        wishlisted: province.wishlisted === 1,
        loveTags: tags.filter(t => t.type === 'LOVE').map(t => t.tag_text),
        travelerTags: tags.filter(t => t.type === 'DESTINATION').map(t => t.tag_text),
        images: images.map(i => i.image_path)
    };
};

export interface DiaryDetails {
    id: number;
    notes: string;
    startDate: string;
    endDate: string;
    tags: string[];
    images: string[];
}

export const getDiaryDetails = (provinceId: string): DiaryDetails | null => {
    try {
        const diary = db.getFirstSync<{ id: number, notes: string | null, start_date: string, end_date: string }>(
            'SELECT id, notes, start_date, end_date FROM diaries WHERE province_id = ? ORDER BY start_date DESC LIMIT 1',
            [provinceId]
        );

        if (!diary) return null;

        const tags = db.getAllSync<{ tag_text: string }>(
            'SELECT tag_text FROM diary_tags WHERE diary_id = ?',
            [diary.id]
        );

        const images = db.getAllSync<{ image_uri: string }>(
            'SELECT image_uri FROM diary_images WHERE diary_id = ? ORDER BY display_order ASC',
            [diary.id]
        );

        return {
            id: diary.id,
            notes: diary.notes || "",
            startDate: diary.start_date,
            endDate: diary.end_date,
            tags: tags.map(t => t.tag_text),
            images: images.map(i => i.image_uri || "")
        };
    } catch (error) {
        console.error("Error fetching diary details:", error);
        return null;
    }
};

export const getNextVisitedProvince = (currentId: string): { id: string, title: string, visitedDate: string } | null => {
    try {
        // Get all visited provinces ordered by visit date
        const visited = db.getAllSync<{ province_id: string, start_date: string }>(
            'SELECT province_id, start_date FROM diaries ORDER BY start_date DESC'
        );

        if (visited.length === 0) return null;

        const currentIndex = visited.findIndex(v => v.province_id === currentId);

        // If current is not found or is the last one (oldest), wrap around to first (newest)
        // Or strictly next ? "Next memory" usually implies traversing backward in time or forward? 
        // Let's go to the next one in the list (older memory) or wrap to top.
        // If index is -1 (not found), default to 0.

        let nextIndex = currentIndex + 1;
        if (nextIndex >= visited.length) {
            nextIndex = 0; // Wrap to start
        }

        // If there's only one visited province and it's the current one, return null or handle appropriately?
        // If visited.length === 1 and currentIndex === 0 -> nextIndex = 0 -> returns same. 
        // Maybe return null if only 1 item to hide button?
        if (visited.length <= 1) return null;

        const nextProvinceId = visited[nextIndex].province_id;

        // Get details for the next province
        const province = getProvinceDetails(nextProvinceId);
        if (!province) return null;

        return {
            id: province.id,
            title: province.title,
            visitedDate: visited[nextIndex].start_date
        };

    } catch (error) {
        console.error("Error fetching next visited province:", error);
        return null;
    }
}
