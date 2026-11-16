"use client";
import { RotateCcw } from "lucide-react";
import { useFilters } from "./FilterContext";
import { ALL, defaultFilters } from "@/lib/data/filters";
import { dimDate, dimLocation, dimBusinessLine, dimService, dimDepartment } from "@/lib/data/dimensions";

const selectStyle: React.CSSProperties = {
  background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 2,
  color: "var(--text)", fontSize: 11.5, padding: "5px 8px", fontFamily: "var(--font-plex-sans)",
};

export function FilterBar() {
  const { filters, setFilters } = useFilters();
  const regions = Array.from(new Set(dimLocation.map((l) => l.region)));

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <select style={selectStyle} value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}>
        {dimDate.map((d) => <option key={d.dateKey} value={d.dateKey}>{d.monthLabel}</option>)}
      </select>
      <span style={{ color: "var(--text-faint)", fontSize: 11 }}>→</span>
      <select style={selectStyle} value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}>
        {dimDate.map((d) => <option key={d.dateKey} value={d.dateKey}>{d.monthLabel}</option>)}
      </select>
      <select style={selectStyle} value={filters.lineKey} onChange={(e) => setFilters({ ...filters, lineKey: e.target.value })}>
        <option value={ALL}>All Lines</option>
        {dimBusinessLine.map((l) => <option key={l.lineKey} value={l.lineKey}>{l.name}</option>)}
      </select>
      <select style={selectStyle} value={filters.region} onChange={(e) => setFilters({ ...filters, region: e.target.value })}>
        <option value={ALL}>All Regions</option>
        {regions.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      <select style={selectStyle} value={filters.locationKey} onChange={(e) => setFilters({ ...filters, locationKey: e.target.value })}>
        <option value={ALL}>All Locations</option>
        {dimLocation.map((l) => <option key={l.locationKey} value={l.locationKey}>{l.name}</option>)}
      </select>
      <select style={selectStyle} value={filters.deptKey} onChange={(e) => setFilters({ ...filters, deptKey: e.target.value })}>
        <option value={ALL}>All Depts</option>
        {dimDepartment.map((d) => <option key={d.deptKey} value={d.deptKey}>{d.name}</option>)}
      </select>
      <select style={selectStyle} value={filters.serviceKey} onChange={(e) => setFilters({ ...filters, serviceKey: e.target.value })}>
        <option value={ALL}>All Services</option>
        {dimService.map((s) => <option key={s.serviceKey} value={s.serviceKey}>{s.name}</option>)}
      </select>
      <button className="btn btn-ghost btn-sm" onClick={() => setFilters(defaultFilters)} title="Reset Filters">
        <RotateCcw size={12} />
      </button>
    </div>
  );
}
