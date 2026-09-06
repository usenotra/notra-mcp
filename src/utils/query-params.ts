import { queryParameterSchema } from "../schemas/api.js";

export function appendQueryParams(url: URL, params: object): void {
  for (const key of Object.keys(params)) {
    const value: unknown = Reflect.get(params, key);
    if (value === undefined) continue;

    const parsed = queryParameterSchema.safeParse(value);
    if (!parsed.success) {
      throw new TypeError(`Unsupported query parameter: ${key}`);
    }
    url.searchParams.set(key, Array.isArray(parsed.data) ? parsed.data.join(",") : String(parsed.data));
  }
}
