export interface ExpertiseCategory {
  name: string;
  skills: { name: string; evidence: string }[];
}

export const expertiseMatrix: ExpertiseCategory[] = [
  {
    name: "Data Analytics",
    skills: [
      { name: "SQL", evidence: "Used to extract, transform, and report on datasets exceeding two million records." },
      { name: "Advanced Excel", evidence: "Applied alongside SQL for reporting that improved accuracy and turnaround time by 25%." },
      { name: "Data Validation & Quality", evidence: "Validation and quality checks that reduced data errors by 40%." },
      { name: "Trend & Pattern Analysis", evidence: "In-depth analysis of trends and patterns that drove a 20% increase in operational efficiency." },
      { name: "Trend & Variance Analysis", evidence: "Demonstrated live in every Dashboard Lab trend chart (synthetic demonstration data)." },
      { name: "Segmentation", evidence: "Patient cohort segmentation demonstrated in the Patient Retention dashboard (synthetic demonstration data)." },
    ],
  },
  {
    name: "Business Intelligence",
    skills: [
      { name: "Power BI", evidence: "Designed and maintained interactive dashboards enabling data-driven decisions across 5 business units." },
      { name: "Executive & KPI Dashboards", evidence: "Multi Business Line Performance Dashboards, Meena Health." },
      { name: "Data Visualization", evidence: "11 working dashboards in this platform's Dashboard Lab, filter-responsive and config-driven (synthetic demonstration data)." },
      { name: "Performance Reporting", evidence: "Dashboard-driven reporting that cut reporting time by 30% across business units." },
    ],
  },
  {
    name: "Business Analysis",
    skills: [
      { name: "Requirements Gathering", evidence: "Partnered with cross-functional teams to define KPIs across multiple business units." },
      { name: "Stakeholder Communication", evidence: "Presented analytical findings to stakeholders in clear, actionable reports and dashboards." },
      { name: "Process Improvement", evidence: "Identified process-improvement opportunities that drove a 20% efficiency gain." },
      { name: "User-Centered Design", evidence: "OP-BANK prototype, University of Newcastle (2024)." },
    ],
  },
  {
    name: "Strategy & Planning",
    skills: [
      { name: "KPI Frameworks", evidence: "Defined and tracked 6 core metrics including revenue growth, cost reduction, and customer retention." },
      { name: "Performance Tracking", evidence: "Business performance tracked across 5 business units on a recurring basis." },
      { name: "Balanced Scorecard Concepts", evidence: "Demonstrated in this platform's Strategy Command Center (illustrative structure)." },
    ],
  },
  {
    name: "Healthcare Analytics",
    skills: [
      { name: "Healthcare Business Intelligence", evidence: "Healthcare analytics delivered across multiple business lines at a healthcare group in Saudi Arabia." },
      { name: "Dashboard Development", evidence: "Interactive dashboards supporting operational and revenue-driven decisions in a healthcare setting." },
      { name: "Capacity & Retention Analytics", evidence: "Demonstrated in the Dashboard Lab's Home Healthcare and Patient Retention dashboards (synthetic demonstration data)." },
    ],
  },
  {
    name: "Technology",
    skills: [
      { name: "Power BI", evidence: "Primary BI tool for dashboard development." },
      { name: "SQL", evidence: "Core language for data extraction, transformation, and reporting." },
      { name: "Excel", evidence: "Advanced formulas and reporting workflows." },
      { name: "R", evidence: "Statistical and analytical work." },
      { name: "Java (OOP)", evidence: "Object-oriented programming." },
    ],
  },
  {
    name: "Research & AI",
    skills: [
      { name: "Conversational AI in BI", evidence: "Dahish, F. Y. (2024). The Impact of Conversational AI on Business Intelligence: Transforming Data Interaction and Decision-Making. Journal for Research on Business and Social Science, 7(8), 1–14." },
      { name: "Decision Support Concepts", evidence: "Management Simulation and Management Insight Engine in this platform's Dashboard Lab (illustrative)." },
    ],
  },
];
