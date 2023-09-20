<script setup>
import { computed, ref } from 'vue';
import BookTitle from './BookTitle.vue';
import PageTitle from './PageTitle.vue';
import FontIcon from './FontIcon.vue';
let { store } = defineProps({
	store: Object,
	showSearch: { type: Boolean, default: true },
	showAdd: { type: Boolean, default: false },
});

const show = ref(false);

const actions = computed(() => {
	let isDefault = !!store.selectedBook?.isDefault;
	let actions = [
		{ name: '修改' },
		{ name: '设为默认', disabled: isDefault },
		{
			name: '删除',
			color: isDefault ? null : '#ee0a24',
			disabled: isDefault,
		},
	];

	return actions;
});

function onSelect(item) {
	if (item.name === '修改') {
		store.editBook(store.selectedBook);
	} else if (item.name === '设为默认') {
		store.changeDefaultBook();
	} else if (item.name === '删除') {
		store.removeBook();
	}
	show.value = false;
}
</script>

<template>
	<div class="layout-box">
		<div class="header" style="height: auto">
			<van-nav-bar>
				<template #title>
					<BookTitle :book="store.selectedBook" />
				</template>
				<template #left>
					<FontIcon
						font-class="icon-tushuguan"
						@click="store.setBookSelecting(true)"
						style="
							color: #0091ff;
							font-size: 18px;
						"
					/>
				</template>
				<template #right>
					<FontIcon
						font-class="icon-shezhi"
						@click="show = true"
						style="
							color: #0091ff;
							font-size: 18px;
						"
					/>
				</template>
			</van-nav-bar>
			<slot name="search">
				<div class="search-bar" v-if="showSearch">
					<van-search
						class="search"
						v-model="store.pageSearchValue"
						:clearable="false"
						@search="store.pageSearch"
					>
						<template #right-icon>
							<van-icon
								name="cross"
								@click="
									() => store.clearPageSearch()
								"
								v-if="store.pageSearchValue"
							/>
						</template>
					</van-search>
					<van-button
						v-if="showAdd"
						class="add"
						type="primary"
						size="small"
						@click="store.addPage()"
						>创建</van-button
					>
				</div>
			</slot>
		</div>
		<div class="body">
			<slot name="body">
				<van-pull-refresh
					v-model="store.pagePage.refreshing"
					@refresh="store.pagePage.refresh"
				>
					<van-list
						class="list"
						v-model:loading="
							store.pagePage.loading
						"
						:finished="store.pagePage.finished"
						finished-text="没有更多了"
						@load="store.pagePage.load"
					>
						<van-cell
							v-for="item in store.pagePage.list"
							:key="item.id"
							is-link
							@click="store.enterPage(item)"
						>
							<template #title>
								<PageTitle :page="item" />
							</template>
						</van-cell>
					</van-list>
				</van-pull-refresh>
			</slot>
		</div>
	</div>
	<van-action-sheet
		v-model:show="show"
		:actions="actions"
		:title="'管理' + store.typeLabel + '本'"
		@select="onSelect"
	></van-action-sheet>
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
