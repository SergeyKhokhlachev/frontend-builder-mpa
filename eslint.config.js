import globals from 'globals';
import js from '@eslint/js';
import vuePlugin from 'eslint-plugin-vue';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';

export default [
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			ecmaVersion: 'latest',
			sourceType: 'module',
		},
	},
	{
		ignores: ['node_modules/', 'dist/', 'docs/'],
	},
	js.configs.recommended,
	...vuePlugin.configs['flat/recommended'],
	{
		files: ['**/*.vue'],
		languageOptions: {
			parser: vuePlugin.parser,
			parserOptions: {
				parser: tsParser,
				extraFileExtensions: ['.vue'],
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
		},
		rules: {
			...tsPlugin.configs.recommended.rules,
			'@typescript-eslint/ban-ts-comment': 'warn',
			'vue/require-default-prop': 'off',
		},
	},
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsParser,
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
		},
		rules: {
			...tsPlugin.configs.recommended.rules,
			'@typescript-eslint/ban-ts-comment': 'warn',
		},
	},
	{
		files: ['**/*.{js,ts,vue}'],
		plugins: { prettier: prettierPlugin },
		rules: {
			'prettier/prettier': ['error'],
		},
	},
	configPrettier,
];
