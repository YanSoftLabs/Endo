import { generateObject } from "ai";
import { getModel } from "./openrouter";
import { CHAT_SYSTEM } from "./prompts";
import { patchResponseSchema, type ConfigPatch } from "@/lib/schemas/patches";
import type { SiteConfig } from "@/lib/schemas/site-config";
import { applyPatches } from "@/lib/codegen/patch-applier";
import { applyLocalChatEdit, extractNewBusinessName, renameBusinessInConfig } from "./local-chat-edit";

export async function processChatEdit(
  userMessage: string,
  siteConfig: SiteConfig,
): Promise<{ message: string; updatedConfig: SiteConfig; patches: ConfigPatch[] }> {
  // Always run local parser first for reliable rename / style commands
  const localResult = applyLocalChatEdit(userMessage, siteConfig);
  if (localResult.patches.length > 0) {
    return localResult;
  }

  // If only a rename was requested but local missed it, try explicit extraction
  const newName = extractNewBusinessName(userMessage, siteConfig.businessName);
  if (newName) {
    const renamed = renameBusinessInConfig(siteConfig, newName);
    return {
      message: `Renamed to "${newName}" across the entire site.`,
      updatedConfig: renamed.config,
      patches: renamed.patches,
    };
  }

  if (process.env.OPENROUTER_API_KEY) {
    try {
      const { object } = await generateObject({
        model: getModel("chat"),
        schema: patchResponseSchema,
        system: CHAT_SYSTEM,
        prompt: `Current site config:\n${JSON.stringify(siteConfig, null, 2)}\n\nUser request: ${userMessage}`,
      });

      const updatedConfig =
        object.patches.length > 0 ? applyPatches(siteConfig, object.patches) : siteConfig;
      return { message: object.message, updatedConfig, patches: object.patches };
    } catch (error) {
      console.warn("[chat] OpenRouter failed:", error instanceof Error ? error.message : error);
    }
  }

  return localResult;
}
