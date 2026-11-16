import { timeline } from "@/lib/content/profile";

export const metadata = { title: "Career" };

export default function CareerPage() {
  return (
    <>
      <div className="wrap" style={{ padding: "48px 0 32px", borderBottom: "1px solid var(--border)" }}>
        <div className="eyebrow">Career Journey</div>
        <h1 style={{ fontSize: 34 }}>Roles, responsibilities, and the problems behind them</h1>
      </div>
      <section className="wrap" style={{ padding: "48px 0 90px" }}>
        <div style={{ borderLeft: "1px solid var(--border)", marginLeft: 6 }}>
          {timeline.map((t, i) => (
            <div key={i} style={{ position: "relative", padding: "0 0 48px 32px" }}>
              <span style={{ position: "absolute", left: -37, top: 4, width: 9, height: 9, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--bg)" }} />
              <div className="mono" style={{ fontSize: 12, color: "var(--text-faint)" }}>{t.period}{t.location ? ` · ${t.location}` : ""}</div>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginTop: 4 }}>{t.title}</h2>
              <div style={{ color: "var(--accent)", fontSize: 14, marginBottom: 12 }}>{t.org}</div>
              <p style={{ color: "var(--text-dim)", fontSize: 14, maxWidth: 660, marginBottom: 14 }}>{t.summary}</p>
              {t.responsibilities.length > 0 && (
                <div className="card" style={{ maxWidth: 660 }}>
                  <div style={{ fontSize: 12, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Responsibilities & Projects</div>
                  <ul style={{ paddingLeft: 18, display: "grid", gap: 6 }}>
                    {t.responsibilities.map((r, j) => <li key={j} style={{ fontSize: 13.5, color: "var(--text-dim)" }}>{r}</li>)}
                  </ul>
                  {t.tools.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                      {t.tools.map((tool) => <span key={tool} className="tag">{tool}</span>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
