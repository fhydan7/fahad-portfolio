import { Filters, datesInRange, matchesRegion, matchesLine, matchesLocation, matchesService, matchesDept, priorPeriod, pctChange } from "../data/filters";
import {
  factVisits, factAppointments, factRevenue, factCost, factCapacity, weekdayUtilization, hourlyUtilization,
  factReferrals, factPatientJourney, factCohort, factKpiPerformance, bscPerspectives, factInitiatives,
  baTracker, factDataQuality, factWorkforce, dimDate, dimLocation, dimBusinessLine, dimDepartment,
} from "../data/generate";
import { formulas, statusFromAchievement } from "./formulas";

export type Status = "pos" | "warn" | "neg";
export interface KpiCardData {
  id: string; label: string; value: number; unit: string; decimals?: number;
  target?: number; trendPct?: number; status: Status;
}
export interface SeriesPoint { x: string; [k: string]: number | string; }
export interface Insight { observation: string; driver: string; impact: string; action: string; }

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const avg = (arr: number[]) => (arr.length ? sum(arr) / arr.length : 0);

function monthLabel(dateKey: string) {
  return dimDate.find((d) => d.dateKey === dateKey)?.monthLabel ?? dateKey;
}

// ============================================================
// EXECUTIVE STRATEGY DASHBOARD
// ============================================================
export function executiveStrategyData(f: Filters) {
  const dates = datesInRange(f);
  const rows = factKpiPerformance.filter((r) => dates.includes(r.dateKey));
  const prior = priorPeriod(f);
  const priorDates = datesInRange(prior);
  const priorRows = factKpiPerformance.filter((r) => priorDates.includes(r.dateKey));

  const achievement = avg(rows.map((r) => formulas.kpiAchievementRate.calc(r.actual, r.target)));
  const priorAchievement = avg(priorRows.map((r) => formulas.kpiAchievementRate.calc(r.actual, r.target)));

  const perspectiveScores = bscPerspectives.map((p) => {
    const prows = rows.filter((r) => r.perspective === p);
    const score = avg(prows.map((r) => formulas.kpiAchievementRate.calc(r.actual, r.target)));
    return { perspective: p, score: Math.round(score) };
  });

  const initiativesOnTrack = factInitiatives.filter((i) => i.status === "On Track").length;
  const initiativesAtRisk = factInitiatives.filter((i) => i.status === "At Risk").length;
  const initiativesDelayed = factInitiatives.filter((i) => i.status === "Delayed").length;

  const kpis: KpiCardData[] = [
    { id: "achievement", label: "KPI Achievement Rate", value: achievement, unit: "%", decimals: 1, trendPct: pctChange(achievement, priorAchievement), status: statusFromAchievement(achievement) },
    { id: "onTrack", label: "Initiatives On Track", value: initiativesOnTrack, unit: "count", status: "pos" },
    { id: "atRisk", label: "Initiatives At Risk", value: initiativesAtRisk, unit: "count", status: initiativesAtRisk > 0 ? "warn" : "pos" },
    { id: "delayed", label: "Delayed Initiatives", value: initiativesDelayed, unit: "count", status: initiativesDelayed > 0 ? "neg" : "pos" },
  ];

  const trend: SeriesPoint[] = dates.map((dk) => {
    const dayRows = factKpiPerformance.filter((r) => r.dateKey === dk);
    return { x: monthLabel(dk), Achievement: round1(avg(dayRows.map((r) => formulas.kpiAchievementRate.calc(r.actual, r.target)))) };
  });

  const insights: Insight[] = [];
  const worst = [...perspectiveScores].sort((a, b) => a.score - b.score)[0];
  if (worst && worst.score < 90) {
    insights.push({
      observation: `${worst.perspective} is the weakest Balanced Scorecard perspective at ${worst.score}% KPI achievement.`,
      driver: "Internal Process & Governance KPIs dipped during the Q3–Q4 operational decline window seen across the platform.",
      impact: "Strategic objectives tied to this perspective are least likely to hit target this period.",
      action: `Review the initiatives mapped to ${worst.perspective} and reconfirm owners and corrective actions.`,
    });
  }
  if (initiativesDelayed + initiativesAtRisk > 0) {
    insights.push({
      observation: `${initiativesAtRisk + initiativesDelayed} of ${factInitiatives.length} initiatives are At Risk or Delayed.`,
      driver: "Budget utilization and progress are diverging from schedule for these initiatives.",
      impact: "Expected benefits from the initiative portfolio may land later than planned.",
      action: "Prioritize a portfolio review for At Risk / Delayed initiatives in the next management cycle.",
    });
  }
  insights.push({
    observation: `Overall KPI achievement is ${round1(achievement)}% across the selected period.`,
    driver: achievement >= priorAchievement ? "Improved versus the prior period." : "Declined versus the prior period.",
    impact: achievement >= 95 ? "Strategy execution is broadly on track." : "Some strategic objectives are trending below target.",
    action: achievement >= 95 ? "Maintain current management cadence." : "Escalate the lowest-scoring perspective in the next steering committee.",
  });

  return { kpis, perspectiveScores, trend, initiatives: factInitiatives, insights };
}
function round1(n: number) { return Math.round(n * 10) / 10; }

// ============================================================
// HEALTHCARE EXECUTIVE DASHBOARD
// ============================================================
export function healthcareExecutiveData(f: Filters) {
  const dates = datesInRange(f);
  const visits = factVisits.filter((v) => dates.includes(v.dateKey) && matchesRegion(v.region, f) && matchesLine(v.lineKey, f) && matchesLocation(v.locationKey, f) && matchesService(v.serviceKey, f));
  const revenue = factRevenue.filter((r) => dates.includes(r.dateKey) && matchesRegion(r.region, f) && matchesLine(r.lineKey, f) && matchesLocation(r.locationKey, f));
  const appts = factAppointments.filter((a) => dates.includes(a.dateKey) && matchesRegion(a.region, f) && matchesLine(a.lineKey, f) && matchesLocation(a.locationKey, f));
  const capacity = factCapacity.filter((c) => dates.includes(c.dateKey) && matchesRegion(c.region, f) && matchesLocation(c.locationKey, f));

  const prior = priorPeriod(f);
  const priorDates = datesInRange(prior);
  const priorRevenue = factRevenue.filter((r) => priorDates.includes(r.dateKey) && matchesRegion(r.region, f) && matchesLine(r.lineKey, f) && matchesLocation(r.locationKey, f));

  const netRevenue = sum(revenue.map((r) => r.netRevenue));
  const priorNetRevenue = sum(priorRevenue.map((r) => r.netRevenue));
  const totalVisits = sum(visits.map((v) => v.completedVisits));
  const uniquePatients = sum(visits.map((v) => v.uniquePatients));
  const newPatients = sum(visits.map((v) => v.newPatients));
  const returningPatients = sum(visits.map((v) => v.returningPatients));
  const booked = sum(appts.map((a) => a.bookedAppointments));
  const completedAppt = sum(appts.map((a) => a.completedAppointments));
  const noShow = sum(appts.map((a) => a.noShowAppointments));
  const availableCap = sum(capacity.map((c) => c.availableCapacity));
  const usedCap = sum(capacity.map((c) => c.usedCapacity));

  const retentionRate = formulas.retentionRate.calc(returningPatients, uniquePatients);

  const kpis: KpiCardData[] = [
    { id: "revenue", label: "Total Revenue", value: netRevenue, unit: "SAR", trendPct: pctChange(netRevenue, priorNetRevenue), status: netRevenue >= priorNetRevenue ? "pos" : "warn" },
    { id: "revenueGrowth", label: "Revenue Growth", value: pctChange(netRevenue, priorNetRevenue), unit: "%", decimals: 1, status: netRevenue >= priorNetRevenue ? "pos" : "neg" },
    { id: "visits", label: "Total Visits", value: totalVisits, unit: "count", status: "pos" },
    { id: "uniquePatients", label: "Unique Patients", value: uniquePatients, unit: "count", status: "pos" },
    { id: "newPatients", label: "New Patients", value: newPatients, unit: "count", status: "pos" },
    { id: "returningPatients", label: "Returning Patients", value: returningPatients, unit: "count", status: "pos" },
    { id: "retention", label: "Patient Retention Rate", value: retentionRate, unit: "%", decimals: 1, status: statusFromAchievement(retentionRate) },
    { id: "revPerVisit", label: "Revenue per Visit", value: formulas.revenuePerVisit.calc(netRevenue, totalVisits), unit: "SAR", decimals: 0, status: "pos" },
    { id: "utilization", label: "Capacity Utilization", value: formulas.utilizationRate.calc(usedCap, availableCap), unit: "%", decimals: 1, status: statusFromAchievement(formulas.utilizationRate.calc(usedCap, availableCap)) },
    { id: "apptCompletion", label: "Appointment Completion", value: formulas.visitCompletionRate.calc(completedAppt, booked), unit: "%", decimals: 1, status: statusFromAchievement(formulas.visitCompletionRate.calc(completedAppt, booked)) },
    { id: "noShow", label: "No-Show Rate", value: formulas.noShowRate.calc(noShow, booked), unit: "%", decimals: 1, status: formulas.noShowRate.calc(noShow, booked) <= 10 ? "pos" : "neg" },
  ];

  const monthlyTrend: SeriesPoint[] = dates.map((dk) => {
    const dv = visits.filter((v) => v.dateKey === dk);
    const dr = factRevenue.filter((r) => r.dateKey === dk && matchesRegion(r.region, f) && matchesLine(r.lineKey, f) && matchesLocation(r.locationKey, f));
    return { x: monthLabel(dk), Visits: sum(dv.map((v) => v.completedVisits)), "Revenue (k SAR)": round1(sum(dr.map((r) => r.netRevenue)) / 1000) };
  });

  const byLine = dimBusinessLine.map((line) => {
    const lv = visits.filter((v) => v.lineKey === line.lineKey);
    const lr = revenue.filter((r) => r.lineKey === line.lineKey);
    return { name: line.name, Visits: sum(lv.map((v) => v.completedVisits)), "Revenue (k SAR)": round1(sum(lr.map((r) => r.netRevenue)) / 1000) };
  });

  const byLocation = dimLocation.map((loc) => {
    const lv = visits.filter((v) => v.locationKey === loc.locationKey);
    const lr = revenue.filter((r) => r.locationKey === loc.locationKey);
    return { name: loc.name, Visits: sum(lv.map((v) => v.completedVisits)), "Revenue (k SAR)": round1(sum(lr.map((r) => r.netRevenue)) / 1000) };
  });

  const patientMix = [
    { name: "New", value: newPatients },
    { name: "Returning", value: returningPatients },
  ];

  const insights: Insight[] = [];
  const worstLine = [...byLine].sort((a, b) => a.Visits - b.Visits)[0];
  insights.push({
    observation: `${worstLine?.name} has the lowest completed-visit volume of the three business lines in the selected period.`,
    driver: "Lower baseline demand combined with regional mix in the current filter.",
    impact: "Business-line revenue and patient-reach targets for this line are most exposed.",
    action: `Review demand-generation and access for ${worstLine?.name} in the affected regions.`,
  });
  if (formulas.noShowRate.calc(noShow, booked) > 10) {
    insights.push({
      observation: `No-show rate is ${round1(formulas.noShowRate.calc(noShow, booked))}%, above the 10% watch threshold.`,
      driver: "Concentrated in specific branches and months rather than spread evenly.",
      impact: "Booked capacity is not converting into completed, billable visits.",
      action: "Introduce a standard reminder and rebooking workflow for the affected branches.",
    });
  }
  insights.push({
    observation: `Revenue moved ${pctChange(netRevenue, priorNetRevenue) >= 0 ? "up" : "down"} ${Math.abs(round1(pctChange(netRevenue, priorNetRevenue)))}% versus the prior period.`,
    driver: pctChange(netRevenue, priorNetRevenue) >= 0 ? "Visit volume and revenue-per-visit both contributed." : "Visit volume declined faster than pricing/payer mix could offset.",
    impact: "Revenue trajectory affects the Financial perspective on the Executive Strategy dashboard.",
    action: "Cross-check this movement against the Revenue & Profitability dashboard's payer and location breakdown.",
  });

  return { kpis, monthlyTrend, byLine, byLocation, patientMix, insights };
}

// ============================================================
// HOME HEALTHCARE DASHBOARD
// ============================================================
export function homeHealthcareData(f: Filters) {
  const dates = datesInRange(f);
  const hhcKey = "BL-HHC";
  const visits = factVisits.filter((v) => dates.includes(v.dateKey) && v.lineKey === hhcKey && matchesRegion(v.region, f) && matchesLocation(v.locationKey, f) && matchesService(v.serviceKey, f));
  const revenue = factRevenue.filter((r) => dates.includes(r.dateKey) && r.lineKey === hhcKey && matchesRegion(r.region, f) && matchesLocation(r.locationKey, f));
  const cost = factCost.filter((c) => dates.includes(c.dateKey) && c.lineKey === hhcKey && matchesRegion(c.region, f) && matchesLocation(c.locationKey, f));
  const capacity = factCapacity.filter((c) => dates.includes(c.dateKey) && c.deptKey === "DEPT-CLIN" && matchesRegion(c.region, f) && matchesLocation(c.locationKey, f));
  const referrals = factReferrals.filter((r) => dates.includes(r.dateKey) && r.lineKey === hhcKey && matchesRegion(r.region, f));
  const cohort = factCohort.filter((c) => dates.includes(c.cohortMonth) && c.lineKey === hhcKey && matchesRegion(c.region, f) && matchesLocation(c.locationKey, f));

  const planned = sum(visits.map((v) => v.plannedVisits));
  const completed = sum(visits.map((v) => v.completedVisits));
  const cancelled = sum(visits.map((v) => v.cancelledVisits));
  const netRevenue = sum(revenue.map((r) => r.netRevenue));
  const totalCost = sum(cost.map((c) => c.totalCost));
  const variableCost = sum(cost.map((c) => c.variableCost));
  const availableCap = sum(capacity.map((c) => c.availableCapacity));
  const usedCap = sum(capacity.map((c) => c.usedCapacity));
  const uniquePatients = sum(visits.map((v) => v.uniquePatients));
  const returningPatients = sum(visits.map((v) => v.returningPatients));
  const referralConv = formulas.referralConversionRate.calc(sum(referrals.map((r) => r.referralsConverted)), sum(referrals.map((r) => r.referralsReceived)));

  const cohortAt0 = sum(cohort.filter((c) => c.monthsSinceAcquisition === 0).map((c) => c.newInCohort));
  const cohortAt3 = sum(cohort.filter((c) => c.monthsSinceAcquisition === 3).map((c) => c.retainedInMonth));
  const cohortRetentionRate = formulas.retentionRate.calc(cohortAt3, cohortAt0);

  const utilization = formulas.utilizationRate.calc(usedCap, availableCap);
  const completionRate = formulas.visitCompletionRate.calc(completed, planned);

  const kpis: KpiCardData[] = [
    { id: "planned", label: "Planned Home Visits", value: planned, unit: "count", status: "pos" },
    { id: "completed", label: "Completed Home Visits", value: completed, unit: "count", status: "pos" },
    { id: "remaining", label: "Remaining Visits", value: Math.max(0, planned - completed), unit: "count", status: "pos" },
    { id: "completionRate", label: "Visit Completion Rate", value: completionRate, unit: "%", decimals: 1, status: statusFromAchievement(completionRate) },
    { id: "utilization", label: "Clinical Team Utilization", value: utilization, unit: "%", decimals: 1, status: statusFromAchievement(utilization) },
    { id: "revPerVisit", label: "Revenue per Home Visit", value: formulas.revenuePerVisit.calc(netRevenue, completed), unit: "SAR", decimals: 0, status: "pos" },
    { id: "costPerVisit", label: "Cost per Home Visit", value: formulas.costPerVisit.calc(totalCost, completed), unit: "SAR", decimals: 0, status: "pos" },
    { id: "contribution", label: "Contribution Margin", value: formulas.contributionMargin.calc(netRevenue, variableCost), unit: "SAR", status: "pos" },
    { id: "retention", label: "Returning Patient Rate", value: formulas.retentionRate.calc(returningPatients, uniquePatients), unit: "%", decimals: 1, status: statusFromAchievement(formulas.retentionRate.calc(returningPatients, uniquePatients)) },
    { id: "cohortRetention", label: "3-Month Cohort Retention", value: cohortRetentionRate, unit: "%", decimals: 1, status: statusFromAchievement(cohortRetentionRate) },
    { id: "referralConv", label: "Referral Completion Rate", value: referralConv, unit: "%", decimals: 1, status: statusFromAchievement(referralConv) },
    { id: "cancelled", label: "Cancelled Visits", value: cancelled, unit: "count", status: cancelled / Math.max(1, planned) < 0.08 ? "pos" : "warn" },
  ];

  const trend: SeriesPoint[] = dates.map((dk) => {
    const dv = visits.filter((v) => v.dateKey === dk);
    const dc = factCapacity.filter((c) => c.dateKey === dk && c.deptKey === "DEPT-CLIN" && matchesRegion(c.region, f) && matchesLocation(c.locationKey, f));
    return {
      x: monthLabel(dk),
      "Completion Rate %": round1(formulas.visitCompletionRate.calc(sum(dv.map((v) => v.completedVisits)), sum(dv.map((v) => v.plannedVisits)))),
      "Utilization %": round1(formulas.utilizationRate.calc(sum(dc.map((c) => c.usedCapacity)), sum(dc.map((c) => c.availableCapacity)))),
    };
  });

  const byRegion = dimLocation.map((loc) => {
    const lv = factVisits.filter((v) => dates.includes(v.dateKey) && v.lineKey === hhcKey && v.locationKey === loc.locationKey);
    const lc = factCapacity.filter((c) => dates.includes(c.dateKey) && c.deptKey === "DEPT-CLIN" && c.locationKey === loc.locationKey);
    return {
      name: loc.region,
      "Completion Rate %": round1(formulas.visitCompletionRate.calc(sum(lv.map((v) => v.completedVisits)), sum(lv.map((v) => v.plannedVisits)))),
      "Utilization %": round1(formulas.utilizationRate.calc(sum(lc.map((c) => c.usedCapacity)), sum(lc.map((c) => c.availableCapacity)))),
    };
  });

  const insights: Insight[] = [];
  const worstRegion = [...byRegion].sort((a, b) => a["Utilization %"] - b["Utilization %"])[0];
  insights.push({
    observation: `${worstRegion?.name} shows the lowest clinical utilization of the three regions at ${worstRegion?.["Utilization %"]}%.`,
    driver: `${worstRegion?.name} contributed most of the completion-rate gap in this period's decline window.`,
    impact: "Available clinical capacity is not being converted into completed visits, pressuring revenue per FTE.",
    action: `Review scheduling demand and clinical resource allocation in ${worstRegion?.name}.`,
  });
  if (referralConv < 20) {
    insights.push({
      observation: `Referral completion rate is ${round1(referralConv)}%, below the 20% internal watch line.`,
      driver: "A meaningful share of referrals do not convert into a booked and completed appointment.",
      impact: "Home Care is not capturing the full demand signal coming from Digital and Primary Care referrals.",
      action: "Prioritize the referral pathway redesign initiative on the Business Analysis tracker.",
    });
  }
  insights.push({
    observation: `Cost per home visit is SAR ${round1(formulas.costPerVisit.calc(totalCost, completed))} against revenue per visit of SAR ${round1(formulas.revenuePerVisit.calc(netRevenue, completed))}.`,
    driver: "Cost is driven primarily by clinical staffing time per visit.",
    impact: "Contribution margin per visit is the key lever for Home Healthcare profitability.",
    action: "Cross-check this against the Revenue & Profitability dashboard's cost breakdown.",
  });

  return { kpis, trend, byRegion, insights };
}

// ============================================================
// PATIENT RETENTION DASHBOARD
// ============================================================
export function patientRetentionData(f: Filters) {
  const dates = datesInRange(f);
  const visits = factVisits.filter((v) => dates.includes(v.dateKey) && matchesRegion(v.region, f) && matchesLine(v.lineKey, f) && matchesLocation(v.locationKey, f));
  const cohort = factCohort.filter((c) => dates.includes(c.cohortMonth) && matchesRegion(c.region, f) && matchesLine(c.lineKey, f) && matchesLocation(c.locationKey, f));

  const uniquePatients = sum(visits.map((v) => v.uniquePatients));
  const newPatients = sum(visits.map((v) => v.newPatients));
  const returningPatients = sum(visits.map((v) => v.returningPatients));
  const completedVisits = sum(visits.map((v) => v.completedVisits));

  const cohortAt0 = sum(cohort.filter((c) => c.monthsSinceAcquisition === 0).map((c) => c.newInCohort));
  const cohortAt1 = sum(cohort.filter((c) => c.monthsSinceAcquisition === 1).map((c) => c.retainedInMonth));
  const cohortAt11 = sum(cohort.filter((c) => c.monthsSinceAcquisition === 11).map((c) => c.retainedInMonth));

  const kpis: KpiCardData[] = [
    { id: "unique", label: "Unique Patients", value: uniquePatients, unit: "count", status: "pos" },
    { id: "new", label: "New Patients", value: newPatients, unit: "count", status: "pos" },
    { id: "returning", label: "Returning Patients", value: returningPatients, unit: "count", status: "pos" },
    { id: "retained1m", label: "1-Month Retention", value: formulas.retentionRate.calc(cohortAt1, cohortAt0), unit: "%", decimals: 1, status: statusFromAchievement(formulas.retentionRate.calc(cohortAt1, cohortAt0)) },
    { id: "repeatVisit", label: "Repeat Visit Rate", value: formulas.retentionRate.calc(returningPatients, uniquePatients), unit: "%", decimals: 1, status: statusFromAchievement(formulas.retentionRate.calc(returningPatients, uniquePatients)) },
    { id: "avgVisits", label: "Avg Visits per Patient", value: formulas.avgVisitsPerPatient.calc(completedVisits, uniquePatients), unit: "count", decimals: 1, status: "pos" },
    { id: "retained12m", label: "12-Month Rolling Retention", value: formulas.retentionRate.calc(cohortAt11, cohortAt0), unit: "%", decimals: 1, status: statusFromAchievement(formulas.retentionRate.calc(cohortAt11, cohortAt0)) },
  ];

  // cohort matrix: rows = cohort month, cols = months since acquisition (0..6 shown)
  const cohortMonths = Array.from(new Set(cohort.map((c) => c.cohortMonth))).sort();
  const matrix = cohortMonths.slice(-8).map((cm) => {
    const base = sum(cohort.filter((c) => c.cohortMonth === cm && c.monthsSinceAcquisition === 0).map((c) => c.newInCohort));
    const row: Record<string, number | string> = { cohort: monthLabel(cm), newPatients: base };
    for (let m = 0; m <= 6; m++) {
      const retained = sum(cohort.filter((c) => c.cohortMonth === cm && c.monthsSinceAcquisition === m).map((c) => c.retainedInMonth));
      row[`m${m}`] = base ? round1((retained / base) * 100) : NaN;
    }
    return row;
  });

  const newVsReturning: SeriesPoint[] = dates.map((dk) => {
    const dv = visits.filter((v) => v.dateKey === dk);
    return { x: monthLabel(dk), New: sum(dv.map((v) => v.newPatients)), Returning: sum(dv.map((v) => v.returningPatients)) };
  });

  const byLine = dimBusinessLine.map((line) => {
    const lv = visits.filter((v) => v.lineKey === line.lineKey);
    return { name: line.name, "Retention %": round1(formulas.retentionRate.calc(sum(lv.map((v) => v.returningPatients)), sum(lv.map((v) => v.uniquePatients)))) };
  });

  const insights: Insight[] = [];
  const worstLine = [...byLine].sort((a, b) => a["Retention %"] - b["Retention %"])[0];
  insights.push({
    observation: `${worstLine?.name} has the lowest repeat-visit retention at ${worstLine?.["Retention %"]}%.`,
    driver: "Cohort decay is steeper in this line than the platform average, concentrated in specific regions.",
    impact: "New-patient acquisition in this line is not converting into a stable, returning patient base.",
    action: `Review the reactivation and follow-up workflow for ${worstLine?.name}.`,
  });
  insights.push({
    observation: `Average visits per patient is ${round1(formulas.avgVisitsPerPatient.calc(completedVisits, uniquePatients))} over the selected period.`,
    driver: "Driven by a mix of high-frequency chronic-care patients and one-off visits.",
    impact: "Visit frequency is a leading indicator for both retention and revenue per patient.",
    action: "Segment patients by visit frequency to target at-risk (declining-frequency) patients specifically.",
  });

  return { kpis, matrix, newVsReturning, byLine, insights };
}

// ============================================================
// REVENUE & PROFITABILITY DASHBOARD
// ============================================================
export function revenueProfitabilityData(f: Filters) {
  const dates = datesInRange(f);
  const revenue = factRevenue.filter((r) => dates.includes(r.dateKey) && matchesRegion(r.region, f) && matchesLine(r.lineKey, f) && matchesLocation(r.locationKey, f));
  const cost = factCost.filter((c) => dates.includes(c.dateKey) && matchesRegion(c.region, f) && matchesLine(c.lineKey, f) && matchesLocation(c.locationKey, f));
  const visits = factVisits.filter((v) => dates.includes(v.dateKey) && matchesRegion(v.region, f) && matchesLine(v.lineKey, f) && matchesLocation(v.locationKey, f));

  const grossRevenue = sum(revenue.map((r) => r.grossRevenue));
  const netRevenue = sum(revenue.map((r) => r.netRevenue));
  const collected = sum(revenue.map((r) => r.collectedAmount));
  const totalCost = sum(cost.map((c) => c.totalCost));
  const variableCost = sum(cost.map((c) => c.variableCost));
  const completedVisits = sum(visits.map((v) => v.completedVisits));
  const uniquePatients = sum(visits.map((v) => v.uniquePatients));

  const prior = priorPeriod(f);
  const priorDates = datesInRange(prior);
  const priorRevenue = factRevenue.filter((r) => priorDates.includes(r.dateKey) && matchesRegion(r.region, f) && matchesLine(r.lineKey, f) && matchesLocation(r.locationKey, f));
  const priorNet = sum(priorRevenue.map((r) => r.netRevenue));

  const kpis: KpiCardData[] = [
    { id: "gross", label: "Gross Revenue", value: grossRevenue, unit: "SAR", status: "pos" },
    { id: "net", label: "Net Revenue", value: netRevenue, unit: "SAR", trendPct: pctChange(netRevenue, priorNet), status: netRevenue >= priorNet ? "pos" : "warn" },
    { id: "growth", label: "Revenue Growth", value: pctChange(netRevenue, priorNet), unit: "%", decimals: 1, status: netRevenue >= priorNet ? "pos" : "neg" },
    { id: "revPerVisit", label: "Revenue per Visit", value: formulas.revenuePerVisit.calc(netRevenue, completedVisits), unit: "SAR", decimals: 0, status: "pos" },
    { id: "revPerPatient", label: "Revenue per Patient", value: formulas.revenuePerVisit.calc(netRevenue, uniquePatients), unit: "SAR", decimals: 0, status: "pos" },
    { id: "totalCost", label: "Total Cost", value: totalCost, unit: "SAR", status: "pos" },
    { id: "costPerVisit", label: "Cost per Visit", value: formulas.costPerVisit.calc(totalCost, completedVisits), unit: "SAR", decimals: 0, status: "pos" },
    { id: "grossMargin", label: "Gross Margin", value: formulas.grossMargin.calc(netRevenue, totalCost), unit: "%", decimals: 1, status: statusFromAchievement(formulas.grossMargin.calc(netRevenue, totalCost)) },
    { id: "contribution", label: "Contribution Margin", value: formulas.contributionMargin.calc(netRevenue, variableCost), unit: "SAR", status: "pos" },
    { id: "collection", label: "Collection Rate", value: formulas.collectionRate.calc(collected, netRevenue), unit: "%", decimals: 1, status: statusFromAchievement(formulas.collectionRate.calc(collected, netRevenue)) },
    { id: "outstanding", label: "Outstanding Balance", value: netRevenue - collected, unit: "SAR", status: (netRevenue - collected) / Math.max(1, netRevenue) < 0.08 ? "pos" : "warn" },
  ];

  const monthlyTrend: SeriesPoint[] = dates.map((dk) => {
    const dr = revenue.filter((r) => r.dateKey === dk);
    const dc = cost.filter((c) => c.dateKey === dk);
    return { x: monthLabel(dk), "Net Revenue (k)": round1(sum(dr.map((r) => r.netRevenue)) / 1000), "Cost (k)": round1(sum(dc.map((c) => c.totalCost)) / 1000) };
  });

  const byLine = dimBusinessLine.map((line) => ({ name: line.name, "Net Revenue (k)": round1(sum(revenue.filter((r) => r.lineKey === line.lineKey).map((r) => r.netRevenue)) / 1000) }));
  const byLocation = dimLocation.map((loc) => ({ name: loc.name, "Net Revenue (k)": round1(sum(revenue.filter((r) => r.locationKey === loc.locationKey).map((r) => r.netRevenue)) / 1000) }));
  const byPayer = Array.from(new Set(revenue.map((r) => r.payerName))).map((p) => ({ name: p, "Net Revenue (k)": round1(sum(revenue.filter((r) => r.payerName === p).map((r) => r.netRevenue)) / 1000) }));

  const insights: Insight[] = [];
  insights.push({
    observation: `Gross margin is ${round1(formulas.grossMargin.calc(netRevenue, totalCost))}% across the selected period.`,
    driver: netRevenue >= priorNet ? "Revenue growth is outpacing cost growth." : "Cost is growing faster than revenue.",
    impact: "Margin trajectory directly affects the Financial perspective of the Balanced Scorecard.",
    action: netRevenue >= priorNet ? "Maintain current cost discipline." : "Investigate the cost drivers behind the fastest-growing location or line.",
  });
  const worstPayer = [...byPayer].sort((a, b) => a["Net Revenue (k)"] - b["Net Revenue (k)"])[0];
  insights.push({
    observation: `${worstPayer?.name} is the smallest revenue channel of the three payer types in this period.`,
    driver: "Payer mix is concentrated in Insurance, with Corporate and Cash as smaller channels.",
    impact: "Over-reliance on one payer channel increases collection-rate risk.",
    action: "Review whether Corporate/Cash channel growth is a viable diversification lever.",
  });
  if (formulas.collectionRate.calc(collected, netRevenue) < 92) {
    insights.push({
      observation: `Collection rate is ${round1(formulas.collectionRate.calc(collected, netRevenue))}%, leaving an outstanding balance of SAR ${Math.round(netRevenue - collected).toLocaleString()}.`,
      driver: "A portion of billed revenue has not yet been collected within the period.",
      impact: "Cash conversion lags revenue recognition.",
      action: "Prioritize collections follow-up on the oldest outstanding balances by payer.",
    });
  }

  return { kpis, monthlyTrend, byLine, byLocation, byPayer, insights };
}

// ============================================================
// CAPACITY & UTILIZATION DASHBOARD
// ============================================================
export function capacityUtilizationData(f: Filters) {
  const dates = datesInRange(f);
  const capacity = factCapacity.filter((c) => dates.includes(c.dateKey) && matchesRegion(c.region, f) && matchesLocation(c.locationKey, f) && matchesDept(c.deptKey, f));
  const appts = factAppointments.filter((a) => dates.includes(a.dateKey) && matchesRegion(a.region, f) && matchesLine(a.lineKey, f) && matchesLocation(a.locationKey, f));
  const visits = factVisits.filter((v) => dates.includes(v.dateKey) && matchesRegion(v.region, f) && matchesLine(v.lineKey, f) && matchesLocation(v.locationKey, f));

  const available = sum(capacity.map((c) => c.availableCapacity));
  const used = sum(capacity.map((c) => c.usedCapacity));
  const booked = sum(appts.map((a) => a.bookedAppointments));
  const completed = sum(appts.map((a) => a.completedAppointments));
  const noShow = sum(appts.map((a) => a.noShowAppointments));

  const kpis: KpiCardData[] = [
    { id: "available", label: "Available Capacity", value: available, unit: "count", status: "pos" },
    { id: "used", label: "Used Capacity", value: used, unit: "count", status: "pos" },
    { id: "remaining", label: "Remaining Capacity", value: Math.max(0, available - used), unit: "count", status: "pos" },
    { id: "utilization", label: "Utilization Rate", value: formulas.utilizationRate.calc(used, available), unit: "%", decimals: 1, status: statusFromAchievement(formulas.utilizationRate.calc(used, available)) },
    { id: "completed", label: "Completed Visits", value: sum(visits.map((v) => v.completedVisits)), unit: "count", status: "pos" },
    { id: "apptCompletion", label: "Appointment Completion", value: formulas.visitCompletionRate.calc(completed, booked), unit: "%", decimals: 1, status: statusFromAchievement(formulas.visitCompletionRate.calc(completed, booked)) },
    { id: "noShow", label: "No-Show Rate", value: formulas.noShowRate.calc(noShow, booked), unit: "%", decimals: 1, status: formulas.noShowRate.calc(noShow, booked) <= 10 ? "pos" : "neg" },
  ];

  const byLocation = dimLocation.map((loc) => {
    const lc = factCapacity.filter((c) => dates.includes(c.dateKey) && c.locationKey === loc.locationKey);
    return { name: loc.name, "Utilization %": round1(formulas.utilizationRate.calc(sum(lc.map((c) => c.usedCapacity)), sum(lc.map((c) => c.availableCapacity)))) };
  });
  const byDept = dimDepartment.map((dept) => {
    const dc = factCapacity.filter((c) => dates.includes(c.dateKey) && c.deptKey === dept.deptKey);
    return { name: dept.name, "Utilization %": round1(formulas.utilizationRate.calc(sum(dc.map((c) => c.usedCapacity)), sum(dc.map((c) => c.availableCapacity)))) };
  });

  const insights: Insight[] = [];
  const worstLoc = [...byLocation].sort((a, b) => a["Utilization %"] - b["Utilization %"])[0];
  insights.push({
    observation: `${worstLoc?.name} has the lowest utilization of all branches at ${worstLoc?.["Utilization %"]}%.`,
    driver: "Demand at this branch is not fully matched to available scheduled capacity.",
    impact: "Fixed capacity costs are being carried without proportional visit volume.",
    action: `Review scheduling templates and demand forecasting for ${worstLoc?.name}.`,
  });
  const peakHour = [...hourlyUtilization].sort((a, b) => b.utilization - a.utilization)[0];
  insights.push({
    observation: `${peakHour.hour} is the highest-demand hour at ${peakHour.utilization}% utilization.`,
    driver: "Patient booking preference concentrates around late morning.",
    impact: "Off-peak hours are comparatively underutilized, and peak hours risk overbooking.",
    action: "Consider incentivizing off-peak bookings to flatten the demand curve.",
  });

  return { kpis, byLocation, byDept, weekdayUtilization, hourlyUtilization, insights };
}

// ============================================================
// PATIENT JOURNEY DASHBOARD
// ============================================================
export function patientJourneyData(f: Filters) {
  const dates = datesInRange(f);
  const rows = factPatientJourney.filter((r) => dates.includes(r.dateKey) && matchesRegion(r.region, f) && matchesLocation(r.locationKey, f));

  const stages = [
    { name: "Booking → Arrival", value: avg(rows.map((r) => r.bookingToArrival)) },
    { name: "Arrival → Physician", value: avg(rows.map((r) => r.arrivalToPhysician)) },
    { name: "Physician → Order", value: avg(rows.map((r) => r.physicianToOrder)) },
    { name: "Order → Result", value: avg(rows.map((r) => r.orderToResult)) },
    { name: "Result → Follow-up", value: avg(rows.map((r) => r.resultToFollowUp)) },
  ];
  const totalJourneyTime = sum(stages.map((s) => s.value));
  const started = sum(rows.map((r) => r.totalStarted));
  const completed = sum(rows.map((r) => r.totalCompleted));
  const slaCompliant = sum(rows.map((r) => r.slaCompliant));

  const kpis: KpiCardData[] = [
    { id: "bookingArrival", label: "Booking to Arrival (min)", value: stages[0].value, unit: "min", decimals: 1, status: "pos" },
    { id: "arrivalPhysician", label: "Arrival to Physician (min)", value: stages[1].value, unit: "min", decimals: 1, status: "pos" },
    { id: "physicianOrder", label: "Physician to Order (min)", value: stages[2].value, unit: "min", decimals: 1, status: "pos" },
    { id: "orderResult", label: "Order to Result (min)", value: stages[3].value, unit: "min", decimals: 1, status: "warn" },
    { id: "resultFollowup", label: "Result to Follow-up (min)", value: stages[4].value, unit: "min", decimals: 1, status: "pos" },
    { id: "totalTime", label: "Total Journey Time (min)", value: totalJourneyTime, unit: "min", decimals: 1, status: "pos" },
    { id: "completion", label: "Journey Completion", value: formulas.journeyCompletion.calc(completed, started), unit: "%", decimals: 1, status: statusFromAchievement(formulas.journeyCompletion.calc(completed, started)) },
    { id: "dropOff", label: "Drop-Off Rate", value: formulas.dropOffRate.calc(started, completed), unit: "%", decimals: 1, status: formulas.dropOffRate.calc(started, completed) <= 12 ? "pos" : "neg" },
    { id: "sla", label: "SLA Compliance", value: formulas.slaCompliance.calc(slaCompliant, completed), unit: "%", decimals: 1, status: statusFromAchievement(formulas.slaCompliance.calc(slaCompliant, completed)) },
  ];

  const funnel = [
    { name: "Booked", value: started },
    { name: "Arrived", value: Math.round(started * 0.94) },
    { name: "Seen by Physician", value: Math.round(started * 0.88) },
    { name: "Order Placed", value: Math.round(started * 0.8) },
    { name: "Result Received", value: Math.round(started * 0.72) },
    { name: "Completed", value: completed },
  ];

  const bottleneck = [...stages].sort((a, b) => b.value - a.value)[0];
  const insights: Insight[] = [
    {
      observation: `${bottleneck.name} is the largest single contributor to total journey time at ${round1(bottleneck.value)} minutes on average.`,
      driver: "Lab/imaging turnaround and downstream queueing concentrate delay at this stage.",
      impact: "This stage drives most of the gap against the total journey time target.",
      action: `Prioritize process improvement work on ${bottleneck.name} before addressing earlier stages.`,
    },
    {
      observation: `SLA compliance is ${round1(formulas.slaCompliance.calc(slaCompliant, completed))}% for completed journeys.`,
      driver: "Regional congestion (notably Riyadh) reduces on-time completion versus SLA.",
      impact: "Patient experience and downstream scheduling both degrade when SLA is missed.",
      action: "Set a stage-level SLA rather than only an end-to-end SLA, focused on the bottleneck stage.",
    },
    {
      observation: `Drop-off rate is ${round1(formulas.dropOffRate.calc(started, completed))}% between journey start and completion.`,
      driver: "Some patients do not complete the full booking-to-follow-up path.",
      impact: "Incomplete journeys understate realized clinical and revenue outcomes.",
      action: "Instrument drop-off by stage to identify exactly where patients exit the journey.",
    },
  ];

  return { kpis, stages, funnel, insights };
}

// ============================================================
// BUSINESS ANALYSIS DASHBOARD
// ============================================================
export function businessAnalysisData() {
  const total = baTracker.length;
  const open = baTracker.filter((b) => b.status === "Open").length;
  const inProgress = baTracker.filter((b) => b.status === "In Progress").length;
  const atRisk = baTracker.filter((b) => b.status === "At Risk").length;
  const closed = baTracker.filter((b) => b.status === "Closed").length;

  const kpis: KpiCardData[] = [
    { id: "total", label: "Business Requirements", value: total, unit: "count", status: "pos" },
    { id: "closed", label: "Completed Requirements", value: closed, unit: "count", status: "pos" },
    { id: "open", label: "Pending Requirements", value: open + inProgress, unit: "count", status: "warn" },
    { id: "atRisk", label: "Requirements At Risk", value: atRisk, unit: "count", status: atRisk > 0 ? "neg" : "pos" },
    { id: "gaps", label: "Identified Gaps", value: total, unit: "count", status: "pos" },
  ];

  const insights: Insight[] = [
    {
      observation: `${atRisk} of ${total} tracked items are At Risk.`,
      driver: "These items depend on cross-system changes that haven't been scheduled yet.",
      impact: "Delayed resolution compounds into the KPI reliability and referral-conversion issues seen elsewhere.",
      action: "Assign a named owner and target date to every At Risk item this cycle.",
    },
  ];

  return { kpis, items: baTracker, insights };
}

// ============================================================
// PROJECT / INITIATIVE DASHBOARD
// ============================================================
export function initiativesDashboardData() {
  const total = factInitiatives.length;
  const completed = factInitiatives.filter((i) => i.status === "Completed").length;
  const onTrack = factInitiatives.filter((i) => i.status === "On Track").length;
  const atRisk = factInitiatives.filter((i) => i.status === "At Risk").length;
  const delayed = factInitiatives.filter((i) => i.status === "Delayed").length;
  const totalBudget = sum(factInitiatives.map((i) => i.budget));
  const usedBudget = sum(factInitiatives.map((i) => i.budgetUsed));
  const avgProgress = avg(factInitiatives.map((i) => i.progress));

  const kpis: KpiCardData[] = [
    { id: "total", label: "Total Initiatives", value: total, unit: "count", status: "pos" },
    { id: "completed", label: "Completed", value: completed, unit: "count", status: "pos" },
    { id: "onTrack", label: "On Track", value: onTrack, unit: "count", status: "pos" },
    { id: "atRisk", label: "At Risk", value: atRisk, unit: "count", status: atRisk > 0 ? "warn" : "pos" },
    { id: "delayed", label: "Delayed", value: delayed, unit: "count", status: delayed > 0 ? "neg" : "pos" },
    { id: "completionRate", label: "Completion Rate", value: formulas.visitCompletionRate.calc(completed, total), unit: "%", decimals: 1, status: statusFromAchievement(formulas.visitCompletionRate.calc(completed, total)) },
    { id: "budgetUtil", label: "Budget Utilization", value: formulas.budgetUtilization.calc(usedBudget, totalBudget), unit: "%", decimals: 1, status: statusFromAchievement(formulas.budgetUtilization.calc(usedBudget, totalBudget)) },
    { id: "milestone", label: "Milestone Achievement", value: avgProgress, unit: "%", decimals: 1, status: statusFromAchievement(avgProgress) },
  ];

  const insights: Insight[] = [
    {
      observation: `${atRisk + delayed} of ${total} initiatives are At Risk or Delayed.`,
      driver: "Budget consumption is outpacing progress for these initiatives.",
      impact: "Expected benefits from the portfolio are at risk of slipping to a later period.",
      action: "Run a portfolio review focused on the At Risk / Delayed initiatives this cycle.",
    },
  ];

  return { kpis, initiatives: factInitiatives, insights };
}

// ============================================================
// WORKFORCE ANALYTICS
// ============================================================
export function workforceData(f: Filters) {
  const dates = datesInRange(f);
  const rows = factWorkforce.filter((w) => dates.includes(w.dateKey) && matchesRegion(w.locationRegion, f));
  const headcount = sum(rows.map((r) => r.headcount)) / Math.max(1, dates.length);
  const turnover = avg(rows.map((r) => r.turnover));
  const absenteeism = avg(rows.map((r) => r.absenteeism));
  const training = avg(rows.map((r) => r.trainingCompletion));
  const vacancy = avg(rows.map((r) => r.vacancyRate));

  const kpis: KpiCardData[] = [
    { id: "headcount", label: "Headcount (avg/mo)", value: headcount, unit: "count", decimals: 0, status: "pos" },
    { id: "turnover", label: "Turnover", value: turnover, unit: "%", decimals: 1, status: turnover <= 4 ? "pos" : "warn" },
    { id: "absenteeism", label: "Absenteeism", value: absenteeism, unit: "%", decimals: 1, status: absenteeism <= 3.5 ? "pos" : "warn" },
    { id: "training", label: "Training Completion", value: training, unit: "%", decimals: 1, status: statusFromAchievement(training) },
    { id: "vacancy", label: "Vacancy Rate", value: vacancy, unit: "%", decimals: 1, status: vacancy <= 8 ? "pos" : "warn" },
  ];

  const byDept = dimDepartment.map((dept) => {
    const dr = rows.filter((r) => r.deptName === dept.name);
    return { name: dept.name, Headcount: round1(sum(dr.map((r) => r.headcount)) / Math.max(1, dates.length)) };
  });

  const insights: Insight[] = [
    {
      observation: `Average absenteeism is ${round1(absenteeism)}% across the selected period.`,
      driver: "Concentrated in specific departments rather than evenly distributed.",
      impact: "Elevated absenteeism increases pressure on clinical capacity and utilization.",
      action: "Cross-check the highest-absenteeism department against the Capacity dashboard for the same period.",
    },
  ];

  return { kpis, byDept, insights };
}

// ============================================================
// DATA QUALITY DASHBOARD
// ============================================================
export function dataQualityData(f: Filters) {
  const dates = datesInRange(f);
  const rows = factDataQuality.filter((d) => dates.includes(d.dateKey));

  const completeness = avg(rows.map((r) => r.completeness));
  const accuracy = avg(rows.map((r) => r.accuracy));
  const duplicateRate = avg(rows.map((r) => r.duplicateRate));
  const missingRate = avg(rows.map((r) => r.missingValueRate));
  const validationFail = avg(rows.map((r) => r.validationFailureRate));
  const recordsProcessed = sum(rows.map((r) => r.recordsProcessed));
  const qualityScore = (completeness + accuracy + (100 - duplicateRate) + (100 - missingRate) + (100 - validationFail)) / 5;

  const kpis: KpiCardData[] = [
    { id: "completeness", label: "Data Completeness", value: completeness, unit: "%", decimals: 1, status: statusFromAchievement(completeness) },
    { id: "accuracy", label: "Data Accuracy", value: accuracy, unit: "%", decimals: 1, status: statusFromAchievement(accuracy) },
    { id: "duplicate", label: "Duplicate Rate", value: duplicateRate, unit: "%", decimals: 2, status: duplicateRate <= 1.5 ? "pos" : "neg" },
    { id: "missing", label: "Missing Value Rate", value: missingRate, unit: "%", decimals: 2, status: missingRate <= 2.5 ? "pos" : "neg" },
    { id: "validation", label: "Validation Failure Rate", value: validationFail, unit: "%", decimals: 2, status: validationFail <= 2 ? "pos" : "neg" },
    { id: "records", label: "Records Processed", value: recordsProcessed, unit: "count", status: "pos" },
    { id: "score", label: "Data Quality Score", value: qualityScore, unit: "%", decimals: 1, status: statusFromAchievement(qualityScore) },
  ];

  const bySystem = Array.from(new Set(rows.map((r) => r.system))).map((s) => {
    const sr = rows.filter((r) => r.system === s);
    return { name: s, "Completeness %": round1(avg(sr.map((r) => r.completeness))), "Accuracy %": round1(avg(sr.map((r) => r.accuracy))) };
  });

  const trend: SeriesPoint[] = dates.map((dk) => {
    const dr = rows.filter((r) => r.dateKey === dk);
    return { x: monthLabel(dk), "Completeness %": round1(avg(dr.map((r) => r.completeness))), "Accuracy %": round1(avg(dr.map((r) => r.accuracy))) };
  });

  const worstSystem = [...bySystem].sort((a, b) => a["Completeness %"] - b["Completeness %"])[0];
  const insights: Insight[] = [
    {
      observation: `${worstSystem?.name} has the lowest completeness of tracked sources at ${worstSystem?.["Completeness %"]}%.`,
      driver: "A specific ingestion incident during the period reduced completeness and accuracy together.",
      impact: "Downstream KPI calculations sourced from this system carry more uncertainty during the affected month.",
      action: `Investigate the incident month for ${worstSystem?.name} before trusting month-over-month KPI comparisons.`,
    },
  ];

  return { kpis, bySystem, trend, insights };
}
