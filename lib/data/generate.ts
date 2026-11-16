import { mulberry32, SEED, pick, range, rangeInt, clamp, round } from "../seed";
import {
  dimDate, dimLocation, dimBusinessLine, dimService, dimDepartment, dimPayer, dimProvider,
} from "./dimensions";

const rand = mulberry32(SEED);

// ---------- shared shaping helpers ----------
// Seasonality: healthcare demand dips in summer (Jun-Aug hajj/holiday season) and
// rises in winter (respiratory season, Nov-Feb). Index around 1.0.
function seasonality(month: number) {
  const table: Record<number, number> = {
    1: 1.08, 2: 1.05, 3: 1.0, 4: 0.97, 5: 0.93, 6: 0.85,
    7: 0.82, 8: 0.88, 9: 0.98, 10: 1.03, 11: 1.07, 12: 1.1,
  };
  return table[month] ?? 1;
}

// Growth trend across the 24 months, plus one deliberate decline window and one
// deliberate outlier spike so nothing "just keeps improving" (brief Section 10/54).
function growthIndex(monthIdx: number, totalMonths: number) {
  const t = monthIdx / (totalMonths - 1); // 0..1
  let g = 0.82 + t * 0.5; // gradual underlying growth
  // deliberate decline window: months 9-12 (index) simulate a demand/ops dip
  if (monthIdx >= 9 && monthIdx <= 12) g -= 0.14;
  // deliberate outlier spike at index 17 (e.g. a campaign or seasonal one-off)
  if (monthIdx === 17) g += 0.22;
  return Math.max(0.55, g);
}

const regionFactor: Record<string, number> = { Riyadh: 1.15, Jeddah: 0.92, Dammam: 0.78 };
const lineFactor: Record<string, number> = { "Primary Care": 1.0, "Home Healthcare": 0.7, "Digital Care": 0.55 };

// ---------- fact_visits ----------
export interface FactVisit {
  dateKey: string; locationKey: string; region: string; lineKey: string; lineName: string; serviceKey: string;
  plannedVisits: number; completedVisits: number; cancelledVisits: number; noShowVisits: number;
  uniquePatients: number; newPatients: number; returningPatients: number;
}
function buildFactVisits(): FactVisit[] {
  const rows: FactVisit[] = [];
  dimDate.forEach((d, mi) => {
    dimLocation.forEach((loc) => {
      dimService.forEach((svc) => {
        const line = dimBusinessLine.find((l) => l.lineKey === svc.lineKey)!;
        const base = 340;
        const idx = base * seasonality(d.month) * growthIndex(mi, dimDate.length) *
          regionFactor[loc.region] * lineFactor[line.name] * range(rand, 0.9, 1.1);
        const planned = Math.round(idx);
        // Riyadh HHC gets an intentional utilization/completion problem in the decline window
        const isDeclineDip = mi >= 9 && mi <= 12 && loc.region === "Riyadh" && line.name === "Home Healthcare";
        const completionRate = clamp(range(rand, 0.86, 0.97) - (isDeclineDip ? 0.16 : 0), 0.55, 0.99);
        const completed = Math.round(planned * completionRate);
        const noShow = Math.round((planned - completed) * range(rand, 0.5, 0.7));
        const cancelled = Math.max(0, planned - completed - noShow);
        const uniquePatients = Math.round(completed * range(rand, 0.62, 0.78));
        const newPatients = Math.round(uniquePatients * range(rand, 0.18, 0.32));
        const returningPatients = uniquePatients - newPatients;
        rows.push({
          dateKey: d.dateKey, locationKey: loc.locationKey, region: loc.region, lineKey: line.lineKey,
          lineName: line.name, serviceKey: svc.serviceKey,
          plannedVisits: planned, completedVisits: completed, cancelledVisits: cancelled, noShowVisits: noShow,
          uniquePatients, newPatients, returningPatients,
        });
      });
    });
  });
  return rows;
}
export const factVisits = buildFactVisits();

// ---------- fact_appointments (booking funnel, no-show) ----------
export interface FactAppointment {
  dateKey: string; locationKey: string; region: string; lineKey: string;
  bookedAppointments: number; completedAppointments: number; noShowAppointments: number;
}
function buildFactAppointments(): FactAppointment[] {
  const rows: FactAppointment[] = [];
  const byKey = new Map<string, FactVisit[]>();
  for (const v of factVisits) {
    const k = `${v.dateKey}|${v.locationKey}|${v.lineKey}`;
    byKey.set(k, [...(byKey.get(k) ?? []), v]);
  }
  byKey.forEach((rowsForKey, key) => {
    const [dateKey, locationKey, lineKey] = key.split("|");
    const loc = dimLocation.find((l) => l.locationKey === locationKey)!;
    const booked = rowsForKey.reduce((s, r) => s + r.plannedVisits, 0);
    const completed = rowsForKey.reduce((s, r) => s + r.completedVisits, 0);
    const noShow = rowsForKey.reduce((s, r) => s + r.noShowVisits, 0);
    rows.push({ dateKey, locationKey, region: loc.region, lineKey, bookedAppointments: booked, completedAppointments: completed, noShowAppointments: noShow });
  });
  return rows;
}
export const factAppointments = buildFactAppointments();

// ---------- fact_revenue / fact_cost ----------
export interface FactRevenue {
  dateKey: string; locationKey: string; region: string; lineKey: string; lineName: string; payerKey: string; payerName: string;
  grossRevenue: number; netRevenue: number; collectedAmount: number;
}
export interface FactCost {
  dateKey: string; locationKey: string; region: string; lineKey: string; totalCost: number; variableCost: number; fixedCost: number;
}
const revPerVisit: Record<string, number> = { "Primary Care": 260, "Home Healthcare": 420, "Digital Care": 140 };
const costPerVisit: Record<string, number> = { "Primary Care": 165, "Home Healthcare": 300, "Digital Care": 70 };
const payerMix = [
  { key: "PAY-INS", name: "Insurance" as const, share: 0.62 },
  { key: "PAY-CORP", name: "Corporate" as const, share: 0.23 },
  { key: "PAY-CASH", name: "Cash" as const, share: 0.15 },
];
function buildRevenueAndCost(): { revenue: FactRevenue[]; cost: FactCost[] } {
  const revenue: FactRevenue[] = [];
  const cost: FactCost[] = [];
  const byKey = new Map<string, FactVisit[]>();
  for (const v of factVisits) {
    const k = `${v.dateKey}|${v.locationKey}|${v.lineKey}`;
    byKey.set(k, [...(byKey.get(k) ?? []), v]);
  }
  byKey.forEach((rowsForKey, key) => {
    const [dateKey, locationKey, lineKey] = key.split("|");
    const loc = dimLocation.find((l) => l.locationKey === locationKey)!;
    const line = dimBusinessLine.find((l) => l.lineKey === lineKey)!;
    const completed = rowsForKey.reduce((s, r) => s + r.completedVisits, 0);
    const gross = completed * revPerVisit[line.name] * range(rand, 0.97, 1.05);
    const totalCostVal = completed * costPerVisit[line.name] * range(rand, 0.95, 1.08);
    for (const p of payerMix) {
      const share = p.share * range(rand, 0.9, 1.1);
      const g = gross * share;
      const discount = g * range(rand, 0.02, 0.06);
      const net = g - discount;
      const collected = net * range(rand, 0.88, 0.99);
      revenue.push({ dateKey, locationKey, region: loc.region, lineKey, lineName: line.name, payerKey: p.key, payerName: p.name, grossRevenue: round(g), netRevenue: round(net), collectedAmount: round(collected) });
    }
    cost.push({ dateKey, locationKey, region: loc.region, lineKey, totalCost: round(totalCostVal), variableCost: round(totalCostVal * 0.68), fixedCost: round(totalCostVal * 0.32) });
  });
  return { revenue, cost };
}
const { revenue: factRevenue, cost: factCost } = buildRevenueAndCost();
export { factRevenue, factCost };

// ---------- fact_capacity ----------
export interface FactCapacity {
  dateKey: string; locationKey: string; region: string; deptKey: string; deptName: string;
  availableCapacity: number; usedCapacity: number;
}
function buildFactCapacity(): FactCapacity[] {
  const rows: FactCapacity[] = [];
  dimDate.forEach((d, mi) => {
    dimLocation.forEach((loc) => {
      dimDepartment.forEach((dept) => {
        const isDeclineDip = mi >= 9 && mi <= 12 && loc.region === "Riyadh" && dept.deptKey === "DEPT-CLIN";
        const available = Math.round(1400 * regionFactor[loc.region] * range(rand, 0.95, 1.05));
        const utilization = clamp(range(rand, 0.66, 0.86) - (isDeclineDip ? 0.17 : 0), 0.4, 0.97);
        const used = Math.round(available * utilization);
        rows.push({ dateKey: d.dateKey, locationKey: loc.locationKey, region: loc.region, deptKey: dept.deptKey, deptName: dept.name, availableCapacity: available, usedCapacity: used });
      });
    });
  });
  return rows;
}
export const factCapacity = buildFactCapacity();

// weekday / hourly utilization pattern (derived view, not a literal fact grain —
// documented in the Data Dictionary as a modeled pattern over fact_capacity)
export const weekdayUtilization = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => ({
  day: d, utilization: round(clamp(0.55 + (i < 5 ? 0.22 : -0.12) + range(rand, -0.05, 0.05), 0.3, 0.95) * 100, 1),
}));
export const hourlyUtilization = Array.from({ length: 12 }, (_, i) => {
  const hour = 8 + i;
  const peak = hour >= 10 && hour <= 13;
  return { hour: `${hour}:00`, utilization: round(clamp((peak ? 0.82 : 0.55) + range(rand, -0.08, 0.08), 0.25, 0.97) * 100, 1) };
});

// ---------- fact_referrals ----------
export interface FactReferral {
  dateKey: string; locationKey: string; region: string; lineKey: string; referralsReceived: number; referralsConverted: number;
}
function buildFactReferrals(): FactReferral[] {
  const rows: FactReferral[] = [];
  dimDate.forEach((d) => {
    dimLocation.forEach((loc) => {
      dimBusinessLine.forEach((line) => {
        const received = Math.round(range(rand, 40, 160) * regionFactor[loc.region] * lineFactor[line.name] * seasonality(d.month));
        const convRate = clamp(range(rand, 0.14, 0.34), 0.08, 0.5);
        rows.push({ dateKey: d.dateKey, locationKey: loc.locationKey, region: loc.region, lineKey: line.lineKey, referralsReceived: received, referralsConverted: Math.round(received * convRate) });
      });
    });
  });
  return rows;
}
export const factReferrals = buildFactReferrals();

// ---------- fact_patient_journey ----------
export interface FactPatientJourney {
  dateKey: string; locationKey: string; region: string;
  bookingToArrival: number; arrivalToPhysician: number; physicianToOrder: number; orderToResult: number; resultToFollowUp: number;
  totalStarted: number; totalCompleted: number; slaCompliant: number;
}
function buildFactPatientJourney(): FactPatientJourney[] {
  const rows: FactPatientJourney[] = [];
  dimDate.forEach((d) => {
    dimLocation.forEach((loc) => {
      const congestion = loc.region === "Riyadh" ? 1.3 : 1.0; // Riyadh = the bottleneck region
      const bookingToArrival = round(range(rand, 8, 20) * congestion, 1); // minutes
      const arrivalToPhysician = round(range(rand, 12, 40) * congestion, 1);
      const physicianToOrder = round(range(rand, 5, 15), 1);
      const orderToResult = round(range(rand, 45, 180) * congestion, 1); // the real bottleneck (lab/imaging)
      const resultToFollowUp = round(range(rand, 60, 240), 1);
      const started = rangeInt(rand, 180, 420);
      const dropRate = clamp(range(rand, 0.06, 0.18), 0.04, 0.3);
      const completed = Math.round(started * (1 - dropRate));
      const slaRate = clamp(range(rand, 0.72, 0.94) - (loc.region === "Riyadh" ? 0.08 : 0), 0.5, 0.98);
      rows.push({ dateKey: d.dateKey, locationKey: loc.locationKey, region: loc.region, bookingToArrival, arrivalToPhysician, physicianToOrder, orderToResult, resultToFollowUp, totalStarted: started, totalCompleted: completed, slaCompliant: Math.round(completed * slaRate) });
    });
  });
  return rows;
}
export const factPatientJourney = buildFactPatientJourney();

// ---------- fact_patient_cohort (supports retention dashboard, Section 15) ----------
export interface FactCohort {
  cohortMonth: string; lineKey: string; lineName: string; locationKey: string; region: string;
  monthsSinceAcquisition: number; newInCohort: number; retainedInMonth: number;
}
function buildFactCohort(): FactCohort[] {
  const rows: FactCohort[] = [];
  dimDate.forEach((cohortDate, ci) => {
    dimLocation.forEach((loc) => {
      dimBusinessLine.forEach((line) => {
        const newInCohort = Math.round(range(rand, 25, 90) * regionFactor[loc.region] * lineFactor[line.name]);
        const maxMonthsOut = Math.min(11, dimDate.length - 1 - ci);
        for (let m = 0; m <= maxMonthsOut; m++) {
          // baseline decay curve + regional variance; Riyadh HHC has a deliberate retention dip
          const decay = Math.pow(range(rand, 0.8, 0.9), m);
          const dip = loc.region === "Riyadh" && line.name === "Home Healthcare" && ci >= 9 && ci <= 12 ? 0.75 : 1;
          const retained = Math.round(newInCohort * decay * dip);
          rows.push({ cohortMonth: cohortDate.dateKey, lineKey: line.lineKey, lineName: line.name, locationKey: loc.locationKey, region: loc.region, monthsSinceAcquisition: m, newInCohort, retainedInMonth: retained });
        }
      });
    });
  });
  return rows;
}
export const factCohort = buildFactCohort();

// ---------- fact_kpi_performance (Strategy / Balanced Scorecard) ----------
export const bscPerspectives = ["Financial", "Customer & Growth", "Internal Process & Governance", "People & Capability", "Technology & Innovation"] as const;
export interface FactKpiPerformance {
  dateKey: string; kpiId: string; perspective: (typeof bscPerspectives)[number]; target: number; actual: number;
}
const strategicKpis: { id: string; perspective: (typeof bscPerspectives)[number]; base: number; volatility: number; unit: string }[] = [
  { id: "KPI-STR-01", perspective: "Financial", base: 100, volatility: 0.1, unit: "index" },
  { id: "KPI-STR-02", perspective: "Financial", base: 100, volatility: 0.12, unit: "index" },
  { id: "KPI-STR-03", perspective: "Customer & Growth", base: 100, volatility: 0.08, unit: "index" },
  { id: "KPI-STR-04", perspective: "Customer & Growth", base: 100, volatility: 0.1, unit: "index" },
  { id: "KPI-STR-05", perspective: "Internal Process & Governance", base: 100, volatility: 0.14, unit: "index" },
  { id: "KPI-STR-06", perspective: "Internal Process & Governance", base: 100, volatility: 0.09, unit: "index" },
  { id: "KPI-STR-07", perspective: "People & Capability", base: 100, volatility: 0.07, unit: "index" },
  { id: "KPI-STR-08", perspective: "Technology & Innovation", base: 100, volatility: 0.15, unit: "index" },
];
function buildKpiPerformance(): FactKpiPerformance[] {
  const rows: FactKpiPerformance[] = [];
  dimDate.forEach((d, mi) => {
    strategicKpis.forEach((k) => {
      const target = 100;
      const dip = k.perspective === "Internal Process & Governance" && mi >= 9 && mi <= 12 ? -14 : 0;
      const actual = round(target * (1 + range(rand, -k.volatility, k.volatility)) + dip, 1);
      rows.push({ dateKey: d.dateKey, kpiId: k.id, perspective: k.perspective, target, actual });
    });
  });
  return rows;
}
export const factKpiPerformance = buildKpiPerformance();

// ---------- fact_initiatives / fact_projects (portfolio, static list) ----------
export type InitiativeStatus = "On Track" | "At Risk" | "Delayed" | "Completed";
export interface FactInitiative {
  id: string; name: string; priority: string; objective: string; owner: string;
  budget: number; budgetUsed: number; progress: number; status: InitiativeStatus;
  startKey: string; dueKey: string; expectedBenefit: string; realizedBenefit: string;
}
function buildInitiatives(): FactInitiative[] {
  const names = [
    "HHC Scheduling Optimization", "KPI Governance Rollout", "Patient Retention Program",
    "Digital Care Channel Expansion", "Data Quality Remediation", "Referral Pathway Redesign",
    "Capacity Planning Model", "Primary Care Access Improvement", "Revenue Cycle Tightening",
    "Provider Utilization Rebalancing", "Patient Journey SLA Program", "Workforce Planning Refresh",
  ];
  const priorities = ["Operational Excellence", "Growth", "Patient Experience", "Financial Performance", "Digital Enablement"];
  const statuses: InitiativeStatus[] = ["On Track", "On Track", "At Risk", "Delayed", "Completed"];
  return names.map((name, i) => {
    const budget = rangeInt(rand, 400, 3200) * 1000;
    const status = pick(rand, statuses);
    const progress = status === "Completed" ? 100 : rangeInt(rand, 15, 90);
    return {
      id: `INIT-${String(i + 1).padStart(2, "0")}`, name, priority: pick(rand, priorities),
      objective: `Improve ${pick(rand, ["utilization", "retention", "access", "cost efficiency", "data reliability"])}`,
      owner: "Initiative Lead", budget, budgetUsed: Math.round(budget * (progress / 100) * range(rand, 0.85, 1.15)),
      progress, status, startKey: dimDate[rangeInt(rand, 0, 6)].dateKey, dueKey: dimDate[rangeInt(rand, 15, 23)].dateKey,
      expectedBenefit: `${rangeInt(rand, 3, 12)}% improvement target`, realizedBenefit: status === "Completed" ? `${rangeInt(rand, 3, 12)}% achieved` : "In progress",
    };
  });
}
export const factInitiatives = buildInitiatives();

// ---------- Business Analysis tracker (Section 19/27) ----------
export interface BaTrackerItem {
  id: string; currentState: string; gap: string; rootCause: string; recommendation: string;
  owner: string; targetDate: string; status: "Open" | "In Progress" | "At Risk" | "Closed"; expectedImpact: string;
}
export const baTracker: BaTrackerItem[] = [
  { id: "BA-01", currentState: "Referral status is tracked manually across two systems", gap: "No single source of truth for referral-to-appointment conversion", rootCause: "Digital and Home Care referral workflows were built independently", recommendation: "Introduce a shared referral status field written by both systems", owner: "Initiative Lead", targetDate: dimDate[20].dateKey, status: "In Progress", expectedImpact: "Faster, more reliable conversion reporting" },
  { id: "BA-02", currentState: "Clinical capacity is planned at a department level only", gap: "No visibility into which time slots are under-demanded", rootCause: "Scheduling system doesn't expose hourly slot-level data downstream", recommendation: "Extract hourly slot data into the reporting layer", owner: "Initiative Lead", targetDate: dimDate[21].dateKey, status: "Open", expectedImpact: "Better demand-matched staffing" },
  { id: "BA-03", currentState: "KPI definitions vary slightly between Primary Care and HHC KPI files", gap: "Same-named KPIs are not always calculated the same way", rootCause: "KPI Library was built line-by-line before a shared template existed", recommendation: "Reconcile shared KPI definitions into one canonical formula per KPI", owner: "Initiative Lead", targetDate: dimDate[18].dateKey, status: "At Risk", expectedImpact: "Trustworthy cross-line KPI comparison" },
  { id: "BA-04", currentState: "No-show follow-up is inconsistent across branches", gap: "Riyadh has a materially higher no-show rate than Jeddah/Dammam", rootCause: "No standard reminder/rebooking workflow", recommendation: "Standardize a reminder + rebooking SOP across branches", owner: "Initiative Lead", targetDate: dimDate[19].dateKey, status: "Open", expectedImpact: "Reduced no-show rate, recovered capacity" },
];

// ---------- fact_data_quality ----------
export interface FactDataQuality {
  dateKey: string; system: string; dataset: string; completeness: number; accuracy: number;
  duplicateRate: number; missingValueRate: number; validationFailureRate: number; recordsProcessed: number;
}
const dqSources = [
  { system: "Clinical Records System", dataset: "Visits" },
  { system: "Clinical Records System", dataset: "Revenue" },
  { system: "Referral Data Store", dataset: "Referrals" },
  { system: "Scheduling System", dataset: "Appointments" },
];
function buildDataQuality(): FactDataQuality[] {
  const rows: FactDataQuality[] = [];
  dimDate.forEach((d, mi) => {
    dqSources.forEach((s) => {
      const incidentMonth = s.dataset === "Referrals" && mi === 14;
      rows.push({
        dateKey: d.dateKey, system: s.system, dataset: s.dataset,
        completeness: round(clamp(range(rand, 94, 99.5) - (incidentMonth ? 12 : 0), 70, 100), 1),
        accuracy: round(clamp(range(rand, 95, 99.7) - (incidentMonth ? 8 : 0), 70, 100), 1),
        duplicateRate: round(range(rand, 0.1, 1.4) + (incidentMonth ? 3 : 0), 2),
        missingValueRate: round(range(rand, 0.2, 2.1) + (incidentMonth ? 6 : 0), 2),
        validationFailureRate: round(range(rand, 0.1, 1.8) + (incidentMonth ? 5 : 0), 2),
        recordsProcessed: rangeInt(rand, 4000, 42000),
      });
    });
  });
  return rows;
}
export const factDataQuality = buildDataQuality();

// ---------- Workforce (Section 21) ----------
export interface FactWorkforce {
  dateKey: string; deptName: string; locationRegion: string;
  headcount: number; turnover: number; absenteeism: number; trainingCompletion: number; vacancyRate: number;
}
function buildWorkforce(): FactWorkforce[] {
  const rows: FactWorkforce[] = [];
  dimDate.forEach((d) => {
    dimDepartment.forEach((dept) => {
      dimLocation.forEach((loc) => {
        const headcount = rangeInt(rand, 8, 34);
        rows.push({
          dateKey: d.dateKey, deptName: dept.name, locationRegion: loc.region, headcount,
          turnover: round(range(rand, 1, 6), 1), absenteeism: round(range(rand, 1.5, 5.5), 1),
          trainingCompletion: round(clamp(range(rand, 70, 98), 40, 100), 1), vacancyRate: round(range(rand, 2, 12), 1),
        });
      });
    });
  });
  return rows;
}
export const factWorkforce = buildWorkforce();

export { dimDate, dimLocation, dimBusinessLine, dimService, dimDepartment, dimPayer, dimProvider };
