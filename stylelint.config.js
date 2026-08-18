import stylelintOrder from 'stylelint-order';
import stylelintPrettier from 'stylelint-prettier';
import stylelintConfigStandard from 'stylelint-config-standard';
import stylelintConfigRecessOrder from 'stylelint-config-recess-order';

export default {
	ignoreFiles: ['node_modules/**/*', 'dist/**/*', 'docs/**/*'],
	extends: [stylelintConfigStandard, stylelintConfigRecessOrder],
	plugins: [stylelintOrder, stylelintPrettier],
	rules: {
		'prettier/prettier': true,
		'at-rule-no-unknown': null,
		'function-no-unknown': null,
		'selector-class-pattern': null,
		'no-descending-specificity': null,
		'import-notation': 'string',

		'order/order': [
			[
				'dollar-variables',
				'declarations',
				{ type: 'at-rule', name: 'supports' },
				{ type: 'at-rule', name: 'media' },
				'custom-properties',
				'rules',
				'at-rules',
			],
			{ severity: 'warning' },
		],
	},
};
