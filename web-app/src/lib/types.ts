export type ExamName = 'UPCAT' | 'PSHS NCE';
export type ExamType = 'full' | 'subject';
export type SubjectSlug = 'math' | 'science' | 'reading' | 'language' | 'english' | 'abstract';

export interface Subject {
	slug: SubjectSlug;
	name: string;
	/** Short name for tight spaces (tabs, tables, chart legends) */
	short: string;
	/** CSS colour variable for dots, bars and chart lines. */
	color: string;
}

export interface Topic {
	slug: string;
	name: string;
}

export interface Option {
	label: string;
	text: string;
}

export interface Question {
	id: string;
	topic: string;
	passageId: string | null;
	stem: string;
	figure: string | null;
	options: Option[];
	key: string;
	explanation: string | null;
}

export interface Passage {
	id: string;
	text: string;
}

export interface SubjectQuestions {
	slug: SubjectSlug;
	name: string;
	topics: Topic[];
	passages: Passage[];
	questions: Question[];
}

export interface SubjectScore {
	slug: SubjectSlug;
	correct: number;
	total: number;
}

export interface TopicScore {
	subject: SubjectSlug;
	topic: string;
	correct: number;
	total: number;
}

export interface ExamRecord {
	id: string;
	exam: ExamName;
	type: ExamType;
	/** Set when type is 'subject'. */
	subject?: SubjectSlug;
	perSubject: number;
	/** ISO date */
	date: string;
	status: 'done' | 'in-progress';
	timed: boolean;
	subjects: SubjectScore[];
	topics: TopicScore[];
	/** For in-progress exams */
	answered?: number;
	timeLeftMin?: number;
}

export type QuestionSource = 'bank' | 'pool';
export type QuestionKind = 'new' | 'variant';

export interface AdminQuestion {
	id: string;
	source: QuestionSource;
	exam: ExamName;
	subject: SubjectSlug;
	topic: string;
	stem: string;
	figure: string | null;
	passageId: string | null;
	options: Option[];
	key: string;
	explanation: string | null;
	/** Pool only */
	kind?: QuestionKind;
	llm2Answer?: string;
	outcome?: 'agreed' | 'replaced';
	runId?: string;
}

export interface RunTopicRow {
	subject: SubjectSlug;
	topic: string;
	generated: number;
	agreed: number;
	replaced: number;
}

export interface Run {
	id: string;
	exam: ExamName;
	date: string;
	generated: number;
	disagreements: number;
	fallbacks: number;
	rows: RunTopicRow[];
	disagreementIds: string[];
}
