import type { IntakeFormData } from "@/lib/schemas/intake";
import type { BusinessProfile } from "@/lib/schemas/business-profile";
import type { SiteBlueprint } from "@/lib/schemas/site-blueprint";
import type { SiteConfig } from "@/lib/schemas/site-config";
import type { AiSiteContent } from "@/lib/schemas/ai-site-content";
import { generateLegalContent } from "@/lib/site-templates/legal/generator";
import { buildTestimonials, buildTrustText, getIndustryPack } from "@/lib/codegen/industry-content";
import { formatBusinessName } from "@/lib/ai/local-chat-edit";

function buildLegalLinks(legalPages: SiteBlueprint["legalPages"], projectId: string) {
  const base = `/legal/${projectId}`;
  return [
    ...(legalPages.includes("privacy")    ? [{ label: "Privacy Policy",    href: `${base}/privacy`    }] : []),
    ...(legalPages.includes("terms")      ? [{ label: "Terms & Conditions", href: `${base}/terms`      }] : []),
    ...(legalPages.includes("disclaimer") ? [{ label: "Disclaimer",         href: `${base}/disclaimer` }] : []),
    ...(legalPages.includes("refund")     ? [{ label: "Refund Policy",      href: `${base}/refund`     }] : []),
  ];
}

const DEFAULT_CTA_LABEL = "Get Started";
const DEFAULT_CTA_URL   = "#contact";

/** AI-generated path: merge LLM content with structural intake data */
function assembleFromAiContent(
  intake: IntakeFormData,
  blueprint: SiteBlueprint,
  ai: AiSiteContent,
  projectId: string,
): SiteConfig {
  const legalPages = blueprint.legalPages;
  const legal = generateLegalContent(intake, legalPages);
  const businessName = formatBusinessName(intake.businessName);

  return {
    projectId,
    businessName,
    tagline: intake.tagline,
    threeDStyle: intake.threeDStyle,
    designTokens: intake.aiPickColors
      ? ai.designTokens
      : {
          ...ai.designTokens,
          primaryColor:   intake.primaryColor   || ai.designTokens.primaryColor,
          secondaryColor: intake.secondaryColor || ai.designTokens.secondaryColor,
        },
    scene3d: ai.scene3d,
    meta: ai.meta,
    nav: {
      links:    ai.nav.links,
      ctaLabel: ai.nav.ctaLabel || DEFAULT_CTA_LABEL,
      ctaUrl:   DEFAULT_CTA_URL,
    },
    hero: {
      headline:     ai.hero.headline,
      subheadline:  ai.hero.subheadline,
      primaryCta:   { label: ai.hero.primaryCtaLabel || DEFAULT_CTA_LABEL, url: DEFAULT_CTA_URL },
      secondaryCta: { label: ai.hero.secondaryCtaLabel, url: "#features" },
      trustText:    ai.hero.trustText,
    },
    socialProof: ai.socialProof,
    problem:     ai.problem,
    solution:    ai.solution,
    features: {
      headline: ai.features.headline,
      items:    ai.features.items.map((item) => ({ ...item, icon: "sparkles" })),
    },
    howItWorks:  ai.howItWorks,
    testimonials: ai.testimonials,
    pricing:     ai.pricing,
    faq:         ai.faq,
    blogTeaser:  ai.blogTeaser,
    finalCta: {
      headline:     ai.finalCta.headline,
      subheadline:  ai.finalCta.subheadline,
      ctaLabel:     ai.finalCta.ctaLabel || DEFAULT_CTA_LABEL,
      ctaUrl:       DEFAULT_CTA_URL,
    },
    contact: {
      headline: ai.contactHeadline,
      email:    intake.contactEmail,
      address:  intake.businessAddress,
    },
    footer: {
      copyright:  `© ${new Date().getFullYear()} ${businessName}. All rights reserved.`,
      legalLinks: buildLegalLinks(legalPages, projectId),
      socialLinks: [],
    },
    legal,
    disclaimerBanner: "Legal pages are AI-generated templates — review with a qualified attorney before publishing.",
    analysisSummary:  ai.analysisSummary,
    industryInsights: ai.industryInsights,
    aiGenerated: true,
  };
}

/** Fallback path: industry templates when no AI key configured */
export function assembleSiteConfig(
  intake: IntakeFormData,
  profile: BusinessProfile,
  blueprint: SiteBlueprint,
  projectId: string,
  aiContent?: AiSiteContent | null,
): SiteConfig {
  if (aiContent) {
    return assembleFromAiContent(intake, blueprint, aiContent, projectId);
  }

  const pack         = getIndustryPack(`${intake.industry} ${intake.tagline}`, intake.businessName);
  const findSection  = (type: string) => blueprint.sections.find((s) => s.type === type);
  const heroSec      = findSection("hero");
  const legalPages   = blueprint.legalPages;
  const legal        = generateLegalContent(intake, legalPages);
  const businessName = formatBusinessName(intake.businessName);

  const colors = intake.aiPickColors
    ? { primaryColor: pack.colors.primary, secondaryColor: pack.colors.secondary, accentColor: pack.colors.accent }
    : {
        primaryColor:   intake.primaryColor   || pack.colors.primary,
        secondaryColor: intake.secondaryColor || pack.colors.secondary,
        accentColor:    pack.colors.accent,
      };

  const testimonials = buildTestimonials(intake);

  // Build feature items from additionalServices if provided, else use pack defaults
  const featureItems = intake.additionalServices.length > 0
    ? intake.additionalServices.map((s) => ({ title: s.name, description: s.description, icon: "sparkles" }))
    : pack.defaultFeatures.map((f) => ({ ...f, icon: "sparkles" }));

  return {
    projectId,
    businessName,
    tagline:    intake.tagline,
    threeDStyle: intake.threeDStyle,
    designTokens: {
      primaryColor:   blueprint.designTokens.primaryColor   || colors.primaryColor,
      secondaryColor: blueprint.designTokens.secondaryColor || colors.secondaryColor,
      accentColor:    blueprint.designTokens.accentColor    || colors.accentColor,
      fontFamily:     pack.fontFamily,
      borderRadius:   pack.borderRadius,
    },
    scene3d: blueprint.scene3d,
    meta:    blueprint.meta,
    nav: {
      links:    pack.nav,
      ctaLabel: DEFAULT_CTA_LABEL,
      ctaUrl:   DEFAULT_CTA_URL,
    },
    hero: {
      headline:     heroSec?.headline    || profile.valueProposition,
      subheadline:  heroSec?.subheadline || intake.tagline,
      primaryCta:   { label: DEFAULT_CTA_LABEL,        url: DEFAULT_CTA_URL },
      secondaryCta: { label: pack.secondaryCtaLabel, url: "#features" },
      trustText:    buildTrustText(intake, pack),
    },
    socialProof: { stats: pack.stats },
    problem: {
      headline: findSection("problem")?.headline || pack.problemHeadline,
      body:     findSection("problem")?.copyBrief || profile.painPoints.join(". "),
      bullets:  profile.painPoints.slice(0, 4),
    },
    solution: {
      headline: findSection("solution")?.headline || pack.solutionHeadline,
      body:     findSection("solution")?.copyBrief || intake.valueProposition,
      benefits: profile.valueProps.slice(0, 4),
    },
    features: {
      headline: findSection("features")?.headline || pack.featuresHeadline,
      items:    featureItems,
    },
    howItWorks: pack.howItWorks,
    testimonials: {
      headline: findSection("testimonials")?.headline || "What our clients say",
      items:    testimonials,
    },
    pricing: {
      headline: "Service packages",
      enabled:  false,
      plans:    [],
    },
    faq: {
      headline: "Frequently asked questions",
      items:    pack.faq,
    },
    blogTeaser: {
      headline: "Insights & resources",
      posts:    pack.blogPosts,
    },
    finalCta: {
      headline:    findSection("finalCta")?.headline || pack.finalCtaHeadline,
      subheadline: intake.valueProposition,
      ctaLabel:    DEFAULT_CTA_LABEL,
      ctaUrl:      DEFAULT_CTA_URL,
    },
    contact: {
      headline: "Contact us",
      email:    intake.contactEmail,
      address:  intake.businessAddress,
    },
    footer: {
      copyright:   `© ${new Date().getFullYear()} ${businessName}. All rights reserved.`,
      legalLinks:  buildLegalLinks(legalPages, projectId),
      socialLinks: [],
    },
    legal,
    disclaimerBanner: "Legal pages are AI-generated templates — review with a qualified attorney before publishing.",
    aiGenerated: false,
  };
}
