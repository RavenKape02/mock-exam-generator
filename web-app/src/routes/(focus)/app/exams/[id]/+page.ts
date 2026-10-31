import { exams, NEW_EXAM_ID } from '#lib/data/mock.js';
import type { EntryGenerator } from './$types';

// Prerender only exams that can be taken: the saved one in progress, plus the id a new exam gets.
// Finished exams open their results instead.
export const entries: EntryGenerator = () => [
	...exams.filter((e) => e.status === 'in-progress').map((e) => ({ id: e.id })),
	{ id: NEW_EXAM_ID }
];
