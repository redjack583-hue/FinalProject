import { useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Briefcase, Building2, Calendar, LogOut, Settings2 } from "lucide-react";

const adminLinks = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Services", to: "/admin/services", icon: Briefcase },
  { label: "Businesses", to: "/admin/businesses", icon: Building2 },
  { label: "Events", to: "/admin/events", icon: Calendar },
  { label: "Filters", to: "/admin/filters", icon: Settings2 },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token && location.pathname !== "/admin/login") {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 border-r bg-card lg:block">
        <div className="flex h-16 items-center border-b px-5">
          <span className="font-display text-lg text-foreground">Admin Panel</span>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {adminLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t p-3">
          <button 
            onClick={handleLogout} 
            className="flex w-full items-center gap-2.5 rounded-lg border border-destructive/20 px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-card px-6 lg:hidden">
          <span className="font-display text-lg text-foreground">Admin</span>
          <nav className="ml-auto flex items-center gap-2">
            {adminLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-md p-2 ${location.pathname === link.to ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              >
                <link.icon className="h-4 w-4" />
              </Link>
            ))}
            <div className="ml-2 h-4 w-px bg-border"></div>
            <button 
              onClick={handleLogout} 
              className="rounded-md p-2 text-destructive hover:bg-destructive/10"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </nav>
        </header>
        <main className="flex-1 bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
