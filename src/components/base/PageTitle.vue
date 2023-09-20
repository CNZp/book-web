<script setup>
import FontIcon from './FontIcon.vue';

defineProps({
	page: Object,
});
</script>

<template>
	<div class="title-box">
		<FontIcon
			font-class="icon-yemianpeizhi"
			class="icon"
			style="color: #0091ff; font-size: 18px"
		/>
		<span class="text">{{ page.title }}</span>
		<van-icon
			v-if="page.isFavorite"
			class="tag"
			name="star"
		/>
	</div>
</template>

<style scoped lang="scss">
.title-box {
	display: flex;
	align-items: center;

	.icon {
		flex-grow: 0;
		flex-shrink: 0;
		margin-right: 3px;
		color: #1989fa;
	}

	.text {
		flex-shrink: 1;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		display: inline-block;
	}

	.tag {
		flex-grow: 0;
		flex-shrink: 0;
		margin-left: 5px;
		color: #ffe880;
	}
}
</style>
