import fs from 'fs';
import postcss from 'postcss';

export const mixins = {
	hover: function () {
		return {
			'@media (hover: hover)': {
				'&:hover': {
					'@mixin-content': {},
				},
			},
		};
	},
	active: function () {
		return {
			'@media (hover: none)': {
				'&:active': {
					'@mixin-content': {},
				},
			},
			'@media (hover: hover)': {
				'&:active': {
					'@mixin-content': {},
				},
			},
		};
	},
	media: function (mixin, a, t, b) {
		switch (t) {
			case 'range':
				return {
					[`@media (${a}px <= width < ${b}px)`]: {
						'@mixin-content': {},
					},
				};

			case 'max':
				return {
					[`@media (width < ${a}px)`]: {
						'@mixin-content': {},
					},
				};

			default:
				return {
					[`@media (width >= ${a}px)`]: {
						'@mixin-content': {},
					},
				};
		}
	},
	retina: function () {
		return {
			'@media (min-resolution: 192dpi)': {
				'@mixin-content': {},
			},
		};
	},
	icons: function (mixin) {
		const rules = [];
		const path = process.env.NODE_ENV === 'development' ? '/__spritemap.svg' : '../sprite/spritemap.svg';
		fs.readdirSync('./src/assets/icons').forEach(function (file) {
			const icon = file.replace(/\.svg$/, '');
			const rule = postcss.rule({ selector: `.icon.icon-${icon}::before` });
			rule.append({
				prop: 'mask-image',
				value: `url('${path}#icon-${icon}-view')`,
			});
			rules.push(rule);
		});
		mixin.replaceWith(rules);
	},
};
