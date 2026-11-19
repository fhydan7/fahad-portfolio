"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { profile } from "@/lib/content/profile";

const primary = [
  { href: "/", label: "Home" },
  { href: "/career", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/dashboard-lab", label: "Dashboards" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/expertise", label: "Skills" },
  { href: "/resume", label: "Resume" },
];
const more = [
  { href: "/about", label: "About Me" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/recruiter", label: "For Recruiters" },
  { href: "/strategy", label: "Strategy Demo" },
  { href: "/kpi-library", label: "KPI Library" },
  { href: "/management-simulation", label: "Management Simulation" },
  { href: "/technical-portfolio", label: "Technical Portfolio" },
  { href: "/research", label: "Research" },
];

export function Nav() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "color-mix(in srgb, var(--bg) 94%, transparent)",
        backdropFilter: "blur(8px)", borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="wrap site-nav-bar">
        <Link href="/" className="serif site-brand" onClick={() => setOpen(false)}>
          Fahad Dahish <span style={{ color: "var(--accent)" }}>·</span>
        </Link>
        <nav className="site-nav-desktop">
          {primary.map((item) => {
            const href = item.href;
            const active = pathname === href;
            return (
              <Link
                key={item.href}
                href={href}
                style={{
                  fontSize: 13.5, color: active ? "var(--text)" : "var(--text-dim)",
                  borderBottom: active ? "2px solid var(--accent)" : "2px solid transparent", paddingBottom: 4,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button aria-label="Toggle theme" onClick={toggle} className="btn btn-ghost btn-sm" style={{ padding: 7 }}>
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <a href={profile.contact.cv} download className="btn btn-ghost btn-sm nav-extra">Download CV</a>
          <Link href="/contact" className="btn btn-primary btn-sm nav-extra">Hire Me</Link>
          <button aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)} className="btn btn-ghost btn-sm nav-burger" style={{ padding: 7 }}>
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="site-nav-mobile">
          {[...primary, { href: "/contact", label: "Contact" }, ...more].map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={pathname === item.href ? "active" : ""}>
              {item.label}
            </Link>
          ))}
          <a href={profile.contact.cv} download>Download CV (PDF)</a>
        </nav>
      )}
    </header>
  );
}
