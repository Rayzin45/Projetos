# Roteiro de apresentação — Sistema de Transporte Universitário

**Duração sugerida:** 5 a 7 minutos de slides + 3 a 4 minutos de demonstração, conforme o tempo disponível.  
**Objetivo:** apresentar o problema, o MVP, as decisões técnicas e evidências de integração.

## Slide 1 — Apresentação do projeto

**No slide:** nome do sistema, MVP integrado e tecnologias principais.  
**Mini resumo para falar:** “Desenvolvemos uma plataforma web para organizar informações e operações do transporte universitário. O MVP reúne interface, API e banco de dados, com acesso por três perfis.”

## Slide 2 — Problema e solução

**No slide:** informações dispersas em mensagens; horários, mudanças e avisos difíceis de consultar; centralização em uma plataforma.  
**Mini resumo para falar:** “A proposta nasceu da dificuldade de acompanhar informações do transporte em diferentes canais. O sistema centraliza horários, rotas e comunicados, trazendo mais previsibilidade para os usuários.”

## Slide 3 — Perfis e funcionalidades

**No slide:** universitário, administrador e motorista.  
**Mini resumo para falar:** “Cada perfil possui responsabilidades específicas: o universitário consulta rotas e avisos; o administrador gerencia cadastros e planejamento; o motorista acompanha sua rota e registra ocorrências. As permissões são verificadas no backend.”

## Slide 4 — Diferencial: rotas dinâmicas

**No slide:** comparação entre dois dias com redistribuição de universidades entre ônibus; consulta automática e manual.  
**Mini resumo para falar:** “A distribuição das universidades muda conforme a necessidade de cada data. O administrador define os ônibus, a ordem das universidades e os horários; o universitário consulta a própria rota automaticamente ou escolhe uma data e instituição manualmente.”

## Slide 5 — Arquitetura integrada

**No slide:** HTML/CSS/JS → Node.js/Express → PostgreSQL; sessões, validações e persistência.  
**Mini resumo para falar:** “O navegador envia requisições à API REST, que valida os dados, aplica regras e grava as alterações no PostgreSQL. A separação entre interface, backend e banco permite evoluir cada parte com maior organização.”

## Slide 6 — Interface e design

**No slide:** imagens do protótipo mobile e desktop; paleta Grafite e Âmbar.  
**Mini resumo para falar:** “A interface foi pensada para ser responsiva. No celular, priorizamos a consulta rápida de rota e horário; no desktop, o gerenciamento administrativo. As imagens são do protótipo visual e devem ser complementadas pela aplicação em execução.”

## Slide 7 — Demonstração ao vivo

**No slide:** sequência de login, consulta, redistribuição, persistência e ocorrências.  
**Mini resumo para falar:** “Agora vamos demonstrar o fluxo completo: consultar uma rota como universitário, alterá-la como administrador, confirmar que foi salva no banco e registrar uma ocorrência como motorista.”

**Sequência sugerida:**
1. Abra `http://localhost:3000` e entre como universitário; mostre consulta automática e manual.
2. Entre como administrador, altere a rota de um dia e salve.
3. Recarregue a tela e confirme que a alteração permaneceu.
4. No pgAdmin 4, consulte a rota salva no PostgreSQL.
5. Entre como motorista, mostre a rota e registre uma ocorrência.

**Comprovação técnica opcional:** acesse `http://localhost:3000/api/health` e verifique `database: connected`.

**Consulta SQL de demonstração no pgAdmin:**

```sql
SELECT rp.service_date,
       v.name AS veiculo,
       rp.departure_time,
       rs.position AS ordem,
       u.name AS universidade
FROM route_plans rp
JOIN vehicles v ON v.id = rp.vehicle_id
JOIN route_stops rs ON rs.route_plan_id = rp.id
JOIN universities u ON u.id = rs.university_id
ORDER BY rp.service_date DESC, v.name, rs.position
LIMIT 30;
```

## Slide 8 — Resultados e limitações

**No slide:** código de frontend/API/banco, Docker Compose, documentação, testes unitários e limitações.  
**Mini resumo para falar:** “O projeto entrega a estrutura de um MVP com as funcionalidades prioritárias. Ainda não possui rastreamento em tempo real, aplicativo nativo ou hospedagem pública. A evolução depende de testes integrados, segurança para produção e novas funcionalidades.”

## Pontos mais importantes para o professor

- **Regras de negócio:** rotas por data e redistribuição de universidades sem alterar outros dias.
- **Controle de acesso:** três perfis com permissões diferentes.
- **Integração real:** alteração feita no frontend deve ser vista após recarregar e no PostgreSQL.
- **Decisões técnicas:** API REST, validações no backend, transações e banco relacional.
- **Limites reconhecidos:** sem GPS, sem otimização automática de rotas e sem hospedagem pública.

## Cuidados antes de apresentar

1. Execute `docker compose ps` e confirme que `app` e `db` estão em execução.
2. Abra `http://localhost:3000/api/health` e confira o estado do banco.
3. Teste os três logins e a redistribuição de uma universidade com dados fictícios.
4. Deixe o pgAdmin 4 conectado e a consulta SQL preparada.
5. **Não declare testes integrados concluídos se não os tiver executado.** Os testes unitários passaram durante a geração, mas a validação integrada deve ser comprovada no seu ambiente.
6. Use as capturas de tela apenas como apoio; a prova de funcionamento é a aplicação executando.

**Base do conteúdo:** documentação do projeto 2.0, explicação dos fluxos HU01–HU11, README e roteiro de demonstração do pacote do MVP integrado.
