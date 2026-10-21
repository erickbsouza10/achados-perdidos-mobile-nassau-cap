import type { SQLiteDatabase } from 'expo-sqlite';
import { Item, ItemInput, LOCAL_USER_ID } from '@/types';

export async function listItems(db: SQLiteDatabase): Promise<Item[]> {
  return db.getAllAsync<Item>('SELECT * FROM items ORDER BY isResolved ASC, datetime(createdAt) DESC');
}

export async function listRecentItems(db: SQLiteDatabase, limit = 4): Promise<Item[]> {
  return db.getAllAsync<Item>('SELECT * FROM items WHERE isResolved = 0 ORDER BY datetime(createdAt) DESC LIMIT ?', limit);
}

export async function listMyItems(db: SQLiteDatabase): Promise<Item[]> {
  return db.getAllAsync<Item>('SELECT * FROM items WHERE ownerId = ? ORDER BY datetime(createdAt) DESC', LOCAL_USER_ID);
}

export async function getItem(db: SQLiteDatabase, id: number): Promise<Item | null> {
  return db.getFirstAsync<Item>('SELECT * FROM items WHERE id = ?', id);
}

export async function createItem(db: SQLiteDatabase, input: ItemInput): Promise<number> {
  const now = new Date().toISOString();
  const result = await db.runAsync(
    `INSERT INTO items (title, description, category, status, location, eventDate, imageUri, contactName, contactPhone, ownerId, isResolved, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
    input.title, input.description, input.category, input.status, input.location, input.eventDate,
    input.imageUri, input.contactName, input.contactPhone, LOCAL_USER_ID, now, now,
  );
  return result.lastInsertRowId;
}

export async function updateItem(db: SQLiteDatabase, id: number, input: ItemInput) {
  await db.runAsync(
    `UPDATE items SET title=?, description=?, category=?, status=?, location=?, eventDate=?, imageUri=?, contactName=?, contactPhone=?, updatedAt=? WHERE id=? AND ownerId=?`,
    input.title, input.description, input.category, input.status, input.location, input.eventDate,
    input.imageUri, input.contactName, input.contactPhone, new Date().toISOString(), id, LOCAL_USER_ID,
  );
}

export async function deleteItem(db: SQLiteDatabase, id: number) {
  await db.runAsync('DELETE FROM items WHERE id = ? AND ownerId = ?', id, LOCAL_USER_ID);
}

export async function setItemResolved(db: SQLiteDatabase, id: number, resolved: boolean) {
  await db.runAsync('UPDATE items SET isResolved = ?, updatedAt = ? WHERE id = ? AND ownerId = ?', resolved ? 1 : 0, new Date().toISOString(), id, LOCAL_USER_ID);
}

export async function getItemStats(db: SQLiteDatabase) {
  const rows = await db.getAllAsync<{ status: 'lost' | 'found'; total: number }>(
    'SELECT status, COUNT(*) AS total FROM items WHERE isResolved = 0 GROUP BY status',
  );
  return {
    lost: rows.find((row) => row.status === 'lost')?.total ?? 0,
    found: rows.find((row) => row.status === 'found')?.total ?? 0,
  };
}
