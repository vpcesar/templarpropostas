export type ServiceKey =
  | "laudo-tecnico" | "vistoria-tecnica" | "vistoria-entrega-obra"
  | "vistoria-entrega-chaves" | "vistoria-locativa-entrada" | "vistoria-locativa-saida"
  | "vistoria-constatacao" | "vistoria-constatacao-obra" | "vistoria-cautelar-vizinhanca"
  | "vistoria-causalidade" | "vistoria-conformidade" | "vistoria-reforma"
  | "inspecao-predial" | "avaliacao-imoveis";

export type SectionId = "capa" | "responsavel" | "cliente" | "objeto" | "servico" | "objetivo" | "itensConstantes" | "metodologia" | "entregaveis" | "valores" | "naoIncluido" | "fechamento";
export type PayMode = "percentual" | "cartao" | "pix" | "boleto";
export type ProposalStatus = "Rascunho" | "Enviada" | "Aprovada" | "Recusada";

export interface ProposalSection { id: SectionId; label: string; enabled: boolean }
export interface Proposal {
  id: string; createdAt: string; updatedAt: string; proposalNumber: string; emissionDate: string;
  serviceKey: ServiceKey; serviceName: string; status: ProposalStatus;
  brand: { logo?: string; primaryColor: string; secondaryColor: string };
  technicalManager: { name: string; title: string; crea: string };
  client: { name: string; document: string; email: string; phone: string };
  property: { address: string; complement: string; description: string };
  sections: ProposalSection[]; cover: { title: string; subtitle: string };
  scopeObjective: string; scopeItems: string; methodology: string; deliverables: string;
  notIncluded: string; commonExclusions: string;
  pricing: { totalValue: number; payMode: PayMode; signalPercent: number; installments: number; pixDiscount: number; validityDays: number; executionDays: number };
  closingMessage: string; ctaText: string; observations: string; pdfPath?: string;
}

export interface ServiceTemplate {
  key: ServiceKey; name: string; shortDescription: string; objective: string;
  scopeItems: string; methodology: string; deliverables: string; notIncluded: string;
}