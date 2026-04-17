import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { formatEventDate } from "@/lib/date";

type EventRecord = {
  eventId: number | string;
  eventTitle: string;
  eventType: string;
  eventDate: string;
  location: string;
  description: string;
};

type EventForm = Partial<EventRecord>;

const eventFields = ["eventTitle", "eventType", "eventDate", "location", "description"] as const;

const getDefaultEvent = (): EventForm => ({
  eventTitle: "",
  eventType: "",
  eventDate: new Date().toISOString().split("T")[0],
  location: "",
  description: "",
});

export default function AdminEvents() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<EventRecord | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<EventForm>(getDefaultEvent);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: api.events.getAll,
  });

  const saveMutation = useMutation({
    mutationFn: (data: EventForm) => (
      editing
        ? api.events.update(String(editing.eventId), data)
        : api.events.create(data)
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setShowForm(false);
      toast.success(editing ? "Event updated" : "Event added");
    },
    onError: () => toast.error("Failed to save event"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => api.events.delete(String(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event deleted");
    },
    onError: () => toast.error("Failed to delete event"),
  });

  const openAdd = () => { setForm(getDefaultEvent()); setEditing(null); setShowForm(true); };
  const openEdit = (event: EventRecord) => {
    setForm({ ...event, eventDate: event.eventDate?.split("T")[0] });
    setEditing(event);
    setShowForm(true);
  };
  const handleDelete = (id: number | string) => { if (confirm("Delete this event?")) deleteMutation.mutate(id); };
  const handleSave = () => saveMutation.mutate(form);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-foreground">Manage Events</h1>
        <button onClick={openAdd} className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Event
        </button>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border bg-card shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-secondary/50">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Title</th>
              <th className="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">Date</th>
              <th className="hidden px-4 py-3 font-medium text-muted-foreground lg:table-cell">Location</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="py-10 text-center">Loading...</td></tr>
              ) : items.map((e: EventRecord) => (
              <tr key={e.eventId} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 text-foreground">{e.eventTitle}</td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{formatEventDate(e.eventDate)}</td>
                <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{e.location}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(e)} className="mr-2 rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(e.eventId)} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-elevated animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg text-foreground">{editing ? "Edit" : "Add"} Event</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {eventFields.map((field) => (
                <div key={field} className={field === "description" ? "sm:col-span-2" : ""}>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">{field.replace("eventTitle", "Title").replace("eventType", "Type")}</label>
                  <input 
                    type={field === "eventDate" ? "date" : "text"}
                    value={form[field] || ""} 
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })} 
                    className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" 
                  />
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