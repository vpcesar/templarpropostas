# Gerador de Propostas — Templar Engenharia

## Objetivo
Substituir o sistema atual por uma ferramenta interna, em português, para criar, editar, visualizar e exportar propostas técnicas da Templar Engenharia. O documento seguirá o formato A4 institucional, terá acesso por e-mail e senha, salvamento automático durante a edição e uma lista central registrada no Google Sheets.

## Experiência principal

### Página inicial
- Exigir login interno por e-mail e senha, sem cadastro público.
- Apresentar a identidade da Templar Engenharia e o botão **Nova proposta**.
- Exibir uma lista privada e pesquisável das propostas registradas na planilha central, com número, data, cliente, serviço, imóvel, valor, prazo, status e link do PDF.
- Exibir os 14 serviços técnicos em uma grade única, na ordem definida.
- Criar imediatamente uma proposta ao selecionar um serviço.
- Abrir um assistente de três etapas para cliente, imóvel, valores e prazos.
- Incluir **Pular e começar do zero**, usando Avaliação de Imóveis como modelo inicial.

### Editor
- Criar uma área fixa de edição e uma visualização A4 em tempo real.
- Organizar os campos em grupos recolhíveis: Marca, Identificação, Responsável Técnico, Cliente, Imóvel, Seções, Conteúdo Técnico, Valores e Fechamento.
- Permitir anexar logotipo PNG/JPEG e escolher cores da marca no próprio editor.
- Permitir ativar, desativar e reordenar as 12 seções oficiais.
- Em telas menores, alternar entre **Editar** e **Visualizar proposta**.
- Exibir aviso e retorno à página inicial quando a proposta não existir.

### Documento institucional
- Criar capa e páginas A4 claras com cabeçalho e rodapé reais em todas as folhas.
- Reproduzir a ordem oficial das 12 seções, com hierarquia tipográfica técnica e limpa.
- Inserir os dados fixos da empresa, responsável técnico, slogan e contatos.
- Carregar o conteúdo específico completo dos 14 serviços, incluindo exclusões próprias e gerais.
- Reservar áreas de assinatura para contratante e responsável técnico.

## Dados e regras comerciais
- Salvar propostas automaticamente no navegador sob `templar-proposals-v1` enquanto estão sendo editadas.
- Registrar o resumo de cada proposta em uma única planilha Google Sheets da empresa, usando uma conexão administrativa segura.
- Atualizar a mesma linha ao salvar novamente uma proposta, evitando duplicações pelo identificador interno.
- Enviar o PDF final para armazenamento privado da aplicação e gravar na planilha uma referência segura para acesso ao arquivo.
- Manter contador sequencial local sob `templar-proposals-counter-v1`, retomando o último número salvo e permitindo edição manual.
- Iniciar valores em zero.
- Usar como condição padrão: 50% no aceite para agendamento e 50% na entrega do laudo.
- Calcular automaticamente percentuais, valores de sinal/saldo, parcelas e datas de validade.
- Implementar as funções de moeda e datas brasileiras e os controles criar, atualizar, remover e criar a partir de modelo.

## Assistente técnico com IA
- Adicionar **Gerar com IA** nos blocos Objetivo, Itens Constantes, Metodologia, Entregáveis e Não Incluído.
- Enviar para a IA o serviço, o objeto, as observações e o conteúdo atual, usando integralmente as regras técnicas fornecidas.
- Fazer a chamada por uma função segura para que a chave do Gemini não apareça no navegador.
- Exibir o resultado como sugestão pendente, com **Aplicar** e **Descartar**; nunca alterar o texto automaticamente.
- Mostrar erros de configuração, limite ou indisponibilidade de forma clara, preservando o conteúdo digitado.
- Configurar a credencial Gemini somente após a função estar pronta.

## Acesso e integração com Google Sheets
- Implementar login interno com e-mail e senha e proteger todas as páginas do gerador.
- Não oferecer criação pública de contas; os usuários autorizados serão cadastrados pelo responsável da aplicação.
- Conectar uma única conta Google da empresa e usar sua planilha como índice compartilhado das propostas.
- Usar a conexão central Google Sheets já vinculada ao projeto; a planilha poderá ser criada pelo sistema ou selecionada por endereço no primeiro acesso administrativo.
- Criar a estrutura de colunas automaticamente quando necessário e manter leitura e gravação sob demanda, sem consultas repetitivas.
- Exibir falhas de acesso à planilha sem apagar a proposta local nem impedir sua exportação.

## Exportação em PDF
- Carregar `html-to-image` e `jspdf` apenas no momento da exportação.
- Capturar cada página A4 separadamente com pixel ratio 2,5.
- Exibir bloqueio com progresso durante a geração.
- Baixar como `proposta-<numero>-<cliente>.pdf`.
- Garantir cabeçalhos, rodapés, alinhamentos e quebras consistentes.

## Direção visual
- Interface operacional escura, sóbria e precisa, inspirada em pranchetas e documentação pericial.
- Documento sempre branco e institucional, com cor de destaque configurável.
- Marca inicial tipográfica neutra até o usuário anexar o logotipo oficial.
- Evitar aparência genérica de painel, excesso de cartões e efeitos decorativos.

## Implementação técnica
- Migrar para React 19, Vite 7 e Tailwind CSS 4 configurado em `src/styles.css`, sem `tailwind.config.js`.
- Usar React Router, Zustand com persistência, nanoid, lucide-react, html-to-image e jspdf.
- Usar componentes próprios, removendo dependência visual de shadcn/ui e toda a experiência anterior de login, WhatsApp e administração.
- Usar o backend apenas para autenticação, armazenamento privado dos PDFs, Gemini e acesso seguro ao Google Sheets; o conteúdo editável permanece salvo localmente.
- Atualizar título, descrição, idioma e metadados sociais da aplicação.

## Validação
- Verificar login, bloqueio das páginas privadas e encerramento de sessão.
- Verificar criação pelos 14 serviços e pelo assistente de três etapas.
- Confirmar atualização instantânea, persistência após recarregar e numeração sequencial editável.
- Testar visibilidade e ordem das seções, upload do logotipo, cores e cálculos comerciais.
- Testar o ciclo completo da IA: gerar, revisar, aplicar e descartar.
- Testar criação e atualização da linha na planilha central e abertura do PDF associado.
- Exportar e inspecionar visualmente o PDF A4 em múltiplas páginas.
- Conferir a interface em desktop e celular, além de erros de execução e compilação.

## Premissas registradas
- Não haverá cadastro público nem painel público de propostas.
- A planilha Google Sheets será central, pertencente à conta administrativa conectada ao projeto.
- O último número conhecido será o contador salvo neste navegador; sem banco remoto, outro dispositivo não consegue descobri-lo automaticamente.
- Valores começam zerados e os prazos permanecem para preenchimento manual.
- A cor oficial poderá ser escolhida no editor; nenhuma cor institucional definitiva será presumida.
