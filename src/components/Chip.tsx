import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '@/constants/theme';

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.chip, selected && styles.selected]}><Text style={[styles.text, selected && styles.selectedText]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({ chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 99, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }, selected: { backgroundColor: colors.primary, borderColor: colors.primary }, text: { color: colors.textMuted, fontSize: 13, fontWeight: '600' }, selectedText: { color: '#FFF' } });
