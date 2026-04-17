import { useEffect, useMemo, useState } from "react";
import { type Business } from "@/data/mockData";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

type PendingBusiness = {
  id: string;
  businessName: string;
  category: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  website?: string;
  createdAt: string;
};

const REQUEST_STORAGE_KEY = "business_requests";

const getPendingRequests = (): PendingBusiness[] => {
  const stored = localStorage.getItem(REQUEST_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as PendingBusiness[];
  } catch {
    return [];
  }
};

const savePendingRequests = (items: PendingBusiness[]) => {
  localStorage.setItem(REQUEST_STORAGE_KEY, JSON.stringify(items));
};

export default function AdminBusinesses() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<"manage" | "requests">("manage");
  const [pendingRequests, setPendingRequests] = useState<PendingBusiness[]>([]);
  const [activeRequest, setActiveRequest] = useState<PendingBusiness | null>(null);

  const empty: any = { businessName: "", description: "", category: "", phone: "", email: "", address: "", isVerified: true };
  const [form, setForm] = useState<any>(empty);

  useEffect(() => {
    setPendingRequests(getPendingRequests());
  }, []);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["businesses"],
    queryFn: api.businesses.getAll,
  });

  const { data: allFilters = [] } = useQuery({
    queryKey: ["filters"],
    queryFn: api.filters.getAll,
  });

  const businessCategories = useMemo(() => 
    allFilters.filter((f: any) => f.entityType === "Business" && f.filterType === "Category").map((f: any) => f.name),
    [allFilters]
  );

  const saveMutation = useMutation({
    mutationFn: (data: any) => editing ? api.businesses.update(editing.businessId, data) : api.businesses.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      setShowForm(false);
      toast.success(editing ? "Business updated" : "Business added");
    },
    onError: () => toast.error("Failed to save business"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: any) => api.businesses.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      toast.success("Business deleted");
    },
    onError: () => toast.error("Failed to delete business"),
  });

  const openAdd = () => { setForm(empty); setEditing(null); setShowForm(true); };
  const openEdit = (b: any) => { setForm({ ...b }); setEditing(b); setShowForm(true); };
  const handleDelete = (id: any) => { if (confirm("Delete this business?")) deleteMutation.mutate(id); };
  const handleSave = () => saveMutation.mutate(form);

  const viewPending = () => {
    setPendingRequests(getPendingRequests());
    setViewMode("requests");
  };

  const acceptRequest = async (request: PendingBusiness) => {
    try {
      await api.businesses.create({
        businessName: request.businessName,
        category: request.category,
        description: request.description,
        phone: request.phone,
        email: request.email,
        address: request.address,
        website: request.website,
      });
      const next = pendingRequests.filter((item) => item.id !== request.id);
      savePendingRequests(next);
      setPendingRequests(next);
      setActiveRequest(null);
      toast.success("Business approved and added.");
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    } catch (error) {
      toast.error("Failed to accept request");
    }
  };

  const rejectRequest = (request: PendingBusiness) => {
    const next = pendingRequests.filter((item) => item.id !== request.id);
    savePendingRequests(next);
    setPendingRequests(next);
    setActiveRequest(null);
    toast.success("Business request rejected.");
  };

  const removeAllRequests = () => {
    savePendingRequests([]);
    setPendingRequests([]);
  };

  const pendingCount = pendingRequests.length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-foreground">Businesses Admin</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("manage")}
            className={`px-3 py-2 rounded-lg text-sm font-semibold ${viewMode === "manage" ? "bg-primary text-primary-foreground" : "bg-secondary/30 text-muted-foreground"}`}
          >
            Manage
          </button>
          <button
            onClick={viewPending}
            className={`px-3 py-2 rounded-lg text-sm font-semibold ${viewMode === "requests" ? "bg-primary text-primary-foreground" : "bg-secondary/30 text-muted-foreground"}`}
          >
            Review Requests ({pendingCount})
          </button>
          <button
            onClick={removeAllRequests}
            className="px-3 py-2 rounded-lg bg-destructive text-white text-sm"
          >
            Clear Requests
          </button>
        </div>
        <button onClick={openAdd} className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Business
        </button>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border bg-card shadow-card">
        {viewMode === "manage" ? (
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-secondary/50">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">Category</th>
                <th className="hidden px-4 py-3 font-medium text-muted-foreground lg:table-cell">Contact</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="py-10 text-center">Loading...</td></tr>
              ) : items.map((b: any) => (
                <tr key={b.businessId} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 text-foreground">{b.businessName}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{b.category}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{b.phone || b.email}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(b)} className="mr-2 rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(b.businessId)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-4">
            {pendingRequests.length === 0 ? (
              <p className="py-12 text-center text-muted-foreground">No pending requests.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-secondary/50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Requested Business</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Submitted</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.map((req) => (
                    <tr key={req.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-foreground">{req.businessName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(req.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setActiveRequest(req)} className="mr-2 rounded-md px-2 py-1 text-xs bg-primary text-primary-foreground">View</button>
                        <button onClick={() => acceptRequest(req)} className="mr-2 rounded-md px-2 py-1 text-xs bg-green-500 text-white">Accept</button>
                        <button onClick={() => rejectRequest(req)} className="rounded-md px-2 py-1 text-xs bg-destructive text-white">Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-elevated animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg text-foreground">{editing ? "Edit" : "Add"} Business</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(["businessName", "category", "description", "phone", "email", "address"] as const).map((field) => (
                <div key={field} className={field === "description" || field === "address" ? "sm:col-span-2" : ""}>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">{field.replace("businessName", "Name")}</label>
                  {field === "category" ? (
                    <select
                      value={form[field] || ""}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select Category</option>
                      {businessCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
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

      {activeRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border bg-card p-6 shadow-elevated animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Pending Request Details</h2>
              <button onClick={() => setActiveRequest(null)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 space-y-3">
              <p><strong>Name:</strong> {activeRequest.businessName}</p>
              <p><strong>Category:</strong> {activeRequest.category}</p>
              <p><strong>Description:</strong> {activeRequest.description}</p>
              <p><strong>Address:</strong> {activeRequest.address}</p>
              <p><strong>Phone:</strong> {activeRequest.phone}</p>
              <p><strong>Email:</strong> {activeRequest.email}</p>
              {activeRequest.website && <p><strong>Website:</strong> {activeRequest.website}</p>}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => rejectRequest(activeRequest)} className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white">Reject</button>
              <button onClick={() => acceptRequest(activeRequest)} className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white">Accept</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}