import { NextResponse, type NextRequest } from "next/server";
import {
  isMaintenanceEnabled,
  isValidUnlockToken,
  MAINTENANCE_COOKIE,
} from "@/lib/maintenance";
import { defaultLocale, isLocale } from "@/lib/i18n/routing";

const SKIP_LOCALE_PREFIX =
  /^\/(api|mantenimiento|_next|sitemap\.xml|robots\.txt|icon|apple-icon)/;

function pathnameNeedsMaintenance(pathname: string): boolean {
  return (
    !pathname.startsWith("/mantenimiento") &&
    !pathname.startsWith("/api/maintenance")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isMaintenanceEnabled() && pathnameNeedsMaintenance(pathname)) {
    const token = request.cookies.get(MAINTENANCE_COOKIE)?.value;
    if (!(await isValidUnlockToken(token))) {
      const url = request.nextUrl.clone();
      url.pathname = "/mantenimiento";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  if (
    SKIP_LOCALE_PREFIX.test(pathname) ||
    pathname.includes(".") // static files / icons
  ) {
    return NextResponse.next();
  }

  // Public URLs never show /pt — redirect to unprefixed
  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(new RegExp(`^/${defaultLocale}`), "") || "/";
    return NextResponse.redirect(url);
  }

  const first = pathname.split("/").filter(Boolean)[0];

  // Prefixed locales (es, en) pass through
  if (first && isLocale(first) && first !== defaultLocale) {
    return NextResponse.next();
  }

  // Unprefixed paths rewrite internally to /pt/...
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4)$).*)",
  ],
};
