export const GEO_COMPETITOR_KIND_VALUES = ["direct", "indirect"] as const;
export const GEO_CONTENT_SUBTYPE_VALUES = ["guide", "comparison", "listicle", "how-to", "faq", "alternatives"] as const;
export const GEO_BRIEF_SOURCE_KIND_VALUES = ["manual", "gap", "prompt", "search_console"] as const;
export const GEO_TRAFFIC_VISITOR_TYPE_VALUES = ["crawler", "ai_referral"] as const;
export const GEO_TRAFFIC_CATEGORY_VALUES = ["training-crawler", "search-index", "assistant-browse"] as const;

export const GEO_MAX_COMPETITORS = 25;
export const GEO_COMPETITOR_MAX_SYNONYMS = 8;
export const GEO_MAX_ENGINES = 64;
export const GEO_SEQUENCE_MAX_TURNS = 5;
export const GEO_SCAN_INTERVAL_HOURS = [24, 48, 72, 168, 336, 720] as const;
export const GEO_CSV_IMPORT_MAX_LENGTH = 1024 * 1024;
export const GEO_LONG_RUNNING_TIMEOUT_MS = 300_000;
