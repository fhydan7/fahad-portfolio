import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return notFound();

  const rows: [string, string][] = [
    ["Business Context", project.businessContext],
    ["Problem", project.problem],
    ["My Role", project.myRole],
    ["Business Question", project.businessQuestion],
    ["Data", project.data],
    ["Method", project.method],
    ["Finding", project.finding],
    ["Recommendation", project.recommendation],
    ["Impact", project.impact],
    ["Lessons Learned", project.lessonsLearned],
  ];

  return (
    <>
      <div className="wrap" style={{ padding: "48px 0 24px", borderBottom: "1px solid var(--border)" }}>
        <span className="card-tag">{project.category}</span>
        <h1 style={{ fontSize: 30, marginTop: 12 }}>{project.title}</h1>
        <p className="lede" style={{ marginTop: 10 }}>{project.summary}</p>
        <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          {project.technology.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
      </div>
      <section className="wrap" style={{ padding: "40px 0 90px", display: "grid", gap: 28, maxWidth: 760 }}>
        {rows.filter(([, v]) => !v.startsWith("—")).map(([label, val]) => (
          <div key={label}>
            <div style={{ fontSize: 12, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{label}</div>
            <p style={{ fontSize: 14.5, color: "var(--text-dim)" }}>{val}</p>
          </div>
        ))}
        {project.relatedDashboard && (
          <div>
            <Link href={`/dashboard-lab/${project.relatedDashboard}`} className="btn btn-primary" style={{ width: "fit-content" }}>
              View Related Dashboard
            </Link>
            <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 8 }}>
              The linked dashboard uses synthetic demonstration data to illustrate this kind of work — not the real company system.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
