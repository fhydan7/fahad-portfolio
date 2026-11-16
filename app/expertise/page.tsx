import { expertiseMatrix } from "@/lib/content/expertise";

export const metadata = { title: "Expertise" };

export default function ExpertisePage() {
  return (
    <>
      <div className="wrap" style={{ padding: "48px 0 32px", borderBottom: "1px solid var(--border)" }}>
        <div className="eyebrow">Expertise</div>
        <h1 style={{ fontSize: 34 }}>An evidence-based expertise matrix</h1>
        <p className="lede" style={{ marginTop: 12 }}>No skill percentages — every skill links to where it was actually applied.</p>
      </div>
      <section className="wrap" style={{ padding: "48px 0 90px", display: "grid", gap: 32 }}>
        {expertiseMatrix.map((cat) => (
          <div key={cat.name}>
            <h2 style={{ fontSize: 19, marginBottom: 14 }}>{cat.name}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {cat.skills.map((s) => (
                <div key={s.name} className="card" style={{ gap: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-dim)" }}>{s.evidence}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
