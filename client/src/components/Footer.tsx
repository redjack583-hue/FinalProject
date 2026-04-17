import { Link } from "react-router-dom";

export function Footer() {
  const links = [
    { label: "Services", to: "/services" },
    { label: "Businesses", to: "/businesses" },
    { label: "Events", to: "/events" },
  ];

  return (
    <footer className="border-t bg-card">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <span className="font-display text-sm text-primary-foreground">TB</span>
              </div>
              <span className="font-display text-lg text-foreground">
                Indigenous Hub
              </span>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              Connecting Thunder Bay's Indigenous community with services, businesses, and events.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm text-foreground">
              Quick Links
            </h4>

            <div className="mt-3 flex flex-col gap-2">
              {links.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm text-foreground">
              Contact
            </h4>

            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              <p>Thunder Bay, Ontario, Canada</p>
              <p>Email: tbaysupporthub@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Thunder Bay Indigenous Support Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}