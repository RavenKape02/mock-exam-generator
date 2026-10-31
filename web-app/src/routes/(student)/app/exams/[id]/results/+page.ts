import { exams, NEW_EXAM_ID } from '#lib/data/mock.js';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () => [
	...exams.filter((e) => e.status === 'done').map((e) => ({ id: e.id })),
	{ id: NEW_EXAM_ID }
];
