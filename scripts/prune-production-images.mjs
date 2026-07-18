import { copyFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const copiedOriginalsDirectory = path.join(projectRoot, 'dist', 'projects');
const indexPath = path.join(projectRoot, 'dist', 'index.html');
const fallbackPath = path.join(projectRoot, 'dist', '404.html');

await rm(copiedOriginalsDirectory, { force: true, recursive: true });
await copyFile(indexPath, fallbackPath);

console.log('Removed original project images from the production bundle.');
console.log('Created the GitHub Pages SPA fallback.');
