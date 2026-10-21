import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Item } from '@/types';
import { colors, shadows } from '@/constants/theme';
import { formatStatus } from '@/utils/format';

export function ItemCard({ item, onPress, compact = false }: { item: Item; onPress: () => void; compact?: boolean }) {
  const statusColor = item.status === 'lost' ? colors.warning : colors.success;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Abrir anúncio ${item.title}`} onPress={onPress} style={({ pressed }) => [styles.card, compact && styles.compact, pressed && styles.pressed]}>
      <View style={[styles.image, compact && styles.imageCompact]}>
        {item.imageUri ? <Image source={{ uri: item.imageUri }} style={styles.fullImage} resizeMode="cover" /> : <MaterialCommunityIcons name="image-outline" size={32} color="#A5A9B0" />}
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
          {item.isResolved ? <View style={styles.resolved}><Text style={styles.resolvedText}>Resolvido</Text></View> : null}
        </View>
        <View style={[styles.badge, { backgroundColor: `${statusColor}18` }]}><Text style={[styles.badgeText, { color: statusColor }]}>{formatStatus(item.status)}</Text></View>
        <Text numberOfLines={1} style={styles.meta}><MaterialCommunityIcons name="tag-outline" size={14} /> {item.category}</Text>
        <Text numberOfLines={1} style={styles.meta}><MaterialCommunityIcons name="map-marker-outline" size={14} /> {item.location}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={22} color="#A5A9B0" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { ...shadows.card, backgroundColor: colors.surface, borderRadius: 18, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  compact: { minWidth: 302, width: 302, marginRight: 12 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  image: { width: 84, height: 84, borderRadius: 14, overflow: 'hidden', backgroundColor: '#ECEEF1', alignItems: 'center', justifyContent: 'center' },
  fullImage: { width: '100%', height: '100%' },
  imageCompact: { width: 76, height: 76 },
  content: { flex: 1, gap: 4 }, row: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  title: { flex: 1, color: colors.text, fontSize: 16, fontWeight: '700' },
  badge: { alignSelf: 'flex-start', borderRadius: 99, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  meta: { color: colors.textMuted, fontSize: 12 },
  resolved: { backgroundColor: '#E8EAED', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  resolvedText: { color: colors.textMuted, fontSize: 9, fontWeight: '700' },
});
