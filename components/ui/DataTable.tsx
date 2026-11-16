export interface Column<T> { key: string; label: string; render?: (row: T) => React.ReactNode; }

export function DataTable<T>({ columns, rows }: { columns: Column<T>[]; rows: T[] }) {
  if (!rows.length) return <div style={{ color: "var(--text-faint)", fontSize: 13, padding: 20 }}>No records match the current filters.</div>;
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="data-table">
        <thead>
          <tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c.key}>{c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? "—")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const cls = status === "On Track" || status === "Completed" || status === "Closed" ? "pos"
    : status === "Watch" || status === "At Risk" || status === "In Progress" || status === "Open" ? "warn"
    : status === "Off Track" || status === "Delayed" ? "neg" : "build";
  return <span className={`status-pill ${cls}`}><span className={`status-dot ${cls}`} />{status}</span>;
}
