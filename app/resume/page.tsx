import { profile, timeline } from "@/lib/content/profile";
import { research } from "@/lib/content/caseStudies";
import { projects } from "@/lib/content/projects";
import { expertiseMatrix } from "@/lib/content/expertise";
import { PrintButton } from "@/components/ui/PrintButton";

export const metadata = { title: "Resume" };

export default function ResumePage() {
  return (
    <>
      <div className="wrap resume-noprint" style={{ padding: "32px 0 0", display: "flex", justifyContent: "flex-end" }}>
        <PrintButton />
      </div>
      <section className="wrap" style={{ padding: "24px 0 90px", maxWidth: 760 }}>
        <h1 style={{ fontSize: 28 }}>{profile.name}</h1>
        <p style={{ color: "var(--text-dim)", fontSize: 14 }}>{profile.role} · {profile.org} ({profile.orgNote}) · {profile.location}</p>
        <p style={{ color: "var(--text-faint)", fontSize: 12.5, marginTop: 4 }}>
          <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>LinkedIn</a>
          {" · "}<a href={`mailto:${profile.contact.email}`} style={{ color: "var(--accent)" }}>{profile.contact.email}</a>
          {" · "}{profile.contact.phone}
          {" · "}{profile.languages}
        </p>

        <ResumeSection title="Professional Summary">
          <p style={{ fontSize: 14, color: "var(--text-dim)" }}>{profile.subhead}</p>
        </ResumeSection>

        <ResumeSection title="Experience">
          {timeline.map((t, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 600 }}>
                <span>{t.title}</span><span className="mono" style={{ fontSize: 12, color: "var(--text-faint)" }}>{t.period}</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--accent)", marginBottom: 6 }}>{t.org} · {t.location}</div>
              <ul style={{ paddingLeft: 18 }}>
                {t.responsibilities.map((r, j) => <li key={j} style={{ fontSize: 13, color: "var(--text-dim)" }}>{r}</li>)}
              </ul>
            </div>
          ))}
        </ResumeSection>

        <ResumeSection title="Education">
          {profile.education.items.map((ed, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 13.5, color: "var(--text)", fontWeight: 600 }}>{ed.degree} <span style={{ color: "var(--accent)", fontWeight: 400 }}>— {ed.honor}</span></div>
              <div style={{ fontSize: 13, color: "var(--text-dim)" }}>{ed.school} · {ed.detail}</div>
            </div>
          ))}
        </ResumeSection>

        <ResumeSection title="Projects">
          {projects.map((p, i) => (
            <p key={i} style={{ fontSize: 13.5, color: "var(--text-dim)" }}>{p.title}{p.org ? ` — ${p.org}` : ""}</p>
          ))}
        </ResumeSection>

        <ResumeSection title="Skills">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {expertiseMatrix.flatMap((c) => c.skills.map((s) => s.name)).map((s) => <span key={s} className="tag">{s}</span>)}
          </div>
        </ResumeSection>

        <ResumeSection title="Research">
          {research.map((r, i) => (
            <p key={i} style={{ fontSize: 13.5, color: "var(--text-dim)" }}>{r.topic} — {r.status}</p>
          ))}
        </ResumeSection>

        <ResumeSection title="Certifications">
          <ul style={{ paddingLeft: 18 }}>
            {profile.certifications.items.map((c, i) => <li key={i} style={{ fontSize: 13, color: "var(--text-dim)" }}>{c}</li>)}
          </ul>
        </ResumeSection>

        <ResumeSection title="Honors and Awards">
          <ul style={{ paddingLeft: 18 }}>
            {profile.honors.map((h, i) => <li key={i} style={{ fontSize: 13, color: "var(--text-dim)" }}>{h}</li>)}
          </ul>
        </ResumeSection>

        <ResumeSection title="Languages">
          <p style={{ fontSize: 13.5, color: "var(--text-dim)" }}>{profile.languages}</p>
        </ResumeSection>
      </section>
    </>
  );
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
      <h2 style={{ fontSize: 16, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>{title}</h2>
      {children}
    </div>
  );
}
