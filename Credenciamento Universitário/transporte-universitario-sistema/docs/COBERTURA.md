# Rastreabilidade — MVP integrado

Base: `documentacao_transporte_universitario-2.0(1).md` e backlog priorizado HU01–HU11.

| História | Funcionalidade | Interface | API / Banco | Situação |
|---|---|---|---|---|
| HU01 | Login | Tela inicial | Sessões PostgreSQL; hash scrypt | Implementado |
| HU02 | Permissões | Menus por perfil | Middleware de autenticação/autorização | Implementado |
| HU03 | Universitários | Cadastros | `/api/students`; `users`, `students` | Implementado |
| HU04 | Universidades | Cadastros | `/api/universities`; `universities` | Implementado |
| HU05 | Veículos | Cadastros | `/api/vehicles`; `vehicles` | Implementado |
| HU06 | Rotas por data | Gerenciar rotas | `route_plans` + `route_stops` por data | Implementado |
| HU07 | Redistribuição | Mover, ordenar, salvar | `PUT /api/routes/day/:date` em transação | Implementado |
| HU08 | Consulta da rota | Rota automática/manual | `GET /api/routes/mine`, `/lookup` | Implementado |
| HU09 | Horários previstos | Detalhes da rota | `departure_time` por veículo/data | Implementado |
| HU10 | Avisos | Comunicados | `/api/notices`; `notices` | Implementado |
| HU11 | Ocorrências | Formulário do motorista | `/api/incidents`; `incidents` | Implementado |

## Funcionalidades complementares da documentação 2.0

- Cadastro e gerenciamento de **motoristas**: `/api/drivers`.
- **Calendário** de feriados, suspensões e funcionamento: `/api/calendar`.
- **Suporte** dos universitários, com retorno/status pelo administrador: `/api/support`.
- Relação com pontos: conforme o refinamento do MVP, **os pontos das rotas são as universidades**, não locais independentes de embarque. Endereços/referências são guardados em `universities.address`.
- Cadastro inicial de administradores: **somente via seed**, não há endpoint de criação de administradores nesta entrega.

## O que ficou fora da versão

Rastreamento GPS e horário real, mapas/geolocalização, push notifications, rotas otimizadas automaticamente, upload de arquivos, recuperação de senha via e-mail, aplicativo nativo, networking, permissões administrativas refinadas e histórico de versões de rotas.
