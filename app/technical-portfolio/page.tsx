"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { dashboardConfigs } from "@/lib/content/dashboardConfigs";
import { profile } from "@/lib/content/profile";

export default function TechnicalPortfolioPage() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <div className="wrap" style={{ padding: "48px 0 24px", borderBottom: "1px solid var(--border)" }}>
        <div className="eyebrow">Technical Portfolio</div>
        <h1 style={{ fontSize: 32 }}>Behind the Dashboard</h1>
        <p className="lede" style={{ marginTop: 10 }}>The data model, KPI logic, and technology behind every dashboard in the Dashboard Lab.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          {profile.techStack.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
      </div>
      <section className="wrap" style={{ padding: "32px 0 90px", display: "grid", gap: 12 }}>
        {dashboardConfigs.map((d) => {
          const isOpen = open === d.slug;
          return (
            <div key={d.slug} className="card" style={{ gap: 10 }}>
              <button
                onClick={() => setOpen(isOpen ? null : d.slug)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0, color: "var(--text)" }}
              >
                <span style={{ fontSize: 15.5, fontWeight: 600 }}>{d.title}</span>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {isOpen && (
                <div style={{ display: "grid", gap: 10, marginTop: 6 }}>
                  <Field label="Business Question" value={d.businessQuestion} />
                  <Field label="Representative Query" value={d.sql} mono />
                  <Field label="KPI Logic & Notes" value={d.technicalNotes} />
                </div>
              )}
            </div>
          );
        })}
      </section>
    </>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
      <pre style={{ fontSize: 13, color: "var(--text-dim)", whiteSpace: "pre-wrap", fontFamily: mono ? "var(--font-plex-mono)" : "inherit", margin: 0 }}>{value}</pre>
    </div>
  );
}
