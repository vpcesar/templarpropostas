import type { Proposal } from "@/types/proposal";

const received = (value: string) => value?.trim() || "Não informado.";

export function ProposalContext({ proposal }: { proposal: Proposal }) {
  const { client, scope } = proposal;
  const address = [client.street, client.neighborhood, client.city].filter(Boolean).join(", ") || proposal.property.address;
  const summary = [
    { title: "A situação", value: received(scope.objectSummary || proposal.property.description) },
    { title: "O serviço", value: received(proposal.scopeObjective || proposal.serviceName) },
    { title: "A entrega", value: received(proposal.deliverables) },
  ];
  const rows = [
    { item: "Identificação", base: [client.name, client.document, address].filter(Boolean).join("\n") || "Não informada.", check: "Conferir a identificação do contratante e a localização do objeto da avaliação." },
    { item: "Área", base: scope.interventionArea > 0 ? `${new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(scope.interventionArea)} m² (área indicada).` : "Não informada.", check: "Confrontar a área indicada com a planta disponibilizada e as condições acessíveis no local, dentro do escopo contratado." },
    { item: "Intervenções", base: received(scope.sectionsToEvaluate), check: "Conferir os trechos indicados, as condições aparentes e as interferências pertinentes ao serviço contratado." },
    { item: "Estrutura", base: "Caracterização estrutural a confirmar.", check: "Verificar os elementos aparentes e a existência de documentação estrutural pertinente, sem presumir a função dos elementos." },
    { item: "Histórico", base: "Histórico de obras e ocorrências a confirmar.", check: "Solicitar os relatos e registros disponíveis relevantes ao objeto e confrontá-los com as evidências acessíveis." },
  ];

  return <div>
    <section className="document-block mb-[9mm]">
      <h2 className="mb-[2mm] text-[17pt] font-bold text-doc-ink">01 EM RESUMO</h2>
      <p className="mb-[6mm] text-[9pt] text-doc-muted">A proposta e as informações necessárias para a avaliação</p>
      <div className="grid grid-cols-3 gap-[5mm]">
        {summary.map(({ title, value }) => <div key={title} className="min-w-0">
          <h3 className="mb-[2mm] text-[10pt] font-bold text-doc-ink">{title}</h3>
          <p className="whitespace-pre-line text-[8pt] leading-[1.6] text-doc-text">{value}</p>
        </div>)}
      </div>
      <p className="mt-[5mm] border-l-2 border-doc-line pl-[4mm] text-[8pt] leading-[1.6] text-doc-text">A conclusão do laudo dependerá das evidências verificadas, dos documentos disponibilizados e das condições de acesso na vistoria, dentro do escopo contratado. A contratação não pressupõe parecer favorável à intervenção; a insuficiência de informações poderá exigir verificações complementares, a serem acordadas separadamente.</p>
    </section>
    <section className="document-block mb-[9mm]">
      <h2 className="mb-[2mm] text-[17pt] font-bold text-doc-ink">02 INFORMAÇÕES DISPONÍVEIS</h2>
      <p className="mb-[5mm] text-[9pt] text-doc-muted">O que foi recebido e o que será conferido</p>
      <table className="w-full table-fixed border-collapse text-left text-[8pt] leading-[1.55] text-doc-text">
        <thead className="text-[6.5pt] text-doc-muted">
          <tr className="border-b border-doc-line">
            <th scope="col" className="w-[20%] py-[3mm] pr-[3mm] font-semibold">ITEM</th>
            <th scope="col" className="w-[35%] py-[3mm] pr-[4mm] font-semibold">BASE RECEBIDA</th>
            <th scope="col" className="w-[45%] py-[3mm] font-semibold">CONFERÊNCIA PREVISTA</th>
          </tr>
        </thead>
        <tbody>{rows.map(({ item, base, check }) => <tr key={item} className="border-b border-doc-line">
          <th scope="row" className="py-[3mm] pr-[3mm] align-top font-semibold text-doc-ink">{item}</th>
          <td className="whitespace-pre-line py-[3mm] pr-[4mm] align-top">{base}</td>
          <td className="py-[3mm] align-top">{check}</td>
        </tr>)}</tbody>
      </table>
      <div className="mt-[5mm] border-l-2 border-doc-line pl-[4mm] text-[8pt] leading-[1.6] text-doc-text">
        <h3 className="mb-[2mm] font-bold text-doc-ink">Documentos que ajudam a avaliação</h3>
        <p>Quando pertinentes ao serviço: plantas arquitetônicas e estruturais, registros de reformas, memoriais, laudos anteriores e fotografias das ocorrências. A disponibilidade e a necessidade desses documentos serão confirmadas na avaliação.</p>
        <p className="mt-[2mm] whitespace-pre-line"><span className="font-semibold">Documentos informados: </span>{scope.providedDocuments?.trim() || "Nenhum documento informado."}</p>
      </div>
    </section>
  </div>;
}