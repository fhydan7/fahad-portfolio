import { TrendingUp, TrendingDown } from "lucide-react";
import type { KpiCardData } from "@/lib/kpi/engine";

function formatValue(v: number, unit: string, decimals?: number) {
  if (!isFinite(v)) return "—";
  const dp = decimals ?? (unit === "%" ? 1 : 0);
  const n = v.toLocaleString(undefined, { minimumFractionDigits: dp, maximumFractionDigits: dp });
  if (unit === "%") return `${n}%`;
  if (unit === "SAR") return `SAR ${n}`;
  if (unit === "count" || unit === "") return n;
  return `${n} ${unit}`;
}

export function KpiCard({ kpi }: { kpi: KpiCardData }) {
  return (
    <div className="card" style={{ gap: 8 }}>
      <div style={{ fontSize: 12, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{kpi.label}</div>
      <div className="mono" style={{ fontSize: 24, color: "var(--text)" }}>{formatValue(kpi.value, kpi.unit, kpi.decimals)}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
        <span className={`status-pill ${kpi.status}`}>
          <span className={`status-dot ${kpi.status}`} />
          {kpi.status === "pos" ? "On Track" : kpi.status === "warn" ? "Watch" : "Off Track"}
        </span>
        {typeof kpi.trendPct === "number" && (
          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, color: kpi.trendPct >= 0 ? "var(--pos)" : "var(--neg)" }}>
            {kpi.trendPct >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(kpi.trendPct).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}
