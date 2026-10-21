export type ItemStatus = 'lost' | 'found';

export interface Item {
  id: number;
  title: string;
  description: string;
  category: string;
  status: ItemStatus;
  location: string;
  eventDate: string;
  imageUri: string | null;
  contactName: string;
  contactPhone: string;
  ownerId: string;
  isResolved: number;
  createdAt: string;
  updatedAt: string;
}

export type ItemInput = Omit<Item, 'id' | 'ownerId' | 'isResolved' | 'createdAt' | 'updatedAt'>;

export interface LocalUser {
  id: string;
  name: string;
  course: string;
  email: string;
  createdAt: string;
}

export const LOCAL_USER_ID = 'local-user';

export const CATEGORIES = [
  'Documento',
  'Eletrônico',
  'Material acadêmico',
  'Acessório',
  'Chaves',
  'Outros',
] as const;
