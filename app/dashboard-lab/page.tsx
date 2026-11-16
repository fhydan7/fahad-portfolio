"use client";
import Link from "next/link";
import { dashboardConfigs } from "@/lib/content/dashboardConfigs";
import { useFilters } from "@/components/dashboard/FilterContext";
import {
  executiveStrategyData, healthcareExecutiveData, homeHealthcareData, patientRetentionData,
  revenueProfitabilityData, capacityUtilizationData, patientJourneyData, businessAnalysisData,
  initiativesDashboardData, workforceData, dataQualityData,
} from "@/lib/kpi/engine";
import type { KpiCardData } from "@/lib/kpi/engine";

function computeKpis(slug: string, filters: ReturnType<typeof useFilters>["filters"]): KpiCardData[] {
  switch (slug) {
    case "executive-strategy": return executiveStrategyData(filters).kpis;
    case "healthcare-executive": return healthcareExecutiveData(filters).kpis;
    case "home-healthcare": return homeHealthcareData(filters).kpis;
    case "patient-retention": return patientRetentionData(filters).kpis;
    case "revenue-profitability": return revenueProfitabilityData(filters).kpis;
    case "capacity-utilization": return capacityUtilizationData(filters).kpis;
    case "patient-journey": return patientJourneyData(filters).kpis;
    case "business-analysis": return businessAnalysisData().kpis;
    case "initiatives": return initiativesDashboardData().kpis;
    case "workforce": return workforceData(filters).kpis;
    case "data-quality": return dataQualityData(filters).kpis;
    default: return [];
  }
}

export default function DashboardLabIndex() {
  const { filters } = useFilters();
  return (
    <section className="cockpit-body" style={{ paddingTop: 20, paddingBottom: 40 }}>
      <div className="eyebrow">Dashboard Lab</div>
      <h1 style={{ fontSize: 30, marginBottom: 8 }}>See My Analytics in Action</h1>
      <p className="lede" style={{ marginBottom: 32 }}>
        Every KPI below is calculated live from a deterministic synthetic dataset (24 months, seasonality, regional
        differences, and deliberate performance dips included) — nothing here is hard-coded. Use the filter bar above
        to change the period, business line, region, location, department, or service.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
        {dashboardConfigs.map((d) => {
          const kpis = computeKpis(d.slug, filters).filter((k) => d.keyKpiIds.includes(k.id)).slice(0, 3);
          return (
            <Link key={d.slug} href={`/dashboard-lab/${d.slug}`} className="card" style={{ textDecoration: "none" }}>
              <span className="card-tag">Dashboard</span>
              <h3 style={{ fontSize: 16.5, fontWeight: 600 }}>{d.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-dim)" }}>{d.businessQuestion}</p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 6 }}>
                {kpis.map((k) => (
                  <div key={k.id} style={{ fontSize: 12.5 }}>
                    <div className="mono" style={{ fontSize: 15, color: "var(--text)" }}>
                      {k.unit === "%" ? `${k.value.toFixed(1)}%` : k.unit === "SAR" ? `SAR ${Math.round(k.value).toLocaleString()}` : Math.round(k.value).toLocaleString()}
                    </div>
                    <div style={{ color: "var(--text-faint)" }}>{k.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "auto", paddingTop: 10, borderTop: "1px solid var(--border)", fontSize: 12.5, color: "var(--accent)" }}>
                View Dashboard →
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
