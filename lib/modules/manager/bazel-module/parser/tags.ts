import { query as q } from 'good-enough-parser';
import { z } from 'zod';
import { DockerDatasource } from '../../../datasource/docker';
import type { PackageDependency } from '../../types';
import type { Ctx } from '../context';
import { RecordFragmentSchema, StringFragmentSchema } from '../fragments';
import { kvParams } from './common';

export const tags = q
  .sym<Ctx>('oci')
  .op('.')
  .sym('pull', (ctx, token) => ctx.startRule('oci_pull'))
  .join(
    q.tree({
      type: 'wrapped-tree',
      maxDepth: 1,
      search: kvParams,
      postHandler: (ctx) => ctx.endRule(),
    }),
  );
