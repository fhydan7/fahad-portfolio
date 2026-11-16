import Link from "next/link";
import { useCases } from "@/lib/content/useCases";

export const metadata = { title: "Industry Use Cases" };

export default function UseCasesPage() {
  return (
    <>
      <div className="wrap" style={{ padding: "48px 0 24px", borderBottom: "1px solid var(--border)" }}>
        <div className="eyebrow">Industry Use Cases</div>
        <h1 style={{ fontSize: 34 }}>Applying the same thinking across ten Saudi industries</h1>
        <p className="lede" style={{ marginTop: 12 }}>
          These are illustrative case studies I developed to show how the same strategic, business-analysis, and
          data-analysis approach applies well beyond healthcare — across retail, food and beverage, sports,
          government, and more. <strong>They are not real client engagements</strong> — company names, figures, and
          findings below are hypothetical, written to demonstrate analytical approach, not to report actual results.
        </p>
      </div>
      <section className="wrap" style={{ padding: "40px 0 90px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }}>
          {useCases.map((u) => (
            <Link key={u.slug} href={`/use-cases/${u.slug}`} className="card">
              <span className="card-tag">{u.industry}</span>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>{u.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-dim)" }}>{u.strategic.objective}</p>
              <div style={{ marginTop: "auto", paddingTop: 10, borderTop: "1px solid var(--border)", fontSize: 12, color: "var(--text-faint)", display: "flex", justifyContent: "space-between" }}>
                <span>Illustrative</span><span style={{ color: "var(--accent)" }}>View Analysis →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
