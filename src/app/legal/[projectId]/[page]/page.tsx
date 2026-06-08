import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { siteConfigSchema } from "@/lib/schemas/site-config";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/site/SiteNav";

type LegalKey = "privacy" | "terms" | "disclaimer" | "refund";

const PAGE_LABELS: Record<LegalKey, string> = {
  privacy:    "Privacy Policy",
  terms:      "Terms & Conditions",
  disclaimer: "Disclaimer",
  refund:     "Refund Policy",
};

const VALID_PAGES = new Set<string>(["privacy", "terms", "disclaimer", "refund"]);

export default async function LegalPage({
  params,
}: {
  params: Promise<{ projectId: string; page: string }>;
}) {
  const { projectId, page } = await params;
  if (!VALID_PAGES.has(page)) notFound();
  const legalKey = page as LegalKey;

  const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  if (!project?.siteConfig) notFound();

  const config = siteConfigSchema.parse(project.siteConfig);
  const content = config.legal[legalKey];
  if (!content) notFound();

  const label = PAGE_LABELS[legalKey];
  const primaryColor = config.designTokens.primaryColor;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: config.designTokens.fontFamily }}>
      {/* Full site nav — anchor links resolved back to preview page */}
      <SiteNav config={config} previewBase={`/preview/${projectId}`} />

      {/* Legal content */}
      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Legal</p>
          <h1 className="text-3xl font-bold" style={{ color: primaryColor }}>{label}</h1>
          <p className="text-sm text-gray-400 mt-1">{config.businessName}</p>
        </div>

        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed text-[15px]">
          {content}
        </div>

        {/* Cross-links to other legal pages */}
        {(() => {
          const others = (Object.keys(PAGE_LABELS) as LegalKey[]).filter(
            (k) => k !== legalKey && config.legal[k],
          );
          if (!others.length) return null;
          return (
            <div className="mt-16 pt-8 border-t">
              <p className="text-xs text-gray-400 mb-3 uppercase tracking-widest">Other legal pages</p>
              <div className="flex flex-wrap gap-3">
                {others.map((k) => (
                  <a
                    key={k}
                    href={`/legal/${projectId}/${k}`}
                    className="text-xs px-3 py-1.5 rounded-full border hover:border-violet-400 hover:text-violet-600 transition"
                  >
                    {PAGE_LABELS[k]}
                  </a>
                ))}
              </div>
            </div>
          );
        })()}
      </main>

      <footer className="border-t px-6 py-8" style={{ backgroundColor: "#0f172a" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-4">
          <p className="text-sm text-slate-300">{config.footer.copyright}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            {config.footer.legalLinks
              .filter((l) => !l.href.endsWith(`/${page}`))
              .map((l) => (
                <a key={l.href} href={l.href} className="text-slate-400 hover:text-white transition">
                  {l.label}
                </a>
              ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
