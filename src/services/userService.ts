import type { SQLiteDatabase } from 'expo-sqlite';
import { LocalUser, LOCAL_USER_ID } from '@/types';

export function getLocalUser(db: SQLiteDatabase) {
  return db.getFirstAsync<LocalUser>('SELECT * FROM users WHERE id = ?', LOCAL_USER_ID);
}

export async function updateLocalUser(db: SQLiteDatabase, data: Pick<LocalUser, 'name' | 'course' | 'email'>) {
  await db.runAsync('UPDATE users SET name = ?, course = ?, email = ? WHERE id = ?', data.name, data.course, data.email, LOCAL_USER_ID);
}

export async function getProfileStats(db: SQLiteDatabase) {
  const row = await db.getFirstAsync<{ total: number; recovered: number }>(
    'SELECT COUNT(*) AS total, COALESCE(SUM(isResolved), 0) AS recovered FROM items WHERE ownerId = ?',
    LOCAL_USER_ID,
  );
  return { total: row?.total ?? 0, recovered: row?.recovered ?? 0 };
}
