import { useState, useRef, useCallback } from "react";
import { Upload, Camera, X, ChevronRight, Loader2, CheckCircle, Eye, BarChart2, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import roomSample from "@/assets/room-sample.jpg";

type AnalysisResult = {
  dimensions: { width: string; length: string; height: string; area: string };
  lighting: { quality: string; brightness: number; note: string };
  colors: string[];
  features: { complexity: string; edges: number; orientation: string };
  roomType: string;
};

const roomTypes = ["Living Room", "Bedroom", "Kitchen", "Dining Room", "Bathroom", "Study Room", "Office"];

const runFakeAnalysis = (roomType: string): AnalysisResult => ({
  dimensions: {
    width: `${(Math.random() * 30 + 40).toFixed(1)} feet`,
    length: `${(Math.random() * 20 + 35).toFixed(1)} feet`,
    height: `${(Math.floor(Math.random() * 3) + 8)} feet`,
    area: `${(Math.random() * 2000 + 800).toFixed(0)} sq feet`,
  },
  lighting: {
    quality: ["bright", "natural", "warm", "dim"][Math.floor(Math.random() * 4)],
    brightness: Math.floor(Math.random() * 100 + 100),
    note: "Good natural lighting. Consider warm accent lights for evening ambiance.",
  },
  colors: ["#2C3E50", "#ECF0F1", "#BDC3C7", "#95A5A6", "#7F8C8D"],
  features: {
    complexity: ["high", "medium", "low"][Math.floor(Math.random() * 3)],
    edges: Math.floor(Math.random() * 4000 + 1000),
    orientation: ["vertical", "horizontal"][Math.floor(Math.random() * 2)],
  },
  roomType,
});

const AnalyzePage = () => {
  const [image, setImage] = useState<string | null>(null);
  const [roomType, setRoomType] = useState("Living Room");
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [step, setStep] = useState<"idle" | "analyzing" | "detecting" | "done">("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setResult(null);
      setStep("idle");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const analyze = async () => {
    if (!image) {
      toast({ title: "No image", description: "Please upload a room image first.", variant: "destructive" });
      return;
    }
    setAnalyzing(true);
    setProgress(0);
    setStep("analyzing");

    // Simulated step-by-step analysis
    const steps = [
      { label: "analyzing", progress: 35, delay: 600 },
      { label: "detecting", progress: 70, delay: 1200 },
      { label: "done", progress: 100, delay: 1800 },
    ];
    for (const s of steps) {
      await new Promise(r => setTimeout(r, s.delay));
      setProgress(s.progress);
      setStep(s.label as typeof step);
    }

    setResult(runFakeAnalysis(roomType));
    setAnalyzing(false);
    toast({ title: "✅ Analysis Complete!", description: "Room features extracted successfully." });
  };

  const loadSample = () => {
    setImage(roomSample);
    setResult(null);
    setStep("idle");
  };

  return (
    <div className="min-h-screen py-10" style={{ background: "hsl(230 25% 8%)" }}>
      <div className="container mx-auto px-4 lg:px-12 max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <p className="font-body text-sm tracking-widest uppercase font-medium mb-2" style={{ color: "hsl(36 85% 55%)" }}>
            AI Vision
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold mb-3" style={{ color: "hsl(45 30% 92%)" }}>
            Room Analysis
          </h1>
          <p className="font-body text-base" style={{ color: "hsl(220 15% 55%)" }}>
            Upload a photo of your room to begin AI-powered analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Upload */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Zone */}
            <div
              className="relative rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden cursor-pointer"
              style={{ borderColor: image ? "hsl(36 85% 55% / 0.5)" : "hsl(228 18% 28%)", minHeight: "280px", background: "hsl(228 22% 12%)" }}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => !image && inputRef.current?.click()}>

              {image ? (
                <>
                  <img src={image} alt="Room" className="w-full h-full object-cover" style={{ minHeight: "280px" }} />
                  <div className="absolute inset-0 flex items-end p-4"
                    style={{ background: "linear-gradient(to top, hsl(230 25% 8% / 0.8), transparent)" }}>
                    <div className="flex gap-2">
                      <button onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
                        className="px-3 py-1.5 rounded-lg font-body text-xs font-semibold transition-all hover:scale-105"
                        style={{ background: "var(--gradient-gold)", color: "hsl(230 25% 8%)" }}>
                        Change Image
                      </button>
                      <button onClick={e => { e.stopPropagation(); setImage(null); setResult(null); setStep("idle"); }}
                        className="px-3 py-1.5 rounded-lg font-body text-xs font-medium"
                        style={{ background: "hsl(0 72% 51% / 0.2)", color: "hsl(0 72% 70%)", border: "1px solid hsl(0 72% 51% / 0.3)" }}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  {/* Scan overlay when analyzing */}
                  {analyzing && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute left-0 right-0 h-0.5 animate-pulse" style={{ background: "hsl(36 85% 55%)", top: `${progress}%`, boxShadow: "0 0 10px hsl(36 85% 55%)" }} />
                      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, hsl(36 85% 55% / 0.05) ${progress}%, transparent ${progress + 5}%)` }} />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-16 px-4 text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 animate-float"
                    style={{ background: "hsl(36 85% 55% / 0.1)", border: "1px solid hsl(36 85% 55% / 0.3)" }}>
                    <Upload className="w-8 h-8" style={{ color: "hsl(36 85% 55%)" }} />
                  </div>
                  <p className="font-body font-semibold mb-1" style={{ color: "hsl(45 30% 85%)" }}>
                    Drag & Drop or Click to Upload
                  </p>
                  <p className="font-body text-sm" style={{ color: "hsl(220 15% 50%)" }}>
                    JPG, PNG, WEBP supported
                  </p>
                </div>
              )}
              <input ref={inputRef} type="file" accept="image/*" className="hidden"
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>

            {/* Room Type */}
            <div>
              <label className="font-body text-sm font-medium mb-2 block" style={{ color: "hsl(220 15% 65%)" }}>
                Room Type
              </label>
              <select
                value={roomType}
                onChange={e => setRoomType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl font-body text-sm border outline-none transition-all"
                style={{
                  background: "hsl(228 22% 14%)",
                  color: "hsl(45 30% 88%)",
                  borderColor: "hsl(228 18% 24%)"
                }}>
                {roomTypes.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button onClick={analyze} disabled={analyzing}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-body font-semibold text-base transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed shadow-gold"
                style={{ background: "var(--gradient-gold)", color: "hsl(230 25% 8%)" }}>
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {step === "analyzing" ? "Analyzing Image..." : step === "detecting" ? "Detecting Features..." : "Processing..."}
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5" />
                    Analyze Room
                  </>
                )}
              </button>
              <button onClick={loadSample}
                className="w-full py-3 rounded-xl font-body text-sm font-medium border transition-all hover:scale-105"
                style={{ borderColor: "hsl(228 18% 28%)", color: "hsl(220 15% 65%)", background: "hsl(228 22% 14%)" }}>
                <Camera className="w-4 h-4 inline mr-2" />
                Load Sample Room
              </button>
            </div>

            {/* Progress */}
            {analyzing && (
              <div className="p-4 rounded-xl" style={{ background: "hsl(228 22% 14%)" }}>
                <div className="flex justify-between mb-2">
                  <span className="font-body text-xs" style={{ color: "hsl(36 85% 55%)" }}>
                    {step === "analyzing" ? "🔍 Analyzing layout..." : step === "detecting" ? "🧠 Detecting features..." : "✅ Finalizing..."}
                  </span>
                  <span className="font-body text-xs font-semibold" style={{ color: "hsl(36 85% 55%)" }}>{progress}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(228 18% 22%)" }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: "var(--gradient-gold)" }} />
                </div>
              </div>
            )}
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-3 space-y-6">
            {result ? (
              <>
                {/* Dimensions */}
                <div className="p-6 rounded-2xl border" style={{ background: "hsl(228 22% 12%)", borderColor: "hsl(228 18% 20%)" }}>
                  <div className="flex items-center gap-2 mb-5">
                    <BarChart2 className="w-5 h-5" style={{ color: "hsl(36 85% 55%)" }} />
                    <h3 className="font-display text-lg font-semibold" style={{ color: "hsl(45 30% 90%)" }}>Dimensions</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(result.dimensions).map(([k, v]) => (
                      <div key={k} className="p-4 rounded-xl" style={{ background: "hsl(228 18% 16%)" }}>
                        <div className="font-body text-xs mb-1 capitalize" style={{ color: "hsl(220 15% 55%)" }}>{k}</div>
                        <div className="font-display text-lg font-semibold" style={{ color: "hsl(36 85% 55%)" }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lighting */}
                <div className="p-6 rounded-2xl border" style={{ background: "hsl(228 22% 12%)", borderColor: "hsl(228 18% 20%)" }}>
                  <div className="flex items-center gap-2 mb-5">
                    <Eye className="w-5 h-5" style={{ color: "hsl(210 80% 60%)" }} />
                    <h3 className="font-display text-lg font-semibold" style={{ color: "hsl(45 30% 90%)" }}>Lighting Analysis</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="p-3 rounded-xl text-center" style={{ background: "hsl(228 18% 16%)" }}>
                      <div className="font-body text-xs mb-1" style={{ color: "hsl(220 15% 55%)" }}>Quality</div>
                      <div className="font-semibold capitalize" style={{ color: "hsl(142 70% 55%)" }}>{result.lighting.quality}</div>
                    </div>
                    <div className="p-3 rounded-xl text-center" style={{ background: "hsl(228 18% 16%)" }}>
                      <div className="font-body text-xs mb-1" style={{ color: "hsl(220 15% 55%)" }}>Brightness</div>
                      <div className="font-semibold" style={{ color: "hsl(36 85% 55%)" }}>{result.lighting.brightness}/255</div>
                    </div>
                    <div className="p-3 rounded-xl text-center" style={{ background: "hsl(228 18% 16%)" }}>
                      <div className="font-body text-xs mb-1" style={{ color: "hsl(220 15% 55%)" }}>Room Type</div>
                      <div className="font-semibold text-xs" style={{ color: "hsl(45 30% 85%)" }}>{result.roomType}</div>
                    </div>
                  </div>
                  <p className="font-body text-sm p-3 rounded-lg" style={{ background: "hsl(210 80% 60% / 0.08)", color: "hsl(210 80% 70%)", border: "1px solid hsl(210 80% 60% / 0.2)" }}>
                    💡 {result.lighting.note}
                  </p>
                </div>

                {/* Color Palette & Features */}
                <div className="grid grid-cols-2 gap-5">
                  <div className="p-6 rounded-2xl border" style={{ background: "hsl(228 22% 12%)", borderColor: "hsl(228 18% 20%)" }}>
                    <div className="flex items-center gap-2 mb-4">
                      <Palette className="w-5 h-5" style={{ color: "hsl(280 70% 60%)" }} />
                      <h3 className="font-display text-base font-semibold" style={{ color: "hsl(45 30% 90%)" }}>Color Palette</h3>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {result.colors.map(c => (
                        <div key={c} title={c}
                          className="w-10 h-10 rounded-lg border-2 cursor-pointer hover:scale-110 transition-transform"
                          style={{ background: c, borderColor: "hsl(228 18% 28%)" }} />
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl border" style={{ background: "hsl(228 22% 12%)", borderColor: "hsl(228 18% 20%)" }}>
                    <h3 className="font-display text-base font-semibold mb-4" style={{ color: "hsl(45 30% 90%)" }}>Room Features</h3>
                    <div className="space-y-2">
                      {Object.entries(result.features).map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center">
                          <span className="font-body text-xs capitalize" style={{ color: "hsl(220 15% 55%)" }}>
                            {k.replace(/([A-Z])/g, " $1")}
                          </span>
                          <span className="font-body text-xs font-semibold" style={{ color: "hsl(36 85% 55%)" }}>
                            {String(v)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Proceed Button */}
                <button onClick={() => navigate("/design")}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-body font-semibold text-base transition-all duration-300 hover:scale-105 shadow-gold"
                  style={{ background: "var(--gradient-gold)", color: "hsl(230 25% 8%)" }}>
                  <CheckCircle className="w-5 h-5" />
                  Proceed to Design Studio
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-2xl border"
                style={{ background: "hsl(228 22% 12%)", borderColor: "hsl(228 18% 20%)" }}>
                <div className="text-center px-8">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float"
                    style={{ background: "hsl(36 85% 55% / 0.08)", border: "1px solid hsl(36 85% 55% / 0.2)" }}>
                    <Camera className="w-10 h-10" style={{ color: "hsl(36 85% 55% / 0.6)" }} />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3" style={{ color: "hsl(45 30% 70%)" }}>
                    Analysis Results
                  </h3>
                  <p className="font-body text-sm" style={{ color: "hsl(220 15% 45%)" }}>
                    Upload a room image and click "Analyze Room" to see AI-powered analysis with dimensions, lighting, and color detection.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzePage;
