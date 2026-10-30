import type { ReactNode } from "react";
import type { Proposal } from "@/types/proposal";

export function DocumentHeader({ proposal }: { proposal: Proposal }) {
  return <header className="document-header border-b border-doc-line text-doc-ink">
    <div>{proposal.brand.logo ? <img src={proposal.brand.logo} alt="Templar Engenharia" className="max-h-[10mm] max-w-[42mm] object-contain" /> : <div className="leading-none"><strong className="block text-[10pt]">TEMPLAR</strong><span className="block text-[5pt] text-doc-muted">ENGENHARIA</span></div>}</div>
    <div className="min-w-0 text-right leading-tight"><b className="block text-[7.5pt]">{proposal.serviceName}</b><span className="text-[6.5pt] text-doc-muted">Revisão <mark className="bg-doc-highlight-soft px-1 text-doc-ink">{proposal.revision || "R00"}</mark></span></div>
  </header>;
}

export function DocumentFooter({ proposal }: { proposal: Proposal }) {
  const { engineer, crea } = proposal.operational;
  return <footer className="document-footer border-t border-doc-line text-[6pt] text-doc-muted">
    <span className="font-mono font-semibold text-doc-ink">{proposal.proposalNumber}</span>
    <span>Responsável técnico: <b className="text-doc-text">{engineer || "A confirmar"}</b>{crea ? ` — ${crea}` : ""}</span>
  </footer>;
}

/** One flowing document; physical pages are created by the browser's print engine. */
export function A4PageWrapper({ proposal, children }: { proposal: Proposal; children: ReactNode }) {
  return <article className="a4-document bg-doc-paper text-doc-ink">
    <table className="document-flow-table"><thead><tr><td><DocumentHeader proposal={proposal} /></td></tr></thead>
      <tbody><tr><td><div className="document-content text-doc-text">{children}</div></td></tr></tbody>
      <tfoot><tr><td><DocumentFooter proposal={proposal} /></td></tr></tfoot>
    </table>
  </article>;
}

export const Block = ({ title, children }: { title: string; children: ReactNode }) => <section className="document-block mb-[7mm]">
  <h2 className="mb-[3mm] border-b border-doc-line pb-[2mm] text-[12pt] font-bold text-doc-ink">{title}</h2>
  <div className="whitespace-pre-line text-[8.5pt] leading-[1.58]">{children}</div>
</section>;
export const Highlight = ({ children }: { children: ReactNode }) => <div className="document-highlight rounded-sm bg-doc-block p-[4mm] text-[8pt] leading-[1.5]">{children}</div>;