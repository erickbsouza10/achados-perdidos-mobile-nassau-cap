import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Chip } from '@/components/Chip';
import { EmptyView, LoadingView } from '@/components/StateViews';
import { ItemCard } from '@/components/ItemCard';
import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { SearchInput } from '@/components/SearchInput';
import { colors } from '@/constants/theme';
import { useItems } from '@/hooks/useItems';
import { CATEGORIES, ItemStatus } from '@/types';

type StatusFilter = 'all' | ItemStatus;

export default function ExploreScreen() {
  const { items, loading, error } = useItems();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [category, setCategory] = useState('Todas');
  const filtered = useMemo(() => items.filter((item) => {
    const text = `${item.title} ${item.location}`.toLowerCase();
    return text.includes(query.trim().toLowerCase()) && (status === 'all' || item.status === status) && (category === 'Todas' || item.category === category);
  }), [items, query, status, category]);

  return <Screen><PageHeader title="Explorar objetos" subtitle="Pesquise anúncios de toda a comunidade acadêmica." /><FlatList data={filtered} keyExtractor={(item) => String(item.id)} renderItem={({ item }) => <ItemCard item={item} onPress={() => router.push(`/item/${item.id}`)} />} contentContainerStyle={styles.list} ListHeaderComponent={<View style={styles.filters}><SearchInput value={query} onChangeText={setQuery} /><Text style={styles.label}>Situação</Text><View style={styles.row}><Chip label="Todos" selected={status === 'all'} onPress={() => setStatus('all')} /><Chip label="Perdidos" selected={status === 'lost'} onPress={() => setStatus('lost')} /><Chip label="Encontrados" selected={status === 'found'} onPress={() => setStatus('found')} /></View><Text style={styles.label}>Categoria</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}><Chip label="Todas" selected={category === 'Todas'} onPress={() => setCategory('Todas')} />{CATEGORIES.map((value) => <Chip key={value} label={value} selected={category === value} onPress={() => setCategory(value)} />)}</ScrollView><Text style={styles.count}>{filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}</Text></View>} ListEmptyComponent={loading ? <LoadingView /> : <EmptyView title={error || 'Nenhum anúncio encontrado'} />} showsVerticalScrollIndicator={false} /></Screen>;
}

const styles = StyleSheet.create({ list: { paddingHorizontal: 20, paddingBottom: 30 }, filters: { gap: 11, paddingBottom: 14 }, row: { flexDirection: 'row', gap: 8 }, label: { color: colors.text, fontSize: 13, fontWeight: '700', marginTop: 3 }, count: { color: colors.textMuted, fontSize: 12, marginTop: 5 } });
