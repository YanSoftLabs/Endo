"use client";

import type { SiteConfig } from "@/lib/schemas/site-config";
import { HeroSection } from "./sections/HeroSection";
import { SiteNav } from "@/components/site/SiteNav";

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`px-6 py-16 ${className}`}>
      {children}
    </section>
  );
}

export function SiteRenderer({ config }: { config: SiteConfig }) {
  const t = config.designTokens;
  const style = {
    fontFamily: t.fontFamily,
    "--primary": t.primaryColor,
    "--secondary": t.secondaryColor,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-white text-gray-900" style={style}>
      {/* Cookie notice */}
      {config.legal.showCookieNotice && (
        <div className="bg-gray-900 text-white text-xs px-4 py-2 text-center">
          We use cookies to improve your experience. By continuing, you agree to our{" "}
          {config.projectId ? (
            <a href={`/legal/${config.projectId}/privacy`} className="underline hover:opacity-80">
              Privacy Policy
            </a>
          ) : (
            "Privacy Policy"
          )}
          .
        </div>
      )}

      {/* Shared nav — same component used on legal pages */}
      <SiteNav config={config} />

      {/* Hero */}
      <HeroSection config={config} />

      {/* Social proof stats */}
      <Section id="social-proof" className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8 text-center">
          {config.socialProof.stats.map((s) => (
            <div key={s.label}>
              <div
                className="text-4xl font-bold tracking-tight"
                style={{ color: t.primaryColor }}
              >
                {s.value}
              </div>
              <div className="text-sm text-gray-600 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Problem */}
      <Section id="problem">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            {config.problem.headline}
          </h2>
          <p className="opacity-80">{config.problem.body}</p>
          <ul className="text-left space-y-2 max-w-md mx-auto">
            {config.problem.bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span style={{ color: t.accentColor }}>✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Solution */}
      <Section id="solution" className="bg-gray-50">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">{config.solution.headline}</h2>
          <p className="opacity-80">{config.solution.body}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {config.solution.benefits.map((b) => (
              <div
                key={b}
                className="p-4 rounded-xl border"
                style={{ borderColor: t.primaryColor + "33" }}
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Features */}
      <Section id="features">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{config.features.headline}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {config.features.items.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border hover:shadow-lg transition"
                style={{ borderRadius: t.borderRadius }}
              >
                <h3 className="font-bold text-lg mb-2" style={{ color: t.primaryColor }}>
                  {f.title}
                </h3>
                <p className="opacity-70 text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* How it works */}
      <Section id="how-it-works" className="bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">{config.howItWorks.headline}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {config.howItWorks.steps.map((s, i) => (
              <div key={s.title}>
                <div
                  className="w-10 h-10 rounded-full text-white flex items-center justify-center mx-auto mb-4 font-bold"
                  style={{ backgroundColor: t.primaryColor }}
                >
                  {i + 1}
                </div>
                <h3 className="font-bold mb-2">{s.title}</h3>
                <p className="text-sm opacity-70">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section id="testimonials">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{config.testimonials.headline}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {config.testimonials.items.map((item) => (
              <blockquote
                key={item.name}
                className="p-6 rounded-2xl border bg-white shadow-sm"
              >
                <p className="italic mb-4">&ldquo;{item.quote}&rdquo;</p>
                <footer className="font-semibold">
                  {item.name}
                  <span className="block text-sm opacity-60 font-normal">{item.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </Section>

      {/* Pricing */}
      {config.pricing.enabled && (
        <Section id="pricing" className="bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-12">{config.pricing.headline}</h2>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            {config.pricing.plans.map((p) => (
              <div
                key={p.name}
                className="p-6 rounded-2xl border bg-white text-center"
              >
                <h3 className="font-bold text-xl">{p.name}</h3>
                <p className="text-3xl font-bold my-4" style={{ color: t.primaryColor }}>
                  {p.price}
                </p>
                <ul className="text-sm space-y-2 mb-6">
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <button
                  className="w-full py-2 rounded-lg text-white"
                  style={{ backgroundColor: t.primaryColor }}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* FAQ */}
      <Section id="faq">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{config.faq.headline}</h2>
          <div className="space-y-4">
            {config.faq.items.map((item) => (
              <details key={item.question} className="p-4 rounded-xl border group">
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                  {item.question}
                  <span className="ml-2 opacity-50 text-sm group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="mt-3 text-sm opacity-70 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* Blog teaser */}
      <Section id="blog" className="bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{config.blogTeaser.headline}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {config.blogTeaser.posts.map((p) => (
              <article key={p.slug} className="p-6 rounded-2xl border bg-white">
                <h3 className="font-bold mb-2">{p.title}</h3>
                <p className="text-sm opacity-70">{p.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold">{config.contact.headline}</h2>
          <p>
            <a
              href={`mailto:${config.contact.email}`}
              className="underline hover:opacity-80 transition"
              style={{ color: t.primaryColor }}
            >
              {config.contact.email}
            </a>
          </p>
          {config.contact.address && (
            <p className="text-sm opacity-70">{config.contact.address}</p>
          )}
        </div>
      </Section>

      {/* Final CTA */}
      <section
        className="px-6 py-24 text-center text-white"
        style={{
          background: `linear-gradient(135deg, ${t.primaryColor}, ${t.secondaryColor})`,
        }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
          {config.finalCta.headline}
        </h2>
        <p className="mb-10 opacity-95 max-w-2xl mx-auto text-lg leading-relaxed">
          {config.finalCta.subheadline}
        </p>
        <a
          href={config.finalCta.ctaUrl}
          className="inline-block px-10 py-4 bg-white rounded-lg font-semibold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
          style={{ color: t.primaryColor }}
        >
          {config.finalCta.ctaLabel}
        </a>
      </section>

      {/* Footer */}
      <footer className="px-6 py-14 bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
            <div>
              <p className="font-bold text-white text-lg">{config.businessName}</p>
              {config.tagline && (
                <p className="text-sm text-slate-400 mt-1">{config.tagline}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              {config.footer.legalLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-slate-400 hover:text-white transition"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between gap-2">
            <p className="text-sm text-slate-400">{config.footer.copyright}</p>
            <p className="text-xs text-slate-600">{config.disclaimerBanner}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
