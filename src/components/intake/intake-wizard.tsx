"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { intakeFormSchema, type IntakeFormData } from "@/lib/schemas/intake";
import type { ZodError } from "zod";

const STEPS = ["Your Business", "Services", "Visual Style", "Contact & Legal"];


const STYLE_OPTIONS = [
  {
    value: "full_webgl" as const,
    label: "Full 3D",
    description: "Immersive WebGL animation — best for tech, SaaS, luxury",
    preview: "⬡",
  },
  {
    value: "hybrid" as const,
    label: "3D + Motion",
    description: "3D hero with smooth scroll animations — works for any business",
    preview: "◈",
  },
  {
    value: "css_3d" as const,
    label: "Light 3D",
    description: "CSS depth effects, fast loading — great for local services",
    preview: "◻",
  },
  {
    value: "basic" as const,
    label: "Classic",
    description: "Clean, professional layout with no 3D — suits all industries",
    preview: "▭",
  },
];

const TONE_OPTIONS: { value: IntakeFormData["brandTone"]; label: string; hint: string }[] = [
  { value: "professional", label: "Professional", hint: "Formal, trustworthy" },
  { value: "friendly",     label: "Friendly",     hint: "Warm, approachable" },
  { value: "luxury",       label: "Luxury",       hint: "Premium, exclusive" },
  { value: "playful",      label: "Playful",      hint: "Fun, energetic" },
  { value: "technical",    label: "Technical",    hint: "Expert, precise" },
];

const defaultForm: IntakeFormData = {
  businessName: "",
  tagline: "",
  industry: "",
  targetAudience: "",
  valueProposition: "",
  additionalServices: [],
  usePlaceholderTestimonials: true,
  testimonials: [],
  threeDStyle: "hybrid",
  brandTone: "professional",
  generateHeroImage: false,
  aiPickColors: true,
  primaryColor: undefined,
  secondaryColor: undefined,
  contactEmail: "",
  businessAddress: "",
  country: "United States",
  legalPages: { privacy: true, terms: true, disclaimer: true, refund: true, cookieNotice: true },
};

function formatZodErrors(error: ZodError): string {
  return error.issues
    .map((issue) => {
      const field = issue.path.map(String).join(".");
      return field ? `${field}: ${issue.message}` : issue.message;
    })
    .join("; ");
}

export function IntakeWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<IntakeFormData>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [insights, setInsights] = useState<string[]>([]);
  const [error, setError] = useState("");
  // extra service row state
  const [serviceRow, setServiceRow] = useState({ name: "", description: "" });

  const update = <K extends keyof IntakeFormData>(key: K, value: IntakeFormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  };

  const addService = () => {
    if (!serviceRow.name.trim()) return;
    update("additionalServices", [...form.additionalServices, { name: serviceRow.name.trim(), description: serviceRow.description.trim() }]);
    setServiceRow({ name: "", description: "" });
  };

  const removeService = (i: number) => {
    update("additionalServices", form.additionalServices.filter((_, idx) => idx !== i));
  };

  const handleGenerate = async () => {
    const validation = intakeFormSchema.safeParse(form);
    if (!validation.success) {
      setError(formatZodErrors(validation.error));
      return;
    }

    setLoading(true);
    setError("");
    setStatus("Starting AI analysis...");
    setInsights([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      if (!res.ok) throw new Error((await res.text()) || "Generation failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No response stream");

      let buffer = "";
      let projectId: string | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          let event: { type: string; message?: string; projectId?: string };
          try { event = JSON.parse(line.slice(6)); } catch { continue; }
          if (event.type === "stage" && event.message) setStatus(event.message);
          else if (event.type === "insight" && event.message) setInsights((p) => [...p, event.message!]);
          else if (event.type === "complete" && event.projectId) projectId = event.projectId;
          else if (event.type === "error") throw new Error(event.message || "Generation failed");
        }
      }

      if (projectId) { router.push(`/editor/${projectId}`); return; }
      throw new Error("Generation finished without a project. Please try again.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      {/* Progress bar */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`font-medium transition-colors ${i < step ? "text-violet-400" : i === step ? "text-violet-600" : "text-gray-400"}`}
            >
              {i < step ? "✓" : i + 1}. {s}
            </span>
          ))}
        </div>
        <Progress value={((step + 1) / STEPS.length) * 100} />
      </div>

      {/* ── Step 0: Business Basics ── */}
      {step === 0 && (
        <div className="space-y-5">
          <div>
            <Label>Business name <span className="text-red-500">*</span></Label>
            <Input
              value={form.businessName}
              onChange={(e) => update("businessName", e.target.value)}
              placeholder="e.g. Apex Legal Associates"
            />
          </div>
          <div>
            <Label>One-line tagline <span className="text-red-500">*</span></Label>
            <Input
              value={form.tagline}
              onChange={(e) => update("tagline", e.target.value)}
              placeholder="e.g. Trusted counsel for complex matters"
            />
          </div>
          <div>
            <Label>Industry / type of business <span className="text-red-500">*</span></Label>
            <Input
              value={form.industry}
              onChange={(e) => update("industry", e.target.value)}
              placeholder="e.g. Law firm, Fitness studio, SaaS, E-commerce…"
            />
          </div>
          <div>
            <Label>Who are your customers? <span className="text-red-500">*</span></Label>
            <Input
              value={form.targetAudience}
              onChange={(e) => update("targetAudience", e.target.value)}
              placeholder="e.g. Small business owners, Parents aged 30–50, Tech startups…"
            />
          </div>
          <div>
            <Label>What do you offer and why does it matter? <span className="text-red-500">*</span></Label>
            <Textarea
              rows={3}
              value={form.valueProposition}
              onChange={(e) => update("valueProposition", e.target.value)}
              placeholder="e.g. We help individuals resolve property disputes quickly and affordably, with a 95% success rate."
            />
            <p className="text-xs text-gray-400 mt-1">The AI will expand and improve this — be honest, not perfect.</p>
          </div>
        </div>
      )}

      {/* ── Step 1: Services ── */}
      {step === 1 && (
        <div className="space-y-5">
          <p className="text-sm text-gray-500">
            The AI will automatically generate your core service offerings from your business description.
            Add specific services below only if you want them explicitly listed.
          </p>

          {form.additionalServices.length > 0 && (
            <ul className="space-y-2">
              {form.additionalServices.map((s, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50 text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{s.name}</p>
                    {s.description && <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{s.description}</p>}
                  </div>
                  <button type="button" onClick={() => removeService(i)} className="text-gray-400 hover:text-red-500 shrink-0 mt-0.5">✕</button>
                </li>
              ))}
            </ul>
          )}

          <div className="rounded-xl border p-4 space-y-3 bg-white">
            <Label className="text-sm font-medium">Add a service (optional)</Label>
            <Input
              value={serviceRow.name}
              onChange={(e) => setServiceRow((r) => ({ ...r, name: e.target.value }))}
              placeholder="Service name"
            />
            <Input
              value={serviceRow.description}
              onChange={(e) => setServiceRow((r) => ({ ...r, description: e.target.value }))}
              placeholder="Brief description (optional)"
            />
            <Button type="button" variant="outline" onClick={addService} disabled={!serviceRow.name.trim()} className="w-full">
              + Add service
            </Button>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={form.usePlaceholderTestimonials}
              onChange={(e) => update("usePlaceholderTestimonials", e.target.checked)}
              className="rounded"
            />
            Generate realistic placeholder testimonials (recommended)
          </label>
        </div>
      )}

      {/* ── Step 2: Visual Style ── */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <Label className="text-sm font-semibold mb-3 block">Choose your visual style</Label>
            <div className="grid grid-cols-2 gap-3">
              {STYLE_OPTIONS.map(({ value, label, description, preview }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update("threeDStyle", value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    form.threeDStyle === value
                      ? "border-violet-600 bg-violet-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <span className="text-2xl block mb-2">{preview}</span>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-snug">{description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold mb-3 block">Brand tone</Label>
            <div className="grid grid-cols-3 gap-2">
              {TONE_OPTIONS.map(({ value, label, hint }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => update("brandTone", value)}
                  className={`px-3 py-2.5 rounded-lg border text-left text-sm transition-all ${
                    form.brandTone === value
                      ? "border-violet-600 bg-violet-50 text-violet-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <p className="font-medium">{label}</p>
                  <p className="text-xs opacity-60 mt-0.5">{hint}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={form.aiPickColors}
                onChange={(e) => update("aiPickColors", e.target.checked)}
                className="rounded"
              />
              Let AI pick brand colors based on your industry and tone
            </label>

            {!form.aiPickColors && (
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <Label className="text-xs">Primary color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={form.primaryColor || "#7c3aed"}
                      onChange={(e) => update("primaryColor", e.target.value)}
                      className="h-9 w-16 rounded border cursor-pointer"
                    />
                    <span className="text-xs text-gray-500 font-mono">{form.primaryColor || "#7c3aed"}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Secondary color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={form.secondaryColor || "#5b21b6"}
                      onChange={(e) => update("secondaryColor", e.target.value)}
                      className="h-9 w-16 rounded border cursor-pointer"
                    />
                    <span className="text-xs text-gray-500 font-mono">{form.secondaryColor || "#5b21b6"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border p-4 bg-white space-y-1">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.generateHeroImage ?? false}
                onChange={(e) => update("generateHeroImage", e.target.checked)}
                className="rounded mt-0.5 accent-violet-600"
              />
              <div>
                <p className="text-sm font-medium text-gray-800">Generate AI hero image</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Use AI to create a custom photo for the hero section, tailored to your industry and brand.
                  Adds ~5 seconds to generation.
                </p>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* ── Step 3: Contact & Legal ── */}
      {step === 3 && (
        <div className="space-y-5">
          <div>
            <Label>Contact email <span className="text-red-500">*</span></Label>
            <Input
              type="email"
              value={form.contactEmail}
              onChange={(e) => update("contactEmail", e.target.value)}
              placeholder="hello@yourbusiness.com"
            />
          </div>
          <div>
            <Label>Business address / city <span className="text-red-500">*</span></Label>
            <Input
              value={form.businessAddress}
              onChange={(e) => update("businessAddress", e.target.value)}
              placeholder="123 Main St, Austin, TX  or  Austin, TX"
            />
          </div>
          <div>
            <Label>Country / Jurisdiction <span className="text-red-500">*</span></Label>
            <Input
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              placeholder="e.g. United States, India, United Kingdom…"
            />
          </div>

          <div className="rounded-xl border p-4 space-y-2 bg-gray-50">
            <Label className="text-sm font-semibold">Legal pages to generate</Label>
            <p className="text-xs text-gray-500 mb-2">All pages will be linked in your footer and accessible as separate routes.</p>
            {(["privacy", "terms", "disclaimer", "refund", "cookieNotice"] as const).map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.legalPages[key]}
                  onChange={(e) => update("legalPages", { ...form.legalPages, [key]: e.target.checked })}
                  className="rounded"
                />
                {key === "cookieNotice" ? "Cookie notice banner" :
                 key === "privacy" ? "Privacy Policy" :
                 key === "terms" ? "Terms & Conditions" :
                 key === "disclaimer" ? "Disclaimer" :
                 "Refund Policy"}
              </label>
            ))}
          </div>

          <p className="text-xs text-gray-400">
            Legal pages are AI-generated templates. Review with a qualified attorney before publishing.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading progress */}
      {loading && (
        <div className="rounded-xl border border-violet-200 bg-violet-50/60 p-4 space-y-3">
          <p className="text-violet-700 text-sm font-medium animate-pulse">{status}</p>
          {insights.length > 0 && (
            <ul className="space-y-2">
              {insights.map((insight, i) => (
                <li key={i} className="text-xs text-gray-700 flex gap-2">
                  <span className="text-violet-500 shrink-0">✦</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <Button variant="outline" disabled={step === 0 || loading} onClick={() => setStep((s) => s - 1)}>
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)}>
            Continue →
          </Button>
        ) : (
          <Button onClick={handleGenerate} disabled={loading} className="bg-violet-600 hover:bg-violet-700">
            {loading ? "Generating your site…" : "Generate my site ✦"}
          </Button>
        )}
      </div>
    </div>
  );
}
