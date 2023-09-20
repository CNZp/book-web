<script setup>
import { useGlobalStore } from '../stores/global';
import { showConfirmDialog } from 'vant';

const global = useGlobalStore();

function onLogout() {
	showConfirmDialog({
		title: '确认登出吗？',
	})
		.then(() => {
			global.logout();
		})
		.catch(() => {
			// on cancel
		});
}
</script>
<template>
	<div class="layout-box">
		<div class="header">
			<van-nav-bar title="我的">
				<template #right>
					<FontIcon
						font-class="icon-dengchu"
						@click="onLogout"
						style="
							color: #f25b25;
							font-size: 18px;
						"
					/>
				</template>
			</van-nav-bar>
		</div>
		<van-cell-group inset title="用户信息">
			<van-cell
				><template #title>
					{{
						global.userInfo?.username ||
						'未知用户'
					}}，欢迎您！
				</template></van-cell
			>
		</van-cell-group>
	</div>
</template>

<style scoped lang="scss"></style>
