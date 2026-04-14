import { useState, useMemo } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { SearchBar } from "@/components/SearchBar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ContentCard } from "@/components/ContentCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import MapComponent from "@/components/MapComponent";

export default function BusinessesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data: businesses = [], isLoading } = useQuery({
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

  const filtered = useMemo(() => {
    return businesses.filter((b: any) => {
      const businessName = b.businessName || "";
      const matchSearch = !search || businessName.toLowerCase().includes(search.toLowerCase()) || (b.description && b.description.toLowerCase().includes(search.toLowerCase()));
      const matchCat = selectedCategories.length === 0 || selectedCategories.includes(b.category);
      return matchSearch && matchCat;
    });
  }, [search, selectedCategories, businesses]);

  return (
    <PublicLayout>
      <div className="bg-secondary/30 py-12 border-b">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl">Explore <span className="text-gradient">Businesses</span></h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Discover and support Indigenous-owned businesses in the Thunder Bay area.</p>
              <div className="mt-8 max-w-xl transition-transform duration-500 hover:scale-[1.01]">
                <SearchBar value={search} onChange={setSearch} placeholder="Search businesses..." />
              </div>
            </div>
            <div className="w-full lg:w-[450px] h-[300px] shrink-0">
              <MapComponent 
                items={filtered.map((b: any) => ({
                  id: b.businessId,
                  name: b.businessName,
                  description: b.description,
                  latitude: b.latitude,
                  longitude: b.longitude,
                  category: b.category
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
                { label: "Category", options: businessCategories, selected: selectedCategories, onChange: setSelectedCategories },
              ]}
            />
          </div>
          <div className="flex-1">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : filtered.length === 0 ? (
              <p className="py-12 text-center text-muted-foreground">No businesses found.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {filtered.map((b) => (
                  <ContentCard
                    key={b.businessId}
                    title={b.businessName}
                    description={b.description}
                    badge={b.category}
                    meta={b.phone || b.email || ""}
                    to={`/businesses/${b.businessId}`}
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
