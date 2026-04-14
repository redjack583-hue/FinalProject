import { useParams, Link } from "react-router-dom";
import { PublicLayout } from "@/components/PublicLayout";
import { LocationMap } from "@/components/LocationMap";
import { ArrowLeft, MapPin, Phone, Mail, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function DetailsPage() {
  const { type, id } = useParams<{ type: string; id: string }>();

  const { data: rawItem, isLoading } = useQuery({
    queryKey: ["item", type, id],
    queryFn: () => {
      if (type === "services") return api.services.getById(id!);
      if (type === "businesses") return api.businesses.getById(id!);
      if (type === "events") return api.events.getById(id!);
      return Promise.reject("Invalid type");
    },
    enabled: !!type && !!id,
  });

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </PublicLayout>
    );
  }

  let item: any = null;
  let fields: { icon: any; label: string; value: string }[] = [];
  let address: string | undefined = undefined;

  if (rawItem) {
    if (type === "services") {
      item = { title: rawItem.serviceName, description: rawItem.description, badge: rawItem.category };
      if (rawItem.address) {
        fields.push({ icon: MapPin, label: "Address", value: rawItem.address });
        address = rawItem.address;
      }
      if (rawItem.phone) fields.push({ icon: Phone, label: "Phone", value: rawItem.phone });
      if (rawItem.email) fields.push({ icon: Mail, label: "Email", value: rawItem.email });
      if (rawItem.website) fields.push({ icon: Clock, label: "Website", value: rawItem.website });
      if (rawItem.location && !rawItem.address) fields.push({ icon: MapPin, label: "Location", value: rawItem.location });
    } else if (type === "businesses") {
      item = { title: rawItem.businessName, description: rawItem.description, badge: rawItem.category };
      if (rawItem.address) {
        fields.push({ icon: MapPin, label: "Address", value: rawItem.address });
        address = rawItem.address;
      }
      if (rawItem.phone) fields.push({ icon: Phone, label: "Phone", value: rawItem.phone });
      if (rawItem.email) fields.push({ icon: Mail, label: "Email", value: rawItem.email });
    } else if (type === "events") {
      item = { title: rawItem.eventTitle, description: rawItem.description, badge: rawItem.eventType };
      const dateStr = rawItem.eventDate ? new Date(rawItem.eventDate).toLocaleDateString() : "TBD";
      fields.push({ icon: Clock, label: "Date", value: dateStr });
      if (rawItem.address) {
        fields.push({ icon: MapPin, label: "Address", value: rawItem.address });
        address = rawItem.address;
      } else if (rawItem.location) {
        fields.push({ icon: MapPin, label: "Location", value: rawItem.location });
      }
    }
  }

  if (!item) {
    return (
      <PublicLayout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Item not found.</p>
          <Link to="/" className="mt-4 inline-block text-sm font-medium text-primary">Go Home</Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container max-w-2xl py-10">
        <Link to={`/${type}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="mt-6">
          {item.badge && (
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {item.badge}
            </span>
          )}
          <h1 className="mt-3 font-display text-3xl text-foreground">{item.title}</h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">{item.description}</p>
        </div>
        {fields.length > 0 && (
          <div className="mt-8 space-y-3 rounded-xl border bg-card p-5 shadow-card">
            {fields.map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <f.icon className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{f.label}</p>
                  <p className="text-sm text-foreground">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {address && (
          <LocationMap address={address} title={item?.title} />
        )}
      </div>
    </PublicLayout>
  );
}
