import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import request from '../utils/request';
import { usePage } from '../utils/list';
import {
	showConfirmDialog,
	showNotify,
	showSuccessToast,
} from 'vant';
import { useGlobalStore } from './global';
import { UUID } from 'uuidjs';

export const useService = ({ type }) => {
	let typeLabel = '';
	if (type === 'trans') {
		typeLabel = '单词';
	} else if (type === 'note') {
		typeLabel = '笔记';
	} else if (type === 'schedule') {
		typeLabel = '日程';
	}

	const typeStateDict = [];

	const global = useGlobalStore();

	const bookSelecting = ref(false);
	const pageReading = ref(false);
	const bookSearchValue = ref('');
	const bookPage = usePage({
		url: '/bapi/book',
		defaultQuery: { type },
	});
	const selectedBook = ref(null);
	const selectedPage = ref(null);
	const pageSearchValue = ref('');
	const pagePage = usePage({
		url: '/bapi/page',
	});
	const editingBook = ref(null);
	const editingPage = ref(null);

	queryDefaultBook();

	function queryDefaultBook() {
		global.showLoading();
		request
			.get('/bapi/book/default?type=' + type)
			.then((res) => {
				selectBook(res.data);
				global.hideLoading();
			});
	}
	function setBookSelecting(selecting) {
		bookSelecting.value = !!selecting;
		if (selecting) {
			bookSearch();
		}
	}

	function bookSearch() {
		let title = bookSearchValue.value || '';
		title = title.trim();
		bookPage.reload({ type, title });
	}

	function clearBookSearch() {
		bookSearchValue.value = '';
		bookSearch();
	}

	function selectBook(book) {
		selectedBook.value = book;
		setBookSelecting(false);
		pagePage.reload(
			book?.id ? { bookId: book.id } : {}
		);
	}

	function resortSections(page) {
		page.sections.forEach((item, idx) => {
			item.sort = idx;
		});
	}

	function reloadPage() {
		enterPage(selectedPage.value);
	}

	function enterPage(page) {
		if (page?.id) {
			global.showLoading();
			request
				.get('/bapi/page/' + page.id)
				.then((res) => {
					let resPage = res.data;
					if (resPage) {
						resPage.sections.forEach(
							(section) => {
								section.uuid =
									UUID.genV1().toString();
							}
						);
						resortSections(resPage);
						selectedPage.value = res.data;
						pageReading.value = true;
					}
					global.hideLoading();
				});
		}
	}

	function addPage(defaultPage = {}) {
		let newPage = {
			bookId: selectedBook.value.id,
			isNew: true,
			sections: [],
			...defaultPage,
		};
		selectedPage.value = newPage;
		pageReading.value = true;
		editPage(newPage);
	}

	function leavePage() {
		pageReading.value = false;
		selectedPage.value = null;
		editingPage.value = null;
	}

	function editBook(book = {}) {
		editingBook.value = {
			type,
			...book,
		};
	}

	function editPage(page) {
		editingPage.value = {
			...page,
		};
	}

	function changeDefaultBook() {
		let data = selectedBook.value;
		if (data?.id) {
			request
				.post(
					'/bapi/book/changeDefaultBook',
					data
				)
				.then((res) => {
					bookPage.reload();
					selectBook(res.data);
					showSuccessToast('操作成功');
				});
		}
	}

	function removeBook() {
		showConfirmDialog({
			title: '确认删除该' + typeLabel + '本吗？',
		})
			.then(() => {
				let data = selectedBook.value;
				if (data?.id) {
					request
						.delete('api/book', data.id)
						.then(() => {
							bookPage.reload();
							queryDefaultBook();
							showSuccessToast(
								'删除成功\r\n切换默认'
							);
						});
				}
			})
			.catch(() => {
				// on cancel
			});
	}

	function saveBookEdit() {
		let data = editingBook.value;
		if (data.id) {
			request
				.patch('/bapi/book/', data.id, data)
				.then((res) => {
					editingBook.value = null;
					bookSelecting.value = false;
					bookPage.reload();
					selectBook(res.data);
				});
		} else {
			request
				.post('/bapi/book/add', data)
				.then((res) => {
					editingBook.value = null;
					bookSelecting.value = false;
					bookPage.reload();
					selectBook(res.data);
				});
		}
	}

	function cancelBookEdit() {
		editingBook.value = null;
	}

	function pageSearch() {
		let title = pageSearchValue.value || '';
		title = title.trim();
		let bookId = selectedBook.value?.id;
		if (bookId) {
			pagePage.reload({ bookId, title });
		}
	}

	function clearPageSearch() {
		pageSearchValue.value = '';
		pageSearch();
	}

	function removePage() {
		showConfirmDialog({
			title: '确认删除该页面吗？',
		})
			.then(() => {
				let data = selectedPage.value;
				if (data?.id) {
					request
						.delete('api/page', data.id)
						.then(() => {
							pagePage.reload();
							leavePage(true);
							showSuccessToast('删除成功');
						});
				}
			})
			.catch(() => {
				// on cancel
			});
	}

	function changeFavoritePage() {
		let data = selectedPage.value;
		if (data?.id) {
			data.isFavorite = !data.isFavorite;
			request
				.patch('/bapi/page', data.id, data)
				.then((res) => {
					pagePage.reload();
					selectedPage.value = res.data;
					showSuccessToast('操作成功');
				});
		}
	}

	function addSection() {
		const page = editingPage.value;
		let result = {
			uuid: UUID.genV1().toString(),
		};
		page.sections.push(result);
		resortSections(page);
		return result;
	}

	function removeSection(uuid) {
		showConfirmDialog({
			title: '确认删除该段落吗？',
		})
			.then(() => {
				const page = editingPage.value;
				let index = page.sections.findIndex(
					(item) => item.uuid === uuid
				);
				if (index > -1) {
					let cur = page.sections[index];
					page.sections.splice(index, 1);
					if (cur.id) {
						if (!page.removeSectionIds) {
							page.removeSectionIds = [];
						}
						page.removeSectionIds.push(cur.id);
					}
				}
				resortSections(page);
				showNotify({
					type: 'success',
					message: '段落删除成功',
				});
			})
			.catch(() => {
				// on cancel
			});
	}

	function moveSection(uuid, direction) {
		const page = editingPage.value;
		let index = page.sections.findIndex(
			(item) => item.uuid === uuid
		);
		if (direction === 'up') {
			if (index > 0) {
				let cur = page.sections[index];
				page.sections.splice(index, 1);
				page.sections.splice(index - 1, 0, cur);
				resortSections(page);
				showNotify({
					type: 'success',
					message: '段落上移成功',
				});
			}
		} else if (direction === 'down') {
			if (index < page.sections.length - 1) {
				let cur = page.sections[index];
				page.sections.splice(index, 1);
				page.sections.splice(index + 1, 0, cur);
				resortSections(page);
				showNotify({
					type: 'success',
					message: '段落下移成功',
				});
			}
		}
	}

	function savePageEdit() {
		let data = editingPage.value;
		if (data.id) {
			global.showLoading();
			request
				.patch('/bapi/page', data.id, data)
				.then((res) => {
					enterPage(res.data);
					editingPage.value = null;
					pagePage.refresh();
					global.hideLoading();
				});
		} else {
			request
				.post('/bapi/page/add', data)
				.then((res) => {
					enterPage(res.data);
					editingPage.value = null;
					pagePage.refresh();
					global.hideLoading();
				});
		}
	}

	return {
		global,
		type,
		typeLabel,
		typeStateDict,
		bookSelecting,
		bookSearchValue,
		bookPage,
		selectedBook,
		pageSearchValue,
		pagePage,
		pageReading,
		selectedPage,
		editingBook,
		editingPage,
		bookSearch,
		clearBookSearch,
		setBookSelecting,
		selectBook,
		enterPage,
		leavePage,
		pageSearch,
		clearPageSearch,
		editBook,
		saveBookEdit,
		cancelBookEdit,
		changeDefaultBook,
		removeBook,
		queryDefaultBook,
		removePage,
		changeFavoritePage,
		editPage,
		addPage,
		addSection,
		removeSection,
		moveSection,
		savePageEdit,
		reloadPage,
	};
};
