import { useState, useMemo } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { SearchBar } from "@/components/SearchBar";
import { ContentCard } from "@/components/ContentCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { formatEventDate } from "@/lib/date";

type EventRecord = {
  eventId: number | string;
  eventTitle: string;
  eventType?: string;
  eventDate?: string;
  address?: string;
  location?: string;
  description?: string;
};

export default function EventsPage() {
  const [search, setSearch] = useState("");

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: api.events.getAll,
  });

  const filtered = useMemo(() => {
    return events.filter((e: EventRecord) => {
      return !search || e.eventTitle.toLowerCase().includes(search.toLowerCase()) || (e.description && e.description.toLowerCase().includes(search.toLowerCase()));
    });
  }, [search, events]);

  return (
    <PublicLayout>
      <div className="bg-secondary/30 py-12 border-b">
        <div className="container">
          <h1 className="text-4xl lg:text-5xl">Upcoming <span className="text-gradient">Events</span></h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Stay connected with community gatherings, workshops, and celebrations in Thunder Bay.</p>
          <div className="mt-8 max-w-xl transition-transform duration-500 hover:scale-[1.01]">
            <SearchBar value={search} onChange={setSearch} placeholder="Search events..." />
          </div>
        </div>
      </div>

      <div className="container py-12">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">No events found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e: EventRecord) => (
              <ContentCard
                key={e.eventId}
                title={e.eventTitle}
                description={e.description || ""}
                badge={e.eventType}
                meta={`${formatEventDate(e.eventDate)} · ${e.address || e.location || "TBA"}`}
                to={`/events/${e.eventId}`}
              />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
