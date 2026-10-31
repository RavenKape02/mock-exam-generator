// Lenis smooth scrolling (the owner asked for it). Wheel and trackpad scrolling glide; touch scrolling
// stays native (syncTouch off), so phones keep their own feel. Lenis switches itself off for people
// who prefer reduced motion.

import Lenis, { type LenisOptions } from 'lenis';

const OPTIONS: LenisOptions = {
	autoRaf: true,
	lerp: 0.12,
	syncTouch: false,
	// Inner scroll areas (question card, answer sheet, dialogs) keep scrolling on their own.
	allowNestedScroll: true,
	anchors: true,
	prevent: (node) => node.closest('dialog, [popover]') !== null
};

/** Smooth-scroll the page itself. Call destroy() on the result to stop. */
export function smoothWindow(): Lenis {
	return new Lenis(OPTIONS);
}

/**
 * Attachment for an element that scrolls on its own (the app shell's main area on tablets and up).
 * Its first child is the scrolled content. Only active while `query` matches, because below that
 * breakpoint the page itself scrolls and a Lenis on this element would swallow wheel events.
 */
export function smoothElement(query: string, onReady?: (lenis: Lenis | null) => void) {
	return (wrapper: HTMLElement) => {
		const media = matchMedia(query);
		let lenis: Lenis | null = null;

		const update = () => {
			lenis?.destroy();
			lenis = null;
			const content = wrapper.firstElementChild;
			if (media.matches && content) lenis = new Lenis({ ...OPTIONS, wrapper, content });
			onReady?.(lenis);
		};

		update();
		media.addEventListener('change', update);
		return () => {
			media.removeEventListener('change', update);
			lenis?.destroy();
			onReady?.(null);
		};
	};
}
