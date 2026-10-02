import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

export default defineConfig({
   test: { 
      environment: 'node',
      include: ['tests/**/*.test.ts'],
      env: loadEnv('test', process.cwd(), ''),
      fileParallelism: false,
      passWithNoTests: true,
   },
});