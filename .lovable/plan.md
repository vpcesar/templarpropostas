# Corrigir limite de leitura do Google Sheets

## Alterações
- Evitar a leitura completa da planilha antes de cada salvamento: novas propostas serão adicionadas diretamente; propostas já sincronizadas guardarão sua linha para atualização direta.
- Manter um índice curto no navegador para reaproveitar a última lista carregada e impedir leituras repetidas ao navegar entre telas.
- Quando o Google Sheets responder com limite temporário, exibir as propostas locais e uma mensagem clara, sem tela em branco nem repetição automática.
- Preservar o comportamento atual: a proposta continua salva no navegador e a exportação do PDF continua disponível mesmo se a planilha estiver temporariamente indisponível.

## Validação
- Publicar novamente a função da planilha.
- Validar abertura da página, salvamento e retorno ao início sem leituras desnecessárias.
- Confirmar compilação e ausência de erro em tela.
