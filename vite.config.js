import glob from 'glob';
import { resolve } from 'path';
import { defineConfig } from 'vite';

import inspect from 'vite-plugin-inspect';

// lint plugins
import eslint from 'vite-plugin-eslint';
import stylelint from 'vite-plugin-stylelint';

// markup plugins
import vitePugTransform from 'vite-plugin-pug-transformer';

// style plugins
import postcssPresetEnv from 'postcss-preset-env';
import postcssMixins from 'postcss-mixins';
import postcssSimpleVars from 'postcss-simple-vars';
import postcssSortMQ from 'postcss-sort-media-queries';
import postcssDiscardDuplicates from 'postcss-discard-duplicates';

// icons and image plugins
import { imagetools } from 'vite-imagetools';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap';

// vue.js plugins
import vue from '@vitejs/plugin-vue';

// config
import { vars } from './source/app/config/variables';
import { mixins } from './source/app/config/mixins';

export default defineConfig({
	base: './',
	appType: 'mpa',
	publicDir: resolve(__dirname, './public'),
	server: {
		port: 3000,
		open: './pages/index.html',
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, 'source'),
		},
	},
	plugins: [
		vitePugTransform({
			pugOptions: {
				pretty: true,
				venbose: true,
			},
			pugLocals: {
				process: process.env.NODE_ENV,
				breakpoint: vars.breakpoint,
			},
		}),
		VitePluginSvgSpritemap('./assets/icons/*.svg', {
			prefix: 'icon-',
			output: {
				filename: '../sprite/spritemap.svg',
			},
		}),
		ViteImageOptimizer({
			test: /\.(jpe?g|png|gif|tiff|webp|avif)$/i,
			includePublic: false,
			png: {
				quality: 80,
			},
			jpeg: {
				quality: 80,
			},
			jpg: {
				quality: 80,
			},
			webp: {
				quality: 80,
			},
		}),
		imagetools(),
		vue(),
		eslint(),
		stylelint(),
		inspect(),
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
							variables: {
								$mobile: vars.breakpoint.mobile,
								$tablet: vars.breakpoint.tablet,
								$laptop: vars.breakpoint.laptop,
								$desktop: vars.breakpoint.desktop,
								$largest: vars.breakpoint.largest,
							},
						}),
					},
				}),
				postcssMixins({
					mixins,
				}),
				postcssSortMQ,
				postcssDiscardDuplicates,
			],
		},
	},
	build: {
		outDir: './build',
		assetsDir: './assets',
		emptyOutDir: true,
		assetsInlineLimit: 0,
		sourcemap: true,
		modulePreload: false,
		// manifest: true,
		rollupOptions: {
			input: glob.sync(resolve(__dirname, 'pages', '**/*.html')),
			output: {
				entryFileNames: 'script/entry-[name].js',
				chunkFileNames: 'script/chunk/chunk-[name].js',
				manualChunks: (id) => {
					if (id.includes('node_modules')) {
						return 'vendor';
					}
				},
				assetFileNames: (assetInfo) => {
					let extType = assetInfo.name.split('.').at(1);
					if (/jpe?g|png|gif|tiff|webp|svg|avif/i.test(extType)) extType = 'images';
					if (/css|scss|styl|less/i.test(extType)) extType = 'style';
					return `${extType}/[name].[ext]`;
				},
			},
		},
	},
});
