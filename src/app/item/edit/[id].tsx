import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { ItemForm } from '@/components/ItemForm';
import { LoadingView } from '@/components/StateViews';
import { getItem, updateItem } from '@/services/itemService';
import { ItemInput, LOCAL_USER_ID } from '@/types';

export default function EditItemScreen() {
  const db = useSQLiteContext(); const { id: idParam } = useLocalSearchParams<{ id: string }>(); const id = Number(idParam); const [initial, setInitial] = useState<ItemInput | null>(null);
  useEffect(() => { void getItem(db, id).then((item) => { if (!item || item.ownerId !== LOCAL_USER_ID) { Alert.alert('Acesso negado', 'Você só pode editar seus próprios anúncios.', [{ text: 'Voltar', onPress: () => router.back() }]); return; } setInitial({ title: item.title, description: item.description, category: item.category, status: item.status, location: item.location, eventDate: item.eventDate, imageUri: item.imageUri, contactName: item.contactName, contactPhone: item.contactPhone }); }).catch(() => Alert.alert('Erro', 'Não foi possível abrir o anúncio.')); }, [db, id]);
  if (!initial) return <View style={{ flex: 1 }}><LoadingView /></View>;
  return <ItemForm initialValue={initial} submitLabel="Salvar alterações" onSubmit={async (data) => { await updateItem(db, id, data); Alert.alert('Alterações salvas', 'O anúncio foi atualizado.', [{ text: 'OK', onPress: () => router.back() }]); }} />;
}
