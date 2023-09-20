module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:vue/vue3-essential',
		//1.继承.prettierrc.cjs文件规则  2.开启rules的 "prettier/prettier": "error"  3.eslint fix的同时执行prettier格式化
		'plugin:prettier/recommended',
	],
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
			},
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['vue'],
	rules: {
		'no-unused-vars': 'off', //不提示为使用变量
		'vue/html-closing-bracket-newline': 'off', // 不强制换行
		'vue/no-setup-props-destructure': 'off', // setup可解构propsc (可能会丢失reactivity)
		'vue/multi-word-component-names': 'off', //组件可以single word
		'vue/no-mutating-props': 'off', //允许v-model绑定props属性
	},
};
