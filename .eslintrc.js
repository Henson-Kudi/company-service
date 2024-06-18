module.exports = {
	parser: '@typescript-eslint/parser',
	ignorePatterns: ['.eslintrc.js'],
	parserOptions: {
		ecmaVersion: 2016,
		sourceType: 'module',
		project: './tsconfig.json'
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'prettier',
		'plugin:prettier/recommended'
	],
	plugins: ['@typescript-eslint', 'prettier'],
	rules: {
		'prettier/prettier': 'error',
		'@typescript-eslint/indent': ['error', 'tab'],
		'comma-dangle': ['error', 'never'] // Disable trailing commas
		// Add your custom rules here
	},
	env: {
		node: true,
		es6: true
	}
};
