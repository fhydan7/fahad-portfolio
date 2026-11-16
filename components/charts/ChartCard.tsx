"use client";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  FunnelChart, Funnel, LabelList, Cell,
} from "recharts";

const COLORS = ["#c9a961", "#4a9b8e", "#8d96a3", "#d6a54c", "#b5524a"];

function ChartShell({ title, meaning, height = 200, children }: { title: string; meaning?: string; height?: number; children: React.ReactNode }) {
  return (
    <div className="card" style={{ gap: 4 }}>
      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{title}</div>
      {meaning && <div style={{ fontSize: 11.5, color: "var(--text-dim)", marginBottom: 4 }}>{meaning}</div>}
      <div style={{ width: "100%", height }}>{children}</div>
    </div>
  );
}

const tooltipStyle = { background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 3, fontSize: 12.5, color: "var(--text)" };

export function TrendChartCard({
  title, meaning, data, series, height,
}: { title: string; meaning?: string; data: Record<string, string | number>[]; series: string[]; height?: number }) {
  return (
    <ChartShell title={title} meaning={meaning} height={height}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="x" tick={{ fill: "var(--text-faint)", fontSize: 11 }} />
          <YAxis tick={{ fill: "var(--text-faint)", fontSize: 11 }} />
          <Tooltip contentStyle={tooltipStyle} />
          {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {series.map((s, i) => (
            <Line key={s} type="monotone" dataKey={s} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function BarComparisonChart({
  title, meaning, data, series, layout = "vertical", height,
}: { title: string; meaning?: string; data: Record<string, string | number>[]; series: string[]; layout?: "vertical" | "horizontal"; height?: number }) {
  return (
    <ChartShell title={title} meaning={meaning} height={height}>
      <ResponsiveContainer>
        <BarChart data={data} layout={layout === "horizontal" ? "vertical" : "horizontal"} margin={{ top: 8, right: 12, left: layout === "horizontal" ? 40 : -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          {layout === "horizontal" ? (
            <>
              <XAxis type="number" tick={{ fill: "var(--text-faint)", fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: "var(--text-faint)", fontSize: 11 }} width={110} />
            </>
          ) : (
            <>
              <XAxis dataKey="name" tick={{ fill: "var(--text-faint)", fontSize: 11 }} />
              <YAxis tick={{ fill: "var(--text-faint)", fontSize: 11 }} />
            </>
          )}
          <Tooltip contentStyle={tooltipStyle} />
          {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {series.map((s, i) => (
            <Bar key={s} dataKey={s} fill={COLORS[i % COLORS.length]} radius={[2, 2, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function FunnelChartCard({ title, meaning, data, height }: { title: string; meaning?: string; data: { name: string; value: number }[]; height?: number }) {
  return (
    <ChartShell title={title} meaning={meaning} height={height}>
      <ResponsiveContainer>
        <FunnelChart>
          <Tooltip contentStyle={tooltipStyle} />
          <Funnel dataKey="value" data={data} isAnimationActive={false}>
            <LabelList position="right" dataKey="name" fill="var(--text-dim)" fontSize={12} />
            <LabelList position="center" dataKey="value" fill="#161207" fontSize={12} />
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}
