import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(ROOT_DIR, 'PROJECT_CODEBASE.md');

const EXCLUDED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.cache',
  'coverage',
  '.vscode',
  '.idea'
]);

const ALLOWED_EXTENSIONS = new Set([
  '.jsx',
  '.js',
  '.css',
  '.json',
  '.html',
  '.svg'
]);

function getLanguageHeader(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jsx': return 'jsx';
    case '.js': return 'javascript';
    case '.json': return 'json';
    case '.css': return 'css';
    case '.html': return 'html';
    case '.svg': return 'xml';
    default: return 'text';
  }
}

function scanAndBuildMarkdown(dirPath, markdownLines = []) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const relPath = path.relative(ROOT_DIR, fullPath);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!EXCLUDED_DIRS.has(item)) {
        scanAndBuildMarkdown(fullPath, markdownLines);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(item).toLowerCase();
      if (ALLOWED_EXTENSIONS.has(ext) && item !== 'PROJECT_CODEBASE.md' && item !== 'package-lock.json') {
        const lang = getLanguageHeader(item);
        const content = fs.readFileSync(fullPath, 'utf-8');

        markdownLines.push(`## File: \`${relPath}\`\n`);
        markdownLines.push(`\`\`\`${lang}`);
        markdownLines.push(content);
        markdownLines.push(`\`\`\`\n`);
      }
    }
  }

  return markdownLines;
}

function generateCodebaseMarkdown() {
  console.log('📦 Bundling codebase into PROJECT_CODEBASE.md...');
  
  const header = [
    `# GrabMyKey Complete Codebase Export`,
    `> Generated on: ${new Date().toLocaleString()}`,
    `\n---\n`
  ];

  const lines = scanAndBuildMarkdown(ROOT_DIR, header);
  fs.writeFileSync(OUTPUT_FILE, lines.join('\n'), 'utf-8');
  console.log(`✅ Codebase successfully exported to: ${OUTPUT_FILE}`);
}

generateCodebaseMarkdown();

