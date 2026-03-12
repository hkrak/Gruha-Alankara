import { useEffect, useMemo, useState } from "react";
import { PiggyBank, TrendingDown, Plus, Minus, RefreshCw, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Category = { label: string; emoji: string; allocated: number; spent: number; color: string };

const DEFAULT_EXCHANGE_RATE = 83; // 1 USD = 83 INR
const defaultCategories: Category[] = [
  { label: "Furniture", emoji: "🛋️", allocated: 2500 * DEFAULT_EXCHANGE_RATE, spent: 1800 * DEFAULT_EXCHANGE_RATE, color: "hsl(36 85% 55%)" },
  { label: "Lighting", emoji: "💡", allocated: 800 * DEFAULT_EXCHANGE_RATE, spent: 320 * DEFAULT_EXCHANGE_RATE, color: "hsl(210 80% 60%)" },
  { label: "Decor & Art", emoji: "🎨", allocated: 600 * DEFAULT_EXCHANGE_RATE, spent: 450 * DEFAULT_EXCHANGE_RATE, color: "hsl(280 70% 60%)" },
  { label: "Flooring", emoji: "🏠", allocated: 1200 * DEFAULT_EXCHANGE_RATE, spent: 900 * DEFAULT_EXCHANGE_RATE, color: "hsl(142 70% 45%)" },
  { label: "Paint & Wallpaper", emoji: "🖌️", allocated: 400 * DEFAULT_EXCHANGE_RATE, spent: 180 * DEFAULT_EXCHANGE_RATE, color: "hsl(0 72% 60%)" },
  { label: "Storage", emoji: "📦", allocated: 500 * DEFAULT_EXCHANGE_RATE, spent: 260 * DEFAULT_EXCHANGE_RATE, color: "hsl(45 90% 55%)" },
];

const tips = [
  "Mix high-end statement pieces with budget-friendly basics for the best value.",
  "Shop during seasonal sales — Black Friday and end-of-year clearances offer up to 60% off.",
  "DIY painting can save $300-600 compared to hiring professionals.",
  "Consider refurbishing existing furniture instead of buying new.",
  "Buy floor models for significant discounts on quality furniture.",
  "Use plants instead of expensive decor — they're cheaper and healthier.",
];

const BudgetPlannerPage = () => {
  const [total, setTotal] = useState(6000 * DEFAULT_EXCHANGE_RATE);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const { toast } = useToast();

  // Load saved plan (if any)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("budget_plan_v1");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (typeof parsed?.total === "number") setTotal(parsed.total);
      if (Array.isArray(parsed?.categories)) {
        const nextCats: Category[] = parsed.categories
          .filter((c: any) => c && typeof c.label === "string")
          .map((c: any) => ({
            label: String(c.label),
            emoji: typeof c.emoji === "string" ? c.emoji : "🧾",
            allocated: typeof c.allocated === "number" ? c.allocated : 0,
            spent: typeof c.spent === "number" ? c.spent : 0,
            color: typeof c.color === "string" ? c.color : "hsl(36 85% 55%)",
          }));
        if (nextCats.length > 0) setCategories(nextCats);
      }
    } catch {
      // ignore
    }
  }, []);

  const totalAllocated = useMemo(
    () => categories.reduce((s, c) => s + c.allocated, 0),
    [categories]
  );
  const totalSpent = useMemo(
    () => categories.reduce((s, c) => s + c.spent, 0),
    [categories]
  );
  // Remaining budget should be based on spend (not allocation)
  const remainingBudget = total - totalSpent;
  const unallocated = total - totalAllocated;

  const adjustAllocation = (label: string, delta: number) => {
    setCategories(prev => prev.map(c =>
      c.label === label ? { ...c, allocated: Math.max(0, c.allocated + delta) } : c
    ));
  };

  const autoAllocate = () => {
    const weights = [0.42, 0.13, 0.10, 0.20, 0.07, 0.08];
    setCategories(prev => {
      const next = prev.map((c, i) => ({
        ...c,
        allocated: Math.round(total * (weights[i] ?? 0)),
      }));
      // Ensure exact sum === total by correcting last category
      const sum = next.reduce((s, c) => s + c.allocated, 0);
      const diff = total - sum;
      if (next.length > 0 && diff !== 0) {
        const lastIdx = next.length - 1;
        next[lastIdx] = {
          ...next[lastIdx],
          allocated: Math.max(0, next[lastIdx].allocated + diff),
        };
      }
      return next;
    });
    toast({ title: "🎯 Auto-allocated!", description: "Budget distributed using optimal ratios." });
  };

  const save = () => {
    try {
      localStorage.setItem(
        "budget_plan_v1",
        JSON.stringify({ total, categories, savedAt: new Date().toISOString() })
      );
      toast({ title: "💾 Budget Saved!", description: "Your budget plan has been saved." });
    } catch {
      toast({ title: "❌ Save Failed", description: "Could not save your budget plan." });
    }
  };

  return (
    <div className="min-h-screen py-10" style={{ background: "hsl(230 25% 8%)" }}>
      <div className="container mx-auto px-4 lg:px-12 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <p className="font-body text-sm tracking-widest uppercase font-medium mb-2" style={{ color: "hsl(36 85% 55%)" }}>Finance</p>
          <h1 className="font-display text-4xl font-semibold" style={{ color: "hsl(45 30% 92%)" }}>Budget Planner</h1>
          <p className="font-body text-sm mt-1" style={{ color: "hsl(220 15% 55%)" }}>Smart budget allocation across furniture, decor, and materials</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Budget", value: `₹${total.toLocaleString()}`, color: "hsl(36 85% 55%)", icon: "💰" },
            { label: "Allocated", value: `₹${totalAllocated.toLocaleString()}`, color: "hsl(210 80% 60%)", icon: "📊" },
            { label: "Spent", value: `₹${totalSpent.toLocaleString()}`, color: "hsl(142 70% 45%)", icon: "✅" },
            { label: "Remaining", value: `₹${remainingBudget.toLocaleString()}`, color: remainingBudget < 0 ? "hsl(0 72% 60%)" : "hsl(45 90% 55%)", icon: remainingBudget < 0 ? "⚠️" : "💵" },
          ].map(({ label, value, color, icon }, idx) => (
            <div key={label} className="p-5 rounded-2xl border" style={{ background: "hsl(228 22% 12%)", borderColor: "hsl(228 18% 20%)" }}>
              <div className="text-2xl mb-2">{icon}</div>
              <div className="font-body text-xs mb-1" style={{ color: "hsl(220 15% 55%)" }}>{label}</div>
              <div className="font-display text-xl font-semibold" style={{ color }}>{value}</div>
              {idx === 1 && (
                <div className="mt-2 font-body text-xs" style={{ color: unallocated < 0 ? "hsl(0 72% 60%)" : "hsl(220 15% 55%)" }}>
                  {unallocated < 0 ? `Over-allocated by ₹${Math.abs(unallocated).toLocaleString()}` : `Unallocated ₹${unallocated.toLocaleString()}`}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Total Budget Input */}
        <div className="p-6 rounded-2xl border mb-6" style={{ background: "hsl(228 22% 12%)", borderColor: "hsl(228 18% 20%)" }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <label className="font-body text-sm font-semibold mb-1 block" style={{ color: "hsl(45 30% 85%)" }}>Total Budget (₹)</label>
              <div className="flex items-center gap-3">
                <input type="number" value={total} onChange={e => setTotal(Number(e.target.value))}
                  className="px-4 py-2.5 rounded-xl font-body text-base font-semibold border outline-none w-40"
                  style={{ background: "hsl(228 18% 16%)", color: "hsl(45 30% 90%)", borderColor: "hsl(228 18% 28%)" }} />
                <input type="range" min={50000} max={5000000} step={50000} value={total}
                  onChange={e => setTotal(Number(e.target.value))}
                  className="flex-1 accent-amber-500" style={{ minWidth: "120px" }} />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={autoAllocate}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-sm font-semibold transition-all hover:scale-105 shadow-gold"
                style={{ background: "var(--gradient-gold)", color: "hsl(230 25% 8%)" }}>
                <RefreshCw className="w-4 h-4" />
                Auto Allocate
              </button>
              <button onClick={save}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-sm font-medium border transition-all hover:scale-105"
                style={{ borderColor: "hsl(228 18% 28%)", color: "hsl(45 30% 80%)", background: "hsl(228 22% 16%)" }}>
                <CheckCircle className="w-4 h-4" />
                Save Plan
              </button>
            </div>
          </div>
        </div>

        {/* Category Allocation */}
        <div className="p-6 rounded-2xl border mb-6" style={{ background: "hsl(228 22% 12%)", borderColor: "hsl(228 18% 20%)" }}>
          <div className="flex items-center gap-2 mb-6">
            <PiggyBank className="w-5 h-5" style={{ color: "hsl(36 85% 55%)" }} />
            <h2 className="font-display text-lg font-semibold" style={{ color: "hsl(45 30% 90%)" }}>Category Breakdown</h2>
          </div>

          <div className="space-y-5">
            {categories.map(cat => {
              const pct = total > 0 ? Math.round((cat.allocated / total) * 100) : 0;
              const spentPct = cat.allocated > 0 ? Math.min(100, Math.round((cat.spent / cat.allocated) * 100)) : 0;
              return (
                <div key={cat.label}>
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cat.emoji}</span>
                      <span className="font-body text-sm font-medium" style={{ color: "hsl(45 30% 85%)" }}>{cat.label}</span>
                      <span className="font-body text-xs px-2 py-0.5 rounded-full" style={{ background: `${cat.color}18`, color: cat.color }}>{pct}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => adjustAllocation(cat.label, -10000)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center border transition-all hover:scale-110"
                        style={{ borderColor: "hsl(228 18% 28%)", color: "hsl(220 15% 65%)", background: "hsl(228 18% 16%)" }}>
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-body text-sm font-semibold w-24 text-center" style={{ color: "hsl(45 30% 85%)" }}>
                        ₹{cat.allocated.toLocaleString()}
                      </span>
                      <button onClick={() => adjustAllocation(cat.label, 10000)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center border transition-all hover:scale-110"
                        style={{ borderColor: "hsl(228 18% 28%)", color: "hsl(220 15% 65%)", background: "hsl(228 18% 16%)" }}>
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  {/* Allocation bar */}
                  <div className="h-2 rounded-full overflow-hidden mb-1" style={{ background: "hsl(228 18% 20%)" }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: cat.color }} />
                  </div>
                  {/* Spent bar */}
                  <div className="flex justify-between">
                    <span className="font-body text-xs" style={{ color: "hsl(220 15% 45%)" }}>Spent: ₹{cat.spent.toLocaleString()} ({spentPct}%)</span>
                    <span className="font-body text-xs" style={{ color: cat.spent > cat.allocated ? "hsl(0 72% 60%)" : "hsl(142 70% 55%)" }}>
                      {cat.spent > cat.allocated ? "Over budget!" : `₹${(cat.allocated - cat.spent).toLocaleString()} left`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Savings Tips */}
        <div className="p-6 rounded-2xl border" style={{ background: "hsl(228 22% 12%)", borderColor: "hsl(228 18% 20%)" }}>
          <div className="flex items-center gap-2 mb-5">
            <TrendingDown className="w-5 h-5" style={{ color: "hsl(142 70% 55%)" }} />
            <h2 className="font-display text-lg font-semibold" style={{ color: "hsl(45 30% 90%)" }}>Smart Savings Tips</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl"
                style={{ background: "hsl(228 18% 16%)", border: "1px solid hsl(228 18% 22%)" }}>
                <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                  style={{ background: "hsl(36 85% 55% / 0.15)", color: "hsl(36 85% 55%)" }}>
                  {i + 1}
                </span>
                <p className="font-body text-xs leading-relaxed" style={{ color: "hsl(220 15% 62%)" }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlannerPage;
