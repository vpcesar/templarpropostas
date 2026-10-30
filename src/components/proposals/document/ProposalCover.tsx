import type { Proposal } from "@/types/proposal";
import { fmtBRL } from "@/lib/proposal-utils";

export function ProposalCover({ proposal }: { proposal: Proposal }) {
  const { scope, commercial } = proposal;
  const image = scope.floorPlanImages[0];
  const summary = scope.objectSummary?.trim() || proposal.property.description?.trim() || proposal.scopeObjective?.trim() || proposal.serviceName;
  const indicators = [
    { label: "INVESTIMENTO", value: fmtBRL(commercial.totalValue) },
    { label: "VISTORIA", value: commercial.inspectionCount > 0 ? `${commercial.inspectionCount} ${commercial.inspectionCount === 1 ? "visita" : "visitas"}` : "A confirmar" },
    { label: "ENTREGA", value: commercial.deliveryDeadline?.trim() || "A confirmar" },
    { label: "ÁREA INDICADA", value: scope.interventionArea > 0 ? `${new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(scope.interventionArea)} m²` : "A confirmar" },
  ];

  return <section className="mb-[10mm] font-sans">
    {image && <figure className="document-highlight mb-[6mm]">
      <img src={image} alt="Planta arquitetônica recebida para avaliação" className="max-h-[90mm] w-full object-contain" />
      <figcaption className="mt-[2mm] text-[7pt] leading-[1.5] text-doc-muted">Planta arquitetônica e marcações recebidas para avaliação. Dimensões e função dos elementos a verificar.</figcaption>
    </figure>}
    <h1 className="mb-[3mm] text-[13pt] font-bold text-doc-ink">OBJETO DA PROPOSTA</h1>
    <p className="mb-[6mm] whitespace-pre-line text-[9pt] leading-[1.6] text-doc-text">{summary}</p>
    <dl className="grid grid-cols-4 gap-[3mm]">
      {indicators.map(({ label, value }) => <div key={label} className="document-highlight min-w-0 bg-doc-block p-[4mm]">
        <dt className="text-[6.5pt] font-semibold text-doc-muted">{label}</dt>
        <dd className="mt-[2mm] text-[10pt] font-bold leading-[1.35] text-doc-ink">{value}</dd>
      </div>)}
    </dl>
  </section>;
}