import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/Button";
import { serviceTemplates } from "@/data/templates";
import { emptyClient } from "@/store/proposals";
import type { Proposal, ServiceKey } from "@/types/proposal";

export function NewProposalWizard({ initialService, onClose, onCreate }: { initialService?: ServiceKey; onClose: () => void; onCreate: (service: ServiceKey, seed: Partial<Proposal>) => void }) {
  const [step, setStep] = useState(initialService ? 2 : 1); const [service, setService] = useState<ServiceKey>(initialService ?? "avaliacao-imoveis");
  const [client, setClient] = useState(""); const [address, setAddress] = useState(""); const [value, setValue] = useState(0); const [days, setDays] = useState(0);
  const finish = () => onCreate(service, { client: { ...emptyClient(), name: client }, property: { address, complement: "", description: "" }, pricing: { totalValue: value, payMode: "percentual", signalPercent: 50, installments: 1, pixDiscount: 0, validityDays: 10, executionDays: days } });
  return <div className="modal-backdrop" role="dialog" aria-modal="true"><div className="wizard">
    <div className="wizard__head"><div><span>NOVA PROPOSTA</span><h2>{step === 1 ? "Escolha o serviço" : step === 2 ? "Contratante e objeto" : "Valores e prazo"}</h2></div><Button variant="ghost" onClick={onClose} icon={<X size={19} />} aria-label="Fechar" /></div>
    <div className="stepper"><i className={step >= 1 ? "active" : ""}>1</i><span /><i className={step >= 2 ? "active" : ""}>2</i><span /><i className={step >= 3 ? "active" : ""}>3</i></div>
    {step === 1 && <div className="service-picker">{serviceTemplates.map((item, index) => <button key={item.key} className={service === item.key ? "selected" : ""} onClick={() => setService(item.key)}><small>{String(index + 1).padStart(2, "0")}</small><b>{item.name}</b></button>)}</div>}
    {step === 2 && <div className="form-stack"><label>Nome do contratante<input value={client} onChange={(e) => setClient(e.target.value)} autoFocus placeholder="Nome completo ou razão social" /></label><label>Endereço do imóvel / local<input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rua, número, bairro e cidade" /></label></div>}
    {step === 3 && <div className="form-grid"><label>Valor total (R$)<input type="number" min="0" value={value} onChange={(e) => setValue(Number(e.target.value))} /></label><label>Prazo de execução (dias)<input type="number" min="0" value={days} onChange={(e) => setDays(Number(e.target.value))} /></label><div className="wizard-note">A condição padrão será 50% no aceite para agendamento e 50% na entrega do laudo.</div></div>}
    <div className="wizard__foot"><button className="text-action" onClick={() => onCreate("avaliacao-imoveis", {})}>Pular e começar do zero</button><div>{step > 1 && <Button variant="secondary" onClick={() => setStep(step - 1)} icon={<ArrowLeft size={16} />}>Voltar</Button>} {step < 3 ? <Button onClick={() => setStep(step + 1)} icon={<ArrowRight size={16} />}>Continuar</Button> : <Button onClick={finish} icon={<Check size={16} />}>Criar proposta</Button>}</div></div>
  </div></div>;
}