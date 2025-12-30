import * as SQLite from 'expo-sqlite';
import { PROVINCES } from '@/constants/ProvinceNames';
import { PROVINCE_CONTENT } from '@/constants/ProvinceData';
import { resetProvinces } from './queries';
import { getDb } from './connection';

const db = getDb();

export const initDatabase = () => {
    try {
        db.withTransactionSync(() => {
            // 1. Provinces
            db.execSync(`
                CREATE TABLE IF NOT EXISTS provinces (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    subtext TEXT,
                    visited INTEGER DEFAULT 0,
                    wishlisted INTEGER DEFAULT 0
                );
            `);

            // 2. Province Tags (Love & Destination)
            db.execSync(`
                CREATE TABLE IF NOT EXISTS province_tags (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    province_id TEXT NOT NULL,
                    type TEXT NOT NULL, 
                    tag_text TEXT NOT NULL,
                    FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE
                );
            `);

            // 3. Province Images
            db.execSync(`
                CREATE TABLE IF NOT EXISTS province_images (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    province_id TEXT NOT NULL,
                    image_path TEXT NOT NULL,
                    display_order INTEGER DEFAULT 0,
                    FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE
                );
            `);

            // 4. Diaries
            db.execSync(`
                CREATE TABLE IF NOT EXISTS diaries (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    province_id TEXT NOT NULL,
                    start_date TEXT NOT NULL,
                    end_date TEXT NOT NULL,
                    notes TEXT,
                    FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE
                );
            `);

            // 5. Diary Tags
            db.execSync(`
                CREATE TABLE IF NOT EXISTS diary_tags (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    diary_id INTEGER NOT NULL,
                    tag_text TEXT NOT NULL,
                    FOREIGN KEY (diary_id) REFERENCES diaries(id) ON DELETE CASCADE
                );
            `);

            // 6. Diary Images
            db.execSync(`
                CREATE TABLE IF NOT EXISTS diary_images (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    diary_id INTEGER NOT NULL,
                    image_uri TEXT NOT NULL,
                    display_order INTEGER DEFAULT 0,
                    FOREIGN KEY (diary_id) REFERENCES diaries(id) ON DELETE CASCADE
                );
            `);
        });

        // Seed Provinces (Idempotent)
        seedProvinces();

        console.log("Database initialized successfully.");
    } catch (error) {
        console.error("Database initialization failed:", error);
    }
};





const seedProvinces = () => {
    console.log("Checking for database updates...");
    db.withTransactionSync(() => {
        // 1. Seed base province data (Idempotent)
        PROVINCES.forEach(p => {
            // Find matching content for subtext
            const content = PROVINCE_CONTENT.find(c => c.id === p.id);
            const subtext = content?.subtext || null;

            db.runSync(
                'INSERT OR IGNORE INTO provinces (id, title, subtext) VALUES (?, ?, ?)',
                [p.id, p.val, subtext]
            );

            // Update subtext for existing provinces (in case they were added before subtext was implemented)
            db.runSync(
                'UPDATE provinces SET subtext = ? WHERE id = ? AND subtext IS NULL',
                [subtext, p.id]
            );
        });

        // 2. Seed Content (Tags & Images)
        PROVINCE_CONTENT.forEach(content => {
            // Check if tags exist for this province
            const tagCount = db.getFirstSync<{ count: number }>(
                'SELECT COUNT(*) as count FROM province_tags WHERE province_id = ?',
                [content.id]
            );

            if (tagCount && tagCount.count === 0) {
                console.log(`Seeding tags for ${content.id}...`);
                // Why Love Tags
                content.whyLove.forEach(tag => {
                    db.runSync(
                        'INSERT INTO province_tags (province_id, type, tag_text) VALUES (?, ?, ?)',
                        [content.id, 'LOVE', tag]
                    );
                });

                // Destination/City Tags
                content.travelersGo.forEach(tag => {
                    db.runSync(
                        'INSERT INTO province_tags (province_id, type, tag_text) VALUES (?, ?, ?)',
                        [content.id, 'DESTINATION', tag]
                    );
                });
            }

            // Check if images exist for this province
            const imgCount = db.getFirstSync<{ count: number }>(
                'SELECT COUNT(*) as count FROM province_images WHERE province_id = ?',
                [content.id]
            );

            if (imgCount && imgCount.count === 0 && content.images.length > 0) {
                console.log(`Seeding images for ${content.id}...`);
                content.images.forEach((img, index) => {
                    // Normalize image source to string for storage
                    // If it's a require() (number) or uri object, we need to handle it.
                    // Actually, the previous code just stored 'img'.
                    // Since the arrays in ProvinceData contain require() results (numbers), we cast to string.
                    const imgPath = typeof img === 'string' ? img : String(img);

                    db.runSync(
                        'INSERT INTO province_images (province_id, image_path, display_order) VALUES (?, ?, ?)',
                        [content.id, imgPath, index]
                    );
                });
            }
        });
    });
    console.log("Database update check complete.");
};

export const resetAndSeed = () => {
    console.log('🔄 Resetting database...');
    // Drop all tables (order matters due to foreign keys)
    db.execSync(`DROP TABLE IF EXISTS diary_images;
               DROP TABLE IF EXISTS diary_tags;
               DROP TABLE IF EXISTS diaries;
               DROP TABLE IF EXISTS province_images;
               DROP TABLE IF EXISTS province_tags;
               DROP TABLE IF EXISTS provinces;`);
    // Re‑run the full initialization (creates tables & seeds data)
    initDatabase();
};
