import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { SearchInput } from '@/components/SearchInput';
import { ItemCard } from '@/components/ItemCard';
import { LoadingView } from '@/components/StateViews';
import { colors } from '@/constants/theme';
import { useItems } from '@/hooks/useItems';
import { getItemStats } from '@/services/itemService';

export default function HomeScreen() {
  const db = useSQLiteContext();
  const { items, loading } = useItems('recent');
  const [query, setQuery] = useState('');
  const [stats, setStats] = useState({ lost: 0, found: 0 });
  useFocusEffect(useCallback(() => { void getItemStats(db).then(setStats).catch(console.error); }, [db]));
  const visible = useMemo(() => items.filter((item) => item.title.toLowerCase().includes(query.trim().toLowerCase())), [items, query]);

  return (
    <Screen><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}><View><Text style={styles.eyebrow}>COMUNIDADE UNINASSAU</Text><Text style={styles.title}>Olá! O que você{`\n`}está procurando?</Text></View><View style={styles.logo}><Text style={styles.logoText}>NF</Text></View></View>
      <SearchInput value={query} onChangeText={setQuery} />
      <View style={styles.stats}><Stat icon="magnify" value={stats.lost} label="Objetos perdidos" tone="warning" /><Stat icon="hand-heart-outline" value={stats.found} label="Objetos encontrados" tone="success" /></View>
      <Pressable onPress={() => router.push('/create')} style={({ pressed }) => [styles.action, pressed && { opacity: 0.85 }]}><View style={styles.actionIcon}><MaterialCommunityIcons name="plus" size={27} color="#FFF" /></View><View style={{ flex: 1 }}><Text style={styles.actionTitle}>Cadastrar um objeto</Text><Text style={styles.actionText}>Perdeu ou encontrou algo? Avise a comunidade.</Text></View><MaterialCommunityIcons name="chevron-right" size={24} color="#FFF" /></Pressable>
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{query ? 'Resultados' : 'Anúncios recentes'}</Text><Pressable onPress={() => router.push('/explore')}><Text style={styles.seeAll}>Ver todos</Text></Pressable></View>
      {loading ? <LoadingView /> : visible.map((item) => <ItemCard key={item.id} item={item} onPress={() => router.push(`/item/${item.id}`)} />)}
      {!loading && query && visible.length === 0 ? <Text style={styles.noResult}>Nenhum objeto encontrado com “{query}”.</Text> : null}
      <View style={styles.info}><MaterialCommunityIcons name="shield-check-outline" size={22} color={colors.primary} /><Text style={styles.infoText}>Combine a devolução em um local público da instituição e confira os detalhes do objeto.</Text></View>
    </ScrollView></Screen>
  );
}

function Stat({ icon, value, label, tone }: { icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; value: number; label: string; tone: 'warning' | 'success' }) {
  const color = tone === 'warning' ? colors.warning : colors.success;
  return <View style={styles.stat}><View style={[styles.statIcon, { backgroundColor: `${color}18` }]}><MaterialCommunityIcons name={icon} size={23} color={color} /></View><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 36 }, hero: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 10, marginBottom: 22 }, eyebrow: { color: colors.primary, fontSize: 11, letterSpacing: 1.1, fontWeight: '800', marginBottom: 7 }, title: { color: colors.text, fontSize: 28, lineHeight: 34, fontWeight: '800', letterSpacing: -0.7 }, logo: { width: 48, height: 48, borderRadius: 15, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, logoText: { color: '#FFF', fontWeight: '900', fontSize: 16 },
  stats: { flexDirection: 'row', gap: 12, marginVertical: 18 }, stat: { flex: 1, backgroundColor: colors.surface, borderRadius: 17, padding: 14 }, statIcon: { width: 39, height: 39, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 9 }, statValue: { fontSize: 24, color: colors.text, fontWeight: '800' }, statLabel: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  action: { backgroundColor: colors.primary, borderRadius: 19, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }, actionIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF25', alignItems: 'center', justifyContent: 'center' }, actionTitle: { color: '#FFF', fontWeight: '800', fontSize: 16 }, actionText: { color: '#FFFFFFCC', fontSize: 12, lineHeight: 17, marginTop: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 26, marginBottom: 12 }, sectionTitle: { fontSize: 19, fontWeight: '800', color: colors.text }, seeAll: { color: colors.primary, fontWeight: '700', fontSize: 13 }, noResult: { color: colors.textMuted, textAlign: 'center', paddingVertical: 25 },
  info: { backgroundColor: colors.primaryLight, borderRadius: 15, padding: 14, flexDirection: 'row', gap: 10, marginTop: 10 }, infoText: { flex: 1, color: colors.primaryDark, fontSize: 12, lineHeight: 18 },
});
