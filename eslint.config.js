import js from "@eslint/js";

export default [
	{
		ignores: [
			'**/node_modules/*',
			'**/dist/*',
			'**/tests/*',
			'tsconfig.json',
			'.eslintrc.js',
			'commitlint.config.js',
			'jest.config.js'
		]
	},
	js.configs.recommended,

	{
		rules: {
			"no-unused-vars": "warn",
			"no-undef": "warn"
		}
	}
];