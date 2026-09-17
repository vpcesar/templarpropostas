import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";
import { decryptCredential, encryptCredential, testGeminiKey } from "../_shared/gemini-credentials.ts";

const BodySchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("save"), apiKey: z.string().trim().min(20).max(500) }),
  z.object({ action: z.literal("test") }),
  z.object({ action: z.literal("remove") }),
]);
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ ok: false, error: "Acesso não autorizado" }, 401);
    const url = Deno.env.get("SUPABASE_URL") ?? "";
    const anon = createClient(url, Deno.env.get("SUPABASE_ANON_KEY") ?? "", { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await anon.auth.getUser();
    if (!user) return json({ ok: false, error: "Sessão inválida" }, 401);
    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");

    if (req.method === "GET") {
      const { data } = await admin.from("gemini_credentials").select("user_id").eq("user_id", user.id).maybeSingle();
      return json({ ok: true, configured: !!data });
    }

    const parsed = BodySchema.safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) return json({ ok: false, error: "Solicitação inválida" }, 400);
    if (parsed.data.action === "remove") {
      const { error } = await admin.from("gemini_credentials").delete().eq("user_id", user.id);
      if (error) throw error;
      return json({ ok: true, configured: false });
    }
    if (parsed.data.action === "save") {
      await testGeminiKey(parsed.data.apiKey);
      const encrypted = await encryptCredential(parsed.data.apiKey);
      const { error } = await admin.from("gemini_credentials").upsert({ user_id: user.id, encrypted_api_key: encrypted }, { onConflict: "user_id" });
      if (error) throw error;
      return json({ ok: true, configured: true, message: "Chave verificada e salva com segurança." });
    }
    const { data, error } = await admin.from("gemini_credentials").select("encrypted_api_key").eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    if (!data) return json({ ok: false, configured: false, error: "Nenhuma chave Gemini está configurada." });
    await testGeminiKey(await decryptCredential(data.encrypted_api_key));
    return json({ ok: true, configured: true, message: "Conexão com o Gemini confirmada." });
  } catch (error) {
    return json({ ok: false, error: error instanceof Error ? error.message : "Não foi possível concluir a configuração" });
  }
});