// Sample data for the clickable prototype. Students, scores, runs and pool numbers are invented.
// Question text lives in questions.ts and topic names in topics.ts (both real, from the UPCAT bank),
// so pages that don't show questions never download them.

import { topicName, topicsFor } from './topics.js';
import type {
	ExamName,
	ExamRecord,
	QuestionKind,
	Run,
	Subject,
	SubjectSlug,
	TopicScore
} from '#lib/types.js';

export const SUBJECTS: Record<SubjectSlug, Subject> = {
	math: { slug: 'math', name: 'Mathematics', short: 'Math', color: 'var(--subject-math)' },
	science: { slug: 'science', name: 'Science', short: 'Science', color: 'var(--subject-science)' },
	reading: {
		slug: 'reading',
		name: 'Reading Comprehension',
		short: 'Reading',
		color: 'var(--subject-reading)'
	},
	language: {
		slug: 'language',
		name: 'Language Proficiency',
		short: 'Language',
		color: 'var(--subject-language)'
	},
	english: { slug: 'english', name: 'English', short: 'English', color: 'var(--subject-reading)' },
	abstract: {
		slug: 'abstract',
		name: 'Abstract Reasoning',
		short: 'Abstract',
		color: 'var(--subject-language)'
	}
};

export const EXAM_SUBJECTS: Record<ExamName, SubjectSlug[]> = {
	UPCAT: ['math', 'science', 'reading', 'language'],
	'PSHS NCE': ['science', 'math', 'english', 'abstract']
};

/** Minutes per subject at 60 questions; scaled down for shorter exams. */
export const MINUTES_PER_60 = 60;
export const QUESTION_COUNTS = [10, 20, 30, 40, 50, 60] as const;
export const DAILY_LIMIT = 1200;
export const USED_TODAY = 240;

export const student = {
	email: 'jamie.reyes@example.com',
	initials: 'JR'
};

// ---------------------------------------------------------------------------
// Exams taken (newest first)
// ---------------------------------------------------------------------------

const upcatTopics = (scores: Record<string, [number, number]>): TopicScore[] =>
	Object.entries(scores).map(([key, [correct, total]]) => {
		const [subject, topic] = key.split('/') as [SubjectSlug, string];
		return { subject, topic, correct, total };
	});

export const exams: ExamRecord[] = [
	{
		id: 'e-107',
		exam: 'UPCAT',
		type: 'full',
		perSubject: 20,
		date: '2026-10-31',
		status: 'in-progress',
		timed: true,
		answered: 23,
		timeLeftMin: 51,
		subjects: [],
		topics: []
	},
	{
		id: 'e-106',
		exam: 'UPCAT',
		type: 'full',
		perSubject: 60,
		date: '2026-10-29',
		status: 'done',
		timed: true,
		subjects: [
			{ slug: 'math', correct: 34, total: 60 },
			{ slug: 'science', correct: 41, total: 60 },
			{ slug: 'reading', correct: 47, total: 60 },
			{ slug: 'language', correct: 44, total: 60 }
		],
		topics: upcatTopics({
			'math/arithmetic': [9, 12],
			'math/algebra': [7, 13],
			'math/geometry': [5, 12],
			'math/statistics': [8, 11],
			'math/trigonometry': [5, 12],
			'science/earth-science': [9, 12],
			'science/biology': [10, 12],
			'science/chemistry': [6, 12],
			'science/physics': [7, 12],
			'science/astronomy': [9, 12],
			'reading/main-idea': [9, 10],
			'reading/details': [9, 10],
			'reading/word-meaning': [8, 10],
			'reading/inference': [7, 10],
			'reading/author-purpose': [8, 10],
			'reading/literary-devices': [6, 10],
			'language/english-vocabulary': [12, 15],
			'language/english-grammar': [11, 15],
			'language/filipino-vocabulary': [12, 15],
			'language/filipino-grammar': [9, 15]
		})
	},
	{
		id: 'e-105',
		exam: 'UPCAT',
		type: 'subject',
		subject: 'math',
		perSubject: 30,
		date: '2026-10-27',
		status: 'done',
		timed: false,
		subjects: [{ slug: 'math', correct: 16, total: 30 }],
		topics: upcatTopics({
			'math/arithmetic': [5, 6],
			'math/algebra': [3, 6],
			'math/geometry': [2, 6],
			'math/statistics': [4, 6],
			'math/trigonometry': [2, 6]
		})
	},
	{
		id: 'e-104',
		exam: 'UPCAT',
		type: 'full',
		perSubject: 60,
		date: '2026-10-22',
		status: 'done',
		timed: true,
		subjects: [
			{ slug: 'math', correct: 29, total: 60 },
			{ slug: 'science', correct: 38, total: 60 },
			{ slug: 'reading', correct: 45, total: 60 },
			{ slug: 'language', correct: 40, total: 60 }
		],
		topics: []
	},
	{
		id: 'e-103',
		exam: 'UPCAT',
		type: 'subject',
		subject: 'science',
		perSubject: 20,
		date: '2026-10-18',
		status: 'done',
		timed: true,
		subjects: [{ slug: 'science', correct: 11, total: 20 }],
		topics: []
	},
	{
		id: 'e-102',
		exam: 'UPCAT',
		type: 'full',
		perSubject: 60,
		date: '2026-10-12',
		status: 'done',
		timed: true,
		subjects: [
			{ slug: 'math', correct: 26, total: 60 },
			{ slug: 'science', correct: 35, total: 60 },
			{ slug: 'reading', correct: 42, total: 60 },
			{ slug: 'language', correct: 37, total: 60 }
		],
		topics: []
	}
];

export const latestDone = exams.find((e) => e.status === 'done')!;
export const inProgress = exams.find((e) => e.status === 'in-progress');

/** Id a freshly started exam gets in the prototype. Its results show the latest finished exam. */
export const NEW_EXAM_ID = 'e-108';

export function getExam(id: string): ExamRecord | undefined {
	return exams.find((e) => e.id === id);
}

/** Exam to show on results and review pages; unknown ids (a new exam) fall back to the latest one. */
export function finishedExam(id: string): ExamRecord {
	const exam = getExam(id);
	return exam && exam.status === 'done' ? exam : latestDone;
}

export function examScore(e: ExamRecord) {
	const correct = e.subjects.reduce((n, s) => n + s.correct, 0);
	const total = e.subjects.reduce((n, s) => n + s.total, 0);
	return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
}

export function examTitle(e: ExamRecord): string {
	return e.type === 'full' ? `${e.exam} full mock exam` : `${e.exam} ${SUBJECTS[e.subject!].name}`;
}

/** Weakest topics across the latest exam, lowest share correct first. */
export function weakTopics(e: ExamRecord = latestDone, limit = 4) {
	return [...e.topics]
		.sort((a, b) => a.correct / a.total - b.correct / b.total)
		.slice(0, limit)
		.map((t) => ({
			...t,
			name: topicName(t.subject, t.topic),
			percent: Math.round((t.correct / t.total) * 100)
		}));
}

// ---------------------------------------------------------------------------
// Admin (researcher)
// ---------------------------------------------------------------------------

export const bankCounts: Record<ExamName, Partial<Record<SubjectSlug, number>>> = {
	UPCAT: { math: 119, science: 118, reading: 169, language: 169 },
	'PSHS NCE': {}
};

export const poolCounts: Partial<Record<SubjectSlug, number>> = {
	math: 1240,
	science: 1185,
	reading: 960,
	language: 1102
};

export const studentStats = { signUps: 312, examsThisWeek: 486, activeToday: 74 };
export const RUNS_PLANNED = 100;
export const RUNS_DONE = 37;

/** How many generated items the prototype keeps (their text is borrowed from the bank in questions.ts). */
export const POOL_SIZE = 18;

/** Check outcome for generated item i. Kept here so run data needs no question text. */
export function poolMeta(i: number) {
	const replaced = i % 7 === 3;
	return {
		id: `pool-${String(i + 1).padStart(4, '0')}`,
		kind: (i % 3 === 0 ? 'variant' : 'new') as QuestionKind,
		outcome: (replaced ? 'replaced' : 'agreed') as 'replaced' | 'agreed',
		runId: i % 2 === 0 ? 'run-037' : 'run-036'
	};
}

const RUN_SUBJECTS: SubjectSlug[] = ['math', 'science', 'reading', 'language'];

/** Questions generated per topic so one run fills a 240-question UPCAT mock exam (60 per subject). */
const perTopic = (subject: SubjectSlug) => 60 / topicsFor(subject).length;

// The 8 latest runs, newest first. All UPCAT: the PSHS NCE bank is on hold, so it has no runs yet.
export const runs: Run[] = Array.from({ length: 8 }, (_, i) => {
	const n = RUNS_DONE - i;
	const id = `run-${String(n).padStart(3, '0')}`;
	const rows = RUN_SUBJECTS.flatMap((subject) =>
		topicsFor(subject).map((t, j) => {
			const generated = perTopic(subject);
			const replaced = (n * 7 + j * 3 + subject.length) % 4;
			return { subject, topic: t.name, generated, agreed: generated - replaced, replaced };
		})
	);
	const disagreements = rows.reduce((sum, r) => sum + r.replaced, 0);
	return {
		id,
		exam: 'UPCAT' as const,
		date: `2026-10-${String(30 - i * 2).padStart(2, '0')}`,
		generated: rows.reduce((sum, r) => sum + r.generated, 0),
		disagreements,
		fallbacks: disagreements,
		rows,
		disagreementIds: Array.from({ length: POOL_SIZE }, (_, k) => poolMeta(k))
			.filter((m) => m.runId === id && m.outcome === 'replaced')
			.map((m) => m.id)
	};
});

export function getRun(id: string): Run | undefined {
	return runs.find((r) => r.id === id);
}
