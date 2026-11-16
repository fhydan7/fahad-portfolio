"use client";
import { useParams, notFound } from "next/navigation";
import { dashboardConfigs } from "@/lib/content/dashboardConfigs";
import { useFilters } from "@/components/dashboard/FilterContext";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { InsightPanel } from "@/components/dashboard/InsightPanel";
import { GaugeChart } from "@/components/dashboard/GaugeChart";
import { KpiCard } from "@/components/ui/KpiCard";
import { TrendChartCard, BarComparisonChart, FunnelChartCard } from "@/components/charts/ChartCard";
import { CohortHeatmap } from "@/components/charts/CohortHeatmap";
import { DataTable, StatusBadge } from "@/components/ui/DataTable";
import type { KpiCardData } from "@/lib/kpi/engine";
import {
  executiveStrategyData, healthcareExecutiveData, homeHealthcareData, patientRetentionData,
  revenueProfitabilityData, capacityUtilizationData, patientJourneyData, businessAnalysisData,
  initiativesDashboardData, workforceData, dataQualityData,
} from "@/lib/kpi/engine";

const chartGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14, marginBottom: 14 };
const kpiRow: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 14 };

function GaugeRow({ kpis }: { kpis: KpiCardData[] }) {
  const gauges = kpis.filter((k) => k.unit === "%").slice(0, 4);
  const rest = kpis.filter((k) => !gauges.includes(k));
  if (!gauges.length) return <div style={kpiRow}>{kpis.map((k) => <KpiCard key={k.id} kpi={k} />)}</div>;
  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 14, alignItems: "stretch" }}>
      <div className="card" style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "space-around", flex: "1 1 340px" }}>
        {gauges.map((k) => (
          <GaugeChart key={k.id} label={k.label} value={k.value} unit="%" size={100} />
        ))}
      </div>
      <div style={{ ...kpiRow, marginBottom: 0, flex: "1 1 260px", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))" }}>
        {rest.map((k) => <KpiCard key={k.id} kpi={k} />)}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const params = useParams<{ slug: string }>();
  const config = dashboardConfigs.find((d) => d.slug === params.slug);
  const { filters } = useFilters();
  if (!config) return notFound();

  let body: React.ReactNode = null;

  if (config.slug === "executive-strategy") {
    const d = executiveStrategyData(filters);
    body = (
      <>
        <GaugeRow kpis={d.kpis} />
        <div style={chartGrid}>
          <TrendChartCard title="KPI Achievement Trend" meaning="Average achievement across tracked strategic KPIs." data={d.trend} series={["Achievement"]} />
          <BarComparisonChart title="Balanced Scorecard — Perspective Scores" meaning="Achievement rate by BSC perspective." data={d.perspectiveScores.map((p) => ({ name: p.perspective, Score: p.score }))} series={["Score"]} layout="horizontal" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 14 }}>
          <div className="card" style={{ maxHeight: 260, overflowY: "auto" }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 8 }}>Initiative Portfolio</div>
            <DataTable
              columns={[
                { key: "name", label: "Initiative" }, { key: "owner", label: "Owner" },
                { key: "progress", label: "Progress", render: (r) => `${r.progress}%` },
                { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
              ]}
              rows={d.initiatives}
            />
          </div>
          <div style={{ maxHeight: 260, overflowY: "auto" }}><InsightPanel insights={d.insights} /></div>
        </div>
      </>
    );
  } else if (config.slug === "healthcare-executive") {
    const d = healthcareExecutiveData(filters);
    body = (
      <>
        <GaugeRow kpis={d.kpis} />
        <div style={chartGrid}>
          <TrendChartCard title="Monthly Trend" meaning="Completed visits and net revenue by month." data={d.monthlyTrend} series={["Visits", "Revenue (k SAR)"]} />
          <BarComparisonChart title="Business Line" meaning="Completed visits by business line." data={d.byLine} series={["Visits"]} />
          <BarComparisonChart title="Location" meaning="Revenue by branch." data={d.byLocation} series={["Revenue (k SAR)"]} layout="horizontal" />
        </div>
        <div style={{ maxHeight: 220, overflowY: "auto" }}><InsightPanel insights={d.insights} /></div>
      </>
    );
  } else if (config.slug === "home-healthcare") {
    const d = homeHealthcareData(filters);
    body = (
      <>
        <GaugeRow kpis={d.kpis} />
        <div style={chartGrid}>
          <TrendChartCard title="Completion & Utilization" meaning="Monthly trend." data={d.trend} series={["Completion Rate %", "Utilization %"]} />
          <BarComparisonChart title="By Region" meaning="Compared across branches." data={d.byRegion} series={["Completion Rate %", "Utilization %"]} layout="horizontal" />
        </div>
        <div style={{ maxHeight: 220, overflowY: "auto" }}><InsightPanel insights={d.insights} /></div>
      </>
    );
  } else if (config.slug === "patient-retention") {
    const d = patientRetentionData(filters);
    body = (
      <>
        <GaugeRow kpis={d.kpis} />
        <div style={chartGrid}>
          <TrendChartCard title="New vs. Returning" meaning="Monthly split." data={d.newVsReturning} series={["New", "Returning"]} />
          <BarComparisonChart title="Retention by Line" meaning="Repeat-visit rate." data={d.byLine} series={["Retention %"]} layout="horizontal" />
        </div>
        <div style={{ maxHeight: 240, overflowY: "auto" }}><CohortHeatmap matrix={d.matrix} /></div>
      </>
    );
  } else if (config.slug === "revenue-profitability") {
    const d = revenueProfitabilityData(filters);
    body = (
      <>
        <GaugeRow kpis={d.kpis} />
        <div style={chartGrid}>
          <TrendChartCard title="Revenue vs. Cost" meaning="Monthly, in thousands SAR." data={d.monthlyTrend} series={["Net Revenue (k)", "Cost (k)"]} />
          <BarComparisonChart title="By Payer" meaning="Net revenue by payer type." data={d.byPayer} series={["Net Revenue (k)"]} />
          <BarComparisonChart title="By Location" meaning="Net revenue by branch." data={d.byLocation} series={["Net Revenue (k)"]} layout="horizontal" />
        </div>
        <div style={{ maxHeight: 200, overflowY: "auto" }}><InsightPanel insights={d.insights} /></div>
      </>
    );
  } else if (config.slug === "capacity-utilization") {
    const d = capacityUtilizationData(filters);
    body = (
      <>
        <GaugeRow kpis={d.kpis} />
        <div style={chartGrid}>
          <BarComparisonChart title="By Location" meaning="Utilization %." data={d.byLocation} series={["Utilization %"]} layout="horizontal" />
          <BarComparisonChart title="Weekday Pattern" meaning="Modeled demand pattern." data={d.weekdayUtilization.map((w) => ({ name: w.day, "Utilization %": w.utilization }))} series={["Utilization %"]} />
          <BarComparisonChart title="Hourly Pattern" meaning="Modeled demand pattern." data={d.hourlyUtilization.map((h) => ({ name: h.hour, "Utilization %": h.utilization }))} series={["Utilization %"]} />
        </div>
        <div style={{ maxHeight: 200, overflowY: "auto" }}><InsightPanel insights={d.insights} /></div>
      </>
    );
  } else if (config.slug === "patient-journey") {
    const d = patientJourneyData(filters);
    body = (
      <>
        <GaugeRow kpis={d.kpis} />
        <div style={chartGrid}>
          <BarComparisonChart title="Stage Duration" meaning="Avg minutes per stage." data={d.stages.map((s) => ({ name: s.name, Minutes: Math.round(s.value * 10) / 10 }))} series={["Minutes"]} layout="horizontal" />
          <FunnelChartCard title="Journey Funnel" meaning="Patients per stage." data={d.funnel} />
        </div>
        <div style={{ maxHeight: 200, overflowY: "auto" }}><InsightPanel insights={d.insights} /></div>
      </>
    );
  } else if (config.slug === "business-analysis") {
    const d = businessAnalysisData();
    body = (
      <>
        <GaugeRow kpis={d.kpis} />
        <div className="card" style={{ maxHeight: 260, overflowY: "auto", marginBottom: 14 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 8 }}>Current State → Gap → Root Cause → Recommendation</div>
          <DataTable
            columns={[
              { key: "currentState", label: "Current State" }, { key: "gap", label: "Gap" },
              { key: "recommendation", label: "Recommendation" },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
            ]}
            rows={d.items}
          />
        </div>
        <div style={{ maxHeight: 160, overflowY: "auto" }}><InsightPanel insights={d.insights} /></div>
      </>
    );
  } else if (config.slug === "initiatives") {
    const d = initiativesDashboardData();
    body = (
      <>
        <GaugeRow kpis={d.kpis} />
        <div className="card" style={{ maxHeight: 260, overflowY: "auto", marginBottom: 14 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 8 }}>Initiative Portfolio</div>
          <DataTable
            columns={[
              { key: "name", label: "Initiative" },
              { key: "progress", label: "Progress", render: (r) => `${r.progress}%` },
              { key: "status", label: "Status", render: (r) => <StatusBadge status={String(r.status)} /> },
              { key: "dueKey", label: "Due" },
            ]}
            rows={d.initiatives}
          />
        </div>
        <div style={{ maxHeight: 160, overflowY: "auto" }}><InsightPanel insights={d.insights} /></div>
      </>
    );
  } else if (config.slug === "workforce") {
    const d = workforceData(filters);
    body = (
      <>
        <GaugeRow kpis={d.kpis} />
        <div style={chartGrid}>
          <BarComparisonChart title="Headcount by Department" meaning="Average monthly headcount." data={d.byDept} series={["Headcount"]} layout="horizontal" />
        </div>
        <div style={{ maxHeight: 220, overflowY: "auto" }}><InsightPanel insights={d.insights} /></div>
      </>
    );
  } else if (config.slug === "data-quality") {
    const d = dataQualityData(filters);
    body = (
      <>
        <GaugeRow kpis={d.kpis} />
        <div style={chartGrid}>
          <TrendChartCard title="Completeness & Accuracy" meaning="Monthly trend." data={d.trend} series={["Completeness %", "Accuracy %"]} />
          <BarComparisonChart title="By System" meaning="Compared across sources." data={d.bySystem} series={["Completeness %", "Accuracy %"]} layout="horizontal" />
        </div>
        <div style={{ maxHeight: 200, overflowY: "auto" }}><InsightPanel insights={d.insights} /></div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader title={config.title} description={config.description} businessQuestion={config.businessQuestion} sql={config.sql} technicalNotes={config.technicalNotes} />
      <div className="cockpit-body">{body}</div>
    </>
  );
}
