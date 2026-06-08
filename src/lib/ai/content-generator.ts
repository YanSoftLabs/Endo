import { generateObject } from "ai";
import { aiSiteContentSchema, type AiSiteContent } from "@/lib/schemas/ai-site-content";
import type { IntakeFormData } from "@/lib/schemas/intake";
import type { BusinessProfile } from "@/lib/schemas/business-profile";
import type { SiteBlueprint } from "@/lib/schemas/site-blueprint";
import { getModel } from "./openrouter";
import { CONTENT_GENERATOR_SYSTEM, buildContentPrompt } from "./prompts";

export async function generateSiteContent(
  intake: IntakeFormData,
  profile: BusinessProfile,
  blueprint: SiteBlueprint,
  onLog?: (stage: string, model: string, tokens?: number) => void,
): Promise<AiSiteContent | null> {
  if (!process.env.OPENROUTER_API_KEY) return null;

  const prompt = buildContentPrompt(intake, profile, blueprint);
  const attempts = [false, true] as const;

  for (const useFallback of attempts) {
    const slug = useFallback
      ? process.env.OPENROUTER_MODEL_FALLBACK || "openai/gpt-4.1"
      : process.env.OPENROUTER_MODEL_PRIMARY || "anthropic/claude-sonnet-4";

    try {
      const { object, usage } = await generateObject({
        model: getModel("content", useFallback),
        schema: aiSiteContentSchema,
        system: CONTENT_GENERATOR_SYSTEM,
        prompt,
      });
      onLog?.("content", slug, usage?.totalTokens);
      return object;
    } catch (error) {
      console.warn(
        `[content] ${slug} failed:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  return null;
}
