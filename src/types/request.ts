export interface RequestTimeoutOptions {
  timeoutMs?: number;
  signal?: AbortSignal;
}

export interface RequestOptions<
  B = Record<string, string | number | boolean | null | undefined>,
> extends RequestTimeoutOptions {
  params?: object;
  body?: B;
}

export type RequestScope = {
  signal?: AbortSignal;
};
