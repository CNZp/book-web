<script setup>
import { ref } from 'vue';
import { useGlobalStore } from '../stores/global';

const global = useGlobalStore();

const username = ref('');
const password = ref('');

function onSubmit() {
	global.login(username.value, password.value);
}
</script>

<template>
	<div class="layout-box">
		<div class="logo">BOOK</div>
		<div class="form">
			<van-form @submit="onSubmit">
				<van-cell-group inset>
					<van-field
						v-model="username"
						name="用户名"
						label="用户名"
						placeholder="用户名"
						:rules="[
							{
								required: true,
								message: '请填写用户名',
							},
						]"
					/>
					<van-field
						v-model="password"
						type="password"
						name="密码"
						label="密码"
						placeholder="密码"
						:rules="[
							{
								required: true,
								message: '请填写密码',
							},
						]"
					/>
				</van-cell-group>
				<div style="margin: 16px">
					<van-button
						round
						block
						type="primary"
						native-type="submit"
					>
						登 录
					</van-button>
				</div>
			</van-form>
		</div>
	</div>
</template>

<style scoped lang="scss">
.layout-box {
	justify-content: center;
	align-items: center;

	.logo {
		font-size: 48px;
		font-weight: bolder;
		color: #0091ff;
		margin-bottom: 20px;
	}

	.form {
	}
}
</style>
