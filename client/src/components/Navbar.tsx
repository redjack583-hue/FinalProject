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
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl transition-all duration-300">
      <div className="container flex h-20 items-center justify-between">

        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
            <span className="font-display text-sm font-bold text-primary-foreground">TBay</span>
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Indigenous <span className="text-primary">Hub</span>
          </span>
        </Link>

        {/* desktop */}
        <div className="hidden items-center gap-2 md:flex">
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-all hover:bg-secondary/50 ${location.pathname === item.to
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/register-business"
            className="relative rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-105 hover:shadow-xl"
          >
            Register Business
          </Link>
        </div>

        {/* mobile button */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-md p-2 text-muted-foreground hover:bg-secondary md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* mobile menu */}
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
            className="mt-2 block rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 px-3 py-2 text-center text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:scale-105"
          >
            Register Business
          </Link>
        </div>
      )}
    </nav>
  );
}
