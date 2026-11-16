import { notFound } from "next/navigation";
import { useCases } from "@/lib/content/useCases";

export function generateStaticParams() {
  return useCases.map((u) => ({ slug: u.slug }));
}

export default async function UseCaseDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const u = useCases.find((x) => x.slug === slug);
  if (!u) return notFound();

  return (
    <>
      <div className="wrap" style={{ padding: "48px 0 24px", borderBottom: "1px solid var(--border)" }}>
        <span className="card-tag">{u.industry}</span>
        <h1 style={{ fontSize: 28, marginTop: 12, maxWidth: 760 }}>{u.title}</h1>
        <div className="card" style={{ marginTop: 16, maxWidth: 760, background: "var(--surface-2)" }}>
          <p style={{ fontSize: 12.5, color: "var(--text-dim)" }}>
            <strong style={{ color: "var(--text)" }}>Illustrative case study.</strong> This is a hypothetical
            scenario I developed to demonstrate analytical approach — not a real client engagement. Company
            details and figures below are illustrative, not actual results.
          </p>
        </div>
        <p style={{ fontSize: 14, color: "var(--text-dim)", marginTop: 16, maxWidth: 720 }}>{u.saudiContext}</p>
      </div>

      <section className="wrap" style={{ padding: "40px 0 90px", display: "grid", gap: 32, maxWidth: 780 }}>
        <PerspectiveBlock title="Strategic Perspective" accent>
          <Row label="Strategic Priority" value={u.strategic.priority} />
          <Row label="Objective" value={u.strategic.objective} />
          <Row label="Rationale" value={u.strategic.rationale} />
        </PerspectiveBlock>

        <PerspectiveBlock title="Business Analysis Perspective">
          <Row label="Current State" value={u.businessAnalysis.currentState} />
          <Row label="Gap" value={u.businessAnalysis.gap} />
          <Row label="Root Cause" value={u.businessAnalysis.rootCause} />
          <Row label="Recommendation" value={u.businessAnalysis.recommendation} />
        </PerspectiveBlock>

        <PerspectiveBlock title="Data Analysis Perspective">
          <Row label="Business Question" value={u.dataAnalysis.businessQuestion} />
          <Row label="Data" value={u.dataAnalysis.data} />
          <Row label="Method" value={u.dataAnalysis.method} />
          <Row label="KPIs" custom={
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
              {u.dataAnalysis.kpis.map((k) => <span key={k} className="tag">{k}</span>)}
            </div>
          } />
          <Row label="Illustrative Finding" value={u.dataAnalysis.finding} />
        </PerspectiveBlock>

        <PerspectiveBlock title="Why It Matters">
          <p style={{ fontSize: 14, color: "var(--text-dim)" }}>{u.impact}</p>
        </PerspectiveBlock>
      </section>
    </>
  );
}

function PerspectiveBlock({ title, accent, children }: { title: string; accent?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontSize: 19, marginBottom: 14, color: accent ? "var(--accent)" : "var(--text)" }}>{title}</h2>
      <div style={{ display: "grid", gap: 16 }}>{children}</div>
    </div>
  );
}

function Row({ label, value, custom }: { label: string; value?: string; custom?: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
      {custom ?? <p style={{ fontSize: 14, color: "var(--text-dim)", margin: 0 }}>{value}</p>}
    </div>
  );
}
