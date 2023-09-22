import { defineStore } from 'pinia';
import { useService } from './useService';
import request from '../utils/request';
import { ref } from 'vue';

export const useScheduleStore = defineStore(
	'schedule',
	() => {
		const service = useService({
			type: 'schedule',
		});
		const existSchedules = ref({});

		function dateToTitle(date) {
			let strs = [];
			strs.push(date.getFullYear());
			strs.push(date.getMonth() + 1);
			strs.push(date.getDate());
			return strs.join('-');
		}

		function checkScheduleExist(date) {
			let title = dateToTitle(date);
			if (existSchedules.value[title]) {
				return true;
			} else {
				return false;
			}
		}

		function querySchedules() {
			request
				.get('/bapi/schedule', {
					bookId: service.selectedBook.value?.id,
				})
				.then((res) => {
					let newMap = {};
					(res.data || []).forEach((item) => {
						newMap[item.title] = item.id;
					});
					existSchedules.value = newMap;
				});
		}

		function enterSchedule(date) {
			let title = dateToTitle(date);
			let id = existSchedules.value[title];
			if (id) {
				service.enterPage({ id });
			} else {
				service.addPage({ title });
			}
		}

		function getWorklogTexts() {
			let results = [];
			let page = service.selectedPage.value;
			if (page?.sections?.length) {
				results.push(page.title);
				let index = 1;
				(page.sections || []).forEach(
					(section) => {
						let texts = [];
						let title = (
							section.title || ''
						).trim();
						if (title) {
							texts.push(index++);
							texts.push('、');
							texts.push(title);
							if (
								!title.endsWith('.') &&
								!title.endsWith('。')
							) {
								texts.push('。');
							}
							let content = (
								section.content || ''
							).trim();
							if (content) {
								texts.push(content);
								if (
									!content.endsWith('.') &&
									!content.endsWith('。')
								) {
									texts.push('。');
								}
							}
						}
						if (texts.length) {
							results.push(texts.join(''));
						}
					}
				);
			}
			if (!results.length) {
				results.push('暂无内容');
			}
			return results;
		}

		return {
			...service,
			existSchedules,
			querySchedules,
			checkScheduleExist,
			enterSchedule,
			dateToTitle,
			getWorklogTexts,
			typeStateDict: [
				{ text: '无状态', value: '' },
				{ text: '待办', value: '0' },
				{ text: '已完成', value: '1' },
			],
		};
	}
);
