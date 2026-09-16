export const todayIso = () => new Date().toISOString().slice(0, 10);
export const fmtBRL = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value || 0);
export const fmtDateShort = (iso: string) => iso ? new Intl.DateTimeFormat("pt-BR").format(new Date(`${iso}T12:00:00`)) : "—";
export const fmtDateLong = (iso: string) => iso ? new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${iso}T12:00:00`)) : "—";
export const addDaysIso = (iso: string, days: number) => { const date = new Date(`${iso}T12:00:00`); date.setDate(date.getDate() + (days || 0)); return date.toISOString().slice(0, 10); };
export const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");