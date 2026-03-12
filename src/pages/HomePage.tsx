import { useNavigate } from "react-router-dom";
import { Camera, Wand2, Box, PiggyBank, Video, Sparkles, ArrowRight, ChevronRight } from "lucide-react";
import heroRoom from "@/assets/hero-room.jpg";

const tools = [
  {
    icon: Camera,
    title: "Room Analyzer",
    desc: "Upload a photo and our AI extracts dimensions, lighting, and structural features automatically.",
    btn: "View Demo",
    path: "/analyze",
    color: "hsl(210 80% 60%)",
  },
  {
    icon: Sparkles,
    title: "Style Suggester",
    desc: "Get personalized style recommendations based on your preferences and current design trends.",
    btn: "Explore Styles",
    path: "/design",
    color: "hsl(36 85% 55%)",
  },
  {
    icon: Box,
    title: "3D Visualization",
    desc: "Preview your room in realistic 3D and AR before making any changes or purchases.",
    btn: "Try 3D →",
    path: "/ar-camera",
    color: "hsl(142 70% 45%)",
  },
  {
    icon: Wand2,
    title: "Furniture Optimizer",
    desc: "Optimal furniture placement suggestions for maximum space efficiency and aesthetics.",
    btn: "Optimize →",
    path: "/design",
    color: "hsl(280 70% 60%)",
  },
  {
    icon: PiggyBank,
    title: "Budget Planner",
    desc: "Smart budget allocation across furniture, decor, and materials with savings tips.",
    btn: "Plan Budget →",
    path: "/budget",
    color: "hsl(36 85% 55%)",
  },
  {
    icon: Video,
    title: "Live AR Camera",
    desc: "Place furniture in real-time using your device camera with instant AR visualization.",
    btn: "Try AR →",
    path: "/ar-camera",
    color: "hsl(0 72% 60%)",
  },
];

const styles = [
  { name: "Scandinavian", desc: "Bright, airy spaces with natural materials", emoji: "🌿" },
  { name: "Modern Minimalist", desc: "Clean lines, neutral colors, functional furniture", emoji: "◻️" },
  { name: "Traditional", desc: "Classic elegance with rich textures and details", emoji: "🏛️" },
  { name: "Industrial", desc: "Raw materials, exposed brick, metal accents", emoji: "⚙️" },
  { name: "Bohemian", desc: "Eclectic, colorful, layered with personality", emoji: "🎨" },
  { name: "Art Deco", desc: "Geometric patterns, luxury materials, bold color", emoji: "✦" },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroRoom} alt="Luxury Room" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(230 30% 6% / 0.92) 0%, hsl(228 25% 14% / 0.75) 60%, hsl(36 85% 55% / 0.08) 100%)" }} />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12 py-24">
          <div className="max-w-3xl">
            <div className="mb-6 animate-fade-up">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body font-medium"
                style={{ background: "hsl(36 85% 55% / 0.15)", color: "hsl(36 85% 65%)", border: "1px solid hsl(36 85% 55% / 0.3)" }}>
                <Sparkles className="w-4 h-4" />
                Agentic AI · AR · Computer Vision
              </span>
            </div>

            <h1 className="font-display text-5xl lg:text-7xl font-light leading-none mb-6 animate-fade-up delay-100"
              style={{ color: "hsl(45 30% 95%)", opacity: 0 }}>
              Transform Your Space
              <span className="block font-bold mt-1 text-gradient-gold">with AI</span>
            </h1>

            <p className="font-body text-lg mb-10 leading-relaxed animate-fade-up delay-200"
              style={{ color: "hsl(45 20% 72%)", opacity: 0, maxWidth: "520px" }}>
              Personalized interior designs powered by intelligent agents. Upload your room, visualize in AR, and let AI create your perfect space.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up delay-300" style={{ opacity: 0 }}>
              <button onClick={() => navigate("/analyze")}
                className="group flex items-center gap-3 px-8 py-4 rounded-xl font-body font-semibold text-base transition-all duration-300 hover:scale-105 shadow-gold"
                style={{ background: "var(--gradient-gold)", color: "hsl(230 25% 8%)" }}>
                Start Designing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate("/ar-camera")}
                className="flex items-center gap-3 px-8 py-4 rounded-xl font-body font-medium text-base border transition-all duration-300 hover:scale-105"
                style={{ border: "1px solid hsl(45 30% 92% / 0.25)", color: "hsl(45 30% 88%)", background: "hsl(45 30% 92% / 0.06)" }}>
                <Video className="w-5 h-5" />
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-24" style={{ background: "hsl(228 22% 10%)" }}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-sm tracking-widest uppercase font-medium mb-3" style={{ color: "hsl(36 85% 55%)" }}>Platform</p>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold mb-4" style={{ color: "hsl(45 30% 92%)" }}>
              Intelligent Design Tools
            </h2>
            <p className="font-body text-base max-w-xl mx-auto" style={{ color: "hsl(220 15% 55%)" }}>
              Everything you need to design, visualize, and furnish your perfect space.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div key={tool.title}
                  className="group p-7 rounded-2xl border transition-all duration-400 hover:-translate-y-1 cursor-pointer"
                  style={{
                    background: "hsl(228 22% 12%)",
                    borderColor: "hsl(228 18% 20%)"
                  }}
                  onClick={() => navigate(tool.path)}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${tool.color}18`, border: `1px solid ${tool.color}40` }}>
                    <Icon className="w-6 h-6" style={{ color: tool.color }} />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2" style={{ color: "hsl(45 30% 90%)" }}>
                    {tool.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed mb-5" style={{ color: "hsl(220 15% 55%)" }}>
                    {tool.desc}
                  </p>
                  <button className="flex items-center gap-1 font-body text-sm font-semibold transition-all duration-200 group-hover:gap-2"
                    style={{ color: tool.color }}>
                    {tool.btn} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Design Styles */}
      <section className="py-24" style={{ background: "hsl(230 25% 8%)" }}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-sm tracking-widest uppercase font-medium mb-3" style={{ color: "hsl(36 85% 55%)" }}>Styles</p>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold mb-4" style={{ color: "hsl(45 30% 92%)" }}>
              Popular Design Styles
            </h2>
            <p className="font-body text-base" style={{ color: "hsl(220 15% 55%)" }}>
              Choose your favorite style and let AI create your perfect space
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {styles.map((style) => (
              <div key={style.name}
                className="group p-7 rounded-2xl border transition-all duration-400 hover:-translate-y-1 hover:border-gold cursor-pointer"
                style={{
                  background: "hsl(228 22% 12%)",
                  borderColor: "hsl(228 18% 20%)"
                }}
                onClick={() => navigate("/design")}>
                <div className="text-4xl mb-4">{style.emoji}</div>
                <h3 className="font-display text-xl font-semibold mb-2" style={{ color: "hsl(45 30% 90%)" }}>
                  {style.name}
                </h3>
                <p className="font-body text-sm mb-5" style={{ color: "hsl(220 15% 55%)" }}>
                  {style.desc}
                </p>
                <button
                  className="px-5 py-2.5 rounded-lg font-body text-sm font-semibold transition-all duration-200 hover:shadow-gold"
                  style={{ background: "var(--gradient-gold)", color: "hsl(230 25% 8%)" }}>
                  Select Style
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
