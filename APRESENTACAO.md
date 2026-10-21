# Roteiro de apresentação — aproximadamente 10 minutos

## 1. Introdução e problema — 1 min

“Objetos perdidos na faculdade geralmente são divulgados em grupos separados ou ficam na recepção sem que o dono saiba. O Nassau Find reúne essas informações em um aplicativo simples para a comunidade UNINASSAU Campina Grande.”

Explique que o projeto é offline e acadêmico: nesta versão cada aparelho tem seu próprio banco.

## 2. Solução e público-alvo — 45 s

Apresente estudantes, professores e colaboradores como público. Resuma o fluxo: publicar, pesquisar, identificar, entrar em contato e marcar como resolvido.

## 3. Tecnologias — 1 min

- React Native cria a interface mobile.
- Expo facilita execução no Expo Go e acesso à câmera/galeria.
- TypeScript adiciona tipos e detecta erros antes da execução.
- Expo Router organiza a navegação por arquivos.
- SQLite mantém os dados localmente e sem internet.

## 4. Arquitetura — 1 min

Mostre `src/app` para as rotas, `components` para peças reutilizáveis, `services` para as queries, `database` para schema/seed, `hooks` para carregamento e `types` para os contratos. Destaque: a tela pede dados ao serviço, sem escrever SQL dentro da interface.

## 5. Demonstração das telas — 3 min

1. **Início:** indicadores, pesquisa e anúncios recentes.
2. **Explorar:** pesquise “garrafa”, alterne situação e categoria; mostre o estado vazio.
3. **Cadastrar:** tente enviar vazio para mostrar validações; complete os campos e use câmera ou galeria.
4. **Detalhes:** apresente foto, local, data e contato.
5. **Meus anúncios:** mostre ativos/resolvidos e os controles do proprietário.
6. **Perfil:** edite nome/curso/e-mail e mostre os contadores.

## 6. CRUD completo — 1 min 30 s

- **Create:** publique o anúncio preenchido.
- **Read:** localize-o em Explorar e abra os detalhes.
- **Update:** edite título ou local e marque como resolvido.
- **Delete:** exclua com confirmação.

Explique que as telas recarregam ao ganhar foco e que todas as ações operam no SQLite, não em mocks.

## 7. Conceitos de React Native — 1 min

Mostre `ItemCard` como componente com props; `useState` nos filtros e formulários; `useFocusEffect` no hook; `map` nos chips e cards; `filter` na pesquisa; `find` nos contadores; e `async/await` com `try/catch/finally` no carregamento.

## 8. Encerramento — 45 s

“O projeto atende o fluxo principal com navegação, validação, permissões, CRUD e persistência local. Como evolução futura, um backend autenticado permitiria compartilhar anúncios entre aparelhos, mas ficou fora desta versão para preservar estabilidade e escopo.”

## Perguntas prováveis

**Por que SQLite?** É relacional, local, persistente, funciona offline e é adequado aos registros estruturados.

**Por que não existe login?** O requisito prioriza funcionamento offline; o proprietário local é identificado por um ID fixo no aparelho.

**Os exemplos duplicam?** Não. O seed só roda quando a tabela de objetos está vazia.

**Como evita SQL injection?** Valores externos são enviados como parâmetros `?`, não concatenados.

**Como as listas atualizam?** `useFocusEffect` consulta novamente o banco quando a rota volta ao foco.

**Onde os dados ficam?** No arquivo `nassau-find.db` gerenciado pelo `expo-sqlite` no armazenamento do aplicativo.
