import Link from "next/link";
import { caseStudies } from "@/lib/content/caseStudies";

export const metadata = { title: "Case Studies" };

export default function CaseStudiesPage() {
  return (
    <>
      <div className="wrap" style={{ padding: "48px 0 32px", borderBottom: "1px solid var(--border)" }}>
        <div className="eyebrow">Case Studies</div>
        <h1 style={{ fontSize: 34 }}>From business question to measured outcome</h1>
      </div>
      <section className="wrap" style={{ padding: "48px 0 90px", display: "grid", gap: 18 }}>
        {caseStudies.map((c) => (
          <Link key={c.slug} href={`/case-studies/${c.slug}`} className="card">
            <h3 style={{ fontSize: 18, fontWeight: 600 }}>{c.title}</h3>
            <p style={{ fontSize: 14, color: "var(--text-dim)" }}>{c.context}</p>
            <div style={{ fontSize: 12.5, color: "var(--accent)", marginTop: 4 }}>Read case study →</div>
          </Link>
        ))}
      </section>
    </>
  );
}
