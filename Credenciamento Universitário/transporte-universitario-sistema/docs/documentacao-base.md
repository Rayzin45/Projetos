# Documentação do Sistema de Transporte Universitário

## 1. Visão Geral do Projeto

### 1.1 Ideia base

Desenvolver uma plataforma web para auxiliar universitários na organização e no acesso às informações relacionadas ao transporte universitário, centralizando dados que normalmente ficam distribuídos em diferentes meios de comunicação.

O sistema deverá ser responsivo, permitindo sua utilização em smartphones, notebooks, computadores e telas maiores.

Como evolução futura, poderá ser desenvolvida uma versão móvel em formato de aplicativo.

### 1.2 Problema

Informações relacionadas ao transporte universitário, como horários, locais de embarque e desembarque, alterações, avisos e dias de funcionamento, podem ficar dispersas em grupos de mensagens ou outros canais de comunicação.

A proposta do sistema é reunir essas informações em um único ambiente, facilitando a comunicação entre universitários, administradores e motoristas.

### 1.3 Objetivo geral

Desenvolver uma plataforma web responsiva que centralize informações e serviços relacionados ao transporte universitário, permitindo o gerenciamento e a consulta de horários, avisos, calendário, locais de embarque e desembarque, usuários e suporte.

### 1.4 Objetivos específicos

- Centralizar as informações sobre o transporte universitário.
- Facilitar o acesso dos universitários aos horários de embarque e saída.
- Disponibilizar avisos e alterações importantes.
- Organizar os locais de embarque e desembarque.
- Permitir que administradores gerenciem usuários e informações do transporte.
- Disponibilizar uma área específica para motoristas.
- Disponibilizar um canal de suporte aos universitários.
- Permitir futuras funcionalidades de networking entre universitários.

---

## 2. Escopo do Sistema

### 2.1 Escopo inicial

O sistema deverá contemplar inicialmente:

- Autenticação de usuários.
- Cadastro de administradores.
- Cadastro de universitários.
- Cadastro de motoristas.
- Gerenciamento de horários.
- Gerenciamento de rotas e locais de embarque/desembarque.
- Calendário de dias úteis e feriados.
- Quadro de avisos.
- Área de suporte.
- Controle de veículos.
- Controle de acesso conforme o tipo de usuário.

### 2.2 Funcionalidades futuras

As seguintes funcionalidades poderão ser desenvolvidas após a conclusão do núcleo principal do sistema:

- Aplicativo móvel.
- Área de networking.
- Divulgação de vagas de emprego.
- Divulgação de cursos e especializações.
- Espaços separados por curso.
- Divulgação de trabalhos profissionais.
- Divulgação de projetos e ideias.
- Status do transporte em tempo real.
- Rastreamento do veículo, caso futuramente exista infraestrutura para isso.

---

## 3. Atores do Sistema

### 3.1 Administrador

Responsável pelo gerenciamento geral da plataforma.

Principais responsabilidades:

- Gerenciar universitários.
- Gerenciar motoristas.
- Gerenciar veículos.
- Gerenciar horários.
- Gerenciar rotas e pontos.
- Gerenciar calendário.
- Publicar e remover avisos.
- Visualizar dados dos universitários.
- Atender solicitações de suporte.

### 3.2 Universitário

Usuário que utiliza o transporte e consulta as informações disponibilizadas pela plataforma.

Principais ações:

- Consultar suas informações.
- Consultar horários.
- Consultar avisos.
- Consultar calendário.
- Consultar locais de embarque e desembarque.
- Consultar informações da rota.
- Solicitar suporte.

### 3.3 Motorista

Usuário responsável pelo transporte dos universitários.

Principais ações propostas:

- Consultar horários atribuídos.
- Consultar rota.
- Consultar pontos de embarque e desembarque.
- Consultar informações do veículo atribuído.
- Informar atrasos ou ocorrências.
- Visualizar comunicados administrativos.
- Entrar em contato com a administração quando necessário.

---

## 4. Requisitos Funcionais

### RF01 — Autenticação

O sistema deve permitir que usuários cadastrados realizem login utilizando e-mail e senha.

### RF02 — Controle de acesso

O sistema deve identificar o tipo de usuário autenticado e disponibilizar apenas as funcionalidades permitidas para seu perfil.

### RF03 — Cadastro de administradores

O sistema deve permitir o cadastro de usuários administradores conforme as regras de autorização definidas para a plataforma.

### RF04 — Cadastro de universitários

O sistema deve permitir que o administrador cadastre universitários.

### RF05 — Gerenciamento de universitários

O administrador deve poder consultar, atualizar, ativar, desativar e remover universitários quando necessário.

### RF06 — Cadastro de motoristas

O sistema deve permitir que o administrador cadastre motoristas.

### RF07 — Gerenciamento de motoristas

O administrador deve poder consultar e atualizar as informações dos motoristas cadastrados.

### RF08 — Cadastro de veículos

O sistema deve permitir que o administrador registre os veículos utilizados no transporte.

### RF09 — Gerenciamento de horários

O administrador deve poder cadastrar, alterar e remover horários de embarque, saída e retorno.

### RF10 — Consulta de horários

Universitários e motoristas devem poder consultar os horários relacionados às suas rotas.

### RF11 — Gerenciamento de rotas

O administrador deve poder cadastrar, alterar e remover rotas.

### RF12 — Gerenciamento de pontos

O administrador deve poder cadastrar e organizar os locais de embarque e desembarque pertencentes a uma rota.

### RF13 — Consulta de rotas

Universitários e motoristas devem poder visualizar as informações da rota correspondente.

### RF14 — Quadro de avisos

O sistema deve permitir que o administrador publique avisos para os usuários.

### RF15 — Consulta de avisos

Universitários e motoristas devem poder visualizar os avisos publicados.

### RF16 — Calendário

O sistema deve disponibilizar um calendário contendo feriados, dias úteis e outras datas relevantes para o funcionamento do transporte.

### RF17 — Gerenciamento do calendário

O administrador deve poder adicionar, editar e remover eventos do calendário.

### RF18 — Suporte

O sistema deve permitir que universitários enviem solicitações de suporte.

### RF19 — Gerenciamento do suporte

O administrador deve poder visualizar, responder e alterar o status das solicitações de suporte.

### RF20 — Ocorrências do motorista

O sistema poderá permitir que motoristas informem atrasos, indisponibilidades ou outras ocorrências relacionadas ao transporte.

---

## 5. Requisitos Não Funcionais

### RNF01 — Responsividade

A interface deve adaptar-se a smartphones, tablets, notebooks, computadores e telas maiores.

### RNF02 — Usabilidade

A interface deve ser simples e permitir que as principais informações, como horários e avisos, sejam encontradas com facilidade.

### RNF03 — Segurança de senhas

As senhas dos usuários não devem ser armazenadas em texto puro. Deve ser utilizado um algoritmo apropriado de hash de senha.

### RNF04 — Autorização

O sistema deve impedir que usuários acessem funcionalidades que não pertencem ao seu perfil.

### RNF05 — Comunicação segura

Em ambiente de produção, a comunicação entre cliente e servidor deverá utilizar HTTPS.

### RNF06 — Validação de dados

Dados recebidos pelo backend devem ser validados antes de serem processados ou armazenados.

### RNF07 — Banco de dados

O sistema deverá utilizar PostgreSQL como banco de dados relacional.

### RNF08 — Compatibilidade

A aplicação web deverá funcionar nas versões atuais dos principais navegadores modernos.

### RNF09 — Manutenibilidade

O código deverá possuir uma organização que permita manutenção e evolução das funcionalidades.

### RNF10 — Backup

Em produção, deverão existir procedimentos de backup dos dados importantes do sistema.

---

## 6. Regras de Negócio

As regras abaixo são propostas iniciais e deverão ser revisadas durante o desenvolvimento.

### RN01

Somente usuários cadastrados e autorizados poderão acessar as áreas internas do sistema.

### RN02

Somente administradores poderão gerenciar permanentemente horários, calendário, usuários, veículos e rotas.

### RN03

Universitários poderão consultar informações, mas não poderão modificar dados administrativos.

### RN04

Motoristas somente poderão acessar informações relacionadas às funções permitidas ao perfil de motorista.

### RN05

Cada ponto de uma rota deverá possuir uma ordem para indicar a sequência de embarque ou desembarque.

### RN06

Avisos deverão possuir identificação do responsável pela publicação e data de criação.

### RN07

Solicitações de suporte deverão possuir um status, como `aberto`, `em atendimento` ou `resolvido`.

### RN08

Um veículo deverá possuir uma capacidade máxima cadastrada.

---

## 7. Módulos do Sistema

### 7.1 Módulo de autenticação

Responsável por:

- Login.
- Logout.
- Controle de sessão ou token.
- Recuperação de senha, caso implementada.
- Controle de permissões.

### 7.2 Módulo administrativo

Responsável pelo gerenciamento de:

- Universitários.
- Motoristas.
- Veículos.
- Rotas.
- Pontos.
- Horários.
- Calendário.
- Avisos.
- Suporte.

### 7.3 Módulo do universitário

Responsável pela apresentação de:

- Perfil do universitário.
- Horários.
- Rota.
- Pontos de embarque e desembarque.
- Avisos.
- Calendário.
- Suporte.

### 7.4 Módulo do motorista

Responsável pela apresentação de:

- Perfil do motorista.
- Horários.
- Rotas.
- Pontos.
- Veículo atribuído.
- Avisos.
- Registro de ocorrências, caso implementado.

### 7.5 Módulo de networking — Futuro

Poderá disponibilizar:

- Vagas de emprego.
- Cursos e especializações.
- Comunidades divididas por curso.
- Divulgação de trabalhos.
- Divulgação de projetos e ideias.

---

## 8. MVP — Produto Mínimo Viável

Para evitar que o projeto tenha um escopo muito grande inicialmente, recomenda-se que a primeira versão tenha foco nas funcionalidades essenciais do transporte.

### Funcionalidades do MVP

1. Login.
2. Cadastro e gerenciamento de universitários.
3. Cadastro e gerenciamento de motoristas.
4. Cadastro básico de veículos.
5. Cadastro de rotas.
6. Cadastro de pontos de embarque/desembarque.
7. Cadastro e consulta de horários.
8. Quadro de avisos.
9. Calendário.
10. Área básica de suporte.
11. Controle de acesso por perfil.

### Fora do MVP

- Networking.
- Aplicativo móvel nativo.
- Rastreamento em tempo real.
- Recursos sociais avançados.

---

## 9. Tecnologias

### 9.1 Frontend

- HTML.
- CSS.
- JavaScript.
- Navegador web.

O frontend será responsável pela interface e interação do usuário com a plataforma.

### 9.2 Backend

- Node.js.
- JavaScript.

O backend será responsável pelas regras de negócio, autenticação, validação, comunicação com o banco de dados e disponibilização da API.

### 9.3 Banco de dados

- PostgreSQL.

O PostgreSQL será utilizado para armazenar usuários, universitários, motoristas, veículos, rotas, horários, avisos, calendário e solicitações de suporte.

---

## 10. Arquitetura Inicial

Uma arquitetura cliente-servidor poderá ser utilizada.

```text
Usuário
   |
   v
Frontend
HTML + CSS + JavaScript
   |
   | HTTP / JSON
   v
API REST
Node.js
   |
   v
Regras de negócio
   |
   v
PostgreSQL
```

Uma possível organização do backend é:

```text
Request
   |
   v
Routes
   |
   v
Controllers
   |
   v
Services
   |
   v
Repositories
   |
   v
PostgreSQL
```

Essa organização é uma proposta de evolução da arquitetura e poderá ser adaptada conforme o tamanho do projeto.

---

## 11. Modelagem Inicial do Banco de Dados

A modelagem abaixo é uma proposta inicial e deverá ser refinada por meio de um DER.

### Usuário

```text
USUARIO
- id
- nome
- email
- senha_hash
- tipo_usuario
- ativo
- criado_em
- atualizado_em
```

### Universitário

```text
UNIVERSITARIO
- id
- usuario_id
- curso
- instituicao
- telefone
```

### Motorista

```text
MOTORISTA
- id
- usuario_id
- telefone
```

### Veículo

```text
VEICULO
- id
- placa
- modelo
- capacidade
- ativo
```

### Rota

```text
ROTA
- id
- nome
- motorista_id
- veiculo_id
- ativa
```

### Ponto

```text
PONTO
- id
- rota_id
- nome
- endereco
- ordem
```

### Horário

```text
HORARIO
- id
- rota_id
- tipo
- horario
```

### Aviso

```text
AVISO
- id
- titulo
- mensagem
- criado_por
- criado_em
- atualizado_em
```

### Calendário

```text
CALENDARIO
- id
- data
- descricao
- tipo
```

### Suporte

```text
SUPORTE
- id
- usuario_id
- assunto
- mensagem
- status
- criado_em
- atualizado_em
```

---

## 12. Relacionamentos Iniciais

Alguns relacionamentos que deverão ser considerados no DER:

```text
USUARIO 1 ---- 0..1 UNIVERSITARIO

USUARIO 1 ---- 0..1 MOTORISTA

MOTORISTA 1 ---- N ROTA

VEICULO 1 ---- N ROTA

ROTA 1 ---- N PONTO

ROTA 1 ---- N HORARIO

USUARIO 1 ---- N SUPORTE

USUARIO 1 ---- N AVISO
```

Os relacionamentos deverão ser revisados conforme as regras finais do projeto. Por exemplo, poderá ser necessário permitir vários motoristas ou veículos associados a uma rota em períodos diferentes.

---

## 13. API REST — Planejamento Inicial

Os endpoints abaixo são apenas uma proposta inicial para orientar o desenvolvimento.

### Autenticação

```text
POST /api/auth/login
POST /api/auth/logout
```

### Universitários

```text
GET    /api/universitarios
GET    /api/universitarios/:id
POST   /api/universitarios
PUT    /api/universitarios/:id
DELETE /api/universitarios/:id
```

### Motoristas

```text
GET    /api/motoristas
GET    /api/motoristas/:id
POST   /api/motoristas
PUT    /api/motoristas/:id
DELETE /api/motoristas/:id
```

### Veículos

```text
GET    /api/veiculos
POST   /api/veiculos
PUT    /api/veiculos/:id
DELETE /api/veiculos/:id
```

### Rotas

```text
GET    /api/rotas
GET    /api/rotas/:id
POST   /api/rotas
PUT    /api/rotas/:id
DELETE /api/rotas/:id
```

### Horários

```text
GET    /api/horarios
POST   /api/horarios
PUT    /api/horarios/:id
DELETE /api/horarios/:id
```

### Avisos

```text
GET    /api/avisos
POST   /api/avisos
PUT    /api/avisos/:id
DELETE /api/avisos/:id
```

### Calendário

```text
GET    /api/calendario
POST   /api/calendario
PUT    /api/calendario/:id
DELETE /api/calendario/:id
```

### Suporte

```text
GET    /api/suporte
GET    /api/suporte/:id
POST   /api/suporte
PUT    /api/suporte/:id
```

---

## 14. Segurança

A documentação original prevê monitoramento, firewall, atualizações e criptografia. Esses pontos deverão ser detalhados durante a implementação.

Medidas recomendadas para o projeto:

- Armazenamento de senhas utilizando hash seguro.
- Autenticação de usuários.
- Autorização baseada em perfil.
- HTTPS em produção.
- Validação e sanitização dos dados recebidos.
- Proteção contra SQL Injection.
- Proteção contra Cross-Site Scripting (XSS).
- Limitação de tentativas de autenticação quando necessário.
- Variáveis de ambiente para dados sensíveis de configuração.
- Atualização periódica das dependências.
- Logs de operações administrativas relevantes.
- Backups do banco de dados.
- Monitoramento da aplicação em produção.
- Configuração adequada de firewall na infraestrutura utilizada.

> **Observação:** o item "CID" presente na documentação inicial não possui definição suficiente para ser especificado nesta versão. Deve-se esclarecer a que conceito ou tecnologia o termo se refere antes de incluí-lo como requisito de segurança.

---

## 15. Diagramas Recomendados

### 15.1 Diagrama de Casos de Uso

Deverá representar as interações entre:

- Administrador.
- Universitário.
- Motorista.
- Sistema.

Exemplos de casos de uso:

- Realizar login.
- Consultar horário.
- Gerenciar horário.
- Consultar rota.
- Publicar aviso.
- Consultar aviso.
- Gerenciar calendário.
- Solicitar suporte.
- Gerenciar universitários.
- Gerenciar motoristas.

### 15.2 DER — Diagrama Entidade-Relacionamento

Deverá representar as entidades do PostgreSQL e seus relacionamentos.

### 15.3 Diagrama de Arquitetura

Deverá representar a comunicação entre frontend, backend/API e banco de dados.

### 15.4 Diagramas futuros

Conforme a necessidade da disciplina ou do desenvolvimento, também poderão ser produzidos:

- Diagrama de classes.
- Diagrama de sequência.
- Diagrama de atividades.

---

## 16. Testes

O sistema deverá possuir uma estratégia de testes proporcional ao desenvolvimento.

### 16.1 Testes unitários

Utilizados para verificar funções e regras de negócio individualmente.

Exemplos:

- Validação de dados.
- Regras de usuários.
- Regras de horários.
- Controle de permissões.

### 16.2 Testes de integração

Utilizados para verificar a integração entre componentes.

Exemplos:

- API e PostgreSQL.
- Login e banco de dados.
- Cadastro de usuário e persistência dos dados.

### 16.3 Testes de interface

Verificar:

- Responsividade.
- Navegação.
- Formulários.
- Exibição de erros.
- Diferentes tamanhos de tela.

### 16.4 Testes de segurança

Verificar, entre outros pontos:

- Acesso indevido a rotas administrativas.
- Validação de entradas.
- Autenticação.
- Controle de permissões.

---

## 17. Tratamento de Erros

O sistema deverá apresentar mensagens adequadas quando ocorrerem situações como:

- E-mail ou senha inválidos.
- Usuário não encontrado.
- Usuário sem permissão.
- Dados obrigatórios ausentes.
- Horário inexistente.
- Rota inexistente.
- Erro de conexão com o servidor.
- Erro interno do sistema.

O backend não deverá retornar ao usuário informações técnicas sensíveis sobre a infraestrutura.

---

## 18. Logs e Monitoramento

Em ambiente de produção, recomenda-se registrar eventos importantes, principalmente:

- Falhas de autenticação relevantes.
- Erros internos.
- Criação e alteração de registros administrativos.
- Indisponibilidade de serviços.

Logs não devem armazenar senhas ou outras credenciais sensíveis.

---

## 19. Deploy e Manutenção

Antes da publicação do sistema deverão ser definidos:

- Ambiente de hospedagem do frontend.
- Ambiente de execução do Node.js.
- Hospedagem do PostgreSQL.
- Configuração de domínio.
- HTTPS.
- Variáveis de ambiente.
- Processo de backup.
- Processo de atualização.
- Monitoramento.

---

## 20. Organização Sugerida do Desenvolvimento

### Etapa 1 — Planejamento

- Refinar requisitos.
- Definir regras de negócio.
- Definir o MVP.
- Criar casos de uso.

### Etapa 2 — Modelagem

- Criar DER.
- Definir tabelas.
- Definir relacionamentos.
- Criar diagrama de arquitetura.

### Etapa 3 — Backend inicial

- Criar projeto Node.js.
- Configurar PostgreSQL.
- Criar estrutura da API.
- Implementar autenticação.
- Implementar controle de acesso.

### Etapa 4 — Funcionalidades principais

- Universitários.
- Motoristas.
- Veículos.
- Rotas.
- Pontos.
- Horários.
- Avisos.
- Calendário.
- Suporte.

### Etapa 5 — Frontend

- Login.
- Painel administrativo.
- Painel do universitário.
- Painel do motorista.
- Responsividade.

### Etapa 6 — Testes

- Testes das regras de negócio.
- Testes da API.
- Testes de integração.
- Testes de interface.
- Testes de permissões.

### Etapa 7 — Deploy

- Configurar ambiente de produção.
- Configurar banco de dados.
- Configurar HTTPS.
- Publicar aplicação.
- Configurar backup e monitoramento.

### Etapa 8 — Evolução

Após o MVP estar funcional, avaliar:

- Networking.
- Aplicativo móvel.
- Rastreamento.
- Notificações.
- Novos recursos solicitados pelos usuários.

---

## 21. Pontos Pendentes de Definição

Algumas decisões não estão definidas na documentação original e deverão ser discutidas pela equipe antes da implementação completa:

- Quem poderá criar novos administradores.
- Como será realizado o cadastro inicial dos universitários.
- Se um universitário poderá pertencer a mais de uma rota.
- Se uma rota poderá possuir mais de um motorista.
- Se motoristas poderão alterar horários ou apenas informar ocorrências.
- Como serão definidos os dias em que o transporte estará disponível.
- Quais informações pessoais dos universitários realmente precisarão ser armazenadas.
- Como funcionará o atendimento de suporte.
- Se avisos serão enviados para todos ou para grupos específicos.
- Se haverá notificações por e-mail ou somente dentro da plataforma.
- O significado do item "CID" citado na seção original de segurança.

---

## 22. Resumo do Fluxo Principal

```text
Administrador
    |
    +--> Cadastra universitários
    +--> Cadastra motoristas
    +--> Cadastra veículos
    +--> Configura rotas e pontos
    +--> Configura horários
    +--> Atualiza calendário
    +--> Publica avisos
    +--> Gerencia suporte

Universitário
    |
    +--> Realiza login
    +--> Consulta horários
    +--> Consulta rota/pontos
    +--> Consulta calendário
    +--> Consulta avisos
    +--> Solicita suporte

Motorista
    |
    +--> Realiza login
    +--> Consulta horários
    +--> Consulta rota/pontos
    +--> Consulta veículo
    +--> Consulta avisos
    +--> Informa ocorrências
```

---

## 23. Conclusão

A plataforma tem como foco principal centralizar e organizar as informações relacionadas ao transporte universitário. A primeira versão deverá priorizar as funcionalidades essenciais de transporte, usuários, horários, rotas, calendário, avisos e suporte.

Funcionalidades adicionais, principalmente networking e aplicativo móvel, deverão ser consideradas como evoluções após a validação e estabilização do MVP.

Esta documentação representa uma expansão da ideia e do levantamento inicial do projeto. Requisitos, regras de negócio, modelagem de dados, endpoints e decisões arquiteturais propostas deverão ser revisados e validados pela equipe durante as próximas etapas do desenvolvimento.
