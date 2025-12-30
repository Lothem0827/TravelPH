import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('travel_diary.db');

export const getDb = () => db;
