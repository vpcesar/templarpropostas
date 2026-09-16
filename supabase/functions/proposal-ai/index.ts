import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

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
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "Assistente não configurado" }, 503);
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: "google/gemini-2.5-flash", messages: [{ role: "system", content: system }, { role: "user", content: prompt }], temperature: 0.25 }) });
    if (!response.ok) return json({ error: "Assistente temporariamente indisponível", details: await response.text() }, response.status);
    const result = await response.json();
    return json({ text: result.choices?.[0]?.message?.content ?? "" });
  } catch (error) { return json({ error: error instanceof Error ? error.message : "Erro inesperado" }, 500); }
});