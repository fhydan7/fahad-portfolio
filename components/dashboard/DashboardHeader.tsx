"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Download, Info } from "lucide-react";

export function DashboardHeader({
  title, description, businessQuestion, sql, technicalNotes,
}: { title: string; description: string; businessQuestion: string; sql: string; technicalNotes: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="cockpit-header">
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1 style={{ fontSize: 19, fontWeight: 600, whiteSpace: "nowrap" }}>{title}</h1>
          <span
            title={businessQuestion}
            style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-faint)", cursor: "help" }}
          >
            <Info size={12} /> {businessQuestion}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", position: "relative" }}>
        <span style={{ fontSize: 10.5, color: "var(--text-faint)" }}>Synthetic data · refreshed on load</span>
        <button className="btn btn-ghost btn-sm" onClick={() => window.print()}><Download size={12} /></button>
        <button onClick={() => setOpen((o) => !o)} className="btn btn-ghost btn-sm">
          {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />} Technical
        </button>
        {open && (
          <div className="card" style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 380, zIndex: 20, gap: 8 }}>
            <div style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{description}</div>
            <pre className="mono" style={{ fontSize: 11, color: "var(--text-dim)", overflowX: "auto", whiteSpace: "pre-wrap", margin: 0 }}>{sql}</pre>
            <p style={{ fontSize: 12, color: "var(--text-dim)", margin: 0 }}>{technicalNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
