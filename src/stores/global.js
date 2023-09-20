import {
	useDebounceFn,
	useThrottleFn,
} from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import request from '../utils/request';
import { useRouter } from 'vue-router';
import jwt_decode from 'jwt-decode';
import { showSuccessToast } from 'vant';

export const useGlobalStore = defineStore(
	'golbal',
	() => {
		const loading = ref(false);

		const showLoading = useThrottleFn(() => {
			loading.value = true;
		}, 200);

		const hideLoading = useDebounceFn(() => {
			loading.value = false;
		}, 300);

		const token = ref('');
		const userInfo = ref(null);

		setToken(localStorage.token);

		function setToken(str) {
			let exist = false;
			let data;
			if (str) {
				data = jwt_decode(str);
				if (data.sub) {
					exist = true;
					data = {
						id: data.sub,
						username: data.username,
					};
				}
			}
			if (exist) {
				token.value = str;
				userInfo.value = data;
				localStorage.setItem('token', str);
			} else {
				token.value = '';
				userInfo.value = null;
				localStorage.setItem('token', '');
			}
		}

		const router = useRouter();

		const login = function (username, password) {
			request
				.post('/api/auth/signin', {
					username,
					password,
				})
				.then((res) => {
					if (res.data?.access_token) {
						setToken(res.data.access_token);
						showSuccessToast('登录成功');
						router.push({
							name: 'Home',
						});
					}
				});
		};

		const logout = function () {
			setToken('');
			showSuccessToast('登出成功');
			router.push({
				name: 'Home',
			});
		};

		return {
			loading,
			showLoading,
			hideLoading,
			token,
			userInfo,
			login,
			logout,
		};
	}
);
