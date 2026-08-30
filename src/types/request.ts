export interface RequestOptions<B = Record<string, string | number | boolean | null | undefined>> {
  params?: object;
  body?: B;
  timeoutMs?: number;
}
