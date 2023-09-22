import axios from 'axios';
import * as querystring from 'querystring';
import { isString } from 'data-type';
import { useGlobalStore } from '../stores/global';
import { showFailToast } from 'vant';

const instance = axios.create({
	timeout: 5000, // 设置超时时间为 5 秒
});

// 添加请求拦截器
instance.interceptors.request.use(
	function (request) {
		// // 在发送请求之前做些什么
		// // 例如，可以在这里添加请求头、修改请求参数等
		const global = useGlobalStore();
		if (global.token) {
			request.headers.Authorization =
				'Bearer ' + global.token;
		}

		return request;
	},
	function (error) {
		console.error('请求发生错误:', error);
		const global = useGlobalStore();
		global.hideLoading();
		showFailToast('请求异常');
		return Promise.reject(error);
	}
);

// 添加响应拦截器
instance.interceptors.response.use(
	function (response) {
		// 如果响应成功，直接返回响应
		return response;
	},
	function (error) {
		// 在这里可以进行异常处理，例如记录错误信息或者修改错误对象
		const global = useGlobalStore();
		global.hideLoading();
		console.error('请求发生错误:', error);
		if (
			error.code === 'ECONNABORTED' ||
			error.message === 'Network Error' ||
			error.message.includes('timeout')
		) {
			showFailToast('请求超时');
		} else if (error.response.status === 401) {
			showFailToast('无权访问');
		} else {
			showFailToast('请求异常');
		}
		// 如果需要终止请求，可以返回 Promise.reject(error)
		// 如果需要继续请求，可以返回 Promise.resolve(response) 或者一个 Promise
		return Promise.reject(error);
	}
);

function object2str(data) {
	return querystring.stringify(data);
}

function fileObjectField(data) {
	return Object.keys(data).reduce((cur, next) => {
		if (Array.isArray(data[next])) {
			if (data[next].length) {
				cur[next] = data[next];
			}
		} else {
			if (
				data[next] ||
				/^\d+$/.test(data[next])
			) {
				cur[next] = data[next];
			}
		}
		return cur;
	}, {});
}

function trimObject(data) {
	return Object.keys(data).reduce((cur, next) => {
		cur[next] =
			data[next] &&
			isNaN(data[next]) &&
			isString(data[next])
				? data[next].trim()
				: data[next];
		return cur;
	}, {});
}

function urlObjectParams(data) {
	return object2str(
		fileObjectField(trimObject(data))
	);
}

function appendIdInUrl(url, id) {
	const trueUrl = (url || '').endsWith('/')
		? `${url}${id}`
		: `${url}/${id}`;
	return trueUrl;
}

const request = {
	get: async function (url, params) {
		if (params) {
			return await instance.get(
				`${url}?${urlObjectParams(params)}`
			);
		} else {
			return await instance.get(url);
		}
	},
	post: async function (url, postData) {
		return await instance.post(
			url,
			fileObjectField(postData)
		);
	},
	patch: async function (url, id, postData) {
		return await instance.patch(
			appendIdInUrl(url, id),
			postData
		);
	},
	delete: async function (url, id) {
		return await instance.delete(
			appendIdInUrl(url, id)
		);
	},
	upload: async function (url, file) {
		const formData = new FormData();
		formData.append('file', file);
		const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		};
		return await instance.post(
			url,
			formData,
			config
		);
	},
};

export default request;
