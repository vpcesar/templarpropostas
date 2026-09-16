import { FileQuestion } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";

export default function ProposalNotFound() { const navigate = useNavigate(); return <main className="not-found"><FileQuestion size={38} /><span className="eyebrow">PROPOSTA NÃO ENCONTRADA</span><h1>Este documento não está disponível neste navegador.</h1><p>Ele pode ter sido removido ou criado em outro dispositivo.</p><Button onClick={() => navigate("/")}>Voltar para propostas</Button></main>; }