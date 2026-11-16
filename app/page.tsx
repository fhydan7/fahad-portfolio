import Link from "next/link";
import { profile, capabilities, timeline } from "@/lib/content/profile";
import { projects } from "@/lib/content/projects";
import { useCases } from "@/lib/content/useCases";
import { dashboardConfigs } from "@/lib/content/dashboardConfigs";

export default function Home() {
  return (
    <>
      <section style={{ padding: "80px 0 60px", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 56 }}>
          <div>
            <div className="eyebrow">{profile.positioning}</div>
            <h1 style={{ fontSize: 42, maxWidth: 620, letterSpacing: "-0.01em" }}>{profile.headline}</h1>
            <p className="lede" style={{ marginTop: 20, fontSize: 16.5 }}>{profile.subhead}</p>
            <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
              <Link href="/projects" className="btn btn-primary">Explore My Work</Link>
              <Link href="/dashboard-lab" className="btn btn-ghost">View Dashboards</Link>
              <a href="/Fahad_Yahya_Dahish_CV.pdf" download className="btn btn-ghost">Download CV</a>
            </div>
          </div>
          <div className="card">
            <div style={{ fontSize: 12, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>At a Glance</div>
            <div className="side-row"><span>Role</span><span>{profile.role}</span></div>
            <div className="side-row"><span>Organization</span><span>{profile.org}</span></div>
            <div className="side-row"><span>Location</span><span>{profile.location}</span></div>
            <div className="side-row"><span>Languages</span><span>{profile.languages}</span></div>
            <div className="side-row"><span>Core KPIs Tracked</span><span>6</span></div>
          </div>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${profile.metrics.length}, 1fr)`, borderBottom: "1px solid var(--border)" }}>
        {profile.metrics.map((m, i) => (
          <div key={i} style={{ padding: "24px 20px", borderRight: i < profile.metrics.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div className="mono" style={{ fontSize: 24, color: "var(--accent)" }}>{m.num}</div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 6 }}>{m.label}</div>
          </div>
        ))}
      </div>

      <section className="wrap" style={{ padding: "72px 0" }}>
        <div className="eyebrow">What I Bring</div>
        <h2 style={{ fontSize: 26, marginBottom: 28 }}>Five capability areas, one decision chain</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, background: "var(--border)", border: "1px solid var(--border)" }}>
          {capabilities.map((c, i) => (
            <Link key={i} href="/expertise" style={{ background: "var(--surface)", padding: "22px 18px", minHeight: 180, display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="mono" style={{ fontSize: 12, color: "var(--accent)" }}>0{i + 1}</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{c.title}</div>
              <p style={{ fontSize: 12.5, color: "var(--text-dim)", flexGrow: 1 }}>{c.desc}</p>
              <div style={{ fontSize: 12, color: "var(--text-faint)", borderTop: "1px solid var(--border)", paddingTop: 8 }}>View evidence →</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ padding: "0 0 72px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          <div><div className="eyebrow">Selected Work</div><h2 style={{ fontSize: 24 }}>Featured Projects</h2></div>
          <Link href="/projects" className="btn btn-ghost btn-sm">All Projects</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
          {projects.map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}`} className="card">
              <span className="card-tag">{p.category}</span>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>{p.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-dim)" }}>{p.summary}</p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 2 }}>
                {p.kpis.map((k) => <span key={k} className="mono" style={{ fontSize: 12, color: "var(--text-dim)" }}>{k}</span>)}
              </div>
              <div style={{ marginTop: "auto", paddingTop: 10, borderTop: "1px solid var(--border)", fontSize: 12.5, display: "flex", justifyContent: "space-between" }}>
                <span><span className={`status-dot ${p.status}`} />{p.statusLabel}</span><span style={{ color: "var(--text-faint)" }}>Case Study →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ padding: "0 0 72px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          <div>
            <div className="eyebrow">Beyond Healthcare</div>
            <h2 style={{ fontSize: 24 }}>Industry Use Cases</h2>
            <p style={{ fontSize: 13, color: "var(--text-faint)", marginTop: 6, maxWidth: 560 }}>
              Illustrative strategic, business, and data analysis case studies across ten different Saudi industries — not real client work, see each page for details.
            </p>
          </div>
          <Link href="/use-cases" className="btn btn-ghost btn-sm">All Use Cases</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
          {useCases.map((u) => (
            <Link key={u.slug} href={`/use-cases/${u.slug}`} className="card" style={{ gap: 6, padding: 16 }}>
              <span className="card-tag" style={{ fontSize: 10 }}>{u.industry}</span>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{u.title}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ padding: "0 0 72px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          <div><div className="eyebrow">Dashboard Lab</div><h2 style={{ fontSize: 24 }}>See My Analytics in Action</h2></div>
          <Link href="/dashboard-lab" className="btn btn-ghost btn-sm">Open Dashboard Lab</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {dashboardConfigs.slice(0, 6).map((d) => (
            <Link key={d.slug} href={`/dashboard-lab/${d.slug}`} className="card">
              <span className="card-tag">Dashboard</span>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>{d.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-dim)" }}>{d.businessQuestion}</p>
              <div style={{ marginTop: "auto", paddingTop: 10, borderTop: "1px solid var(--border)", fontSize: 12.5, color: "var(--accent)" }}>Open Dashboard →</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ padding: "0 0 72px" }}>
        <div className="eyebrow">Career</div>
        <h2 style={{ fontSize: 24, marginBottom: 28 }}>A short timeline</h2>
        <div style={{ borderLeft: "1px solid var(--border)", marginLeft: 6 }}>
          {timeline.map((t, i) => (
            <div key={i} style={{ position: "relative", padding: "0 0 32px 32px" }}>
              <span style={{ position: "absolute", left: -37, top: 4, width: 9, height: 9, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--bg)" }} />
              <div className="mono" style={{ fontSize: 12, color: "var(--text-faint)" }}>{t.period}</div>
              <h3 style={{ fontSize: 17, fontWeight: 600 }}>{t.title}</h3>
              <div style={{ color: "var(--accent)", fontSize: 13.5, marginBottom: 6 }}>{t.org}</div>
              <p style={{ color: "var(--text-dim)", fontSize: 13.5, maxWidth: 620 }}>{t.summary}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: 90 }}>
        <div className="card" style={{ padding: 40, flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div>
            <h2 style={{ fontSize: 22, maxWidth: 480 }}>Hiring for a Data, Strategy, or Performance Management role?</h2>
            <p style={{ color: "var(--text-dim)", fontSize: 13.5, marginTop: 8, maxWidth: 480 }}>The Recruiter View answers who I am, what I solve, and what evidence backs it up — in under a minute.</p>
          </div>
          <Link href="/recruiter" className="btn btn-primary">Open Recruiter View</Link>
        </div>
      </section>
    </>
  );
}
