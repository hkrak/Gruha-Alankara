import { useState } from "react";
import { BookOpen, Search, Trash2, Eye, Star, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

type DesignItem = {
  id: string;
  title: string;
  style: string;
  room: string;
  budget: string;
  date: string;
  colors: string[];
  starred: boolean;
  tags: string[];
  image?: string;
};

const SAMPLE_DESIGNS: DesignItem[] = [
  { id: "1", title: "Living Room – Modern", style: "Modern Minimalist", room: "Living Room", budget: "$5,000", date: "2025-01-15", colors: ["#FFFFFF", "#000000", "#808080", "#F5F5F5"], starred: true, tags: ["Featured", "Complete"] },
  { id: "2", title: "Bedroom – Scandinavian", style: "Scandinavian", room: "Bedroom", budget: "$3,200", date: "2025-01-20", colors: ["#F7F7F2", "#E8DDD0", "#C9B99A", "#8B7355"], starred: false, tags: ["Draft"] },
  { id: "3", title: "Kitchen – Industrial", style: "Industrial", room: "Kitchen", budget: "$8,000", date: "2025-02-01", colors: ["#3D3D3D", "#696969", "#A9A9A9", "#B8860B"], starred: true, tags: ["In Progress"] },
  { id: "4", title: "Office – Art Deco", style: "Art Deco", room: "Home Office", budget: "$4,500", date: "2025-02-10", colors: ["#1C1C1C", "#CFB53B", "#F5E6CC", "#2F4F4F"], starred: false, tags: ["New"] },
  { id: "5", title: "Dining – Traditional", style: "Traditional", room: "Dining Room", budget: "$6,000", date: "2025-02-15", colors: ["#8B4513", "#D2691E", "#CD853F", "#F4A460"], starred: false, tags: ["Draft"] },
  { id: "6", title: "Study – Bohemian", style: "Bohemian", room: "Study Room", budget: "$2,800", date: "2025-02-18", colors: ["#C75A3A", "#D4956A", "#8FA891", "#B5A642"], starred: true, tags: ["Complete"] },
];

const statusColors: Record<string, string> = {
  Featured: "hsl(36 85% 55%)",
  Complete: "hsl(142 70% 45%)",
  "In Progress": "hsl(210 80% 60%)",
  Draft: "hsl(220 15% 55%)",
  New: "hsl(280 70% 60%)",
};

const CatalogPage = () => {
  const [designs, setDesigns] = useState<DesignItem[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load designs from localStorage on mount
  useEffect(() => {
    const normalize = (raw: any): DesignItem | null => {
      if (!raw || typeof raw !== 'object') return null;

      // New format
      if (
        typeof raw.id === 'string' &&
        typeof raw.title === 'string' &&
        Array.isArray(raw.colors)
      ) {
        return {
          id: raw.id,
          title: raw.title,
          style: String(raw.style || ''),
          room: String(raw.room || ''),
          budget: String(raw.budget || ''),
          date: String(raw.date || new Date().toISOString().slice(0, 10)),
          colors: raw.colors.filter((c: any) => typeof c === 'string'),
          starred: Boolean(raw.starred),
          tags: Array.isArray(raw.tags) ? raw.tags.map(String) : ['Saved'],
          image: typeof raw.image === 'string' ? raw.image : undefined,
        };
      }

      // Old DesignStudio saved format (id as number + created + image)
      if (raw.image && (raw.created || raw.createdAt || raw.style || raw.room)) {
        const id = typeof raw.id === 'string' ? raw.id : `design_${raw.id || Date.now()}`;
        const style = String(raw.style || 'Custom');
        const room = String(raw.room || 'Room');
        const budget = String(raw.budget || '');
        const date = String((raw.created || raw.createdAt || new Date().toISOString()).slice(0, 10));
        const colors = Array.isArray(raw.colors) ? raw.colors : ['#FFFFFF', '#000000', '#808080', '#F5F5F5'];
        return {
          id,
          title: raw.title ? String(raw.title) : `${room} – ${style}`,
          style,
          room,
          budget,
          date,
          colors,
          starred: Boolean(raw.starred),
          tags: Array.isArray(raw.tags) ? raw.tags.map(String) : ['Saved'],
          image: String(raw.image),
        };
      }

      return null;
    };

    const saved = localStorage.getItem("catalog_designs");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const normalized = Array.isArray(parsed)
          ? parsed.map(normalize).filter(Boolean)
          : [];
        setDesigns(normalized as DesignItem[]);
      } catch {
        setDesigns(SAMPLE_DESIGNS);
      }
    } else {
      setDesigns(SAMPLE_DESIGNS);
      localStorage.setItem("catalog_designs", JSON.stringify(SAMPLE_DESIGNS));
    }
  }, []);

  // Save designs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("catalog_designs", JSON.stringify(designs));
  }, [designs]);

  const filtered = designs.filter(d => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.style.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || d.room === filter || (filter === "Starred" && d.starred);
    return matchSearch && matchFilter;
  });

  const toggleStar = (id: string) => setDesigns(prev => prev.map(d => d.id === id ? { ...d, starred: !d.starred } : d));
  const deleteDesign = (id: string) => {
    setDesigns(prev => prev.filter(d => d.id !== id));
    toast({ title: "🗑️ Design removed", description: "Removed from your catalog." });
  };

  const filters = ["All", "Living Room", "Bedroom", "Kitchen", "Dining Room", "Home Office", "Study Room", "Starred"];

  return (
    <div className="min-h-screen py-10" style={{ background: "hsl(230 25% 8%)" }}>
      <div className="container mx-auto px-4 lg:px-12 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="font-body text-sm tracking-widest uppercase font-medium mb-1" style={{ color: "hsl(36 85% 55%)" }}>Portfolio</p>
            <h1 className="font-display text-4xl font-semibold" style={{ color: "hsl(45 30% 92%)" }}>My Catalog</h1>
            <p className="font-body text-sm mt-1" style={{ color: "hsl(220 15% 55%)" }}>
              {designs.length} saved designs
            </p>
          </div>
          <button onClick={() => navigate("/design")}
            className="px-6 py-3 rounded-xl font-body text-sm font-semibold transition-all hover:scale-105 shadow-gold"
            style={{ background: "var(--gradient-gold)", color: "hsl(230 25% 8%)" }}>
            + New Design
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(220 15% 50%)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search designs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl font-body text-sm border outline-none"
              style={{ background: "hsl(228 22% 14%)", color: "hsl(45 30% 88%)", borderColor: "hsl(228 18% 24%)" }} />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <Filter className="w-4 h-4 mr-1" style={{ color: "hsl(220 15% 50%)" }} />
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg font-body text-xs font-medium transition-all"
                style={{
                  background: filter === f ? "hsl(36 85% 55% / 0.15)" : "hsl(228 22% 14%)",
                  color: filter === f ? "hsl(36 85% 55%)" : "hsl(220 15% 60%)",
                  border: filter === f ? "1px solid hsl(36 85% 55% / 0.4)" : "1px solid hsl(228 18% 24%)"
                }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-2xl border"
            style={{ background: "hsl(228 22% 12%)", borderColor: "hsl(228 18% 20%)" }}>
            <BookOpen className="w-16 h-16 mb-4 opacity-20" style={{ color: "hsl(36 85% 55%)" }} />
            <p className="font-display text-xl" style={{ color: "hsl(45 30% 60%)" }}>No designs found</p>
            <p className="font-body text-sm mt-1" style={{ color: "hsl(220 15% 45%)" }}>Try a different search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(design => (
              <div key={design.id}
                className="group rounded-2xl border overflow-hidden transition-all duration-400 hover:-translate-y-1 hover:shadow-card"
                style={{ background: "hsl(228 22% 12%)", borderColor: "hsl(228 18% 20%)" }}>
                {/* Preview */}
                {design.image ? (
                  <div className="h-40 bg-black/30 overflow-hidden">
                    <img
                      src={design.image}
                      alt={design.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="h-24 flex">
                    {design.colors.map((c, i) => (
                      <div key={i} className="flex-1" style={{ background: c }} />
                    ))}
                  </div>
                )}

                <div className="p-5">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {design.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full font-body text-xs font-semibold"
                        style={{ background: `${statusColors[tag] || "hsl(220 15% 55%)"}18`, color: statusColors[tag] || "hsl(220 15% 60%)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-display text-lg font-semibold mb-1" style={{ color: "hsl(45 30% 90%)" }}>{design.title}</h3>
                  <p className="font-body text-xs mb-1" style={{ color: "hsl(220 15% 55%)" }}>{design.style} · {design.room}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-body text-sm font-semibold" style={{ color: "hsl(36 85% 55%)" }}>{design.budget}</span>
                    <span className="font-body text-xs" style={{ color: "hsl(220 15% 45%)" }}>{design.date}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button onClick={() => navigate("/design")}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-body text-xs font-semibold transition-all hover:scale-105"
                      style={{ background: "var(--gradient-gold)", color: "hsl(230 25% 8%)" }}>
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                    <button onClick={() => toggleStar(design.id)}
                      className="w-10 flex items-center justify-center rounded-lg border transition-all hover:scale-110"
                      style={{
                        background: design.starred ? "hsl(36 85% 55% / 0.15)" : "hsl(228 18% 16%)",
                        borderColor: design.starred ? "hsl(36 85% 55% / 0.4)" : "hsl(228 18% 24%)"
                      }}>
                      <Star className="w-4 h-4" style={{ color: design.starred ? "hsl(36 85% 55%)" : "hsl(220 15% 50%)", fill: design.starred ? "hsl(36 85% 55%)" : "none" }} />
                    </button>
                    <button onClick={() => deleteDesign(design.id)}
                      className="w-10 flex items-center justify-center rounded-lg border transition-all hover:scale-110"
                      style={{ background: "hsl(0 72% 51% / 0.1)", borderColor: "hsl(0 72% 51% / 0.3)" }}>
                      <Trash2 className="w-4 h-4" style={{ color: "hsl(0 72% 60%)" }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
