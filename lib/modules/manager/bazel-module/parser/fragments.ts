import { z } from 'zod';
import { LooseArray, LooseRecord } from '../../../../util/schema-utils';
import * as starlark from './starlark';

export const PrimitiveSchema = z.union(z.string(), z.boolean());

export const PrimitiveFragmentSchema = z.object({
  type: z.literal('primitive'),
  value: PrimitiveSchema,
  isComplete: z.literal(true),
});

export const ArrayFragmentSchema = z.object({
  type: z.literal('array'),
  value: z.array(PrimitiveFragmentSchema),
  isComplete: z.boolean(),
});

export const ValueFragmentsSchema = z.discriminatedUnion('type', [
  PrimitiveFragmentSchema,
  ArrayFragmentSchema,
]);

export const RuleFragmentSchema = z.object({
  type: z.literal('rule'),
  rule: z.string(),
  children: LooseRecord(ValueFragmentsSchema),
  isComplete: z.boolean(),
});
export const PreparedExtensionTagFragmentSchema = z.object({
  type: z.literal('preparedExtensionTag'),
  // See ExtensionTagFragmentSchema for documentation of the fields.
  extension: z.string(),
  rawExtension: z.string(),
  isComplete: z.literal(false), // never complete, parser internal type.
});
export const ExtensionTagFragmentSchema = z.object({
  type: z.literal('extensionTag'),
  // The "logical" name of the extension (e.g. `oci` or `maven`).
  extension: z.string(),
  // The "raw" name of the extension as it appears in the MODULE file (e.g. `maven_01` or `maven`)
  rawExtension: z.string(),
  tag: z.string(),
  children: LooseRecord(ValueFragmentsSchema),
  isComplete: z.boolean(),
});
export const AttributeFragmentSchema = z.object({
  type: z.literal('attribute'),
  name: z.string(),
  value: ValueFragmentsSchema.optional(),
  isComplete: z.boolean(),
});
export const AllFragmentsSchema = z.discriminatedUnion('type', [
  ArrayFragmentSchema,
  AttributeFragmentSchema,
  RuleFragmentSchema,
  PrimitiveFragmentSchema,
  PreparedExtensionTagFragmentSchema,
  ExtensionTagFragmentSchema,
]);

export type AllFragments = z.infer<typeof AllFragmentsSchema>;
export type ArrayFragment = z.infer<typeof ArrayFragmentSchema>;
export type AttributeFragment = z.infer<typeof AttributeFragmentSchema>;
export type BooleanFragment = z.infer<typeof BooleanFragmentSchema>;
export type ChildFragments = Record<string, ValueFragments>;
export type Primitive = z.infer<typeof PrimitiveSchema>;
export type PrimitiveFragments = z.infer<typeof PrimitiveFragmentsSchema>;
export type RuleFragment = z.infer<typeof RuleFragmentSchema>;
export type PreparedExtensionTagFragment = z.infer<
  typeof PreparedExtensionTagFragmentSchema
>;
export type ExtensionTagFragment = z.infer<typeof ExtensionTagFragmentSchema>;
export type StringFragment = z.infer<typeof StringFragmentSchema>;
export type ValueFragments = z.infer<typeof ValueFragmentsSchema>;

export function primitive(value: Primitive): PrimitiveFragment {
  return {
    type: 'primitive',
    isComplete: true,
    value,
  };
}

export function rule(
  rule: string,
  children: ChildFragments = {},
  isComplete = false,
): RuleFragment {
  return {
    type: 'rule',
    rule,
    isComplete,
    children,
  };
}

export function preparedExtensionTag(
  extension: string,
  rawExtension: string,
): PreparedExtensionTagFragment {
  return {
    type: 'preparedExtensionTag',
    extension,
    rawExtension,
    isComplete: false, // never complete
  };
}

export function extensionTag(
  extension: string,
  rawExtension: string,
  tag: string,
  children: ChildFragments = {},
  isComplete = false,
): ExtensionTagFragment {
  return {
    type: 'extensionTag',
    extension,
    rawExtension,
    tag,
    isComplete,
    children,
  };
}

export function attribute(
  name: string,
  value?: ValueFragments,
  isComplete = false,
): AttributeFragment {
  return {
    type: 'attribute',
    name,
    value,
    isComplete,
  };
}

export function array(
  value: PrimitiveFragments[] = [],
  isComplete = false,
): ArrayFragment {
  return {
    type: 'array',
    value,
    isComplete,
  };
}
