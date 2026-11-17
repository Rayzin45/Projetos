# Roteiro de demonstração funcional — Etapa final

Pré-requisitos: iniciar o sistema conforme o `README.md` e acessar `http://localhost:3000`.

1. **Login real**: utilize a conta `aluno@transporte.local` (senha no README). Mostre o painel e a rota vinculada automaticamente à Faculdade A.
2. **Consulta manual**: em Consultar rotas, selecione a data de hoje/amanhã e outra universidade; observe o veículo e o horário correspondentes. Teste uma data sem rota.
3. **Controle de acesso**: com estudante logado, tente visitar `/api/students` pelo navegador; a API responde 403 e não mostra cadastros administrativos.
4. **Administração**: saia e entre como administrador. Abra Cadastros e mostre universidades, universitários, motoristas e veículos. Crie um registro de exemplo e atualize seus dados.
5. **Rotas dinâmicas**: abra Gerenciar rotas; escolha data; mude horário, reordene universidades e transfira uma universidade do Ônibus 01 para o Ônibus 02. Clique **Salvar configuração do dia**. Recarregue a página e confirme persistência.
6. **Independência por data**: configure uma data diferente e verifique que o plano do outro dia permanece independente.
7. **Avisos e calendário**: publique um aviso e um evento com administrador; em seguida entre como estudante e mostre a consulta.
8. **Suporte**: estudante envia um chamado; administrador responde e altera o status; estudante confere a resposta.
9. **Motorista**: entre como motorista. Mostre a rota atribuída, registre uma ocorrência e faça login como administrador para visualizá-la.
10. **Integração**: abra `http://localhost:3000/api/health` e mostre `database: connected`. Se desejar, abra a aba Network do DevTools para visualizar chamadas `/api/...`.

> Para demonstração sem alterar os dados iniciais, o professor pode usar um banco temporário (Docker Compose) e apagar o volume ao fim. A exclusão do volume também elimina cadastros de teste.
