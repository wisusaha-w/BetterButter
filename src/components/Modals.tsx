import React, { useEffect, useState } from 'react';
import { X, Scale, Flame, BookOpen, Bookmark, Trash2 } from 'lucide-react';
import { APPLIANCES, BAKE_PANS, PRE_COOK_OPTIONS, getIngredientById } from '../data/bakeryData';
import type { BakeState, EvaluationResult, PrepState, SavedCreation } from '../types/bakery';
import { formatIDR } from '../utils/evaluation';

interface ScaleModalProps {
  open: boolean;
  basket: Record<string, number>;
  initialId: string | null;
  onClose: () => void;
  onConfirmAdd: (id: string, amount: number) => void;
}

export const ScaleModal: React.FC<ScaleModalProps> = ({
  open,
  basket,
  initialId,
  onClose,
  onConfirmAdd,
}) => {
  const basketIds = Object.keys(basket);
  const [selectedId, setSelectedId] = useState<string>('');
  const [qty, setQty] = useState<number>(100);

  useEffect(() => {
    if (!open) return;
    const id = initialId && basket[initialId] ? initialId : basketIds[0] || '';
    setSelectedId(id);
    const ing = getIngredientById(id);
    if (ing) setQty(ing.defaultUse);
  }, [open, initialId]);

  if (!open) return null;

  const ing = getIngredientById(selectedId);
  const grams = ing ? (ing.unit === 'pcs' ? qty * (ing.gramsPerPc || 55) : qty) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#49343B]/45 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] max-w-[440px] w-full p-6 border-[3px] border-[#F8C8DC] shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#FCE4EC]">
          <h3 className="font-extrabold text-base text-[#49343B] flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#C44676]" />
            <span>Digital Kitchen Scale</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close scale modal"
            className="px-2.5 py-1 rounded-lg bg-[#FCE4EC] hover:bg-[#F8C8DC] text-xs font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold mb-1">Ingredient to Weigh</label>
            <select
              value={selectedId}
              onChange={(e) => {
                const nextId = e.target.value;
                setSelectedId(nextId);
                const nextIng = getIngredientById(nextId);
                if (nextIng) setQty(nextIng.defaultUse);
              }}
              className="w-full px-3 py-2 rounded-xl border border-[#F8C8DC] bg-[#FFF9F5] font-bold text-sm"
            >
              {basketIds.map((id) => {
                const item = getIngredientById(id);
                if (!item) return null;
                return (
                  <option key={id} value={id}>
                    {item.name} ({item.unit})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="bg-[#2f2428] text-[#a9f5c8] font-mono-num px-4 py-3 rounded-xl text-2xl font-bold text-right border-2 border-[#F8C8DC]">
            {grams.toFixed(1)} g
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">
              Amount ({ing?.unit || 'g'})
            </label>
            <input
              type="number"
              min={1}
              step={1}
              value={qty}
              onChange={(e) => setQty(Math.max(0, Number(e.target.value) || 0))}
              className="w-full px-3 py-2 rounded-xl border border-[#F8C8DC] bg-[#FFF9F5] font-bold text-sm tabular-nums"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[5, 25, 50, 100].map((inc) => (
              <button
                key={inc}
                type="button"
                onClick={() => setQty((q) => Math.max(1, q + inc))}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#F8C8DC] hover:bg-[#FCE4EC] text-xs font-bold tabular-nums"
              >
                +{inc}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setQty(0)}
              className="px-3 py-1.5 rounded-lg bg-[#FCE4EC] hover:bg-[#F8C8DC] text-xs font-bold"
            >
              Tare
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (selectedId && qty > 0) {
                onConfirmAdd(selectedId, qty);
                onClose();
              }
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E88BAE] to-[#C44676] text-white font-extrabold text-sm shadow-md"
          >
            Add Weighed Ingredient to Bowl
          </button>
        </div>
      </div>
    </div>
  );
};

interface PreCookModalProps {
  open: boolean;
  basket: Record<string, number>;
  onClose: () => void;
  onExecute: (type: string, heat: 'low' | 'medium' | 'high', mins: number) => void;
}

export const PreCookModal: React.FC<PreCookModalProps> = ({
  open,
  basket,
  onClose,
  onExecute,
}) => {
  const [type, setType] = useState('melt_chocolate');
  const [heat, setHeat] = useState<'low' | 'medium' | 'high'>('medium');
  const [mins, setMins] = useState(6);

  if (!open) return null;

  const pantryNames = Object.keys(basket)
    .map((id) => getIngredientById(id)?.name)
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 bg-[#49343B]/45 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] max-w-[600px] w-full p-6 border-[3px] border-[#F8C8DC] shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#FCE4EC]">
          <h3 className="font-extrabold text-base text-[#49343B] flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#C44676]" />
            <span>Pre-Cook / Cook Ingredients Station</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close pre-cook modal"
            className="px-2.5 py-1 rounded-lg bg-[#FCE4EC] hover:bg-[#F8C8DC] text-xs font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#7B5D67] mb-4">
          Prepare warm components before final mixing or assembly (melting chocolate, caramel, custard, fruit compote, or cinnamon filling).
        </p>

        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold mb-1">Select Pre-Cook Technique</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#F8C8DC] bg-[#FFF9F5] font-bold text-sm"
            >
              {PRE_COOK_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Heat Intensity &amp; Duration (min)</label>
            <div className="flex gap-2.5">
              <select
                value={heat}
                onChange={(e) => setHeat(e.target.value as 'low' | 'medium' | 'high')}
                className="flex-1 px-3 py-2 rounded-xl border border-[#F8C8DC] bg-[#FFF9F5] font-bold text-sm"
              >
                <option value="low">Gentle Low Heat (65–85°C)</option>
                <option value="medium">Medium Simmer (100–130°C)</option>
                <option value="high">High Caramelizing Heat (165°C)</option>
              </select>
              <input
                type="number"
                min={1}
                max={30}
                value={mins}
                onChange={(e) => setMins(Math.max(1, Number(e.target.value) || 5))}
                className="w-24 px-3 py-2 rounded-xl border border-[#F8C8DC] bg-[#FFF9F5] font-bold text-sm tabular-nums"
              />
            </div>
          </div>

          <div className="bg-[#FFF9F5] p-3 rounded-xl border border-[#FCE4EC] text-xs">
            <strong>Selected Pantry Check:</strong>{' '}
            {pantryNames.length > 0 ? pantryNames.join(', ') : 'None'}
          </div>

          <button
            type="button"
            onClick={() => {
              onExecute(type, heat, mins);
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E88BAE] to-[#C44676] text-white font-extrabold text-sm shadow-md"
          >
            Cook &amp; Return Component to Prep Lab
          </button>
        </div>
      </div>
    </div>
  );
};

interface RecipeModalProps {
  open: boolean;
  evaluation: EvaluationResult | null;
  bowl: Record<string, number>;
  prep: PrepState;
  bake: BakeState;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  open,
  evaluation,
  bowl,
  prep,
  bake,
  onClose,
}) => {
  if (!open || !evaluation) return null;

  const appName = APPLIANCES.find((a) => a.id === bake.appliance)?.name || bake.appliance;
  const panName = BAKE_PANS.find((p) => p.id === bake.pan)?.name || bake.pan;
  const effectiveMins = bake.elapsedMins > 0 ? bake.elapsedMins : bake.targetMins;
  const steps = prep.logs.slice().reverse().slice(1);

  return (
    <div className="fixed inset-0 z-50 bg-[#49343B]/45 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] max-w-[620px] w-full max-h-[86vh] overflow-y-auto bakery-scroll p-6 border-[3px] border-[#F8C8DC] shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#FCE4EC]">
          <h3 className="font-extrabold text-base text-[#49343B] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#C44676]" />
            <span>Your Pink Bakery Lab Recipe Card</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close recipe modal"
            className="px-2.5 py-1 rounded-lg bg-[#FCE4EC] hover:bg-[#F8C8DC] text-xs font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h2 className="text-xl font-black text-[#C44676]">{evaluation.productName}</h2>
        <p className="text-xs font-bold text-[#7B5D67] mb-4 tabular-nums">
          Score: {evaluation.score}/100 · Est. Ingredient Cost: {formatIDR(evaluation.ingredientCost)}
        </p>

        <h4 className="font-extrabold text-sm mb-1.5">Ingredients</h4>
        <ul className="list-disc pl-5 text-xs sm:text-sm space-y-1 mb-4">
          {Object.entries(bowl).map(([id, amt]) => {
            const ing = getIngredientById(id);
            if (!ing) return null;
            return (
              <li key={id}>
                {ing.name} — <strong>{amt} {ing.unit}</strong>
              </li>
            );
          })}
        </ul>

        <h4 className="font-extrabold text-sm mb-1.5">Preparation Steps</h4>
        <ol className="list-decimal pl-5 text-xs sm:text-sm space-y-1 mb-4">
          {steps.length > 0 ? (
            steps.map((step, i) => <li key={i}>{step}</li>)
          ) : (
            <li>Combined ingredients in mixing bowl.</li>
          )}
        </ol>

        <h4 className="font-extrabold text-sm mb-1">Baking Method</h4>
        <p className="text-xs sm:text-sm text-[#49343B]">
          {bake.proofed ? 'Proofed dough 45 min, then baked' : 'Baked'} using{' '}
          <strong>{appName}</strong> in <strong>{panName}</strong> at{' '}
          <strong>{bake.temp}°C</strong> for <strong>{effectiveMins} min</strong>.
        </p>
      </div>
    </div>
  );
};

interface SavedModalProps {
  open: boolean;
  savedList: SavedCreation[];
  onClose: () => void;
  onClearAll: () => void;
}

export const SavedModal: React.FC<SavedModalProps> = ({
  open,
  savedList,
  onClose,
  onClearAll,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#49343B]/45 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] max-w-[580px] w-full max-h-[86vh] overflow-y-auto bakery-scroll p-6 border-[3px] border-[#F8C8DC] shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#FCE4EC]">
          <h3 className="font-extrabold text-base text-[#49343B] flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#C44676]" />
            <span>Saved Bakery Creations</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close saved creations modal"
            className="px-2.5 py-1 rounded-lg bg-[#FCE4EC] hover:bg-[#F8C8DC] text-xs font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {savedList.length === 0 ? (
          <div className="text-center py-8 text-sm text-[#7B5D67]">
            No saved creations yet. Bake a recipe and click <strong>SAVE CREATION</strong>!
          </div>
        ) : (
          <div className="space-y-2.5">
            {savedList.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-[#FFF9F5] rounded-xl border border-[#FCE4EC]"
              >
                <div>
                  <div className="font-extrabold text-sm text-[#49343B]">{item.name}</div>
                  <div className="text-xs text-[#7B5D67] tabular-nums">
                    {item.date} · {item.ingredientsCount} ingredients · Cost {formatIDR(item.cost)}
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#C44676] tabular-nums">
                  {item.score}/100
                </span>
              </div>
            ))}

            <button
              type="button"
              onClick={onClearAll}
              className="mt-3 px-3.5 py-2 rounded-xl bg-[#fdecef] hover:bg-[#fad8df] text-[#9c253f] text-xs font-bold flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Saved</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
