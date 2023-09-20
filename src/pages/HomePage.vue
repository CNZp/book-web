<script setup>
import { KeepAlive } from 'vue';
import GlobalLoading from '../components/GlobalLoading.vue';
defineProps({
	msg: String,
});
</script>

<template>
	<div class="layout-box">
		<div class="body">
			<router-view v-slot="{ Component }">
				<transition>
					<keep-alive>
						<component :is="Component" />
					</keep-alive>
				</transition>
			</router-view>
			<GlobalLoading />
		</div>
		<div class="footer">
			<van-tabbar route :fixed="false">
				<van-tabbar-item
					icon="home-o"
					to="/word"
					replace
					>单词本</van-tabbar-item
				>
				<van-tabbar-item
					icon="home-o"
					to="/note"
					replace
					>笔记本</van-tabbar-item
				>
				<van-tabbar-item
					icon="home-o"
					to="/schedule"
					replace
					>日程本</van-tabbar-item
				>
				<van-tabbar-item
					icon="home-o"
					to="/user"
					replace
					>我的</van-tabbar-item
				>
			</van-tabbar>
		</div>
	</div>
</template>

<style scoped lang="scss"></style>
