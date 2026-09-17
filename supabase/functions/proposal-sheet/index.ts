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

const SaveSchema = z.object({
  proposal: ProposalSchema,
  rowHint: z.number().int().min(2).max(100000).nullable().optional(),
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

    if (req.method === "GET") {
      const existingRes = await fetch(`${base}/Propostas!A2:L1000`, { headers });
      if (!existingRes.ok) {
        const details = await existingRes.text();
        const responseHeaders = existingRes.status === 429 ? { ...corsHeaders, "Content-Type": "application/json", "Retry-After": existingRes.headers.get("Retry-After") ?? "60" } : { ...corsHeaders, "Content-Type": "application/json" };
        return new Response(JSON.stringify({ error: existingRes.status === 429 ? "O Google Sheets atingiu o limite temporário de leituras" : "Falha ao acessar a planilha", details }), { status: existingRes.status, headers: responseHeaders });
      }
      const existing = await existingRes.json();
      const rows: unknown[][] = existing.values ?? [];
      const proposals = rows.filter((row) => row[0]).map((row, index) => ({ id: row[0], proposalNumber: row[1], emissionDate: row[2], client: row[3], service: row[4], property: row[5], value: Number(row[6] || 0), deadline: row[7], status: row[8], pdfPath: row[9] || undefined, updatedAt: row[10], manager: row[11], sheetRow: index + 2 }));
      return json({ proposals });
    }
    if (req.method !== "POST") return json({ error: "Método não permitido" }, 405);
    const parsed = SaveSchema.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Dados inválidos", details: parsed.error.flatten().fieldErrors }, 400);
    const { proposal: p, rowHint } = parsed.data;
    const values = [[p.id, p.proposalNumber, p.emissionDate, p.client.name, p.serviceName, [p.property.address, p.property.complement].filter(Boolean).join(" — "), p.pricing.totalValue, p.pricing.executionDays ? `${p.pricing.executionDays} dias` : "A confirmar", p.status, p.pdfPath ?? "", p.updatedAt, p.technicalManager.name]];
    const range = rowHint ? `Propostas!A${rowHint}:L${rowHint}` : "Propostas!A2:L2";
    const url = rowHint ? `${base}/${range}?valueInputOption=USER_ENTERED` : `${base}/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
    const response = await fetch(url, { method: rowHint ? "PUT" : "POST", headers, body: JSON.stringify({ range, majorDimension: "ROWS", values }) });
    if (!response.ok) return json({ error: "Falha ao salvar na planilha", details: await response.text() }, response.status);
    const result = await response.json().catch(() => ({}));
    const updatedRange = String(result.updatedRange ?? result.updates?.updatedRange ?? "");
    const parsedRow = Number(updatedRange.match(/![A-Z]+(\d+):/)?.[1] ?? rowHint ?? 0);
    return json({ ok: true, sheetRow: parsedRow || undefined });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Erro inesperado" }, 500);
  }
});