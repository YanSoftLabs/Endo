import { z } from "zod";
import { threeDStyleSchema } from "./intake";

export const siteConfigSchema = z.object({
  projectId: z.string().optional(),
  businessName: z.string(),
  tagline: z.string(),
  threeDStyle: threeDStyleSchema,
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
  meta: z.object({ title: z.string(), description: z.string() }),
  nav: z.object({
    links: z.array(z.object({ label: z.string(), href: z.string() })),
    ctaLabel: z.string(),
    ctaUrl: z.string(),
  }),
  hero: z.object({
    headline: z.string(),
    subheadline: z.string(),
    primaryCta: z.object({ label: z.string(), url: z.string() }),
    secondaryCta: z.object({ label: z.string(), url: z.string() }),
    trustText: z.string(),
  }),
  socialProof: z.object({
    stats: z.array(z.object({ value: z.string(), label: z.string() })),
    logos: z.array(z.string()).optional(),
  }),
  problem: z.object({ headline: z.string(), body: z.string(), bullets: z.array(z.string()) }),
  solution: z.object({ headline: z.string(), body: z.string(), benefits: z.array(z.string()) }),
  features: z.object({
    headline: z.string(),
    items: z.array(z.object({ title: z.string(), description: z.string(), icon: z.string().optional() })),
  }),
  howItWorks: z.object({
    headline: z.string(),
    steps: z.array(z.object({ title: z.string(), description: z.string() })),
  }),
  testimonials: z.object({
    headline: z.string(),
    items: z.array(z.object({ name: z.string(), role: z.string(), quote: z.string() })),
  }),
  pricing: z.object({
    headline: z.string(),
    plans: z.array(z.object({ name: z.string(), price: z.string(), features: z.array(z.string()), cta: z.string() })),
    enabled: z.boolean(),
  }),
  faq: z.object({
    headline: z.string(),
    items: z.array(z.object({ question: z.string(), answer: z.string() })),
  }),
  blogTeaser: z.object({
    headline: z.string(),
    posts: z.array(z.object({ title: z.string(), excerpt: z.string(), slug: z.string() })),
  }),
  finalCta: z.object({ headline: z.string(), subheadline: z.string(), ctaLabel: z.string(), ctaUrl: z.string() }),
  contact: z.object({ headline: z.string(), email: z.string(), address: z.string() }),
  footer: z.object({
    copyright: z.string(),
    legalLinks: z.array(z.object({ label: z.string(), href: z.string() })),
    socialLinks: z.array(z.object({ platform: z.string(), url: z.string() })),
  }),
  legal: z.object({
    privacy: z.string().optional(),
    terms: z.string().optional(),
    disclaimer: z.string().optional(),
    refund: z.string().optional(),
    showCookieNotice: z.boolean(),
  }),
  heroImage: z.string().url().optional(),
  disclaimerBanner: z.string(),
  analysisSummary: z.string().optional(),
  industryInsights: z.string().optional(),
  aiGenerated: z.boolean().optional(),
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;
