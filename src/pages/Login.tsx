import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/Button";

export default function Login() {
  const { signIn, user } = useAuth(); const navigate = useNavigate();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  if (user) return <Navigate to="/" replace />;
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setLoading(true); setError(""); const result = await signIn(email, password); setLoading(false); if (result.error) setError("E-mail ou senha incorretos. Verifique os dados e tente novamente."); else navigate("/"); };
  return <main className="login-page"><div className="login-brand"><div className="wordmark wordmark--large"><span className="wordmark__mark">T</span><span><b>TEMPLAR</b><small>ENGENHARIA</small></span></div><div><span className="eyebrow">DOCUMENTAÇÃO TÉCNICA</span><h1>Propostas precisas.<br />Decisões seguras.</h1><p>Ambiente interno para elaboração e gestão de propostas comerciais técnicas.</p></div><blockquote>“Verdade Técnica, Justiça Garantida.”</blockquote></div>
  <div className="login-panel"><form onSubmit={submit}><div className="login-icon"><LockKeyhole size={22} /></div><span className="eyebrow">ACESSO RESTRITO</span><h2>Entre na sua conta</h2><p>Use as credenciais cadastradas pela Templar Engenharia.</p><label>E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@templarengenharia.com.br" required autoFocus /></label><label>Senha<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" minLength={6} required /></label>{error && <div className="form-error">{error}</div>}<Button type="submit" disabled={loading} icon={<ArrowRight size={17} />}>{loading ? "Entrando..." : "Entrar no gerador"}</Button></form><small>Uso exclusivo de usuários autorizados.</small></div></main>;
}