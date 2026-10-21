import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors } from '@/constants/theme';

export function SearchInput({ value, onChangeText, placeholder = 'Pesquisar objetos...' }: { value: string; onChangeText: (text: string) => void; placeholder?: string }) {
  return (
    <View style={styles.wrapper}>
      <MaterialCommunityIcons name="magnify" size={22} color={colors.textMuted} />
      <TextInput
        accessibilityLabel={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8A8F98"
        style={styles.input}
        returnKeyType="search"
      />
      {value ? <MaterialCommunityIcons name="close-circle" size={20} color={colors.textMuted} onPress={() => onChangeText('')} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { height: 52, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, gap: 10 },
  input: { flex: 1, height: '100%', color: colors.text, fontSize: 15 },
});
