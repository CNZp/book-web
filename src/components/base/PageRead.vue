<script setup>
import { ref } from 'vue';
import { effect } from 'vue';

let { store } = defineProps({ store: Object });

const activeNames = ref([]);
const container = ref();

effect(() => {
	let newActiveNames = [];
	if (store && store.selectedPage) {
		newActiveNames = store.selectedPage.sections
			.filter((section) => section.content)
			.map((section) => section.uuid);
	}
	activeNames.value = newActiveNames;
});
</script>

<template>
	<div class="body" ref="container">
		<van-cell-group class="area" inset>
			<van-field
				v-model="store.selectedPage.title"
				rows="1"
				autosize
				type="textarea"
				placeholder="暂无页面标题"
				readonly
				class="title-cell"
			/>
			<van-field
				v-if="store.selectedPage.content"
				v-model="store.selectedPage.content"
				rows="1"
				autosize
				type="textarea"
				placeholder="暂无页面内容"
				readonly
			/>
		</van-cell-group>
		<van-cell-group class="area" inset>
			<van-empty
				v-if="
					store.selectedPage.sections.length === 0
				"
				description="暂无段落"
			/>
			<van-collapse v-else v-model="activeNames">
				<van-collapse-item
					v-for="(section, idx) in store
						.selectedPage.sections"
					:key="section.uuid"
					:name="section.uuid"
				>
					<template #title>
						<div class="title-box">
							<div class="sort">
								{{ idx + 1 }}.
							</div>
							<div
								:class="{
									text: true,
									empty: !section.title,
								}"
							>
								{{ section.title || '无标题' }}
							</div>
							<div class="state">
								<SectionTag
									style="margin-left: 10px"
									:state="section.state"
									:store="store"
								/>
							</div>
						</div>
					</template>
					<van-field
						v-model="section.content"
						rows="2"
						autosize
						type="textarea"
						maxlength="1000"
						placeholder="暂无段落内容"
						readonly
					/>
				</van-collapse-item>
			</van-collapse>
		</van-cell-group>
	</div>
	<div class="footer">
		<van-button
			class="refresh-btn"
			icon="replay"
			type="primary"
			size="small"
			plain
			@click="store.reloadPage()"
		></van-button>
		<van-button
			class="edit-btn"
			type="primary"
			size="small"
			@click="store.editPage(store.selectedPage)"
			>编辑</van-button
		>
	</div>
</template>

<style scoped lang="scss">
.area {
	margin-top: 20px;
}
.body {
	padding-bottom: 20px;
	.title-cell {
		font-weight: bold;
	}
	.title-cell:after {
		border-bottom: 1px solid #0091ff;
	}
	::v-deep(.van-collapse-item) {
		// &.van-collapse-item--border:after {
		// 	border-top: none;
		// }
		> .van-cell:after {
			border-bottom: 1px solid #0091ff;
		}
		.van-collapse-item__content {
			padding: 0;
		}
	}
}
.footer {
	padding: 10px;
	background-color: #fff;
	// border-top: 1px solid #cccccc;
	display: flex;
	align-items: center;
	justify-content: center;

	.refresh-btn {
		margin-right: 10px;
	}
	.edit-btn {
		flex-grow: 1;
		width: 100px;
	}
}

.title-box {
	display: flex;
	align-items: center;
	width: 100%;
	font-weight: bold;
	.sort {
		flex-grow: 0;
		flex-shrink: 0;
		margin-right: 4px;
		min-width: 18px;
	}
	.text {
		flex-shrink: 1;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		display: inline-block;
		&.empty {
			color: #999999;
			font-weight: normal;
		}
	}
	.state {
		flex-shrink: 0;
	}
}
</style>
