import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Chip } from '@/components/Chip';
import { ItemCard } from '@/components/ItemCard';
import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { EmptyView, LoadingView } from '@/components/StateViews';
import { colors } from '@/constants/theme';
import { useItems } from '@/hooks/useItems';
import { deleteItem, setItemResolved } from '@/services/itemService';
import { Item } from '@/types';

export default function MyItemsScreen() {
  const db = useSQLiteContext();
  const { items, loading, error, reload } = useItems('mine');
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const visible = useMemo(() => items.filter((item) => filter === 'all' || (filter === 'resolved' ? item.isResolved : !item.isResolved)), [items, filter]);
  function confirmDelete(item: Item) { Alert.alert('Excluir anúncio?', `“${item.title}” será removido permanentemente.`, [{ text: 'Cancelar', style: 'cancel' }, { text: 'Excluir', style: 'destructive', onPress: async () => { try { await deleteItem(db, item.id); await reload(); } catch { Alert.alert('Erro', 'Não foi possível excluir o anúncio.'); } } }]); }
  async function toggle(item: Item) { try { await setItemResolved(db, item.id, !item.isResolved); await reload(); } catch { Alert.alert('Erro', 'Não foi possível alterar o status.'); } }
  return <Screen><PageHeader title="Meus anúncios" subtitle="Gerencie os objetos que você cadastrou neste aparelho." /><FlatList data={visible} keyExtractor={(item) => String(item.id)} renderItem={({ item }) => <View><ItemCard item={item} onPress={() => router.push(`/item/${item.id}`)} /><View style={styles.actions}><Action icon="pencil-outline" label="Editar" onPress={() => router.push(`/item/edit/${item.id}`)} /><Action icon={item.isResolved ? 'backup-restore' : 'check-circle-outline'} label={item.isResolved ? 'Reabrir' : 'Resolver'} onPress={() => void toggle(item)} /><Action danger icon="trash-can-outline" label="Excluir" onPress={() => confirmDelete(item)} /></View></View>} contentContainerStyle={styles.list} ListHeaderComponent={<View style={styles.filters}><Chip label="Todos" selected={filter === 'all'} onPress={() => setFilter('all')} /><Chip label="Ativos" selected={filter === 'active'} onPress={() => setFilter('active')} /><Chip label="Resolvidos" selected={filter === 'resolved'} onPress={() => setFilter('resolved')} /></View>} ListEmptyComponent={loading ? <LoadingView /> : <EmptyView title={error || 'Você ainda não tem anúncios'} message="Use a aba Cadastrar para publicar seu primeiro objeto." />} /></Screen>;
}

function Action({ icon, label, onPress, danger }: { icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; label: string; onPress: () => void; danger?: boolean }) { return <Pressable onPress={onPress} style={styles.action}><MaterialCommunityIcons name={icon} size={17} color={danger ? colors.danger : colors.primary} /><Text style={[styles.actionText, danger && { color: colors.danger }]}>{label}</Text></Pressable>; }
const styles = StyleSheet.create({ list: { paddingHorizontal: 20, paddingBottom: 30 }, filters: { flexDirection: 'row', gap: 8, marginBottom: 16 }, actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 7, marginTop: -5, marginBottom: 18 }, action: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: 10, paddingVertical: 7, paddingHorizontal: 9 }, actionText: { color: colors.primary, fontSize: 12, fontWeight: '700' } });
