import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { projects, chatMessages } from "@/lib/db/schema";
import { getSessionId } from "@/lib/session";
import { siteConfigSchema } from "@/lib/schemas/site-config";
import { processChatEdit } from "@/lib/ai/chat-agent";

export async function POST(req: Request) {
  try {
    const sessionId = await getSessionId();
    const { projectId, message } = await req.json();

    if (!projectId || !message?.trim()) {
      return Response.json({ error: "Missing projectId or message" }, { status: 400 });
    }

    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.sessionId, sessionId)))
      .limit(1);

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    const siteConfig = siteConfigSchema.parse(project.siteConfig);
    const { message: reply, updatedConfig, patches } = await processChatEdit(message.trim(), siteConfig);

    await db
      .update(projects)
      .set({ siteConfig: updatedConfig as unknown as Record<string, unknown>, updatedAt: new Date() })
      .where(eq(projects.id, projectId));

    await db.insert(chatMessages).values({
      id: uuidv4(),
      projectId,
      role: "user",
      content: message.trim(),
    });

    await db.insert(chatMessages).values({
      id: uuidv4(),
      projectId,
      role: "assistant",
      content: reply,
      patches: patches as unknown as Record<string, unknown>[],
    });

    return Response.json({ message: reply, siteConfig: updatedConfig });
  } catch (error) {
    console.error("[chat] Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Chat edit failed" },
      { status: 500 },
    );
  }
}
