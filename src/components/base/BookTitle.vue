<script setup>
defineProps({
	book: Object,
});
</script>

<template>
	<div class="title-box">
		<van-icon class="icon" name="column" />
		<span class="text">{{ book.title }}</span>
		<van-tag
			v-if="book.isDefault"
			class="tag"
			type="primary"
			size="large"
			>默认</van-tag
		>
	</div>
</template>

<style scoped lang="scss">
.title-box {
	display: flex;
	align-items: center;
	width: 100%;

	.icon {
		flex-grow: 0;
		flex-shrink: 0;
		margin-right: 3px;
		font-size: 18px;
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
		margin-left: 10px;
	}
}
</style>
