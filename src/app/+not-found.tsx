import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';
export default function NotFound() { return <><Stack.Screen options={{ title: 'Página não encontrada' }} /><View style={styles.container}><Text style={styles.title}>Esta tela não existe.</Text><Link href="/" style={styles.link}>Voltar ao início</Link></View></>; }
const styles = StyleSheet.create({ container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: colors.background }, title: { fontSize: 20, fontWeight: '800', color: colors.text }, link: { color: colors.primary, fontWeight: '700' } });
