import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import request from '../utils/request';
import { usePage } from '../utils/list';
import {
	showConfirmDialog,
	showSuccessToast,
} from 'vant';
import { useGlobalStore } from './global';
import { UUID } from 'uuidjs';
import { useService } from './useService';

export const useWordStore = defineStore(
	'word',
	() => {
		const service = useService({ type: 'trans' });

		function pageSearch() {
			let title =
				service.pageSearchValue.value || '';
			title = title.trim();
			let bookId = service.selectedBook.value?.id;
			service.global.showLoading();
			if (title && bookId) {
				request
					.post('/bapi/trans', { bookId, title })
					.then((res) => {
						if (res.data) {
							service.enterPage(res.data);
						}
						if (res.data.isNew) {
							service.pagePage.refresh();
						}
						service.global.hideLoading();
						clearPageSearch();
					});
			}
		}

		function clearPageSearch() {
			service.pageSearchValue.value = '';
		}

		return {
			...service,
			pageSearch,
			clearPageSearch,
		};
	}
);
