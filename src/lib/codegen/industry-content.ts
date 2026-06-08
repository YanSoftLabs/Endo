import type { IntakeFormData } from "@/lib/schemas/intake";
import type { BusinessProfile } from "@/lib/schemas/business-profile";

export type IndustryKey =
  | "accounting"
  | "legal"
  | "healthcare"
  | "saas"
  | "fitness"
  | "ecommerce"
  | "consulting"
  | "general";

export interface IndustryPack {
  colors: { primary: string; secondary: string; accent: string };
  fontFamily: string;
  borderRadius: string;
  nav: { label: string; href: string }[];
  painPoints: string[];
  conversionHooks: string[];
  stats: { value: string; label: string }[];
  featuresHeadline: string;
  defaultFeatures: { title: string; description: string }[];
  problemHeadline: string;
  solutionHeadline: string;
  howItWorks: {
    headline: string;
    steps: { title: string; description: string }[];
  };
  faq: { question: string; answer: string }[];
  blogPosts: { title: string; excerpt: string; slug: string }[];
  finalCtaHeadline: string;
  secondaryCtaLabel: string;
  trustSuffix: string;
}

const PACKS: Record<IndustryKey, IndustryPack> = {
  accounting: {
    colors: { primary: "#1e3a5f", secondary: "#0f2744", accent: "#c5a028" },
    fontFamily: '"Source Serif 4", Georgia, "Times New Roman", serif',
    borderRadius: "0.375rem",
    nav: [
      { label: "Services", href: "#features" },
      { label: "Why Us", href: "#solution" },
      { label: "Clients", href: "#testimonials" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#contact" },
    ],
    painPoints: [
      "Complex tax regulations and filing deadlines",
      "Time lost on bookkeeping instead of growing the business",
      "Uncertainty about compliance and audit readiness",
      "Lack of proactive financial planning and advisory",
    ],
    conversionHooks: [
      "ICAI registered professionals",
      "Free initial consultation",
      "Transparent, fixed-fee packages",
    ],
    stats: [
      { value: "15+", label: "Years of expertise" },
      { value: "500+", label: "Clients served" },
      { value: "100%", label: "Compliance focus" },
    ],
    featuresHeadline: "Our professional services",
    defaultFeatures: [
      { title: "Tax & GST Filing", description: "End-to-end tax compliance, filings, and advisory for businesses of all sizes." },
      { title: "Bookkeeping & Accounts", description: "Accurate financial records so you always know where your business stands." },
      { title: "Audit & Assurance", description: "Statutory and internal audits carried out with rigor and discretion." },
      { title: "Business Advisory", description: "Strategic financial guidance to drive growth and improve profitability." },
      { title: "Payroll Management", description: "Timely, compliant payroll processing so your team is always paid on time." },
      { title: "Company Incorporation", description: "Full support for new business registration and compliance setup." },
    ],
    problemHeadline: "Financial complexity holding your business back?",
    solutionHeadline: "Trusted accounting partners for your growth",
    howItWorks: {
      headline: "How we work with you",
      steps: [
        { title: "Discovery call", description: "We learn about your business, goals, and compliance requirements." },
        { title: "Custom roadmap", description: "A tailored plan covering tax, audit, advisory, and ongoing support." },
        { title: "Dedicated partnership", description: "Year-round guidance so you stay compliant and confident." },
      ],
    },
    faq: [
      { question: "Do you handle GST and income tax filing?", answer: "Yes. We manage end-to-end tax compliance, filings, and advisory for businesses of all sizes." },
      { question: "Can startups and SMEs afford your services?", answer: "We offer scalable packages designed for startups, SMEs, and established enterprises." },
      { question: "How do I get started?", answer: "Book a free consultation. We'll assess your needs and recommend the right service plan." },
    ],
    blogPosts: [
      { title: "Tax planning tips for the new financial year", excerpt: "Proactive strategies to reduce liability and stay compliant.", slug: "tax-planning" },
      { title: "GST compliance checklist for SMEs", excerpt: "Essential steps every business owner should follow.", slug: "gst-checklist" },
      { title: "When to hire a chartered accountant", excerpt: "Signs your business is ready for professional financial support.", slug: "hire-ca" },
    ],
    finalCtaHeadline: "Schedule your free consultation",
    secondaryCtaLabel: "View our services",
    trustSuffix: "Trusted by businesses for reliable financial expertise",
  },
  legal: {
    colors: { primary: "#1a2744", secondary: "#0d1b2a", accent: "#8b7355" },
    fontFamily: '"Source Serif 4", Georgia, serif',
    borderRadius: "0.25rem",
    nav: [
      { label: "Practice areas", href: "#features" },
      { label: "About", href: "#solution" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#contact" },
    ],
    painPoints: [
      "Legal risks without expert guidance",
      "Complex contracts and disputes",
      "Uncertainty navigating regulations",
      "Need for responsive, trusted counsel",
    ],
    conversionHooks: ["Confidential consultation", "Experienced advocates", "Client-first approach"],
    stats: [
      { value: "20+", label: "Years in practice" },
      { value: "1,000+", label: "Cases handled" },
      { value: "24/7", label: "Client support" },
    ],
    featuresHeadline: "Practice areas",
    defaultFeatures: [
      { title: "Corporate Law", description: "Business formation, contracts, and corporate governance." },
      { title: "Civil Litigation", description: "Expert representation in disputes and court proceedings." },
      { title: "Property & Real Estate", description: "Transactions, disputes, and regulatory compliance." },
      { title: "Family Law", description: "Sensitive counsel for divorce, custody, and estate matters." },
      { title: "Employment Law", description: "Protecting employer and employee rights in the workplace." },
      { title: "Criminal Defence", description: "Experienced advocates for individuals facing criminal charges." },
    ],
    problemHeadline: "Facing legal challenges alone?",
    solutionHeadline: "Experienced counsel on your side",
    howItWorks: {
      headline: "Our process",
      steps: [
        { title: "Consultation", description: "Confidential review of your situation and objectives." },
        { title: "Strategy", description: "Clear legal strategy with transparent next steps." },
        { title: "Representation", description: "Dedicated advocacy through resolution." },
      ],
    },
    faq: [
      { question: "What areas do you specialize in?", answer: "We cover corporate law, litigation, contracts, and regulatory compliance tailored to your industry." },
      { question: "How are fees structured?", answer: "We offer fixed-fee and retainer options discussed upfront during your consultation." },
      { question: "Is my consultation confidential?", answer: "Absolutely. All client communications are protected by attorney-client privilege." },
    ],
    blogPosts: [
      { title: "Understanding your legal rights", excerpt: "Key protections every business owner should know.", slug: "legal-rights" },
      { title: "Contract essentials", excerpt: "Clauses that protect your interests in every agreement.", slug: "contracts" },
      { title: "When to seek legal counsel", excerpt: "Early intervention saves time and cost.", slug: "seek-counsel" },
    ],
    finalCtaHeadline: "Book a confidential consultation",
    secondaryCtaLabel: "Our practice areas",
    trustSuffix: "Protecting clients with integrity and expertise",
  },
  healthcare: {
    colors: { primary: "#0d9488", secondary: "#0f766e", accent: "#5eead4" },
    fontFamily: "Inter, system-ui, sans-serif",
    borderRadius: "0.75rem",
    nav: [
      { label: "Services", href: "#features" },
      { label: "About", href: "#solution" },
      { label: "Reviews", href: "#testimonials" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#contact" },
    ],
    painPoints: [
      "Difficulty accessing quality care",
      "Long wait times and unclear pricing",
      "Need for personalized treatment plans",
      "Managing health proactively",
    ],
    conversionHooks: ["Licensed professionals", "Same-week appointments", "Patient-centered care"],
    stats: [
      { value: "10k+", label: "Patients treated" },
      { value: "4.9★", label: "Average rating" },
      { value: "15+", label: "Years serving community" },
    ],
    featuresHeadline: "Our care services",
    defaultFeatures: [
      { title: "General Consultations", description: "Thorough assessment and diagnosis by experienced clinicians." },
      { title: "Preventive Health Checks", description: "Comprehensive screening to catch issues early." },
      { title: "Specialist Referrals", description: "Fast-tracked access to trusted specialist care." },
      { title: "Chronic Disease Management", description: "Ongoing support and treatment plans for long-term conditions." },
      { title: "Mental Health Support", description: "Compassionate counselling and psychiatric services." },
      { title: "Vaccinations & Immunisation", description: "Full range of vaccines for all ages." },
    ],
    problemHeadline: "Health concerns deserve expert attention",
    solutionHeadline: "Compassionate care you can trust",
    howItWorks: {
      headline: "Your care journey",
      steps: [
        { title: "Book appointment", description: "Easy scheduling online or by phone." },
        { title: "Personalized assessment", description: "Thorough evaluation and clear diagnosis." },
        { title: "Ongoing care", description: "Treatment plans and follow-up support." },
      ],
    },
    faq: [
      { question: "Do you accept insurance?", answer: "We work with major insurance providers. Contact us to verify your coverage." },
      { question: "How do I book an appointment?", answer: "Use our online booking or call us directly for the next available slot." },
      { question: "What should I bring to my first visit?", answer: "Bring ID, insurance details, and any relevant medical records or referrals." },
    ],
    blogPosts: [
      { title: "Preventive health essentials", excerpt: "Simple habits for long-term wellness.", slug: "preventive-health" },
      { title: "Understanding your symptoms", excerpt: "When to seek professional care.", slug: "symptoms" },
      { title: "Patient rights explained", excerpt: "What to expect from quality healthcare.", slug: "patient-rights" },
    ],
    finalCtaHeadline: "Book your appointment today",
    secondaryCtaLabel: "View services",
    trustSuffix: "Committed to your health and wellbeing",
  },
  saas: {
    colors: { primary: "#2563eb", secondary: "#1e40af", accent: "#38bdf8" },
    fontFamily: "Inter, system-ui, sans-serif",
    borderRadius: "0.75rem",
    nav: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Customers", href: "#testimonials" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#contact" },
    ],
    painPoints: [
      "Manual workflows slowing teams down",
      "Siloed tools creating friction",
      "Scaling without the right infrastructure",
      "Poor conversion from trial to paid",
    ],
    conversionHooks: ["Free trial, no credit card", "Setup in minutes", "Cancel anytime"],
    stats: [
      { value: "10k+", label: "Active users" },
      { value: "99.9%", label: "Uptime SLA" },
      { value: "3x", label: "Avg. productivity gain" },
    ],
    featuresHeadline: "Built for modern teams",
    defaultFeatures: [
      { title: "Workflow Automation", description: "Eliminate repetitive tasks and let your team focus on what matters." },
      { title: "Real-time Analytics", description: "Dashboards and insights to drive smarter decisions instantly." },
      { title: "Team Collaboration", description: "Built-in tools to keep everyone aligned across projects." },
      { title: "Integrations", description: "Connect with 100+ apps in your existing stack." },
      { title: "Security & Compliance", description: "Enterprise-grade encryption and role-based access control." },
      { title: "Scalable Infrastructure", description: "99.9% uptime SLA that grows with your user base." },
    ],
    problemHeadline: "Still wrestling with outdated tools?",
    solutionHeadline: "The platform that scales with you",
    howItWorks: {
      headline: "Get started in 3 steps",
      steps: [
        { title: "Sign up free", description: "Create your account in under 2 minutes." },
        { title: "Configure & integrate", description: "Connect your tools and customize workflows." },
        { title: "Launch & grow", description: "Start converting and scale with confidence." },
      ],
    },
    faq: [
      { question: "Is there a free trial?", answer: "Yes. Start free with full access — no credit card required." },
      { question: "Can I integrate with my existing stack?", answer: "We integrate with popular CRMs, email tools, and payment providers." },
      { question: "What support do you offer?", answer: "Email, chat, and priority support on paid plans." },
    ],
    blogPosts: [
      { title: "Scaling your SaaS in 2026", excerpt: "Growth strategies that actually work.", slug: "saas-growth" },
      { title: "Productivity automation guide", excerpt: "Eliminate repetitive work across your team.", slug: "automation" },
      { title: "Customer retention tactics", excerpt: "Turn trials into loyal subscribers.", slug: "retention" },
    ],
    finalCtaHeadline: "Start your free trial",
    secondaryCtaLabel: "See features",
    trustSuffix: "Trusted by fast-growing teams worldwide",
  },
  fitness: {
    colors: { primary: "#16a34a", secondary: "#15803d", accent: "#86efac" },
    fontFamily: "Inter, system-ui, sans-serif",
    borderRadius: "1rem",
    nav: [
      { label: "Programs", href: "#features" },
      { label: "Results", href: "#testimonials" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#contact" },
    ],
    painPoints: [
      "Inconsistent workout routines",
      "No personalized guidance or accountability",
      "Plateauing results and lost motivation",
      "Confusion about nutrition and recovery",
    ],
    conversionHooks: ["Free fitness assessment", "Certified trainers", "Results guaranteed"],
    stats: [
      { value: "2,000+", label: "Members transformed" },
      { value: "95%", label: "Goal achievement rate" },
      { value: "50+", label: "Expert trainers" },
    ],
    featuresHeadline: "Training programs",
    defaultFeatures: [
      { title: "Personal Training", description: "1-on-1 sessions designed around your body, goals, and schedule." },
      { title: "Group Classes", description: "High-energy classes for all fitness levels." },
      { title: "Nutrition Coaching", description: "Science-backed meal plans to fuel performance and recovery." },
      { title: "Online Coaching", description: "Train from anywhere with live and on-demand sessions." },
      { title: "Body Transformation", description: "12-week programs with weekly check-ins and guaranteed results." },
      { title: "Yoga & Mindfulness", description: "Balance strength training with recovery and mental wellness." },
    ],
    problemHeadline: "Struggling to reach your fitness goals?",
    solutionHeadline: "Personalized training that delivers results",
    howItWorks: {
      headline: "Your transformation path",
      steps: [
        { title: "Free assessment", description: "We evaluate your goals, fitness level, and lifestyle." },
        { title: "Custom program", description: "A plan built around your body and schedule." },
        { title: "Track progress", description: "Weekly check-ins and adjustments for real results." },
      ],
    },
    faq: [
      { question: "Do I need prior gym experience?", answer: "No. Programs are tailored for all fitness levels, from beginner to advanced." },
      { question: "What does a membership include?", answer: "Training sessions, nutrition guidance, and progress tracking." },
      { question: "Can I try before committing?", answer: "Yes — book a free assessment to experience our approach firsthand." },
    ],
    blogPosts: [
      { title: "Nutrition basics for muscle gain", excerpt: "Fuel your body for optimal performance.", slug: "nutrition" },
      { title: "Recovery tips that work", excerpt: "Rest smarter to train harder.", slug: "recovery" },
      { title: "Building sustainable habits", excerpt: "Consistency beats intensity every time.", slug: "habits" },
    ],
    finalCtaHeadline: "Start your free assessment",
    secondaryCtaLabel: "View programs",
    trustSuffix: "Helping members achieve lasting results",
  },
  ecommerce: {
    colors: { primary: "#ea580c", secondary: "#c2410c", accent: "#fdba74" },
    fontFamily: "Inter, system-ui, sans-serif",
    borderRadius: "0.75rem",
    nav: [
      { label: "Products", href: "#features" },
      { label: "Why shop with us", href: "#solution" },
      { label: "Reviews", href: "#testimonials" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#contact" },
    ],
    painPoints: [
      "Low-quality products from unknown sellers",
      "Slow shipping and poor customer service",
      "Difficulty finding products you can trust",
      "Complicated returns and refunds",
    ],
    conversionHooks: ["Free shipping over $50", "30-day easy returns", "Secure checkout"],
    stats: [
      { value: "50k+", label: "Happy customers" },
      { value: "4.8★", label: "Average review" },
      { value: "24h", label: "Dispatch time" },
    ],
    featuresHeadline: "Featured products",
    defaultFeatures: [
      { title: "Curated Selection", description: "Every product hand-picked for quality and value." },
      { title: "Fast Shipping", description: "Same-day dispatch and tracked delivery on every order." },
      { title: "Easy Returns", description: "30-day hassle-free returns — no questions asked." },
      { title: "Secure Checkout", description: "Encrypted payments and zero stored card data." },
      { title: "Loyalty Rewards", description: "Earn points on every purchase and redeem for discounts." },
      { title: "Expert Support", description: "Real humans available to help before and after your purchase." },
    ],
    problemHeadline: "Tired of disappointing online shopping?",
    solutionHeadline: "Quality products, delivered with care",
    howItWorks: {
      headline: "Shop with confidence",
      steps: [
        { title: "Browse & choose", description: "Curated selection with honest reviews." },
        { title: "Fast checkout", description: "Secure payment and order tracking." },
        { title: "Delivered to you", description: "Quick dispatch and hassle-free returns." },
      ],
    },
    faq: [
      { question: "What is your return policy?", answer: "30-day hassle-free returns on all unused items. See our refund policy for details." },
      { question: "How long does shipping take?", answer: "Most orders dispatch within 24 hours and arrive in 3–5 business days." },
      { question: "Is payment secure?", answer: "Yes. We use encrypted checkout and never store card details." },
    ],
    blogPosts: [
      { title: "How to choose the right product", excerpt: "Buyer's guide from our experts.", slug: "buyers-guide" },
      { title: "Care and maintenance tips", excerpt: "Make your purchase last longer.", slug: "care-tips" },
      { title: "Seasonal picks", excerpt: "Top products our customers love right now.", slug: "seasonal" },
    ],
    finalCtaHeadline: "Shop now",
    secondaryCtaLabel: "Browse products",
    trustSuffix: "Quality guaranteed on every order",
  },
  consulting: {
    colors: { primary: "#4f46e5", secondary: "#3730a3", accent: "#a5b4fc" },
    fontFamily: "Inter, system-ui, sans-serif",
    borderRadius: "0.5rem",
    nav: [
      { label: "Services", href: "#features" },
      { label: "Approach", href: "#how-it-works" },
      { label: "Clients", href: "#testimonials" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#contact" },
    ],
    painPoints: [
      "Stagnant growth despite hard work",
      "Lack of strategic direction",
      "Operational inefficiencies eating margins",
      "Need for expert outside perspective",
    ],
    conversionHooks: ["Free strategy session", "Proven frameworks", "ROI-focused engagement"],
    stats: [
      { value: "200+", label: "Clients advised" },
      { value: "3x", label: "Avg. ROI delivered" },
      { value: "12+", label: "Industries served" },
    ],
    featuresHeadline: "Consulting services",
    defaultFeatures: [
      { title: "Growth Strategy", description: "Market analysis and a clear roadmap to your next revenue milestone." },
      { title: "Operational Excellence", description: "Process audits that cut waste and increase team output." },
      { title: "Digital Transformation", description: "Technology adoption and automation that scales your business." },
      { title: "Leadership Coaching", description: "Develop the leadership capabilities your next growth phase demands." },
      { title: "Financial Modelling", description: "Scenario planning and forecasting to make confident decisions." },
      { title: "Brand Positioning", description: "Sharpen your market position and differentiate from competitors." },
    ],
    problemHeadline: "Growth stalled despite your best efforts?",
    solutionHeadline: "Strategic guidance that drives results",
    howItWorks: {
      headline: "Our engagement model",
      steps: [
        { title: "Discovery", description: "Deep dive into your business, market, and goals." },
        { title: "Strategy", description: "Actionable roadmap with clear milestones." },
        { title: "Execution support", description: "Hands-on guidance until results are achieved." },
      ],
    },
    faq: [
      { question: "What industries do you serve?", answer: "We work across B2B, professional services, tech, and retail sectors." },
      { question: "How long is a typical engagement?", answer: "Projects range from 4-week sprints to 6-month transformations." },
      { question: "What results can I expect?", answer: "Clients typically see measurable improvements in revenue, efficiency, or market position within 90 days." },
    ],
    blogPosts: [
      { title: "Strategy frameworks that work", excerpt: "Proven models for business growth.", slug: "frameworks" },
      { title: "Operational excellence", excerpt: "Cut waste and boost margins.", slug: "operations" },
      { title: "Leading through change", excerpt: "Guide your team through transformation.", slug: "change" },
    ],
    finalCtaHeadline: "Book a strategy session",
    secondaryCtaLabel: "Our services",
    trustSuffix: "Trusted advisors to ambitious businesses",
  },
  general: {
    colors: { primary: "#334155", secondary: "#1e293b", accent: "#64748b" },
    fontFamily: "Inter, system-ui, sans-serif",
    borderRadius: "0.5rem",
    nav: [
      { label: "Services", href: "#features" },
      { label: "About", href: "#solution" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#contact" },
    ],
    painPoints: [
      "Struggling to stand out in a crowded market",
      "Wasting budget on ineffective marketing",
      "Losing leads to better-presented competitors",
      "No clear value proposition for customers",
    ],
    conversionHooks: ["Free consultation", "Proven track record", "Personalized service"],
    stats: [
      { value: "500+", label: "Clients served" },
      { value: "98%", label: "Client satisfaction" },
      { value: "10+", label: "Years experience" },
    ],
    featuresHeadline: "What we offer",
    defaultFeatures: [
      { title: "Consultation", description: "A free session to understand your needs and recommend the right solution." },
      { title: "Core Services", description: "Tailored delivery designed around your specific situation." },
      { title: "Ongoing Support", description: "Responsive, dedicated support throughout our partnership." },
      { title: "Custom Solutions", description: "No one-size-fits-all — every engagement is built for you." },
      { title: "Reporting & Insights", description: "Clear updates and progress reports so you're always informed." },
      { title: "Growth Partnership", description: "We measure our success by yours — long-term results matter to us." },
    ],
    problemHeadline: "Challenges holding you back?",
    solutionHeadline: "The partner your business needs",
    howItWorks: {
      headline: "How we help",
      steps: [
        { title: "Understand your needs", description: "We listen to your goals and challenges." },
        { title: "Deliver solutions", description: "Tailored services designed for your situation." },
        { title: "Support your success", description: "Ongoing partnership as you grow." },
      ],
    },
    faq: [
      { question: "What makes you different?", answer: "We combine deep expertise with a personal, responsive approach to every client." },
      { question: "How do I get started?", answer: "Contact us for a free consultation. We'll outline how we can help." },
      { question: "Do you serve my area?", answer: "We work with clients locally and remotely. Reach out to confirm availability." },
    ],
    blogPosts: [
      { title: "Growing your business online", excerpt: "Practical tips for digital presence.", slug: "growth" },
      { title: "Building customer trust", excerpt: "Why credibility drives conversions.", slug: "trust" },
      { title: "Industry insights", excerpt: "Trends and opportunities in your market.", slug: "insights" },
    ],
    finalCtaHeadline: "Get started today",
    secondaryCtaLabel: "Learn more",
    trustSuffix: "Dedicated to your success",
  },
};

export function detectIndustry(industry: string, businessName = ""): IndustryKey {
  const text = `${industry} ${businessName}`.toLowerCase();

  if (/account|chartered|audit|tax|bookkeep|\bca\b|cpa|finance|gst/.test(text)) return "accounting";
  if (/legal|law|attorney|advocate|solicitor|litigation/.test(text)) return "legal";
  if (/health|medical|clinic|dental|hospital|pharma|doctor/.test(text)) return "healthcare";
  if (/saas|software|tech|app|platform|startup|cloud/.test(text)) return "saas";
  if (/fitness|gym|yoga|wellness|trainer|sport/.test(text)) return "fitness";
  if (/e-?commerce|shop|store|retail|product|fashion/.test(text)) return "ecommerce";
  if (/consult|coach|advisory|agency|marketing/.test(text)) return "consulting";

  return "general";
}

export function extractLocationHint(address: string): string | null {
  if (!address.trim()) return null;
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) return parts[parts.length - 2] ?? parts[0];
  return parts[0] ?? null;
}

export function getIndustryPack(industry: string, businessName = ""): IndustryPack {
  return PACKS[detectIndustry(industry, businessName)];
}

export function buildTrustText(intake: IntakeFormData, pack: IndustryPack): string {
  const location = extractLocationHint(intake.businessAddress);
  if (location) {
    return `${pack.conversionHooks[0]} · Serving clients in ${location}`;
  }
  return pack.conversionHooks.join(" · ");
}

export function buildTestimonials(intake: IntakeFormData): { name: string; role: string; quote: string }[] {
  if (!intake.usePlaceholderTestimonials || intake.testimonials.length > 0) {
    return intake.testimonials;
  }

  const industry = detectIndustry(intake.industry, intake.businessName);
  const location = extractLocationHint(intake.businessAddress) ?? "the region";

  if (industry === "accounting") {
    return [
      {
        name: "Rajesh Kumar",
        role: `Director, Tech Solutions Pvt Ltd · ${location}`,
        quote: `${intake.businessName} streamlined our GST compliance and tax planning. Their proactive advice saved us significant time and cost.`,
      },
      {
        name: "Priya Sharma",
        role: "Founder, Sharma Retail",
        quote: "Professional, responsive, and always ahead of deadlines. We trust them completely with our financial affairs.",
      },
      {
        name: "Anil Mehta",
        role: "CFO, Mehta Industries",
        quote: `From audit support to strategic advisory, ${intake.businessName} has been an invaluable partner for over five years.`,
      },
    ];
  }

  // Generic industry-specific testimonials
  const industryTestimonials: Record<IndustryKey, ReturnType<typeof buildTestimonials>> = {
    legal: [
      { name: "James Thornton", role: `Director, Thornton Group · ${location}`, quote: `${intake.businessName} handled our contract dispute with precision and speed. Exceptional counsel.` },
      { name: "Priya Nair", role: "Founder, Nair Ventures", quote: "Clear advice, transparent fees, and a team that genuinely cared about our outcome. Highly recommended." },
      { name: "David Walsh", role: "Managing Partner", quote: `From incorporation to litigation support, ${intake.businessName} has been our trusted legal partner for three years.` },
    ],
    healthcare: [
      { name: "Maria Santos", role: `Patient · ${location}`, quote: `${intake.businessName} provided compassionate, thorough care. I finally have answers and a plan that works.` },
      { name: "Tom Blackwell", role: "Regular patient", quote: "Booking was easy, wait times were minimal, and the care was outstanding. I wouldn't go anywhere else." },
      { name: "Angela Reyes", role: "Parent", quote: `The team at ${intake.businessName} goes above and beyond. We feel genuinely cared for at every visit.` },
    ],
    saas: [
      { name: "Chris Mendez", role: `Head of Ops · ${location}`, quote: `${intake.businessName} cut our manual workload by 60% in the first month. Absolute game changer.` },
      { name: "Natalie Kim", role: "Product Lead", quote: "Setup took 20 minutes and the ROI was visible within the first week. Our team loves it." },
      { name: "Sam Patel", role: "CEO, Scalr.io", quote: `We evaluated five platforms. ${intake.businessName} was the clear winner on both features and support.` },
    ],
    fitness: [
      { name: "Jake Turner", role: `Member · ${location}`, quote: `${intake.businessName} completely transformed my approach to training. Down 18kg in 4 months and feeling incredible.` },
      { name: "Chloe Adams", role: "Member since 2023", quote: "The personalised program made all the difference. I've tried other gyms — nothing compares." },
      { name: "Marcus Reid", role: "Personal training client", quote: `My trainer at ${intake.businessName} pushed me beyond what I thought possible. Best investment I've made.` },
    ],
    ecommerce: [
      { name: "Lucy Bennett", role: `Customer · ${location}`, quote: `${intake.businessName} delivers exactly as promised — quality products, fast shipping, and brilliant support.` },
      { name: "Ryan Moore", role: "Repeat customer", quote: "I've ordered six times now. Every time: perfect products, fast delivery, hassle-free experience." },
      { name: "Sophia Lee", role: "Verified buyer", quote: `${intake.businessName} is my go-to. The quality is consistently excellent and returns are genuinely easy.` },
    ],
    consulting: [
      { name: "Oliver Grant", role: `CEO, Grant & Associates · ${location}`, quote: `${intake.businessName} identified opportunities we'd completely missed and helped us execute. Revenue up 40% in 6 months.` },
      { name: "Diana Fowler", role: "COO, Fowler Retail", quote: "Strategic, data-driven, and highly practical. The engagement delivered measurable results from week one." },
      { name: "Nathan Brooks", role: "Founder", quote: `If you're serious about growth, ${intake.businessName} is the partner you need. No fluff, just results.` },
    ],
    accounting: [
      { name: "Rajesh Kumar", role: `Director, Tech Solutions · ${location}`, quote: `${intake.businessName} streamlined our compliance and tax planning. Their proactive advice saved us time and cost.` },
      { name: "Priya Sharma", role: "Founder, Sharma Retail", quote: "Professional, responsive, and always ahead of deadlines. We trust them completely with our financial affairs." },
      { name: "Anil Mehta", role: "CFO, Mehta Industries", quote: `From audit support to strategic advisory, ${intake.businessName} has been invaluable for over five years.` },
    ],
    general: [
      { name: "Sarah Mitchell", role: `Business Owner · ${location}`, quote: `${intake.businessName} exceeded every expectation. Professional, reliable, and results-driven.` },
      { name: "David Chen", role: "Operations Director", quote: `Working with ${intake.businessName} was seamless from start to finish. Delivered exactly what they promised.` },
      { name: "Emily Rodriguez", role: "Managing Partner", quote: `Trusted expertise and genuine commitment to outcomes. We wouldn't hesitate to recommend ${intake.businessName}.` },
    ],
  };

  return industryTestimonials[industry];
}

export function buildFallbackProfile(intake: IntakeFormData): BusinessProfile {
  const pack = getIndustryPack(intake.industry, intake.businessName);

  return {
    businessName: intake.businessName,
    tagline: intake.tagline,
    valueProposition: intake.valueProposition,
    industry: intake.industry,
    icp: intake.targetAudience,
    painPoints: pack.painPoints,
    valueProps: pack.conversionHooks,
    tone: intake.brandTone,
    primaryGoal: "leads",
    funnelStrategy: "Trust-first funnel with consultation CTA and industry-specific social proof",
    complianceFlags: /health|finance|legal|account|tax|medical/i.test(intake.industry) ? ["regulated-industry"] : [],
    recommendedSections: ["hero", "problem", "solution", "features", "testimonials", "faq", "finalCta"],
    conversionHooks: pack.conversionHooks,
  };
}
