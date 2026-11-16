import { profile } from "@/lib/content/profile";

export const metadata = { title: "About Me" };

export default function AboutPage() {
  return (
    <>
      <div className="wrap" style={{ padding: "48px 0 32px", borderBottom: "1px solid var(--border)" }}>
        <div className="eyebrow">About Me</div>
        <h1 style={{ fontSize: 34 }}>Connecting data, business, and strategy</h1>
      </div>
      <section className="wrap" style={{ padding: "48px 0", display: "grid", gridTemplateColumns: "2fr 1fr", gap: 48, alignItems: "start" }}>
        <div>
          <Block title="Professional Summary">
            <p>I work at the intersection of data analytics, business intelligence, and performance dashboard development — currently as {profile.role} at {profile.org} ({profile.orgNote}), based in {profile.location}.</p>
            <p>My background combines a master&apos;s degree in information technology specializing in business analytics with hands-on experience in data analysis, BI reporting, and dashboard development using Power BI, SQL, Excel, and R.</p>
          </Block>
          <Block title="What I Do">
            <p>I conduct in-depth data analysis to identify trends, patterns, and process-improvement opportunities, and design interactive dashboards that give business units a consistent, timely view of performance.</p>
          </Block>
          <Block title="How I Work">
            <p>I partner with cross-functional teams to define KPIs and track business performance, and treat data validation and quality checks as a standing step before any number reaches a dashboard or a stakeholder.</p>
          </Block>
          <Block title="Industry Experience">
            <p>Healthcare analytics delivered across multiple business lines at a healthcare group in Saudi Arabia.</p>
          </Block>
          <Block title="Professional Interests">
            <p>Applied AI in business intelligence — I published a 2024 journal article on the impact of conversational AI on business intelligence — alongside dashboard development and KPI-driven performance management.</p>
          </Block>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          <div className="side-card">
            <h4>At a Glance</h4>
            <div className="side-row"><span>Role</span><span>{profile.role}</span></div>
            <div className="side-row"><span>Organization</span><span>{profile.org}</span></div>
            <div className="side-row"><span>Location</span><span>{profile.location}</span></div>
            <div className="side-row"><span>Languages</span><span>{profile.languages}</span></div>
          </div>
          <div className="side-card">
            <h4>Education</h4>
            {profile.education.items.map((ed, i) => (
              <div key={i} style={{ marginBottom: i < profile.education.items.length - 1 ? 12 : 0 }}>
                <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 600 }}>{ed.degree}</div>
                <div style={{ fontSize: 12, color: "var(--accent)" }}>{ed.honor}</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{ed.school} · {ed.detail}</div>
              </div>
            ))}
          </div>
          <div className="side-card">
            <h4>Core Systems</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {profile.techStack.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 19, marginBottom: 12 }}>{title}</h2>
      <div style={{ color: "var(--text-dim)", fontSize: 14.5, display: "grid", gap: 8, maxWidth: 660 }}>{children}</div>
    </div>
  );
}
