import { z } from "zod";

export const sectionSpecSchema = z.object({
  id: z.string(),
  type: z.string(),
  headline: z.string().optional(),
  subheadline: z.string().optional(),
  copyBrief: z.string(),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
  items: z.array(z.record(z.string(), z.unknown())).optional(),
});

export const siteBlueprintSchema = z.object({
  sections: z.array(sectionSpecSchema).min(3),
  designTokens: z.object({
    primaryColor: z.string(),
    secondaryColor: z.string(),
    accentColor: z.string(),
    fontFamily: z.string(),
    borderRadius: z.string(),
  }),
  scene3d: z.object({
    metaphor: z.string(),
    mood: z.string(),
    animationSpeed: z.enum(["slow", "medium", "fast"]),
    objectType: z.string(),
  }),
  meta: z.object({
    title: z.string(),
    description: z.string(),
  }),
  legalPages: z.array(z.enum(["privacy", "terms", "disclaimer", "refund"])),
});

export type SiteBlueprint = z.infer<typeof siteBlueprintSchema>;
export type SectionSpec = z.infer<typeof sectionSpecSchema>;
