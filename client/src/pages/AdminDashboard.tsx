import { Briefcase, Building2, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function AdminDashboard() {
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: api.services.getAll });
  const { data: businesses = [] } = useQuery({ queryKey: ["businesses"], queryFn: api.businesses.getAll });
  const { data: events = [] } = useQuery({ queryKey: ["events"], queryFn: api.events.getAll });

  const stats = [
    { label: "Total Services", value: services.length, icon: Briefcase },
    { label: "Total Businesses", value: businesses.length, icon: Building2 },
    { label: "Total Events", value: events.length, icon: Calendar },
  ];
  return (
    <div>
      <h1 className="font-display text-2xl text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Overview of the Indigenous Support Hub.</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
