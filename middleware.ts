import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  languageCodes,
  defaultLanguage,
  isValidLanguage,
} from "@/lib/i18n/config";

// Check user's language
async function getLocale(request: NextRequest) {
  // Check browser language
  const acceptLanguage = request.headers.get("accept-language");
  const browserLang = acceptLanguage?.split(",")?.[0].split("-")?.[0];
  return browserLang && isValidLanguage(browserLang)
    ? browserLang
    : defaultLanguage;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip API requests and special files
  if (
    pathname.startsWith("/api") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  // Check requests to home page
  if (pathname === "/") {
    const locale = await getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // If pathname already contains a valid language, continue
  const langPattern = languageCodes.join("|");
  if (new RegExp(`^/(${langPattern})(?:/|$)`).test(pathname)) {
    return NextResponse.next();
  }

  // Redirect all other requests with language
  const locale = await getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Catch all pages for language redirection, but exclude certain files and folders
    "/((?!_next/static|_next/image|favicon.ico|files/|images/|sitemap.xml|robots.txt).*)",
  ],
};

