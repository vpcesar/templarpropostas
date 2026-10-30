import type { ReactNode } from "react";
import type { Proposal, SectionId } from "@/types/proposal";
import { fmtBRL, fmtDateShort } from "@/lib/proposal-utils";
import { A4PageWrapper, Block, Highlight } from "@/components/proposals/document/A4Document";
import { ProposalCover } from "@/components/proposals/document/ProposalCover";
import { visibleSections } from "@/lib/document-sections";

const text = (value: string, fallback = "A confirmar") => value?.trim() || fallback;
const Info = ({ label, value }: { label: string; value: string }) => <div className="border-l-2 border-doc-highlight pl-[3mm]"><span className="block text-[6pt] uppercase text-doc-muted">{label}</span><b className="mt-[1mm] block text-[7.5pt] text-doc-ink">{value}</b></div>;

export function ProposalPreview({ proposal }: { proposal: Proposal }) {
  const { client, scope, commercial, operational } = proposal;
  const address = [client.street, client.neighborhood, client.city].filter(Boolean).join(", ") || proposal.property.address;
  const content: Record<SectionId, ReactNode> = {
    capa: <ProposalCover proposal={proposal} />,
    responsavel: <Block title="Responsável técnico"><div className="grid grid-cols-3 gap-[3mm]"><Info label="Engenheiro" value={text(operational.engineer)} /><Info label="Função" value={text(operational.role)} /><Info label="CREA" value={text(operational.crea)} /></div></Block>,
    cliente: <Block title="Contratante"><div className="grid grid-cols-3 gap-[3mm]"><Info label="Nome / razão social" value={text(client.name)} /><Info label="CPF / CNPJ" value={text(client.document)} /><Info label="Contato" value={text(client.phone || client.email)} /></div><div className="mt-[4mm]"><Info label="Endereço" value={text(address)} /></div></Block>,
    objeto: <Block title="Objeto e área da intervenção"><Highlight>{text(scope.objectSummary || proposal.property.description, "Descrição do objeto a confirmar.")}</Highlight><p className="mt-[4mm]">Área da intervenção: <span className="doc-hl font-semibold">{scope.interventionArea ? `${scope.interventionArea} m²` : "a confirmar"}</span></p><p>{text(scope.sectionsToEvaluate, "Trechos específicos a confirmar.")}</p>{scope.floorPlanImages.length > 0 && <div className="mt-[4mm] grid grid-cols-2 gap-[4mm]">{scope.floorPlanImages.map((src, i) => <img key={i} src={src} alt={`Planta ${i + 1}`} className="h-[55mm] w-full border border-doc-line object-contain" />)}</div>}</Block>,
    servico: <Block title="Serviço">{proposal.serviceName}</Block>,
    objetivo: <Block title="Objetivo">{proposal.scopeObjective}</Block>,
    itensConstantes: <Block title="Itens constantes">{proposal.scopeItems}</Block>,
    metodologia: <Block title="Metodologia">{proposal.methodology}<div className="mt-[4mm]"><Highlight><b className="block">Documentos fornecidos</b>{text(scope.providedDocuments, "Nenhum documento informado.")}</Highlight></div></Block>,
    entregaveis: <Block title="Entregáveis">{proposal.deliverables}</Block>,
    naoIncluido: <Block title="Não incluído">{proposal.notIncluded}<div className="mt-[4mm]"><Highlight>{proposal.commonExclusions}</Highlight></div></Block>,
    valores: <Block title="Investimento"><div className="document-highlight bg-doc-ink p-[8mm]"><span className="block text-[7pt] uppercase text-doc-paper">Investimento total</span><strong className="mt-[2mm] block text-[26pt] text-doc-highlight">{fmtBRL(commercial.totalValue)}</strong></div><div className="my-[5mm] grid grid-cols-2 gap-[4mm] text-[7.5pt]"><Highlight><span className="block text-doc-muted">Parcelamento</span><b>{text(commercial.installmentModel)}</b></Highlight><Highlight><span className="block text-doc-muted">Prazo de entrega</span><b>{text(commercial.deliveryDeadline)}</b></Highlight><Highlight><span className="block text-doc-muted">Validade</span><b>{commercial.validUntil ? fmtDateShort(commercial.validUntil) : "A confirmar"}</b></Highlight><Highlight><span className="block text-doc-muted">Vistorias</span><b>{commercial.inspectionCount || "A confirmar"}</b></Highlight></div></Block>,
    fechamento: <Block title={proposal.ctaText}>{proposal.closingMessage}<div className="mt-[12mm] grid grid-cols-2 gap-[15mm] text-center text-[7pt]"><div className="border-t border-doc-text pt-[3mm]">Contratante</div><div className="border-t border-doc-text pt-[3mm]">{operational.engineer}<br />{operational.crea}</div></div></Block>,
  };
  return <div className="document-stack"><A4PageWrapper proposal={proposal}>{visibleSections(proposal.sections).map((section) => <div key={section.id} data-section={section.id}>{content[section.id]}</div>)}</A4PageWrapper></div>;
}