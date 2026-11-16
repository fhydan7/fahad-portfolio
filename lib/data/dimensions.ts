// ============================================================
// DIMENSION TABLES — star schema, Section 29 of the brief.
// 24 months of history, ending the month before "today" in-app.
// ============================================================

export const MONTHS = 24;

// dim_date: one row per month (the grain the dashboards analyze at)
export interface DimDate {
  dateKey: string; // "2024-09"
  year: number;
  month: number; // 1-12
  monthLabel: string; // "Sep 2024"
  quarter: number;
  isYearStart: boolean;
}

function buildDimDate(): DimDate[] {
  const out: DimDate[] = [];
  const now = new Date();
  // anchor so the dataset always ends "last complete month" relative to app run
  const anchor = new Date(now.getFullYear(), now.getMonth(), 1);
  for (let i = MONTHS - 1; i >= 0; i--) {
    const d = new Date(anchor.getFullYear(), anchor.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    out.push({
      dateKey: `${year}-${String(month).padStart(2, "0")}`,
      year,
      month,
      monthLabel: d.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      quarter: Math.ceil(month / 3),
      isYearStart: month === 1,
    });
  }
  return out;
}

export const dimDate: DimDate[] = buildDimDate();

// dim_location
export interface DimLocation {
  locationKey: string;
  name: string;
  region: "Riyadh" | "Jeddah" | "Dammam";
}
export const dimLocation: DimLocation[] = [
  { locationKey: "LOC-RUH-01", name: "Riyadh Main Branch", region: "Riyadh" },
  { locationKey: "LOC-RUH-02", name: "Riyadh North Branch", region: "Riyadh" },
  { locationKey: "LOC-JED-01", name: "Jeddah Branch", region: "Jeddah" },
  { locationKey: "LOC-DMM-01", name: "Dammam Branch", region: "Dammam" },
];

// dim_business_line
export interface DimBusinessLine {
  lineKey: string;
  name: "Primary Care" | "Home Healthcare" | "Digital Care";
}
export const dimBusinessLine: DimBusinessLine[] = [
  { lineKey: "BL-PRC", name: "Primary Care" },
  { lineKey: "BL-HHC", name: "Home Healthcare" },
  { lineKey: "BL-DIG", name: "Digital Care" },
];

// dim_service
export interface DimService {
  serviceKey: string;
  name: string;
  lineKey: string;
}
export const dimService: DimService[] = [
  { serviceKey: "SVC-GP", name: "General Practice", lineKey: "BL-PRC" },
  { serviceKey: "SVC-PED", name: "Pediatrics", lineKey: "BL-PRC" },
  { serviceKey: "SVC-CHR", name: "Chronic Care Follow-up", lineKey: "BL-PRC" },
  { serviceKey: "SVC-NUR", name: "Nursing Visit", lineKey: "BL-HHC" },
  { serviceKey: "SVC-PHY", name: "Physiotherapy Visit", lineKey: "BL-HHC" },
  { serviceKey: "SVC-WND", name: "Wound Care", lineKey: "BL-HHC" },
  { serviceKey: "SVC-TEL", name: "Teleconsultation", lineKey: "BL-DIG" },
  { serviceKey: "SVC-ERX", name: "e-Prescription Review", lineKey: "BL-DIG" },
];

// dim_department (operational, used by capacity/workforce/data-quality dashboards)
export interface DimDepartment {
  deptKey: string;
  name: string;
}
export const dimDepartment: DimDepartment[] = [
  { deptKey: "DEPT-CLIN", name: "Clinical Operations" },
  { deptKey: "DEPT-SCHED", name: "Scheduling & Access" },
  { deptKey: "DEPT-CS", name: "Contact Center" },
  { deptKey: "DEPT-IT", name: "Data & IT" },
  { deptKey: "DEPT-QA", name: "Quality & Compliance" },
];

// dim_payer
export interface DimPayer {
  payerKey: string;
  name: "Insurance" | "Corporate" | "Cash";
}
export const dimPayer: DimPayer[] = [
  { payerKey: "PAY-INS", name: "Insurance" },
  { payerKey: "PAY-CORP", name: "Corporate" },
  { payerKey: "PAY-CASH", name: "Cash" },
];

// dim_provider (clinical FTEs, used for capacity/HHC)
export interface DimProvider {
  providerKey: string;
  name: string;
  locationKey: string;
  lineKey: string;
}
function buildProviders(): DimProvider[] {
  const out: DimProvider[] = [];
  let n = 1;
  for (const loc of dimLocation) {
    for (const line of dimBusinessLine) {
      const count = line.name === "Home Healthcare" ? 4 : 3;
      for (let i = 0; i < count; i++) {
        out.push({
          providerKey: `PRV-${String(n).padStart(3, "0")}`,
          name: `Provider ${n}`,
          locationKey: loc.locationKey,
          lineKey: line.lineKey,
        });
        n++;
      }
    }
  }
  return out;
}
export const dimProvider: DimProvider[] = buildProviders();

// dim_patient — a synthetic patient population, cohort-tagged by first-seen month
export interface DimPatient {
  patientKey: string;
  firstSeenKey: string; // dateKey of first visit
  lineKey: string;
  locationKey: string;
}

// dim_employee — for the workforce dashboard
export interface DimEmployee {
  employeeKey: string;
  deptKey: string;
  locationKey: string;
  hireKey: string; // dateKey
  ageGroup: "20-29" | "30-39" | "40-49" | "50+";
  jobFamily: "Clinical" | "Operations" | "Support";
}
