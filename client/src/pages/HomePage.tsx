import { useState } from "react";
import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/PublicLayout";
import { SearchBar } from "@/components/SearchBar";
import { ContentCard } from "@/components/ContentCard";
import { Briefcase, Building2, Calendar, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const quickCards = [
  { title: "Find Services", description: "Access health, education, legal, and community support services.", icon: Briefcase, to: "/services" },
  { title: "Explore Businesses", description: "Discover Indigenous-owned businesses in Thunder Bay.", icon: Building2, to: "/businesses" },
  { title: "View Events", description: "Stay connected with community events and gatherings.", icon: Calendar, to: "/events" },
];

export default function HomePage() {
  const [search, setSearch] = useState("");

  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: api.services.getAll });
  const { data: businesses = [] } = useQuery({ queryKey: ["businesses"], queryFn: api.businesses.getAll });
  const { data: events = [] } = useQuery({ queryKey: ["events"], queryFn: api.events.getAll });

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background py-24 md:py-32">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-accent/10 blur-[120px]" />
          <div className="absolute top-[20%] right-[10%] h-[30%] w-[30%] rounded-full bg-secondary/30 blur-[100px]" />
        </div>
        
        <div className="container relative z-10 text-center animate-fade-in">
          <h1 className="text-4xl leading-[1.1] md:text-6xl lg:text-7-xl">
            Thunder Bay Indigenous<br />
            <span className="text-gradient">Support Hub</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Your gateway to Indigenous services, businesses, and community events in Thunder Bay. Find what you need, all in one place.
          </p>
          <div className="mx-auto mt-10 max-w-xl transition-transform duration-500 hover:scale-[1.01]">
            <SearchBar value={search} onChange={setSearch} placeholder="Search services, businesses, or events..." />
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="container -mt-12 mb-16 relative z-20">
        <div className="grid gap-6 md:grid-cols-3">
          {quickCards.map((card, index) => (
            <Link
              key={card.to}
              to={card.to}
              style={{ animationDelay: `${index * 100}ms` }}
              className="group flex flex-col items-start rounded-2xl border bg-card p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover animate-fade-in"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/5 transition-colors group-hover:bg-primary/10">
                <card.icon className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
              </div>
              <h3 className="mt-6 text-xl">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Sections */}
      <div className="space-y-24 pb-24">
        {/* Featured Services */}
        <section className="container">
          <div className="flex items-end justify-between border-b pb-6">
            <div>
              <h2 className="text-3xl">Featured Services</h2>
              <p className="mt-2 text-muted-foreground">Essential support for the local Indigenous community.</p>
            </div>
            <Link to="/services" className="group flex items-center gap-1 text-sm font-semibold text-primary">
              View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services?.slice(0, 3).map((s: any) => (
              <ContentCard key={s.id || s.serviceId} title={s.name} description={s.description} badge={s.category} to={`/services/${s.id || s.serviceId}`} />
            ))}
          </div>
        </section>

        {/* Featured Businesses */}
        <section className="container">
          <div className="flex items-end justify-between border-b pb-6">
            <div>
              <h2 className="text-3xl">Featured Businesses</h2>
              <p className="mt-2 text-muted-foreground">Support local Indigenous entrepreneurs and organizations.</p>
            </div>
            <Link to="/businesses" className="group flex items-center gap-1 text-sm font-semibold text-primary">
              View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {businesses?.slice(0, 3).map((b: any) => (
              <ContentCard key={b.id || b.businessId} title={b.name} description={b.description} badge={b.category} to={`/businesses/${b.id || b.businessId}`} />
            ))}
          </div>
        </section>

        {/* Featured Events */}
        <section className="container">
          <div className="flex items-end justify-between border-b pb-6">
            <div>
              <h2 className="text-3xl">Upcoming Events</h2>
              <p className="mt-2 text-muted-foreground">Stay connected with your community gatherings.</p>
            </div>
            <Link to="/events" className="group flex items-center gap-1 text-sm font-semibold text-primary">
              View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events?.slice(0, 3).map((e: any) => (
              <ContentCard key={e.id || e.eventId} title={e.title} description={e.description} badge={e.category} meta={`${e.date} · ${e.location}`} to={`/events/${e.id || e.eventId}`} />
            ))}
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
