import Link from "next/link";
import { profile } from "@/lib/content/profile";

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "40px 0", marginTop: 40 }}>
      <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ fontSize: 12, color: "var(--text-faint)" }}>
          © {new Date().getFullYear()} Fahad Dahish — Data &amp; Business Analytics · Strategy &amp; Planning · Performance Management
        </div>
        <div style={{ display: "flex", gap: 22, fontSize: 13, color: "var(--text-dim)" }}>
          <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={`mailto:${profile.contact.email}`}>Email</a>
          <Link href="/recruiter">Recruiter View</Link>
        </div>
      </div>
    </footer>
  );
}
