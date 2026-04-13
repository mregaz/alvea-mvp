import { NextRequest, NextResponse } from 'next/server'
import { LOCALES, DEFAULT_LOCALE, type Locale } from '@/lib/constants'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip Next.js internals and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Already has a valid locale prefix — let it through
  const hasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  if (hasLocale) return NextResponse.next()

  // Determine best locale:
  // 1. Cookie preference (set by LanguageSwitcher)
  // 2. Default locale (IT)
  // Note: Accept-Language detection intentionally omitted for MVP —
  // keeps behaviour predictable and avoids edge cases with Swiss multilingual browsers.
  const cookieLocale = request.cookies.get('alvea_locale')?.value
  const locale: Locale =
    cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)
      ? (cookieLocale as Locale)
      : DEFAULT_LOCALE

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
