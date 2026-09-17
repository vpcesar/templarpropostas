import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, ImagePlus, KeyRound, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/Button";
import { getGeminiSettings, updateGeminiSettings } from "@/lib/cloud";
import { useProposalStore } from "@/store/proposals";
import { useSettingsStore } from "@/store/settings";

const MAX_LOGO_BYTES = 1024 * 1024;

export default function Settings() {
  const navigate = useNavigate();
  const defaultLogo = useSettingsStore((state) => state.defaultLogo);
  const setDefaultLogo = useSettingsStore((state) => state.setDefaultLogo);
  const applyDefaultLogo = useProposalStore((state) => state.applyDefaultLogo);
  const [apiKey, setApiKey] = useState("");
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<"save" | "test" | "remove" | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getGeminiSettings().then((result) => setConfigured(result.configured)).catch((reason) => setError(reason instanceof Error ? reason.message : "Não foi possível verificar a configuração.")).finally(() => setLoading(false));
  }, []);

  const readLogo = (file?: File) => {
    setError("");
    if (!file) return;
    if (!file.type.match(/^image\/(png|jpeg)$/)) return setError("Escolha uma imagem PNG ou JPEG.");
    if (file.size > MAX_LOGO_BYTES) return setError("O logotipo deve ter no máximo 1 MB.");
    const reader = new FileReader();
    reader.onload = () => { setDefaultLogo(String(reader.result)); setNotice("Logotipo padrão salvo neste navegador."); };
    reader.readAsDataURL(file);
  };

  const runAction = async (action: "save" | "test" | "remove") => {
    setBusy(action); setError(""); setNotice("");
    try {
      const result = await updateGeminiSettings(action, action === "save" ? apiKey.trim() : undefined);
      if (!result.ok) throw new Error(result.error || "Não foi possível concluir.");
      setConfigured(result.configured); setNotice(result.message || (action === "remove" ? "Chave removida." : "Configuração atualizada."));
      if (action === "save" || action === "remove") setApiKey("");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível concluir."); }
    finally { setBusy(null); }
  };

  return <div className="settings-shell"><AppHeader /><main className="settings-main">
    <Button variant="ghost" onClick={() => navigate("/")} icon={<ArrowLeft size={17} />}>Voltar às propostas</Button>
    <header className="settings-intro"><span className="eyebrow">PREFERÊNCIAS DO GERADOR</span><h1>Configurações</h1><p>Defina a marca usada nas novas propostas e conecte o assistente Gemini.</p></header>
    {(notice || error) && <div className={error ? "settings-message settings-message--error" : "settings-message"}>{error || notice}</div>}
    <div className="settings-grid">
      <section className="settings-section"><div className="settings-section__heading"><ImagePlus size={20} /><div><h2>Marca</h2><p>Logotipo padrão das novas propostas.</p></div></div>
        <div className="logo-setting"><div className="logo-preview">{defaultLogo ? <img src={defaultLogo} alt="Logotipo padrão" /> : <span>Sem logotipo</span>}</div><div className="settings-actions"><label className="file-input"><ImagePlus size={16} />{defaultLogo ? "Trocar logotipo" : "Enviar logotipo"}<input type="file" accept="image/png,image/jpeg" onChange={(event) => readLogo(event.target.files?.[0])} /></label>{defaultLogo && <Button variant="ghost" icon={<Trash2 size={16} />} onClick={() => { setDefaultLogo(undefined); setNotice("Logotipo padrão removido."); }}>Remover</Button>}</div></div>
        <div className="settings-divider" /><h3>Propostas já criadas</h3><p className="settings-help">Aplique o logotipo atual a todas as propostas guardadas neste navegador.</p><Button variant="secondary" disabled={!defaultLogo} onClick={() => { applyDefaultLogo(defaultLogo); setNotice("Logotipo aplicado às propostas deste navegador."); }} icon={<RefreshCw size={16} />}>Aplicar às propostas existentes</Button>
      </section>
      <section className="settings-section"><div className="settings-section__heading"><KeyRound size={20} /><div><h2>Assistente Gemini</h2><p>A chave fica protegida e não volta para o navegador.</p></div></div>
        <div className="credential-status">{loading ? <Loader2 className="spin" size={16} /> : <CheckCircle2 size={16} />}<span>{loading ? "Verificando..." : configured ? "Chave configurada" : "Chave não configurada"}</span></div>
        <label className="settings-field">{configured ? "Nova chave para substituir a atual" : "Chave de API do Gemini"}<input type="password" value={apiKey} onChange={(event) => setApiKey(event.target.value)} autoComplete="off" placeholder="Cole a chave aqui" /></label>
        <div className="settings-actions"><Button disabled={busy !== null || apiKey.trim().length < 20} onClick={() => runAction("save")} icon={busy === "save" ? <Loader2 className="spin" size={16} /> : <KeyRound size={16} />}>{configured ? "Testar e substituir" : "Testar e salvar"}</Button>{configured && <Button variant="secondary" disabled={busy !== null} onClick={() => runAction("test")} icon={busy === "test" ? <Loader2 className="spin" size={16} /> : <RefreshCw size={16} />}>Testar conexão</Button>}</div>
        {configured && <Button className="credential-remove" variant="danger" disabled={busy !== null} onClick={() => { if (confirm("Remover a chave Gemini configurada?")) runAction("remove"); }} icon={<Trash2 size={16} />}>Remover chave</Button>}
      </section>
    </div>
  </main></div>;
}