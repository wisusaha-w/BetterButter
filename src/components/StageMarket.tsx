import React, { useState } from 'react';
import { Search, ShoppingBasket, ArrowRight } from 'lucide-react';
import { CATEGORIES, INGREDIENTS, getIngredientById } from '../data/bakeryData';
import type { CategoryId } from '../types/bakery';
import { formatIDR } from '../utils/evaluation';
import { IngredientIconSvg } from './SvgArtwork';

interface StageMarketProps {
  activeCategory: 'ALL' | CategoryId;
  basket: Record<string, number>;
  onSelectCategory: (cat: 'ALL' | CategoryId) => void;
  onChangeQty: (id: string, delta: number) => void;
  onLoadPreset: (preset: 'cinnamon' | 'cake' | 'cookies') => void;
  onProceed: () => void;
}

export const StageMarket: React.FC<StageMarketProps> = ({
  activeCategory,
  basket,
  onSelectCategory,
  onChangeQty,
  onLoadPreset,
  onProceed,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const query = searchQuery.trim().toLowerCase();
  const basketIds = Object.keys(basket);
  const totalPacks = basketIds.reduce((sum, id) => sum + (basket[id] || 0), 0);
  const totalPrice = basketIds.reduce((sum, id) => {
    const ing = getIngredientById(id);
    return sum + (ing ? ing.price * (basket[id] || 0) : 0);
  }, 0);

  const visibleCategories = CATEGORIES.filter(
    (cat) => activeCategory === 'ALL' || activeCategory === cat.id
  ).map((cat) => ({
    ...cat,
    items: INGREDIENTS.filter(
      (i) => i.cat === cat.id && (!query || i.name.toLowerCase().includes(query))
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <section className="space-y-5">
      {/* Stage Banner */}
      <div className="bg-white rounded-[24px] px-6 py-5 border-2 border-[#FCE4EC] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#49343B] tracking-tight">
            Stage 1: Ingredient Supermarket
          </h1>
          <p className="text-sm text-[#7B5D67] mt-0.5">
            Browse our Jakarta bakery aisles, add baking ingredients freely with unlimited budget, and build your pantry basket.
          </p>
        </div>
        <div className="text-xs font-semibold text-[#7B5D67] bg-[#FCE4EC] px-3.5 py-2 rounded-xl max-w-md">
          Prices are realistic Jakarta retail estimates (IDR per pack/unit) and may vary by seller &amp; location.
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-[20px] p-4 border border-[#FCE4EC] shadow-sm">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-[#7B5D67] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search flour, butter, chocolate, strawberries, yeast..."
              aria-label="Search ingredients"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#F8C8DC] bg-[#FFF9F5] text-sm font-semibold text-[#49343B] placeholder:text-[#9c7e88] focus:outline-none focus:border-[#C44676] focus:bg-white transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onLoadPreset('cinnamon')}
              className="px-3.5 py-2 rounded-xl bg-[#FCE4EC] hover:bg-[#F8C8DC] border border-[#F8C8DC] text-xs font-bold text-[#49343B] transition-colors whitespace-nowrap"
            >
              Quick Basket: Cinnamon Rolls
            </button>
            <button
              type="button"
              onClick={() => onLoadPreset('cake')}
              className="px-3.5 py-2 rounded-xl bg-[#FCE4EC] hover:bg-[#F8C8DC] border border-[#F8C8DC] text-xs font-bold text-[#49343B] transition-colors whitespace-nowrap"
            >
              Quick Basket: Choco Cake
            </button>
            <button
              type="button"
              onClick={() => onLoadPreset('cookies')}
              className="px-3.5 py-2 rounded-xl bg-[#FCE4EC] hover:bg-[#F8C8DC] border border-[#F8C8DC] text-xs font-bold text-[#49343B] transition-colors whitespace-nowrap"
            >
              Quick Basket: Choco Chip Cookies
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 mt-3" role="tablist" aria-label="Ingredient Categories">
          <button
            type="button"
            onClick={() => onSelectCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-colors whitespace-nowrap ${
              activeCategory === 'ALL'
                ? 'bg-[#C44676] text-white border-[#C44676]'
                : 'bg-[#FFF9F5] text-[#49343B] border-[#F8C8DC] hover:bg-[#FCE4EC]'
            }`}
          >
            All Aisles ({INGREDIENTS.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-colors whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#C44676] text-white border-[#C44676]'
                  : 'bg-[#FFF9F5] text-[#49343B] border-[#F8C8DC] hover:bg-[#FCE4EC]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Market Grid + Basket */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">
        {/* Scrollable Shelves */}
        <div className="bg-white rounded-[24px] p-4 sm:p-5 border-2 border-[#FCE4EC] shadow-sm max-h-[640px] overflow-y-auto bakery-scroll space-y-5">
          {visibleCategories.length === 0 ? (
            <div className="text-center py-12 text-[#7B5D67] font-bold">
              No baking ingredients match &ldquo;{searchQuery}&rdquo;. Try another search!
            </div>
          ) : (
            visibleCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-gradient-to-b from-[#fff9fb] to-white rounded-[18px] p-4 border border-[#FCE4EC]"
              >
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b-2 border-dashed border-[#F8C8DC]">
                  <h2 className="text-base font-extrabold text-[#49343B]">{cat.label}</h2>
                  <span className="text-xs font-bold text-[#7B5D67] tabular-nums">
                    {cat.items.length} items
                  </span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2.5 bakery-scroll">
                  {cat.items.map((ing) => {
                    const qty = basket[ing.id] || 0;
                    return (
                      <div
                        key={ing.id}
                        className={`flex-none w-[178px] rounded-2xl border p-3 flex flex-col justify-between transition-all ${
                          qty > 0
                            ? 'bg-[#fff6fa] border-[#E88BAE] shadow-md shadow-[#E88BAE]/15'
                            : 'bg-white border-[#FCE4EC] hover:border-[#E88BAE]'
                        }`}
                      >
                        <div>
                          <div className="w-full h-[74px] rounded-xl bg-[#FFF9F5] grid place-items-center mb-2">
                            <IngredientIconSvg id={ing.id} role={ing.role} color={ing.color} />
                          </div>
                          <div className="font-extrabold text-sm leading-tight text-[#49343B] mb-0.5">
                            {ing.name}
                          </div>
                          <div className="text-[11px] font-semibold text-[#7B5D67]">
                            {ing.unitLabel}
                          </div>
                          <div className="text-sm font-extrabold text-[#C44676] my-1.5 tabular-nums">
                            {formatIDR(ing.price)}
                          </div>
                        </div>

                        <div className="flex items-center justify-between bg-[#FCE4EC] rounded-xl p-1">
                          <button
                            type="button"
                            onClick={() => onChangeQty(ing.id, -1)}
                            aria-label={`Remove ${ing.name}`}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-[#C44676] hover:text-white font-extrabold text-base grid place-items-center shadow-xs transition-colors"
                          >
                            −
                          </button>
                          <span className="font-extrabold text-sm min-w-[28px] text-center tabular-nums">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => onChangeQty(ing.id, 1)}
                            aria-label={`Add ${ing.name}`}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-[#C44676] hover:text-white font-extrabold text-base grid place-items-center shadow-xs transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Ingredients Basket */}
        <aside className="bg-white rounded-[24px] p-5 border-2 border-[#F8C8DC] shadow-md lg:sticky lg:top-24">
          <div className="flex items-center gap-2">
            <ShoppingBasket className="w-5 h-5 text-[#C44676]" />
            <h2 className="text-lg font-extrabold text-[#49343B]">Selected Ingredients</h2>
          </div>
          <p className="text-xs text-[#7B5D67] mt-0.5">No spending limit — experiment freely!</p>

          <div className="max-h-[310px] overflow-y-auto bakery-scroll my-3 space-y-2 pr-1">
            {basketIds.length === 0 ? (
              <div className="text-center py-8 px-3 text-xs text-[#7B5D67] bg-[#FFF9F5] rounded-2xl border border-[#FCE4EC]">
                Your bakery cart is empty. Tap <strong>+</strong> on any shelf item or try a Quick Basket!
              </div>
            ) : (
              basketIds.map((id) => {
                const ing = getIngredientById(id);
                if (!ing) return null;
                const count = basket[id];
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between gap-2 bg-[#FFF9F5] px-3 py-2 rounded-xl border border-[#FCE4EC] text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-extrabold text-[#49343B] truncate">{ing.name}</div>
                      <div className="text-[11px] text-[#7B5D67] tabular-nums">
                        {count} × {ing.unitLabel} ({formatIDR(ing.price * count)})
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onChangeQty(id, -1)}
                        className="w-6 h-6 rounded-md bg-white border border-[#F8C8DC] hover:bg-[#C44676] hover:text-white font-bold grid place-items-center"
                      >
                        −
                      </button>
                      <button
                        type="button"
                        onClick={() => onChangeQty(id, 1)}
                        className="w-6 h-6 rounded-md bg-white border border-[#F8C8DC] hover:bg-[#C44676] hover:text-white font-bold grid place-items-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="bg-[#FCE4EC] rounded-2xl p-3.5 mb-3.5 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-[#49343B]">Items Selected:</span>
              <strong className="tabular-nums">
                {totalPacks} pack{totalPacks === 1 ? '' : 's'}
              </strong>
            </div>
            <div className="flex justify-between text-base">
              <span className="text-[#49343B]">Est. Market Value:</span>
              <strong className="text-[#C44676] tabular-nums">{formatIDR(totalPrice)}</strong>
            </div>
          </div>

          <button
            type="button"
            disabled={basketIds.length === 0}
            onClick={onProceed}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#E88BAE] to-[#C44676] text-white font-extrabold text-sm shadow-md hover:shadow-lg disabled:opacity-45 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            <span>OK — START BAKING</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </aside>
      </div>
    </section>
  );
};
