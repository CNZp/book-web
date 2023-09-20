<script setup></script>

<template>
	<van-config-provider theme="light" class="app">
		<router-view />
	</van-config-provider>
</template>

<style scoped>
.app {
	height: 100%;
	overflow: hidden;
}
</style>
