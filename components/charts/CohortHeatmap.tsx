function cellColor(pct: number) {
  if (isNaN(pct)) return "transparent";
  const clamped = Math.max(0, Math.min(100, pct));
  const alpha = 0.12 + (clamped / 100) * 0.55;
  return `rgba(74, 155, 142, ${alpha})`; // uses --pos hue
}

export function CohortHeatmap({ matrix }: { matrix: Record<string, string | number>[] }) {
  const months = [0, 1, 2, 3, 4, 5, 6];
  return (
    <div className="card">
      <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 4 }}>Retention Cohort Matrix</div>
      <div style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 10 }}>
        Each row is a monthly acquisition cohort; each cell is the % of that cohort still active N months later.
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Cohort</th>
              <th>New Patients</th>
              {months.map((m) => <th key={m}>Month {m}</th>)}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <td style={{ color: "var(--text)" }}>{row.cohort}</td>
                <td>{row.newPatients}</td>
                {months.map((m) => {
                  const val = row[`m${m}`] as number;
                  return (
                    <td key={m} style={{ background: cellColor(val), color: "var(--text)", fontFamily: "var(--font-plex-mono)" }}>
                      {isNaN(val) ? "—" : `${val.toFixed(0)}%`}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
