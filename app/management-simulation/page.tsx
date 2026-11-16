"use client";
import { useState } from "react";
import { simulationScenarios } from "@/lib/content/dashboardConfigs";

export default function ManagementSimulationPage() {
  const [activeId, setActiveId] = useState(simulationScenarios[0].id);
  const active = simulationScenarios.find((s) => s.id === activeId)!;

  const rows: [string, string][] = [
    ["Problem", active.problem], ["Relevant Data", active.relevantData], ["Analysis", active.analysis],
    ["Root Cause", active.rootCause], ["Business Impact", active.businessImpact],
    ["Recommendation", active.recommendation], ["Expected KPI Effect", active.expectedKpiEffect],
  ];

  return (
    <>
      <div className="wrap" style={{ padding: "48px 0 24px", borderBottom: "1px solid var(--border)" }}>
        <div className="eyebrow">Management Simulation</div>
        <h1 style={{ fontSize: 32 }}>How I&apos;d approach six common business problems</h1>
        <p className="lede" style={{ marginTop: 10 }}>Pick a scenario to see the problem, the data I&apos;d pull, the analysis, and the recommendation.</p>
      </div>
      <section className="wrap" style={{ padding: "32px 0 90px", display: "grid", gridTemplateColumns: "260px 1fr", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {simulationScenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className="btn"
              style={{
                justifyContent: "flex-start", textAlign: "left",
                background: activeId === s.id ? "var(--accent-soft)" : "transparent",
                border: `1px solid ${activeId === s.id ? "var(--accent)" : "var(--border)"}`,
                color: activeId === s.id ? "var(--text)" : "var(--text-dim)",
              }}
            >
              {s.title}
            </button>
          ))}
        </div>
        <div className="card" style={{ gap: 20 }}>
          <h2 style={{ fontSize: 20 }}>{active.title}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {active.kpis.map((k) => <span key={k} className="tag">{k}</span>)}
          </div>
          {rows.map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
              <p style={{ fontSize: 14, color: "var(--text-dim)" }}>{val}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
