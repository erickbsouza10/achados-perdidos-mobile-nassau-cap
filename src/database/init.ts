import type { SQLiteDatabase } from 'expo-sqlite';

export async function initializeDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      course TEXT NOT NULL,
      email TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('lost', 'found')),
      location TEXT NOT NULL,
      eventDate TEXT NOT NULL,
      imageUri TEXT,
      contactName TEXT NOT NULL,
      contactPhone TEXT NOT NULL,
      ownerId TEXT NOT NULL,
      isResolved INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);

  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT OR IGNORE INTO users (id, name, course, email, createdAt) VALUES (?, ?, ?, ?, ?)`,
    'local-user', 'Estudante UNINASSAU', 'Ciência da Computação', 'estudante@uninassau.edu.br', now,
  );

  const seedMarker = await db.getFirstAsync<{ value: string }>("SELECT value FROM app_meta WHERE key = 'seed_v1'");
  if (!seedMarker) {
    const count = await db.getFirstAsync<{ total: number }>('SELECT COUNT(*) AS total FROM items');
    if ((count?.total ?? 0) === 0) {
    const seeds = [
      ['Garrafa térmica preta', 'Garrafa com adesivo azul na lateral.', 'Acessório', 'lost', 'Biblioteca, 2º andar', '20/10/2026', null, 'Marina Alves', '(83) 99911-2233', 'demo-marina'],
      ['Chaveiro com três chaves', 'Encontrado próximo às mesas do corredor.', 'Chaves', 'found', 'Bloco B, térreo', '21/10/2026', null, 'Carlos Lima', '(83) 98822-1144', 'demo-carlos'],
      ['Caderno de cálculo', 'Capa vermelha e nome escrito na primeira página.', 'Material acadêmico', 'found', 'Sala 304', '19/10/2026', null, 'Ana Souza', '(83) 97733-5566', 'demo-ana'],
    ] as const;
    for (const item of seeds) {
      await db.runAsync(
        `INSERT INTO items (title, description, category, status, location, eventDate, imageUri, contactName, contactPhone, ownerId, isResolved, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
        ...item, now, now,
      );
    }
    }
    await db.runAsync("INSERT OR REPLACE INTO app_meta (key, value) VALUES ('seed_v1', 'done')");
  }
}
