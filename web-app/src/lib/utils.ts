// tailwind-variants already bundles a Tailwind class merger, so reuse it instead of shipping a second one.
export { cn } from 'tailwind-variants';

// Prop helper types used by the shadcn-svelte components in #lib/components/ui.
/* eslint-disable @typescript-eslint/no-explicit-any */
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
