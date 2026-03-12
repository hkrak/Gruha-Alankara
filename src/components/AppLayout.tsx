import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Home, Camera, Wand2, BookOpen, Video, PiggyBank, Menu, X, Sparkles } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/analyze", label: "Analyze Room", icon: Camera },
  { path: "/design", label: "Design Studio", icon: Wand2 },
  { path: "/catalog", label: "My Catalog", icon: BookOpen },
  { path: "/ar-camera", label: "Live AR", icon: Video },
  { path: "/budget", label: "Budget Planner", icon: PiggyBank },
];

const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(230 25% 8%)" }}>
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 border-b"
        style={{
          background: "hsl(228 25% 10% / 0.97)",
          borderColor: "hsl(228 18% 20%)",
          backdropFilter: "blur(12px)"
        }}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-xs"
              style={{ background: "var(--gradient-gold)", color: "hsl(230 25% 8%)" }}>
              GA
            </div>
            <div>
              <span className="font-display text-lg font-semibold leading-none"
                style={{ color: "hsl(45 30% 92%)" }}>
                Gruha Alankara
              </span>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" style={{ color: "hsl(36 85% 55%)" }} />
                <span className="font-body text-xs" style={{ color: "hsl(36 85% 55%)" }}>
                  AI Interior Design
                </span>
              </div>
            </div>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-gold shadow-gold"
                      : "hover:opacity-80"
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive ? "hsl(36 85% 55% / 0.12)" : "transparent",
                  color: isActive ? "hsl(36 85% 55%)" : "hsl(220 15% 65%)",
                  border: isActive ? "1px solid hsl(36 85% 55% / 0.3)" : "1px solid transparent"
                })}>
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: "hsl(45 30% 80%)" }}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t px-4 py-4 space-y-1 animate-fade-in"
            style={{
              background: "hsl(228 22% 11%)",
              borderColor: "hsl(228 18% 20%)"
            }}>
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm font-medium transition-all ${
                    isActive ? "" : ""
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive ? "hsl(36 85% 55% / 0.12)" : "transparent",
                  color: isActive ? "hsl(36 85% 55%)" : "hsl(220 15% 65%)"
                })}>
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t py-5 text-center font-body text-xs"
        style={{
          background: "hsl(228 25% 10%)",
          borderColor: "hsl(228 18% 20%)",
          color: "hsl(220 15% 45%)"
        }}>
        © 2025 <span style={{ color: "hsl(36 85% 55%)" }}>Gruha Alankara</span> — AI Interior Stylist · Powered by Agentic AI
      </footer>
    </div>
  );
};

export default AppLayout;
