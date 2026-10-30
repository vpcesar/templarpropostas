import type { Proposal } from "@/types/proposal";
import { fmtBRL, fmtDateLong, fmtDateShort } from "@/lib/proposal-utils";
import { A4PageWrapper, Block, Highlight, Kicker } from "@/components/proposals/document/A4Document";

const text = (value: string, fallback = "A confirmar") => value?.trim() || fallback;
const Info = ({ label, value }: { label: string; value: string }) => <div className="border-l-2 border-doc-highlight pl-[3mm]"><span className="block text-[6pt] uppercase text-doc-muted">{label}</span><b className="mt-[1mm] block text-[7.5pt] text-doc-ink">{value}</b></div>;

export function ProposalPreview({ proposal }: { proposal: Proposal }) {
  const { client, scope, commercial, operational } = proposal;
  const address = [client.street, client.neighborhood, client.city].filter(Boolean).join(", ") || proposal.property.address;
  return <div className="document-stack">
    <A4PageWrapper proposal={proposal} page={1} bare>
      <div className="absolute left-[18mm] top-[22mm] h-[2mm] w-[22mm] bg-doc-highlight" />
      <div className="absolute left-[18mm] right-[25mm] top-[50mm]">
        <span className="font-mono text-[7pt] tracking-[2px] text-doc-muted">PROPOSTA COMERCIAL TÉCNICA</span>
        <h1 className="my-[7mm] text-[34pt] font-bold leading-[1.06]">{proposal.cover.title}</h1>
        <p className="text-[9pt] text-doc-muted">{address || "LOCAL DO SERVIÇO A CONFIRMAR"}</p>
      </div>
      <div className="absolute left-[18mm] top-[160mm] border-l-2 border-doc-highlight pl-[5mm]"><span className="block text-[6pt] text-doc-muted">PREPARADO PARA</span><b className="my-[2mm] block text-[11pt]">{client.name || "CONTRATANTE A CONFIRMAR"}</b><small className="text-[7pt]">{fmtDateLong(proposal.emissionDate)}</small></div>
      <div className="absolute bottom-[18mm] right-[18mm] text-right font-serif text-[17pt] text-doc-muted"><b className="text-doc-ink">VERDADE TÉCNICA,</b><br />JUSTIÇA GARANTIDA.</div>
    </A4PageWrapper>

    <A4PageWrapper proposal={proposal} page={2}>
      <Kicker>IDENTIFICAÇÃO</Kicker>
      <Block title="Contratante"><div className="grid grid-cols-3 gap-[3mm]"><Info label="Nome / razão social" value={text(client.name)} /><Info label="CPF / CNPJ" value={text(client.document)} /><Info label="Contato" value={text(client.phone || client.email)} /></div><div className="mt-[4mm]"><Info label="Endereço" value={text(address)} /></div></Block>
      <Block title="Responsável técnico"><div className="grid grid-cols-3 gap-[3mm]"><Info label="Engenheiro" value={text(operational.engineer)} /><Info label="Função" value={text(operational.role)} /><Info label="CREA" value={text(operational.crea)} /></div></Block>
      <Block title="Resumo do objeto"><Highlight>{text(scope.objectSummary || proposal.property.description, "Descrição do objeto a confirmar.")}</Highlight></Block>
    </A4PageWrapper>

    <A4PageWrapper proposal={proposal} page={3}>
      <Kicker>ESCOPO</Kicker>
      <Block title="Objetivo">{proposal.scopeObjective}</Block>
      <Block title="Área e trechos"><p>Área da intervenção: <span className="doc-hl font-semibold">{scope.interventionArea ? `${scope.interventionArea} m²` : "a confirmar"}</span></p><p>{text(scope.sectionsToEvaluate, "Trechos específicos a confirmar.")}</p></Block>
      {scope.floorPlanImages.length > 0 && <Block title="Plantas"><div className="grid grid-cols-2 gap-[4mm]">{scope.floorPlanImages.slice(0, 4).map((src, i) => <img key={i} src={src} alt={`Planta ${i + 1}`} className="h-[55mm] w-full border border-doc-line object-contain" />)}</div></Block>}
    </A4PageWrapper>

    <A4PageWrapper proposal={proposal} page={4}>
      <Kicker>METODOLOGIA</Kicker>
      <Block title="Itens constantes">{proposal.scopeItems}</Block>
      <Block title="Metodologia">{proposal.methodology}</Block>
      <Block title="Documentos fornecidos"><Highlight>{text(scope.providedDocuments, "Nenhum documento informado.")}</Highlight></Block>
    </A4PageWrapper>

    <A4PageWrapper proposal={proposal} page={5}>
      <Kicker>ENTREGAS E LIMITES</Kicker>
      <Block title="Entregáveis">{proposal.deliverables}</Block>
      <Block title="Não incluído">{proposal.notIncluded}<div className="mt-[4mm]"><Highlight>{proposal.commonExclusions}</Highlight></div></Block>
    </A4PageWrapper>

    <A4PageWrapper proposal={proposal} page={6}>
      <Kicker>INVESTIMENTO</Kicker>
      <div className="bg-doc-ink p-[8mm]"><span className="block text-[7pt] uppercase text-doc-paper">Investimento total</span><strong className="mt-[2mm] block text-[26pt] text-doc-highlight">{fmtBRL(commercial.totalValue)}</strong></div>
      <div className="my-[5mm] grid grid-cols-2 gap-[4mm] text-[7.5pt]">
        <Highlight><span className="block text-doc-muted">Parcelamento</span><b>{text(commercial.installmentModel)}</b></Highlight>
        <Highlight><span className="block text-doc-muted">Prazo de entrega</span><b>{text(commercial.deliveryDeadline)}</b></Highlight>
        <Highlight><span className="block text-doc-muted">Validade</span><b>{commercial.validUntil ? fmtDateShort(commercial.validUntil) : "A confirmar"}</b></Highlight>
        <Highlight><span className="block text-doc-muted">Vistorias</span><b>{commercial.inspectionCount || "A confirmar"}</b></Highlight>
      </div>
      <Block title={proposal.ctaText}>{proposal.closingMessage}</Block>
      <div className="mt-[22mm] grid grid-cols-2 gap-[15mm] text-center text-[7pt]"><div className="border-t border-doc-text pt-[3mm]">Contratante</div><div className="border-t border-doc-text pt-[3mm]">{operational.engineer}<br />{operational.crea}</div></div>
    </A4PageWrapper>
  </div>;
}
