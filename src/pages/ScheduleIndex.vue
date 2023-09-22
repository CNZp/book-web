<script setup>
import Book from '../components/base/Book.vue';
import BookSelect from '../components/base/BookSelect.vue';
import BookEmpty from '../components/base/BookEmpty.vue';
import { useScheduleStore } from '../stores/schedule';
import Page from '../components/base/Page.vue';
import BookEdit from '../components/base/BookEdit.vue';
import ScheduleCalendar from '../components/ScheduleCalendar.vue';
import { ref } from 'vue';
import { showSuccessToast } from 'vant';

const store = useScheduleStore();

const showWorklog = ref(false);

const pageActions = [
	{
		name: '生成工作日志',
		func: function () {
			showWorklog.value = true;
		},
	},
];

const copyLog = async () => {
	let results = store.getWorklogTexts();
	await navigator.clipboard.writeText(
		results.join('\r\n')
	);
	showSuccessToast('复制成功');
};
</script>

<template>
	<BookEdit
		:store="store"
		v-if="store.editingBook"
	/>
	<BookSelect
		:store="store"
		v-else-if="store.bookSelecting"
	/>
	<Page
		:store="store"
		:can-edit-root="false"
		v-else-if="store.pageReading"
		:customActions="pageActions"
	/>
	<Book
		:store="store"
		v-else-if="store.selectedBook"
		:show-search="false"
	>
		<template #body>
			<ScheduleCalendar :store="store" />
		</template>
	</Book>
	<BookEmpty :store="store" v-else />

	<van-popup
		v-model:show="showWorklog"
		teleport="#app"
		position="bottom"
		closeable
		lazy-render
		:style="{
			padding: '32px',
			'max-height': '80%',
		}"
	>
		<template
			v-for="(
				text, idx
			) in store.getWorklogTexts()"
			:key="idx"
		>
			<h3 class="log-title" v-if="idx === 0">
				{{ text }}
				<van-button
					v-if="text != '暂无内容'"
					style="margin-left: 5px"
					type="primary"
					size="small"
					@click="copyLog"
					>复制</van-button
				>
			</h3>
			<p class="log-p" v-else>
				{{ text }}
			</p>
		</template>
	</van-popup>
</template>

<style scoped lang="scss">
.log-title {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.log-p {
	margin-block-start: 0.5em;
	margin-block-end: 0.5em;
}
</style>
