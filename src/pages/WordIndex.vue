<script setup>
import Book from '../components/base/Book.vue';
import BookSelect from '../components/base/BookSelect.vue';
import BookEmpty from '../components/base/BookEmpty.vue';
import { useWordStore } from '../stores/word';
import Page from '../components/base/Page.vue';
import BookEdit from '../components/base/BookEdit.vue';

const store = useWordStore();
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
	/>
	<Book
		:store="store"
		v-else-if="store.selectedBook"
	/>
	<BookEmpty :store="store" v-else />
</template>

<style scoped lang="scss"></style>
