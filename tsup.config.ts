import { defineConfig } from 'tsup';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

function addUseClientDirective(dir: string) {
  const files = readdirSync(dir);
  for (const file of files) {
    if (file.endsWith('.js') || file.endsWith('.mjs')) {
      const filePath = join(dir, file);
      const content = readFileSync(filePath, 'utf-8');
      if (!content.startsWith('"use client"')) {
        writeFileSync(filePath, `"use client";\n${content}`);
      }
    }
  }
}

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
  onSuccess: async () => {
    // Add 'use client' directive to all JS files
    addUseClientDirective('./dist');
    addUseClientDirective('./dist/components');
    addUseClientDirective('./dist/stores');
    addUseClientDirective('./dist/hooks');
    addUseClientDirective('./dist/providers');
    addUseClientDirective('./dist/lib');
    console.log('Added "use client" directive to all JS files');
  },
});
