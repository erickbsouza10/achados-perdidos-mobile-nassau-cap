import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Alert } from 'react-native';
import { ItemForm } from '@/components/ItemForm';
import { PageHeader } from '@/components/PageHeader';
import { Screen } from '@/components/Screen';
import { createItem } from '@/services/itemService';

export default function CreateScreen() {
  const db = useSQLiteContext();
  return <Screen><PageHeader title="Cadastrar objeto" subtitle="Preencha os detalhes para ajudar a comunidade a identificar o item." /><ItemForm submitLabel="Publicar anúncio" onSubmit={async (data) => { const id = await createItem(db, data); Alert.alert('Anúncio publicado!', 'O objeto já está disponível para a comunidade.', [{ text: 'Ver anúncio', onPress: () => router.replace(`/item/${id}`) }]); }} /></Screen>;
}
