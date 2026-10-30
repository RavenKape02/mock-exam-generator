// Pixel sizes of the question figures in static/figures, so images reserve their space before they
// load. Add a row here when a figure is added.

const FIGURE_SIZES: Record<string, [number, number]> = {
	'figures/upcat-math-0045.webp': [1180, 692],
	'figures/upcat-sci-0005.webp': [580, 430],
	'figures/upcat-sci-0034.webp': [750, 360]
};

export function figureSize(path: string): { width: number; height: number } {
	const [width, height] = FIGURE_SIZES[path] ?? [800, 500];
	return { width, height };
}
