import Link from "next/link";
import { projects } from "@/lib/content/projects";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <>
      <div className="wrap" style={{ padding: "48px 0 32px", borderBottom: "1px solid var(--border)" }}>
        <div className="eyebrow">Project Portfolio</div>
        <h1 style={{ fontSize: 34 }}>Work, structured the way it was actually done</h1>
      </div>
      <section className="wrap" style={{ padding: "48px 0 90px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }}>
          {projects.map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}`} className="card">
              <span className="card-tag">{p.category}</span>
              <h3 style={{ fontSize: 16.5, fontWeight: 600 }}>{p.title}</h3>
              <p style={{ fontSize: 13.5, color: "var(--text-dim)" }}>{p.summary}</p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                {p.kpis.map((k) => <span key={k} className="mono" style={{ fontSize: 12, color: "var(--text-dim)" }}>{k}</span>)}
              </div>
              <div style={{ marginTop: "auto", paddingTop: 10, borderTop: "1px solid var(--border)", fontSize: 12.5, display: "flex", justifyContent: "space-between" }}>
                <span><span className={`status-dot ${p.status}`} />{p.statusLabel}</span><span style={{ color: "var(--text-faint)" }}>Read Case Study →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
