// ============================================================
// KPI FORMULA LIBRARY — Section 31 of the brief.
// Every formula is documented here and used by the KPI engine and
// the KPI Library page. No dashboard hard-codes a KPI value.
// ============================================================

export function safeDiv(numerator: number, denominator: number): number {
  if (!denominator) return 0;
  return numerator / denominator;
}

export const formulas = {
  utilizationRate: {
    label: "Utilization Rate",
    formula: "Used Capacity / Available Capacity × 100",
    calc: (used: number, available: number) => safeDiv(used, available) * 100,
  },
  visitCompletionRate: {
    label: "Visit Completion Rate",
    formula: "Completed Visits / Planned Visits × 100",
    calc: (completed: number, planned: number) => safeDiv(completed, planned) * 100,
  },
  revenuePerVisit: {
    label: "Revenue per Visit",
    formula: "Net Revenue / Completed Visits",
    calc: (netRevenue: number, completedVisits: number) => safeDiv(netRevenue, completedVisits),
  },
  costPerVisit: {
    label: "Cost per Visit",
    formula: "Total Cost / Completed Visits",
    calc: (totalCost: number, completedVisits: number) => safeDiv(totalCost, completedVisits),
  },
  contributionMargin: {
    label: "Contribution Margin",
    formula: "Net Revenue − Variable Cost",
    calc: (netRevenue: number, variableCost: number) => netRevenue - variableCost,
  },
  grossMargin: {
    label: "Gross Margin",
    formula: "(Net Revenue − Total Cost) / Net Revenue × 100",
    calc: (netRevenue: number, totalCost: number) => safeDiv(netRevenue - totalCost, netRevenue) * 100,
  },
  noShowRate: {
    label: "No-Show Rate",
    formula: "No-Show Appointments / Booked Appointments × 100",
    calc: (noShow: number, booked: number) => safeDiv(noShow, booked) * 100,
  },
  avgVisitsPerPatient: {
    label: "Average Visits per Patient",
    formula: "Completed Visits / Unique Patients",
    calc: (completedVisits: number, uniquePatients: number) => safeDiv(completedVisits, uniquePatients),
  },
  retentionRate: {
    label: "Retention Rate",
    formula: "Retained Patients / Eligible (Original Cohort) Patients × 100",
    calc: (retained: number, eligible: number) => safeDiv(retained, eligible) * 100,
  },
  referralConversionRate: {
    label: "Referral Conversion Rate",
    formula: "Referrals Converted / Referrals Received × 100",
    calc: (converted: number, received: number) => safeDiv(converted, received) * 100,
  },
  collectionRate: {
    label: "Collection Rate",
    formula: "Collected Amount / Net Revenue × 100",
    calc: (collected: number, netRevenue: number) => safeDiv(collected, netRevenue) * 100,
  },
  slaCompliance: {
    label: "SLA Compliance",
    formula: "SLA-Compliant Journeys / Completed Journeys × 100",
    calc: (compliant: number, completed: number) => safeDiv(compliant, completed) * 100,
  },
  journeyCompletion: {
    label: "Journey Completion Rate",
    formula: "Journeys Completed / Journeys Started × 100",
    calc: (completed: number, started: number) => safeDiv(completed, started) * 100,
  },
  dropOffRate: {
    label: "Drop-Off Rate",
    formula: "(Journeys Started − Journeys Completed) / Journeys Started × 100",
    calc: (started: number, completed: number) => safeDiv(started - completed, started) * 100,
  },
  kpiAchievementRate: {
    label: "KPI Achievement Rate",
    formula: "Actual / Target × 100, averaged across tracked KPIs",
    calc: (actual: number, target: number) => safeDiv(actual, target) * 100,
  },
  budgetUtilization: {
    label: "Budget Utilization",
    formula: "Budget Used / Total Budget × 100",
    calc: (used: number, total: number) => safeDiv(used, total) * 100,
  },
} as const;

export type FormulaKey = keyof typeof formulas;

export function statusFromAchievement(achievementPct: number): "pos" | "warn" | "neg" {
  if (achievementPct >= 95) return "pos";
  if (achievementPct >= 85) return "warn";
  return "neg";
}
export function statusLabel(s: "pos" | "warn" | "neg") {
  return s === "pos" ? "On Track" : s === "warn" ? "Watch" : "Off Track";
}
