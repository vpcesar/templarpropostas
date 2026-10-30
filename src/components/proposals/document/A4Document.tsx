import type { ReactNode } from "react";
import type { Proposal } from "@/types/proposal";

export const TOTAL_PAGES = 6;

export function DocumentHeader({ proposal }: { proposal: Proposal }) {
  return (
    <header className="flex h-[22mm] shrink-0 items-end justify-between border-b border-doc-line px-[18mm] pb-[4mm]">
      <div className="flex items-center">
        {proposal.brand.logo ? (
          <img src={proposal.brand.logo} alt="Templar Engenharia" className="max-h-[10mm] max-w-[42mm] object-contain" />
        ) : (
          <div className="leading-none">
            <strong className="block text-[10pt] tracking-[2px] text-doc-ink">TEMPLAR</strong>
            <span className="block text-[5pt] tracking-[2.5px] text-doc-muted">ENGENHARIA</span>
          </div>
        )}
      </div>
      <div className="text-right leading-tight">
        <b className="block max-w-[100mm] truncate text-[7.5pt] text-doc-ink">{proposal.serviceName}</b>
        <span className="text-[6.5pt] text-doc-muted">Revisão <mark className="bg-doc-highlight-soft px-1 text-doc-ink">{proposal.revision || "R00"}</mark></span>
      </div>
    </header>
  );
}

export function DocumentFooter({ proposal, page }: { proposal: Proposal; page: number }) {
  const { engineer, crea } = proposal.operational;
  return (
    <footer className="flex h-[16mm] shrink-0 items-start justify-between gap-[6mm] border-t border-doc-line px-[18mm] pt-[3mm] text-[6pt] text-doc-muted">
      <span className="font-mono font-semibold text-doc-ink">{proposal.proposalNumber}</span>
      <span className="flex-1 text-center">Responsável técnico: <b className="text-doc-text">{engineer || "A confirmar"}</b>{crea ? ` — ${crea}` : ""}</span>
      <span className="font-mono"><b className="text-doc-ink">{String(page).padStart(2, "0")}</b> / {String(TOTAL_PAGES).padStart(2, "0")}</span>
    </footer>
  );
}

export function A4PageWrapper({ proposal, page, children, bare = false }: { proposal: Proposal; page: number; children: ReactNode; bare?: boolean }) {
  return (
    <article className="a4-page bg-doc-paper text-doc-ink" data-page={page}>
      <DocumentHeader proposal={proposal} />
      <div className={bare ? "relative flex-1 overflow-hidden" : "flex-1 overflow-hidden px-[18mm] py-[9mm] text-doc-text"}>{children}</div>
      <DocumentFooter proposal={proposal} page={page} />
    </article>
  );
}

export const Block = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="mb-[7mm]">
    <h2 className="mb-[3mm] border-b border-doc-line pb-[2mm] text-[12pt] font-bold text-doc-ink">{title}</h2>
    <div className="text-[8.5pt] leading-[1.58] whitespace-pre-line">{children}</div>
  </section>
);

export const Highlight = ({ children }: { children: ReactNode }) => <div className="rounded-sm bg-doc-block p-[4mm] text-[8pt] leading-[1.5]">{children}</div>;

export const Kicker = ({ children }: { children: ReactNode }) => <div className="mb-[7mm] font-mono text-[7pt] font-semibold tracking-[1.5px] text-doc-ink"><span className="bg-doc-highlight px-[1.5mm]">{children}</span></div>;
