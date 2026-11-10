const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat("en");

export function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "–";
  return Math.abs(value) >= 10_000 ? compact.format(value) : whole.format(Math.round(value));
}

export function formatPercent(value: number | null | undefined, fraction = true): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "–";
  const percent = fraction ? value * 100 : value;
  return `${percent >= 10 || percent === 0 ? Math.round(percent) : percent.toFixed(1)}%`;
}

export function formatMs(value: number | null | undefined): string {
  if (value === null || value === undefined) return "–";
  return value >= 1000 ? `${(value / 1000).toFixed(1)}s` : `${Math.round(value)}ms`;
}

export function formatDay(day: string): string {
  const date = new Date(`${day.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return day;
  return date.toLocaleDateString("en", { month: "short", day: "numeric", timeZone: "UTC" });
}

export function change(current: number, previous: number | null | undefined): number | null {
  if (previous === null || previous === undefined || previous === 0) return null;
  return (current - previous) / previous;
}

export function sortedDays(days: Iterable<string>): string[] {
  return [...new Set(days)].sort();
}

export function sumBy<T>(items: readonly T[], value: (item: T) => number): number {
  return items.reduce((total, item) => total + value(item), 0);
}

export function titleCase(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}

const ENGINE_WORDS: Record<string, string> = {
  gpt: "GPT",
  claude: "Claude",
  gemini: "Gemini",
  sonar: "Sonar",
  perplexity: "Perplexity",
  grok: "Grok",
  llama: "Llama",
  deepseek: "DeepSeek",
  mistral: "Mistral",
  copilot: "Copilot",
};

export function engineLabel(engine: string): string {
  const model = engine.includes("/") ? engine.slice(engine.indexOf("/") + 1) : engine;
  const grounded = model.endsWith("-grounded");
  const words = model
    .replace(/-grounded$/, "")
    .split("-")
    .filter(Boolean);
  const label = words
    .map((word, index) => {
      const known = ENGINE_WORDS[word.toLowerCase()];
      if (known === "GPT" && words[index + 1] && /^\d/.test(words[index + 1])) return "GPT";
      return known ?? (/^\d/.test(word) ? word : word.charAt(0).toUpperCase() + word.slice(1));
    })
    .join(" ")
    .replace(/^GPT (\d)/, "GPT-$1");
  return grounded ? `${label} (search)` : label;
}
