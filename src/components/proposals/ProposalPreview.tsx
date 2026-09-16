import type { Proposal } from "@/types/proposal";
import { addDaysIso, fmtBRL, fmtDateLong, fmtDateShort } from "@/lib/proposal-utils";

const lines = (value: string) => value.split("\n").filter(Boolean).map((line, index) => <p key={`${line}-${index}`}>{line}</p>);
const Header = ({ proposal }: { proposal: Proposal }) => <div className="doc-header"><div className="doc-brand">{proposal.brand.logo ? <img src={proposal.brand.logo} alt="Logotipo Templar Engenharia" /> : <><strong>TEMPLAR</strong><span>ENGENHARIA</span></>}</div><div className="doc-meta"><b>{proposal.proposalNumber}</b><span>{fmtDateShort(proposal.emissionDate)}</span></div></div>;
const Footer = ({ page }: { page: number }) => <div className="doc-footer"><span>www.templarengenharia.com.br • templarengenharia@hotmail.com • (21) 98180-8812</span><b>{String(page).padStart(2, "0")}</b></div>;

export function ProposalPreview({ proposal }: { proposal: Proposal }) {
  const enabled = (id: string) => proposal.sections.find((section) => section.id === id)?.enabled;
  const balance = proposal.pricing.totalValue * (100 - proposal.pricing.signalPercent) / 100;
  return <div className="document-stack" style={{ "--doc-accent": proposal.brand.primaryColor, "--doc-ink": proposal.brand.secondaryColor } as React.CSSProperties}>
    {enabled("capa") && <article className="a4-page a4-cover">
      <Header proposal={proposal} />
      <div className="cover-rule" />
      <div className="cover-body"><span>PROPOSTA COMERCIAL TÉCNICA</span><h1>{proposal.cover.title}</h1><p>{proposal.property.address || "LOCAL DO SERVIÇO A CONFIRMAR"}</p></div>
      <div className="cover-client"><span>PREPARADO PARA</span><b>{proposal.client.name || "CONTRATANTE A CONFIRMAR"}</b><small>{fmtDateLong(proposal.emissionDate)}</small></div>
      <div className="cover-statement"><b>VERDADE TÉCNICA,</b><br />JUSTIÇA GARANTIDA.</div>
      <Footer page={1} />
    </article>}
    <article className="a4-page">
      <Header proposal={proposal} />
      <div className="doc-content">
        <div className="doc-kicker">IDENTIFICAÇÃO</div>
        {enabled("responsavel") && <section><h2>Responsável técnico</h2><div className="info-grid"><div><span>Profissional</span><b>{proposal.technicalManager.name}</b></div><div><span>Qualificação</span><b>{proposal.technicalManager.title}</b></div><div><span>Registro</span><b>{proposal.technicalManager.crea}</b></div></div></section>}
        {enabled("cliente") && <section><h2>Contratante</h2><div className="info-grid"><div><span>Nome / razão social</span><b>{proposal.client.name || "A confirmar"}</b></div><div><span>CPF / CNPJ</span><b>{proposal.client.document || "A confirmar"}</b></div><div><span>Contato</span><b>{proposal.client.phone || proposal.client.email || "A confirmar"}</b></div></div></section>}
        {enabled("objeto") && <section><h2>Objeto da proposta</h2><p>{proposal.property.address || "Endereço a confirmar"}{proposal.property.complement ? ` — ${proposal.property.complement}` : ""}</p><p>{proposal.property.description || "Descrição do imóvel e do objeto a confirmar."}</p></section>}
        {enabled("servico") && <section><h2>Serviço técnico</h2><h3>{proposal.serviceName}</h3></section>}
        {enabled("objetivo") && <section><h2>Objetivo</h2>{lines(proposal.scopeObjective)}</section>}
      </div><Footer page={2} />
    </article>
    <article className="a4-page">
      <Header proposal={proposal} /><div className="doc-content"><div className="doc-kicker">ESCOPO TÉCNICO</div>
        {enabled("itensConstantes") && <section><h2>Itens constantes</h2>{lines(proposal.scopeItems)}</section>}
        {enabled("metodologia") && <section><h2>Metodologia</h2>{lines(proposal.methodology)}</section>}
        {enabled("entregaveis") && <section><h2>Entregáveis</h2>{lines(proposal.deliverables)}</section>}
        {enabled("naoIncluido") && <section><h2>Não incluído</h2>{lines(proposal.notIncluded)}<div className="doc-note">{proposal.commonExclusions}</div></section>}
      </div><Footer page={3} />
    </article>
    <article className="a4-page">
      <Header proposal={proposal} /><div className="doc-content"><div className="doc-kicker">INVESTIMENTO</div>
        {enabled("valores") && <section><h2>Valores e condições</h2><div className="price-block"><span>Investimento total</span><strong>{fmtBRL(proposal.pricing.totalValue)}</strong></div><div className="payment-grid"><div><span>No aceite para agendamento</span><b>{proposal.pricing.signalPercent}% — {fmtBRL(proposal.pricing.totalValue * proposal.pricing.signalPercent / 100)}</b></div><div><span>Na entrega do laudo</span><b>{100 - proposal.pricing.signalPercent}% — {fmtBRL(balance)}</b></div></div><p>Proposta válida por {proposal.pricing.validityDays} dias, até {fmtDateShort(addDaysIso(proposal.emissionDate, proposal.pricing.validityDays))}. Prazo de execução: {proposal.pricing.executionDays ? `${proposal.pricing.executionDays} dias` : "a confirmar após o aceite"}.</p></section>}
        {enabled("fechamento") && <section className="closing"><h2>{proposal.ctaText}</h2><p>{proposal.closingMessage}</p><div className="signatures"><div><span>Contratante</span></div><div><span>{proposal.technicalManager.name}<br />{proposal.technicalManager.crea}</span></div></div></section>}
      </div><Footer page={4} />
    </article>
  </div>;
}