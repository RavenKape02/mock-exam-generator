// Question content for the prototype: real UPCAT bank questions (copied by tools/make_sample_data.py).
// Only pages that show question text import this module, so the JSON stays off the other pages.

import sample from './sample-questions.json';
import { POOL_SIZE, poolMeta } from './mock.js';
import type { AdminQuestion, SubjectQuestions, SubjectSlug } from '#lib/types.js';

export const questionsBySubject = (sample as { subjects: SubjectQuestions[] }).subjects;

export function subjectQuestions(slug: SubjectSlug): SubjectQuestions | undefined {
	return questionsBySubject.find((s) => s.slug === slug);
}

const bankQuestions: AdminQuestion[] = questionsBySubject.flatMap((s) =>
	s.questions.map((q) => ({
		...q,
		source: 'bank' as const,
		exam: 'UPCAT' as const,
		subject: s.slug
	}))
);

// Generated items reuse real bank text as stand-ins (the prototype has no generated questions).
const generated: AdminQuestion[] = bankQuestions
	.filter((q) => !q.figure)
	.slice(0, POOL_SIZE)
	.map((q, i) => {
		const meta = poolMeta(i);
		return {
			...q,
			id: meta.id,
			source: 'pool' as const,
			kind: meta.kind,
			llm2Answer: meta.outcome === 'replaced' ? (q.key === 'A' ? 'B' : 'A') : q.key,
			outcome: meta.outcome,
			runId: meta.runId
		};
	});

/** Bank questions plus the ready pool. Only generated items both models agreed on reach the pool. */
export const adminQuestions: AdminQuestion[] = [
	...bankQuestions,
	...generated.filter((q) => q.outcome === 'agreed')
];

/** Generated items the check rejected; a bank question on the same topic was used instead. */
export const rejectedQuestions: AdminQuestion[] = generated.filter((q) => q.outcome === 'replaced');

export function getAdminQuestion(id: string): AdminQuestion | undefined {
	return adminQuestions.find((q) => q.id === id) ?? rejectedQuestions.find((q) => q.id === id);
}
