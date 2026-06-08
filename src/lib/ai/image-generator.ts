import { v4 as uuidv4 } from "uuid";

const RUNWARE_API = "https://api.runware.ai/v1";
// runware:100@1 = FLUX Schnell — fastest, cheapest, excellent quality
const MODEL = "runware:100@1";

/** Build an industry-appropriate image prompt from business context */
export function buildImagePrompt(params: {
  industry: string;
  businessName: string;
  brandTone: string;
  tagline: string;
}): string {
  const { industry, brandTone, tagline } = params;
  const lower = industry.toLowerCase();

  // Map tone to photography style
  const toneStyle: Record<string, string> = {
    professional: "clean professional corporate photography, sharp focus, elegant lighting",
    luxury:       "luxury editorial photography, moody dramatic lighting, premium aesthetic",
    friendly:     "warm inviting photography, natural daylight, approachable atmosphere",
    playful:      "vibrant colourful photography, energetic, dynamic composition",
    technical:    "clean minimal tech aesthetic, precise lighting, modern studio",
  };
  const style = toneStyle[brandTone] ?? toneStyle.professional;

  // Industry-specific scene descriptions
  let scene = "";
  if (/law|legal|attorney|advocate|solicitor/.test(lower)) {
    scene = "modern law office interior, elegant bookshelves, professional meeting room, justice scales";
  } else if (/account|audit|tax|finance|chartered/.test(lower)) {
    scene = "modern financial office, professionals working at desks, city skyline through glass windows";
  } else if (/health|medical|clinic|dental|doctor|hospital/.test(lower)) {
    scene = "bright modern medical clinic interior, caring healthcare professionals, clean white space";
  } else if (/fitness|gym|yoga|trainer|sport|wellness/.test(lower)) {
    scene = "modern fitness studio, professional gym equipment, motivational training environment";
  } else if (/saas|software|tech|app|platform|cloud/.test(lower)) {
    scene = "modern tech office, developers collaborating, multiple screens showing data dashboards";
  } else if (/restaurant|food|cafe|bakery|catering/.test(lower)) {
    scene = "upscale restaurant interior, beautifully plated cuisine, warm ambient lighting";
  } else if (/retail|shop|store|ecommerce|fashion/.test(lower)) {
    scene = "clean modern retail space, curated product displays, premium shopping environment";
  } else if (/consult|coach|advisory|agency|marketing/.test(lower)) {
    scene = "modern consulting office, team in strategy meeting, whiteboard with growth charts";
  } else if (/real estate|property|realty/.test(lower)) {
    scene = "luxury property interior, stunning architecture, beautiful modern home";
  } else if (/education|school|tutor|training|course/.test(lower)) {
    scene = "modern learning environment, engaged students, bright collaborative classroom";
  } else if (/beauty|salon|spa|skincare|wellness/.test(lower)) {
    scene = "luxurious spa interior, serene treatment room, premium beauty products";
  } else {
    scene = `professional business environment for ${industry}, modern office, confident team`;
  }

  // Build final prompt
  const parts = [
    scene,
    style,
    "hero banner composition, wide angle",
    "no text, no watermarks, no logos",
    "high resolution, photorealistic, 8k quality",
    tagline ? `mood: ${tagline}` : "",
  ].filter(Boolean);

  return parts.join(", ");
}

export interface RunwareResult {
  imageURL: string;
  imageUUID: string;
}

export async function generateHeroImage(params: {
  industry: string;
  businessName: string;
  brandTone: string;
  tagline: string;
}): Promise<RunwareResult | null> {
  const apiKey = process.env.RUNWARE_API_KEY;
  if (!apiKey) {
    console.warn("[runware] RUNWARE_API_KEY not set — skipping image generation");
    return null;
  }

  const prompt = buildImagePrompt(params);

  try {
    const res = await fetch(RUNWARE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify([
        {
          taskType:       "imageInference",
          taskUUID:       uuidv4(),
          positivePrompt: prompt,
          negativePrompt: "text, watermark, logo, blurry, low quality, distorted, ugly, nsfw",
          model:          MODEL,
          width:          1280,
          height:         704,  // must be multiple of 64
          numberResults:  1,
          outputFormat:   "WEBP",
          steps:          4,    // FLUX Schnell is optimized for 4 steps — fast & cheap
          CFGScale:       1,    // FLUX Schnell works best with CFG=1
        },
      ]),
    });

    if (!res.ok) {
      console.warn("[runware] HTTP error:", res.status, await res.text());
      return null;
    }

    const json = await res.json() as {
      data?: RunwareResult[];
      errors?: { code: string; message: string }[];
    };

    if (json.errors?.length) {
      console.warn("[runware] API errors:", json.errors.map((e) => e.message).join("; "));
      return null;
    }

    const result = json.data?.[0];
    if (!result?.imageURL) {
      console.warn("[runware] No imageURL in response");
      return null;
    }

    console.log("[runware] Generated hero image:", result.imageURL);
    return result;
  } catch (err) {
    console.warn("[runware] Request failed:", err instanceof Error ? err.message : err);
    return null;
  }
}
