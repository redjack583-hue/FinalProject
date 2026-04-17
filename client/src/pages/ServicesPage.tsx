import { useState, useMemo } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { SearchBar } from "@/components/SearchBar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ContentCard } from "@/components/ContentCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import MapComponent from "@/components/MapComponent";

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: api.services.getAll,
  });

  const { data: allFilters = [] } = useQuery({
    queryKey: ["filters"],
    queryFn: api.filters.getAll,
  });

  const serviceCategories = useMemo(() => 
    allFilters.filter((f: any) => f.entityType === "Service" && f.filterType === "Category").map((f: any) => f.name),
    [allFilters]
  );

  const serviceTypes = useMemo(() => 
    allFilters.filter((f: any) => f.entityType === "Service" && f.filterType === "Type").map((f: any) => f.name),
    [allFilters]
  );

  const filtered = useMemo(() => {
    return services.filter((s: any) => {
      const name = s.serviceName || "";
      const description = s.description || "";
      const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || description.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategories.length === 0 || selectedCategories.includes(s.category);
      const matchType = selectedTypes.length === 0 || selectedTypes.includes(s.type);
      return matchSearch && matchCat && matchType;
    });
  }, [search, selectedCategories, selectedTypes, services]);

  return (
    <PublicLayout>
      <div className="bg-secondary/30 py-12 border-b">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl">Our <span className="text-gradient">Services</span></h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Find Indigenous support services in Thunder Bay. From health to education, we're here to help.</p>
              <div className="mt-8 max-w-xl transition-transform duration-500 hover:scale-[1.01]">
                <SearchBar value={search} onChange={setSearch} placeholder="Search services..." />
              </div>
            </div>
            <div className="w-full lg:w-[450px] h-[300px] shrink-0">
              <MapComponent 
                items={filtered.map((s: any) => ({
                  id: s.serviceId,
                  name: s.serviceName,
                  description: s.description,
                  latitude: s.latitude,
                  longitude: s.longitude,
                  category: s.category
                }))} 
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container py-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full shrink-0 lg:w-64">
            <FilterSidebar
              title="Filters"
              filters={[
                { label: "Category", options: serviceCategories, selected: selectedCategories, onChange: setSelectedCategories },
                { label: "Type", options: serviceTypes, selected: selectedTypes, onChange: setSelectedTypes },
              ]}
            />
          </div>
          <div className="flex-1">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : filtered.length === 0 ? (
              <p className="py-12 text-center text-muted-foreground">No services found.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {filtered.map((s: any) => (
                  <ContentCard 
                    key={s.serviceId} 
                    title={s.serviceName} 
                    description={s.description} 
                    badge={s.category} 
                    to={`/services/${s.serviceId}`} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}