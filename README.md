# Gerador de Propostas — Templar Engenharia

Aplicação interna para criar, revisar, organizar e exportar propostas comerciais técnicas da Templar Engenharia.

## Fluxo de trabalho

1. O usuário autorizado entra com e-mail e senha.
2. Na **Central de Propostas**, consulta propostas recentes e escolhe um dos 14 serviços técnicos.
3. O assistente de criação coleta contratante, local do serviço, valor e prazo.
4. No editor, os dados são organizados por marca, identificação, responsável técnico, contratante, imóvel, seções, conteúdo técnico, valores e fechamento.
5. O painel **Visualização** apresenta o documento final em quatro páginas A4 e é atualizado enquanto a proposta é editada.
6. A proposta pode ser salva na lista central e exportada como PDF.

## Funcionalidades

- acesso interno protegido por login;
- 14 modelos de serviços de engenharia;
- numeração sequencial `PROP-XXXX`, editável no documento;
- editor com ativação e ordenação das seções oficiais;
- visualização A4 em tempo real para computador e celular;
- condição padrão de pagamento: 50% no aceite e 50% na entrega do laudo;
- sugestões técnicas com Gemini, sempre submetidas à revisão antes da aplicação;
- logotipo e cores configuráveis;
- geração de PDF e armazenamento privado;
- lista compartilhada no Google Sheets, atualizada sem duplicar propostas;
- cópia local durante a edição, preservada quando o Google Sheets estiver temporariamente indisponível.

## Serviços disponíveis

1. Laudo Técnico
2. Vistoria Técnica
3. Vistoria de Entrega e Recebimento de Obra
4. Vistoria de Entrega das Chaves
5. Vistoria Locativa de Entrada
6. Vistoria Locativa de Saída
7. Vistoria de Constatação
8. Vistoria de Constatação de Obra
9. Vistoria Cautelar de Vizinhança
10. Vistoria de Análise de Causalidade
11. Vistoria de Análise Comparativa de Conformidade
12. Vistoria de Reforma
13. Inspeção Predial
14. Avaliação de Imóveis

## Armazenamento e integrações

- **Navegador:** mantém o conteúdo completo das propostas em edição e as preferências visuais.
- **Lovable Cloud:** fornece autenticação, funções protegidas e armazenamento privado dos PDFs.
- **Google Sheets:** recebe o índice compartilhado das propostas, com número, data, cliente, serviço, imóvel, valor, prazo, status e referência do PDF.
- **Gemini:** gera sugestões para Objetivo, Itens constantes, Metodologia, Entregáveis e Não incluído. A chave é cadastrada em **Configurações** e armazenada de forma cifrada.

O texto gerado por IA nunca é aplicado automaticamente. O usuário deve revisar e confirmar cada sugestão.

## Estrutura principal

- `/login` — acesso restrito;
- `/` — Central de Propostas e seleção do serviço;
- `/editor/:id` — edição e Visualização A4;
- `/configuracoes` — logotipo padrão e conexão com Gemini;
- `/nao-encontrada` — aviso para documentos indisponíveis neste navegador.

## Desenvolvimento local

Requisitos: Node.js 20 ou superior e Bun.

```sh
bun install
bun run dev
```

Outros comandos:

```sh
bun run build
bun run lint
```

As variáveis públicas de conexão são gerenciadas pela integração do Lovable Cloud. Credenciais privadas não devem ser adicionadas ao código.

## Tecnologias

- React 19 e TypeScript
- Vite 7
- Tailwind CSS 4
- Zustand
- React Router
- html-to-image e jsPDF
- Lovable Cloud