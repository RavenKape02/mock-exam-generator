import { runs } from '#lib/data/mock.js';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () => runs.map((r) => ({ id: r.id }));
