<script setup>
import { computed } from 'vue';

const props = defineProps({
	state: Object,
	store: Object,
	showNone: { type: Boolean, default: false },
});

const showTag = computed(() => {
	let showTag;
	if (props.store.typeStateDict?.length) {
		if (props.state) {
			let item = props.store.typeStateDict.find(
				(item) => item.value === props.state
			);
			if (item) {
				showTag = {
					text: item.text,
					type:
						item.value === '0'
							? 'warning'
							: 'primary',
				};
			}
		}
		if (props.showNone && !showTag) {
			let nullItem =
				props.store.typeStateDict.find(
					(item) => !item.value
				);
			if (nullItem) {
				showTag = {
					text: nullItem.text,
					type: 'default',
				};
			}
		}
	}
	return showTag;
});
</script>

<template>
	<van-tag
		v-if="showTag"
		:type="showTag.type"
		size="large"
		>{{ showTag.text }}</van-tag
	>
</template>

<style scoped lang="scss"></style>
