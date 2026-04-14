import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash2, Tag, Layers, Briefcase, Settings2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminFilters() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("Category");
  const [newEntity, setNewEntity] = useState("Service");

  const { data: filters = [], isLoading } = useQuery({
    queryKey: ["filters"],
    queryFn: api.filters.getAll,
  });

  const createMutation = useMutation({
    mutationFn: api.filters.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filters"] });
      setNewName("");
      toast({ title: "Success", description: "Filter option created." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.filters.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filters"] });
      toast({ title: "Success", description: "Filter option deleted." });
    },
  });

  const handleAdd = () => {
    if (!newName.trim()) return;
    createMutation.mutate({ name: newName.trim(), filterType: newType, entityType: newEntity, isActive: true });
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div></div>;

  const renderFilterList = (entity: string, type: string) => {
    const list = filters.filter((f: any) => f.entityType === entity && f.filterType === type);
    return (
      <div className="space-y-3">
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No items found.</p>
        ) : (
          list.map((f: any) => (
            <div key={f.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <span className="font-medium">{f.name}</span>
              <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(f.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Filter Management</h2>
        <p className="text-muted-foreground">Manage categories and types for services and businesses.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Option</CardTitle>
          <CardDescription>Create a new category or filter type.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Name</label>
              <Input
                placeholder="e.g. Mental Health, Retail, Native-Led"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48 space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Entity</label>
              <Select value={newEntity} onValueChange={setNewEntity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Service">Service</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48 space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">Type</label>
              <Select value={newType} onValueChange={setNewType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Category">Category</SelectItem>
                  <SelectItem value="Type">Type</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAdd} disabled={createMutation.isPending} className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Layers className="h-5 w-5 text-primary" />
            <h3>Service Filters</h3>
          </div>
          <Tabs defaultValue="Category" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="Category">Categories</TabsTrigger>
              <TabsTrigger value="Type">Types</TabsTrigger>
            </TabsList>
            <TabsContent value="Category" className="mt-4">
              {renderFilterList("Service", "Category")}
            </TabsContent>
            <TabsContent value="Type" className="mt-4">
              {renderFilterList("Service", "Type")}
            </TabsContent>
          </Tabs>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Briefcase className="h-5 w-5 text-primary" />
            <h3>Business Filters</h3>
          </div>
          <Tabs defaultValue="Category" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="Category">Categories</TabsTrigger>
            </TabsList>
            <TabsContent value="Category" className="mt-4">
              {renderFilterList("Business", "Category")}
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
}
