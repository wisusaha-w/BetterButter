import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  BookmarkCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { APPLIANCES, BAKE_PANS, PREP_SHAPES, getIngredientById } from '../data/bakeryData';
import type { BakeState, EvaluationResult, PreCookItem, PrepState } from '../types/bakery';
import { formatIDR } from '../utils/evaluation';
import { FinalProductSvg } from './SvgArtwork';

interface StageEvaluateProps {
  bowl: Record<string, number>;
  prep: PrepState;
  bake: BakeState;
  preCooked: PreCookItem[];
  evaluation: EvaluationResult;
  onOpenRecipe: () => void;
  onSaveCreation: () => void;
  onBackToMarket: () => void;
  onBackToBake: () => void;
  onProceedBusiness: () => void;
}

const CONFETTI_COLORS = ['#F8C8DC', '#E88BAE', '#ffd166', '#70d6ff', '#a9f5c8', '#ff7eb3'];

export const StageEvaluate: React.FC<StageEvaluateProps> = ({
  bowl,
  prep,
  bake,
  preCooked,
  evaluation,
  onOpenRecipe,
  onSaveCreation,
  onBackToMarket,
  onBackToBake,
  onProceedBusiness,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!evaluation.isPerfect) {
      setShowConfetti(false);
      return;
    }
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3800);
    return () => clearTimeout(timer);
  }, [evaluation]);

  const appName = APPLIANCES.find((a) => a.id === bake.appliance)?.name || bake.appliance;
  const panName = BAKE_PANS.find((p) => p.id === bake.pan)?.name || bake.pan;
  const shapeLabel = PREP_SHAPES.find((s) => s.id === prep.shape)?.shortName || prep.shape;
  const effectiveMins = bake.elapsedMins > 0 ? bake.elapsedMins : bake.targetMins;

  return (
    <section className="space-y-5">
      {/* Confetti overlay */}
      {showConfetti &&
        Array.from({ length: 42 }).map((_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${(i * 2.4 + (i % 5) * 3) % 100}vw`,
              backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              animationDelay: `${(i % 8) * 0.1}s`,
            }}
          />
        ))}

      {/* Banner */}
      <div className="bg-white rounded-[24px] px-6 py-5 border-2 border-[#FCE4EC] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#49343B] tracking-tight">
            Stage 4: Final Product &amp; Baking Evaluation
          </h1>
          <p className="text-sm text-[#7B5D67] mt-0.5">
            Rule-based baking science analysis of your ingredients, ratios, preparation method, and thermal control.
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
            onClick={onProceedBusiness}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E88BAE] to-[#C44676] text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg flex items-center gap-1.5"
          >
            <span>Analyze Business &amp; Profit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Celebration Banner */}
      {evaluation.isPerfect && (
        <div className="bg-gradient-to-r from-[#ff7eb3] via-[#E88BAE] to-[#C44676] text-white font-black text-lg sm:text-2xl tracking-wide py-4 px-6 rounded-2xl text-center shadow-lg animate-celebrate">
          🎉 PERFECT!! DELICIOUS!! TALENTED!!! 🎂✨
        </div>
      )}

      {/* Showcase + Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-5 items-stretch">
        {/* Product Card */}
        <div className="bg-gradient-to-b from-white to-[#FCE4EC] rounded-[24px] border-2 border-[#F8C8DC] p-6 text-center flex flex-col items-center justify-center shadow-sm">
          <FinalProductSvg ev={evaluation} shape={prep.shape} bowl={bowl} />
          <h2 className="text-xl font-black text-[#49343B] mt-2">{evaluation.productName}</h2>
          <p className="text-xs font-bold text-[#7B5D67] mt-1">
            {evaluation.appearanceDesc} · {appName}
          </p>
          <div className="mt-4 bg-white p-3.5 rounded-2xl w-full border border-[#F8C8DC]">
            <div className="text-xs font-bold text-[#7B5D67]">Estimated Batch Cost (Ingredients)</div>
            <div className="text-xl font-black text-[#C44676] tabular-nums mt-0.5">
              {formatIDR(evaluation.ingredientCost)}
            </div>
          </div>
        </div>

        {/* Evaluation Card */}
        <div className="bg-white rounded-[24px] border border-[#FCE4EC] p-6 shadow-sm flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-[#49343B]">Baking Lab Evaluation Score</h3>
              <p className="text-xs text-[#7B5D67]">
                {evaluation.isPerfect
                  ? 'Master baker precision! Ready for commercial bakery launch.'
                  : 'Review the chemistry & technique diagnostics below to level up your recipe.'}
              </p>
            </div>
            <div className="text-2xl font-black text-[#C44676] tabular-nums">
              {evaluation.score} / 100
            </div>
          </div>

          <div className="space-y-2">
            {evaluation.errors.map((err, i) => (
              <div
                key={`err-${i}`}
                className="rounded-xl p-3 bg-[#fdecef] border border-[#f5bcc8] text-[#9c253f] text-xs font-bold flex items-start gap-2"
              >
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Issue:</strong> {err}
                </span>
              </div>
            ))}
            {evaluation.warnings.map((warn, i) => (
              <div
                key={`warn-${i}`}
                className="rounded-xl p-3 bg-[#fff5e6] border border-[#f7d5a3] text-[#8c5310] text-xs font-bold flex items-start gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Improvement Tip:</strong> {warn}
                </span>
              </div>
            ))}
            {evaluation.successes.map((ok, i) => (
              <div
                key={`ok-${i}`}
                className="rounded-xl p-3 bg-[#eaf9f0] border border-[#b3e8cb] text-[#206b45] text-xs font-bold flex items-start gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{ok}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
            <div className="bg-[#FFF9F5] p-3.5 rounded-2xl border border-[#FCE4EC]">
              <h4 className="text-xs font-extrabold text-[#49343B] mb-1.5">Ingredients Used</h4>
              <div className="text-xs text-[#49343B] max-h-[135px] overflow-y-auto bakery-scroll space-y-1">
                {Object.entries(bowl).map(([id, amt]) => {
                  const ing = getIngredientById(id);
                  if (!ing) return null;
                  const cost = (amt / ing.packQty) * ing.price;
                  return (
                    <div key={id} className="tabular-nums">
                      • {ing.name}: <strong>{amt} {ing.unit}</strong> ({formatIDR(cost)})
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#FFF9F5] p-3.5 rounded-2xl border border-[#FCE4EC]">
              <h4 className="text-xs font-extrabold text-[#49343B] mb-1.5">Prep &amp; Cooking Summary</h4>
              <div className="text-xs text-[#49343B] space-y-1">
                <div>
                  • <strong>Form:</strong> {shapeLabel}
                </div>
                <div>
                  • <strong>Equipment:</strong> {appName} + {panName}
                </div>
                <div className="tabular-nums">
                  • <strong>Settings:</strong> {bake.temp}°C for {effectiveMins} min
                </div>
                <div>
                  • <strong>Proofing:</strong> {bake.proofed ? 'Yes (45 min rise)' : 'No'}
                </div>
                <div>
                  • <strong>Pre-Cooked:</strong>{' '}
                  {preCooked.length > 0 ? preCooked.map((p) => p.label).join(', ') : 'None'}
                </div>
              </div>
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
            onClick={onBackToBake}
            className="px-4 py-2.5 rounded-xl bg-[#FCE4EC] hover:bg-[#F8C8DC] text-xs font-bold text-[#49343B]"
          >
            ← Re-Bake
          </button>
        </div>
        <button
          type="button"
          onClick={onProceedBusiness}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E88BAE] to-[#C44676] text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg flex items-center gap-1.5"
        >
          <span>STAGE 5: BUSINESS &amp; FINANCIAL ANALYSIS</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
