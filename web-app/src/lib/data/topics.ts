// Topic lists per subject (from the UPCAT bank's TOPICS.md). Kept apart from the question
// data so pages that only show topic names don't download the sample questions.
// PSHS NCE topics are not set yet: its bank is on hold.

import type { SubjectSlug, Topic } from '#lib/types.js';

export const TOPICS: Partial<Record<SubjectSlug, Topic[]>> = {
	math: [
		{ slug: 'arithmetic', name: 'Arithmetic and Number Sense' },
		{ slug: 'algebra', name: 'Algebra' },
		{ slug: 'geometry', name: 'Geometry' },
		{ slug: 'statistics', name: 'Statistics and Probability' },
		{ slug: 'trigonometry', name: 'Trigonometry' }
	],
	science: [
		{ slug: 'earth-science', name: 'Earth Science' },
		{ slug: 'biology', name: 'Biology' },
		{ slug: 'chemistry', name: 'Chemistry' },
		{ slug: 'physics', name: 'Physics' },
		{ slug: 'astronomy', name: 'Astronomy' }
	],
	reading: [
		{ slug: 'main-idea', name: 'Main Idea and Title' },
		{ slug: 'details', name: 'Details and Evidence' },
		{ slug: 'word-meaning', name: 'Word Meaning from Context' },
		{ slug: 'inference', name: 'Inference and Conclusions' },
		{ slug: 'author-purpose', name: "Author's Purpose and Point of View" },
		{ slug: 'literary-devices', name: 'Literary Devices and Criticism' }
	],
	language: [
		{ slug: 'english-vocabulary', name: 'English Vocabulary' },
		{ slug: 'english-grammar', name: 'English Grammar and Usage' },
		{ slug: 'filipino-vocabulary', name: 'Filipino Vocabulary (Talasalitaan)' },
		{ slug: 'filipino-grammar', name: 'Filipino Grammar (Gramatika)' }
	]
};

export function topicsFor(subject: SubjectSlug): Topic[] {
	return TOPICS[subject] ?? [];
}

export function topicName(subject: SubjectSlug, slug: string): string {
	return topicsFor(subject).find((t) => t.slug === slug)?.name ?? slug;
}
