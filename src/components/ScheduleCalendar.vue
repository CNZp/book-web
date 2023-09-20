<script setup>
let { store } = defineProps({
	store: Object,
});

let curDate = new Date();
let minDate = new Date();
minDate.setFullYear(curDate.getFullYear() - 2);
let maxDate = new Date();
maxDate.setFullYear(curDate.getFullYear() + 2);

store.querySchedules();
</script>

<template>
	<van-calendar
		:poppable="false"
		:show-confirm="false"
		:min-date="minDate"
		:max-date="maxDate"
		:style="{ height: '100%' }"
		:first-day-of-week="1"
		@select="(date) => store.enterSchedule(date)"
	>
		<template #bottom-info="{ date }">
			<span
				v-if="store.checkScheduleExist(date)"
				class="exist-dot"
				>.</span
			>
		</template>
	</van-calendar>
</template>

<style scoped lang="scss">
.exist-dot {
	font-size: 48px;
	font-weight: bold;
	color: #1dc11d;
}
</style>
