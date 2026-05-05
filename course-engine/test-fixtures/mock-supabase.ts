type Row = Record<string, unknown>;

interface QueryResult {
  data: Row | Row[] | null;
  error: { message: string } | null;
}

class MockQueryBuilder {
  private table: string;
  private store: Map<string, Row[]>;
  private filters: Array<(rows: Row[]) => Row[]> = [];
  private selectFields: string = '*';
  private orderField?: string;
  private orderAsc: boolean = true;
  private limitCount?: number;
  private rangeStart?: number;
  private rangeEnd?: number;
  private singleMode: 'single' | 'maybeSingle' | 'none' = 'none';
  private insertData?: Row | Row[];
  private updateData?: Row;
  private isSelect: boolean = false;

  constructor(table: string, store: Map<string, Row[]>) {
    this.table = table;
    this.store = store;
    if (!store.has(table)) store.set(table, []);
  }

  select(fields: string = '*') {
    this.isSelect = true;
    this.selectFields = fields;
    return this;
  }

  insert(data: Row | Row[]) {
    this.insertData = data;
    const rows = Array.isArray(data) ? data : [data];
    const existing = this.store.get(this.table)!;
    existing.push(...rows);
    return this;
  }

  update(data: Row) {
    this.updateData = data;
    return this;
  }

  eq(field: string, value: unknown) {
    this.filters.push((rows) => rows.filter((r) => r[field] === value));
    return this;
  }

  in(field: string, values: unknown[]) {
    this.filters.push((rows) => rows.filter((r) => values.includes(r[field])));
    return this;
  }

  overlaps(field: string, values: unknown[]) {
    this.filters.push((rows) =>
      rows.filter((r) => {
        const arr = r[field] as unknown[];
        if (!Array.isArray(arr)) return false;
        return arr.some((v) => values.includes(v));
      })
    );
    return this;
  }

  is(field: string, value: unknown) {
    this.filters.push((rows) => rows.filter((r) => r[field] === value));
    return this;
  }

  not(field: string, operator: string, value: unknown) {
    this.filters.push((rows) => rows.filter((r) => r[field] !== value));
    return this;
  }

  gte(field: string, value: unknown) {
    this.filters.push((rows) => rows.filter((r) => (r[field] as number) >= (value as number)));
    return this;
  }

  order(field: string, opts?: { ascending?: boolean }) {
    this.orderField = field;
    this.orderAsc = opts?.ascending ?? true;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  range(start: number, end: number) {
    this.rangeStart = start;
    this.rangeEnd = end;
    return this;
  }

  single(): QueryResult {
    this.singleMode = 'single';
    return this.execute();
  }

  maybeSingle(): QueryResult {
    this.singleMode = 'maybeSingle';
    return this.execute();
  }

  then(resolve: (result: QueryResult) => void) {
    resolve(this.execute());
  }

  private execute(): QueryResult {
    if (this.updateData) {
      let rows = this.store.get(this.table)!;
      for (const filter of this.filters) {
        rows = filter(rows);
      }
      for (const row of rows) {
        Object.assign(row, this.updateData);
      }
      return { data: null, error: null };
    }

    if (this.insertData && this.isSelect) {
      const inserted = Array.isArray(this.insertData) ? this.insertData : [this.insertData];
      const last = inserted[inserted.length - 1];
      if (this.singleMode !== 'none') {
        return { data: last, error: null };
      }
      return { data: inserted, error: null };
    }

    if (this.insertData && !this.isSelect) {
      return { data: null, error: null };
    }

    let rows = [...(this.store.get(this.table) ?? [])];

    for (const filter of this.filters) {
      rows = filter(rows);
    }

    if (this.orderField) {
      const field = this.orderField;
      rows.sort((a, b) => {
        const av = a[field] as string | number;
        const bv = b[field] as string | number;
        if (av < bv) return this.orderAsc ? -1 : 1;
        if (av > bv) return this.orderAsc ? 1 : -1;
        return 0;
      });
    }

    if (this.rangeStart !== undefined && this.rangeEnd !== undefined) {
      rows = rows.slice(this.rangeStart, this.rangeEnd + 1);
    }

    if (this.limitCount !== undefined) {
      rows = rows.slice(0, this.limitCount);
    }

    if (this.singleMode === 'single') {
      return { data: rows[0] ?? null, error: rows.length === 0 ? { message: 'Row not found' } : null };
    }

    if (this.singleMode === 'maybeSingle') {
      return { data: rows[0] ?? null, error: null };
    }

    return { data: rows, error: null };
  }
}

export function createMockSupabase() {
  const store = new Map<string, Row[]>();

  const client = {
    from(table: string) {
      return new MockQueryBuilder(table, store);
    },
    _store: store,
    _seed(table: string, rows: Row[]) {
      store.set(table, [...rows]);
    },
    _clear() {
      store.clear();
    },
    _getTable(table: string): Row[] {
      return store.get(table) ?? [];
    },
  };

  return client as unknown as ReturnType<typeof createMockSupabase>;
}

export type MockSupabaseClient = ReturnType<typeof createMockSupabase>;
