import type { SiteConfig } from "@/lib/schemas/site-config";
import type { ConfigPatch } from "@/lib/schemas/patches";

function setByPath(obj: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split(".");
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== "object" || current[key] === null) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function cleanName(name: string): string {
  return name.replace(/^['"]+|['"]+$/g, "").replace(/\s+/g, " ").trim();
}

/** Format business names: "shyam & co." → "Shyam & Co." */
export function formatBusinessName(name: string): string {
  const cleaned = cleanName(name);
  return cleaned
    .split(" ")
    .map((word) => {
      if (word === "&") return "&";
      if (/^co\.?$/i.test(word)) return "Co.";
      if (word.length <= 3 && word === word.toUpperCase()) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ")
    .replace(/\s+\./g, ".");
}

function nameVariants(name: string): string[] {
  const base = cleanName(name);
  const variants = new Set<string>([
    base,
    base.toLowerCase(),
    formatBusinessName(base),
    base.replace(/\s*&\s*/gi, " & "),
    base.replace(/\s*&\s*/gi, " and "),
  ]);
  return [...variants].filter((v) => v.length >= 2);
}

function replaceNameInText(text: string, oldVariants: string[], newName: string): string {
  if (!text) return text;
  let result = text;
  for (const old of oldVariants) {
    result = result.replace(new RegExp(escapeRegex(old), "gi"), newName);
  }
  return result.replace(/\.{2,}/g, ".").replace(/\s+\./g, ".");
}

/** Extract a new business name from natural-language rename requests. */
export function extractNewBusinessName(message: string, currentName?: string): string | null {
  const lower = message.toLowerCase();
  const mentionsRename =
    /\b(name|rename|rebrand|brand|business|company|firm|called|call it)\b/.test(lower) ||
    /\bfrom .+ to\b/i.test(message);

  if (!mentionsRename) return null;

  const patterns = [
    /\b(?:rename|change|update|set|switch)\s+(?:the\s+)?(?:business\s+|company\s+|brand\s+|firm\s+)?name\s+(?:from\s+)?['"]?(.+?)['"]?\s+to\s+['"]([^'"]+)['"]/i,
    /\b(?:rename|change|update|set|switch)\s+(?:the\s+)?(?:business\s+|company\s+|brand\s+|firm\s+)?name\s+(?:from\s+)?['"]?(.+?)['"]?\s+to\s+['"]?([^'".\n]+?)['"]?(?:\s+(?:make|and|change|update|set|\.|\s*$))/i,
    /\bfrom\s+['"]?(.+?)['"]?\s+to\s+['"]([^'"]+)['"]/i,
    /\bfrom\s+['"]?(.+?)['"]?\s+to\s+['"]?([^'".\n]+?)['"]?(?:\s+(?:make|and)\b|[.\s]*$)/i,
    /\b(?:rename|rebrand|call it)\s+(?:to\s+)?['"]([^'"]+)['"]/i,
    /\b(?:rename|rebrand|call it)\s+(?:to\s+)?['"]?([A-Za-z][^'".\n]+?)['"]?(?:\s+(?:make|and)\b|[.\s]*$)/i,
    /\bto\s+['"]([^'"]+)['"]/i,
    /\bto\s+['"]([^'"]+?)['"]?\s*(?:make|and)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (!match) continue;
    const candidate = cleanName(match[match.length - 1]);
    if (candidate.length >= 2 && candidate.toLowerCase() !== currentName?.toLowerCase()) {
      return formatBusinessName(candidate);
    }
  }

  return null;
}

/** Replace business name across every text field in the site config. */
export function renameBusinessInConfig(
  config: SiteConfig,
  newNameRaw: string,
): { config: SiteConfig; patches: ConfigPatch[] } {
  const newName = formatBusinessName(newNameRaw);
  const oldVariants = nameVariants(config.businessName);
  const replace = (text: string) => replaceNameInText(text, oldVariants, newName);

  const updated: SiteConfig = {
    ...config,
    businessName: newName,
    tagline: replace(config.tagline),
    meta: {
      title: replace(config.meta.title),
      description: replace(config.meta.description),
    },
    nav: {
      ...config.nav,
      ctaLabel: replace(config.nav.ctaLabel),
    },
    hero: {
      ...config.hero,
      headline: replace(config.hero.headline),
      subheadline: replace(config.hero.subheadline),
      trustText: replace(config.hero.trustText),
      primaryCta: { ...config.hero.primaryCta, label: replace(config.hero.primaryCta.label) },
      secondaryCta: { ...config.hero.secondaryCta, label: replace(config.hero.secondaryCta.label) },
    },
    problem: {
      headline: replace(config.problem.headline),
      body: replace(config.problem.body),
      bullets: config.problem.bullets.map(replace),
    },
    solution: {
      headline: replace(config.solution.headline),
      body: replace(config.solution.body),
      benefits: config.solution.benefits.map(replace),
    },
    features: {
      headline: replace(config.features.headline),
      items: config.features.items.map((item) => ({
        ...item,
        title: replace(item.title),
        description: replace(item.description),
      })),
    },
    howItWorks: {
      headline: replace(config.howItWorks.headline),
      steps: config.howItWorks.steps.map((step) => ({
        title: replace(step.title),
        description: replace(step.description),
      })),
    },
    testimonials: {
      headline: replace(config.testimonials.headline),
      items: config.testimonials.items.map((item) => ({
        ...item,
        quote: replace(item.quote),
        role: replace(item.role),
      })),
    },
    pricing: {
      ...config.pricing,
      headline: replace(config.pricing.headline),
      plans: config.pricing.plans.map((plan) => ({
        ...plan,
        name: replace(plan.name),
        cta: replace(plan.cta),
      })),
    },
    faq: {
      headline: replace(config.faq.headline),
      items: config.faq.items.map((item) => ({
        question: replace(item.question),
        answer: replace(item.answer),
      })),
    },
    blogTeaser: {
      headline: replace(config.blogTeaser.headline),
      posts: config.blogTeaser.posts.map((post) => ({
        ...post,
        title: replace(post.title),
        excerpt: replace(post.excerpt),
      })),
    },
    finalCta: {
      headline: replace(config.finalCta.headline),
      subheadline: replace(config.finalCta.subheadline),
      ctaLabel: replace(config.finalCta.ctaLabel),
      ctaUrl: config.finalCta.ctaUrl,
    },
    contact: {
      headline: replace(config.contact.headline),
      email: config.contact.email,
      address: config.contact.address,
    },
    footer: {
      copyright: replace(config.footer.copyright),
      legalLinks: config.footer.legalLinks,
      socialLinks: config.footer.socialLinks,
    },
    legal: {
      ...config.legal,
      privacy: config.legal.privacy ? replace(config.legal.privacy) : undefined,
      terms: config.legal.terms ? replace(config.legal.terms) : undefined,
      disclaimer: config.legal.disclaimer ? replace(config.legal.disclaimer) : undefined,
      refund: config.legal.refund ? replace(config.legal.refund) : undefined,
    },
    disclaimerBanner: replace(config.disclaimerBanner),
    designTokens: config.designTokens,
    scene3d: config.scene3d,
    threeDStyle: config.threeDStyle,
    socialProof: config.socialProof,
  };

  return {
    config: updated,
    patches: [{ path: "businessName", operation: "set", value: newName }],
  };
}

export function applyLocalChatEdit(
  userMessage: string,
  siteConfig: SiteConfig,
): { message: string; updatedConfig: SiteConfig; patches: ConfigPatch[] } {
  const msg = userMessage.toLowerCase();
  let updated = structuredClone(siteConfig);
  const allPatches: ConfigPatch[] = [];
  const replies: string[] = [];

  const set = (path: string, value: unknown) => {
    allPatches.push({ path, operation: "set", value });
    setByPath(updated as unknown as Record<string, unknown>, path, value);
  };

  const newName = extractNewBusinessName(userMessage, updated.businessName);
  if (newName && newName.toLowerCase() !== updated.businessName.toLowerCase()) {
    const renamed = renameBusinessInConfig(updated, newName);
    updated = renamed.config;
    allPatches.push(...renamed.patches);
    replies.push(`Renamed to "${newName}" across header, footer, hero, FAQ, testimonials, and legal text.`);
  }

  if (/professional|formal|corporate|serious|trustworthy|elegant/.test(msg)) {
    set("designTokens.primaryColor", "#1e3a5f");
    set("designTokens.secondaryColor", "#0f2744");
    set("designTokens.accentColor", "#c5a028");
    set("designTokens.fontFamily", '"Source Serif 4", Georgia, "Times New Roman", serif');
    set("designTokens.borderRadius", "0.375rem");
    set("hero.trustText", `Established professionals committed to your success`);
    set("testimonials.headline", "What our clients say");
    if (/convert|start converting|launch|today/i.test(updated.finalCta.headline)) {
      set("finalCta.headline", `Schedule a consultation with ${updated.businessName}`);
    }
    replies.push("Applied a professional navy-and-gold theme with formal typography.");
  }

  if (/navy|dark blue/.test(msg)) {
    set("designTokens.primaryColor", "#1e3a5f");
    set("designTokens.secondaryColor", "#0f2744");
    replies.push("Updated to navy blue brand colors.");
  } else if (/\bblue\b/.test(msg) && !/navy/.test(msg)) {
    set("designTokens.primaryColor", "#2563eb");
    set("designTokens.secondaryColor", "#1e40af");
    replies.push("Updated to blue brand colors.");
  } else if (/green/.test(msg)) {
    set("designTokens.primaryColor", "#16a34a");
    set("designTokens.secondaryColor", "#15803d");
    replies.push("Updated to green brand colors.");
  } else if (/purple|violet/.test(msg)) {
    set("designTokens.primaryColor", "#7c3aed");
    set("designTokens.secondaryColor", "#5b21b6");
    replies.push("Updated to purple brand colors.");
  }

  if (/headline|hero/.test(msg) && /urgent|urgency|bold|strong/.test(msg)) {
    const base = updated.hero.headline.replace(/\s*—\s*Act Now\s*$/i, "").trim();
    if (!/act now/i.test(updated.hero.headline)) {
      set("hero.headline", `${base} — Act Now`);
    }
    replies.push("Hero headline strengthened with urgency.");
  } else if (/headline|hero/.test(msg) && /short|concise|shorter/.test(msg)) {
    const short = updated.hero.headline.split(/[.—–-]/)[0]?.trim() || updated.hero.headline;
    set("hero.headline", short);
    replies.push("Hero headline shortened.");
  } else if (/headline|hero/.test(msg) && /rewrite|improve|better/.test(msg)) {
    set("hero.headline", updated.tagline || updated.hero.headline);
    set("hero.subheadline", updated.meta.description.slice(0, 120));
    replies.push("Hero copy refreshed from your business profile.");
  }

  if (/tagline/.test(msg)) {
    const taglineMatch = userMessage.match(/tagline\s+(?:to\s+)?['"]([^'"]+)['"]/i);
    if (taglineMatch) {
      set("tagline", taglineMatch[1]);
      set("hero.subheadline", taglineMatch[1]);
      replies.push(`Tagline updated to "${taglineMatch[1]}".`);
    }
  }

  if (/email/.test(msg)) {
    const emailMatch = userMessage.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i);
    if (emailMatch) {
      set("contact.email", emailMatch[0]);
      replies.push(`Contact email updated to ${emailMatch[0]}.`);
    }
  }

  if (/testimonial|review|social proof/.test(msg)) {
    set("testimonials.headline", "Trusted by our clients");
    replies.push("Testimonials section headline updated.");
  }

  if (replies.length > 0) {
    return { message: replies.join(" "), updatedConfig: updated, patches: allPatches };
  }

  return {
    message:
      'Try:\n• "Rename to Shyam & Co"\n• "Change name from Ram & Co to Shyam & Co"\n• "Make it more professional"\n• "Change primary color to navy"\n• "Make the hero headline more urgent"',
    updatedConfig: siteConfig,
    patches: [],
  };
}
