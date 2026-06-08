import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { getSessionId } from "@/lib/session";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const sessionId = await getSessionId();
  const { id } = await params;
  const [project] = await db.select().from(projects).where(and(eq(projects.id, id), eq(projects.sessionId, sessionId))).limit(1);
  if (!project) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ id: project.id, name: project.name, siteConfig: project.siteConfig, threeDStyle: project.threeDStyle, status: project.status });
}
