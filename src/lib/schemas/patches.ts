import { z } from "zod";

export const patchSchema = z.object({
  path: z.string(),
  operation: z.enum(["set", "append", "remove"]),
  value: z.unknown().optional(),
});

export const patchResponseSchema = z.object({
  message: z.string(),
  patches: z.array(patchSchema),
});

export type ConfigPatch = z.infer<typeof patchSchema>;
export type PatchResponse = z.infer<typeof patchResponseSchema>;
