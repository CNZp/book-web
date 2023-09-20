import { defineStore } from 'pinia';
import { useService } from './useService';

export const useNoteStore = defineStore(
	'note',
	() => {
		const service = useService({ type: 'note' });
		return {
			...service,
			typeStateDict: [
				{ text: '无状态', value: '' },
				{ text: '待整理', value: '0' },
				{ text: '已完成', value: '1' },
			],
		};
	}
);
