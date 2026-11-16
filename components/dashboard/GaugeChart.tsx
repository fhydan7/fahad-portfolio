"use client";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

export function GaugeChart({
  label, value, unit = "%", max = 100, size = 130,
}: { label: string; value: number; unit?: string; max?: number; size?: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const data = [{ value: pct, fill: "#29b6f6" }];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ width: size, height: size, position: "relative" }}>
        <ResponsiveContainer>
          <RadialBarChart innerRadius="72%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background={{ fill: "rgba(41,182,246,0.12)" }} dataKey="value" cornerRadius={20} fill="#ffd54a" />
          </RadialBarChart>
        </ResponsiveContainer>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <span className="mono" style={{ fontSize: size > 100 ? 20 : 16, color: "#eaf6ff" }}>{value.toFixed(unit === "%" ? 1 : 0)}</span>
          <span style={{ fontSize: 10, color: "#3f6f96" }}>{unit}</span>
        </div>
      </div>
      <div style={{ fontSize: 11.5, color: "#8fc6ea", textAlign: "center", maxWidth: size + 20 }}>{label}</div>
    </div>
  );
}
