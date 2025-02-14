import { z } from 'zod';

export const RuleSchema = z.object({
  type: z.literal('rule'),
  rule: z.string(),
  attributes: z.record(z.string(), z.unknown()),
});

export const ExtensionTagSchema = z.object({
  type: z.literal('extensionTag'),
  // The "logical" name of the extension (e.g. `oci` or `maven`).
  extension: z.string(),
  // The "raw" name of the extension as it appears in the MODULE file (e.g. `maven_01` or `maven`)
  rawExtension: z.string(),
  tag: z.string(),
  attributes: z.record(z.string(), z.unknown()),
});

export const ResultSchema = z.discriminatedUnion('type', [
  RuleSchema,
  ExtensionTagSchema,
]);

export type Result = z.infer<typeof ResultSchema>;
