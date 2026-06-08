export const MODEL_STAGES = {
  analyze: "primary",
  architect: "primary",
  content: "primary",
  sectionCopy: "primary",
  codeGen: "primary",
  chat: "primary",
  classify: "fast",
} as const;

export type ModelStage = keyof typeof MODEL_STAGES;

export function getModelSlug(stage: ModelStage, useFallback = false): string {
  if (useFallback) {
    return process.env.OPENROUTER_MODEL_FALLBACK || "openai/gpt-4.1";
  }
  const tier = MODEL_STAGES[stage];
  if (tier === "fast") {
    return process.env.OPENROUTER_MODEL_FAST || "openai/gpt-4.1-mini";
  }
  return process.env.OPENROUTER_MODEL_PRIMARY || "anthropic/claude-sonnet-4";
}
