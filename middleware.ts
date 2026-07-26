import { NextResponse, type NextRequest } from "next/server";
import {
  isMaintenanceEnabled,
  isValidUnlockToken,
  MAINTENANCE_COOKIE,
} from "@/lib/maintenance";

export async function middleware(request: NextRequest) {
  if (!isMaintenanceEnabled()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/mantenimiento") ||
    pathname.startsWith("/api/maintenance")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(MAINTENANCE_COOKIE)?.value;
  if (await isValidUnlockToken(token)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/mantenimiento";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4)$).*)",
  ],
};
