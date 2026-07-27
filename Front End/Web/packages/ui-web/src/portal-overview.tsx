"use client";

import { Badge, Button, EmptyState, Input, Select, Table } from "./primitives";

export interface PortalMetric {
  label: string;
  value: string;
  change: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}

export interface PortalActivity {
  name: string;
  type: string;
  status: string;
  updatedAt: string;
}

export interface PortalOverviewProps {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  metrics: PortalMetric[];
  activities: PortalActivity[];
}

export function PortalOverview({ eyebrow, title, description, actionLabel, metrics, activities }: PortalOverviewProps) {
  return (
    <main className="min-h-screen bg-[var(--ga-background)] text-[var(--ga-foreground)]">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 lg:px-8">
        <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ga-primary)]">{eyebrow}</span>
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="max-w-2xl text-sm leading-6 text-[var(--ga-muted-foreground)]">{description}</p>
          </div>
          <Button size="lg">{actionLabel}</Button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <article key={metric.label} className="grid gap-3 rounded-[var(--ga-radius-lg)] border border-[var(--ga-border)] bg-[var(--ga-surface)] p-5 shadow-[var(--ga-shadow-sm)]">
              <span className="text-sm text-[var(--ga-muted-foreground)]">{metric.label}</span>
              <div className="flex items-end justify-between gap-3">
                <strong className="text-2xl">{metric.value}</strong>
                <Badge tone={metric.tone ?? "neutral"}>{metric.change}</Badge>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <article className="grid gap-4 rounded-[var(--ga-radius-lg)] border border-[var(--ga-border)] bg-[var(--ga-surface)] p-5 shadow-[var(--ga-shadow-sm)]">
            <div><h2 className="font-semibold">Recent activity</h2><p className="mt-1 text-sm text-[var(--ga-muted-foreground)]">Shared table, badge, and responsive layout primitives.</p></div>
            {activities.length ? (
              <Table><thead><tr><th>Name</th><th>Type</th><th>Status</th><th>Updated</th></tr></thead><tbody>
                {activities.map((activity) => <tr key={`${activity.type}-${activity.name}`}><td className="font-medium">{activity.name}</td><td>{activity.type}</td><td><Badge tone="success">{activity.status}</Badge></td><td className="text-[var(--ga-muted-foreground)]">{activity.updatedAt}</td></tr>)}
              </tbody></Table>
            ) : <EmptyState title="No activity yet" description="New records will appear here." action={<Button variant="outline">{actionLabel}</Button>} />}
          </article>

          <aside className="grid content-start gap-4 rounded-[var(--ga-radius-lg)] border border-[var(--ga-border)] bg-[var(--ga-surface)] p-5 shadow-[var(--ga-shadow-sm)]">
            <div><h2 className="font-semibold">Foundation controls</h2><p className="mt-1 text-sm text-[var(--ga-muted-foreground)]">Accessible fields from the shared design system.</p></div>
            <Input label="Search" placeholder="Search resources..." />
            <Select label="Environment" defaultValue="sandbox" options={[{ label: "Sandbox", value: "sandbox" }, { label: "Production", value: "production" }]} />
            <Button variant="secondary" className="w-full">Apply filters</Button>
          </aside>
        </section>
      </div>
    </main>
  );
}
