"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { navItems } from "@/lib/content/caseStudies";

export function Nav() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: theme === "dark" ? "rgba(14,17,22,0.92)" : "rgba(247,246,243,0.92)",
        backdropFilter: "blur(8px)", borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <Link href="/" className="serif" style={{ fontSize: 18, fontWeight: 600 }}>
          Fahad Yahya Dahish <span style={{ color: "var(--accent)" }}>·</span>
        </Link>
        <nav style={{ display: "flex", gap: 22, alignItems: "center" }} className="hidden lg:flex">
          {navItems.filter((n) => n.id !== "contact" && n.id !== "recruiter").map((item) => {
            const href = item.id === "home" ? "/" : `/${item.id}`;
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
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button aria-label="Toggle theme" onClick={toggle} className="btn btn-ghost btn-sm" style={{ padding: 7 }}>
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <Link href="/recruiter" className="btn btn-ghost btn-sm">For Recruiters</Link>
          <Link href="/contact" className="btn btn-primary btn-sm">Contact Me</Link>
        </div>
      </div>
    </header>
  );
}
