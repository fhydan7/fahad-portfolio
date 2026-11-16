export interface CaseStudy {
  slug: string;
  title: string;
  context: string;
  problem: string;
  whyItMatters: string;
  businessQuestion: string;
  data: string;
  method: string;
  analysis: string;
  findings: string;
  recommendation: string;
  decision: string;
  measurement: string;
  lessonsLearned: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "cutting-reporting-time",
    title: "Cutting Reporting Time Through Interactive Dashboards",
    context: "Several business units relied on manual, ad-hoc reporting to track performance, with no shared dashboard framework.",
    problem: "Manual reporting was slow and inconsistent, delaying data-driven decisions.",
    whyItMatters: "Every day spent compiling a report is a day leadership isn't acting on current information.",
    businessQuestion: "How can dashboard design reduce the time from data to decision across business units?",
    data: "Operational and performance data spanning multiple business units.",
    method: "Designed and maintained interactive Power BI dashboards with clearly defined KPIs, replacing manual report compilation.",
    analysis: "Compared reporting turnaround before and after the dashboards were rolled out across the affected business units.",
    findings: "Reporting time was reduced by 30% across 5 business units.",
    recommendation: "Extend the same dashboard framework to additional teams and metrics as they're prioritized.",
    decision: "Adopted the dashboard framework as the standard for reporting across the supported business units.",
    measurement: "Reporting turnaround time is tracked as an ongoing operational metric.",
    lessonsLearned: "Standardizing the dashboard framework up front saved more time than optimizing individual reports one at a time.",
  },
  {
    slug: "improving-data-reliability",
    title: "Improving Data Reliability Before It Reaches a Dashboard",
    context: "Dashboards and reports are only as trustworthy as the data feeding them, and data quality had not been formally validated.",
    problem: "Inconsistent data accuracy and integrity risked undermining confidence in downstream reports.",
    whyItMatters: "A dashboard leadership doesn't trust doesn't get used, no matter how well it's designed.",
    businessQuestion: "How much can validation and quality checks improve data accuracy and reduce errors before reporting?",
    data: "Datasets exceeding two million records, extracted and transformed via SQL and advanced Excel.",
    method: "Introduced validation and quality checks as a standard step before data reached any dashboard or report.",
    analysis: "Compared error rates and reporting accuracy before and after validation checks were introduced.",
    findings: "Data errors were reduced by 40%, and reporting accuracy and turnaround time improved by 25%.",
    recommendation: "Keep validation as a standing step in the reporting pipeline rather than a one-time cleanup.",
    decision: "Made data validation a standing step before any dashboard or report is published.",
    measurement: "Data accuracy and error rate are tracked as ongoing data-quality indicators.",
    lessonsLearned: "Fixing data quality at the source is cheaper than debugging a dashboard that leadership has already stopped trusting.",
  },
];

export interface ResearchItem {
  topic: string;
  problem: string;
  researchQuestion: string;
  methodology: string;
  data: string;
  technology: string[];
  contribution: string;
  status: string;
  citation: string;
}

export const research: ResearchItem[] = [
  {
    topic: "The Impact of Conversational AI on Business Intelligence",
    problem: "Traditional BI tools require users to already know what question to ask and how to build the right report or dashboard to answer it.",
    researchQuestion: "How does conversational AI transform data interaction and decision-making in business intelligence?",
    methodology: "— placeholder: add methodology detail as appropriate to share publicly —",
    data: "— placeholder —",
    technology: ["Conversational AI", "Business Intelligence tooling"],
    contribution: "Published research examining how conversational AI reshapes the interaction between users and BI systems, and its effect on decision-making.",
    status: "Published, August 2024",
    citation: "Dahish, F. Y. (2024, August). The Impact of Conversational AI on Business Intelligence: Transforming Data Interaction and Decision-Making. Journal for Research on Business and Social Science, 7(8), 1–14.",
  },
];

export const navItems = [
  { id: "home", label: "Home", built: true },
  { id: "about", label: "About Me", built: true },
  { id: "career", label: "Career", built: true },
  { id: "expertise", label: "Expertise", built: true },
  { id: "projects", label: "Projects", built: true },
  { id: "use-cases", label: "Industry Use Cases", built: true },
  { id: "case-studies", label: "Case Studies", built: true },
  { id: "dashboard-lab", label: "Dashboard Lab", built: true },
  { id: "strategy", label: "Strategy", built: true },
  { id: "kpi-library", label: "KPI Library", built: true },
  { id: "management-simulation", label: "Management Simulation", built: true },
  { id: "technical-portfolio", label: "Technical Portfolio", built: true },
  { id: "research", label: "Research", built: true },
  { id: "resume", label: "Resume", built: true },
  { id: "recruiter", label: "For Recruiters", built: true },
  { id: "contact", label: "Contact", built: true },
];
