"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { navItems } from "@/lib/content/caseStudies";

export function Nav() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const items = navItems.filter((n) => n.id !== "contact" && n.id !== "recruiter");
  const hrefOf = (id: string) => (id === "home" ? "/" : `/${id}`);

  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: theme === "dark" ? "rgba(14,17,22,0.96)" : "rgba(247,246,243,0.96)",
        backdropFilter: "blur(8px)", borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="wrap site-nav-bar">
        <Link href="/" className="serif site-brand" onClick={() => setOpen(false)}>
          Fahad Dahish <span style={{ color: "var(--accent)" }}>·</span>
        </Link>
        <nav className="site-nav-desktop">
          {items.map((item) => {
            const href = hrefOf(item.id);
            const active = pathname === href;
            return (
              <Link
                key={item.id}
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
          <Link href="/recruiter" className="btn btn-ghost btn-sm nav-extra">For Recruiters</Link>
          <Link href="/contact" className="btn btn-primary btn-sm nav-extra">Contact Me</Link>
          <button aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)} className="btn btn-ghost btn-sm nav-burger" style={{ padding: 7 }}>
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="site-nav-mobile">
          {navItems.map((item) => {
            const href = hrefOf(item.id);
            return (
              <Link key={item.id} href={href} onClick={() => setOpen(false)} className={pathname === href ? "active" : ""}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
