# Limitações conhecidas e decisões

## Funcionais

- **Horários previstos:** valores são definidos pelo administrador; não há GPS nem atualização automática de atrasos.
- **Consulta automática:** um universitário pertence a uma única universidade; não há cadastro de múltiplos vínculos ou reserva de assentos.
- **Rota por data:** cada universidade pode aparecer em apenas um veículo por dia e cada motorista em apenas um veículo na mesma data. Não há divisão de turnos no modelo, pois o escopo acadêmico é **noturno**.
- **Pontos:** paradas são universidades; referências de endereço podem ser cadastradas. Não há pontos independentes de bairro, nem cálculo de trajeto em mapa.
- **Calendário:** eventos cadastrados não desativam automaticamente as rotas em feriados/suspensões. A equipe deve observar os avisos/calendário ao planejar.
- **Suporte:** apenas estudantes abrem chamados, administradores respondem; não há anexos, e-mail ou filas avançadas.
- **Ocorrências:** motorista pode registrar um evento mesmo sem veículo atribuído para aquela data; nesse caso o veículo fica vazio.
- **Administração:** contas de administradores são criadas no seed; não existe fluxo seguro para criar outros administradores na interface.
- **Usuários:** recuperação de senha, confirmação por e-mail e auto cadastro não implementados.
- **CRUD:** excluir motoristas, veículos ou universidades que possuam referências pode ser recusado por integridade relacional. Use o campo `ativo=false` (edição) para desabilitá-los mantendo histórico.
- **Auditoria:** não há histórico de alterações de rotas, embora o estado atual seja salvo permanentemente.
- **Arquitetura:** backend prioriza simplicidade acadêmica e ainda não está dividido em controllers/services/repositories como evolução sugerida no documento.

## Segurança e operação

- **Demo apenas local:** credenciais previsíveis exibidas na tela, senha de PostgreSQL de desenvolvimento, seed demonstrativo. Nunca usar em produção sem remover estas credenciais.
- **Sessões:** cookie `HttpOnly`, `SameSite=Lax`, expiração de oito horas; tokens criptograficamente aleatórios armazenados no banco somente por hash. A renovação automática e o encerramento de todas as sessões não foram implementados.
- **CSRF:** o backend verifica a origem quando o cabeçalho `Origin` está presente; o cookie `SameSite=Lax` mitiga riscos. Uma implantação pública deve avaliar proteção CSRF explícita e regras de proxy.
- **Limitação de login:** proteção básica em memória por IP; não é distribuída entre réplicas. Para produção usar Redis ou solução equivalente.
- **HTTPS:** não fornecido localmente; em produção, proxy HTTPS e configuração cuidadosa de `TRUST_PROXY`.
- **Backup e monitoramento:** não automatizados neste MVP. Docker mantém os dados em volume persistente, o que **não substitui backup**.
- **Privacidade:** os dados iniciais são fictícios; para dados reais, revisar LGPD, acesso, retenção e minimização.
- **Validação:** servidor valida formato, tamanho e regras principais; faltam validações de negócio mais ricas, por exemplo capacidade versus demanda.
- **Responsividade:** layouts desktop/mobile via CSS, mas sem certificação de acessibilidade WCAG completa.
- **Dependências:** devem ser instaladas na máquina de execução com `npm install`. Não há deploy público integrado ao pacote.

## Verificação da entrega

- Código JavaScript: sintaxe verificável com `node --check`.
- Funções de negócio: `npm test` (scrypt, datas, horários, regras de alocação).
- Integração: precisa de Docker/PostgreSQL em execução, `RUN_INTEGRATION=true npm run test:integration`.
- Não declaramos ambiente integrado testado se banco e pacotes não puderam ser iniciados no ambiente de geração.
