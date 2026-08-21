import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';
import colors from 'picocolors';

// Настройки лимитов
const CONCURRENCY_LIMIT = 4; // Максимум 4 файла обрабатываются одновременно (защита RAM)

async function imageOptimizer(input = 'src/assets/images/', output = 'dist/images') {
	const startTime = performance.now();

	try {
		if (!existsSync(output)) {
			await fs.mkdir(output, { recursive: true });
		}

		const files = await fs.readdir(input);
		if (files.length === 0) return;

		console.log(colors.cyan(`\n⚡ [vite-image-optimizer] Старт оптимизации изображений (${files.length} шт.)...`));

		let processedCount = 0;
		let totalSavedBytes = 0;

		const worker = async (fileIterator) => {
			for (const file of fileIterator) {
				const fileInputPath = path.join(input, file);
				const fileOutputPath = path.join(output, file);
				const ext = path.extname(file).toLowerCase();

				try {
					if (['.jpg', '.jpeg', '.png'].includes(ext)) {
						const baseName = path.basename(file, ext);
						const fileOutputWebp = path.join(output, `${baseName}.webp`);

						const statBefore = await fs.stat(fileInputPath);
						const sizeBefore = statBefore.size;

						const imageStream = sharp(fileInputPath);
						const operations = [imageStream.clone().webp({ lossless: false, quality: 70 }).toFile(fileOutputWebp)];

						if (ext === '.png') {
							operations.push(imageStream.clone().png({ compressionLevel: 9 }).toFile(fileOutputPath));
						} else {
							operations.push(imageStream.clone().jpeg({ quality: 70 }).toFile(fileOutputPath));
						}

						await Promise.all(operations);

						const statAfterOrig = await fs.stat(fileOutputPath);

						const saved = sizeBefore - statAfterOrig.size;
						if (saved > 0) totalSavedBytes += saved;

						processedCount++;
					} else if (ext === '.svg') {
						await fs.copyFile(fileInputPath, fileOutputPath);
						processedCount++;
					}
				} catch (fileError) {
					console.error(colors.red(`❌ Ошибка обработки файла ${file}:`), fileError.message);
				}
			}
		};

		const fileIterator = files[Symbol.iterator]();
		const workers = Array.from({ length: CONCURRENCY_LIMIT }, () => worker(fileIterator));

		await Promise.all(workers);

		const duration = ((performance.now() - startTime) / 1000).toFixed(2);
		const savedMb = (totalSavedBytes / (1024 * 1024)).toFixed(2);

		console.log(
			colors.green(`✓`) +
				colors.bold(` [vite-image-optimizer]`) +
				colors.gray(` Оптимизировано `) +
				colors.white(processedCount) +
				colors.gray(` файлов за `) +
				colors.cyan(`${duration}s`) +
				colors.gray(`. Сэкономлено: `) +
				colors.green(`${savedMb} MB\n`),
		);
	} catch (error) {
		console.error(colors.red('🚨 Критическая ошибка в плагине оптимизации:'), error);
	}
}

export default function imageOptimizerPlugin(options = {}) {
	return {
		name: 'vite-plugin-image-optimizer',
		apply: 'build',
		async closeBundle() {
			await imageOptimizer(options.input, options.output);
		},
	};
}
