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

export function applyPatches(config: SiteConfig, patches: ConfigPatch[]): SiteConfig {
  const clone = structuredClone(config) as unknown as Record<string, unknown>;
  for (const patch of patches) {
    if (patch.operation === "set" && patch.path) {
      setByPath(clone, patch.path, patch.value);
    }
  }
  return clone as SiteConfig;
}
