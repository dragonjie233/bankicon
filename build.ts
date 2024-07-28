import {
	importDirectory,
	exportJSONPackage,
	cleanupSVG,
	runSVGO
} from '@iconify/tools';

(async () => {
	const iconSet = await importDirectory('svg', {
		prefix: 'bankicon'
	});

	await iconSet.forEach(async (name, type) => {
		if (type !== 'icon') {
			return;
		}

		const svg = iconSet.toSVG(name);
		if (!svg) {
			iconSet.remove(name);
			return;
		}

		try {
			cleanupSVG(svg);
			runSVGO(svg);
		} catch (err) {
			console.error(`Error parsing ${name}:`, err);
			iconSet.remove(name);
			return;
		}

		iconSet.fromSVG(name, svg);
	});

	iconSet.info = {
		name: 'bankicon',
		category: 'bank',
		total: Object.keys(iconSet.export().icons).length,
		author: {
			name: 'pluwen',
			url: 'https://www.figma.com/community/file/865778936829514703'
		},
		license: {
			title: 'CC BY 4.0',
			url: 'https://creativecommons.org/licenses/by/4.0/'
		}
	};

	await exportJSONPackage(iconSet, {
		target: 'output/bankicon',
		package: {
			name: `@iconify-json/${iconSet.prefix}`,
			version: '1.0.0',
		},
		cleanup: true,
	});
})();