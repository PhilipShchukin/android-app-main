const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const posthtml = require('posthtml');
const inlineAssets = require('posthtml-inline-assets');

// Конфигурация
const config = {
    srcDir: path.join(__dirname, 'out'),
    distDir: path.join(__dirname, 'dist'),
    verbose: true
};

// Утилиты
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

async function processNextJsExport() {
    try {
        // 1. Подготовка директории
        await prepareDirectory(config.distDir);

        // 2. Поиск HTML-файлов
        const htmlFiles = await findHtmlFiles(config.srcDir);
        if (htmlFiles.length === 0) {
            console.error('❌ HTML-файлы не найдены!');
            return;
        }

        console.log(`ℹ️ Найдено ${htmlFiles.length} HTML-файлов`);

        // 3. Обработка каждого файла
        for (const file of htmlFiles) {
            await processHtmlFile(file);
        }

        console.log('\n🎉 Экспорт завершен успешно!');
        console.log(`📁 Результат в папке: ${config.distDir}`);

    } catch (err) {
        console.error('❌ Ошибка:', err);
        process.exit(1);
    }
}

async function prepareDirectory(dir) {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true });
    }
    await mkdir(dir, { recursive: true });
}

async function findHtmlFiles(dir) {
    const items = fs.readdirSync(dir);
    const results = [];

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            results.push(...await findHtmlFiles(fullPath));
        } else if (item.endsWith('.html')) {
            results.push(fullPath);
        }
    }

    return results;
}

async function processHtmlFile(filePath) {
    try {
        const relativePath = path.relative(config.srcDir, filePath);
        console.log(`🔄 Обработка: ${relativePath}`);

        // 1. Чтение файла
        const html = await readFile(filePath, 'utf8');

        // 2. Обработка с posthtml
        const result = await posthtml()
            .use(inlineAssets({
                root: path.dirname(filePath),
                transforms: {
                    script: true,
                    style: true,
                    img: false
                }
            }))
            .process(html);

        // 3. Сохранение результата
        const outputPath = path.join(config.distDir, relativePath);
        await mkdir(path.dirname(outputPath), { recursive: true });
        await writeFile(outputPath, result.html);

        console.log(`✅ Успешно: ${relativePath}`);

    } catch (err) {
        console.error(`❌ Ошибка обработки ${path.basename(filePath)}:`, err.message);
    }
}

// Запуск
processNextJsExport();