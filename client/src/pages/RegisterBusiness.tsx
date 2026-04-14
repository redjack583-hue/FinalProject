import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

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

const STORAGE_KEY = "business_requests";

const getPendingRequests = (): PendingBusiness[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as PendingBusiness[];
  } catch {
    return [];
  }
};

const savePendingRequests = (items: PendingBusiness[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export default function RegisterBusiness() {
  const navigate = useNavigate();
  const [form, setForm] = useState<PendingBusiness>({
    id: "",
    businessName: "",
    category: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    website: "",
    createdAt: "",
  });
  const { data: allFilters = [] } = useQuery({
    queryKey: ["filters"],
    queryFn: api.filters.getAll,
  });

  const categories = useMemo(() => 
    allFilters.filter((f: any) => f.entityType === "Business" && f.filterType === "Category").map((f: any) => f.name),
    [allFilters]
  );

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.businessName.trim() || !form.email.trim() || !form.category.trim() || !form.address.trim()) {
      toast.error("Please complete required fields.");
      return;
    }

    const newRequest = {
      ...form,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };

    const existing = getPendingRequests();
    const next = [newRequest, ...existing];
    savePendingRequests(next);

    toast.success("Your business request has been submitted for review.");
    setForm({ id: "", businessName: "", category: "", description: "", phone: "", email: "", address: "", website: "", createdAt: "" });
    navigate("/businesses");
  };

  return (
    <div className="container py-12">
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center rounded-lg border border-border bg-background/80 px-3 py-2 text-sm text-foreground transition hover:bg-background">
        ← Back
      </button>
      <h1 className="text-3xl font-display font-bold">Register Your Business</h1>
      <p className="mt-2 text-muted-foreground">Fill in your details and admin will review your listing.</p>

      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-4 rounded-xl border border-secondary bg-slate-950/80 p-6 shadow-card sm:grid-cols-2">
        {[
          { name: "businessName", label: "Business Name", required: true, span: 1 },
          { name: "category", label: "Category", required: true, span: 1 },
          { name: "description", label: "Description", type: "textarea", span: 2 },
          { name: "address", label: "Address", required: true, span: 2 },
          { name: "phone", label: "Phone", span: 1 },
          { name: "email", label: "Email", required: true, span: 1 },
          { name: "website", label: "Website", span: 1 },
        ].map((field) => (
          <div key={field.name} className={field.span === 2 ? "sm:col-span-2" : ""}>
            <label className="mb-1 block text-sm font-medium text-foreground">
              {field.label}
              {field.required ? " *" : ""}
            </label>
            {field.name === "category" ? (
              <>
                <select
                  value={isAddingCategory ? "add_new" : form.category}
                  onChange={(e) => {
                    if (e.target.value === "add_new") {
                      setIsAddingCategory(true);
                      setForm({ ...form, category: "" });
                    } else {
                      setIsAddingCategory(false);
                      setForm({ ...form, category: e.target.value });
                    }
                  }}
                  className="w-full rounded-lg border border-secondary bg-slate-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="add_new">Add new category</option>
                </select>
                {isAddingCategory && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="New category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full rounded-lg border border-secondary bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const trimmed = newCategory.trim();
                        if (!trimmed) return;
                        setForm({ ...form, category: trimmed });
                        setIsAddingCategory(false);
                        setNewCategory("");
                      }}
                      className="mt-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      Add Category
                    </button>
                  </div>
                )}
              </>
            ) : field.type === "textarea" ? (
              <textarea
                value={(form as any)[field.name]}
                onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                className="h-24 w-full rounded-lg border border-secondary bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            ) : (
              <input
                type={field.name === "email" ? "email" : "text"}
                value={(form as any)[field.name]}
                onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                className="w-full rounded-lg border border-secondary bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            )}
          </div>
        ))}

        <button type="submit" className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
          Submit for Review
        </button>
      </form>
    </div>
  );
}
