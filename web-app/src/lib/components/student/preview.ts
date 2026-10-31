// Prototype only: lets a reviewer see states the sample data never reaches,
// e.g. /app/exams?preview=empty or /app/exams/new?used=1150.
// Pages are prerendered, so the URL is only read in the browser, after hydration.
import { browser } from '$app/env';
import { page } from '$app/state';

export function previewParam(name: string): string | null {
	return browser ? page.url.searchParams.get(name) : null;
}

/** True for ?preview=empty: show the screen as a brand-new student would see it. */
export function previewEmpty(): boolean {
	return previewParam('preview') === 'empty';
}
