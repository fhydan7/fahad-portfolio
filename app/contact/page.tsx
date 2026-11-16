"use client";
import { useState } from "react";
import { profile } from "@/lib/content/profile";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "", company: "" }); // company = honeypot
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (form.message.trim().length < 10) e.message = "Message should be at least 10 characters.";
    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (form.company) return; // honeypot triggered — silently drop
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      // No backend wired yet — mailto fallback.
      setSent(true);
    }
  }

  return (
    <>
      <div className="wrap" style={{ padding: "48px 0 32px", borderBottom: "1px solid var(--border)" }}>
        <div className="eyebrow">Contact</div>
        <h1 style={{ fontSize: 34 }}>Let&apos;s Discuss Data, Strategy, and Business Performance.</h1>
      </div>
      <section className="wrap" style={{ padding: "48px 0 90px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
        <div>
          {sent ? (
            <div className="card"><p style={{ fontSize: 14 }}>Thanks — your message is captured locally in this demo. Wire this form to an email service or endpoint to receive it for real.</p></div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }} noValidate>
              <div style={{ position: "absolute", left: -9999 }} aria-hidden="true">
                <label>Company<input tabIndex={-1} autoComplete="off" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></label>
              </div>
              <Field label="Name" error={errors.name}>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="Email" error={errors.email}>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="Message" error={errors.message}>
                <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ ...inputStyle, resize: "vertical" }} />
              </Field>
              <button type="submit" className="btn btn-primary" style={{ width: "fit-content" }}>Send Message</button>
            </form>
          )}
        </div>
        <div className="side-card" style={{ height: "fit-content" }}>
          <h4>Direct Contact</h4>
          <div className="side-row"><span>Name</span><span>{profile.name}</span></div>
          <div className="side-row"><span>Title</span><span>{profile.role}</span></div>
          <div className="side-row"><span>Location</span><span>{profile.location}</span></div>
          <div className="side-row"><span>Email</span><a href={`mailto:${profile.contact.email}`} style={{ color: "var(--accent)" }}>{profile.contact.email}</a></div>
          <div className="side-row"><span>Phone</span><span>{profile.contact.phone}</span></div>
          <div className="side-row"><span>LinkedIn</span><a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>Profile</a></div>
        </div>
      </section>
    </>
  );
}

const inputStyle: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 3, color: "var(--text)", fontSize: 13.5, padding: "10px 12px", fontFamily: "var(--font-plex-sans)" };

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "grid", gap: 6, fontSize: 12.5, color: "var(--text-dim)" }}>
      {label}
      {children}
      {error && <span style={{ color: "var(--neg)", fontSize: 12 }}>{error}</span>}
    </label>
  );
}
