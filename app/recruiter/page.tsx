import Link from "next/link";
import { profile, whyHireMe } from "@/lib/content/profile";
import { projects } from "@/lib/content/projects";

export const metadata = { title: "For Recruiters" };

export default function RecruiterPage() {
  return (
    <>
      <div className="wrap" style={{ padding: "48px 0 24px", borderBottom: "1px solid var(--border)" }}>
        <div className="eyebrow">For Recruiters &amp; Hiring Managers</div>
        <h1 style={{ fontSize: 32 }}>{profile.role} — Data, Strategy &amp; Performance Management</h1>
        <p className="lede" style={{ marginTop: 14 }}>{profile.subhead}</p>
      </div>
      <section className="wrap" style={{ padding: "40px 0 90px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: 48, alignItems: "start" }}>
        <div>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Why Hire Me</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 40 }}>
            {whyHireMe.map((w) => (
              <div key={w.title} style={{ borderLeft: "2px solid var(--accent)", paddingLeft: 16 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 4 }}>{w.title}</div>
                <div style={{ fontSize: 13, color: "var(--text-dim)" }}>{w.desc}</div>
              </div>
            ))}
          </div>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Top Projects</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {projects.slice(0, 4).map((p) => (
              <Link key={p.slug} href={`/projects/${p.slug}`} className="card">
                <span className="card-tag">{p.category}</span>
                <h3 style={{ fontSize: 15, fontWeight: 600 }}>{p.title}</h3>
                <p style={{ fontSize: 12.5, color: "var(--text-dim)" }}>{p.summary}</p>
                <div style={{ marginTop: "auto", paddingTop: 8, borderTop: "1px solid var(--border)", fontSize: 12 }}>
                  <span className={`status-dot ${p.status}`} />{p.statusLabel}
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          <div className="side-card">
            <h4>Target Roles</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {profile.targetRoles.map((r) => <span key={r} className="tag">{r}</span>)}
            </div>
          </div>
          <div className="side-card">
            <h4>Technology Stack</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {profile.techStack.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
          <div className="side-card">
            <h4>Certifications</h4>
            <ul style={{ paddingLeft: 16, display: "grid", gap: 6 }}>
              {profile.certifications.items.map((c, i) => <li key={i} style={{ fontSize: 12.5, color: "var(--text-dim)" }}>{c}</li>)}
            </ul>
          </div>
          <div className="side-card">
            <h4>Contact</h4>
            <div className="side-row"><span>Location</span><span>{profile.location}</span></div>
            <div className="side-row"><span>LinkedIn</span><a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>Profile</a></div>
            <div className="side-row"><span>Email</span><a href={`mailto:${profile.contact.email}`} style={{ color: "var(--accent)" }}>{profile.contact.email}</a></div>
            <div className="side-row"><span>Phone</span><span>{profile.contact.phone}</span></div>
          </div>
          
          <Link href="/resume" className="btn btn-primary" style={{ justifyContent: "center" }}>View Full Resume</Link>
          <Link href="/contact" className="btn btn-primary" style={{ justifyContent: "center" }}>Get in Touch</Link>
        </div>
      </section>
    </>
  );
}
