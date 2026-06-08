import { z } from "zod";

export const aiSiteContentSchema = z.object({
  analysisSummary: z.string(),
  industryInsights: z.string(),
  meta: z.object({
    title: z.string(),
    description: z.string(),
  }),
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
  nav: z.object({
    links: z.array(z.object({ label: z.string(), href: z.string() })),
    ctaLabel: z.string(),
  }),
  hero: z.object({
    headline: z.string(),
    subheadline: z.string(),
    primaryCtaLabel: z.string(),
    secondaryCtaLabel: z.string(),
    trustText: z.string(),
  }),
  socialProof: z.object({
    stats: z.array(z.object({ value: z.string(), label: z.string() })),
  }),
  problem: z.object({
    headline: z.string(),
    body: z.string(),
    bullets: z.array(z.string()),
  }),
  solution: z.object({
    headline: z.string(),
    body: z.string(),
    benefits: z.array(z.string()),
  }),
  features: z.object({
    headline: z.string(),
    items: z.array(z.object({ title: z.string(), description: z.string() })),
  }),
  howItWorks: z.object({
    headline: z.string(),
    steps: z.array(z.object({ title: z.string(), description: z.string() })),
  }),
  testimonials: z.object({
    headline: z.string(),
    items: z.array(z.object({ name: z.string(), role: z.string(), quote: z.string() })),
  }),
  faq: z.object({
    headline: z.string(),
    items: z.array(z.object({ question: z.string(), answer: z.string() })),
  }),
  blogTeaser: z.object({
    headline: z.string(),
    posts: z.array(z.object({ title: z.string(), excerpt: z.string(), slug: z.string() })),
  }),
  finalCta: z.object({
    headline: z.string(),
    subheadline: z.string(),
    ctaLabel: z.string(),
  }),
  contactHeadline: z.string(),
  pricing: z.object({
    headline: z.string(),
    enabled: z.boolean(),
    plans: z.array(
      z.object({
        name: z.string(),
        price: z.string(),
        features: z.array(z.string()),
        cta: z.string(),
      }),
    ),
  }),
});

export type AiSiteContent = z.infer<typeof aiSiteContentSchema>;
