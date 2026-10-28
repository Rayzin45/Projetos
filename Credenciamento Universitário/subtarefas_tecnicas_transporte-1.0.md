# Subtarefas técnicas — Sistema de Transporte Universitário

**Disciplina:** Desenvolvimento Web  
**Etapa:** 2 — Backlog e organização  
**Prazo da etapa:** 28/10/2026  
**Responsáveis:** A definir  
**Status inicial:** A fazer

> As subtarefas são propostas de planejamento para o MVP. Devem ser cadastradas como subtarefas das histórias HU01–HU11 no Jira. Os endpoints e a modelagem são decisões técnicas a validar, não especificações já aprovadas.

## HU01 — Realizar login | Must Have

- **ST01.1 — Modelar credenciais e perfis:** definir os campos de usuário e armazenamento de hash de senha no PostgreSQL.
- **ST01.2 — Implementar autenticação no backend:** criar endpoint de login em Node.js e verificar credenciais com hash seguro.
- **ST01.3 — Implementar sessão e logout:** estabelecer mecanismo de sessão e encerramento de acesso.
- **ST01.4 — Criar tela de login:** desenvolver formulário responsivo com HTML, CSS e JavaScript.
- **ST01.5 — Integrar login à API:** enviar credenciais, tratar respostas e encaminhar o usuário à área adequada.
- **ST01.6 — Testar autenticação:** cobrir credenciais válidas/inválidas, campos vazios, logout e persistência de sessão.

## HU02 — Restringir acesso por perfil | Must Have

- **ST02.1 — Definir matriz de permissões:** documentar ações permitidas para Administrador, Universitário e Motorista.
- **ST02.2 — Implementar middleware de autorização:** validar autenticação e perfil nas rotas protegidas da API.
- **ST02.3 — Adaptar navegação por perfil:** exibir opções adequadas a cada usuário no frontend.
- **ST02.4 — Proteger páginas e operações:** impedir acesso indevido, inclusive por URL ou requisição direta.
- **ST02.5 — Testar permissões:** verificar cenários autorizados e não autorizados para os três perfis.

## HU03 — Cadastrar universitários | Must Have

- **ST03.1 — Modelar dados do universitário:** definir relacionamento com usuário e universidade no PostgreSQL.
- **ST03.2 — Criar API de cadastro e consulta:** implementar operações administrativas para cadastrar e listar universitários.
- **ST03.3 — Validar dados:** verificar obrigatoriedade, formato de e-mail e unicidade do e-mail.
- **ST03.4 — Criar formulário e listagem:** construir telas administrativas responsivas.
- **ST03.5 — Integrar frontend e API:** enviar cadastro e apresentar registros persistidos.
- **ST03.6 — Testar cadastro:** verificar dados válidos, inválidos, duplicados e bloqueio a perfis não autorizados.

## HU04 — Cadastrar universidades | Must Have

- **ST04.1 — Modelar universidades:** definir identificador, nome e localização/ponto de atendimento.
- **ST04.2 — Criar API de cadastro e listagem:** persistir e consultar universidades.
- **ST04.3 — Validar duplicidade:** estabelecer regra de identificação e impedir cadastros equivalentes conforme essa regra.
- **ST04.4 — Criar formulário e lista:** desenvolver interface administrativa.
- **ST04.5 — Integrar seleção às rotas:** disponibilizar universidades cadastradas para HU06 e HU07.
- **ST04.6 — Testar cadastro e reutilização:** confirmar que uma universidade não fica vinculada permanentemente a um ônibus.

## HU05 — Cadastrar veículos | Must Have

- **ST05.1 — Modelar veículos:** definir identificação, placa, capacidade e estado de disponibilidade, se adotado.
- **ST05.2 — Criar API de cadastro e listagem:** salvar e consultar veículos no PostgreSQL.
- **ST05.3 — Validar placa e capacidade:** impedir placas duplicadas e capacidades não positivas ou não inteiras.
- **ST05.4 — Criar formulário e listagem:** desenvolver interface administrativa.
- **ST05.5 — Integrar veículos às rotas:** permitir selecionar veículos cadastrados em HU06 e HU07.
- **ST05.6 — Testar cadastro:** verificar persistência, validações e permissões.

## HU06 — Configurar rotas por data | Must Have

- **ST06.1 — Modelar configuração diária:** separar rota de referência, configuração por data e sequência de universidades, conforme decisões do domínio.
- **ST06.2 — Definir regras de configuração:** validar data, veículo, universidades selecionadas, ordem e horário previsto.
- **ST06.3 — Criar API de configuração e consulta:** salvar e recuperar rotas de uma data no PostgreSQL.
- **ST06.4 — Desenvolver tela de configuração:** selecionar data, ônibus, universidades, ordem e horário previsto.
- **ST06.5 — Integrar formulário e API:** persistir e recuperar a configuração registrada.
- **ST06.6 — Testar configuração diária:** verificar salvamento, consulta, campos inválidos e isolamento entre datas.

## HU07 — Redistribuir universidades entre veículos | Must Have

- **ST07.1 — Definir regras de redistribuição:** decidir como tratar universidades compartilhadas entre veículos na mesma data e conflitos de configuração.
- **ST07.2 — Implementar atualização transacional:** modificar as associações das universidades entre configurações de veículos, evitando alterações parciais.
- **ST07.3 — Validar ordem e integridade:** garantir sequência consistente e preservar configurações de outras datas.
- **ST07.4 — Criar interface de redistribuição:** permitir remover, adicionar e reordenar universidades entre ônibus.
- **ST07.5 — Integrar interface e API:** salvar alterações e atualizar a visualização.
- **ST07.6 — Testar redistribuição:** verificar mudança entre ônibus, persistência, conflitos e preservação do histórico por data.

## HU08 — Consultar rota do dia | Must Have

- **ST08.1 — Definir consulta por data e universidade:** estabelecer como o sistema identifica o ônibus que atende a instituição do universitário.
- **ST08.2 — Criar API de consulta:** retornar veículo, universidades e ordem de atendimento da configuração da data.
- **ST08.3 — Desenvolver tela de consulta:** exibir rota do dia de forma clara e responsiva.
- **ST08.4 — Tratar ausência de rota:** mostrar mensagem apropriada quando não houver configuração.
- **ST08.5 — Integrar e testar:** verificar consulta por data e atualização após alterações administrativas.

## HU09 — Consultar horário previsto | Must Have

- **ST09.1 — Modelar horário previsto:** associar o horário à configuração de rota da data.
- **ST09.2 — Criar consulta de horário na API:** retornar o horário previsto correspondente à rota consultada.
- **ST09.3 — Exibir horário na interface:** apresentar o horário planejado com identificação da data/rota.
- **ST09.4 — Integrar atualizações:** refletir alterações administrativas na consulta seguinte.
- **ST09.5 — Testar horários:** verificar horário existente, ausente e atualizado, sem confundir previsão com atraso real.

## HU10 — Publicar e consultar avisos | Should Have

- **ST10.1 — Modelar avisos:** definir título, mensagem, autor e data de publicação.
- **ST10.2 — Criar API de publicação e consulta:** permitir publicação por administrador e leitura pelos perfis autorizados.
- **ST10.3 — Validar conteúdo e permissões:** exigir campos necessários e impedir publicação não autorizada.
- **ST10.4 — Criar telas de publicação e leitura:** formulário administrativo e listagem de avisos.
- **ST10.5 — Integrar frontend e API:** publicar e consultar avisos persistidos.
- **ST10.6 — Testar avisos:** verificar permissões, persistência após reinício e exibição correta.

## HU11 — Registrar ocorrência do motorista | Should Have

- **ST11.1 — Modelar ocorrências:** definir motorista, rota/configuração atribuída, data, tipo e descrição.
- **ST11.2 — Definir vínculo do motorista à rota:** especificar como comprovar que a rota pertence ao motorista naquela data.
- **ST11.3 — Criar API de registro e consulta:** permitir registro pelo motorista e consulta pelo administrador.
- **ST11.4 — Validar ocorrência e autorização:** verificar campos, vínculo e impedir alterações automáticas da rota.
- **ST11.5 — Criar telas de registro e acompanhamento:** formulário do motorista e listagem administrativa.
- **ST11.6 — Integrar e testar:** verificar persistência, perfis, vínculo com a rota e ausência de mudança automática da configuração.

---

## Tarefas técnicas transversais (não duplicar em cada história)

- **TT01 — Criar repositório Git:** configurar README inicial, `.gitignore` e convenção de commits/branches.
- **TT02 — Preparar frontend:** estrutura HTML/CSS/JavaScript e padrão de componentes/telas.
- **TT03 — Preparar backend:** projeto Node.js, organização de rotas, controllers, services e acesso a dados na medida necessária.
- **TT04 — Preparar PostgreSQL:** conexão, migrações/scripts SQL e dados fictícios de desenvolvimento.
- **TT05 — Avaliar Docker Compose:** opcionalmente executar Node.js e PostgreSQL em containers, com volumes e variáveis de ambiente; não bloquear o MVP se não houver tempo.
- **TT06 — Definir padrão de erros e validações:** respostas HTTP, mensagens e tratamento seguro de falhas.
- **TT07 — Configurar ambiente e documentação:** `.env.example`, instruções de execução e pré-requisitos.
- **TT08 — Executar testes integrados e preparar demonstração:** testar fluxo completo, registrar limitações e reunir evidências para 18/11.

## Sequência sugerida

1. **Fundação:** TT01–TT04, HU01 e HU02.
2. **Cadastros:** HU04, HU05 e HU03 (podem avançar em paralelo após as decisões de modelagem).
3. **Núcleo de transporte:** HU06 e HU07.
4. **Consultas:** HU08 e HU09.
5. **Comunicação e operação:** HU10 e HU11.
6. **Integração e entrega:** TT06–TT08; TT05 se houver tempo e benefício.

## Definição de pronto (DoD)

Uma subtarefa só passa para **Concluída** quando seu resultado foi verificado, o código pertinente está versionado e não há erro conhecido que impeça seu uso no fluxo principal. Uma história só é concluída quando seus critérios de aceitação são demonstráveis, incluindo persistência real e verificação de permissões quando aplicável.

## Pendências de análise que não devem ser assumidas silenciosamente

1. Uma universidade pode ser atendida por mais de um ônibus no mesmo dia?
2. Como é definida a atribuição do motorista a um veículo/rota em cada data?
3. O horário previsto refere-se à saída geral do ônibus, à chegada à universidade ou a ambos?
4. Como o administrador identifica a demanda diária de universitários?
5. A configuração diária substitui uma rota padrão ou é criada a partir dela?

> Essas decisões afetam especialmente HU06–HU09 e HU11 e devem ser registradas antes de fechar a modelagem do banco.
