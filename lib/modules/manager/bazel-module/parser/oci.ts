import { z } from 'zod';
import { DockerDatasource } from '../../../datasource/docker';
import type { PackageDependency } from '../../types';
import { ExtensionTagFragmentSchema } from './fragments';

export const ociExtensionPrefix = 'oci';

const pullTag = 'pull';

export const ociExtensionTags = ['pull'];

export const RuleToDockerPackageDep = ExtensionTagFragmentSchema.extend({
  extension: z.literal(ociExtensionPrefix),
  tag: z.literal(pullTag),
  attributes: z.object({
    name: z.string(),
    image: z.string(),
    tag: z.string().optional(),
    digest: z.string().optional(),
  }),
}).transform(
  ({ children: { name, image, tag, digest } }): PackageDependency => ({
    datasource: DockerDatasource.id,
    depType: 'oci_pull',
    depName: name.value,
    packageName: image.value,
    currentValue: tag?.value,
    currentDigest: digest?.value,
  }),
);
