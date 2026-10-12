export interface RequestTimeoutOptions {
  timeoutMs?: number;
  signal?: AbortSignal;
}

export interface RequestOptions<
  B = Record<string, string | number | boolean | null | undefined>,
> extends RequestTimeoutOptions {
  params?: object;
  body?: B;
  /** Skip the selected workspace header, for endpoints that work without one. */
  withoutOrganization?: boolean;
}

export type RequestScope = {
  signal?: AbortSignal;
};
