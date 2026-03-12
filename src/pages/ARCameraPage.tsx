import { useState, useRef, useEffect } from "react";
import { Video, VideoOff, Maximize, Box, Camera, X, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FURNITURE_ITEMS = [
  { id: 1, name: "Modern Sofa", emoji: "🛋️", width: 120, height: 60 },
  { id: 2, name: "Coffee Table", emoji: "▭", width: 80, height: 50 },
  { id: 3, name: "Floor Lamp", emoji: "💡", width: 40, height: 60 },
  { id: 4, name: "Bookshelf", emoji: "📚", width: 80, height: 100 },
  { id: 5, name: "Armchair", emoji: "🪑", width: 70, height: 70 },
  { id: 6, name: "Plant", emoji: "🪴", width: 40, height: 60 },
  { id: 7, name: "Dining Table", emoji: "🍽️", width: 120, height: 80 },
  { id: 8, name: "TV Unit", emoji: "📺", width: 140, height: 50 },
];

type PlacedItem = {
  id: string;
  name: string;
  emoji: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const ARCameraPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [placed, setPlaced] = useState<PlacedItem[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(err => {
            console.error("Error playing video:", err);
            toast({
              title: "Video Playback Error",
              description: "Could not play video stream.",
              variant: "destructive"
            });
          });
        };
      }
      setCameraOn(true);
      toast({ title: "📷 Camera Active", description: "AR mode enabled. Drag furniture to place." });
    } catch (error) {
      console.error("Camera error:", error);
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access in your browser settings.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
    setCameraOn(false);
  };

  const addItem = (item: typeof FURNITURE_ITEMS[0]) => {
    const newItem: PlacedItem = {
      id: `${item.id}-${Date.now()}`,
      name: item.name,
      emoji: item.emoji,
      x: Math.random() * 200 + 50,
      y: Math.random() * 100 + 50,
      width: item.width,
      height: item.height,
    };
    setPlaced(prev => [...prev, newItem]);
    toast({ title: `✅ ${item.name} placed`, description: "Drag to reposition in your space." });
  };

  const removeItem = (id: string) => setPlaced(prev => prev.filter(p => p.id !== id));

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    const item = placed.find(p => p.id === id);
    if (!item) return;
    setDragging(id);
    setOffset({ x: e.clientX - item.x, y: e.clientY - item.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setPlaced(prev => prev.map(p => {
      if (p.id === dragging) {
        const newX = Math.max(0, Math.min(e.clientX - rect.left - offset.x, rect.width - p.width));
        const newY = Math.max(0, Math.min(e.clientY - rect.top - offset.y, rect.height - p.height));
        return { ...p, x: newX, y: newY };
      }
      return p;
    }));
  };

  useEffect(() => () => stream?.getTracks().forEach(t => t.stop()), [stream]);

  return (
    <div className="min-h-screen py-10" style={{ background: "hsl(230 25% 8%)" }}>
      <div className="container mx-auto px-4 lg:px-12 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="font-body text-sm tracking-widest uppercase font-medium mb-1" style={{ color: "hsl(36 85% 55%)" }}>Augmented Reality</p>
            <h1 className="font-display text-4xl font-semibold" style={{ color: "hsl(45 30% 92%)" }}>Live AR Camera</h1>
            <p className="font-body text-sm mt-1" style={{ color: "hsl(220 15% 55%)" }}>Place furniture in real-time using your device camera</p>
          </div>
          <div className="flex gap-3">
            <button onClick={cameraOn ? stopCamera : startCamera}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-sm font-semibold transition-all hover:scale-105 shadow-gold"
              style={{ background: cameraOn ? "hsl(0 72% 51% / 0.2)" : "var(--gradient-gold)", color: cameraOn ? "hsl(0 72% 65%)" : "hsl(230 25% 8%)", border: cameraOn ? "1px solid hsl(0 72% 51% / 0.4)" : "none" }}>
              {cameraOn ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              {cameraOn ? "Stop Camera" : "Start AR Camera"}
            </button>
            {placed.length > 0 && (
              <button onClick={() => setPlaced([])}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-body text-sm font-medium border transition-all hover:scale-105"
                style={{ borderColor: "hsl(228 18% 28%)", color: "hsl(220 15% 60%)", background: "hsl(228 22% 14%)" }}>
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* AR Canvas */}
          <div className="lg:col-span-3">
            <div
              ref={canvasRef}
              className="relative rounded-2xl overflow-hidden border select-none"
              style={{ minHeight: "450px", background: "hsl(228 22% 12%)", borderColor: cameraOn ? "hsl(36 85% 55% / 0.4)" : "hsl(228 18% 20%)", cursor: dragging ? "grabbing" : "default" }}
              onMouseMove={handleMouseMove}
              onMouseUp={() => setDragging(null)}
              onMouseLeave={() => setDragging(null)}>

              {/* Camera feed */}
              {cameraOn ? (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover absolute inset-0" style={{ minHeight: "450px" }} />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 animate-float"
                    style={{ background: "hsl(36 85% 55% / 0.08)", border: "1px solid hsl(36 85% 55% / 0.2)" }}>
                    <Camera className="w-10 h-10" style={{ color: "hsl(36 85% 55% / 0.5)" }} />
                  </div>
                  <p className="font-display text-xl font-semibold mb-2" style={{ color: "hsl(45 30% 70%)" }}>Camera Offline</p>
                  <p className="font-body text-sm" style={{ color: "hsl(220 15% 45%)" }}>Click "Start AR Camera" to enable live view</p>
                </div>
              )}

              {/* AR corner markers */}
              {cameraOn && (
                <>
                  {[["top-3 left-3 border-t-2 border-l-2", "rounded-tl-lg"], ["top-3 right-3 border-t-2 border-r-2", "rounded-tr-lg"], ["bottom-3 left-3 border-b-2 border-l-2", "rounded-bl-lg"], ["bottom-3 right-3 border-b-2 border-r-2", "rounded-br-lg"]].map(([pos, r]) => (
                    <div key={pos} className={`absolute w-8 h-8 ${pos} ${r}`} style={{ borderColor: "hsl(36 85% 55%)" }} />
                  ))}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full"
                    style={{ background: "hsl(230 25% 8% / 0.8)", border: "1px solid hsl(36 85% 55% / 0.4)" }}>
                    <div className="w-2 h-2 rounded-full animate-blink" style={{ background: "hsl(0 72% 55%)" }} />
                    <span className="font-body text-xs font-semibold" style={{ color: "hsl(36 85% 65%)" }}>AR LIVE</span>
                  </div>
                </>
              )}

              {/* Placed furniture items */}
              {placed.map(item => (
                <div key={item.id}
                  className="absolute cursor-grab active:cursor-grabbing select-none"
                  style={{ left: `${item.x}px`, top: `${item.y}px`, width: `${item.width}px`, height: `${item.height}px`, zIndex: dragging === item.id ? 10 : 1 }}
                  onMouseDown={e => handleMouseDown(e, item.id)}>
                  <div className="relative w-full h-full rounded-xl text-center border transition-all hover:scale-105 flex flex-col items-center justify-center"
                    style={{ background: "hsl(228 22% 14% / 0.9)", borderColor: "hsl(36 85% 55% / 0.5)", backdropFilter: "blur(8px)" }}>
                    <div className="text-3xl mb-1">{item.emoji}</div>
                    <div className="font-body text-xs font-medium" style={{ color: "hsl(45 30% 85%)" }}>{item.name}</div>
                    <button onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs hover:scale-110 transition-transform"
                      style={{ background: "hsl(0 72% 51%)", color: "white" }}>
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Info bar */}
            <div className="mt-4 flex items-start gap-2 p-3 rounded-xl"
              style={{ background: "hsl(210 80% 60% / 0.08)", border: "1px solid hsl(210 80% 60% / 0.2)" }}>
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "hsl(210 80% 65%)" }} />
              <p className="font-body text-xs" style={{ color: "hsl(210 80% 70%)" }}>
                Click furniture items on the right to place them. Drag to reposition. Click × to remove. Camera feed uses your device camera for AR visualization.
              </p>
            </div>
          </div>

          {/* Furniture Panel */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl border" style={{ background: "hsl(228 22% 12%)", borderColor: "hsl(228 18% 20%)" }}>
              <div className="flex items-center gap-2 mb-4">
                <Box className="w-4 h-4" style={{ color: "hsl(36 85% 55%)" }} />
                <h3 className="font-display text-base font-semibold" style={{ color: "hsl(45 30% 90%)" }}>Furniture</h3>
              </div>
              <div className="space-y-2">
                {FURNITURE_ITEMS.map(item => (
                  <button key={item.id} onClick={() => addItem(item)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all hover:scale-105 text-left"
                    style={{ background: "hsl(228 18% 16%)", borderColor: "hsl(228 18% 24%)" }}>
                    <span className="text-xl">{item.emoji}</span>
                    <div>
                      <div className="font-body text-xs font-semibold" style={{ color: "hsl(45 30% 85%)" }}>{item.name}</div>
                      <div className="font-body text-xs" style={{ color: "hsl(220 15% 50%)" }}>{item.width}×{item.height}cm</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {placed.length > 0 && (
              <div className="p-4 rounded-xl" style={{ background: "hsl(142 70% 45% / 0.08)", border: "1px solid hsl(142 70% 45% / 0.25)" }}>
                <p className="font-body text-xs font-semibold mb-1" style={{ color: "hsl(142 70% 55%)" }}>
                  {placed.length} item{placed.length > 1 ? "s" : ""} placed
                </p>
                <p className="font-body text-xs" style={{ color: "hsl(142 70% 45%)" }}>Drag to rearrange your space</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARCameraPage;
