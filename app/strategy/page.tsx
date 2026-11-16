import { defaultFilters } from "@/lib/data/filters";
import { executiveStrategyData } from "@/lib/kpi/engine";
import { BarComparisonChart } from "@/components/charts/ChartCard";
import { DataTable, StatusBadge } from "@/components/ui/DataTable";
import Link from "next/link";

export const metadata = { title: "Strategy" };

const flow = ["Vision", "Strategic Priority", "Strategic Objective", "Initiative", "KPI", "Target", "Performance", "Management Action"];

export default function StrategyPage() {
  const d = executiveStrategyData(defaultFilters);
  return (
    <>
      <div className="wrap" style={{ padding: "48px 0 32px", borderBottom: "1px solid var(--border)" }}>
        <div className="eyebrow">Strategy Command Center</div>
        <h1 style={{ fontSize: 34 }}>From vision to management action</h1>
        <p className="lede" style={{ marginTop: 12 }}>
          A working demonstration of how I connect strategy to KPIs, targets, performance and management action — built on synthetic data.
        </p>
      </div>

      <section className="wrap" style={{ padding: "40px 0" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {flow.map((f, i) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="tag" style={{ background: "var(--surface)" }}>{f}</span>
              {i < flow.length - 1 && <span style={{ color: "var(--text-faint)" }}>→</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: 40 }}>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Balanced Scorecard</h2>
        <BarComparisonChart
          title="KPI Achievement by Perspective"
          meaning="Average achievement rate (actual / target × 100) for KPIs tracked under each Balanced Scorecard perspective, last 12 months."
          data={d.perspectiveScores.map((p) => ({ name: p.perspective, Score: p.score }))}
          series={["Score"]}
          layout="horizontal"
        />
      </section>

      <section className="wrap" style={{ paddingBottom: 90 }}>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Initiative Portfolio</h2>
        <div className="card">
          <DataTable
            columns={[
              { key: "name", label: "Initiative" }, { key: "priority", label: "Strategic Priority" },
              { key: "objective", label: "Objective" }, { key: "owner", label: "Owner" },
              { key: "progress", label: "Progress", render: (r) => `${r.progress}%` },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
              { key: "expectedBenefit", label: "Expected Benefit" },
            ]}
            rows={d.initiatives}
          />
        </div>
        <p style={{ fontSize: 12.5, color: "var(--text-faint)", marginTop: 12 }}>
          Risks and corrective actions per initiative: see the Management Insights panel on the{" "}
          <Link href="/dashboard-lab/executive-strategy" style={{ color: "var(--accent)" }}>Executive Strategy Dashboard</Link>.
        </p>
      </section>
    </>
  );
}
