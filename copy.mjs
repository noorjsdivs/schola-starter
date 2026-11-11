#!/usr/bin/env node
// Copies one chapter's files from this pack into your project, at the same paths.
//
//   node copy.mjs <chapter> <your-project-folder>
//   node copy.mjs 48 ../schola
//   node copy.mjs list            (every chapter and what it brings)
//
// No dependencies; works on macOS, Linux and Windows with Node 22+.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(readFileSync(join(HERE, 'manifest.json'), 'utf8'));
const [chapter, target] = process.argv.slice(2);

if (!chapter || chapter === 'list' || chapter === '--help') {
  console.log('Chapters that copy files from this pack:\n');
  for (const [n, { title, files }] of Object.entries(manifest)) {
    console.log(`  ${n.padStart(2, ' ')}  ${title}  (${files.length} file${files.length === 1 ? '' : 's'})`);
  }
  console.log('\nUsage: node copy.mjs <chapter> <your-project-folder>');
  process.exit(chapter ? 0 : 1);
}

const entry = manifest[String(Number(chapter))];
if (!entry) {
  console.error(`Chapter ${chapter} doesn't copy anything from the pack. Run "node copy.mjs list".`);
  process.exit(1);
}
if (!target) {
  console.error('Tell me where your project is: node copy.mjs <chapter> <your-project-folder>');
  process.exit(1);
}
const root = resolve(target);
if (!existsSync(root)) {
  console.error(`${root} doesn't exist. Create your project folder first (chapter 1 starts with an empty one).`);
  process.exit(1);
}

let copied = 0;
for (const file of entry.files) {
  const dest = join(root, file);
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(join(HERE, 'assets', file), dest);
  copied += 1;
  if (entry.files.length <= 12) console.log(`  ✓ ${file}`);
}
console.log(`Chapter ${chapter} · ${entry.title}: copied ${copied} file${copied === 1 ? '' : 's'} into ${root}`);
