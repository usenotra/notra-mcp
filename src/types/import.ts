export type ImportSource<Row> = { rows: Row[]; csv?: never } | { rows?: never; csv: string };
