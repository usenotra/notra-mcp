#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = path.join(ROOT, ".mcp-use", "build", "manifest.json");
const OUTPUT = path.join(ROOT, "build", "views.json");

execFileSync(
  "pnpm",
  ["exec", "mcp-use", "build", "--entry", "src/views-entry.ts", "--views-dir", "views", "--inline"],
  { cwd: ROOT, stdio: ["ignore", "inherit", "inherit"] },
);

const { views } = JSON.parse(await readFile(MANIFEST, "utf8"));
await mkdir(path.dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, JSON.stringify(views));
console.log(`Wrote ${Object.keys(views).length} views to build/views.json`);
