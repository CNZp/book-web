<script setup>
import { nextTick, ref } from 'vue';
import SectionTag from './SectionTag.vue';

let { store } = defineProps({
	store: Object,
	canEditTitle: { type: Boolean, default: true },
});

const activeNames = ref([]);
const container = ref();

function addSection() {
	let newSection = store.addSection();
	activeNames.value = [];
	setTimeout(() => {
		activeNames.value = [newSection.uuid];
		nextTick(() => {
			// 滚动到底部
			container.value.scrollTop =
				container.value.scrollHeight;
		});
	}, 0);
}
</script>

<template>
	<div class="body" ref="container">
		<van-cell-group title="页面" inset>
			<van-field
				v-model="store.editingPage.title"
				left-icon="font-o"
				rows="1"
				autosize
				type="textarea"
				maxlength="100"
				placeholder="请输入页面标题"
				class="title-cell"
				:readonly="!canEditTitle"
			/>
			<van-field
				v-model="store.editingPage.content"
				rows="2"
				left-icon="notes-o"
				autosize
				type="textarea"
				maxlength="200"
				placeholder="请输入页面内容"
				show-word-limit
			/>
		</van-cell-group>
		<van-cell-group title="段落" inset>
			<van-empty
				v-if="
					store.editingPage.sections.length === 0
				"
				description="暂无段落"
			/>
			<van-collapse v-else v-model="activeNames">
				<van-collapse-item
					v-for="(section, idx) in store
						.editingPage.sections"
					:key="section.uuid"
					:name="section.uuid"
				>
					<template #title>
						<template
							v-if="
								activeNames.indexOf(
									section.uuid
								) > -1
							"
						>
							<div class="title-box oper">
								<div class="sort">
									{{ idx + 1 }}.
								</div>
								编辑段落
								<div
									v-if="
										store.typeStateDict?.length
									"
									class="state"
									@click.stop
								>
									<van-popover
										:actions="store.typeStateDict"
									>
										<template #action="{ action }"
											><div
												style="
													width: 100%;
													text-align: center;
												"
											>
												<SectionTag
													:state="action.value"
													:store="store"
													show-none
													@click="
														section.state =
															action.value
													"
												/>
											</div>
										</template>
										<template #reference>
											<SectionTag
												style="margin-left: 10px"
												:state="section.state"
												:store="store"
												show-none
											/>
										</template>
									</van-popover>
								</div>
								<div class="btn" @click.stop>
									<van-button
										type="primary"
										size="mini"
										icon="arrow-up"
										:disabled="idx === 0"
										@click="
											store.moveSection(
												section.uuid,
												'up'
											)
										"
									/>
									<van-button
										type="primary"
										size="mini"
										icon="arrow-down"
										:disabled="
											idx ===
											store.selectedPage.sections
												.length -
												1
										"
										@click="
											store.moveSection(
												section.uuid,
												'down'
											)
										"
									/>
									<van-button
										type="danger"
										size="mini"
										icon="cross"
										@click="
											store.removeSection(
												section.uuid
											)
										"
									/>
								</div>
							</div>
						</template>
						<template v-else>
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
					</template>
					<van-field
						v-model="section.title"
						left-icon="font-o"
						rows="1"
						autosize
						type="textarea"
						maxlength="100"
						placeholder="请输入段落标题"
					/>
					<van-field
						v-model="section.content"
						left-icon="notes-o"
						rows="2"
						autosize
						type="textarea"
						maxlength="1000"
						placeholder="请输入段落内容"
						show-word-limit
					/>
				</van-collapse-item>
			</van-collapse>
		</van-cell-group>
	</div>
	<div class="footer">
		<van-button
			class="edit-btn"
			style="margin-right: 10px"
			type="default"
			size="small"
			@click="addSection"
			>追加段落</van-button
		>
		<van-button
			class="edit-btn"
			type="primary"
			size="small"
			@click="store.savePageEdit()"
			>保存</van-button
		>
	</div>
</template>

<style scoped lang="scss">
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
	::v-deep(.van-field__left-icon) {
		color: #0091ff;
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

	&.oper {
		color: #0091ff;

		.btn {
			height: 24px;
			padding: 0 10px;
			display: inline-flex;
			align-items: center;
		}
	}
}
</style>
