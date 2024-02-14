import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});

 export const config = {
  build:{
    sourcemap: true // Config vite to generate sourcemap when bundling.
  },
}
