import { Lightbulb } from "lucide-react";
import type { Insight } from "@/lib/kpi/engine";

export function InsightPanel({ insights }: { insights: Insight[] }) {
  if (!insights.length) return null;
  return (
    <div className="card" style={{ gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14.5, fontWeight: 600 }}>
        <Lightbulb size={16} color="var(--accent)" /> Management Insights
      </div>
      <div style={{ display: "grid", gap: 14 }}>
        {insights.map((ins, i) => (
          <div key={i} style={{ borderLeft: "2px solid var(--accent)", paddingLeft: 14 }}>
            <div style={{ fontSize: 13.5, color: "var(--text)", marginBottom: 6 }}>{ins.observation}</div>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "3px 8px", fontSize: 12.5 }}>
              <span style={{ color: "var(--text-faint)" }}>Driver</span><span style={{ color: "var(--text-dim)" }}>{ins.driver}</span>
              <span style={{ color: "var(--text-faint)" }}>Impact</span><span style={{ color: "var(--text-dim)" }}>{ins.impact}</span>
              <span style={{ color: "var(--text-faint)" }}>Action</span><span style={{ color: "var(--text-dim)" }}>{ins.action}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
