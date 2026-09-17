import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";
import { decryptCredential } from "../_shared/gemini-credentials.ts";

const BodySchema = z.object({ field: z.enum(["scopeObjective", "scopeItems", "methodology", "deliverables", "notIncluded"]), service: z.string().max(300), property: z.object({ address: z.string().max(500), complement: z.string().max(300), description: z.string().max(2000) }), observations: z.string().max(4000), currentText: z.unknown() });
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Acesso não autorizado" }, 401);
    const client = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await client.auth.getUser();
    if (!user) return json({ error: "Sessão inválida" }, 401);
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Dados inválidos" }, 400);
    const input = parsed.data;
    const system = `Você é assistente técnico da Templar Engenharia. Escreva em português brasileiro, com clareza técnica e sem linguagem promocional. Nunca invente dados, normas, medições, diagnósticos ou conclusões. Quando faltar informação indispensável, use [A CONFIRMAR]. Respeite rigorosamente a fronteira do serviço contratado. Em Não Incluído, detalhe limites com precisão. Não dê parecer jurídico. Entregue somente a sugestão para o bloco pedido, seguida de “Observações ao engenheiro:” com no máximo três apontamentos. A sugestão nunca será aplicada automaticamente.`;
    const prompt = `Bloco: ${input.field}\nServiço: ${input.service}\nImóvel: ${input.property.address || "[A CONFIRMAR]"} ${input.property.complement}\nDescrição: ${input.property.description || "[A CONFIRMAR]"}\nObservações: ${input.observations || "Nenhuma"}\nTexto atual: ${String(input.currentText ?? "")}\n\nProduza uma versão tecnicamente segura e pronta para revisão.`;
    const admin = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    const { data: credential } = await admin.from("gemini_credentials").select("encrypted_api_key").eq("user_id", user.id).maybeSingle();
    if (!credential) return json({ error: "Configure a chave Gemini em Configurações antes de usar o assistente." }, 400);
    const apiKey = await decryptCredential(credential.encrypted_api_key);
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent", { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey }, body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.25 } }) });
    if (!response.ok) { const failure = await response.json().catch(() => null); return json({ error: failure?.error?.message || `O Gemini retornou erro ${response.status}` }, response.status); }
    const result = await response.json();
    return json({ text: result.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("") ?? "" });
  } catch (error) { return json({ error: error instanceof Error ? error.message : "Erro inesperado" }, 500); }
});