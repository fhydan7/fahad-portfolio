"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FilterProvider } from "@/components/dashboard/FilterContext";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { dashboardConfigs } from "@/lib/content/dashboardConfigs";

export default function DashboardLabLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <FilterProvider>
      <div className="cockpit" style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "10px 20px", borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
            <Link href="/dashboard-lab" className={`cockpit-tab ${pathname === "/dashboard-lab" ? "active" : ""}`}>Overview</Link>
            {dashboardConfigs.map((d) => {
              const href = `/dashboard-lab/${d.slug}`;
              return (
                <Link key={d.slug} href={href} className={`cockpit-tab ${pathname === href ? "active" : ""}`}>
                  {d.title.replace(" Dashboard", "").replace(" Performance", "")}
                </Link>
              );
            })}
          </div>
          <FilterBar />
        </div>
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          {children}
        </div>
      </div>
    </FilterProvider>
  );
}
