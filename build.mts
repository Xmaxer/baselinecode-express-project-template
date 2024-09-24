import * as esbuild from 'esbuild';

const codeToInsert = `
import { createRequire } from 'module'; const require = createRequire(import.meta.url);
global.__dirname = require('path').dirname(require('url').fileURLToPath(import.meta.url));
`;

await esbuild.build({
  entryPoints: ['src/main.mts'],
  bundle: true,
  outfile: 'dist/main.mjs',
  format: 'esm',
  platform: 'node',
  target: 'esnext',
  external: ['path', 'sharp'],
  banner: {
    // This is absolutely vital: https://github.com/evanw/esbuild/pull/2067#issuecomment-1324171716
    js: codeToInsert,
  },
});
