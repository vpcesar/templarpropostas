import { LogOut, Plus, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/Button";

export function AppHeader({ onNew }: { onNew?: () => void }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  return <header className="app-header">
    <a href="/" className="wordmark" aria-label="Templar Engenharia — início"><span className="wordmark__mark">T</span><span><b>TEMPLAR</b><small>ENGENHARIA</small></span></a>
    <div className="app-header__actions">
      {onNew && <Button onClick={onNew} icon={<Plus size={16} />}>Nova proposta</Button>}
      <span className="user-email">{user?.email}</span>
      <Button variant="ghost" icon={<Settings size={17} />} onClick={() => navigate("/configuracoes")} aria-label="Configurações" title="Configurações" />
      <Button variant="ghost" icon={<LogOut size={17} />} onClick={() => signOut()} aria-label="Sair" title="Sair" />
    </div>
  </header>;
}