const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64(bytes: Uint8Array) {
  let value = "";
  for (const byte of bytes) value += String.fromCharCode(byte);
  return btoa(value);
}

function base64ToBytes(value: string) {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

async function getKey() {
  const secret = Deno.env.get("TEMPLAR_CREDENTIALS_ENCRYPTION_KEY");
  if (!secret) throw new Error("A proteção das credenciais não está configurada");
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
}

export async function encryptCredential(value: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await getKey(), encoder.encode(value));
  return `${bytesToBase64(iv)}.${bytesToBase64(new Uint8Array(encrypted))}`;
}

export async function decryptCredential(value: string) {
  const [ivValue, encryptedValue] = value.split(".");
  if (!ivValue || !encryptedValue) throw new Error("Credencial inválida");
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: base64ToBytes(ivValue) }, await getKey(), base64ToBytes(encryptedValue));
  return decoder.decode(decrypted);
}

export async function testGeminiKey(apiKey: string) {
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({ contents: [{ parts: [{ text: "Responda apenas OK" }] }], generationConfig: { maxOutputTokens: 8, temperature: 0 } }),
  });
  if (!response.ok) {
    const result = await response.json().catch(() => null);
    const message = result?.error?.message;
    throw new Error(typeof message === "string" ? message : `O Gemini recusou a conexão (${response.status})`);
  }
}