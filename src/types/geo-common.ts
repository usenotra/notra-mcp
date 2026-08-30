export type GeoScanStatus = "running" | "completed" | "failed";

export interface GeoWindowParams {
  days?: number;
  from?: string;
  to?: string;
}

export interface GeoImportIssue {
  line: number;
  message: string;
}
