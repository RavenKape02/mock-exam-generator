// Client-side state for the clickable prototype. Nothing here talks to a server.

import type { ExamName, ExamType, SubjectSlug } from '#lib/types.js';

export type Theme = 'light' | 'dark';
export type QuestionCount = 10 | 20 | 30 | 40 | 50 | 60;

/** What the student picked on New exam, handed to Take exam on Start (client-side only). */
export interface ExamSetup {
	exam: ExamName;
	type: ExamType;
	subject?: SubjectSlug;
	perSubject: QuestionCount;
	timed: boolean;
}

const THEME_KEY = 'oplan-theme';

class Prototype {
	/** Set by New exam's Start button; read by Take exam for the new exam id. Lost on reload. */
	pendingExam = $state<ExamSetup | null>(null);
	theme = $state<Theme>('light');
	/** Default questions per subject, set in Settings and prefilled on New exam. */
	defaultCount = $state<QuestionCount>(60);
	/** Whether new exams start with the timer on. */
	timerOnByDefault = $state(true);

	/** Read the theme that app.html already applied before the first paint. */
	syncTheme() {
		this.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
	}

	setTheme(theme: Theme) {
		this.theme = theme;
		document.documentElement.classList.toggle('dark', theme === 'dark');
		try {
			localStorage.setItem(THEME_KEY, theme);
		} catch {
			// Private mode or blocked storage: the theme still applies for this visit.
		}
	}

	toggleTheme() {
		this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
	}
}

export const prototype = new Prototype();
