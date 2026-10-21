import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { CATEGORIES, ItemInput, ItemStatus } from '@/types';
import { colors } from '@/constants/theme';
import { isValidDate, todayBr } from '@/utils/format';
import { Chip } from './Chip';

const emptyForm: ItemInput = { title: '', description: '', category: '', status: 'lost', location: '', eventDate: todayBr(), imageUri: null, contactName: '', contactPhone: '' };

export function ItemForm({ initialValue, submitLabel, onSubmit }: { initialValue?: ItemInput; submitLabel: string; onSubmit: (data: ItemInput) => Promise<void> }) {
  const [form, setForm] = useState<ItemInput>(initialValue ?? emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  function update<K extends keyof ItemInput>(key: K, value: ItemInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: '' }));
  }

  function validate() {
    const next: Record<string, string> = {};
    if (form.title.trim().length < 3) next.title = 'Informe um nome com pelo menos 3 caracteres.';
    if (form.description.trim().length < 10) next.description = 'Descreva o objeto com pelo menos 10 caracteres.';
    if (!form.category) next.category = 'Selecione uma categoria.';
    if (!form.location.trim()) next.location = 'Informe o local.';
    if (!isValidDate(form.eventDate)) next.eventDate = 'Use uma data válida no formato DD/MM/AAAA.';
    if (form.contactName.trim().length < 3) next.contactName = 'Informe o nome do responsável.';
    if (form.contactPhone.replace(/\D/g, '').length < 10) next.contactPhone = 'Informe um telefone com DDD.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function chooseImage(source: 'camera' | 'library') {
    try {
      const permission = source === 'camera' ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permissão necessária', source === 'camera' ? 'Autorize o uso da câmera nas configurações do aparelho.' : 'Autorize o acesso às fotos nas configurações do aparelho.');
        return;
      }
      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.75, allowsEditing: true, aspect: [4, 3] })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.75, allowsEditing: true, aspect: [4, 3] });
      if (!result.canceled && result.assets[0]) update('imageUri', result.assets[0].uri);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível obter a imagem. Tente novamente.');
    }
  }

  async function handleSubmit() {
    if (!validate()) { Alert.alert('Revise o formulário', 'Alguns campos precisam ser corrigidos.'); return; }
    try {
      setSaving(true);
      await onSubmit({ ...form, title: form.title.trim(), description: form.description.trim(), location: form.location.trim(), contactName: form.contactName.trim(), contactPhone: form.contactPhone.trim() });
      if (!initialValue) setForm({ ...emptyForm, eventDate: todayBr() });
    } catch (error) {
      console.error(error);
      Alert.alert('Erro ao salvar', 'O anúncio não pôde ser salvo. Tente novamente.');
    } finally { setSaving(false); }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.container}>
        <Field label="Nome do objeto *" value={form.title} onChangeText={(v) => update('title', v)} placeholder="Ex.: Carteira marrom" error={errors.title} />
        <Text style={styles.label}>Situação *</Text>
        <View style={styles.row}><Choice icon="magnify" label="Perdido" value="lost" selected={form.status} onSelect={(v) => update('status', v)} /><Choice icon="hand-heart-outline" label="Encontrado" value="found" selected={form.status} onSelect={(v) => update('status', v)} /></View>
        <Text style={styles.label}>Categoria *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>{CATEGORIES.map((category) => <Chip key={category} label={category} selected={form.category === category} onPress={() => update('category', category)} />)}</ScrollView>
        {errors.category ? <Text style={styles.error}>{errors.category}</Text> : null}
        <Field label="Descrição *" value={form.description} onChangeText={(v) => update('description', v)} placeholder="Cor, características e outras informações úteis" error={errors.description} multiline />
        <Field label="Local *" value={form.location} onChangeText={(v) => update('location', v)} placeholder="Ex.: Biblioteca, 2º andar" error={errors.location} />
        <Field label="Data *" value={form.eventDate} onChangeText={(v) => update('eventDate', v)} placeholder="DD/MM/AAAA" error={errors.eventDate} keyboardType="numeric" />
        <Text style={styles.label}>Foto do objeto</Text>
        {form.imageUri ? <View style={styles.previewWrap}><Image source={{ uri: form.imageUri }} style={styles.preview} /><Pressable onPress={() => update('imageUri', null)} style={styles.removePhoto}><MaterialCommunityIcons name="close" size={18} color="#FFF" /></Pressable></View> : <View style={styles.photoPlaceholder}><MaterialCommunityIcons name="camera-outline" size={38} color={colors.textMuted} /><Text style={styles.hint}>Uma foto facilita a identificação</Text></View>}
        <View style={styles.row}><PhotoButton icon="image-outline" label="Galeria" onPress={() => void chooseImage('library')} /><PhotoButton icon="camera-outline" label="Câmera" onPress={() => void chooseImage('camera')} /></View>
        <View style={styles.section}><Text style={styles.sectionTitle}>Dados para contato</Text><Text style={styles.hint}>Esses dados serão exibidos no anúncio.</Text></View>
        <Field label="Nome do responsável *" value={form.contactName} onChangeText={(v) => update('contactName', v)} placeholder="Seu nome" error={errors.contactName} />
        <Field label="Telefone / WhatsApp *" value={form.contactPhone} onChangeText={(v) => update('contactPhone', v)} placeholder="(83) 99999-9999" error={errors.contactPhone} keyboardType="phone-pad" />
        <Pressable disabled={saving} onPress={() => void handleSubmit()} style={({ pressed }) => [styles.submit, (pressed || saving) && { opacity: 0.75 }]}><MaterialCommunityIcons name={saving ? 'loading' : 'content-save-outline'} color="#FFF" size={21} /><Text style={styles.submitText}>{saving ? 'Salvando...' : submitLabel}</Text></Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field(props: { label: string; value: string; onChangeText: (v: string) => void; placeholder: string; error?: string; multiline?: boolean; keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address' }) {
  return <View><Text style={styles.label}>{props.label}</Text><TextInput {...props} placeholderTextColor="#989CA3" style={[styles.input, props.multiline && styles.multiline, props.error && styles.inputError]} textAlignVertical={props.multiline ? 'top' : 'center'} /><Text style={styles.error}>{props.error ?? ''}</Text></View>;
}

function Choice({ icon, label, value, selected, onSelect }: { icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; label: string; value: ItemStatus; selected: ItemStatus; onSelect: (v: ItemStatus) => void }) {
  const active = value === selected;
  return <Pressable onPress={() => onSelect(value)} style={[styles.choice, active && styles.choiceActive]}><MaterialCommunityIcons name={icon} size={22} color={active ? '#FFF' : colors.textMuted} /><Text style={[styles.choiceText, active && { color: '#FFF' }]}>{label}</Text></Pressable>;
}

function PhotoButton({ icon, label, onPress }: { icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; label: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={styles.photoButton}><MaterialCommunityIcons name={icon} size={20} color={colors.primary} /><Text style={styles.photoButtonText}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 44, gap: 4 }, label: { color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 7, marginTop: 8 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, minHeight: 50, paddingHorizontal: 14, color: colors.text, fontSize: 15 },
  multiline: { height: 110, paddingTop: 13 }, inputError: { borderColor: colors.danger }, error: { color: colors.danger, fontSize: 12, minHeight: 17, marginTop: 3 },
  row: { flexDirection: 'row', gap: 10 }, choice: { flex: 1, minHeight: 52, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  choiceActive: { backgroundColor: colors.primary, borderColor: colors.primary }, choiceText: { color: colors.text, fontWeight: '700' }, chips: { gap: 8, paddingBottom: 2 },
  photoPlaceholder: { height: 150, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', borderColor: '#C8CBD0', backgroundColor: '#EEF0F3', alignItems: 'center', justifyContent: 'center', gap: 7 }, hint: { color: colors.textMuted, fontSize: 13 },
  previewWrap: { height: 200, borderRadius: 16, overflow: 'hidden' }, preview: { width: '100%', height: '100%' }, removePhoto: { position: 'absolute', right: 10, top: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: '#000A', alignItems: 'center', justifyContent: 'center' },
  photoButton: { flex: 1, minHeight: 48, borderRadius: 13, borderWidth: 1, borderColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 8 }, photoButtonText: { color: colors.primary, fontWeight: '700' },
  section: { marginTop: 22, marginBottom: 2 }, sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 3 },
  submit: { minHeight: 54, borderRadius: 15, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 16 }, submitText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
