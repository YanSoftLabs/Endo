"use client";

import dynamic from "next/dynamic";
import type { SiteConfig } from "@/lib/schemas/site-config";

const Hero3DFull   = dynamic(() => import("../3d/Hero3DFull").then((m) => m.Hero3DFull),     { ssr: false });
const Hero3DHybrid = dynamic(() => import("../3d/Hero3DHybrid").then((m) => m.Hero3DHybrid), { ssr: false });
const Hero3DCss    = dynamic(() => import("../3d/Hero3DCss").then((m) => m.Hero3DCss),       { ssr: false });

function HeroVisual({ config }: { config: SiteConfig }) {
  const { designTokens, threeDStyle, heroImage } = config;

  // If we have a real AI-generated image, show it prominently
  if (heroImage) {
    return (
      <div className="relative h-[440px] w-full rounded-2xl overflow-hidden shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt={`${config.businessName} hero`}
          className="w-full h-full object-cover"
        />
        {/* Subtle overlay to ensure text contrast if needed */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent pointer-events-none rounded-2xl" />
      </div>
    );
  }

  // Fallback to 3D visuals
  if (threeDStyle === "full_webgl") {
    return <Hero3DFull primaryColor={designTokens.primaryColor} secondaryColor={designTokens.secondaryColor} />;
  }
  if (threeDStyle === "hybrid") {
    return <Hero3DHybrid primaryColor={designTokens.primaryColor} secondaryColor={designTokens.secondaryColor} />;
  }
  if (threeDStyle === "css_3d") {
    return <Hero3DCss primaryColor={designTokens.primaryColor} accentColor={designTokens.accentColor} />;
  }

  // "basic" — no 3D visual, show a styled card instead
  return (
    <div
      className="h-[340px] w-full rounded-2xl flex items-center justify-center shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${designTokens.primaryColor}22, ${designTokens.secondaryColor}33)`,
        border: `1px solid ${designTokens.primaryColor}44`,
      }}
    >
      <div className="text-center space-y-3 px-8">
        <div
          className="text-5xl font-black tracking-tight"
          style={{ color: designTokens.primaryColor }}
        >
          {config.businessName
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 3)}
        </div>
        <p className="text-sm font-medium opacity-60">{config.tagline}</p>
      </div>
    </div>
  );
}

export function HeroSection({ config }: { config: SiteConfig }) {
  const { hero, designTokens } = config;

  const hasImage = !!config.heroImage;

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center px-6 py-20"
      style={{
        background: `linear-gradient(135deg, ${designTokens.primaryColor}12, ${designTokens.secondaryColor}22)`,
      }}
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center w-full">
        {/* Text side */}
        <div className="space-y-6 z-10">
          <p className="text-sm uppercase tracking-widest opacity-60">{config.tagline}</p>
          <h1
            className="text-4xl md:text-6xl font-bold leading-tight"
            style={{ color: designTokens.primaryColor }}
          >
            {hero.headline}
          </h1>
          <p className="text-lg md:text-xl opacity-80 max-w-xl">{hero.subheadline}</p>
          <div className="flex flex-wrap gap-4">
            <a
              href={hero.primaryCta.url}
              className="px-8 py-4 rounded-xl font-semibold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: designTokens.primaryColor }}
            >
              {hero.primaryCta.label}
            </a>
            <a
              href={hero.secondaryCta.url}
              className="px-8 py-4 rounded-xl font-semibold border-2 transition hover:scale-105"
              style={{
                borderColor: designTokens.primaryColor,
                color: designTokens.primaryColor,
              }}
            >
              {hero.secondaryCta.label}
            </a>
          </div>
          <p className="text-sm opacity-50">{hero.trustText}</p>
        </div>

        {/* Visual side */}
        <div className={hasImage ? "relative" : ""}>
          <HeroVisual config={config} />
        </div>
      </div>
    </section>
  );
}
