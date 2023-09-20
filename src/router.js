import {
	createRouter,
	createWebHashHistory,
} from 'vue-router';

const routes = [
	{
		path: '/login',
		component: () =>
			import('./pages/LoginPage.vue'),
		meta: {
			title: '欢迎',
		},
	},
	{
		name: 'Home',
		path: '/',
		component: () =>
			import('./pages/HomePage.vue'),
		meta: {
			title: '首页',
			keepalive: true,
		},
		children: [
			{
				name: 'WordIndex',
				path: '/word',
				component: () =>
					import('./pages/WordIndex.vue'),
				meta: {
					title: '单词本',
					keepAlive: true,
				},
			},
			{
				name: 'NoteIndex',
				path: '/note',
				component: () =>
					import('./pages/NoteIndex.vue'),
				meta: {
					title: '笔记本',
					keepAlive: true,
				},
			},
			{
				name: 'ScheduleIndex',
				path: '/schedule',
				component: () =>
					import('./pages/ScheduleIndex.vue'),
				meta: {
					title: '日程本',
					keepAlive: true,
				},
			},
			{
				name: 'UserIndex',
				path: '/user',
				component: () =>
					import('./pages/UserIndex.vue'),
				meta: {
					title: '我的',
					keepAlive: true,
				},
			},
		],
		redirect: {
			name: 'WordIndex',
		},
	},
	{
		name: 'NotFound',
		path: '/:path(.*)+',
		redirect: {
			name: 'Home',
		},
	},
];

const router = createRouter({
	routes,
	history: createWebHashHistory(),
});

let noTokenPages = ['/login'];

router.beforeEach((to, from, next) => {
	const title = to.meta && to.meta.title;
	if (title) {
		document.title = title;
	}

	if (
		window.localStorage.token &&
		window.localStorage.token != ''
	) {
		if (to.path.indexOf('/login') != -1) {
			next({
				path: '/',
			});
			return;
		}
	}

	if (noTokenPages.indexOf(to.path) == -1) {
		if (!window.localStorage.token) {
			// 未登录
			next({
				path: '/login',
			});
			return;
		}
	}

	next();
});

export { router };
