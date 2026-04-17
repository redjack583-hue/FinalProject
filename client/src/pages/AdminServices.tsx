import { useState, useMemo } from "react";
import { type Service } from "@/data/mockData";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function AdminServices() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  const emptyService: any = { serviceName: "", description: "", category: "", address: "", phone: "", email: "", website: "", location: "Thunder Bay, ON", isActive: true };
  const [form, setForm] = useState<any>(emptyService);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: api.services.getAll,
  });

  const { data: allFilters = [] } = useQuery({
    queryKey: ["filters"],
    queryFn: api.filters.getAll,
  });

  const categories = useMemo(() => 
    allFilters.filter((f: any) => f.entityType === "Service" && f.filterType === "Category").map((f: any) => f.name),
    [allFilters]
  );

  const types = useMemo(() => 
    allFilters.filter((f: any) => f.entityType === "Service" && f.filterType === "Type").map((f: any) => f.name),
    [allFilters]
  );

  const saveMutation = useMutation({
    mutationFn: (data: any) => editing ? api.services.update(editing.serviceId, data) : api.services.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setShowForm(false);
      toast.success(editing ? "Service updated" : "Service added");
    },
    onError: () => toast.error("Failed to save service"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: any) => api.services.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service deleted");
    },
    onError: () => toast.error("Failed to delete service"),
  });

  const openAdd = () => { setForm(emptyService); setEditing(null); setShowForm(true); };
  const openEdit = (s: any) => { setForm({ ...s }); setEditing(s); setShowForm(true); };
  const handleDelete = (id: any) => { if (confirm("Delete this service?")) deleteMutation.mutate(id); };
  const handleSave = () => saveMutation.mutate(form);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-foreground">Manage Services</h1>
        <button onClick={openAdd} className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-xl border bg-card shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-secondary/50">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th className="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">Category</th>
              <th className="hidden px-4 py-3 font-medium text-muted-foreground lg:table-cell">Location</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="py-10 text-center">Loading...</td></tr>
            ) : items.map((s: any) => (
              <tr key={s.serviceId} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 text-foreground">{s.serviceName}</td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{s.category}</td>
                <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{s.address || s.location}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(s)} className="mr-2 rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(s.serviceId)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-elevated animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg text-foreground">{editing ? "Edit" : "Add"} Service</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(["serviceName", "category", "type", "description", "address", "phone", "email", "website", "location"] as const).map((field) => (
                <div key={field} className={field === "description" || field === "address" ? "sm:col-span-2" : ""}>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                    {field === "serviceName" ? "Service Name" : field}
                  </label>
                  {field === "category" ? (
                    <select
                      value={form[field] || ""}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  ) : field === "type" ? (
                    <select
                      value={form[field] || ""}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select Type</option>
                      {types.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={form[field] || ""}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">Cancel</button>
              <button onClick={handleSave} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}