import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Item } from '@/types';
import { listItems, listMyItems, listRecentItems } from '@/services/itemService';

export function useItems(mode: 'all' | 'mine' | 'recent' = 'all') {
  const db = useSQLiteContext();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = mode === 'mine' ? await listMyItems(db) : mode === 'recent' ? await listRecentItems(db) : await listItems(db);
      setItems(data);
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar os anúncios.');
    } finally {
      setLoading(false);
    }
  }, [db, mode]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));
  return { items, loading, error, reload: load };
}
