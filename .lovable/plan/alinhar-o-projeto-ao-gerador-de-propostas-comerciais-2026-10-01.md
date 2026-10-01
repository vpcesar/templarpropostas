# Alinhar o projeto ao Gerador de Propostas Comerciais

## Objetivo
Remover referências e estruturas herdadas do antigo projeto de SDR/WhatsApp e deixar código, documentação e dependências coerentes com o fluxo exibido no painel **Visualização**.

## Alterações
- Reescrever o README em português com o fluxo real: login, criação pelos 14 serviços, edição, visualização A4, Gemini, PDF privado e lista no Google Sheets.
- Atualizar a identidade técnica do pacote e remover dependências não utilizadas herdadas do template antigo.
- Remover funções antigas de WhatsApp, CRM, follow-ups e configurações de agentes que não são chamadas pelo gerador de propostas.
- Manter intactos autenticação, Configurações, Gemini, Google Sheets, armazenamento dos PDFs e os 14 modelos de proposta.
- Organizar pequenos trechos residuais do frontend que ainda dependem de utilitários antigos, sem alterar o desenho ou o conteúdo do painel **Visualização**.

## Validação
- Confirmar que não restaram referências a Inov4, SDR, WhatsApp ou CRM no código ativo e na documentação.
- Verificar compilação, login, abertura da lista, criação de proposta, editor e painel **Visualização**.
- Confirmar que PDF, Gemini, logotipo e sincronização com Google Sheets continuam conectados ao fluxo atual.

## Limite desta limpeza
As tabelas antigas do banco não serão apagadas nesta etapa, evitando perda irreversível de dados. Elas ficarão sem uso pelo aplicativo e poderão ser removidas depois, mediante confirmação específica.
