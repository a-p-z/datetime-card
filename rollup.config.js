import svelte from 'rollup-plugin-svelte';
import { sveltePreprocess } from 'svelte-preprocess';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'DatetimeCard',
		file: 'dist/datetime-card.js'
	},
	plugins: [
		svelte({
			preprocess: sveltePreprocess({ sourceMap: true }),
			compilerOptions: { customElement: true, dev: true }
		}),
		resolve(),
		typescript({ sourceMap: true })
	]
};
