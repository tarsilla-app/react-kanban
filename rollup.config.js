/* eslint-disable @typescript-eslint/no-unsafe-call */

import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import tsconfigPaths from 'rollup-plugin-tsconfig-paths';

export default [
  {
    input: `src/index.ts`,
    output: [
      {
        file: `lib/index.cjs`,
        format: 'cjs',
        sourcemap: true,
        exports: 'auto',
      },
      {
        file: `lib/index.mjs`,
        format: 'esm',
        sourcemap: true,
        exports: 'auto',
      },
    ],
    plugins: [
      tsconfigPaths(),
      peerDepsExternal({ includeDependencies: true }),
      typescript({
        tsconfig: './tsconfig.json',
      }),
      postcss({
        modules: true,
      }),
      terser(),
    ],
  },
  {
    input: `./src/index.ts`,
    output: [{ file: `./lib/index.d.ts`, format: 'esm' }],
    plugins: [tsconfigPaths(), dts()],
  },
];
