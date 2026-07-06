#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, rmSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Must match the Version returned by /System/Info in server/mockJellyfin.js.
const JELLYFIN_IMAGE = 'jellyfin/jellyfin:10.10.7';
const CONTAINER_NAME = 'anvilcss-jf-web-extract';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const destDir = path.join(__dirname, '..', 'server', 'jellyfin-web');

function run(args) {
  console.log(`> docker ${args.join(' ')}`);
  execFileSync('docker', args, { stdio: 'inherit' });
}

try {
  execFileSync('docker', ['rm', '-f', CONTAINER_NAME], { stdio: 'ignore' });
} catch {
  // No leftover container from a previous run — fine.
}

console.log(`Vendoring jellyfin-web from ${JELLYFIN_IMAGE}...`);
run(['create', '--name', CONTAINER_NAME, JELLYFIN_IMAGE]);

if (existsSync(destDir)) rmSync(destDir, { recursive: true, force: true });
mkdirSync(path.dirname(destDir), { recursive: true });

run(['cp', `${CONTAINER_NAME}:/jellyfin/jellyfin-web`, destDir]);
run(['rm', CONTAINER_NAME]);

console.log(`Done. Vendored jellyfin-web into ${destDir}`);
