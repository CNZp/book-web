import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		Components({
			resolvers: [VantResolver()],
		}),
	],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000/api', // 代理的目标地址
				changeOrigin: true, // 改变请求头中的 Origin 值
				rewrite: (path) => path.replace(/^\/api/, ''), // 重写请求路径，去掉前缀
			},
		},
	},
});
