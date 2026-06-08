import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { getModelSlug, type ModelStage } from "./models";

let openrouterInstance: ReturnType<typeof createOpenRouter> | null = null;

export function getOpenRouter() {
  if (!openrouterInstance) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OPENROUTER_API_KEY is not configured");
    openrouterInstance = createOpenRouter({
      apiKey,
      headers: {
        "HTTP-Referer": process.env.OPENROUTER_APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Vibe Coding Platform",
      },
    });
  }
  return openrouterInstance;
}

export function getModel(stage: ModelStage, useFallback = false) {
  return getOpenRouter().chat(getModelSlug(stage, useFallback));
}
