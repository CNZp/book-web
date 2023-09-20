<script setup>
import { computed } from 'vue';

const props = defineProps({
	fontClass: String,
});

let childClass = computed(() => {
	let classArr = [];
	classArr.push('iconfont');
	if (props.fontClass) {
		classArr.push(props.fontClass);
	}
	return classArr;
});
</script>

<template>
	<i :class="childClass"></i>
</template>

<style lang="scss"></style>
