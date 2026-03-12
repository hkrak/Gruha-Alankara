import { useState } from "react";
import { Wand2, Download, Share2, Video, BookOpen, Loader2, Sparkles, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const STYLES = [
  { name: "Modern Minimalist", desc: "Clean lines, neutral colors, and functional furniture with minimal clutter", colors: ["#FFFFFF", "#000000", "#808080", "#F5F5F5"], materials: ["Glass", "Steel", "Concrete", "Light wood"], furniture: ["Low-profile sofa", "Glass coffee table", "Geometric shelving", "Platform bed"] },
  { name: "Scandinavian", desc: "Light, airy spaces with natural materials, muted colors, and cozy textures", colors: ["#F7F7F2", "#E8DDD0", "#C9B99A", "#8B7355"], materials: ["Pine wood", "Wool", "Cotton", "Linen"], furniture: ["Birch armchair", "Round dining table", "Storage ottoman", "Pendant lights"] },
  { name: "Traditional", desc: "Classic elegance with rich textures, warm colors, and detailed craftsmanship", colors: ["#8B4513", "#D2691E", "#CD853F", "#F4A460"], materials: ["Mahogany", "Velvet", "Brass", "Marble"], furniture: ["Chesterfield sofa", "Antique dresser", "Wingback chair", "Four-poster bed"] },
  { name: "Industrial", desc: "Raw materials, exposed structures, metal accents, and urban aesthetic", colors: ["#3D3D3D", "#696969", "#A9A9A9", "#B8860B"], materials: ["Exposed brick", "Steel", "Reclaimed wood", "Concrete"], furniture: ["Factory cart table", "Metal shelving", "Leather sofa", "Edison bulbs"] },
  { name: "Bohemian", desc: "Eclectic mix of colors, patterns, and global influences with personality", colors: ["#C75A3A", "#D4956A", "#8FA891", "#B5A642"], materials: ["Macramé", "Rattan", "Kilim", "Terracotta"], furniture: ["Floor cushions", "Rattan chair", "Layered rugs", "Canopy bed"] },
  { name: "Art Deco", desc: "Geometric patterns, luxurious materials, bold colors, and glamour", colors: ["#1C1C1C", "#CFB53B", "#F5E6CC", "#2F4F4F"], materials: ["Lacquer", "Chrome", "Velvet", "Marble"], furniture: ["Tufted sofa", "Geometric mirror", "Bar cart", "Statement lighting"] },
];

const ROOMS = ["Living Room", "Bedroom", "Kitchen", "Dining Room", "Bathroom", "Home Office"];
const BUDGETS = ["₹83,000 - ₹249,000", "₹249,000 - ₹415,000", "₹415,000 - ₹830,000", "₹830,000+"];

const DesignStudioPage = () => {
  const [style, setStyle] = useState(STYLES[0]);
  const [room, setRoom] = useState(ROOMS[0]);
  const [budget, setBudget] = useState(BUDGETS[1]);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Adjust color brightness for depth effects
  const adjustBrightness = (color: string, percent: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  };

  // Get budget tier (0: budget, 1: mid, 2: premium, 3: luxury)
  const getBudgetTier = (): number => {
    if (budget.includes('83,000')) return 0;    // Budget tier
    if (budget.includes('249,000')) return 1;   // Mid tier
    if (budget.includes('415,000')) return 2;   // Premium tier
    return 3;                                    // Luxury tier
  };

  // Draw ultra-realistic human figure with better proportions
  const drawHumanFigure = (ctx: CanvasRenderingContext2D, x: number, y: number, pose: 'sitting' | 'standing' | 'lying', skinColor: string = '#E8C5A0', clothColor: string = '#3D5A80', scale: number = 1) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    if (pose === 'sitting') {
      const shadowGrad = ctx.createRadialGradient(0, 45, 5, 0, 45, 35);
      shadowGrad.addColorStop(0, 'rgba(0,0,0,0.25)');
      shadowGrad.addColorStop(1, 'rgba(0,0,0,0.05)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(0, 45, 28, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Legs
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.moveTo(-12, 30);
      ctx.quadraticCurveTo(-15, 45, -10, 55);
      ctx.lineTo(-8, 55);
      ctx.quadraticCurveTo(-12, 45, -10, 30);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(12, 30);
      ctx.quadraticCurveTo(15, 45, 10, 55);
      ctx.lineTo(8, 55);
      ctx.quadraticCurveTo(12, 45, 10, 30);
      ctx.closePath();
      ctx.fill();

      // Shoes
      ctx.fillStyle = '#2C2C2C';
      ctx.fillRect(-12, 52, 8, 6);
      ctx.fillRect(4, 52, 8, 6);

      // Torso - sitting posture
      ctx.fillStyle = clothColor;
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.lineTo(-15, 32);
      ctx.lineTo(15, 32);
      ctx.lineTo(18, 0);
      ctx.quadraticCurveTo(0, -8, -18, 0);
      ctx.closePath();
      ctx.fill();

      // Chest highlight
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.ellipse(-5, 10, 8, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Arms
      ctx.strokeStyle = skinColor;
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Left arm
      ctx.beginPath();
      ctx.moveTo(-18, 8);
      ctx.bezierCurveTo(-40, 5, -45, 25, -40, 40);
      ctx.stroke();

      // Right arm
      ctx.beginPath();
      ctx.moveTo(18, 8);
      ctx.bezierCurveTo(40, 5, 45, 25, 40, 40);
      ctx.stroke();

      // Hands
      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.arc(-40, 42, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(40, 42, 5, 0, Math.PI * 2);
      ctx.fill();

      // Neck
      ctx.fillStyle = skinColor;
      ctx.fillRect(-4, -10, 8, 12);

      // Head
      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.arc(0, -20, 13, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = '#3A2A1A';
      ctx.beginPath();
      ctx.arc(0, -26, 13, 0, Math.PI, false);
      ctx.fill();

      // Face
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.beginPath();
      ctx.arc(-4, -22, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(4, -22, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Mouth
      ctx.strokeStyle = 'rgba(139, 69, 19, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, -16, 3, 0, Math.PI, false);
      ctx.stroke();
    } else if (pose === 'standing') {
      const shadowGrad = ctx.createRadialGradient(0, 70, 5, 0, 70, 35);
      shadowGrad.addColorStop(0, 'rgba(0,0,0,0.2)');
      shadowGrad.addColorStop(1, 'rgba(0,0,0,0.03)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(0, 70, 22, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Legs
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.moveTo(-9, 15);
      ctx.lineTo(-11, 60);
      ctx.lineTo(-8, 60);
      ctx.lineTo(-7, 15);
      ctx.quadraticCurveTo(-8, 15, -9, 15);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(9, 15);
      ctx.lineTo(11, 60);
      ctx.lineTo(8, 60);
      ctx.lineTo(7, 15);
      ctx.quadraticCurveTo(8, 15, 9, 15);
      ctx.closePath();
      ctx.fill();

      // Shoes
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(-12, 58, 8, 7);
      ctx.fillRect(4, 58, 8, 7);

      // Torso
      ctx.fillStyle = clothColor;
      ctx.beginPath();
      ctx.moveTo(-17, -5);
      ctx.lineTo(-12, 18);
      ctx.lineTo(12, 18);
      ctx.lineTo(17, -5);
      ctx.quadraticCurveTo(0, -12, -17, -5);
      ctx.closePath();
      ctx.fill();

      // Shirt detail
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(-8, 2, 16, 8);

      // Arms
      ctx.strokeStyle = skinColor;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(-17, 0);
      ctx.bezierCurveTo(-42, -8, -48, 10, -45, 35);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(17, 0);
      ctx.bezierCurveTo(42, -8, 48, 10, 45, 35);
      ctx.stroke();

      // Hands
      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.arc(-45, 37, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(45, 37, 5, 0, Math.PI * 2);
      ctx.fill();

      // Neck
      ctx.fillStyle = skinColor;
      ctx.fillRect(-4, -12, 8, 14);

      // Head
      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.arc(0, -25, 13, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = '#3A2A1A';
      ctx.beginPath();
      ctx.arc(0, -31, 13, 0, Math.PI, false);
      ctx.fill();

      // Face detail
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.beginPath();
      ctx.arc(-4, -27, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(4, -27, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (pose === 'lying') {
      ctx.save();
      ctx.rotate(-0.15);
      
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.beginPath();
      ctx.ellipse(0, 30, 50, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head pillow area
      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.arc(-30, -5, 13, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#3A2A1A';
      ctx.beginPath();
      ctx.arc(-30, -12, 13, 0, Math.PI, false);
      ctx.fill();

      // Body
      ctx.fillStyle = clothColor;
      ctx.beginPath();
      ctx.moveTo(-20, 5);
      ctx.quadraticCurveTo(0, 2, 30, 8);
      ctx.lineTo(30, 18);
      ctx.quadraticCurveTo(0, 15, -20, 12);
      ctx.closePath();
      ctx.fill();

      // Legs
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.moveTo(28, 15);
      ctx.lineTo(45, 25);
      ctx.lineTo(44, 32);
      ctx.lineTo(27, 22);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    ctx.restore();
  };

  const generateRoomDesign = (roomType: string, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const budgetTier = getBudgetTier();
    const wallColor = style.colors[0] || '#FFFFFF';
    const accentColor = style.colors[2] || '#8B7355';
    const furnitureColor = style.colors[3] || '#696969';

    // Professional lighting based on budget
    const addProfessionalLighting = () => {
      const lightGrad = ctx.createRadialGradient(600, 100, 0, 600, 400, 600);
      lightGrad.addColorStop(0, `rgba(255, ${240 - budgetTier * 20}, ${200 - budgetTier * 30}, ${0.15 + budgetTier * 0.05})`);
      lightGrad.addColorStop(1, 'rgba(255, 200, 150, 0)');
      ctx.fillStyle = lightGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    if (roomType === 'Living Room') {
      // Main sofa - budget dependent
      const sofaWidth = budgetTier === 0 ? 420 : budgetTier === 1 ? 500 : budgetTier === 2 ? 580 : 640;
      const sofaX = (canvas.width - sofaWidth) / 2;
      
      // Sofa shadow (minimal)
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(sofaX, 400, sofaWidth, 15);
      
      ctx.fillStyle = furnitureColor;
      ctx.beginPath();
      ctx.moveTo(sofaX, 320);
      ctx.quadraticCurveTo(sofaX + sofaWidth / 4, 280, sofaX + sofaWidth / 2, 280);
      ctx.quadraticCurveTo(sofaX + sofaWidth * 0.75, 280, sofaX + sofaWidth, 320);
      ctx.lineTo(sofaX + sofaWidth, 400);
      ctx.lineTo(sofaX, 400);
      ctx.closePath();
      ctx.fill();

      // Sofa cushions - more details for higher budgets
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      for (let i = 0; i < Math.min(budgetTier + 2, 5); i++) {
        const cX = sofaX + 40 + (sofaWidth - 80) * (i / Math.max(budgetTier + 1, 2));
        ctx.fillRect(cX, 300, 50, 50);
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        ctx.strokeRect(cX, 300, 50, 50);
      }

      // Coffee table - budget dependent
      const tableSize = budgetTier === 0 ? 200 : budgetTier <= 1 ? 260 : budgetTier === 2 ? 300 : 350;
      const tableX = (canvas.width - tableSize) / 2;
      
      ctx.fillStyle = budgetTier >= 2 ? '#C0C0C0' : '#8B6F47';
      ctx.fillRect(tableX, 420, tableSize, 120);
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fillRect(tableX + 10, 425, tableSize - 20, 30);

      // TV unit - size varies by budget
      const tvWidth = budgetTier === 0 ? 350 : budgetTier === 1 ? 420 : budgetTier === 2 ? 500 : 580;
      const tvX = (canvas.width - tvWidth) / 2;
      
      ctx.fillStyle = budgetTier >= 2 ? '#1a1a1a' : '#654321';
      ctx.fillRect(tvX, 80, tvWidth, 160);
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(tvX + 20, 100, tvWidth - 40, 120);
      
      // TV screen glow
      ctx.fillStyle = 'rgba(100, 180, 255, 0.3)';
      ctx.fillRect(tvX + 25, 105, tvWidth - 50, 110);

      // People on sofa
      drawHumanFigure(ctx, sofaX + sofaWidth * 0.3, 340, 'sitting', '#E8C5A0', budgetTier >= 2 ? '#FF6B6B' : '#4A6FA5', 1.1);
      drawHumanFigure(ctx, sofaX + sofaWidth * 0.7, 345, 'sitting', '#E0D0B8', budgetTier >= 2 ? '#4ECDC4' : '#2C5282', 1.05);

      // Side table with lamp
      if (budgetTier >= 1) {
        ctx.fillStyle = '#A0826D';
        ctx.fillRect(200, 320, 80, 100);
        ctx.fillStyle = '#FFE5B4';
        ctx.fillRect(220, 250, 40, 70);
        ctx.beginPath();
        ctx.arc(240, 250, 22, 0, Math.PI * 2);
        ctx.fill();
        
        // Lamp glow
        ctx.fillStyle = 'rgba(255, 240, 150, 0.2)';
        ctx.beginPath();
        ctx.arc(240, 250, 60, 0, Math.PI * 2);
        ctx.fill();
      }

      addProfessionalLighting();
    } else if (roomType === 'Bedroom') {
      // Bed size varies by budget
      const bedWidth = budgetTier === 0 ? 420 : budgetTier === 1 ? 480 : budgetTier === 2 ? 540 : 600;
      const bedX = (canvas.width - bedWidth) / 2;

      // Bed frame
      ctx.fillStyle = budgetTier >= 2 ? '#1a1a1a' : '#654321';
      ctx.fillRect(bedX, 240, bedWidth, 240);
      
      // Mattress and bedding
      ctx.fillStyle = style.colors[1] || '#E8DDD0';
      ctx.fillRect(bedX + 15, 250, bedWidth - 30, 220);

      // Pillows - more for higher budget
      ctx.fillStyle = '#F5F5F5';
      if (budgetTier >= 2) {
        ctx.fillRect(bedX + 30, 260, 70, 50);
        ctx.fillRect(bedX + 110, 260, 70, 50);
        ctx.fillRect(bedX + bedWidth - 100, 260, 70, 50);
      } else {
        ctx.fillRect(bedX + 50, 265, 90, 45);
        ctx.fillRect(bedX + bedWidth - 140, 265, 90, 45);
      }

      // Bedding detail - minimal for performance
      ctx.fillStyle = 'rgba(255,255,255,0.1)';

      // Person sleeping on bed
      drawHumanFigure(ctx, bedX + bedWidth * 0.35, 320, 'lying', '#E8C5A0', '#FF6B6B', 1.2);

      // Nightstands with lamps - position depends on luxury
      const nightstandWidth = budgetTier >= 2 ? 100 : 75;
      const nightstandColor = budgetTier >= 2 ? '#2C1810' : '#8B6F47';

      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 12;

      ctx.fillStyle = nightstandColor;
      ctx.fillRect(bedX - nightstandWidth - 20, 280, nightstandWidth, 120);
      ctx.fillRect(bedX + bedWidth + 20, 280, nightstandWidth, 120);

      // Lamps on nightstands
      ctx.shadowColor = 'transparent';
      if (budgetTier >= 1) {
        ctx.fillStyle = '#FFE5B4';
        ctx.fillRect(bedX - nightstandWidth + 15, 200, 25, 80);
        ctx.beginPath();
        ctx.arc(bedX - nightstandWidth + 27.5, 200, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFE5B4';
        ctx.fillRect(bedX + bedWidth + 35, 200, 25, 80);
        ctx.beginPath();
        ctx.arc(bedX + bedWidth + 47.5, 200, 20, 0, Math.PI * 2);
        ctx.fill();
      }

      // Dresser - budget dependent
      if (budgetTier >= 1) {
        const dresserWidth = budgetTier >= 2 ? 180 : 140;
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 12;

        ctx.fillStyle = '#654321';
        ctx.fillRect(850, 180, dresserWidth, 160);

        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        for (let i = 0; i < (budgetTier >= 2 ? 4 : 3); i++) {
          ctx.strokeRect(860 + i * 35, 200, 30, 70);
        }

        // Mirror
        ctx.fillStyle = 'rgba(200, 220, 255, 0.4)';
        ctx.fillRect(860, 125, dresserWidth - 20, 50);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.strokeRect(860, 125, dresserWidth - 20, 50);
      }

      addProfessionalLighting();
    } else if (roomType === 'Kitchen') {
      // Island/Counter - budget dependent
      const counterLength = budgetTier === 0 ? 350 : budgetTier === 1 ? 420 : budgetTier === 2 ? 500 : 580;
      const counterX = (canvas.width - counterLength) / 2;

      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 12;

      ctx.fillStyle = budgetTier >= 2 ? '#2C2C2C' : '#654321';
      ctx.fillRect(counterX, 300, counterLength, 180);

      ctx.shadowColor = 'transparent';
      
      // Countertop
      ctx.fillStyle = budgetTier >= 3 ? '#808080' : budgetTier >= 2 ? '#A9A9A9' : '#C0C0C0';
      ctx.fillRect(counterX, 300, counterLength, 30);

      // Stove/Cooktop - luxury dependent
      const stoveWidth = budgetTier === 0 ? 80 : budgetTier === 1 ? 100 : budgetTier === 2 ? 130 : 160;
      const stoveX = counterX + (counterLength - stoveWidth) / 2;

      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(stoveX, 330, stoveWidth, stoveWidth - 20);

      // Burners
      const burnerCount = budgetTier === 0 ? 4 : budgetTier === 1 ? 4 : budgetTier === 2 ? 6 : 6;
      const burnersPerRow = budgetTier >= 2 ? 3 : 2;
      
      ctx.fillStyle = '#666';
      for (let i = 0; i < burnerCount; i++) {
        const row = Math.floor(i / burnersPerRow);
        const col = i % burnersPerRow;
        const bx = stoveX + 15 + col * (stoveWidth / burnersPerRow - 10);
        const by = 340 + row * 40;
        ctx.beginPath();
        ctx.arc(bx, by, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sink - budget dependent size
      const sinkX = counterX + counterLength - (budgetTier >= 2 ? 150 : 110);
      const sinkWidth = budgetTier >= 2 ? 120 : 90;

      ctx.fillStyle = budgetTier >= 2 ? '#C0C0C0' : '#A9A9A9';
      ctx.fillRect(sinkX, 330, sinkWidth, 100);
      ctx.fillStyle = '#999';
      ctx.fillRect(sinkX + 8, 340, sinkWidth - 16, 80);

      // Faucet
      ctx.strokeStyle = '#C0C0C0';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(sinkX + sinkWidth / 2, 320, 2, 0, Math.PI * 2);
      ctx.stroke();

      // Chef at stove
      drawHumanFigure(ctx, stoveX + stoveWidth / 2 - 40, 240, 'standing', '#E8C5A0', '#2C538C', 1.15);

      // Dining area in background
      if (budgetTier >= 1) {
        ctx.fillStyle = '#8B6F47';
        const tableX = 250;
        ctx.fillRect(tableX, 480, 200, 120);
        drawHumanFigure(ctx, tableX + 100, 540, 'sitting', '#E8D4B0', '#8B4513', 1);
      }

      addProfessionalLighting();
    } else if (roomType === 'Dining Room') {
      // Dining Table - size varies by budget
      const tableLength = budgetTier === 0 ? 300 : budgetTier === 1 ? 380 : budgetTier === 2 ? 450 : 520;
      const tableWidth = budgetTier === 0 ? 150 : budgetTier === 1 ? 180 : budgetTier === 2 ? 220 : 260;
      const tableX = (canvas.width - tableLength) / 2;
      const tableY = canvas.height / 2 - tableWidth / 2;

      // Table surface
      ctx.fillStyle = budgetTier >= 2 ? '#1a1a1a' : '#8B6F47';
      ctx.beginPath();
      ctx.ellipse(tableX + tableLength / 2, tableY + tableWidth / 2, tableLength / 2, tableWidth / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Table surface highlight
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.beginPath();
      ctx.ellipse(tableX + tableLength / 2 - 20, tableY + tableWidth / 2 - 20, tableLength / 2 - 40, tableWidth / 2 - 40, 0, 0, Math.PI * 2);
      ctx.fill();

      // Placemats if budget allows
      if (budgetTier >= 2) {
        ctx.fillStyle = style.colors[1];
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const px = tableX + tableLength / 2 + Math.cos(angle) * (tableLength / 2 - 50);
          const py = tableY + tableWidth / 2 + Math.sin(angle) * (tableWidth / 2 - 40);
          ctx.fillRect(px - 30, py - 40, 60, 80);
        }
      }

      // Dining chairs around table
      const chairCount = budgetTier === 0 ? 4 : budgetTier <= 1 ? 6 : 8;
      const chairColor = style.colors[3] || '#696969';

      for (let i = 0; i < chairCount; i++) {
        const angle = (i / chairCount) * Math.PI * 2;
        const chairDistance = tableLength / 2 + 100;
        const chairX = tableX + tableLength / 2 + Math.cos(angle) * chairDistance;
        const chairY = tableY + tableWidth / 2 + Math.sin(angle) * chairDistance;

        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 8;

        ctx.fillStyle = chairColor;
        ctx.fillRect(chairX - 30, chairY - 35, 60, 70);

        ctx.shadowColor = 'transparent';
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(chairX - 25, chairY - 30, 50, 30);
      }

      // Seated diners - show interaction with table
      const dinerCount = Math.min(budgetTier + 2, 4);
      for (let i = 0; i < dinerCount; i++) {
        const angle = (i / dinerCount) * Math.PI * 2 + Math.PI / 4;
        const dinerDist = tableLength / 2 + 80;
        const dinerX = tableX + tableLength / 2 + Math.cos(angle) * dinerDist;
        const dinerY = tableY + tableWidth / 2 + Math.sin(angle) * dinerDist;
        const clothes = ['#8B0000', '#4B0082', '#556B2F', '#DC143C'];
        drawHumanFigure(ctx, dinerX, dinerY, 'sitting', '#E8C5A0', clothes[i], 1.05);
      }

      // Buffet/Sideboard - size based on budget
      if (budgetTier >= 1) {
        const buffetWidth = budgetTier >= 2 ? 200 : 160;
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 12;

        ctx.fillStyle = '#654321';
        ctx.fillRect(100, 150, buffetWidth, 150);

        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        for (let i = 0; i < (budgetTier >= 2 ? 3 : 2); i++) {
          ctx.strokeRect(110 + i * 50, 170, 40, 110);
        }
      }

      addProfessionalLighting();
    } else if (roomType === 'Bathroom') {
      // Bathtub/Shower - size varies by budget
      const tubWidth = budgetTier === 0 ? 200 : budgetTier === 1 ? 240 : budgetTier === 2 ? 300 : 340;
      const tubHeight = budgetTier === 0 ? 150 : budgetTier === 1 ? 180 : budgetTier === 2 ? 220 : 260;
      const tubX = (canvas.width - tubWidth) / 2 - 150;
      const tubY = 220;

      // Tub with gradient
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 12;

      const tubGrad = ctx.createLinearGradient(tubX, tubY, tubX, tubY + tubHeight);
      tubGrad.addColorStop(0, '#E8F7FF');
      tubGrad.addColorStop(1, '#B0E8FF');
      ctx.fillStyle = tubGrad;
      ctx.fillRect(tubX, tubY, tubWidth, tubHeight);

      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      ctx.strokeRect(tubX, tubY, tubWidth, tubHeight);

      // Shower fixtures if budget allows
      if (budgetTier >= 1) {
        ctx.strokeStyle = '#C0C0C0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tubX + tubWidth - 20, tubY - 30);
        ctx.lineTo(tubX + tubWidth - 20, tubY - 80);
        ctx.stroke();

        // Showerhead
        ctx.fillStyle = '#C0C0C0';
        ctx.beginPath();
        ctx.arc(tubX + tubWidth - 20, tubY - 80, 15, 0, Math.PI * 2);
        ctx.fill();
      }

      // Vanity - budget dependent
      const vanityWidth = budgetTier === 0 ? 150 : budgetTier === 1 ? 200 : budgetTier === 2 ? 260 : 300;
      const vanityX = (canvas.width - tubWidth) / 2 + 150 + 100;

      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 12;

      ctx.fillStyle = budgetTier >= 2 ? '#2C1810' : '#654321';
      ctx.fillRect(vanityX, 280, vanityWidth, 130);

      ctx.shadowColor = 'transparent';

      // Sink(s)
      const sinkCount = budgetTier >= 2 ? 2 : 1;
      const sinkRadius = budgetTier >= 1 ? 30 : 25;
      for (let i = 0; i < sinkCount; i++) {
        const sinkX = vanityX + 30 + i * 100;
        ctx.fillStyle = '#C0C0C0';
        ctx.beginPath();
        ctx.arc(sinkX, 330, sinkRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#999';
        ctx.beginPath();
        ctx.arc(sinkX, 330, sinkRadius - 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // Mirror above vanity
      ctx.fillStyle = 'rgba(200, 220, 255, 0.4)';
      ctx.fillRect(vanityX + 10, 230, vanityWidth - 20, 40);
      ctx.strokeStyle = budgetTier >= 2 ? '#1a1a1a' : '#999';
      ctx.lineWidth = 2;
      ctx.strokeRect(vanityX + 10, 230, vanityWidth - 20, 40);

      // Toilet
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 8;

      ctx.fillStyle = budgetTier >= 2 ? '#F8F8F8' : '#FFFAF0';
      ctx.fillRect(200, 480, 90, 120);
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 2;
      ctx.strokeRect(200, 480, 90, 120);

      // Towel rack with towels - budget dependent
      if (budgetTier >= 1) {
        ctx.strokeStyle = '#C0C0C0';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(650, 250);
        ctx.lineTo(650, 380);
        ctx.stroke();

        ctx.fillStyle = style.colors[2] || style.colors[1];
        ctx.fillRect(635, 265, 30, 20);
        ctx.fillRect(635, 295, 30, 20);
        ctx.fillRect(635, 325, 30, 20);
      }

      // Person at vanity
      drawHumanFigure(ctx, vanityX + vanityWidth / 2, 260, 'standing', '#E8C5A0', '#FFB6C1', 1.1);

      addProfessionalLighting();
    } else if (roomType === 'Home Office') {
      // Desk - size varies by budget
      const deskWidth = budgetTier === 0 ? 320 : budgetTier === 1 ? 400 : budgetTier === 2 ? 480 : 560;
      const deskX = (canvas.width - deskWidth) / 2;

      ctx.shadowColor = 'rgba(0,0,0,0.25)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 12;

      ctx.fillStyle = budgetTier >= 2 ? '#1a1a1a' : '#8B6F47';
      ctx.fillRect(deskX, 320, deskWidth, 140);

      ctx.shadowColor = 'transparent';

      // Desktop surface
      ctx.fillStyle = budgetTier >= 2 ? '#2C2C2C' : '#A0826D';
      ctx.fillRect(deskX, 320, deskWidth, 30);

      // Computer setup - budget dependent detail
      const monitorWidth = budgetTier === 0 ? 100 : budgetTier === 1 ? 140 : budgetTier === 2 ? 180 : 220;
      const monitorX = deskX + deskWidth / 2 - monitorWidth / 2;

      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(monitorX - 10, 200, monitorWidth + 20, 110);
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(monitorX, 210, monitorWidth, 90);

      // Screen glow
      ctx.fillStyle = 'rgba(100, 150, 255, 0.4)';
      ctx.fillRect(monitorX + 5, 215, monitorWidth - 10, 80);

      // Keyboard
      if (budgetTier >= 1) {
        ctx.fillStyle = '#333';
        ctx.fillRect(monitorX - 40, 340, monitorWidth + 80, 40);
        ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
        for (let i = 0; i < 5; i++) {
          ctx.fillRect(monitorX - 30 + i * 30, 350, 25, 20);
        }
      }

      // Office chair - budget dependent luxury
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 10;

      ctx.fillStyle = budgetTier >= 2 ? '#1C3A70' : style.colors[3] || '#696969';
      ctx.beginPath();
      ctx.arc(deskX - 120, 360, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(deskX - 130, 380, 100, 50);

      ctx.shadowColor = 'transparent';

      // Person working at desk
      drawHumanFigure(ctx, deskX - 120, 310, 'sitting', '#E8C5A0', budgetTier >= 2 ? '#1C3A70' : '#3D5A80', 1.15);

      // Shelving unit - luxury dependent
      if (budgetTier >= 1) {
        const shelfWidth = budgetTier >= 2 ? 220 : 180;
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 12;

        ctx.fillStyle = '#654321';
        ctx.fillRect(deskX + deskWidth + 80, 200, shelfWidth, 280);

        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        for (let i = 0; i < (budgetTier >= 2 ? 5 : 4); i++) {
          ctx.beginPath();
          ctx.moveTo(deskX + deskWidth + 80, 200 + i * 70);
          ctx.lineTo(deskX + deskWidth + 80 + shelfWidth, 200 + i * 70);
          ctx.stroke();
        }

        // Books on shelf - more for luxury
        const bookCount = budgetTier >= 3 ? 12 : budgetTier >= 2 ? 8 : 6;
        const bookColors = [style.colors[1], style.colors[2], '#FF6B6B', '#4ECDC4', '#FFD93D', '#6BCB77'];
        for (let i = 0; i < bookCount; i++) {
          const row = Math.floor(i / 3);
          const col = i % 3;
          const bx = deskX + deskWidth + 95 + col * 65;
          const by = 220 + row * 70;
          ctx.fillStyle = bookColors[i % bookColors.length];
          ctx.fillRect(bx, by, 12, 50);
        }
      }

      addProfessionalLighting();
    }
  };

  const budgetTierLabel = () => {
    const tier = getBudgetTier();
    return tier === 0 ? 'BUDGET' : tier === 1 ? 'STANDARD' : tier === 2 ? 'PREMIUM' : 'LUXURY';
  };

  const generate = async () => {
    try {
      setGenerating(true);
      setGenerated(false);
      setGeneratedImage(null);
      setAiStatus("🔍 Analyzing room specifications...");
      
      // Brief delay for better UX
      await new Promise(r => setTimeout(r, 500));
      setAiStatus("🎨 Selecting design palette...");
      await new Promise(r => setTimeout(r, 500));
      setAiStatus("🛋️ Generating layout...");
      
      // Generate a highly realistic design image
      const canvas = document.createElement('canvas');
      canvas.width = 1400;
      canvas.height = 900;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      const budgetTier = getBudgetTier();
      const wallColor = style.colors[0] || '#FFFFFF';

      // Professional background gradient - budget aware
      const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (budgetTier >= 3) {
        bgGrad.addColorStop(0, adjustBrightness(wallColor, 20));
        bgGrad.addColorStop(0.5, wallColor);
        bgGrad.addColorStop(1, adjustBrightness(wallColor, -25));
      } else if (budgetTier === 2) {
        bgGrad.addColorStop(0, adjustBrightness(wallColor, 15));
        bgGrad.addColorStop(0.5, wallColor);
        bgGrad.addColorStop(1, adjustBrightness(wallColor, -20));
      } else {
        bgGrad.addColorStop(0, wallColor);
        bgGrad.addColorStop(1, adjustBrightness(wallColor, -15));
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Ceiling with elegant gradient
      const ceilingColor = style.colors[0] === '#FFFFFF' ? '#F5F5F5' : adjustBrightness(wallColor, 5);
      const ceilingGrad = ctx.createLinearGradient(0, 0, canvas.width, 60);
      ceilingGrad.addColorStop(0, adjustBrightness(ceilingColor, 10));
      ceilingGrad.addColorStop(1, ceilingColor);
      ctx.fillStyle = ceilingGrad;
      ctx.fillRect(0, 0, canvas.width, 60);

      // Professional wall texture - optimized for performance
      ctx.fillStyle = 'rgba(0, 0, 0, 0.015)';
      for (let i = 0; i < 150; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * 550;
        const size = Math.random() * 1.5;
        ctx.globalAlpha = Math.random() * 0.2;
        ctx.fillRect(x, y, size, size);
      }
      ctx.globalAlpha = 1;

      // Panoramic window with advanced lighting - luxury feature
      if (budgetTier >= 2) {
        ctx.fillStyle = 'rgba(135, 206, 250, 0.8)';
        ctx.fillRect(900, 100, 480, 400);
        
        // Window light casting into room - strong professional effect
        const windowMainLight = ctx.createRadialGradient(1100, 250, 50, 1100, 250, 600);
        windowMainLight.addColorStop(0, 'rgba(255, 255, 200, 0.25)');
        windowMainLight.addColorStop(0.5, 'rgba(255, 255, 150, 0.1)');
        windowMainLight.addColorStop(1, 'rgba(255, 255, 100, 0)');
        ctx.fillStyle = windowMainLight;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Advanced window reflection effects
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(930, 130, 80, 60);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(1050, 200, 120, 100);

        // Window panes for realism
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)';
        ctx.lineWidth = 3;
        ctx.strokeRect(900, 100, 480, 400);
        ctx.beginPath();
        ctx.moveTo(1140, 100);
        ctx.lineTo(1140, 500);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(900, 300);
        ctx.lineTo(1380, 300);
        ctx.stroke();
      }
      
      // Decorative door
      const doorColor = budgetTier >= 2 ? '#5C3A2A' : '#8B5A2B';
      
      ctx.fillStyle = doorColor;
      ctx.fillRect(60, 350, 120, 400);
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(70, 360, 100, 380);
      
      // Door details
      ctx.fillStyle = budgetTier >= 2 ? '#DAA520' : '#FFD700';
      ctx.beginPath();
      ctx.arc(175, 550, 12, 0, Math.PI * 2);
      ctx.fill();

      // Floor with panoramic perspective depth
      const floorColor = style.colors[1] || '#E8DDD0';
      const floorGrad = ctx.createLinearGradient(0, 550, 0, canvas.height);
      floorGrad.addColorStop(0, floorColor);
      floorGrad.addColorStop(1, adjustBrightness(floorColor, -20));
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, 550, canvas.width, canvas.height - 550);

      // Floor grid - optimized
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 0.5;
      const floorTileSize = 60;
      for (let i = 0; i < canvas.width; i += floorTileSize) {
        ctx.beginPath();
        ctx.moveTo(i, 550);
        ctx.lineTo(i + 20, canvas.height);
        ctx.stroke();
      }

      // Accent wall - elegant offset
      const accentColor = style.colors[2] || '#8B7355';
      ctx.fillStyle = accentColor;
      ctx.fillRect(0, 60, 350, 490);

      // Accent wall texture - optimized
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      for (let i = 0; i < 100; i++) {
        ctx.globalAlpha = Math.random() * 0.3;
        ctx.fillRect(Math.random() * 350, 60 + Math.random() * 490, Math.random() * 1.5, Math.random() * 2);
      }
      ctx.globalAlpha = 1;

      // Accent wall art
      ctx.fillStyle = '#D2B48C';
      ctx.fillRect(50, 150, 240, 280);
      
      ctx.shadowColor = 'transparent';

      // Decorative area rug
      if (room === 'Living Room' || room === 'Dining Room') {
        const rugColor = style.colors[3] || '#696969';
        ctx.fillStyle = rugColor;
        ctx.beginPath();
        ctx.ellipse(700, 650, 420, 180, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(700, 650, 410, 170, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Generate room-specific design
      generateRoomDesign(room, canvas, ctx);

      // Decorative plants - adds life and natural appeal
      if (room === 'Living Room' || room === 'Bedroom') {
        // Plant 1 - left
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(180, 750);
        ctx.lineTo(120, 850);
        ctx.lineTo(240, 850);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#654321';
        ctx.fillRect(125, 845, 110, 10);

        const plantGreen1 = ['#2E8B57', '#228B22', '#3CB371'];
        for (let i = 0; i < 3; i++) {
          ctx.fillStyle = plantGreen1[i];
          ctx.beginPath();
          ctx.ellipse(180 + i * 20 - 20, 700 - i * 30, 35 - i * 5, 60 - i * 10, -0.4 + i * 0.15, 0, Math.PI * 2);
          ctx.fill();
        }

        // Plant 2 - right
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(1220, 750);
        ctx.lineTo(1160, 850);
        ctx.lineTo(1280, 850);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#654321';
        ctx.fillRect(1165, 845, 110, 10);

        for (let i = 0; i < 3; i++) {
          ctx.fillStyle = plantGreen1[i];
          ctx.beginPath();
          ctx.ellipse(1220 + i * 20 - 20, 700 - i * 30, 35 - i * 5, 60 - i * 10, -0.4 + i * 0.15, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Professional ceiling lighting - budget aware
      const lightCount = budgetTier >= 2 ? 3 : budgetTier >= 1 ? 2 : 1;
      for (let i = 0; i < lightCount; i++) {
        const lx =
          lightCount === 1
            ? canvas.width / 2
            : 300 + (i * (canvas.width - 600)) / (lightCount - 1);
        
        ctx.shadowColor = `rgba(255, ${220 - budgetTier * 20}, ${100 - budgetTier * 20}, 0.8)`;
        ctx.shadowBlur = 30;

        ctx.fillStyle = budgetTier >= 2 ? '#DAA520' : '#FFD700';
        ctx.beginPath();
        ctx.arc(lx, 40, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowColor = 'transparent';

        // Light glow with layers
        const glowSize1 = 100 + budgetTier * 20;
        const glowSize2 = glowSize1 * 1.8;

        const glow1 = ctx.createRadialGradient(lx, 40, 20, lx, 40, glowSize1);
        glow1.addColorStop(0, `rgba(255, 240, 150, ${0.2 + budgetTier * 0.05})`);
        glow1.addColorStop(1, 'rgba(255, 240, 150, 0)');
        ctx.fillStyle = glow1;
        ctx.fillRect(lx - glowSize1, 40 - glowSize1, glowSize1 * 2, glowSize1 * 2);

        const glow2 = ctx.createRadialGradient(lx, 40, glowSize1, lx, 40, glowSize2);
        glow2.addColorStop(0, 'rgba(255, 200, 100, 0.1)');
        glow2.addColorStop(1, 'rgba(255, 200, 100, 0)');
        ctx.fillStyle = glow2;
        ctx.fillRect(lx - glowSize2, 40 - glowSize2, glowSize2 * 2, glowSize2 * 2);
      }

      // Premium info panel - dark elegant background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
      ctx.fillRect(0, 0, canvas.width, 110);
      
      // Top accent line
      ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
      ctx.fillRect(0, 108, canvas.width, 3);

      // Title with premium styling
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 60px "Arial", sans-serif';
      ctx.textAlign = 'left';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 4;
      ctx.fillText(style.name, 80, 70);
      ctx.shadowColor = 'transparent';

      // Interior details
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 28px "Arial", sans-serif';
      ctx.fillText(`${room} • ${budget}`, 80, canvas.height - 40);
      
      ctx.font = '20px "Arial", sans-serif';
      ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
      ctx.textAlign = 'right';
      ctx.fillText(budgetTier === 0 ? 'BUDGET' : budgetTier === 1 ? 'STANDARD' : budgetTier === 2 ? 'PREMIUM' : 'LUXURY', canvas.width - 80, canvas.height - 50);

      // Color palette - elegant display
      const palStartX = canvas.width - 520;
      const palY = canvas.height - 90;
      const palBoxSize = 55;
      const palSpacing = 68;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(palStartX - 20, palY - 15, style.colors.length * palSpacing, 75);

      style.colors.forEach((color, idx) => {
        const x = palStartX + idx * palSpacing;
        const y = palY;

        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;

        ctx.fillStyle = color;
        ctx.fillRect(x, y, palBoxSize, palBoxSize);

        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, palBoxSize, palBoxSize);
      });

      setGeneratedImage(canvas.toDataURL());
      setGenerated(true);
      toast({ title: "🎉 AI Design Generated!", description: `${style.name} design for ${room} is ready - ${budgetTierLabel()}` });
    } catch (error) {
      toast({ title: "❌ Generation Failed", description: "Could not generate the design image. Please try again." });
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) {
      toast({ title: "⚠️ No Design Yet", description: "Generate a design first before downloading." });
      return;
    }

    try {
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `${style.name.replace(/\s+/g, '_')}_${room.replace(/\s+/g, '_')}_${timestamp}.png`;
      
      link.href = generatedImage;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({ title: "✅ Design Downloaded!", description: `Saved as ${filename}` });
    } catch (error) {
      toast({ title: "❌ Download Failed", description: "Could not download the design image." });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "🔗 Link Copied!", description: "Share this design with anyone." });
  };

  const handleSave = () => {
    if (!generatedImage) {
      toast({ title: "⚠️ No Design Yet", description: "Generate a design first before saving." });
      return;
    }

    (async () => {
      try {
        const designId = `design_${Date.now()}`;
        const title = `${room} – ${style.name}`;
        const date = new Date().toISOString().slice(0, 10);
        const colors = style.colors;

        const blob = await (await fetch(generatedImage)).blob();
        const formData = new FormData();
        formData.append('id', designId);
        formData.append('title', title);
        formData.append('style', style.name);
        formData.append('room', room);
        formData.append('budget', budget);
        formData.append('colors', JSON.stringify(colors));
        formData.append('tags', JSON.stringify(['New']));
        formData.append('image', blob, `${designId}.png`);

        // Try saving to backend catalogs first (keeps localStorage small)
        let imageUrl: string | null = null;
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/catalog/designs`, {
            method: 'POST',
            body: formData,
          });
          if (res.ok) {
            const json = await res.json();
            imageUrl = json?.data?.imageUrl || json?.data?.image_url || null;
          }
        } catch {
          // ignore; fallback to local-only below
        }

        const savedRaw = localStorage.getItem('catalog_designs');
        const saved = savedRaw ? JSON.parse(savedRaw) : [];
        const newDesign = {
          id: designId,
          title,
          style: style.name,
          room,
          budget,
          date,
          colors,
          starred: false,
          tags: ['New'],
          image: imageUrl ?? generatedImage,
        };

        saved.unshift(newDesign);
        localStorage.setItem('catalog_designs', JSON.stringify(saved.slice(0, 50)));
        toast({ title: "💾 Saved to Catalog!", description: `${style.name} design saved successfully.` });
      } catch {
        toast({ title: "❌ Save Failed", description: "Could not save to catalog." });
      }
    })();
  };

  return (
    <div className="min-h-screen py-10" style={{ background: "hsl(230 25% 8%)" }}>
      <div className="container mx-auto px-4 lg:px-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-body text-sm tracking-widest uppercase font-medium mb-2" style={{ color: "hsl(36 85% 55%)" }}>Studio</p>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold mb-3" style={{ color: "hsl(45 30% 92%)" }}>Design Studio</h1>
          <p className="font-body text-base" style={{ color: "hsl(220 15% 55%)" }}>Create your perfect interior with AI assistance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Preferences */}
          <div className="space-y-6">
            {/* Design Preferences */}
            <div className="p-6 rounded-2xl border" style={{ background: "hsl(228 22% 12%)", borderColor: "hsl(228 18% 20%)" }}>
              <h2 className="font-display text-lg font-semibold mb-5" style={{ color: "hsl(45 30% 90%)" }}>Design Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="font-body text-xs font-medium block mb-1.5" style={{ color: "hsl(220 15% 55%)" }}>Style Theme</label>
                  <select value={style.name} onChange={e => setStyle(STYLES.find(s => s.name === e.target.value) || STYLES[0])}
                    className="w-full px-3 py-2.5 rounded-lg font-body text-sm border outline-none"
                    style={{ background: "hsl(228 18% 16%)", color: "hsl(45 30% 88%)", borderColor: "hsl(228 18% 24%)" }}>
                    {STYLES.map(s => <option key={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs font-medium block mb-1.5" style={{ color: "hsl(220 15% 55%)" }}>Budget</label>
                  <select value={budget} onChange={e => setBudget(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg font-body text-sm border outline-none"
                    style={{ background: "hsl(228 18% 16%)", color: "hsl(45 30% 88%)", borderColor: "hsl(228 18% 24%)" }}>
                    {BUDGETS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs font-medium block mb-1.5" style={{ color: "hsl(220 15% 55%)" }}>Room Type</label>
                  <select value={room} onChange={e => setRoom(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg font-body text-sm border outline-none"
                    style={{ background: "hsl(228 18% 16%)", color: "hsl(45 30% 88%)", borderColor: "hsl(228 18% 24%)" }}>
                    {ROOMS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="p-6 rounded-2xl border" style={{ background: "hsl(228 22% 12%)", borderColor: "hsl(228 18% 20%)" }}>
              <h3 className="font-display text-base font-semibold mb-4" style={{ color: "hsl(45 30% 90%)" }}>Quick Tips</h3>
              <ul className="space-y-2">
                {[
                  "Upload your room photo first for best results",
                  "Adjust budget to see different options",
                  "Try different styles to compare",
                  "View designs in AR on your mobile device",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 font-body text-xs" style={{ color: "hsl(220 15% 60%)" }}>
                    <span style={{ color: "hsl(36 85% 55%)" }}>→</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Generate Button */}
            <button onClick={generate} disabled={generating}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-body font-semibold text-base transition-all duration-300 hover:scale-105 disabled:opacity-60 shadow-gold"
              style={{ background: "var(--gradient-gold)", color: "hsl(230 25% 8%)" }}>
              {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
              {generating ? "Generating..." : "Generate AI Design"}
            </button>

            {/* AI Status */}
            {(generating || generated) && (
              <div className="p-4 rounded-xl border flex items-center gap-3"
                style={{ background: generated ? "hsl(142 70% 45% / 0.08)" : "hsl(36 85% 55% / 0.08)", borderColor: generated ? "hsl(142 70% 45% / 0.3)" : "hsl(36 85% 55% / 0.3)" }}>
                {generating ? (
                  <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" style={{ color: "hsl(36 85% 55%)" }} />
                ) : (
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(142 70% 55%)" }} />
                )}
                <span className="font-body text-sm font-medium" style={{ color: generated ? "hsl(142 70% 55%)" : "hsl(36 85% 65%)" }}>
                  {aiStatus || "AI Design Complete"}
                </span>
              </div>
            )}
          </div>

          {/* Right: Design Output */}
          <div className="lg:col-span-2 space-y-6">
            {/* Generated Design Image */}
            {generatedImage && (
              <div className="p-8 rounded-2xl border overflow-hidden transition-all duration-500" style={{ background: "linear-gradient(135deg, hsl(228 22% 14%) 0%, hsl(228 22% 10%) 100%)", borderColor: "hsl(36 85% 55% / 0.6)" }}>
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-6 h-6 animate-pulse" style={{ color: "hsl(36 85% 55%)" }} />
                  <div>
                    <h3 className="font-display text-2xl font-semibold" style={{ color: "hsl(45 30% 95%)" }}>Generated Design Visualization</h3>
                    <p className="font-body text-xs mt-1" style={{ color: "hsl(220 15% 50%)" }}>AI-powered room design based on your preferences</p>
                  </div>
                </div>
                <div className="relative rounded-xl overflow-hidden border-2" style={{ borderColor: "hsl(36 85% 55% / 0.3)", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
                  <img src={generatedImage} alt="Generated Design" className="w-full rounded-lg" />
                  <div className="absolute top-4 right-4 px-4 py-2 rounded-lg font-body text-sm font-semibold" style={{ background: "hsl(142 70% 45% / 0.9)", color: "#FFFFFF" }}>
                    ✓ Ready to Use
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg text-center" style={{ background: "hsl(228 18% 18%)" }}>
                    <p className="font-body text-xs mb-1" style={{ color: "hsl(220 15% 50%)" }}>Style</p>
                    <p className="font-display text-sm font-semibold" style={{ color: "hsl(36 85% 55%)" }}>{style.name}</p>
                  </div>
                  <div className="p-4 rounded-lg text-center" style={{ background: "hsl(228 18% 18%)" }}>
                    <p className="font-body text-xs mb-1" style={{ color: "hsl(220 15% 50%)" }}>Room Type</p>
                    <p className="font-display text-sm font-semibold" style={{ color: "hsl(210 80% 60%)" }}>{room}</p>
                  </div>
                  <div className="p-4 rounded-lg text-center" style={{ background: "hsl(228 18% 18%)" }}>
                    <p className="font-body text-xs mb-1" style={{ color: "hsl(220 15% 50%)" }}>Budget Range</p>
                    <p className="font-display text-sm font-semibold" style={{ color: "hsl(142 70% 45%)" }}>{budget}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Style Suggestions */}
            <div className="p-6 rounded-2xl border" style={{ background: "hsl(228 22% 12%)", borderColor: generated ? "hsl(36 85% 55% / 0.4)" : "hsl(228 18% 20%)" }}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5" style={{ color: "hsl(36 85% 55%)" }} />
                <h3 className="font-display text-lg font-semibold" style={{ color: "hsl(45 30% 90%)" }}>Style Suggestions</h3>
                {generated && <span className="ml-auto px-2.5 py-0.5 rounded-full font-body text-xs font-semibold" style={{ background: "hsl(142 70% 45% / 0.15)", color: "hsl(142 70% 55%)" }}>AI Generated</span>}
              </div>
              <p className="font-body text-sm mb-6" style={{ color: "hsl(220 15% 65%)" }}>{style.desc}</p>

              {/* Color Palette */}
              <div className="mb-6">
                <p className="font-body text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "hsl(220 15% 50%)" }}>Color Palette</p>
                <div className="flex gap-3">
                  {style.colors.map(c => (
                    <div key={c} className="flex flex-col items-center gap-1.5">
                      <div className="w-12 h-12 rounded-xl border-2 hover:scale-110 transition-transform cursor-pointer"
                        style={{ background: c, borderColor: "hsl(228 18% 28%)" }} />
                      <span className="font-body text-xs" style={{ color: "hsl(220 15% 50%)" }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div className="mb-6">
                <p className="font-body text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "hsl(220 15% 50%)" }}>Materials & Textures</p>
                <div className="flex flex-wrap gap-2">
                  {style.materials.map(m => (
                    <span key={m} className="px-3 py-1.5 rounded-lg font-body text-xs font-medium"
                      style={{ background: "hsl(228 18% 18%)", color: "hsl(45 30% 80%)", border: "1px solid hsl(228 18% 26%)" }}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Furniture */}
              <div>
                <p className="font-body text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "hsl(220 15% 50%)" }}>Recommended Furniture</p>
                <ul className="space-y-2">
                  {style.furniture.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 font-body text-sm" style={{ color: "hsl(45 30% 78%)" }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "hsl(36 85% 55%)" }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Save to Catalog", icon: BookOpen, action: handleSave, primary: true },
                { label: "Live AR Camera", icon: Video, action: () => navigate("/ar-camera") },
                { label: "Download Design", icon: Download, action: handleDownload },
                { label: "Share", icon: Share2, action: handleShare },
                { label: "Analyze Room", icon: Sparkles, action: () => navigate("/analyze") },
                { label: "Budget Planner", icon: Sparkles, action: () => navigate("/budget") },
              ].map(({ label, icon: Icon, action, primary }) => (
                <button key={label} onClick={action}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-body text-sm font-medium transition-all hover:scale-105"
                  style={primary ? {
                    background: "var(--gradient-gold)",
                    color: "hsl(230 25% 8%)"
                  } : {
                    background: "hsl(228 22% 14%)",
                    color: "hsl(45 30% 80%)",
                    border: "1px solid hsl(228 18% 24%)"
                  }}>
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignStudioPage;
