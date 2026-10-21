import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { colors } from '@/constants/theme';

const icons = { index: 'home-variant-outline', explore: 'magnify', create: 'plus-circle', mine: 'clipboard-text-outline', profile: 'account-outline' } as const;

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: '#7A7F87', tabBarLabelStyle: { fontSize: 11, fontWeight: '600', paddingBottom: Platform.OS === 'android' ? 5 : 0 }, tabBarStyle: { height: Platform.OS === 'android' ? 68 : 82, paddingTop: 7, backgroundColor: colors.surface, borderTopColor: colors.border } }}>
      {Object.entries(icons).map(([name, icon]) => <Tabs.Screen key={name} name={name} options={{ title: name === 'index' ? 'Início' : name === 'explore' ? 'Explorar' : name === 'create' ? 'Cadastrar' : name === 'mine' ? 'Meus anúncios' : 'Perfil', tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name={icon} color={String(color)} size={name === 'create' ? size + 5 : size} /> }} />)}
    </Tabs>
  );
}
