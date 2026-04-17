import { Navigation } from "lucide-react";

interface LocationMapProps {
  address?: string;
  title?: string;
}

export function LocationMap({ address, title }: LocationMapProps) {
  if (!address) return null;

  const getDirectionsUrl = (addr: string) => {
    return `https://www.google.com/maps/search/${encodeURIComponent(addr)}`;
  };

  const embedUrl = `https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(address)}&key=AIzaSyDummyKeyNotNeeded`;

  return (
    <div className="mt-8 rounded-xl border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 font-semibold text-foreground">
          📍 Location
        </h3>
        <a
          href={getDirectionsUrl(address)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Navigation className="h-4 w-4" />
          Get Directions
        </a>
      </div>
      <div className="w-full rounded-lg overflow-hidden bg-secondary/20">
        <iframe
          width="100%"
          height="300"
          frameBorder="0"
          src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ border: 0 }}
        ></iframe>
      </div>
    </div>
  );
}