# Kit Figma — Sistema de Transporte Universitário (MVP)

## Entregáveis

Este pacote foi preparado com base no arquivo HTML enviado, `Prototipo-do-MVP-Versao em site.html`.

- **01 — Design System:** paleta, tipografia, botões, inputs, cartões e variantes de referência.
- **02 — Wireframes:** esboços mobile e desktop, com hierarquia de conteúdo.
- **03 — Mobile:** login, painel do universitário, consultas automática e manual, avisos, painel do motorista e ocorrência.
- **04 — Desktop:** painel administrativo, cadastros, configuração de rotas, redistribuição, avisos e ocorrências.
- **05 — Estados:** erro de login, ausência de rota, confirmação, validação, carregamento e exclusão.
- **06 — Protótipo:** mapa dos fluxos e o HTML original funcional (`Protótipo_navegável.html`).

## Abrindo e apresentando

1. Descompacte o ZIP sem alterar a estrutura das pastas.
2. Abra `index.html` no navegador para ver a galeria de todas as telas.
3. Clique em **Abrir demonstração navegável** para testar a experiência funcional original.

## Importando para o Figma

1. Crie um arquivo **Sistema de Transporte Universitário — MVP** no Figma.
2. Crie seis páginas com os nomes indicados acima.
3. Abra uma pasta do pacote e arraste os arquivos `.svg` correspondentes para o canvas da página equivalente (ou use *File → Place image* / o fluxo de importação disponível na sua versão).
4. Os SVGs preservam formas e textos vetoriais em grande parte editáveis. Pode ser necessário ajustar fonte, camadas e alinhamentos após importar.
5. Nas páginas Mobile e Desktop, renomeie os Frames de acordo com cada SVG e organize-os lado a lado.
6. Na página Protótipo, copie as telas finais (como Frames) e use **Prototype → On click → Navigate to** para conectá-las.
7. Para modais use **Open overlay**; para variantes use **Change to**; para transições suaves, selecione **Smart Animate** (por exemplo 200 ms).

**Limitação importante:** SVG não transporta Auto Layout, componentes nativos, variantes, propriedades ou interações do Figma. As telas são pontos de partida visuais editáveis, e o HTML anexado é a demonstração funcional independente. Este pacote não é um arquivo `.fig` nativo.

## Ligações sugeridas no Figma

| Origem | Ação | Destino |
|---|---|---|
| M01 Login | Entrar como universitário | M02 Painel Universitário |
| M01 Login | Entrar como motorista | M06 Painel Motorista |
| M01 Login | Entrar como administrador | D01 Painel ADM |
| M02 Painel Universitário | Ver rota completa | M03 Consulta Automática |
| M03 Consulta Automática | Consulta manual | M04 Consulta Manual |
| M02 Painel Universitário | Avisos | M05 Avisos |
| M06 Painel Motorista | Registrar ocorrência | M07 Registrar Ocorrência |
| M07 Registrar Ocorrência | Registrar | E03 Confirmação |
| D01 Painel ADM | Cadastros | D02 Cadastros |
| D01 Painel ADM | Gerenciar rotas | D03 Configurar Rotas |
| D03 Configurar Rotas | Redistribuir | D04 Redistribuir |
| D04 Redistribuir | Salvar | E03 Confirmação |
| D01 Painel ADM | Avisos | D05 Avisos ADM |
| D01 Painel ADM | Ocorrências | D06 Ocorrências ADM |

## Escopo e fidelidade

A fonte original apresenta os perfis universitário, administrador e motorista; cadastros, consulta de rotas, redistribuição por data, avisos e ocorrências. Os dados e horários exibidos são fictícios, usando principalmente 04/11/2026 e 05/11/2026 como datas de demonstração. Sem autenticação, API ou persistência real.

Algumas telas e estados adicionais foram criados como **representações visuais propostas**, especialmente exemplos de mensagens de erro, carregamento, confirmação e exclusão. Isso não significa que a implementação HTML de origem tenha esses estados exatamente como representados.
