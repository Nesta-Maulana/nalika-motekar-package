import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'components/index': 'src/components/index.ts',
    'stores/index': 'src/stores/index.ts',
    'hooks/index': 'src/hooks/index.ts',
    'providers/index': 'src/providers/index.tsx',
    'lib/index': 'src/lib/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'next'],
  treeshake: true,
});
