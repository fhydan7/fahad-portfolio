import { notFound } from "next/navigation";
import { caseStudies } from "@/lib/content/caseStudies";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export default async function CaseStudyDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) return notFound();

  const rows: [string, string][] = [
    ["Context", cs.context], ["Problem", cs.problem], ["Why It Matters", cs.whyItMatters],
    ["Business Question", cs.businessQuestion], ["Data", cs.data], ["Method", cs.method],
    ["Analysis", cs.analysis], ["Findings", cs.findings], ["Recommendation", cs.recommendation],
    ["Decision", cs.decision], ["Measurement", cs.measurement], ["Lessons Learned", cs.lessonsLearned],
  ];

  return (
    <>
      <div className="wrap" style={{ padding: "48px 0 24px", borderBottom: "1px solid var(--border)" }}>
        <div className="eyebrow">Case Study</div>
        <h1 style={{ fontSize: 28, maxWidth: 760 }}>{cs.title}</h1>
      </div>
      <section className="wrap" style={{ padding: "40px 0 90px", display: "grid", gap: 26, maxWidth: 760 }}>
        {rows.filter(([, v]) => !v.startsWith("—")).map(([label, val]) => (
          <div key={label}>
            <div style={{ fontSize: 12, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{label}</div>
            <p style={{ fontSize: 14.5, color: "var(--text-dim)" }}>{val}</p>
          </div>
        ))}
      </section>
    </>
  );
}
