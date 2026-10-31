// Small formatters and lookups shared by the admin screens.
import Sigma from '@lucide/svelte/icons/sigma';
import FlaskConical from '@lucide/svelte/icons/flask-conical';
import BookOpen from '@lucide/svelte/icons/book-open';
import Languages from '@lucide/svelte/icons/languages';
import Type from '@lucide/svelte/icons/type';
import Shapes from '@lucide/svelte/icons/shapes';
import type { Component } from 'svelte';
import type { SubjectSlug } from '#lib/types.js';

const dateFormat = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	day: 'numeric',
	year: 'numeric',
	timeZone: 'UTC'
});

/** "2026-10-30" → "Oct 30, 2026" */
export function formatDate(iso: string): string {
	return dateFormat.format(new Date(`${iso}T00:00:00Z`));
}

export function formatNumber(n: number): string {
	return n.toLocaleString('en-US');
}

/** "run-037" → "Run 037" */
export function runLabel(id: string): string {
	return `Run ${id.replace(/^run-/, '')}`;
}

/** "run-037" → 37 */
export function runNumber(id: string): number {
	return Number(id.replace(/^run-/, ''));
}

/** Question text without markdown marks, on one line (for previews and search). */
export function plainText(text: string): string {
	return text.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
}

export const SUBJECT_ICONS: Record<SubjectSlug, Component> = {
	math: Sigma,
	science: FlaskConical,
	reading: BookOpen,
	language: Languages,
	english: Type,
	abstract: Shapes
};

/** Pixel sizes of the figures in static/figures, so images reserve their space. */

export const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;
