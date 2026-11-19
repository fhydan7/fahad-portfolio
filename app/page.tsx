import Link from "next/link";
import { profile, timeline } from "@/lib/content/profile";
import { projects } from "@/lib/content/projects";
import { useCases } from "@/lib/content/useCases";
import { dashboardConfigs } from "@/lib/content/dashboardConfigs";

const results = [
  { num: "20%", title: "Higher operational efficiency", desc: "Found the trends and process gaps that were costing time, then fixed them with data." },
  { num: "30%", title: "Faster reporting", desc: "Replaced manual reports with interactive Power BI dashboards across 5 business units." },
  { num: "40%", title: "Fewer data errors", desc: "Built validation and quality checks so leadership can trust every number it sees." },
  { num: "25%", title: "Faster, more accurate reports", desc: "Used SQL and advanced Excel to process datasets of more than 2 million records." },
  { num: "12", title: "Projects delivered", desc: "Turned analysis into clear reports and dashboards that stakeholders acted on." },
  { num: "6", title: "Core KPIs owned", desc: "Defined and tracked revenue growth, cost reduction and customer retention with cross-functional teams." },
];

const value = [
  { n: "01", title: "Find what matters", desc: "I dig through large operational datasets to find the trends, gaps and opportunities a business can act on." },
  { n: "02", title: "Build it to last", desc: "I define the KPIs, validate the data and build dashboards that business units keep using after launch." },
  { n: "03", title: "Make the decision easy", desc: "I present findings in plain business language, so leaders know what to do next, not just what happened." },
];

const skills = [
  { group: "BI & Reporting", items: ["Power BI", "Interactive dashboards", "KPI design", "Executive reporting"] },
  { group: "Data & Analytics", items: ["SQL", "Advanced Excel", "R", "Data validation & quality"] },
  { group: "Business", items: ["Requirements gathering", "Stakeholder presentations", "Performance management", "Healthcare analytics"] },
  { group: "Also", items: ["Java (OOP)", "Web design", "Project management tools", "Arabic & English (fluent)"] },
];

export default function Home() {
  const role = timeline[0];
  return (
    <>
      {/* HERO */}
      <section style={{ padding: "72px 0 56px", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 56, alignItems: "center" }}>
          <div>
            <span className="badge-open">Open to new opportunities</span>
            <h1 style={{ fontSize: 46, marginTop: 20, letterSpacing: "-0.02em", maxWidth: 640 }}>
              I turn complex data into decisions leaders act on.
            </h1>
            <p className="lede" style={{ marginTop: 20, fontSize: 17, maxWidth: 600 }}>
              Senior Data Analyst at {profile.org}, {profile.orgNote}, a healthcare group in Riyadh. I build Power BI dashboards, KPI frameworks and data pipelines that cut reporting time by 30% and data errors by 40%.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
              <a href={profile.contact.cv} download className="btn btn-primary">Download CV</a>
              <a href={`mailto:${profile.contact.email}?subject=Opportunity%20for%20Fahad%20Dahish`} className="btn btn-ghost">Email me</a>
              <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">LinkedIn</a>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 28, flexWrap: "wrap" }}>
              {["Power BI", "SQL", "R", "Advanced Excel", "KPI Design", "Healthcare Analytics"].map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
          <div className="card" style={{ padding: 28, gap: 22 }}>
            <div style={{ fontSize: 12, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Results at a glance</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {[["30%", "faster reporting"], ["40%", "fewer data errors"], ["20%", "higher efficiency"], ["12", "projects delivered"]].map(([n, l]) => (
                <div key={l}><div className="stat-num">{n}</div><div style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 6 }}>{l}</div></div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14, fontSize: 13, color: "var(--text-dim)" }}>
              {profile.role} · {profile.location} · {profile.languages}
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="wrap section">
        <h2 className="section-title">Results I&apos;ve delivered</h2>
        <p className="section-sub">Measured outcomes from my current role at Meena Health, not job descriptions.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: 32 }}>
          {results.map((r) => (
            <div key={r.title} className="card" style={{ gap: 8 }}>
              <div className="stat-num">{r.num}</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{r.title}</div>
              <p style={{ fontSize: 13.5, color: "var(--text-dim)" }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW I CREATE VALUE */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap section">
          <h2 className="section-title">How I create value</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, marginTop: 32 }}>
            {value.map((v) => (
              <div key={v.n}>
                <div className="mono" style={{ fontSize: 13, color: "var(--accent)" }}>{v.n}</div>
                <h3 style={{ fontSize: 20, margin: "8px 0" }}>{v.title}</h3>
                <p style={{ fontSize: 14.5, color: "var(--text-dim)" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="wrap section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <h2 className="section-title">Experience</h2>
          <Link href="/career" className="btn btn-ghost btn-sm">Full experience</Link>
        </div>
        <div className="card" style={{ marginTop: 28, padding: 28, gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div>
              <h3 style={{ fontSize: 22 }}>{role.title}</h3>
              <div style={{ color: "var(--accent)", fontWeight: 500, marginTop: 4 }}>{role.org}</div>
            </div>
            <div className="mono" style={{ fontSize: 13, color: "var(--text-dim)" }}>{role.period} · {role.location}</div>
          </div>
          <ul style={{ paddingLeft: 18, display: "grid", gap: 10, fontSize: 14.5, color: "var(--text-dim)" }}>
            {role.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{role.tools.map((t) => <span key={t} className="tag">{t}</span>)}</div>
        </div>
      </section>

      {/* SKILLS */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap section">
          <h2 className="section-title">Skills</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28, marginTop: 28 }}>
            {skills.map((g) => (
              <div key={g.group}>
                <div style={{ fontSize: 12, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>{g.group}</div>
                <ul style={{ listStyle: "none", display: "grid", gap: 8, fontSize: 14.5 }}>
                  {g.items.map((i) => <li key={i}>{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF OF WORK */}
      <section className="wrap section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h2 className="section-title">See how I work</h2>
            <p className="section-sub">Interactive dashboards built on synthetic demonstration data, so you can judge my design, KPI thinking and storytelling first-hand.</p>
          </div>
          <Link href="/dashboard-lab" className="btn btn-primary btn-sm">Open all dashboards</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: 28 }}>
          {dashboardConfigs.slice(0, 6).map((d) => (
            <Link key={d.slug} href={`/dashboard-lab/${d.slug}`} className="card">
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>{d.title}</h3>
              <p style={{ fontSize: 13.5, color: "var(--text-dim)" }}>{d.businessQuestion}</p>
              <div style={{ marginTop: "auto", paddingTop: 10, fontSize: 13, color: "var(--accent)", fontWeight: 500 }}>Open dashboard →</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: 72 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h2 className="section-title">Range across industries</h2>
            <p className="section-sub">Ten illustrative analyses (strategy, business and data) across Saudi retail, food, sport, government and more. Hypothetical, built to show how I think.</p>
          </div>
          <Link href="/use-cases" className="btn btn-ghost btn-sm">All use cases</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginTop: 24 }}>
          {useCases.map((u) => (
            <Link key={u.slug} href={`/use-cases/${u.slug}`} className="card" style={{ gap: 6, padding: 16 }}>
              <span className="card-tag" style={{ fontSize: 10.5 }}>{u.industry}</span>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{u.title}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* PROJECTS + EDUCATION */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap section" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
          <div>
            <h2 className="section-title" style={{ marginBottom: 20 }}>Education</h2>
            <div style={{ display: "grid", gap: 18 }}>
              {profile.education.items.map((e) => (
                <div key={e.degree} style={{ borderLeft: "3px solid var(--accent)", paddingLeft: 16 }}>
                  <div style={{ fontWeight: 600 }}>{e.degree}</div>
                  <div style={{ fontSize: 14, color: "var(--text-dim)" }}>{e.honor} · {e.school} · {e.detail}</div>
                </div>
              ))}
            </div>
            <h3 style={{ fontSize: 17, margin: "28px 0 12px" }}>Recognition</h3>
            <ul style={{ paddingLeft: 18, display: "grid", gap: 6, fontSize: 14, color: "var(--text-dim)" }}>
              {profile.honors.slice(0, 2).map((h) => <li key={h}>{h}</li>)}
              <li>Published: The Impact of Conversational AI on Business Intelligence (2024)</li>
            </ul>
          </div>
          <div>
            <h2 className="section-title" style={{ marginBottom: 20 }}>Selected projects</h2>
            <div style={{ display: "grid", gap: 14 }}>
              {projects.map((p) => (
                <Link key={p.slug} href={`/projects/${p.slug}`} className="card" style={{ gap: 6 }}>
                  <span className="card-tag">{p.category}</span>
                  <div style={{ fontWeight: 600 }}>{p.title}</div>
                  <p style={{ fontSize: 13.5, color: "var(--text-dim)" }}>{p.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="wrap" style={{ padding: "72px 0 90px" }}>
        <div className="card" style={{ padding: 44, alignItems: "center", textAlign: "center", gap: 16, background: "var(--accent)", borderColor: "var(--accent)", color: "var(--on-accent)" }}>
          <h2 style={{ fontSize: 30, maxWidth: 620, color: "var(--on-accent)" }}>Looking for an analyst who ties data to business results?</h2>
          <p style={{ maxWidth: 520, opacity: 0.9 }}>I&apos;m open to Senior Data Analyst, Business Intelligence and Strategy &amp; Performance roles. Let&apos;s talk.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
            <a href={`mailto:${profile.contact.email}?subject=Opportunity%20for%20Fahad%20Dahish`} className="btn" style={{ background: "var(--on-accent)", color: "var(--accent)" }}>Email me</a>
            <a href={profile.contact.cv} download className="btn" style={{ border: "1px solid var(--on-accent)", color: "var(--on-accent)" }}>Download CV</a>
            <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="btn" style={{ border: "1px solid var(--on-accent)", color: "var(--on-accent)" }}>LinkedIn</a>
          </div>
        </div>
      </section>
    </>
  );
}
