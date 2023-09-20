<script setup>
import { ref } from 'vue';
import PageTitle from './PageTitle.vue';
import { computed } from 'vue';
import PageEdit from './PageEdit.vue';
import PageRead from './PageRead.vue';

import { showConfirmDialog } from 'vant';
import FontIcon from './FontIcon.vue';

let { store } = defineProps({
	store: Object,
	canEditTitle: { type: Boolean, default: true },
});

const show = ref(false);

const actions = computed(() => {
	let isFavorite = store.selectedPage?.isFavorite;
	let actions = [
		isFavorite
			? { name: '取消收藏' }
			: { name: '收藏' },
		{
			name: '删除',
			color: '#ee0a24',
		},
	];

	return actions;
});

function onSelect(item) {
	if (
		item.name === '收藏' ||
		item.name === '取消收藏'
	) {
		store.changeFavoritePage();
	} else if (item.name === '删除') {
		store.removePage();
	}
	show.value = false;
}

function onBack() {
	if (store.editingPage) {
		showConfirmDialog({
			title: '修改未保存',
			message: '确认放弃保存，直接返回吗？',
		})
			.then(() => {
				store.leavePage();
			})
			.catch(() => {});
	} else {
		store.leavePage();
	}
}
</script>

<template>
	<div class="layout-box">
		<van-nav-bar
			class="header"
			left-arrow
			@click-left="onBack"
		>
			<template #title>
				<template v-if="store.editingPage">
					编辑页面
				</template>
				<PageTitle
					v-else-if="store.selectedPage"
					:page="store.selectedPage"
				/>
			</template>
			<template #right>
				<FontIcon
					font-class="icon-shezhi"
					@click="show = true"
					style="color: #0091ff; font-size: 18px"
				/>
			</template>
		</van-nav-bar>
		<PageEdit
			v-if="store.editingPage"
			:store="store"
			:canEditTitle="canEditTitle"
		/>
		<PageRead v-else :store="store" />
	</div>
	<van-action-sheet
		v-model:show="show"
		:actions="actions"
		:title="'管理' + store.typeLabel + '本'"
		@select="onSelect"
	></van-action-sheet>
</template>

<style scoped lang="scss"></style>
