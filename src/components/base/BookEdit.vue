<script setup>
import { computed } from 'vue';

let { store } = defineProps({ store: Object });

const isAdd = computed(() => {
	return !store.editingBook?.id;
});
</script>

<template>
	<div class="layout-box">
		<van-nav-bar
			class="header"
			:title="
				(isAdd ? '创建' : '修改') +
				store.typeLabel +
				'本'
			"
			left-text="返回"
			left-arrow
			@click-left="store.cancelBookEdit()"
		>
		</van-nav-bar>
		<div class="body">
			<van-form @submit="store.saveBookEdit">
				<van-cell-group title="单词本信息" inset>
					<van-field
						label="名称"
						v-model="store.editingBook.title"
						placeholder="名称"
						maxlength="100"
						:rules="[
							{
								required: true,
								message: '请填写名称',
							},
						]"
					/>
					<van-field
						label="描述"
						v-model="store.editingBook.content"
						placeholder="描述"
						rows="2"
						autosize
						type="textarea"
						maxlength="1000"
						show-word-limit
					/>
					<van-space
						style="margin: 16px"
						size="20px"
						direction="vertical"
						fill
					>
						<van-button
							round
							block
							type="primary"
							native-type="submit"
						>
							提交
						</van-button>
					</van-space>
				</van-cell-group>
			</van-form>
		</div>
	</div>
</template>

<style scoped lang="scss"></style>
