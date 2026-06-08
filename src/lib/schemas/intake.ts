import { z } from "zod";

export const threeDStyleSchema = z.enum(["full_webgl", "hybrid", "css_3d", "basic"]);
export const brandToneSchema = z.enum(["professional", "playful", "luxury", "technical", "friendly"]);

export const productServiceSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.string().optional(),
});

export const testimonialSchema = z.object({
  name: z.string(),
  role: z.string(),
  quote: z.string(),
});

export const intakeFormSchema = z.object({
  // Step 1 — Business basics
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  tagline: z.string().min(2, "Tagline must be at least 2 characters"),
  industry: z.string().min(2, "Please describe your industry"),
  targetAudience: z.string().min(5, "Describe who your customers are"),
  valueProposition: z.string().min(10, "Describe what you offer and why it matters"),

  // Step 2 — Services (optional extras)
  additionalServices: z.array(productServiceSchema).default([]),
  usePlaceholderTestimonials: z.boolean().default(true),
  testimonials: z.array(testimonialSchema).default([]),

  // Step 3 — Visual style
  threeDStyle: threeDStyleSchema.default("hybrid"),
  brandTone: brandToneSchema.default("professional"),
  generateHeroImage: z.boolean().default(false),
  aiPickColors: z.boolean().default(true),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),

  // Step 4 — Contact & legal
  contactEmail: z.string().email("Enter a valid email address"),
  businessAddress: z.string().min(3, "Enter your business address or city"),
  country: z.string().min(2, "Select your country").default("United States"),
  legalPages: z.object({
    privacy: z.boolean().default(true),
    terms: z.boolean().default(true),
    disclaimer: z.boolean().default(true),
    refund: z.boolean().default(true),
    cookieNotice: z.boolean().default(true),
  }),
});

export type IntakeFormData = z.infer<typeof intakeFormSchema>;
export type ThreeDStyle = z.infer<typeof threeDStyleSchema>;
