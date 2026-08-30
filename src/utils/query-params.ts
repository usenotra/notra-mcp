export function appendQueryParams(url: URL, params: object): void {
  for (const key of Object.keys(params)) {
    const value: unknown = Reflect.get(params, key);
    if (value === undefined) continue;

    if (Array.isArray(value)) {
      if (!value.every((item) => typeof item === "string")) {
        throw new TypeError(`Unsupported query parameter: ${key}`);
      }
      url.searchParams.set(key, value.join(","));
      continue;
    }

    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      url.searchParams.set(key, String(value));
      continue;
    }

    throw new TypeError(`Unsupported query parameter: ${key}`);
  }
}
