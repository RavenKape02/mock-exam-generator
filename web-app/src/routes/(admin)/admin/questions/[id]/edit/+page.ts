import { adminQuestions, rejectedQuestions } from '#lib/data/questions.js';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () =>
	[...adminQuestions, ...rejectedQuestions].map((q) => ({ id: q.id }));
