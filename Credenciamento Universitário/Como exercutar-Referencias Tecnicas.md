# 🚌 Sistema de Transporte Universitário — MVP Integrado

Implementação acadêmica baseada em `documentacao_transporte_universitario-2.0(1).md`, na seleção das histórias **HU01–HU11** e no protótipo visual em HTML fornecido no projeto. **Frontend, backend e PostgreSQL de verdade**, com dados persistidos no banco de dados.

> **Ambiente de demonstração local.** Não existe site público hospedado. O sistema precisa ser executado no computador antes de abrir `http://localhost:3000`. As contas iniciais são fictícias e não podem ser utilizadas em produção.

## 1. Tecnologias e arquitetura

- **Frontend:** HTML5, CSS3 e JavaScript sem framework, responsivo (Grafite `#1E293B`, Âmbar `#F59E0B`).
- **Backend:** Node.js 22+, Express 5, API REST JSON.
- **Banco:** PostgreSQL 16+, com relacionamentos, índices e transações.
- **Autenticação:** senha protegida com `scrypt` + sal aleatório; sessão aleatória de 8 horas via cookie `HttpOnly` (`SameSite=Lax`) e hash do token no PostgreSQL.
- **Autorização:** middleware no backend valida permissões `admin`, `student` e `driver` (não depende somente do menu).
- **Execução:** Docker Compose (recomendado) ou Node + PostgreSQL instalados localmente.

```text
Navegador (HTML/CSS/JS)
       | fetch JSON + cookie de sessão
       v
Node.js / Express (API REST, validação, perfis)
       | consultas SQL parametrizadas / transações
       v
PostgreSQL (usuários, rotas, universidades, veículos,
            avisos, ocorrências, calendário, suporte)
```

## 2. Executar pelo Docker Desktop (mais fácil)

Instale **Docker Desktop** no Windows 11 e deixe-o em execução. Abra o terminal do VS Code na pasta que contém `docker-compose.yml`.

```bash
docker compose up --build -d
```

Abra no navegador: **http://localhost:3000**

- Saúde da API: **http://localhost:3000/api/health** → `{"data":{"status":"ok","database":"connected"}}`.
- Ver logs: `docker compose logs -f app`.
- Parar: `docker compose down`.
- Voltar a iniciar, mantendo os dados: `docker compose up -d`.
- **Apagar tudo, inclusive o banco:** `docker compose down -v` (**irreversível**).

Na primeira inicialização, a aplicação prepara as tabelas e insere dados de exemplo. Docker precisa de acesso à internet na primeira execução para baixar as imagens e as dependências npm.

Se as portas `3000` ou `5432` já estiverem em uso, ajuste o mapeamento em `docker-compose.yml`. Os serviços são publicados apenas no `127.0.0.1` do computador para evitar exposição acidental na rede.

## 3. Executar sem Docker

Pré-requisitos: **Node.js 22+**, **PostgreSQL 16+**, npm, banco `transporte_universitario` e um usuário com permissão para criar tabelas.

1. Copie `.env.example` para `.env` e ajuste `DATABASE_URL` para sua instalação.
2. No PostgreSQL, crie o usuário/banco, por exemplo com uma conta administradora:

```sql
CREATE USER transporte WITH PASSWORD 'transporte_local';
CREATE DATABASE transporte_universitario OWNER transporte;
```

3. Execute na pasta do projeto:

```bash
npm install
npm run db:setup
npm start
```

4. Abra **http://localhost:3000**. O Node carrega automaticamente o arquivo `.env` por meio de `--env-file-if-exists=.env` nos scripts npm.

No **PowerShell** do Windows, basta executar os mesmos comandos acima. O banco precisa estar ligado antes de iniciar `db:setup`.

## 4. Credenciais de demonstração

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | `admin@transporte.local` | `Admin@12345` |
| Universitário | `aluno@transporte.local` | `Aluno@12345` |
| Motorista | `motorista@transporte.local` | `Motorista@12345` |

Na tela de login, os botões de demonstração preenchem essas credenciais; depois clique em **Entrar**. Diferentemente do protótipo anterior, **o login é validado no backend** e os dados permanecem após fechar/reabrir a página.

O arquivo de ambiente/Docker usa `SEED_DEMO=true`. Para iniciar com banco vazio, após criar o primeiro administrador de maneira segura, remova o seed e configure um método de provisionamento apropriado. Não compartilhe credenciais demonstrativas fora do ambiente acadêmico.

### Dados iniciais

- 5 universidades fictícias; 2 ônibus; 1 universitário vinculado à Faculdade A; 1 motorista; 1 administrador.
- Rotas fictícias **para a data local da primeira configuração e o dia seguinte**, com horários e universidades distribuídos entre os ônibus.
- 1 aviso e 1 evento no calendário.
- O seed é **não destrutivo**: não substitui registros existentes. Em reinicializações com `SEED_DEMO=true`, poderá recriar registros de exemplo que tenham sido apagados.

## 5. O que funciona

| Perfil | Funcionalidades |
|---|---|
| Universitário | Login/logout, rota automática por universidade vinculada, consulta manual por data/universidade, horários previstos, avisos, calendário, abertura de suporte e consulta da resposta |
| Administrador | Login/logout, painel de indicadores, CRUD de universitários/motoristas/universidades/veículos, atribuição de motorista por veículo e data, criação e redistribuição de rotas, reordenação de universidades, horários, avisos, calendário, respostas de suporte, consulta de ocorrências |
| Motorista | Login/logout, rota atribuída por data, horário e veículo, comunicados, calendário, registro e histórico de ocorrências |

As operações de CRUD e edição de rotas alteram o **PostgreSQL**, não arrays de memória. A redistribuição é feita em transação com garantia de que uma universidade não apareça em dois ônibus na mesma data.

**Decisão de modelagem:** de acordo com a revisão do projeto, cada parada da rota é uma **universidade**. A posição da universidade determina a ordem de atendimento. Não implementamos pontos independentes de embarque por bairro nesta versão.

## 6. Demonstração para apresentação

O roteiro passo a passo está em **`docs/DEMONSTRACAO.md`**. Sugestão: mostre login com os três perfis, consultas automáticas e manuais, alterações persistentes nas rotas, publicação de avisos, suporte e registro de ocorrências.

Para comprovar a integração, acesse `/api/health`, mostre as chamadas HTTP na aba **Network** do navegador e recarregue a página após criar ou editar um registro.

## 7. Testes

Testes de validação e regras de negócio (não exigem banco):

```bash
npm test
```

Testes reais de integração HTTP com PostgreSQL **requerem a aplicação já executando** e o seed demonstrativo ativo:

```bash
# Linux / macOS
RUN_INTEGRATION=true npm run test:integration
```

No **PowerShell**:

```powershell
$env:RUN_INTEGRATION="true"
npm run test:integration
```

O teste de integração cria temporariamente uma rota em `2099-01-05` e a remove ao final. Não execute os testes de integração com dados reais de produção.

**Nota de verificação do pacote:** o código passou por validação de sintaxe e testes unitários no ambiente de montagem. Não foi possível executar PostgreSQL/Docker e instalar dependências neste ambiente, então **a execução integrada precisa ser validada no seu computador** seguindo os passos acima. Não confunda código integrado com deploy verificado.

## 8. Organização das pastas

```text
transporte-universitario-sistema/
├── public/
│   ├── index.html          # Interface responsiva
│   ├── styles.css          # Design System Grafite + Âmbar
│   └── app.js              # Navegação e comunicação com a API
├── src/
│   ├── app.js              # Express + rotas HTTP + autorização
│   ├── server.js           # Inicialização
│   ├── db.js               # Pool e transações PostgreSQL
│   ├── logic.js            # Hash, validação e regras de rotas
│   └── setup.js            # Criação das tabelas e seed demo
├── db/schema.sql           # Estrutura relacional
├── tests/                  # Testes unitários e de integração
├── docs/
│   ├── documentacao-base.md # Requisitos fornecidos
│   ├── COBERTURA.md        # Rastreabilidade HU01–HU11
│   ├── DEMONSTRACAO.md     # Roteiro para o professor
│   └── LIMITACOES.md       # Limitações e melhorias necessárias
├── .env.example
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 9. Limitações conhecidas

Veja **`docs/LIMITACOES.md`**. Resumo: não há rastreamento em tempo real, otimização automática de rotas, notificações por e-mail, recuperação de senha, relatório histórico, criação de administradores pela interface ou hospedagem pública. Não está preparado para produção sem configuração de HTTPS, tratamento de segredos, backups, observabilidade, proteção de login distribuída e testes end-to-end.

## 10. Próximos passos técnicos

1. Executar com Docker Desktop e testar os três logins.
2. Rodar testes unitários e de integração.
3. Registrar evidências (prints) e link/repositório no Jira.
4. Revisar os casos de uso e corrigir problemas encontrados no ambiente de execução.
5. Somente depois considerar hospedagem, HTTPS e proteção adicional de dados pessoais.

**Referências técnicas:** [Express 5 — arquivos estáticos](https://expressjs.com/en/5x/starter/static-files/), [node-postgres — transações](https://node-postgres.com/features/transactions), [node-postgres — consultas parametrizadas](https://node-postgres.com/features/queries).
