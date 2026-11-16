export interface Project {
  slug: string;
  category: "Strategy" | "Data Analytics" | "Business Intelligence" | "Healthcare" | "KPI Development" | "Business Analysis";
  title: string;
  org?: string;
  status: "pos" | "warn" | "build";
  statusLabel: string;
  summary: string;
  kpis: string[];
  businessContext: string;
  problem: string;
  myRole: string;
  businessQuestion: string;
  data: string;
  method: string;
  technology: string[];
  finding: string;
  recommendation: string;
  impact: string;
  lessonsLearned: string;
  relatedDashboard?: string; // slug under /dashboard-lab — illustrative synthetic demo only
}

// Only projects named on Fahad's CV are listed here. Additional projects can be
// added through the Admin area as they're confirmed — see the "never invent" rule.
export const projects: Project[] = [
  {
    slug: "multi-business-line-dashboards",
    category: "Business Intelligence",
    org: "Meena Health",
    title: "Multi Business Line Performance Dashboards",
    status: "pos", statusLabel: "Active",
    summary: "Interactive Power BI dashboards supporting data-driven decisions across multiple business units.",
    kpis: ["5 Business Units", "30% Faster Reporting"],
    businessContext: "Business leaders across several units needed a consistent, timely view of performance instead of manual, ad-hoc reporting.",
    problem: "Manual reporting was slow and inconsistent, delaying data-driven decisions across business units.",
    myRole: "Designed and maintained the interactive dashboards and partnered with cross-functional teams to define the underlying KPIs.",
    businessQuestion: "How can dashboard design give leadership a consistent, timely view of performance across business units?",
    data: "Operational and performance data spanning multiple business units.",
    method: "Power BI dashboard design, KPI definition, and data validation.",
    technology: ["Power BI", "SQL", "Excel"],
    finding: "Reporting time was reduced by 30% once dashboards replaced manual reporting, across 5 business units.",
    recommendation: "Extend the same dashboard framework to additional teams and metrics as they're prioritized.",
    impact: "Enabled data-driven decisions across 5 business units.",
    lessonsLearned: "Standardizing the dashboard framework up front saved more time than optimizing individual reports one at a time.",
    relatedDashboard: "healthcare-executive",
  },
  {
    slug: "op-bank-prototype",
    category: "Business Analysis",
    org: "University of Newcastle",
    title: "OP-BANK Prototype — User-Centered Design & Development",
    status: "pos", statusLabel: "Completed, 2024",
    summary: "User-centered design and development of a banking product prototype, completed as part of a Master's program at the University of Newcastle.",
    kpis: ["User-Centered Design"],
    businessContext: "An academic project applying user-centered design methodology to a banking product concept.",
    problem: "— placeholder: add specific problem framing if sharing this project in more depth —",
    myRole: "Designed and developed the prototype following user-centered design principles.",
    businessQuestion: "— placeholder —",
    data: "— placeholder —",
    method: "User-centered design methodology.",
    technology: ["Web Design", "Prototyping"],
    finding: "— placeholder —",
    recommendation: "— placeholder —",
    impact: "— placeholder —",
    lessonsLearned: "— placeholder —",
  },
];

export const projectCategories = ["Strategy", "Data Analytics", "Business Intelligence", "Healthcare", "KPI Development", "Business Analysis"] as const;
