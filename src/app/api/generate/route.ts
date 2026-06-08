import { runGenerationPipeline } from "@/lib/ai/pipeline";
import { getSessionId } from "@/lib/session";

export const maxDuration = 120;

export async function POST(req: Request) {
  const sessionId = await getSessionId();
  const intake = await req.json();

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (data: object) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      try {
        await runGenerationPipeline(intake, sessionId, (event) => send(event));
      } catch (e) {
        send({ type: "error", message: e instanceof Error ? e.message : "Generation failed" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
