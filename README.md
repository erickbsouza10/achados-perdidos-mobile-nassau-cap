# Nassau Find — Achados e Perdidos

Aplicativo mobile offline para a comunidade acadêmica da UNINASSAU Campina Grande. O Nassau Find aproxima quem perdeu um objeto de quem o encontrou dentro da instituição, mantendo anúncios e perfil no próprio aparelho.

Projeto apresentado na **ENTEC / Semana Ubíqua em 22/10/2026**, como avaliação da disciplina de desenvolvimento mobile.

## Problema e público-alvo

Objetos esquecidos em salas, corredores e áreas comuns costumam depender de avisos informais. O aplicativo centraliza esses registros, permite pesquisa e oferece um contato direto. É destinado a estudantes, professores e colaboradores da instituição.

## Funcionalidades

- Cadastro de objetos perdidos ou encontrados, com validação.
- Foto pela câmera ou galeria, mediante permissão.
- Pesquisa dinâmica por nome e local.
- Filtros por situação e categoria.
- Detalhes completos e contato do responsável.
- Edição, resolução, reabertura e exclusão de anúncios próprios.
- Perfil local editável e indicadores de contribuição.
- Dados fictícios inseridos somente quando o banco está vazio.
- Persistência offline: fechar o app não apaga os dados.

## Tecnologias

- React Native 0.88 e React 19
- Expo SDK 58 e Expo Go
- TypeScript 6 em modo estrito
- Expo Router 58
- `expo-sqlite`, `expo-image-picker`, StyleSheet e Material Community Icons

## Estrutura

```text
src/
├── app/          # rotas: abas, detalhe e edição
├── components/   # cards, formulário, busca e estados de tela
├── constants/    # cores e sombras
├── database/     # schema, inicialização e seed
├── hooks/        # carregamento reativo dos anúncios
├── services/     # CRUD parametrizado de objetos e usuário
├── types/        # interfaces e tipos do domínio
└── utils/        # data e apresentação de status
```

## Instalação e execução

Requisitos: Node.js LTS, npm, celular na mesma rede do computador e Expo Go compatível com SDK 58.

```bash
npm install
npx expo start
```

Abra o Expo Go e leia o QR Code exibido. Se a rede local bloquear a conexão, tente `npx expo start --tunnel`.

```bash
npm run check        # TypeScript + ESLint
npx expo-doctor      # compatibilidade das dependências
npm run android      # abre no Android disponível
npm run web          # visualização web
```

O SQLite web usa WebAssembly. O arquivo `metro.config.js` registra `.wasm` como asset e configura os cabeçalhos COEP/COOP necessários. Depois de alterar essa configuração, reinicie o servidor limpando o cache com `npx expo start --clear`.

## Persistência

O `SQLiteProvider`, em `src/app/_layout.tsx`, abre `nassau-find.db` antes de renderizar as telas. `src/database/init.ts` cria as tabelas `items` e `users`, ativa WAL e insere exemplos apenas quando `items` está vazia. Os serviços usam parâmetros `?`, evitando concatenar valores do usuário ao SQL. O arquivo do banco é mantido pelo aparelho entre execuções.

As listagens usam `useFocusEffect`: ao voltar de cadastro, edição ou detalhe, os dados são consultados novamente e a interface reflete o CRUD automaticamente.

## Checklist no Expo Go

1. Abra todas as cinco abas e um anúncio de demonstração.
2. Cadastre um objeto com campos válidos e selecione uma foto.
3. Localize-o na pesquisa de Explorar.
4. Abra os detalhes e edite o anúncio.
5. Marque-o como resolvido em Meus anúncios e reabra-o.
6. Exclua-o e confirme que desapareceu das listas.
7. Edite o perfil, feche completamente o Expo Go, reabra e confira a persistência.
8. Teste câmera e galeria aceitando e negando as permissões.

> A câmera e a persistência após encerramento precisam ser validadas em dispositivo físico; o bundle e as verificações estáticas não substituem esse teste.

## Privacidade e escopo

Não há backend, login real nem envio para a internet. Os dados ficam apenas no aparelho. Uma versão multiusuário exigiria serviço remoto, autenticação, moderação e política de privacidade.
