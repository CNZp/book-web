<script setup>
import Book from '../components/base/Book.vue';
import BookSelect from '../components/base/BookSelect.vue';
import BookEmpty from '../components/base/BookEmpty.vue';
import { useNoteStore } from '../stores/note';
import Page from '../components/base/Page.vue';
import BookEdit from '../components/base/BookEdit.vue';

const store = useNoteStore();
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
		v-else-if="store.pageReading"
	/>
	<Book
		:store="store"
		show-add
		v-else-if="store.selectedBook"
	/>
	<BookEmpty :store="store" v-else />
</template>

<style scoped lang="scss"></style>
