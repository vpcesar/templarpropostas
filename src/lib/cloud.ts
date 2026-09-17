import { supabase } from "@/integrations/supabase/client";
import type { Proposal } from "@/types/proposal";

export interface SheetProposal { id: string; proposalNumber: string; emissionDate: string; client: string; service: string; property: string; value: number; deadline: string; status: string; pdfPath?: string; updatedAt: string; manager: string; sheetRow?: number }

interface SheetCache { savedAt: number; proposals: SheetProposal[] }

const SHEET_CACHE_KEY = "templar-sheet-index-v1";
const SHEET_CACHE_TTL = 5 * 60 * 1000;
let listRequest: Promise<{ proposals: SheetProposal[]; stale: boolean }> | null = null;
const syncRequests = new Map<string, Promise<unknown>>();

const readSheetCache = (): SheetCache | null => {
  try {
    const parsed = JSON.parse(localStorage.getItem(SHEET_CACHE_KEY) ?? "null") as SheetCache | null;
    return parsed && Array.isArray(parsed.proposals) ? parsed : null;
  } catch {
    return null;
  }
};

const writeSheetCache = (proposals: SheetProposal[]) => localStorage.setItem(SHEET_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), proposals } satisfies SheetCache));

const proposalSummary = (proposal: Proposal, sheetRow?: number): SheetProposal => ({
  id: proposal.id,
  proposalNumber: proposal.proposalNumber,
  emissionDate: proposal.emissionDate,
  client: proposal.client.name,
  service: proposal.serviceName,
  property: [proposal.property.address, proposal.property.complement].filter(Boolean).join(" — "),
  value: proposal.pricing.totalValue,
  deadline: proposal.pricing.executionDays ? `${proposal.pricing.executionDays} dias` : "A confirmar",
  status: proposal.status,
  pdfPath: proposal.pdfPath,
  updatedAt: proposal.updatedAt,
  manager: proposal.technicalManager.name,
  sheetRow,
});

export async function listSheetProposals(): Promise<{ proposals: SheetProposal[]; stale: boolean }> {
  const cached = readSheetCache();
  if (cached && Date.now() - cached.savedAt < SHEET_CACHE_TTL) return { proposals: cached.proposals, stale: false };
  if (listRequest) return listRequest;
  listRequest = (async () => {
    const { data, error } = await supabase.functions.invoke("proposal-sheet", { method: "GET" });
    if (error) {
      if (cached) return { proposals: cached.proposals, stale: true };
      throw error;
    }
    const proposals = (data?.proposals ?? []) as SheetProposal[];
    writeSheetCache(proposals);
    return { proposals, stale: false };
  })().finally(() => { listRequest = null; });
  return listRequest;
}

export async function syncProposal(proposal: Proposal) {
  const pending = syncRequests.get(proposal.id);
  if (pending) return pending;
  const request = (async () => {
    const cached = readSheetCache();
    const existing = cached?.proposals.find((item) => item.id === proposal.id);
    const { data, error } = await supabase.functions.invoke("proposal-sheet", { body: { proposal, rowHint: existing?.sheetRow ?? null } });
    if (error) throw error;
    const sheetRow = Number(data?.sheetRow ?? existing?.sheetRow ?? 0) || undefined;
    const current = readSheetCache()?.proposals ?? [];
    const summary = proposalSummary(proposal, sheetRow);
    writeSheetCache([summary, ...current.filter((item) => item.id !== proposal.id)]);
    return data;
  })().finally(() => { syncRequests.delete(proposal.id); });
  syncRequests.set(proposal.id, request);
  return request;
}

export async function createPdfAccess(pdfPath: string) {
  const { data, error } = await supabase.storage.from("proposal-pdfs").createSignedUrl(pdfPath, 60 * 10);
  if (error) throw error;
  return data.signedUrl;
}

export async function generateTechnicalText(proposal: Proposal, field: string) {
  const { data, error } = await supabase.functions.invoke("proposal-ai", { body: { field, service: proposal.serviceName, property: proposal.property, observations: proposal.observations, currentText: proposal[field as keyof Proposal] } });
  if (error) throw new Error(data?.error || error.message);
  return data.text as string;
}

export async function getGeminiSettings() {
  const { data, error } = await supabase.functions.invoke("gemini-settings", { method: "GET" });
  if (error) throw new Error(data?.error || error.message);
  return data as { ok: boolean; configured: boolean; error?: string };
}

export async function updateGeminiSettings(action: "save" | "test" | "remove", apiKey?: string) {
  const { data, error } = await supabase.functions.invoke("gemini-settings", { body: { action, ...(apiKey ? { apiKey } : {}) } });
  if (error) throw new Error(data?.error || error.message);
  return data as { ok: boolean; configured: boolean; message?: string; error?: string };
}