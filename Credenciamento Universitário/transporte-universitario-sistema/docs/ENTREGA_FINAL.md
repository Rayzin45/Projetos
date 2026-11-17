# Entrega final — Sistema de Transporte Universitário

## Sistema implementado e integrado

Foi desenvolvido um MVP acadêmico com frontend responsivo em **HTML, CSS e JavaScript**, backend em **Node.js/Express** e banco de dados relacional **PostgreSQL**. As telas consomem a API REST por HTTP/JSON. O backend executa as validações e regras de autorização e utiliza consultas SQL parametrizadas e transações. Os dados não são armazenados apenas no navegador: cadastros, rotas, avisos, calendário, suporte e ocorrências são persistidos no PostgreSQL.

## Funcionalidades prioritárias

- **HU01–HU02:** autenticação com e-mail/senha e controle de acesso no servidor por perfil.
- **HU03–HU05:** cadastros administrativos de universitários, universidades e veículos.
- **HU06–HU07:** configuração de rotas por data, atribuição de veículos/motoristas, reordenação de universidades e redistribuição entre ônibus.
- **HU08–HU09:** consulta automática pelo vínculo do estudante, consulta manual por data/universidade e visualização de horários previstos.
- **HU10:** publicação e consulta de avisos.
- **HU11:** registro de ocorrências por motorista e consulta administrativa.

Funcionalidades complementares exigidas pela documentação 2.0: **gerenciamento de motoristas, calendário e suporte básico**.

## Como executar

1. Instalar e abrir Docker Desktop.
2. Extrair o ZIP e abrir o terminal na pasta do projeto.
3. Executar `docker compose up --build -d`.
4. Acessar `http://localhost:3000`.
5. Selecionar e preencher uma conta de demonstração, ou consultar as credenciais no `README.md`.

No Windows, também é possível executar `INICIAR-WINDOWS.bat` com o Docker Desktop aberto.

## Acesso à demonstração

Ambiente **local**, sem hospedagem pública. Contas de teste: administrador (`admin@transporte.local`), universitário (`aluno@transporte.local`) e motorista (`motorista@transporte.local`). As senhas de teste estão no `README.md`. Para uma apresentação guiada, usar `docs/DEMONSTRACAO.md`.

## Como validar a integração

- Endpoint `GET /api/health` retorna estado do banco.
- CRUD e configuração de rotas são realizados no frontend e armazenados no PostgreSQL.
- Recarregar a página após salvar confirma persistência.
- Os testes unitários verificam hash de senha, datas, horários e unicidade de alocação.
- Os testes de integração HTTP verificam login, papéis e atualização de rotas, quando executados com PostgreSQL disponível.

## Limitações conhecidas

Não há GPS/rastreamento em tempo real, otimização automática de trajetos, notificações por e-mail, recuperação de senha, histórico detalhado de alterações nem aplicativo móvel nativo. As paradas da rota representam **universidades**. A instalação inclui **credenciais e dados fictícios**, somente para apresentação acadêmica.

O código **ainda não foi executado com PostgreSQL neste ambiente de geração**; a instalação completa e os testes de integração devem ser realizados no computador do usuário. Consulte `docs/LIMITACOES.md` para os detalhes técnicos e de segurança. Nenhum link público de demonstração foi implantado.
