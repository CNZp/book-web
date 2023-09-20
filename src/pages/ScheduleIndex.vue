<script setup>
import Book from '../components/base/Book.vue';
import BookSelect from '../components/base/BookSelect.vue';
import BookEmpty from '../components/base/BookEmpty.vue';
import { useScheduleStore } from '../stores/schedule';
import Page from '../components/base/Page.vue';
import BookEdit from '../components/base/BookEdit.vue';
import ScheduleCalendar from '../components/ScheduleCalendar.vue';

const store = useScheduleStore();
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
		:can-edit-title="false"
		v-else-if="store.pageReading"
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
</template>

<style scoped lang="scss"></style>
