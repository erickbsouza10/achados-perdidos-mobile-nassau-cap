export function formatStatus(status: 'lost' | 'found') {
  return status === 'lost' ? 'Perdido' : 'Encontrado';
}

export function isValidDate(value: string) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
  const [day, month, year] = value.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function todayBr() {
  return new Intl.DateTimeFormat('pt-BR').format(new Date());
}
