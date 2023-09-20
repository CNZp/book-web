<script setup>
import { useGlobalStore } from '../stores/global';
const global = useGlobalStore();
</script>

<template>
	<van-overlay
		class="absolute-overlay"
		:show="global.loading"
	>
		<div class="wrapper" @click.stop>
			<div class="block">
				<van-loading
					type="spinner"
					vertical
					color="#0094ff"
				/>
			</div>
		</div>
	</van-overlay>
</template>

<style scoped lang="scss">
.absolute-overlay {
	position: absolute;
	background-color: rgba(0, 0, 0, 0.1);
}
.wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
}

.block {
	width: 120px;
	height: 120px;
	// background-color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: -100px;
}
</style>
