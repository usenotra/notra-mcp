#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VIEWS = path.join(ROOT, "views");
const NOTRA_REGISTRY = "https://ui.usenotra.com/r";
const SHADCN_REGISTRY = "https://ui.shadcn.com/r/styles/base-nova";
const ITEMS = [`${NOTRA_REGISTRY}/card.json`, `${NOTRA_REGISTRY}/notra-table.json`];
const ICONS = { Loader2Icon: "Loading03Icon" };

function itemUrl(name) {
  return name.startsWith("https://") ? name : `${SHADCN_REGISTRY}/${name}.json`;
}

function targetPath(file) {
  if (file.target) return file.target;
  return `components/ui/${path.basename(file.path)}`;
}

function rewrite(content) {
  if (content.includes("IconPlaceholder")) {
    content = content.replace('React.ComponentProps<"svg">', 'Omit<React.ComponentProps<"svg">, "strokeWidth">');
  }
  return content
    .replace(/^"use client";?\n+/, "")
    .replace(/import \{ IconPlaceholder \} from "[^"]+"\n/, () => {
      return 'import { HugeiconsIcon } from "@hugeicons/react"\nimport { Loading03Icon } from "@hugeicons/core-free-icons"\n';
    })
    .replace(/<IconPlaceholder\s+lucide="(\w+)"/g, (_match, lucide) => {
      return `<HugeiconsIcon icon={${ICONS[lucide] ?? lucide}} strokeWidth={2}`;
    })
    .replace(/\s+(tabler|hugeicons|phosphor|remixicon)="\w+"/g, "");
}

const seen = new Set();
const dependencies = new Set();

async function install(name) {
  const url = itemUrl(name);
  if (seen.has(url)) return;
  seen.add(url);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  const item = await response.json();
  for (const dependency of item.dependencies ?? []) dependencies.add(dependency);
  for (const file of item.files ?? []) {
    const output = path.join(VIEWS, targetPath(file));
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, rewrite(file.content));
    console.log(`${item.name}: ${path.relative(ROOT, output)}`);
  }
  for (const dependency of item.registryDependencies ?? []) await install(dependency);
}

for (const item of ITEMS) await install(item);
console.log(`npm dependencies: ${[...dependencies].join(" ")}`);
