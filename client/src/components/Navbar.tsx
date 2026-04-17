import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Businesses", to: "/businesses" },
  { label: "Events", to: "/events" },
];

export function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="font-display text-sm font-bold text-primary-foreground">TBay</span>
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Indigenous <span className="text-primary">Hub</span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary/50 ${location.pathname === item.to
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/register-business"
            className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Register Business
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-md p-2 text-muted-foreground hover:bg-secondary md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t bg-card px-4 pb-4 pt-2 md:hidden">
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${location.pathname === item.to
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary"
                }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/register-business"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-md bg-primary px-3 py-2 text-center text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Register Business
          </Link>
        </div>
      )}
    </nav>
  );
}