"use client";

import type { SiteConfig } from "@/lib/schemas/site-config";

/** When rendered on a legal page, pass `previewBase` (e.g. `/preview/[projectId]`)
 *  so anchor links like `#faq` become `/preview/[projectId]#faq`. */
export function SiteNav({ config, previewBase }: { config: SiteConfig; previewBase?: string }) {
  const t = config.designTokens;

  function resolveHref(href: string) {
    if (previewBase && href.startsWith("#")) {
      return `${previewBase}${href}`;
    }
    return href;
  }

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md border-b border-gray-200 shadow-sm"
      style={{ backgroundColor: "rgba(255,255,255,0.96)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {/* Brand */}
        <a
          href={`/preview/${config.projectId ?? ""}`}
          className="min-w-0 hover:opacity-80 transition"
        >
          <span
            className="font-bold text-xl tracking-tight block truncate"
            style={{ color: t.primaryColor }}
          >
            {config.businessName}
          </span>
          {config.tagline && (
            <span className="text-xs text-gray-500 uppercase tracking-widest hidden sm:block truncate">
              {config.tagline}
            </span>
          )}
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 shrink-0">
          {config.nav.links.map((l) => (
            <a
              key={l.href}
              href={resolveHref(l.href)}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
            >
              {l.label}
            </a>
          ))}
          <a
            href={resolveHref(config.nav.ctaUrl)}
            className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold shadow-sm hover:opacity-90 transition"
            style={{ backgroundColor: t.primaryColor }}
          >
            {config.nav.ctaLabel}
          </a>
        </div>

        {/* Mobile hamburger placeholder — good enough for preview */}
        <button className="md:hidden p-2 rounded-lg border text-gray-600" aria-label="Menu">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M3 6h14M3 10h14M3 14h14" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
