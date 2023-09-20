<script setup>
import BookTitle from './BookTitle.vue';
let { store } = defineProps({
	store: Object,
	showSearch: { type: Boolean, default: true },
	showAdd: { type: Boolean, default: true },
});
</script>

<template>
	<div class="layout-box">
		<div class="header" style="height: auto">
			<van-nav-bar
				:title="'选择' + store.typeLabel + '本'"
				left-arrow
				@click-left="
					store.setBookSelecting(false)
				"
			>
			</van-nav-bar>
			<slot name="search">
				<div class="search-bar" v-if="showSearch">
					<van-search
						class="search"
						v-model="store.bookSearchValue"
						:clearable="false"
						@search="store.bookSearch"
					>
						<template #right-icon>
							<van-icon
								name="cross"
								@click="
									() => store.clearBookSearch()
								"
								v-if="store.bookSearchValue"
							/>
						</template>
					</van-search>
					<van-button
						v-if="showAdd"
						class="add"
						type="primary"
						size="small"
						@click="store.editBook()"
						>创建</van-button
					>
				</div>
			</slot>
		</div>
		<div class="body">
			<slot name="body">
				<van-pull-refresh
					v-model="store.bookPage.refreshing"
					@refresh="store.bookPage.refresh"
				>
					<van-list
						class="list"
						v-model:loading="
							store.bookPage.loading
						"
						:finished="store.bookPage.finished"
						finished-text="没有更多了"
						@load="store.bookPage.load"
					>
						<van-cell
							v-for="item in store.bookPage.list"
							:key="item.id"
							is-link
							@click="store.selectBook(item)"
						>
							<template #title>
								<BookTitle :book="item" />
							</template>
						</van-cell>
					</van-list>
				</van-pull-refresh>
			</slot>
		</div>
	</div>
</template>

<style scoped lang="scss">
.list {
	::v-deep(.van-cell__title) {
		width: 90%;
	}
}

.search-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: #fff;
	.search {
		width: 100px;
		flex-grow: 1;
	}
	.add {
		flex-grow: 0;
		flex-shrink: 0;
		margin-right: 10px;
	}
}
</style>
