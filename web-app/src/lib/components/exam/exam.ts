// Shared data helpers for Take exam (S3) and Answer review (S6).
// The prototype builds every exam from the real sample questions in mock.ts.

import { MINUTES_PER_60, SUBJECTS } from '#lib/data/mock.js';
import { questionsBySubject } from '#lib/data/questions.js';
import type { ExamRecord, Passage, Question, SubjectSlug } from '#lib/types.js';

export interface ExamItem {
	/** Position in the whole exam, from 0 */
	index: number;
	/** Number inside its subject, from 1 (answer sheets number each subtest) */
	n: number;
	subject: SubjectSlug;
	question: Question;
	passage: Passage | null;
}

export interface ExamSection {
	slug: SubjectSlug;
	name: string;
	short: string;
	color: string;
	minutes: number;
	items: ExamItem[];
}

export type BubbleStatus = 'blank' | 'answered' | 'correct' | 'wrong';

/**
 * Sections in exam order. Questions that share a passage stay together.
 * A one-subject exam (`type: 'subject'`) keeps only that subject.
 */
export function buildExam(record?: Pick<ExamRecord, 'type' | 'subject'>): ExamSection[] {
	const only = record?.type === 'subject' ? record.subject : undefined;
	let index = 0;
	return questionsBySubject
		.filter((s) => !only || s.slug === only)
		.map((s) => {
			const order: Question[] = [];
			for (const q of s.questions) {
				if (order.includes(q)) continue;
				order.push(q);
				if (q.passageId) {
					order.push(
						...s.questions.filter(
							(o) => o !== q && o.passageId === q.passageId && !order.includes(o)
						)
					);
				}
			}
			const items = order.map((question, i) => ({
				index: index++,
				n: i + 1,
				subject: s.slug,
				question,
				passage: s.passages.find((p) => p.id === question.passageId) ?? null
			}));
			return {
				slug: s.slug,
				name: SUBJECTS[s.slug].name,
				short: SUBJECTS[s.slug].short,
				color: SUBJECTS[s.slug].color,
				minutes: Math.max(1, Math.round((items.length * MINUTES_PER_60) / 60)),
				items
			};
		});
}

/** "4:05" or "1:02:09" */
export function formatClock(seconds: number): string {
	const s = Math.max(0, Math.floor(seconds));
	const h = Math.floor(s / 3600);
	const m = Math.floor((s % 3600) / 60);
	const sec = String(s % 60).padStart(2, '0');
	return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

/** A wrong letter that is still one of the options. */
export function wrongLetter(q: Question, seed: number): string {
	const others = q.options.map((o) => o.label).filter((l) => l !== q.key);
	return others[seed % others.length] ?? LETTERS[0];
}

/**
 * Answers the prototype pretends a student gave, so review always has some wrong and
 * unanswered questions. Same input, same answers.
 */
export function pretendAnswers(items: ExamItem[]): Record<string, string | undefined> {
	const answers: Record<string, string | undefined> = {};
	for (const item of items) {
		const i = item.index;
		if (i % 9 === 4) continue; // left blank
		answers[item.question.id] = i % 4 === 1 ? wrongLetter(item.question, i) : item.question.key;
	}
	return answers;
}

// ---------------------------------------------------------------------------
// Text: bank stems carry a little markup (**underlined words**, \text{CO}_2, \{ \}).
// No math library: turn it into plain segments.
// ---------------------------------------------------------------------------

export interface TextSegment {
	text: string;
	underline?: boolean;
	sub?: boolean;
}

function cleanLatex(s: string): string {
	return s
		.replace(/\\text\{([^}]*)\}/g, '$1')
		.replace(/\\times/g, '×')
		.replace(/\\div/g, '÷')
		.replace(/\\leq?\b/g, '≤')
		.replace(/\\geq?\b/g, '≥')
		.replace(/\\([{}%$])/g, '$1');
}

// "CO_2" becomes CO + subscript 2. Blanks such as "_____" are left alone.
function splitSubscripts(text: string, underline: boolean, out: TextSegment[]) {
	const parts = text.split(/(?<=[A-Za-z0-9)])_\{?([A-Za-z0-9]+)\}?/);
	parts.forEach((part, i) => {
		if (part) out.push({ text: part, underline, sub: i % 2 === 1 });
	});
}

/** Paragraphs of segments. Single newlines stay inside a paragraph (shown with pre-line). */
export function parseText(raw: string): TextSegment[][] {
	return cleanLatex(raw)
		.split(/\n{2,}/)
		.map((para) => {
			const out: TextSegment[] = [];
			para.split(/\*\*/).forEach((chunk, i) => splitSubscripts(chunk, i % 2 === 1, out));
			return out;
		})
		.filter((p) => p.length);
}

/**
 * The first paragraph of a passage is its title only when it is one short line wrapped in
 * quotes (straight or curly), e.g. "The Last Leaf". Anything else stays in the body.
 */
export function passageParts(p: Passage): { title: string | null; body: string } {
	const [first, ...rest] = p.text.split(/\n{2,}/);
	const quoted = /^\s*["“]([^"“”\n]{1,78})["”]\s*$/.exec(first);
	if (quoted && rest.length) return { title: quoted[1].trim(), body: rest.join('\n\n') };
	return { title: null, body: p.text };
}
