const TEXT = new TextEncoder();

/** Opt-in gate via `MAINTENANCE_MODE=true`. Off by default — site is public. */
export function isMaintenanceEnabled(): boolean {
  const flag = process.env.MAINTENANCE_MODE;
  if (flag === undefined || flag === "") return false;
  return flag === "1" || flag.toLowerCase() === "true" || flag === "yes";
}

export function getMaintenancePassword(): string {
  return process.env.MAINTENANCE_PASSWORD || "TrE43YNH_*";
}

function getSecret(): string {
  return (
    process.env.MAINTENANCE_SECRET ||
    `bellux-gate:${getMaintenancePassword()}`
  );
}

export const MAINTENANCE_COOKIE = "bellux_gate";

async function hmacHex(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    TEXT.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, TEXT.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

export async function signUnlockToken(): Promise<string> {
  return hmacHex("unlocked");
}

export async function isValidUnlockToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  const expected = await signUnlockToken();
  return timingSafeEqualHex(token, expected);
}

export function checkMaintenancePassword(input: string): boolean {
  const expected = getMaintenancePassword();
  if (input.length !== expected.length) return false;
  let out = 0;
  for (let i = 0; i < expected.length; i++) {
    out |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return out === 0;
}
