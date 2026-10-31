import LayoutGrid from '@lucide/svelte/icons/layout-grid';
import FilePlus from '@lucide/svelte/icons/file-plus-2';
import History from '@lucide/svelte/icons/history';
import TrendingUp from '@lucide/svelte/icons/trending-up';
import Library from '@lucide/svelte/icons/library';
import Layers from '@lucide/svelte/icons/layers';
import Workflow from '@lucide/svelte/icons/workflow';
import { resolve } from '$app/paths';
import type { Component } from 'svelte';

export type ShellVariant = 'student' | 'admin';

export interface NavItem {
	label: string;
	/** Shorter label for the phone tab bar */
	short: string;
	/** Pathname without slashes, used to find the active item */
	path: string;
	href: string;
	icon: Component;
}

export const NAV: Record<ShellVariant, NavItem[]> = {
	student: [
		{ label: 'Dashboard', short: 'Home', path: 'app', href: resolve('app'), icon: LayoutGrid },
		{
			label: 'New exam',
			short: 'New exam',
			path: 'app/exams/new',
			href: resolve('app/exams/new'),
			icon: FilePlus
		},
		{
			label: 'History',
			short: 'History',
			path: 'app/exams',
			href: resolve('app/exams'),
			icon: History
		},
		{
			label: 'Progress',
			short: 'Progress',
			path: 'app/progress',
			href: resolve('app/progress'),
			icon: TrendingUp
		}
	],
	admin: [
		{
			label: 'Overview',
			short: 'Overview',
			path: 'admin',
			href: resolve('admin'),
			icon: LayoutGrid
		},
		{
			label: 'Question bank',
			short: 'Bank',
			path: 'admin/bank',
			href: resolve('admin/bank'),
			icon: Library
		},
		{
			label: 'Ready pool',
			short: 'Pool',
			path: 'admin/pool',
			href: resolve('admin/pool'),
			icon: Layers
		},
		{
			label: 'Runs',
			short: 'Runs',
			path: 'admin/runs',
			href: resolve('admin/runs'),
			icon: Workflow
		}
	]
};

// Home pages and "New exam" own only their exact path; the rest own their sub-pages too.
const EXACT = new Set(['app', 'admin', 'app/exams/new']);

/** Path of the nav item a page belongs to when its own path doesn't say (admin question pages). */
function section(path: string): string {
	const question = path.match(/^admin\/questions\/([^/]+)/);
	if (question) return question[1].startsWith('pool-') ? 'admin/pool' : 'admin/bank';
	return path;
}

/** Index of the nav item that owns this pathname, or -1 (e.g. Settings, which has its own button). */
export function activeIndex(items: NavItem[], pathname: string): number {
	const path = section(pathname.replace(/^\/+|\/+$/g, ''));
	let best = -1;
	let bestLength = -1;
	items.forEach((item, i) => {
		const owns = EXACT.has(item.path)
			? path === item.path
			: path === item.path || path.startsWith(item.path + '/');
		if (owns && item.path.length > bestLength) {
			best = i;
			bestLength = item.path.length;
		}
	});
	return best;
}
