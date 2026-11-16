export interface DashboardConfig {
  slug: string;
  title: string;
  description: string;
  businessQuestion: string;
  keyKpiIds: string[]; // for the home-page 3-KPI preview
  sql: string;
  technicalNotes: string;
}

export const dashboardConfigs: DashboardConfig[] = [
  {
    slug: "executive-strategy",
    title: "Executive Strategy Dashboard",
    description: "Balanced Scorecard performance across all five perspectives, plus the initiative portfolio.",
    businessQuestion: "Are our strategic objectives and initiatives on track?",
    keyKpiIds: ["achievement", "onTrack", "atRisk"],
    sql: `SELECT kpi_id, perspective, target, actual\nFROM fact_kpi_performance\nWHERE date_key BETWEEN :from AND :to;`,
    technicalNotes: "KPI Achievement Rate is averaged across all tracked strategic KPIs in fact_kpi_performance for the selected period, then grouped by Balanced Scorecard perspective for the scorecard view.",
  },
  {
    slug: "healthcare-executive",
    title: "Healthcare Executive Dashboard",
    description: "Revenue, visits, patient mix, and utilization across all three business lines.",
    businessQuestion: "How is the business performing across care lines?",
    keyKpiIds: ["revenue", "visits", "retention"],
    sql: `SELECT date_key, location_key, line_key, SUM(net_revenue) net_revenue\nFROM fact_revenue\nWHERE date_key BETWEEN :from AND :to\nGROUP BY date_key, location_key, line_key;`,
    technicalNotes: "Revenue, visits, and capacity fact tables are joined on date/location/line keys; retention is calculated from returning vs. unique patients in fact_visits.",
  },
  {
    slug: "home-healthcare",
    title: "Home Healthcare Performance",
    description: "Visit completion, clinical utilization, cost/revenue per visit, and retention for Home Healthcare.",
    businessQuestion: "Are we converting scheduled capacity into completed visits?",
    keyKpiIds: ["completionRate", "utilization", "costPerVisit"],
    sql: `SELECT date_key, location_key, SUM(completed_visits) completed, SUM(planned_visits) planned\nFROM fact_visits\nWHERE line_key = 'BL-HHC' AND date_key BETWEEN :from AND :to\nGROUP BY date_key, location_key;`,
    technicalNotes: "Filtered to line_key = 'BL-HHC' across fact_visits, fact_capacity, fact_cost, fact_revenue, and fact_patient_cohort.",
  },
  {
    slug: "patient-retention",
    title: "Patient Retention",
    description: "Cohort retention matrix, new vs. returning patients, and retention by line of business.",
    businessQuestion: "Which patient segments are we losing, and where?",
    keyKpiIds: ["repeatVisit", "retained12m", "avgVisits"],
    sql: `SELECT cohort_month, line_key, months_since_acquisition, new_in_cohort, retained_in_month\nFROM fact_patient_cohort\nWHERE cohort_month BETWEEN :from AND :to;`,
    technicalNotes: "Cohort matrix is built by pivoting fact_patient_cohort on months_since_acquisition; this extends the brief's original star schema to support cohort analysis (documented in the Data Dictionary).",
  },
  {
    slug: "revenue-profitability",
    title: "Revenue & Profitability",
    description: "Net revenue, margin, and variance by line, location, and payer.",
    businessQuestion: "Where is revenue growing or leaking against target?",
    keyKpiIds: ["net", "grossMargin", "collection"],
    sql: `SELECT payer_key, SUM(net_revenue) net_revenue, SUM(collected_amount) collected\nFROM fact_revenue\nWHERE date_key BETWEEN :from AND :to\nGROUP BY payer_key;`,
    technicalNotes: "fact_revenue and fact_cost share the same date/location/line grain, enabling margin calculation without a separate join key.",
  },
  {
    slug: "capacity-utilization",
    title: "Capacity & Utilization",
    description: "Utilization by location and department, plus weekday/hourly demand patterns.",
    businessQuestion: "Where is available capacity going unused?",
    keyKpiIds: ["utilization", "noShow", "apptCompletion"],
    sql: `SELECT location_key, dept_key, SUM(used_capacity) used, SUM(available_capacity) available\nFROM fact_capacity\nWHERE date_key BETWEEN :from AND :to\nGROUP BY location_key, dept_key;`,
    technicalNotes: "Weekday/hourly views are a modeled pattern layered over fact_capacity, not a literal per-hour fact grain — documented in the Data Dictionary.",
  },
  {
    slug: "patient-journey",
    title: "Patient Journey Performance",
    description: "Stage-by-stage journey duration, SLA compliance, and bottleneck identification.",
    businessQuestion: "Where does the patient journey lose the most time, and where do patients drop off?",
    keyKpiIds: ["totalTime", "sla", "dropOff"],
    sql: `SELECT location_key, AVG(order_to_result) avg_order_to_result\nFROM fact_patient_journey\nWHERE date_key BETWEEN :from AND :to\nGROUP BY location_key;`,
    technicalNotes: "Each stage duration is stored as its own column on fact_patient_journey; the bottleneck is simply the stage with the highest average duration in the filtered set.",
  },
  {
    slug: "business-analysis",
    title: "Business Analysis Tracker",
    description: "Current-state → gap → root cause → recommendation tracker for identified operational issues.",
    businessQuestion: "Which known process gaps are open, and who owns closing them?",
    keyKpiIds: ["open", "atRisk", "total"],
    sql: `-- Tracked as a structured worklist rather than a time-series fact table\nSELECT * FROM ba_tracker WHERE status IN ('Open','At Risk');`,
    technicalNotes: "This tracker is intentionally a worklist, not a time-series fact — it mirrors how business-analysis findings are actually managed.",
  },
  {
    slug: "initiatives",
    title: "Project & Initiative Portfolio",
    description: "Initiative status, budget utilization, and milestone achievement across the active portfolio.",
    businessQuestion: "Which strategic initiatives are on track, at risk, or delayed?",
    keyKpiIds: ["onTrack", "atRisk", "budgetUtil"],
    sql: `SELECT status, COUNT(*) n, SUM(budget) total_budget, SUM(budget_used) used_budget\nFROM fact_initiatives\nGROUP BY status;`,
    technicalNotes: "fact_initiatives doubles as fact_projects in this schema — an initiative and a project are the same underlying record here.",
  },
  {
    slug: "workforce",
    title: "Workforce Analytics",
    description: "Headcount, turnover, absenteeism, and training completion by department and region.",
    businessQuestion: "Is workforce capacity and readiness keeping pace with operational demand?",
    keyKpiIds: ["headcount", "turnover", "training"],
    sql: `SELECT dept_name, AVG(headcount) avg_headcount, AVG(turnover) avg_turnover\nFROM fact_workforce\nWHERE date_key BETWEEN :from AND :to\nGROUP BY dept_name;`,
    technicalNotes: "Workforce data is generated at date × department × region grain, deliberately coarser than clinical fact tables since HR reporting is typically monthly, not transactional.",
  },
  {
    slug: "data-quality",
    title: "Data Quality Dashboard",
    description: "Completeness, accuracy, and validation-failure rates across the platform's core data sources.",
    businessQuestion: "Can this month's KPI numbers be trusted?",
    keyKpiIds: ["score", "completeness", "accuracy"],
    sql: `SELECT system, dataset, completeness, accuracy\nFROM fact_data_quality\nWHERE date_key BETWEEN :from AND :to;`,
    technicalNotes: "A synthetic ingestion incident is deliberately modeled in one month/source so the dashboard has something real to flag — see Section 54's 'do not make every metric positive' rule.",
  },
];

// ---------- Management Simulation (Section 24) ----------
export interface SimulationScenario {
  id: string; title: string; problem: string; relevantData: string; kpis: string[];
  analysis: string; rootCause: string; businessImpact: string; recommendation: string; expectedKpiEffect: string;
}
export const simulationScenarios: SimulationScenario[] = [
  {
    id: "revenue-decline", title: "Revenue Decline",
    problem: "Net revenue for a business line has dropped noticeably against the prior period.",
    relevantData: "fact_revenue, fact_cost, fact_visits filtered to the affected line and period.",
    kpis: ["Net Revenue", "Revenue Growth", "Revenue per Visit", "Payer Mix"],
    analysis: "Decompose the decline into a visit-volume effect and a revenue-per-visit effect, then break both down by location and payer.",
    rootCause: "Typically one of: fewer completed visits (a capacity/demand problem), a shift toward lower-paying payer mix, or a real pricing/discount change.",
    businessImpact: "Margin compresses even if cost stays flat, and the Financial perspective on the Balanced Scorecard moves off-target.",
    recommendation: "If volume-driven: address the underlying capacity/utilization dashboard. If mix-driven: review payer contract terms. If price-driven: confirm the change was intentional.",
    expectedKpiEffect: "Correcting the volume or mix driver should restore Revenue Growth to positive within one to two reporting periods.",
  },
  {
    id: "retention-decline", title: "Patient Retention Decline",
    problem: "The Patient Retention dashboard shows a cohort's retention curve decaying faster than prior cohorts.",
    relevantData: "fact_patient_cohort, fact_visits, segmented by line of business and location.",
    kpis: ["Retention Rate", "Repeat Visit Rate", "Reactivation Rate"],
    analysis: "Compare the affected cohort's decay curve against the platform baseline curve, and check whether the effect is line-specific or region-specific.",
    rootCause: "Often a service-quality or access issue (e.g., longer wait times, a no-show spike) concentrated in one region or line.",
    businessImpact: "Fewer returning patients means acquisition has to work harder just to hold steady visit volume.",
    recommendation: "Target a reactivation campaign at the affected cohort segment while fixing the underlying access/quality driver.",
    expectedKpiEffect: "A successful reactivation push should show up first in Reactivation Rate, then in the next cohort's retention curve.",
  },
  {
    id: "low-hhc-utilization", title: "Low HHC Utilization",
    problem: "Home Healthcare clinical utilization has dropped in a specific region.",
    relevantData: "fact_capacity (DEPT-CLIN), fact_visits filtered to Home Healthcare and the affected region.",
    kpis: ["Clinical Team Utilization", "Visit Completion Rate", "No-Show Rate"],
    analysis: "Check whether available capacity increased (staffing added) without matching demand, or whether completed visits fell while capacity held steady.",
    rootCause: "Usually a scheduling/demand-matching issue rather than a true capacity shortfall.",
    businessImpact: "Available clinical capacity is not being converted into completed, billable visits.",
    recommendation: "Review scheduling demand forecasting and clinical resource allocation in the affected region.",
    expectedKpiEffect: "Utilization should recover toward the platform baseline once scheduling is rebalanced to demand.",
  },
  {
    id: "branch-underperformance", title: "Branch Underperformance",
    problem: "One branch consistently underperforms its peers across multiple KPIs.",
    relevantData: "All fact tables filtered to the underperforming location_key, compared against the other branches.",
    kpis: ["Utilization Rate", "Visit Completion Rate", "Revenue per Visit", "Retention Rate"],
    analysis: "Build a side-by-side branch comparison across the core KPI set to see whether the gap is broad (systemic) or narrow (one specific KPI).",
    rootCause: "A broad gap usually points to local management/staffing; a narrow gap points to a specific process issue.",
    businessImpact: "The underperforming branch drags down the line-of-business average and masks strong performance elsewhere.",
    recommendation: "If broad: escalate for a branch-level operational review. If narrow: fix the specific process (e.g., referral handling, scheduling).",
    expectedKpiEffect: "Closing even the single worst KPI gap should measurably move the business-line average.",
  },
  {
    id: "high-no-show-rate", title: "High No-Show Rate",
    problem: "No-show rate has risen above the internal watch threshold.",
    relevantData: "fact_appointments filtered to the affected period/location/line.",
    kpis: ["No-Show Rate", "Appointment Completion", "Available vs. Used Capacity"],
    analysis: "Check whether the rise is concentrated in specific hours/days (via the weekday/hourly utilization view) or specific services.",
    rootCause: "Commonly a missing reminder/rebooking workflow, or a specific service/time-slot with a structural no-show pattern.",
    businessImpact: "Booked capacity is wasted, and the appointment-completion KPI degrades even though demand exists.",
    recommendation: "Standardize a reminder and rebooking SOP for the affected segment, prioritizing the highest-volume time slots.",
    expectedKpiEffect: "No-Show Rate should trend back toward the ≤10% target within one to two months of a reminder workflow going live.",
  },
  {
    id: "kpi-underperformance", title: "Strategic KPI Underperformance",
    problem: "A Balanced Scorecard perspective's average KPI achievement has fallen below the 90% watch line.",
    relevantData: "fact_kpi_performance filtered to the affected perspective and period.",
    kpis: ["KPI Achievement Rate", "Perspective Score", "Initiatives at Risk"],
    analysis: "Identify which individual KPIs within the perspective are driving the average down, and cross-check against the initiative portfolio for the same objectives.",
    rootCause: "Often a small number of KPIs pulling the perspective average down, frequently tied to At Risk / Delayed initiatives.",
    businessImpact: "The affected perspective becomes the weakest link in strategy execution, disproportionately visible to executive stakeholders.",
    recommendation: "Reprioritize the initiatives mapped to the worst-performing KPIs in the next steering committee cycle.",
    expectedKpiEffect: "Perspective score should recover in proportion to how many of the worst individual KPIs return to target.",
  },
];
