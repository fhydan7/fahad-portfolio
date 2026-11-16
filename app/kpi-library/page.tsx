"use client";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { kpiLibrary, KpiLibraryEntry } from "@/lib/content/kpiLibrary";
import { StatusBadge } from "@/components/ui/DataTable";

const ALL = "All";

export default function KpiLibraryPage() {
  const [query, setQuery] = useState("");
  const [lob, setLob] = useState(ALL);
  const [perspective, setPerspective] = useState(ALL);
  const [selected, setSelected] = useState<KpiLibraryEntry | null>(null);

  const lobs = useMemo(() => [ALL, ...Array.from(new Set(kpiLibrary.map((k) => k.lineOfBusiness)))], []);
  const perspectives = useMemo(() => [ALL, ...Array.from(new Set(kpiLibrary.map((k) => k.bscPerspective)))], []);

  const filtered = kpiLibrary.filter((k) => {
    const q = query.toLowerCase();
    const matchesQuery = !q || k.name.toLowerCase().includes(q) || k.definition.toLowerCase().includes(q) || k.id.toLowerCase().includes(q);
    return matchesQuery && (lob === ALL || k.lineOfBusiness === lob) && (perspective === ALL || k.bscPerspective === perspective);
  });

  return (
    <>
      <div className="wrap" style={{ padding: "48px 0 24px", borderBottom: "1px solid var(--border)" }}>
        <div className="eyebrow">KPI Library</div>
        <h1 style={{ fontSize: 32 }}>KPIs, one shared structure</h1>
        <p className="lede" style={{ marginTop: 10 }}>
          A representative subset of the KPI Library, shown with the same fields used at Meena Health: definition, formula, ownership, and Balanced Scorecard mapping.
        </p>
      </div>

      <section className="wrap" style={{ padding: "24px 0 16px", display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          placeholder="Search KPI name, ID, or definition…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: "1 1 240px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 3, color: "var(--text)", fontSize: 13, padding: "9px 12px" }}
        />
        <select value={lob} onChange={(e) => setLob(e.target.value)} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 3, color: "var(--text)", fontSize: 13, padding: "9px 12px" }}>
          {lobs.map((l) => <option key={l} value={l}>{l === ALL ? "All Business Lines" : l}</option>)}
        </select>
        <select value={perspective} onChange={(e) => setPerspective(e.target.value)} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 3, color: "var(--text)", fontSize: 13, padding: "9px 12px" }}>
          {perspectives.map((p) => <option key={p} value={p}>{p === ALL ? "All BSC Perspectives" : p}</option>)}
        </select>
      </section>

      <section className="wrap" style={{ paddingBottom: 90 }}>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th><th>KPI</th><th>Line of Business</th><th>Perspective</th><th>Direction</th><th>Frequency</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((k) => (
                  <tr key={k.id} onClick={() => setSelected(k)} style={{ cursor: "pointer" }}>
                    <td className="mono">{k.id}</td>
                    <td style={{ color: "var(--text)" }}>{k.name}</td>
                    <td>{k.lineOfBusiness}</td>
                    <td>{k.bscPerspective}</td>
                    <td>{k.direction}</td>
                    <td>{k.frequency}</td>
                    <td><StatusBadge status={k.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filtered.length && <div style={{ padding: 24, color: "var(--text-faint)", fontSize: 13 }}>No KPIs match your search.</div>}
        </div>
      </section>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", justifyContent: "flex-end" }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ width: 440, maxWidth: "90vw", height: "100%", background: "var(--surface)", borderLeft: "1px solid var(--border)", padding: 28, overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="mono" style={{ fontSize: 12, color: "var(--text-faint)" }}>{selected.id}</div>
                <h2 style={{ fontSize: 20 }}>{selected.name}</h2>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}><X size={14} /></button>
            </div>
            <div style={{ display: "grid", gap: 18, marginTop: 20 }}>
              <Field label="Definition" value={selected.definition} />
              <Field label="Business Rationale" value={selected.businessRationale} />
              <Field label="Formula" value={selected.formula} mono />
              <Field label="Unit / Direction" value={`${selected.unit} · ${selected.direction}`} />
              <Field label="Leading or Lagging" value={selected.leadingOrLagging} />
              <Field label="Frequency" value={selected.frequency} />
              <Field label="Owner" value={selected.owner} />
              <Field label="Data Source" value={selected.dataSource} />
              <Field label="Current Baseline" value={selected.currentBaseline} />
              <Field label="Target" value={selected.target} />
              <Field label="Status" value="" custom={<StatusBadge status={selected.status} />} />
              {selected.notes && <Field label="Notes" value={selected.notes} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, value, mono, custom }: { label: string; value: string; mono?: boolean; custom?: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
      {custom ?? <div style={{ fontSize: 13.5, color: "var(--text-dim)", fontFamily: mono ? "var(--font-plex-mono)" : undefined }}>{value}</div>}
    </div>
  );
}
