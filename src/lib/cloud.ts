import { supabase } from "@/integrations/supabase/client";
import type { Proposal } from "@/types/proposal";

export interface SheetProposal { id: string; proposalNumber: string; emissionDate: string; client: string; service: string; property: string; value: number; deadline: string; status: string; pdfPath?: string; updatedAt: string; manager: string }

export async function listSheetProposals(): Promise<SheetProposal[]> {
  const { data, error } = await supabase.functions.invoke("proposal-sheet", { method: "GET" });
  if (error) throw error;
  return data?.proposals ?? [];
}

export async function syncProposal(proposal: Proposal) {
  const { data, error } = await supabase.functions.invoke("proposal-sheet", { body: { proposal } });
  if (error) throw error;
  return data;
}

export async function createPdfAccess(pdfPath: string) {
  const { data, error } = await supabase.storage.from("proposal-pdfs").createSignedUrl(pdfPath, 60 * 10);
  if (error) throw error;
  return data.signedUrl;
}

export async function generateTechnicalText(proposal: Proposal, field: string) {
  const { data, error } = await supabase.functions.invoke("proposal-ai", { body: { field, service: proposal.serviceName, property: proposal.property, observations: proposal.observations, currentText: proposal[field as keyof Proposal] } });
  if (error) throw error;
  return data.text as string;
}