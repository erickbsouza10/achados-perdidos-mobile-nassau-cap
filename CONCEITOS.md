# Conceitos aplicados no Nassau Find

## Componentes e props

Componentes são funções que retornam interface. `src/components/ItemCard.tsx` concentra a aparência de um anúncio e é reutilizado em Início, Explorar e Meus anúncios. Ele recebe `item`, `onPress` e `compact` por **props**. Props são entradas fornecidas pelo pai e deixam o filho reutilizável.

```tsx
<ItemCard item={item} onPress={() => router.push(`/item/${item.id}`)} />
```

## useState

`useState` guarda valores que mudam e precisam atualizar a tela. Em `src/app/(tabs)/explore.tsx`, `query`, `status` e `category` representam filtros. Quando `setQuery` recebe texto, o React renderiza novamente a lista filtrada. No `ItemForm`, um objeto de estado reúne todos os campos.

## useEffect e ciclo de vida

`src/app/item/edit/[id].tsx` usa `useEffect` para buscar o anúncio quando a tela monta ou quando `db`/`id` mudam. O efeito sincroniza a tela com o SQLite.

Para telas que permanecem montadas nas abas, `src/hooks/useItems.ts` usa `useFocusEffect`. Ele executa `load` ao entrar ou voltar para a tela, inclusive depois de uma edição.

## map, filter e find

- `map` transforma valores. `CATEGORIES.map(...)` cria um chip para cada categoria e itens viram `ItemCard`.
- `filter` cria um array apenas com elementos aprovados. Explorar combina texto, situação e categoria.
- `find` retorna o primeiro correspondente. `getItemStats` encontra a linha cujo status é `lost` ou `found`.

Nenhum desses métodos altera o array original.

## async/await e erros

SQLite, câmera e galeria são assíncronos. `await` aguarda uma Promise sem bloquear a interface. O hook `useItems` usa:

```ts
try {
  setLoading(true);
  const data = await listItems(db);
  setItems(data);
} catch (error) {
  setError('Não foi possível carregar os anúncios.');
} finally {
  setLoading(false);
}
```

`try` executa o fluxo normal, `catch` trata falhas e `finally` remove o carregamento em qualquer resultado.

## CRUD

- **Create:** `createItem` usa `INSERT`.
- **Read:** `listItems` e `getItem` usam `SELECT`.
- **Update:** `updateItem` e `setItemResolved` usam `UPDATE`.
- **Delete:** `deleteItem` usa `DELETE` após confirmação.

Alterações e exclusões incluem `ownerId = 'local-user'`, impedindo modificar os anúncios de demonstração.

## SQLite

SQLite armazena tabelas em um arquivo local. `src/database/init.ts` cria `items` e `users` com `CREATE TABLE IF NOT EXISTS`. O ID do objeto é autoincremental, `status` aceita somente `lost` ou `found`, e `isResolved` usa 0/1.

`execAsync` é usado para SQL fixo do schema. Entradas do usuário usam `runAsync` com placeholders `?`, prática importante contra injeção de SQL.

## Expo Router

- `src/app/(tabs)/index.tsx` é a aba inicial.
- `src/app/item/[id].tsx` é dinâmica; `[id]` recebe o ID.
- `_layout.tsx` configura Tabs ou Stack.

`router.push('/item/3')` empilha detalhes; `router.back()` retorna; `useLocalSearchParams` lê o ID. O grupo `(tabs)` organiza arquivos sem aparecer na URL.

## TypeScript

`Item`, `ItemInput`, `LocalUser` e `ItemStatus` ficam em `src/types/index.ts`. Por exemplo, `status` só pode ser `'lost'` ou `'found'`. Isso oferece autocomplete, documenta os dados e detecta erros em `npm run typecheck`.

## Validação e acessibilidade

O formulário verifica tamanho mínimo, campos obrigatórios, telefone com DDD e data real em formato brasileiro. Erros ficam perto do campo e geram alerta. Botões principais têm rótulos ou papéis de acessibilidade, áreas de toque amplas e contraste. Permissões negadas recebem orientação clara sem encerrar o app.
