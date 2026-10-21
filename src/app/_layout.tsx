import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { Suspense } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { initializeDatabase } from '@/database/init';
import { colors } from '@/constants/theme';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  return (
    <Suspense fallback={<Loading />}>
      <SQLiteProvider databaseName="nassau-find.db" onInit={initializeDatabase} useSuspense>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text, headerTitleStyle: { fontWeight: '700' }, contentStyle: { backgroundColor: colors.background } }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="item/[id]" options={{ title: 'Detalhes do objeto' }} />
          <Stack.Screen name="item/edit/[id]" options={{ title: 'Editar anúncio' }} />
        </Stack>
      </SQLiteProvider>
    </Suspense>
  );
}

export function Loading() {
  return <View style={styles.loading}><ActivityIndicator size="large" color={colors.primary} /><Text style={styles.loadingText}>Preparando o Nassau Find...</Text></View>;
}

const styles = StyleSheet.create({ loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: colors.background }, loadingText: { color: colors.textMuted } });
