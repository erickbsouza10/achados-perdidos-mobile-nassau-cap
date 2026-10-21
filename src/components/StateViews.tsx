import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';

export function LoadingView({ label = 'Carregando...' }: { label?: string }) {
  return <View style={styles.container}><ActivityIndicator color={colors.primary} /><Text style={styles.text}>{label}</Text></View>;
}

export function EmptyView({ title = 'Nenhum anúncio encontrado', message = 'Tente alterar os filtros ou cadastre um novo objeto.' }: { title?: string; message?: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}><MaterialCommunityIcons name="archive-search-outline" color={colors.primary} size={34} /></View>
      <Text style={styles.title}>{title}</Text><Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 46, paddingHorizontal: 30, alignItems: 'center', gap: 8 },
  icon: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  title: { color: colors.text, fontSize: 17, fontWeight: '700', textAlign: 'center' },
  text: { color: colors.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
