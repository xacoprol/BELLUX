import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type ContactBody = {
  name?: string;
  email?: string;
  phone?: string;
  eventType?: string;
  details?: string;
};

function trim(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  const to = (process.env.CONTACT_TO || user || "").trim();
  const from =
    process.env.SMTP_FROM?.trim() ||
    (user ? `Bellux Entertainment <${user}>` : "");
  const port = Number(process.env.SMTP_PORT || 587);
  const secure =
    process.env.SMTP_SECURE === "true" ||
    process.env.SMTP_SECURE === "1" ||
    port === 465;

  if (!host || !user || !pass || !to || !from) {
    console.error("[contact] SMTP env vars missing");
    return NextResponse.json({ ok: false, error: "config" }, { status: 503 });
  }

  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const name = trim(body.name, 120);
  const email = trim(body.email, 160).toLowerCase();
  const phone = trim(body.phone, 40);
  const eventType = trim(body.eventType, 80);
  const details = String(body.details ?? "")
    .trim()
    .slice(0, 4000);

  if (!name || !email || !details || !isEmail(email)) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    requireTLS: !secure && port === 587,
  });

  const text = [
    "Novo pedido de contacto — Bellux Entertainment",
    "",
    `Nome: ${name}`,
    `Email: ${email}`,
    `Telefone: ${phone || "—"}`,
    `Tipo de evento: ${eventType || "—"}`,
    "",
    "Detalhes:",
    details,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#111">
      <h2 style="margin:0 0 12px">Novo pedido de contacto</h2>
      <p style="margin:0 0 16px;color:#555">Bellux Entertainment · formulário web</p>
      <table style="border-collapse:collapse;width:100%;max-width:560px">
        <tr><td style="padding:6px 0;color:#666;width:140px">Nome</td><td style="padding:6px 0"><strong>${escapeHtml(name)}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#666">Email</td><td style="padding:6px 0"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:6px 0;color:#666">Telefone</td><td style="padding:6px 0">${escapeHtml(phone || "—")}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Tipo de evento</td><td style="padding:6px 0">${escapeHtml(eventType || "—")}</td></tr>
      </table>
      <p style="margin:18px 0 6px;color:#666">Detalhes</p>
      <p style="margin:0;white-space:pre-wrap">${escapeHtml(details)}</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: `${name} <${email}>`,
      subject: `Contacto web${eventType ? ` · ${eventType}` : ""} — ${name}`,
      text,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] SMTP send failed", err);
    return NextResponse.json({ ok: false, error: "send" }, { status: 502 });
  }
}
