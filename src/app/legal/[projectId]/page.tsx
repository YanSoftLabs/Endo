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

export default async function LegalIndexPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  if (!project?.siteConfig) notFound();

  const config = siteConfigSchema.parse(project.siteConfig);
  const available = (Object.keys(PAGE_LABELS) as LegalKey[]).filter((k) => config.legal[k]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: config.designTokens.fontFamily }}>
      <SiteNav config={config} previewBase={`/preview/${projectId}`} />

      <main className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Legal</p>
        <h1 className="text-3xl font-bold mb-2">{config.businessName}</h1>
        <p className="text-gray-500 mb-10">Legal information and policies</p>

        <ul className="space-y-3">
          {available.map((key) => (
            <li key={key}>
              <a
                href={`/legal/${projectId}/${key}`}
                className="flex items-center justify-between p-4 rounded-xl border hover:shadow-md transition group"
                style={{ borderColor: config.designTokens.primaryColor + "33" }}
              >
                <span className="font-medium group-hover:text-violet-700 transition">
                  {PAGE_LABELS[key]}
                </span>
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-violet-600 transition"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </main>

      <footer className="border-t px-6 py-8" style={{ backgroundColor: "#0f172a" }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-slate-300">{config.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
