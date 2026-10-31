// Small formatting helpers shared by the student screens (S1, S2, S4, S5, S7).
import { EXAM_SUBJECTS, SUBJECTS, latestDone } from '#lib/data/mock.js';
import { topicsFor } from '#lib/data/topics.js';
import type { ExamRecord, SubjectSlug } from '#lib/types.js';

// Dates in mock data are plain ISO days, so format them in UTC to avoid an off-by-one day.
const shortFmt = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	day: 'numeric',
	timeZone: 'UTC'
});
const longFmt = new Intl.DateTimeFormat('en-US', {
	month: 'long',
	day: 'numeric',
	year: 'numeric',
	timeZone: 'UTC'
});
const numberFmt = new Intl.NumberFormat('en-US');

/** "Oct 29" */
export const shortDate = (iso: string) => shortFmt.format(new Date(iso));
/** "October 29, 2026" */
export const longDate = (iso: string) => longFmt.format(new Date(iso));
/** "1,200" */
export const num = (n: number) => numberFmt.format(n);

export const percent = (correct: number, total: number) =>
	total ? Math.round((correct / total) * 100) : 0;

/** Short subject names for tight spaces (tables, chart legends); defined once on SUBJECTS. */
export const SHORT_SUBJECT = Object.fromEntries(
	Object.values(SUBJECTS).map((s) => [s.slug, s.short])
) as Record<SubjectSlug, string>;

/** Questions in the whole exam. */
export function examQuestionCount(e: ExamRecord): number {
	return e.perSubject * (e.type === 'full' ? EXAM_SUBJECTS[e.exam].length : 1);
}

/** "Full exam" or the subject name. */
export function examTypeLabel(e: ExamRecord): string {
	return e.type === 'full' ? 'Full exam' : SUBJECTS[e.subject!].name;
}

/** Plain-English one-liner under an exam title. */
export function examMeta(e: ExamRecord): string {
	const per = e.type === 'full' ? `${e.perSubject} per subject` : `${e.perSubject} questions`;
	return `${shortDate(e.date)} · ${per} · ${e.timed ? 'Timed' : 'Untimed'}`;
}

export interface TopicCount {
	slug: string;
	name: string;
	count: number;
	/** Share answered wrong last time, 0–1; null when there is no result yet. */
	missed: number | null;
}

/**
 * Questions per topic for one subject, using the paper's weak-topic split:
 * topic t gets N/(2k) + (N/2) · w_t / Σw, rounded so the counts add up to N.
 * w_t is the share of topic t answered wrong in the last exam that had it.
 */
export function topicSplit(
	subject: SubjectSlug,
	n: number,
	exam: ExamRecord = latestDone
): TopicCount[] {
	const topics = topicsFor(subject);
	const k = topics.length;
	if (!k) return [];

	const missed = topics.map((t) => {
		const score = exam.topics.find((s) => s.subject === subject && s.topic === t.slug);
		return score ? 1 - score.correct / score.total : null;
	});
	const weights = missed.map((m) => m ?? 0);
	const sum = weights.reduce((a, b) => a + b, 0);
	const raw = weights.map((w) => (sum ? n / (2 * k) + (n / 2) * (w / sum) : n / k));

	// Largest remainder: floor everything, then hand out what is left to the biggest fractions.
	const counts = raw.map(Math.floor);
	let left = n - counts.reduce((a, b) => a + b, 0);
	const order = raw.map((r, i) => ({ i, frac: r - Math.floor(r) })).sort((a, b) => b.frac - a.frac);
	for (const { i } of order) {
		if (left <= 0) break;
		counts[i]++;
		left--;
	}

	return topics.map((t, i) => ({
		slug: t.slug,
		name: t.name,
		count: counts[i],
		missed: missed[i]
	}));
}
