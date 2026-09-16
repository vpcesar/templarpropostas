import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const ProposalSchema = z.object({
  id: z.string().min(1).max(100), proposalNumber: z.string().max(50), emissionDate: z.string().max(20),
  client: z.object({ name: z.string().max(300) }), serviceName: z.string().max(300),
  property: z.object({ address: z.string().max(500), complement: z.string().max(300) }),
  pricing: z.object({ totalValue: z.number(), executionDays: z.number() }), status: z.string().max(50),
  pdfPath: z.string().max(1000).optional(), updatedAt: z.string(), technicalManager: z.object({ name: z.string().max(300) })
});

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Acesso não autorizado" }, 401);
    const client = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await client.auth.getUser();
    if (!user) return json({ error: "Sessão inválida" }, 401);

    const spreadsheetId = Deno.env.get("TEMPLAR_SPREADSHEET_ID");
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const connectionKey = Deno.env.get("GOOGLE_SHEETS_API_KEY");
    if (!spreadsheetId || !lovableKey || !connectionKey) return json({ error: "Planilha não configurada" }, 503);
    const base = `https://connector-gateway.lovable.dev/google_sheets/v4/spreadsheets/${spreadsheetId}/values`;
    const headers = { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": connectionKey, "Content-Type": "application/json" };

    const existingRes = await fetch(`${base}/Propostas!A2:L1000`, { headers });
    if (!existingRes.ok) return json({ error: "Falha ao acessar a planilha", details: await existingRes.text() }, existingRes.status);
    const existing = await existingRes.json();
    const rows: unknown[][] = existing.values ?? [];

    if (req.method === "GET") {
      const proposals = rows.filter((row) => row[0]).map((row) => ({ id: row[0], proposalNumber: row[1], emissionDate: row[2], client: row[3], service: row[4], property: row[5], value: Number(row[6] || 0), deadline: row[7], status: row[8], pdfPath: row[9] || undefined, updatedAt: row[10], manager: row[11] }));
      return json({ proposals });
    }
    if (req.method !== "POST") return json({ error: "Método não permitido" }, 405);
    const parsed = ProposalSchema.safeParse((await req.json()).proposal);
    if (!parsed.success) return json({ error: "Dados inválidos", details: parsed.error.flatten().fieldErrors }, 400);
    const p = parsed.data;
    const values = [[p.id, p.proposalNumber, p.emissionDate, p.client.name, p.serviceName, [p.property.address, p.property.complement].filter(Boolean).join(" — "), p.pricing.totalValue, p.pricing.executionDays ? `${p.pricing.executionDays} dias` : "A confirmar", p.status, p.pdfPath ?? "", p.updatedAt, p.technicalManager.name]];
    const index = rows.findIndex((row) => row[0] === p.id);
    const range = index >= 0 ? `Propostas!A${index + 2}:L${index + 2}` : "Propostas!A2:L2:append";
    const url = index >= 0 ? `${base}/${range}?valueInputOption=USER_ENTERED` : `${base}/Propostas!A2:L2:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
    const response = await fetch(url, { method: index >= 0 ? "PUT" : "POST", headers, body: JSON.stringify({ range: index >= 0 ? range : "Propostas!A2:L2", majorDimension: "ROWS", values }) });
    if (!response.ok) return json({ error: "Falha ao salvar na planilha", details: await response.text() }, response.status);
    return json({ ok: true });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Erro inesperado" }, 500);
  }
});