import { Inbox } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div style={{ border: "1px dashed var(--border)", borderRadius: "var(--radius)", padding: 48, textAlign: "center", color: "var(--text-dim)" }}>
      <Inbox size={22} style={{ margin: "0 auto 12px", color: "var(--text-faint)" }} />
      <div style={{ fontSize: 14, color: "var(--text)", marginBottom: 4 }}>{title}</div>
      {description && <div style={{ fontSize: 13 }}>{description}</div>}
    </div>
  );
}

export function LoadingState({ rows = 3 }: { rows?: number }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 88, width: "100%" }} />
      ))}
    </div>
  );
}
