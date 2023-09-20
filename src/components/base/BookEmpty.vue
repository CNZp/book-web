<script setup>
let { store } = defineProps({ store: Object });
</script>

<template>
	<div class="layout-box">
		<div class="header" style="height: 100px">
			<van-nav-bar>
				<template #left>
					<van-icon
						name="notes-o"
						size="18"
						@click="store.setBookSelecting(true)"
					/>
				</template>
			</van-nav-bar>
		</div>
		<van-empty description="未选择单词本" />
	</div>
</template>

<style scoped lang="scss">
.home-box {
	height: 100%;
	display: flex;
	flex-direction: column;

	.home-content {
		height: 100px;
		flex-grow: 1;
	}

	// .home-bar{

	// }
}
</style>
