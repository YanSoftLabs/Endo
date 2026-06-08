import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { SiteRenderer } from "@/lib/site-templates/site-renderer";
import { siteConfigSchema } from "@/lib/schemas/site-config";
import { notFound } from "next/navigation";

export default async function PreviewPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  if (!project?.siteConfig) notFound();
  const config = siteConfigSchema.parse(project.siteConfig);
  return <SiteRenderer config={config} />;
}
