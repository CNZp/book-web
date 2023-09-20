import { ref } from 'vue';
import request from './request';

export const usePage = function ({
	url,
	limit = 20,
	defaultQuery = {},
}) {
	const query = ref(defaultQuery);
	const list = ref([]);
	const page = ref(0);
	const loading = ref(false);
	const finished = ref(false);
	const refreshing = ref(false);

	function load(addQuery = {}) {
		if (finished.value) {
			return false;
		}
		loading.value = true;
		let reqQuery = {
			...query.value,
			...addQuery,
		};
		request
			.get(url, {
				...reqQuery,
				page: page.value + 1,
				limit,
			})
			.then((res) => {
				page.value =
					parseInt(res.data.page, 10) || 0;
				finished.value = !res.data.hasNext;
				if (page.value > 1) {
					list.value = list.value.concat(
						res.data.data
					);
				} else {
					list.value = res.data.data;
				}
				loading.value = false;
				refreshing.value = false;
			});
	}

	function refresh(addQuery = {}) {
		refreshing.value = true;
		finished.value = false;
		page.value = 0;
		load(addQuery);
	}

	function reload(defaultQuery) {
		list.value = [];
		page.value = 0;
		loading.value = false;
		finished.value = false;
		refreshing.value = false;
		if (defaultQuery) {
			query.value = defaultQuery;
		}
	}

	return {
		list,
		page,
		loading,
		finished,
		refreshing,
		load,
		refresh,
		reload,
	};
};
