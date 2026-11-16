import { research } from "@/lib/content/caseStudies";

export const metadata = { title: "Research" };

export default function ResearchPage() {
  return (
    <>
      <div className="wrap" style={{ padding: "48px 0 32px", borderBottom: "1px solid var(--border)" }}>
        <div className="eyebrow">Research</div>
        <h1 style={{ fontSize: 34 }}>Applied AI in Business Intelligence</h1>
      </div>
      <section className="wrap" style={{ padding: "48px 0 90px", display: "grid", gap: 24 }}>
        {research.map((r, i) => (
          <div key={i} className="card" style={{ gap: 14, maxWidth: 700 }}>
            <div className="card-tag">{r.status}</div>
            <h2 style={{ fontSize: 20 }}>{r.topic}</h2>
            <Field label="Problem" value={r.problem} />
            <Field label="Research Question" value={r.researchQuestion} />
            {!r.methodology.startsWith("—") && <Field label="Methodology" value={r.methodology} />}
            <Field label="Technology" value={r.technology.join(", ")} />
            <Field label="Contribution" value={r.contribution} />
            <Field label="Citation" value={r.citation} />
          </div>
        ))}
      </section>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
      <p style={{ fontSize: 13.5, color: "var(--text-dim)" }}>{value}</p>
    </div>
  );
}
