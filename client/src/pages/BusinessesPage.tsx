import { useState, useMemo } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { SearchBar } from "@/components/SearchBar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ContentCard } from "@/components/ContentCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import MapComponent from "@/components/MapComponent";

type FilterOption = {
  entityType: string;
  filterType: string;
  name: string;
};

type BusinessRecord = {
  businessId: number | string;
  businessName?: string;
  description?: string;
  category?: string;
  phone?: string;
  email?: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  Latitude?: number | string | null;
  Longitude?: number | string | null;
  lat?: number | string | null;
  lng?: number | string | null;
};

type BusinessMapItem = {
  id: number | string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  category?: string;
};

const thunderBayCenter: [number, number] = [48.3809, -89.2477];

const toCoordinate = (value: unknown) => {
  const coordinate = typeof value === "number" ? value : Number(value);
  return Number.isFinite(coordinate) ? coordinate : null;
};

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
    allFilters
      .filter((f: FilterOption) => f.entityType === "Business" && f.filterType === "Category")
      .map((f: FilterOption) => f.name),
    [allFilters]
  );

  const filtered = useMemo(() => {
    return businesses.filter((b: BusinessRecord) => {
      const businessName = b.businessName || "";
      const matchSearch = !search || businessName.toLowerCase().includes(search.toLowerCase()) || (b.description && b.description.toLowerCase().includes(search.toLowerCase()));
      const matchCat = selectedCategories.length === 0 || selectedCategories.includes(b.category);
      return matchSearch && matchCat;
    });
  }, [search, selectedCategories, businesses]);

  const mapItems = useMemo(() => {
    return filtered.reduce<BusinessMapItem[]>((items, business) => {
      const latitude = toCoordinate(business.latitude ?? business.Latitude ?? business.lat);
      const longitude = toCoordinate(business.longitude ?? business.Longitude ?? business.lng);

      if (latitude === null || longitude === null) return items;

      items.push({
        id: business.businessId,
        name: business.businessName || "",
        description: business.description,
        latitude,
        longitude,
        category: business.category,
      });

      return items;
    }, []);
  }, [filtered]);

  const mapCenter = useMemo<[number, number]>(() => {
    if (mapItems.length === 0) return thunderBayCenter;

    const totals = mapItems.reduce(
      (sum, item) => ({
        latitude: sum.latitude + item.latitude,
        longitude: sum.longitude + item.longitude,
      }),
      { latitude: 0, longitude: 0 }
    );

    return [
      totals.latitude / mapItems.length,
      totals.longitude / mapItems.length,
    ];
  }, [mapItems]);

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
                items={mapItems}
                center={mapCenter}
                zoom={mapItems.length > 1 ? 11 : 13}
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
                {filtered.map((b: BusinessRecord) => (
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