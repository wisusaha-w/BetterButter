import React, { useEffect, useRef } from 'react';
import { BookOpen, BookmarkCheck, RotateCcw, ArrowLeft } from 'lucide-react';
import type { EvaluationResult, FinanceParams } from '../types/bakery';
import { formatIDR } from '../utils/evaluation';

interface StageBusinessProps {
  evaluation: EvaluationResult;
  finance: FinanceParams;
  onUpdateFinance: (patch: Partial<FinanceParams>) => void;
  onOpenRecipe: () => void;
  onSaveCreation: () => void;
  onBackToMarket: () => void;
  onBackToEval: () => void;
  onRestart: () => void;
}

export const StageBusiness: React.FC<StageBusinessProps> = ({
  evaluation,
  finance,
  onUpdateFinance,
  onOpenRecipe,
  onSaveCreation,
  onBackToMarket,
  onBackToEval,
  onRestart,
}) => {
  const bepCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const costCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const batchIngCost = evaluation.ingredientCost;
  const prodQty = Math.max(1, finance.prodQty || 1);
  const sellPrice = Math.max(0, finance.sellPrice || 0);
  const soldQty = Math.max(0, finance.soldQty || 0);
  const packUnit = Math.max(0, finance.packUnit || 0);
  const varOpUnit = Math.max(0, finance.varOpUnit || 0);
  const fixedOp = Math.max(0, finance.fixedOp || 0);
  const sellingExp = Math.max(0, finance.sellingExp || 0);

  // A. Production Cost (HPP)
  const ingPerUnit = batchIngCost / prodQty;
  const totalPackaging = packUnit * prodQty;
  const totalVarOp = varOpUnit * prodQty;
  const varCostPerUnit = ingPerUnit + packUnit + varOpUnit;
  const totalProdCost = batchIngCost + totalPackaging + totalVarOp + fixedOp;
  const hppPerUnit = totalProdCost / prodQty;

  // B, C, D, E. Revenue, Profit, Margin
  const revenue = sellPrice * soldQty;
  const profit = revenue - totalProdCost - sellingExp;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  // F. Break-Even Point (BEP)
  const totalFixedCosts = fixedOp + sellingExp;
  const contributionMargin = sellPrice - varCostPerUnit;
  const bepUnits = contributionMargin > 0 ? Math.ceil(totalFixedCosts / contributionMargin) : Infinity;
  const bepRevenue = Number.isFinite(bepUnits) ? bepUnits * sellPrice : Infinity;

  useEffect(() => {
    const canvas = bepCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const pad = { l: 56, r: 20, t: 24, b: 34 };
    const maxUnits = Math.max(
      prodQty * 1.4,
      Number.isFinite(bepUnits) ? bepUnits * 1.4 : prodQty * 1.5,
      10
    );
    const maxY = Math.max(
      totalFixedCosts + varCostPerUnit * maxUnits,
      sellPrice * maxUnits,
      10000
    );

    const toX = (u: number) => pad.l + (u / maxUnits) * (W - pad.l - pad.r);
    const toY = (v: number) => H - pad.b - (v / maxY) * (H - pad.t - pad.b);

    // Axes
    ctx.strokeStyle = '#d9c2cb';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t);
    ctx.lineTo(pad.l, H - pad.b);
    ctx.lineTo(W - pad.r, H - pad.b);
    ctx.stroke();

    // Total Cost Line
    ctx.strokeStyle = '#49343B';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(totalFixedCosts));
    ctx.lineTo(toX(maxUnits), toY(totalFixedCosts + varCostPerUnit * maxUnits));
    ctx.stroke();

    // Revenue Line
    ctx.strokeStyle = '#C44676';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(0));
    ctx.lineTo(toX(maxUnits), toY(sellPrice * maxUnits));
    ctx.stroke();

    // BEP Marker
    if (Number.isFinite(bepUnits) && bepUnits <= maxUnits) {
      const bx = toX(bepUnits);
      const by = toY(bepUnits * sellPrice);
      ctx.fillStyle = '#2e8b57';
      ctx.beginPath();
      ctx.arc(bx, by, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`BEP: ${bepUnits}u`, Math.min(bx + 8, W - 75), Math.max(by - 8, 18));
    }

    // Labels & Legend
    ctx.fillStyle = '#49343B';
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Units Sold', W / 2 - 24, H - 8);
    ctx.fillText('Revenue', pad.l + 8, pad.t + 10);
    ctx.fillStyle = '#C44676';
    ctx.fillRect(pad.l + 60, pad.t + 3, 14, 4);
    ctx.fillStyle = '#49343B';
    ctx.fillText('Total Cost', pad.l + 86, pad.t + 10);
    ctx.fillRect(pad.l + 148, pad.t + 3, 14, 4);
  }, [totalFixedCosts, varCostPerUnit, sellPrice, prodQty, bepUnits]);

  useEffect(() => {
    const canvas = costCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const slices = [
      { label: 'Ingredients', val: batchIngCost, color: '#C44676' },
      { label: 'Packaging', val: totalPackaging, color: '#F8C8DC' },
      { label: 'Var. Ops', val: totalVarOp, color: '#ffd166' },
      { label: 'Fixed Ops', val: fixedOp, color: '#7B5D67' },
      { label: 'Selling Exp', val: sellingExp, color: '#8ad4ae' },
    ];
    const total = slices.reduce((s, a) => s + a.val, 0) || 1;
    let start = -Math.PI / 2;
    const cx = 112;
    const cy = 122;
    const r = 78;

    slices.forEach((s, idx) => {
      const ang = (s.val / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + ang);
      ctx.closePath();
      ctx.fillStyle = s.color;
      ctx.fill();
      start += ang;

      const ly = 44 + idx * 34;
      ctx.fillStyle = s.color;
      ctx.fillRect(218, ly, 14, 14);
      ctx.fillStyle = '#49343B';
      ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${s.label}: ${Math.round((s.val / total) * 100)}%`, 240, ly + 11);
    });

    ctx.beginPath();
    ctx.arc(cx, cy, 38, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  }, [batchIngCost, totalPackaging, totalVarOp, fixedOp, sellingExp]);

  return (
    <section className="space-y-5">
      {/* Banner */}
      <div className="bg-white rounded-[24px] px-6 py-5 border-2 border-[#FCE4EC] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#49343B] tracking-tight">
            Stage 5: Business &amp; Financial Analysis
          </h1>
          <p className="text-sm text-[#7B5D67] mt-0.5">
            Calculate HPP (Production Cost), Pricing, Revenue (Omzet), Profit, Profit Margin, and Break-Even Point (BEP) for <strong>{evaluation.productName}</strong>.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onOpenRecipe}
            className="px-4 py-2.5 rounded-xl bg-white border-2 border-[#F8C8DC] hover:bg-[#FCE4EC] text-xs sm:text-sm font-bold text-[#49343B] flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-[#C44676]" />
            <span>VIEW RECIPE</span>
          </button>
          <button
            type="button"
            onClick={onSaveCreation}
            className="px-4 py-2.5 rounded-xl bg-[#FCE4EC] border-2 border-[#F8C8DC] hover:bg-[#F8C8DC] text-xs sm:text-sm font-bold text-[#49343B] flex items-center gap-1.5"
          >
            <BookmarkCheck className="w-4 h-4 text-[#C44676]" />
            <span>SAVE CREATION</span>
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="px-4 py-2.5 rounded-xl bg-[#fdecef] border border-[#f7c7d1] hover:bg-[#fad8df] text-xs sm:text-sm font-bold text-[#9c253f] flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-[18px] p-4 border border-[#FCE4EC] shadow-sm">
          <div className="text-xs font-bold text-[#7B5D67]">Total Production Cost (HPP)</div>
          <div className="text-xl font-black text-[#49343B] mt-1 tabular-nums">
            {formatIDR(totalProdCost)}
          </div>
          <div className="text-xs text-[#7B5D67] mt-0.5 tabular-nums">
            HPP / unit: {formatIDR(hppPerUnit)}
          </div>
        </div>

        <div className="bg-white rounded-[18px] p-4 border border-[#FCE4EC] shadow-sm">
          <div className="text-xs font-bold text-[#7B5D67]">Revenue (Omzet)</div>
          <div className="text-xl font-black text-[#C44676] mt-1 tabular-nums">
            {formatIDR(revenue)}
          </div>
          <div className="text-xs text-[#7B5D67] mt-0.5 tabular-nums">
            {soldQty} sold × {formatIDR(sellPrice)}
          </div>
        </div>

        <div className="bg-white rounded-[18px] p-4 border border-[#FCE4EC] shadow-sm">
          <div className="text-xs font-bold text-[#7B5D67]">Net Profit</div>
          <div
            className={`text-xl font-black mt-1 tabular-nums ${
              profit >= 0 ? 'text-[#206b45]' : 'text-[#9c253f]'
            }`}
          >
            {formatIDR(profit)}
          </div>
          <div className="text-xs text-[#7B5D67] mt-0.5 tabular-nums">
            Margin: {margin.toFixed(1)}%
          </div>
        </div>

        <div className="bg-white rounded-[18px] p-4 border border-[#FCE4EC] shadow-sm">
          <div className="text-xs font-bold text-[#7B5D67]">Break-Even Point (BEP)</div>
          <div className="text-xl font-black text-[#49343B] mt-1 tabular-nums">
            {Number.isFinite(bepUnits) ? `${bepUnits} units` : 'Unprofitable'}
          </div>
          <div className="text-xs text-[#7B5D67] mt-0.5 tabular-nums">
            {Number.isFinite(bepRevenue) ? formatIDR(bepRevenue) : 'Price ≤ Variable Cost'}
          </div>
        </div>
      </div>

      {/* Controls + Breakdown & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-[370px_1fr] gap-5 items-start">
        {/* Parameters */}
        <div className="bg-white rounded-[20px] p-5 border border-[#FCE4EC] shadow-sm space-y-3.5">
          <h2 className="text-base font-extrabold text-[#49343B]">Business Parameters</h2>

          <div>
            <label className="flex justify-between text-xs font-bold mb-1">
              <span>Batch Yield (Production Qty, units)</span>
              <span className="tabular-nums text-[#C44676]">{prodQty} units</span>
            </label>
            <input
              type="number"
              min={1}
              max={500}
              value={finance.prodQty}
              onChange={(e) =>
                onUpdateFinance({ prodQty: Math.max(1, Number(e.target.value) || 1) })
              }
              className="w-full px-3 py-2 rounded-xl border border-[#F8C8DC] bg-[#FFF9F5] font-bold text-sm tabular-nums"
            />
          </div>

          <div>
            <label className="flex justify-between text-xs font-bold mb-1">
              <span>Selling Price per Unit (IDR)</span>
              <span className="tabular-nums text-[#C44676]">{formatIDR(sellPrice)}</span>
            </label>
            <input
              type="number"
              min={500}
              step={500}
              value={finance.sellPrice}
              onChange={(e) =>
                onUpdateFinance({ sellPrice: Math.max(0, Number(e.target.value) || 0) })
              }
              className="w-full px-3 py-2 rounded-xl border border-[#F8C8DC] bg-[#FFF9F5] font-bold text-sm tabular-nums"
            />
          </div>

          <div>
            <label className="flex justify-between text-xs font-bold mb-1">
              <span>Estimated Units Sold</span>
              <span className="tabular-nums text-[#C44676]">{soldQty} units</span>
            </label>
            <input
              type="number"
              min={0}
              max={500}
              value={finance.soldQty}
              onChange={(e) =>
                onUpdateFinance({ soldQty: Math.max(0, Number(e.target.value) || 0) })
              }
              className="w-full px-3 py-2 rounded-xl border border-[#F8C8DC] bg-[#FFF9F5] font-bold text-sm tabular-nums"
            />
          </div>

          <hr className="border-dashed border-[#F8C8DC]" />
          <div className="text-xs font-extrabold text-[#C44676]">Variable Costs (Per Unit)</div>

          <div>
            <label className="block text-xs font-bold mb-1">Packaging Cost / Unit (IDR)</label>
            <input
              type="number"
              min={0}
              step={250}
              value={finance.packUnit}
              onChange={(e) =>
                onUpdateFinance({ packUnit: Math.max(0, Number(e.target.value) || 0) })
              }
              className="w-full px-3 py-2 rounded-xl border border-[#F8C8DC] bg-[#FFF9F5] font-bold text-sm tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">
              Variable Energy / Gas / Baking / Unit (IDR)
            </label>
            <input
              type="number"
              min={0}
              step={250}
              value={finance.varOpUnit}
              onChange={(e) =>
                onUpdateFinance({ varOpUnit: Math.max(0, Number(e.target.value) || 0) })
              }
              className="w-full px-3 py-2 rounded-xl border border-[#F8C8DC] bg-[#FFF9F5] font-bold text-sm tabular-nums"
            />
          </div>

          <hr className="border-dashed border-[#F8C8DC]" />
          <div className="text-xs font-extrabold text-[#C44676]">Fixed &amp; Selling Expenses (IDR)</div>

          <div>
            <label className="block text-xs font-bold mb-1">
              Fixed Operational Cost (Kitchen / Labor / Overhead)
            </label>
            <input
              type="number"
              min={0}
              step={5000}
              value={finance.fixedOp}
              onChange={(e) =>
                onUpdateFinance({ fixedOp: Math.max(0, Number(e.target.value) || 0) })
              }
              className="w-full px-3 py-2 rounded-xl border border-[#F8C8DC] bg-[#FFF9F5] font-bold text-sm tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">
              Other Selling Expenses (Ads, Platform Fee, Delivery)
            </label>
            <input
              type="number"
              min={0}
              step={2500}
              value={finance.sellingExp}
              onChange={(e) =>
                onUpdateFinance({ sellingExp: Math.max(0, Number(e.target.value) || 0) })
              }
              className="w-full px-3 py-2 rounded-xl border border-[#F8C8DC] bg-[#FFF9F5] font-bold text-sm tabular-nums"
            />
          </div>
        </div>

        {/* Table + Charts */}
        <div className="space-y-4">
          <div className="bg-white rounded-[20px] p-5 border border-[#FCE4EC] shadow-sm overflow-x-auto">
            <h2 className="text-base font-extrabold text-[#49343B] mb-2">
              HPP, Profitability &amp; BEP Breakdown
            </h2>
            <table className="w-full text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-[#FCE4EC] text-[#49343B]">
                  <th className="py-2 px-3 text-left font-extrabold rounded-tl-lg">
                    Financial Component
                  </th>
                  <th className="py-2 px-3 text-left font-extrabold">Classification</th>
                  <th className="py-2 px-3 text-right font-extrabold rounded-tr-lg">
                    Amount (IDR)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FCE4EC] tabular-nums">
                <tr>
                  <td className="py-2 px-3">Ingredients Used (Batch)</td>
                  <td className="py-2 px-3 text-[#7B5D67]">Variable</td>
                  <td className="py-2 px-3 text-right">{formatIDR(batchIngCost)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">
                    Packaging ({prodQty} × {formatIDR(packUnit)})
                  </td>
                  <td className="py-2 px-3 text-[#7B5D67]">Variable</td>
                  <td className="py-2 px-3 text-right">{formatIDR(totalPackaging)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">
                    Energy &amp; Baking Ops ({prodQty} × {formatIDR(varOpUnit)})
                  </td>
                  <td className="py-2 px-3 text-[#7B5D67]">Variable</td>
                  <td className="py-2 px-3 text-right">{formatIDR(totalVarOp)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold">Variable Cost per Unit</td>
                  <td className="py-2 px-3 text-[#7B5D67]">Unit Metric</td>
                  <td className="py-2 px-3 text-right font-bold">{formatIDR(varCostPerUnit)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Kitchen &amp; Labor Overhead</td>
                  <td className="py-2 px-3 text-[#7B5D67]">Fixed</td>
                  <td className="py-2 px-3 text-right">{formatIDR(fixedOp)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold">Total Production Cost</td>
                  <td className="py-2 px-3 text-[#7B5D67]">HPP Total</td>
                  <td className="py-2 px-3 text-right font-bold">{formatIDR(totalProdCost)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Other Selling Expenses</td>
                  <td className="py-2 px-3 text-[#7B5D67]">Fixed / Selling</td>
                  <td className="py-2 px-3 text-right">{formatIDR(sellingExp)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold">Revenue (Omzet)</td>
                  <td className="py-2 px-3 text-[#7B5D67]">{soldQty} units sold</td>
                  <td className="py-2 px-3 text-right font-bold">{formatIDR(revenue)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold">Net Profit / (Loss)</td>
                  <td className="py-2 px-3 text-[#7B5D67]">Margin {margin.toFixed(1)}%</td>
                  <td
                    className={`py-2 px-3 text-right font-extrabold ${
                      profit >= 0 ? 'text-[#206b45]' : 'text-[#9c253f]'
                    }`}
                  >
                    {formatIDR(profit)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-bold">BEP (Units / Revenue)</td>
                  <td className="py-2 px-3 text-[#7B5D67]">Fixed / (P − VC)</td>
                  <td className="py-2 px-3 text-right font-bold">
                    {Number.isFinite(bepUnits)
                      ? `${bepUnits} pcs (${formatIDR(bepRevenue)})`
                      : 'N/A'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-[20px] p-4 border border-[#FCE4EC] shadow-sm">
              <h3 className="text-sm font-extrabold text-[#49343B] mb-2">
                Break-Even Point (BEP) Chart
              </h3>
              <canvas ref={bepCanvasRef} width={420} height={250} className="w-full h-auto" />
            </div>
            <div className="bg-white rounded-[20px] p-4 border border-[#FCE4EC] shadow-sm">
              <h3 className="text-sm font-extrabold text-[#49343B] mb-2">
                Production Cost Structure
              </h3>
              <canvas ref={costCanvasRef} width={420} height={250} className="w-full h-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="bg-white rounded-[20px] p-4 border-2 border-[#FCE4EC] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onBackToMarket}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#F8C8DC] hover:bg-[#FCE4EC] text-xs font-bold text-[#49343B] flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO INGREDIENT MARKET</span>
          </button>
          <button
            type="button"
            onClick={onBackToEval}
            className="px-4 py-2.5 rounded-xl bg-[#FCE4EC] hover:bg-[#F8C8DC] text-xs font-bold text-[#49343B]"
          >
            ← Back to Product Evaluation
          </button>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onOpenRecipe}
            className="px-4 py-2.5 rounded-xl bg-[#FCE4EC] hover:bg-[#F8C8DC] text-xs font-bold text-[#49343B]"
          >
            VIEW RECIPE
          </button>
          <button
            type="button"
            onClick={onSaveCreation}
            className="px-4 py-2.5 rounded-xl bg-[#FCE4EC] hover:bg-[#F8C8DC] text-xs font-bold text-[#49343B]"
          >
            SAVE CREATION
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E88BAE] to-[#C44676] text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg"
          >
            RESTART NEW SESSION
          </button>
        </div>
      </div>
    </section>
  );
};
