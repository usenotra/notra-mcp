export type Theme = "light" | "dark";

type Swatch = { light: string; dark: string };

export const PRIMARY: Swatch = { light: "#8B5CF6", dark: "#9C87E3" };
export const SECONDARY: Swatch = { light: "#18929F", dark: "#20ABBA" };
export const REFERRAL: Swatch = { light: "#E89A1C", dark: "#FFB547" };
export const MUTED: Swatch = { light: "#8A8A94", dark: "#9A9AA4" };

export const SERIES: Swatch[] = [
  PRIMARY,
  SECONDARY,
  REFERRAL,
  { light: "#358FF3", dark: "#5AA6F6" },
  { light: "#1FA85B", dark: "#3ED187" },
  { light: "#DB3FA3", dark: "#F062BE" },
  { light: "#DC4343", dark: "#F06A6A" },
  { light: "#B68F3C", dark: "#DAB15E" },
  { light: "#6B6B75", dark: "#9A9AA4" },
];

export const SENTIMENT = {
  positive: { light: "#2F855A", dark: "#4CB07D" },
  neutral: { light: "#D4D4D8", dark: "#52525B" },
  negative: { light: "#D8402F", dark: "#EF7566" },
};

export function pick(swatch: Swatch, theme: Theme): string {
  return swatch[theme];
}

export function seriesColor(index: number, theme: Theme): string {
  return SERIES[index % SERIES.length][theme];
}
