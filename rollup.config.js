import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
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
		resolve({ dedupe: ['svelte'] }),
		commonjs(),
		typescript({ sourceMap: true, inlineSources: true }),
		terser()
	]
};
