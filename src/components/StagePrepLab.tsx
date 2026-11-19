import React, { useState } from 'react';
import { Flame, ArrowLeft, ArrowRight, Scale, Trash2 } from 'lucide-react';
import { LAB_TOOLS, PREP_SHAPES, getIngredientById } from '../data/bakeryData';
import type { LabTool, PreCookItem, PrepShapeId, PrepState, ToolCategory } from '../types/bakery';
import { MixingBowlSvg } from './SvgArtwork';

interface StagePrepLabProps {
  basket: Record<string, number>;
  bowl: Record<string, number>;
  prep: PrepState;
  preCooked: PreCookItem[];
  scaleDisplayGrams: number;
  onBackToMarket: () => void;
  onOpenPreCook: () => void;
  onFinishPrep: () => void;
  onAddToBowl: (id: string, amount: number) => void;
  onRemoveBowlItem: (id: string) => void;
  onClearBowl: () => void;
  onOpenScale: (id: string | null) => void;
  onTareScale: () => void;
  onSelectToolTab: (tab: ToolCategory) => void;
  onUseTool: (tool: LabTool) => void;
  onSelectShape: (shape: PrepShapeId) => void;
}

export const StagePrepLab: React.FC<StagePrepLabProps> = ({
  basket,
  bowl,
  prep,
  preCooked,
  scaleDisplayGrams,
  onBackToMarket,
  onOpenPreCook,
  onFinishPrep,
  onAddToBowl,
  onRemoveBowlItem,
  onClearBowl,
  onOpenScale,
  onTareScale,
  onSelectToolTab,
  onUseTool,
  onSelectShape,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [stirKey, setStirKey] = useState(0);

  const basketIds = Object.keys(basket);
  const bowlIds = Object.keys(bowl);

  const totalBowlGrams = bowlIds.reduce((sum, id) => {
    const ing = getIngredientById(id);
    if (!ing) return sum;
    return sum + (ing.unit === 'pcs' ? bowl[id] * (ing.gramsPerPc || 55) : bowl[id]);
  }, 0);

  const mixText = ['Unmixed Ingredients', 'Roughly Combined', 'Smooth Batter/Dough', 'Light & Aerated!'][
    prep.mixedLevel
  ];

  const toolCategories = Object.keys(LAB_TOOLS) as ToolCategory[];
  const currentTools = LAB_TOOLS[prep.activeToolTab] || [];

  const handleToolClick = (tool: LabTool) => {
    setStirKey((k) => k + 1);
    onUseTool(tool);
  };

  const activeToolObj = Object.values(LAB_TOOLS)
    .flat()
    .find((t) => t.id === prep.activeToolId);

  return (
    <section className="space-y-5">
      {/* Banner */}
      <div className="bg-white rounded-[24px] px-6 py-5 border-2 border-[#FCE4EC] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#49343B] tracking-tight">
            Stage 2: Interactive Preparation Lab
          </h1>
          <p className="text-sm text-[#7B5D67] mt-0.5">
            Weigh ingredients on the digital scale, drag or tap them into your bowl, mix, knead, roll, shape, or pre-cook fillings.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onBackToMarket}
            className="px-4 py-2.5 rounded-xl bg-white border-2 border-[#F8C8DC] hover:bg-[#FCE4EC] text-xs sm:text-sm font-bold text-[#49343B] flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Market</span>
          </button>
          <button
            type="button"
            onClick={onOpenPreCook}
            className="px-4 py-2.5 rounded-xl bg-[#FCE4EC] border-2 border-[#F8C8DC] hover:bg-[#F8C8DC] text-xs sm:text-sm font-bold text-[#49343B] flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Flame className="w-4 h-4 text-[#C44676]" />
            <span>PRE-COOK / COOK INGREDIENTS</span>
          </button>
          <button
            type="button"
            onClick={onFinishPrep}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E88BAE] to-[#C44676] text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg flex items-center gap-1.5 transition-all whitespace-nowrap"
          >
            <span>OK — FINISH PREPARATION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3-Column Lab Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-[270px_1fr_310px] gap-5 items-start">
        {/* Left: Pantry */}
        <div className="bg-white rounded-[20px] p-4 border border-[#FCE4EC] shadow-sm">
          <h2 className="text-base font-extrabold text-[#49343B]">Your Pantry</h2>
          <p className="text-xs text-[#7B5D67] mt-0.5">
            Drag an ingredient into the mixing bowl or click <strong>Weigh / Add</strong>.
          </p>
          <div className="max-h-[540px] overflow-y-auto bakery-scroll mt-3 space-y-2 pr-1">
            {basketIds.map((id) => {
              const ing = getIngredientById(id);
              if (!ing) return null;
              const totalAvail = ing.packQty * basket[id];
              const used = bowl[id] || 0;
              const rem = Math.max(0, totalAvail - used);
              return (
                <div
                  key={id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', id)}
                  className="bg-[#FFF9F5] border border-[#F8C8DC] hover:border-[#E88BAE] rounded-xl px-3 py-2 flex items-center justify-between gap-2 cursor-grab active:cursor-grabbing transition-all"
                >
                  <div className="min-w-0">
                    <div className="font-extrabold text-xs text-[#49343B] truncate">{ing.name}</div>
                    <div className="text-[11px] text-[#7B5D67] tabular-nums">
                      Avail: {rem} {ing.unit}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenScale(id)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#FCE4EC] hover:bg-[#F8C8DC] text-[11px] font-bold text-[#49343B] shrink-0 transition-colors"
                  >
                    Weigh / Add
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Countertop & Tools */}
        <div className="bg-gradient-to-b from-white to-[#fff6fa] rounded-[24px] border-2 border-[#F8C8DC] p-5 shadow-md space-y-5">
          {/* Mixing Bowl Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const id = e.dataTransfer.getData('text/plain');
              const ing = getIngredientById(id);
              if (ing) onAddToBowl(id, ing.defaultUse);
            }}
            className={`rounded-[22px] border-2 border-dashed p-4 text-center transition-all ${
              dragOver
                ? 'bg-[#FCE4EC] border-[#C44676] scale-[1.01]'
                : 'bg-[#FFF9F5] border-[#E88BAE]'
            }`}
          >
            <div key={stirKey} className={stirKey > 0 ? 'animate-bowl-stir' : ''}>
              <MixingBowlSvg
                bowl={bowl}
                mixedLevel={prep.mixedLevel}
                rolled={prep.rolled}
                cinnamonSpiral={prep.cinnamonSpiral}
                linedPaper={prep.linedPaper}
                shape={prep.shape}
              />
            </div>

            <div className="font-extrabold text-sm text-[#49343B] mt-1">
              {bowlIds.length === 0
                ? 'Empty Mixing Bowl — Drag or Weigh Ingredients Here'
                : `${bowlIds.length} Ingredients · ${mixText}`}
            </div>

            {/* Preparation Status Summary (clean inline text metadata) */}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2 text-xs font-bold text-[#7B5D67]">
              {prep.sifted && <span>✓ Sifted</span>}
              {prep.mixedLevel > 0 && (
                <span>✓ Mixed ({['', 'Light', 'Smooth', 'Aerated'][prep.mixedLevel]})</span>
              )}
              {prep.kneaded && <span>✓ Kneaded</span>}
              {prep.rolled && <span>✓ Rolled</span>}
              {prep.cut && <span>✓ Cut/Portioned</span>}
              {prep.linedPaper && <span>✓ Lined Pan</span>}
              {prep.pipedDecor && <span>✓ Piped</span>}
              {prep.brushedGlaze && <span>✓ Glazed</span>}
              {preCooked.length > 0 && (
                <span className="text-[#C44676]">
                  🔥 {preCooked.length} Pre-Cooked Component{preCooked.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Equipment Rack */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <h2 className="text-base font-extrabold text-[#49343B]">Baking Countertop Equipment</h2>
              <span className="text-xs font-semibold text-[#7B5D67]">
                Active tool: {activeToolObj ? activeToolObj.name : 'None'}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {toolCategories.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onSelectToolTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                    prep.activeToolTab === tab
                      ? 'bg-[#C44676] text-white'
                      : 'bg-[#FCE4EC] text-[#49343B] hover:bg-[#F8C8DC]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {currentTools.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => handleToolClick(tool)}
                  className={`rounded-xl border p-2.5 flex flex-col items-center justify-center gap-1 text-center text-xs font-bold transition-all ${
                    prep.activeToolId === tool.id
                      ? 'bg-[#ffe6f0] border-[#C44676] shadow-sm'
                      : 'bg-white border-[#F8C8DC] hover:bg-[#FCE4EC] hover:border-[#E88BAE]'
                  }`}
                >
                  <span className="text-xl leading-none">{tool.icon}</span>
                  <span className="leading-tight text-[#49343B]">{tool.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Shaping & Preparation Form */}
          <div className="bg-white rounded-2xl p-4 border border-[#FCE4EC]">
            <h2 className="text-sm font-extrabold text-[#49343B]">Shaping &amp; Baking Preparation Form</h2>
            <p className="text-xs text-[#7B5D67] mt-0.5 mb-2.5">
              Select what baked good structure you are preparing:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PREP_SHAPES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelectShape(s.id)}
                  className={`px-2.5 py-2 rounded-xl border text-xs font-bold text-center transition-colors ${
                    prep.shape === s.id
                      ? 'bg-[#C44676] text-white border-[#C44676]'
                      : 'bg-[#FFF9F5] text-[#49343B] border-[#F8C8DC] hover:bg-[#FCE4EC]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Digital Scale, Inside Bowl, Log */}
        <div className="space-y-4">
          <div className="bg-white rounded-[20px] p-4 border border-[#FCE4EC] shadow-sm">
            <div className="flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#C44676]" />
              <h3 className="text-sm font-extrabold text-[#49343B]">Digital Kitchen Scale</h3>
            </div>
            <div className="bg-[#2f2428] text-[#a9f5c8] font-mono-num px-3.5 py-2.5 rounded-xl text-xl font-bold text-right border-2 border-[#F8C8DC] my-2.5">
              {scaleDisplayGrams.toFixed(1)} g
            </div>
            <p className="text-xs text-[#7B5D67]">
              Click any ingredient&apos;s &ldquo;Weigh / Add&rdquo; button or open the scale to weigh exact grams, ml, or pcs.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={onTareScale}
                className="flex-1 py-2 px-3 rounded-xl bg-[#FCE4EC] hover:bg-[#F8C8DC] text-xs font-bold text-[#49343B]"
              >
                Tare (0.0 g)
              </button>
              <button
                type="button"
                onClick={() => onOpenScale(null)}
                className="flex-1 py-2 px-3 rounded-xl bg-white border border-[#F8C8DC] hover:bg-[#FFF9F5] text-xs font-bold text-[#49343B]"
              >
                Open Scale
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-4 border border-[#FCE4EC] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-extrabold text-[#49343B] tabular-nums">
                Inside Bowl ({Math.round(totalBowlGrams)} g)
              </h3>
              <button
                type="button"
                onClick={onClearBowl}
                className="px-2.5 py-1 rounded-lg bg-[#fdecef] hover:bg-[#f9d5dc] text-[#9c253f] text-xs font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
            <div className="max-h-[175px] overflow-y-auto bakery-scroll space-y-1.5 pr-1">
              {bowlIds.length === 0 ? (
                <div className="text-xs text-[#7B5D67] text-center py-4">Bowl is empty.</div>
              ) : (
                bowlIds.map((id) => {
                  const ing = getIngredientById(id);
                  if (!ing) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between bg-[#FFF9F5] px-2.5 py-1.5 rounded-lg text-xs"
                    >
                      <span className="truncate">
                        <strong>{ing.name}</strong> ({bowl[id]} {ing.unit})
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveBowlItem(id)}
                        aria-label={`Remove ${ing.name} from bowl`}
                        className="w-5 h-5 rounded bg-white border border-[#F8C8DC] hover:bg-[#C44676] hover:text-white text-[11px] font-bold grid place-items-center shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-4 border border-[#FCE4EC] shadow-sm">
            <h3 className="text-sm font-extrabold text-[#49343B] mb-2">Prep Lab Log</h3>
            <div className="max-h-[155px] overflow-y-auto bakery-scroll space-y-1.5 pr-1">
              {prep.logs.map((entry, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1.5 bg-[#FFF9F5] rounded-lg border border-[#FCE4EC] text-xs text-[#49343B]"
                >
                  {entry}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
