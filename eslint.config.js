module.exports = [
	{
		files: [`**/*.js`],
		ignores: [`node_modules/**`, `pkg/**`],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: `module`,
		},
		plugins: {
			// Add plugins here if needed
		},
		rules: {
			// Example rules
			'no-unused-vars': `warn`,
			'no-console': `off`,
			semi: [`error`, `always`, { 'omitLastInOneLineBlock': true }],
			quotes: [`error`, `single`, { 'allowTemplateLiterals': true }],
			indent: [`error`, `tab`],
		},
	},
];
