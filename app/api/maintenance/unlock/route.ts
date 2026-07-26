import { NextResponse } from "next/server";
import {
  checkMaintenancePassword,
  isMaintenanceEnabled,
  MAINTENANCE_COOKIE,
  signUnlockToken,
} from "@/lib/maintenance";

export async function POST(request: Request) {
  if (!isMaintenanceEnabled()) {
    return NextResponse.json({ ok: true, disabled: true });
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = String(body.password ?? "");
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  if (!checkMaintenancePassword(password)) {
    return NextResponse.json({ ok: false, error: "wrong" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: MAINTENANCE_COOKIE,
    value: await signUnlockToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
