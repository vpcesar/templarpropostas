# Configurações de marca e Gemini

## Objetivo
Adicionar uma tela de Configurações acessível pelo cabeçalho, com dois blocos:
- **Marca:** envio, pré-visualização, troca e remoção do logotipo padrão usado nas novas propostas.
- **Assistente Gemini:** cadastro e substituição segura da chave de API, indicação do estado da configuração e teste de conexão.

## Comportamento
- O logotipo será salvo neste navegador e aplicado automaticamente ao criar novas propostas; a tela também permitirá aplicar o logotipo às propostas locais já existentes.
- A chave Gemini será enviada somente para uma função protegida e armazenada cifrada por usuário. Ela nunca será devolvida ao navegador nem aparecerá no código da página.
- O assistente passará a usar a chave Gemini configurada pelo usuário. Se não houver chave ou o teste falhar, a mensagem real será mostrada sem alterar o texto da proposta.
- A tela mostrará apenas “configurada” ou “não configurada”, com ações para testar, substituir e remover.

## Implementação técnica
- Criar rota protegida `/configuracoes` e botão de engrenagem no cabeçalho.
- Criar persistência local da configuração visual e conectá-la à criação de propostas.
- Criar tabela privada por usuário, com permissões restritas, para a credencial cifrada.
- Criar função protegida para salvar, verificar, testar e excluir a chave; a própria função `proposal-ai` fará a descriptografia e a chamada direta ao Gemini.
- Validar a tela em computador e celular, testar a conexão real e confirmar que a chave não aparece nas respostas ou no navegador.
