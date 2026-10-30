import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import { commonExclusions, defaultSections, serviceTemplates } from "@/data/templates";
import { addDaysIso, todayIso } from "@/lib/proposal-utils";
import type { Proposal, ServiceKey } from "@/types/proposal";
import { useSettingsStore } from "@/store/settings";

const COUNTER_KEY = "templar-proposals-counter-v1";
const nextNumber = () => {
  const current = Number(localStorage.getItem(COUNTER_KEY) || "0") + 1;
  localStorage.setItem(COUNTER_KEY, String(current));
  return `PROP-${String(current).padStart(4, "0")}`;
};

export const emptyClient = () => ({ name: "", document: "", email: "", phone: "", street: "", neighborhood: "", city: "" });
const emptyScope = () => ({ floorPlanImages: [] as string[], interventionArea: 0, sectionsToEvaluate: "", providedDocuments: "", objectSummary: "" });

/** Completa propostas antigas com os campos do Pitch Deck. */
export const normalizeProposal = (p: Proposal): Proposal => ({
  ...p,
  client: { ...emptyClient(), ...p.client },
  scope: { ...emptyScope(), ...p.scope },
  commercial: { totalValue: p.pricing?.totalValue ?? 0, installmentModel: "50/50", deliveryDeadline: p.pricing?.executionDays ? `${p.pricing.executionDays} dias` : "", validUntil: addDaysIso(p.emissionDate, p.pricing?.validityDays ?? 10), inspectionCount: 1, ...p.commercial },
  operational: { engineer: p.technicalManager?.name ?? "", crea: p.technicalManager?.crea ?? "", role: p.technicalManager?.title ?? "", ...p.operational },
});

const buildProposal = (serviceKey: ServiceKey): Proposal => {
  const template = serviceTemplates.find((item) => item.key === serviceKey) ?? serviceTemplates[13];
  const now = new Date().toISOString();
  return {
    id: nanoid(12), createdAt: now, updatedAt: now, proposalNumber: nextNumber(), emissionDate: todayIso(),
    serviceKey: template.key, serviceName: template.name, status: "Rascunho",
    brand: { logo: useSettingsStore.getState().defaultLogo, primaryColor: "#b08d57", secondaryColor: "#20262d" },
    technicalManager: { name: "Vinicius Cesar", title: "Engenheiro Civil", crea: "CREA-RJ 2024100977" },
    client: emptyClient(),
    property: { address: "", complement: "", description: "" },
    sections: defaultSections.map(([id, label]) => ({ id, label, enabled: true })),
    cover: { title: template.name.toUpperCase(), subtitle: "PROPOSTA COMERCIAL TÉCNICA" },
    scopeObjective: template.objective, scopeItems: template.scopeItems, methodology: template.methodology,
    deliverables: template.deliverables, notIncluded: template.notIncluded, commonExclusions,
    pricing: { totalValue: 0, payMode: "percentual", signalPercent: 50, installments: 1, pixDiscount: 0, validityDays: 10, executionDays: 0 },
    closingMessage: "Permanecemos à disposição para os esclarecimentos necessários e para o agendamento do serviço.",
    ctaText: "Aceite da proposta", observations: "",
    scope: emptyScope(),
    commercial: { totalValue: 0, installmentModel: "50/50", deliveryDeadline: "", validUntil: addDaysIso(todayIso(), 10), inspectionCount: 1 },
    operational: { engineer: "Vinicius Cesar", crea: "CREA-RJ 2024100977", role: "Engenheiro Civil" },
  };
};

interface ProposalState {
  proposals: Proposal[];
  createFromTemplate: (serviceKey: ServiceKey) => Proposal;
  update: (id: string, changes: Partial<Proposal>) => void;
  remove: (id: string) => void;
  applyDefaultLogo: (logo?: string) => void;
  get: (id: string) => Proposal | undefined;
}

export const useProposalStore = create<ProposalState>()(persist((set, get) => ({
  proposals: [],
  createFromTemplate: (serviceKey) => {
    const proposal = buildProposal(serviceKey);
    set((state) => ({ proposals: [proposal, ...state.proposals] }));
    return proposal;
  },
  update: (id, changes) => set((state) => ({ proposals: state.proposals.map((proposal) => proposal.id === id ? { ...proposal, ...changes, updatedAt: new Date().toISOString() } : proposal) })),
  remove: (id) => set((state) => ({ proposals: state.proposals.filter((proposal) => proposal.id !== id) })),
  applyDefaultLogo: (logo) => set((state) => ({ proposals: state.proposals.map((proposal) => ({ ...proposal, brand: { ...proposal.brand, logo }, updatedAt: new Date().toISOString() })) })),
  get: (id) => get().proposals.find((proposal) => proposal.id === id),
}), { name: "templar-proposals-v1", version: 2, migrate: (state) => { const s = state as { proposals?: Proposal[] }; return { ...s, proposals: (s.proposals ?? []).map(normalizeProposal) } as ProposalState; } }));