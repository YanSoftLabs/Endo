import { generateObject } from "ai";
import type { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { projects, generationLogs } from "@/lib/db/schema";
import { intakeFormSchema, type IntakeFormData } from "@/lib/schemas/intake";
import { businessProfileSchema, type BusinessProfile } from "@/lib/schemas/business-profile";
import { siteBlueprintSchema, type SiteBlueprint } from "@/lib/schemas/site-blueprint";
import type { SiteConfig } from "@/lib/schemas/site-config";
import { assembleSiteConfig } from "@/lib/codegen/assembler";
import { buildFallbackProfile, getIndustryPack } from "@/lib/codegen/industry-content";
import { formatBusinessName } from "@/lib/ai/local-chat-edit";
import { generateSiteContent } from "@/lib/ai/content-generator";
import { generateHeroImage } from "@/lib/ai/image-generator";
import { getModel } from "./openrouter";
import {
  ANALYZER_SYSTEM,
  ARCHITECT_SYSTEM,
  buildAnalyzerPrompt,
  buildArchitectPrompt,
} from "./prompts";

export type PipelineEvent =
  | { type: "stage"; stage: string; message: string }
  | { type: "insight"; message: string }
  | { type: "complete"; projectId: string; aiGenerated?: boolean }
  | { type: "error"; message: string };

async function logGeneration(
  projectId: string | null,
  sessionId: string,
  stage: string,
  model: string,
  tokens?: number,
) {
  await db.insert(generationLogs).values({
    id: uuidv4(),
    projectId,
    sessionId,
    stage,
    model,
    tokensUsed: tokens ?? null,
  });
}

async function callWithFallback<T>(
  stage: keyof typeof import("./models").MODEL_STAGES,
  schema: z.ZodType<T>,
  system: string,
  prompt: string,
  sessionId: string,
  stageLabel: string,
): Promise<T | null> {
  if (!process.env.OPENROUTER_API_KEY) return null;

  for (const useFallback of [false, true]) {
    const slug = useFallback
      ? process.env.OPENROUTER_MODEL_FALLBACK || "openai/gpt-4.1"
      : process.env.OPENROUTER_MODEL_PRIMARY || "anthropic/claude-sonnet-4";

    try {
      const { object, usage } = await generateObject({
        model: getModel(stage, useFallback),
        schema,
        system,
        prompt,
      });
      await logGeneration(null, sessionId, stageLabel, slug, usage?.totalTokens);
      return object as T;
    } catch (error) {
      console.warn(`[pipeline:${stageLabel}] ${slug} failed:`, error instanceof Error ? error.message : error);
    }
  }
  return null;
}

function fallbackProfile(intake: IntakeFormData): BusinessProfile {
  return buildFallbackProfile(intake);
}

function fallbackBlueprint(intake: IntakeFormData, profile: BusinessProfile): SiteBlueprint {
  const pack = getIndustryPack(`${intake.industry} ${intake.tagline}`, intake.businessName);
  const legalPages: SiteBlueprint["legalPages"] = [];
  if (intake.legalPages.privacy)    legalPages.push("privacy");
  if (intake.legalPages.terms)      legalPages.push("terms");
  if (intake.legalPages.disclaimer) legalPages.push("disclaimer");
  if (intake.legalPages.refund)     legalPages.push("refund");

  return {
    sections: [
      { id: "nav", type: "nav", copyBrief: "Sticky navigation with CTA" },
      { id: "hero", type: "hero", headline: profile.valueProposition, subheadline: intake.tagline, copyBrief: "Primary conversion hero" },
      { id: "problem", type: "problem", headline: pack.problemHeadline, copyBrief: profile.painPoints.join(". ") },
      { id: "solution", type: "solution", headline: pack.solutionHeadline, copyBrief: intake.valueProposition },
      { id: "features", type: "features", headline: pack.featuresHeadline, copyBrief: "Services and offerings" },
      { id: "testimonials", type: "testimonials", headline: "What our clients say", copyBrief: "Social proof" },
      { id: "faq", type: "faq", headline: "Frequently asked questions", copyBrief: "Objection handling" },
      { id: "finalCta", type: "finalCta", headline: pack.finalCtaHeadline, copyBrief: "Get started" },
      { id: "footer", type: "footer", copyBrief: "Copyright and legal links" },
    ],
    designTokens: {
      primaryColor: pack.colors.primary,
      secondaryColor: pack.colors.secondary,
      accentColor: pack.colors.accent,
      fontFamily: pack.fontFamily,
      borderRadius: pack.borderRadius,
    },
    scene3d: {
      metaphor: intake.industry,
      mood: intake.brandTone,
      animationSpeed: "medium",
      objectType: intake.threeDStyle === "full_webgl" ? "sphere-cluster" : intake.threeDStyle === "basic" ? "none" : "floating-cards",
    },
    meta: {
      title: `${formatBusinessName(intake.businessName)} | ${intake.tagline}`,
      description: intake.valueProposition.slice(0, 160),
    },
    legalPages,
  };
}

function formatValidationError(error: unknown): string {
  if (error && typeof error === "object" && "issues" in error) {
    const issues = (error as { issues: { path: (string | number)[]; message: string }[] }).issues;
    return issues
      .map((issue) => {
        const field = issue.path.join(".");
        return field ? `${field}: ${issue.message}` : issue.message;
      })
      .join("; ");
  }
  return error instanceof Error ? error.message : "Validation failed";
}

export async function runGenerationPipeline(
  rawIntake: unknown,
  sessionId: string,
  onEvent?: (event: PipelineEvent) => void,
): Promise<{ projectId: string; siteConfig: SiteConfig }> {
  const parsed = intakeFormSchema.safeParse(rawIntake);
  if (!parsed.success) {
    throw new Error(formatValidationError(parsed.error));
  }
  const intake = parsed.data;
  const projectId = uuidv4();

  // Stage 1: Business analysis
  onEvent?.({ type: "stage", stage: "analyze", message: "Analyzing your industry, audience, and goals..." });

  const aiProfile = await callWithFallback<BusinessProfile>(
    "analyze",
    businessProfileSchema,
    ANALYZER_SYSTEM,
    buildAnalyzerPrompt(intake),
    sessionId,
    "analyze",
  );
  const profile = aiProfile ?? fallbackProfile(intake);

  if (aiProfile) {
    onEvent?.({
      type: "insight",
      message: `Identified ${profile.industry} business targeting: ${profile.icp.slice(0, 120)}${profile.icp.length > 120 ? "…" : ""}`,
    });
    onEvent?.({
      type: "insight",
      message: `Strategy: ${profile.funnelStrategy}`,
    });
  } else {
    onEvent?.({
      type: "insight",
      message: "Using industry template analysis (connect OpenRouter for full AI analysis).",
    });
  }

  // Stage 2: Site architecture
  onEvent?.({ type: "stage", stage: "architect", message: "Designing conversion-optimized page structure..." });

  const aiBlueprint = await callWithFallback<SiteBlueprint>(
    "architect",
    siteBlueprintSchema,
    ARCHITECT_SYSTEM,
    buildArchitectPrompt(intake, profile),
    sessionId,
    "architect",
  );
  const blueprint = aiBlueprint ?? fallbackBlueprint(intake, profile);

  if (aiBlueprint) {
    onEvent?.({
      type: "insight",
      message: `Planned ${blueprint.sections.length} sections with ${blueprint.designTokens.primaryColor} brand palette.`,
    });
  }

  // Stage 3: Full content generation via LLM
  onEvent?.({
    type: "stage",
    stage: "content",
    message: "Writing industry-specific copy, testimonials, and FAQs...",
  });

  const aiContent = await generateSiteContent(intake, profile, blueprint, (stage, model, tokens) => {
    logGeneration(null, sessionId, stage, model, tokens);
  });

  if (aiContent) {
    onEvent?.({ type: "insight", message: aiContent.analysisSummary });
    if (aiContent.industryInsights) {
      onEvent?.({ type: "insight", message: aiContent.industryInsights });
    }
  }

  // Stage 4: Generate hero image (only if user opted in)
  let heroImageResult: { imageURL: string } | null = null;
  if (intake.generateHeroImage) {
    onEvent?.({ type: "stage", stage: "image", message: "Generating a custom hero image for your business..." });
    heroImageResult = await generateHeroImage({
      industry:     intake.industry,
      businessName: intake.businessName,
      brandTone:    intake.brandTone,
      tagline:      intake.tagline,
    });
    if (heroImageResult) {
      onEvent?.({ type: "insight", message: "Hero image generated — tailored to your industry and brand tone." });
    }
  }

  // Stage 5: Assemble & present
  onEvent?.({ type: "stage", stage: "assemble", message: "Building your landing page..." });

  const siteConfig = assembleSiteConfig(intake, profile, blueprint, projectId, aiContent);
  if (heroImageResult) {
    siteConfig.heroImage = heroImageResult.imageURL;
  }

  await db.insert(projects).values({
    id: projectId,
    sessionId,
    name: formatBusinessName(intake.businessName),
    intakeData: intake as unknown as Record<string, unknown>,
    businessProfile: profile as unknown as Record<string, unknown>,
    blueprint: blueprint as unknown as Record<string, unknown>,
    siteConfig: siteConfig as unknown as Record<string, unknown>,
    threeDStyle: intake.threeDStyle,
    status: "ready",
    updatedAt: new Date(),
  });

  onEvent?.({ type: "complete", projectId, aiGenerated: !!aiContent });
  return { projectId, siteConfig };
}
