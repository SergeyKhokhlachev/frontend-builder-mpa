import { resolve } from 'path';
import { defineConfig } from 'vite';

import { breakpoint } from './src/common/breakpoint';
import { mixins } from './src/common/mixins';

// lint plugins
import eslintPlugin from 'vite-plugin-eslint';
import stylelintPlugin from 'vite-plugin-stylelint';

// vue.js plugins
import vuePlugin from '@vitejs/plugin-vue';

// markup plugins
import vituum from 'vituum';
import pug from '@vituum/vite-plugin-pug';
// import pugPlugin from 'vite-plugin-pug';

// style plugins
import postcssMixins from 'postcss-mixins';
import postcssSortMQ from 'postcss-sort-media-queries';
import postcssPresetEnv from 'postcss-preset-env';
import postcssSimpleVars from 'postcss-simple-vars';
import cssnano from 'cssnano';

// icons and image plugins
import spritemapPlugin from '@spiriit/vite-plugin-svg-spritemap';
import imageOptimizerPlugin from './plugins/vite-image-optimizer';

export default defineConfig({
	appType: 'mpa',
	server: {
		type: 'mpa',
		port: 3000,
		open: '/',
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
		},
	},
	plugins: [
		vituum({
			pages: {
				root: resolve(__dirname, 'src'),
				dir: resolve(__dirname, 'src/templates'),
			},
		}),
		pug({
			root: resolve(__dirname, 'src'),
			globals: {
				process: process.env.NODE_ENV,
				breakpoint: breakpoint,
			},
			options: {
				pretty: true,
			},
		}),
		vuePlugin(),
		spritemapPlugin('src/assets/icons/*.svg', {
			prefix: 'icon-',
		}),
		imageOptimizerPlugin(),
		eslintPlugin({
			fix: false,
			include: ['src/**/*.{js,ts,vue}'],
			exclude: ['node_modules', 'dist', 'docs'],
		}),
		stylelintPlugin({
			fix: false,
			include: ['src/**/*.{css,vue}'],
			exclude: ['node_modules', 'dist', 'docs'],
		}),
	],
	css: {
		postcss: {
			plugins: [
				postcssPresetEnv({
					stage: 3,
					features: {
						'nesting-rules': true,
						'custom-media-queries': true,
					},
					insertBefore: {
						'all-property': postcssSimpleVars({
							variables: Object.fromEntries(Object.entries(breakpoint).map(([key, value]) => [`$${key}`, value])),
						}),
					},
				}),
				postcssMixins({ mixins }),
				postcssSortMQ({ sort: 'mobile-first' }),
				cssnano({ preset: 'default' }),
			],
		},
	},
	build: {
		target: 'es2023',
		outDir: resolve(__dirname, 'dist'),
		emptyOutDir: true,
		sourcemap: true,
		manifest: true,
		modulePreload: false,
		rollupOptions: {
			input: ['./src/templates/**/*.pug'],
			output: {
				entryFileNames: 'script/[name]-[hash:8].js',
				chunkFileNames: 'script/[name]-[hash:8].js',
				manualChunks(id) {
					if (id.includes('node_modules')) {
						return 'vendor';
					}
				},
				assetFileNames: (assetInfo) => {
					if (!assetInfo.name) return '[name].[ext]';

					const extType = assetInfo.name.split('.').pop();

					if (/jpe?g|png|gif|tiff|webp|svg|avif/i.test(extType) && !assetInfo.name.includes('spritemap')) {
						return 'images/[name].[ext]';
					}

					if (/css|scss|styl|less/i.test(extType)) {
						return 'style/[name]-[hash:8].[ext]';
					}

					return 'assets/[name]-[hash:8].[ext]';
				},
			},
		},
	},
});
