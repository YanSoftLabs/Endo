import { z } from "zod";
import { brandToneSchema } from "./intake";

export const businessProfileSchema = z.object({
  businessName: z.string(),
  tagline: z.string(),
  valueProposition: z.string(),
  industry: z.string(),
  icp: z.string(),
  painPoints: z.array(z.string()),
  valueProps: z.array(z.string()),
  tone: brandToneSchema,
  primaryGoal: z.string().default("leads"),
  funnelStrategy: z.string(),
  complianceFlags: z.array(z.string()),
  recommendedSections: z.array(z.string()),
  conversionHooks: z.array(z.string()),
});

export type BusinessProfile = z.infer<typeof businessProfileSchema>;
