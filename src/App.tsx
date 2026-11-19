import { useEffect, useRef, useState } from 'react';
import { PRE_COOK_OPTIONS, PREP_SHAPES, STARTER_PRESETS, getIngredientById } from './data/bakeryData';
import type {
  BakeryState,
  CategoryId,
  FinanceParams,
  LabTool,
  PrepShapeId,
  SavedCreation,
  ToolCategory,
} from './types/bakery';
import { runBakingEvaluation } from './utils/evaluation';
import { BrandCupcakeLogo } from './components/SvgArtwork';
import { StageMarket } from './components/StageMarket';
import { StagePrepLab } from './components/StagePrepLab';
import { StageBake } from './components/StageBake';
import { StageEvaluate } from './components/StageEvaluate';
import { StageBusiness } from './components/StageBusiness';
import { PreCookModal, RecipeModal, SavedModal, ScaleModal } from './components/Modals';

const STORAGE_KEY = 'pink_bakery_lab_saved_v1';

const STEP_LABELS: { step: 1 | 2 | 3 | 4 | 5; label: string }[] = [
  { step: 1, label: '1. Market' },
  { step: 2, label: '2. Prep Lab' },
  { step: 3, label: '3. Bake' },
  { step: 4, label: '4. Evaluate' },
  { step: 5, label: '5. Business' },
];

function createInitialState(): BakeryState {
  return {
    stage: 1,
    activeCategory: 'ALL',
    basket: {},
    bowl: {},
    preCooked: [],
    prep: {
      activeToolTab: 'Mixing',
      activeToolId: null,
      sifted: false,
      mixedLevel: 0,
      kneaded: false,
      rolled: false,
      flattened: false,
      cut: false,
      cinnamonSpiral: false,
      linedPaper: false,
      pipedDecor: false,
      brushedGlaze: false,
      shape: 'cake',
      logs: ['Lab initialized. Ready to weigh and mix ingredients!'],
    },
    bake: {
      appliance: 'electric_oven',
      pan: 'cake_pans',
      temp: 180,
      targetMins: 25,
      elapsedMins: 0,
      proofed: false,
      running: false,
      completed: false,
    },
    evaluation: null,
    finance: {
      prodQty: 12,
      sellPrice: 15000,
      soldQty: 12,
      packUnit: 2000,
      varOpUnit: 1000,
      fixedOp: 50000,
      sellingExp: 15000,
      initialized: false,
    },
  };
}

function loadSavedCreations(): SavedCreation[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export default function App() {
  const [state, setState] = useState<BakeryState>(createInitialState);
  const [savedList, setSavedList] = useState<SavedCreation[]>(loadSavedCreations);
  const [scaleDisplayGrams, setScaleDisplayGrams] = useState(0);
  const [bakeSpeed, setBakeSpeed] = useState<1 | 2>(1);

  const [scaleModalOpen, setScaleModalOpen] = useState(false);
  const [scaleTargetId, setScaleTargetId] = useState<string | null>(null);
  const [preCookModalOpen, setPreCookModalOpen] = useState(false);
  const [recipeModalOpen, setRecipeModalOpen] = useState(false);
  const [savedModalOpen, setSavedModalOpen] = useState(false);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const notify = (msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastMsg(null), 2800);
  };

  // Real-time baking interval
  useEffect(() => {
    if (!state.bake.running || state.stage !== 3) return;
    const ms = bakeSpeed === 2 ? 120 : 240;
    const intervalId = window.setInterval(() => {
      setState((prev) => {
        if (!prev.bake.running) return prev;
        const nextElapsed = prev.bake.elapsedMins + 1;
        if (nextElapsed >= prev.bake.targetMins) {
          return {
            ...prev,
            bake: {
              ...prev.bake,
              elapsedMins: prev.bake.targetMins,
              running: false,
              completed: true,
            },
          };
        }
        return {
          ...prev,
          bake: {
            ...prev.bake,
            elapsedMins: nextElapsed,
          },
        };
      });
    }, ms);
    return () => window.clearInterval(intervalId);
  }, [state.bake.running, state.stage, bakeSpeed]);

  // Notify when timer completes naturally
  const prevCompletedRef = useRef(false);
  useEffect(() => {
    if (state.bake.completed && !prevCompletedRef.current && state.stage === 3) {
      notify('Baking timer finished! Click FINISH BAKING to inspect your creation.');
    }
    prevCompletedRef.current = state.bake.completed;
  }, [state.bake.completed, state.stage]);

  const goToStage = (target: 1 | 2 | 3 | 4 | 5) => {
    if (target >= 2 && Object.keys(state.basket).length === 0) {
      notify('Please select at least 1 ingredient first!');
      return;
    }
    if (target >= 3 && Object.keys(state.bowl).length === 0) {
      notify('Add at least 1 ingredient to your mixing bowl in Stage 2!');
      return;
    }

    setState((prev) => {
      let evaluation = prev.evaluation;
      let finance = prev.finance;

      if (target === 4 || target === 5) {
        evaluation = runBakingEvaluation(prev.bowl, prev.prep, prev.bake, prev.preCooked);
      }

      if (target === 5 && evaluation && !prev.finance.initialized) {
        const defaultYield = ['cookies', 'donuts', 'muffins', 'cinnamon_roll'].includes(
          prev.prep.shape
        )
          ? 12
          : prev.prep.shape === 'brownies'
          ? 16
          : 8;
        const unitIng = evaluation.ingredientCost / defaultYield;
        const suggested = Math.max(5000, Math.ceil(((unitIng + 3000) * 2.2) / 500) * 500);
        finance = {
          ...prev.finance,
          prodQty: defaultYield,
          soldQty: defaultYield,
          sellPrice: suggested,
          initialized: true,
        };
      }

      return {
        ...prev,
        stage: target,
        bake: { ...prev.bake, running: false },
        evaluation,
        finance,
      };
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Stage 1 handlers
  const handleSelectCategory = (cat: 'ALL' | CategoryId) => {
    setState((prev) => ({ ...prev, activeCategory: cat }));
  };

  const handleChangeBasketQty = (id: string, delta: number) => {
    setState((prev) => {
      const nextQty = (prev.basket[id] || 0) + delta;
      const nextBasket = { ...prev.basket };
      if (nextQty <= 0) delete nextBasket[id];
      else nextBasket[id] = nextQty;
      return { ...prev, basket: nextBasket };
    });
  };

  const handleLoadPreset = (preset: 'cinnamon' | 'cake' | 'cookies') => {
    const nextBasket: Record<string, number> = {};
    STARTER_PRESETS[preset].forEach((id) => {
      nextBasket[id] = 1;
    });
    setState((prev) => ({ ...prev, basket: nextBasket }));
    notify('Starter ingredients added to your cart!');
  };

  // Stage 2 handlers
  const handleAddToBowl = (id: string, amount: number) => {
    const ing = getIngredientById(id);
    if (!ing || amount <= 0) return;

    const maxAvail = ing.packQty * (state.basket[id] || 0);
    const current = state.bowl[id] || 0;
    const next = Math.min(maxAvail, current + amount);
    const added = next - current;

    if (added <= 0) {
      notify(`You used all available ${ing.name}! Buy more in Market if needed.`);
      return;
    }

    const displayGrams = ing.unit === 'pcs' ? added * (ing.gramsPerPc || 55) : added;
    setScaleDisplayGrams(displayGrams);

    setState((prev) => ({
      ...prev,
      bowl: { ...prev.bowl, [id]: next },
      prep: {
        ...prev.prep,
        logs: [`Added ${added} ${ing.unit} of ${ing.name} to mixing bowl.`, ...prev.prep.logs].slice(0, 25),
      },
    }));
  };

  const handleRemoveBowlItem = (id: string) => {
    setState((prev) => {
      const nextBowl = { ...prev.bowl };
      delete nextBowl[id];
      return { ...prev, bowl: nextBowl };
    });
  };

  const handleClearBowl = () => {
    setState((prev) => ({
      ...prev,
      bowl: {},
      prep: {
        ...prev.prep,
        mixedLevel: 0,
        kneaded: false,
        rolled: false,
        cinnamonSpiral: false,
        logs: ['Cleared mixing bowl to start fresh.', ...prev.prep.logs].slice(0, 25),
      },
    }));
  };

  const handleUseTool = (tool: LabTool) => {
    if (tool.action === 'open_scale') {
      setScaleTargetId(null);
      setScaleModalOpen(true);
      setState((prev) => ({ ...prev, prep: { ...prev.prep, activeToolId: tool.id } }));
      return;
    }

    if (
      Object.keys(state.bowl).length === 0 &&
      tool.action !== 'line_paper' &&
      tool.action !== 'ready_rack'
    ) {
      notify('Add ingredients to the bowl first before mixing or shaping!');
      return;
    }

    setState((prev) => {
      const p = { ...prev.prep, activeToolId: tool.id };
      if (tool.action === 'sift_dry') p.sifted = true;
      if (tool.action === 'mix_stir' || tool.action === 'mix_fold')
        p.mixedLevel = Math.max(p.mixedLevel, 1) as 0 | 1 | 2 | 3;
      if (tool.action === 'mix_whisk')
        p.mixedLevel = Math.max(p.mixedLevel, 2) as 0 | 1 | 2 | 3;
      if (tool.action === 'mix_electric') p.mixedLevel = 3;
      if (tool.action === 'knead_dough') {
        p.mixedLevel = Math.max(p.mixedLevel, 2) as 0 | 1 | 2 | 3;
        p.kneaded = true;
      }
      if (tool.action === 'roll_dough') {
        p.rolled = true;
        if (
          prev.bowl['cinnamon'] ||
          prev.preCooked.some((item) => item.type === 'cinnamon_filling')
        ) {
          p.cinnamonSpiral = true;
        }
      }
      if (tool.action === 'flatten_dough' || tool.action === 'cut_butter') p.flattened = true;
      if (
        tool.action === 'cut_shapes' ||
        tool.action === 'divide_dough' ||
        tool.action === 'score_dough'
      ) {
        p.cut = true;
      }
      if (tool.action === 'line_paper') p.linedPaper = true;
      if (tool.action === 'pipe_decor') p.pipedDecor = true;
      if (tool.action === 'brush_glaze') p.brushedGlaze = true;
      if (tool.action === 'mold_cake') p.shape = 'cake';
      if (tool.action === 'mold_bread') p.shape = 'bread';

      p.logs = [`${tool.icon} ${tool.name}: ${tool.msg}`, ...p.logs].slice(0, 25);
      return { ...prev, prep: p };
    });

    notify(tool.msg);
  };

  const handleSelectShape = (shapeId: PrepShapeId) => {
    setState((prev) => {
      const p = { ...prev.prep, shape: shapeId };
      if (
        shapeId === 'cinnamon_roll' &&
        (prev.bowl['cinnamon'] || prev.preCooked.some((item) => item.type === 'cinnamon_filling'))
      ) {
        p.rolled = true;
        p.cinnamonSpiral = true;
        p.logs = [
          'Rolled dough with cinnamon-sugar filling and sliced spiral Cinnamon Rolls!',
          ...p.logs,
        ].slice(0, 25);
      } else {
        const hit = PREP_SHAPES.find((s) => s.id === shapeId);
        p.logs = [
          `Selected baking preparation shape: ${hit?.shortName || shapeId}`,
          ...p.logs,
        ].slice(0, 25);
      }
      return { ...prev, prep: p };
    });
  };

  const handleExecutePreCook = (
    type: string,
    heat: 'low' | 'medium' | 'high',
    mins: number
  ) => {
    const opt = PRE_COOK_OPTIONS.find((o) => o.value === type);
    const label = opt?.shortLabel || type;

    setState((prev) => ({
      ...prev,
      preCooked: [...prev.preCooked, { type, label, heat, mins }],
      prep: {
        ...prev.prep,
        cinnamonSpiral: type === 'cinnamon_filling' ? true : prev.prep.cinnamonSpiral,
        logs: [
          `Pre-cooked: ${label} (${heat} heat, ${mins} min) and incorporated into prep.`,
          ...prev.prep.logs,
        ].slice(0, 25),
      },
    }));
    notify(`${label} prepared & added!`);
  };

  const handleFinishPreparation = () => {
    if (Object.keys(state.bowl).length === 0) {
      notify('Please add ingredients to the mixing bowl before baking!');
      return;
    }

    setState((prev) => {
      const shape = prev.prep.shape;
      let temp = 175;
      let targetMins = 32;
      let pan = 'cake_pans';
      if (shape === 'cookies') {
        temp = 175;
        targetMins = 14;
        pan = 'baking_trays';
      } else if (shape === 'bread' || shape === 'cinnamon_roll') {
        temp = 185;
        targetMins = 28;
        pan = shape === 'bread' ? 'loaf_pan' : 'baking_trays';
      } else if (shape === 'brownies') {
        temp = 175;
        targetMins = 30;
        pan = 'cake_pans';
      } else if (shape === 'muffins') {
        temp = 185;
        targetMins = 22;
        pan = 'muffin_trays';
      }

      return {
        ...prev,
        stage: 3,
        bake: {
          ...prev.bake,
          temp,
          targetMins,
          pan,
          elapsedMins: 0,
          completed: false,
          running: false,
        },
      };
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Stage 3 handlers
  const handleSelectAppliance = (id: string) => {
    setState((prev) => {
      const defT =
        id === 'steamer' || id === 'saucepan' || id === 'microwave'
          ? 100
          : id === 'double_boiler'
          ? 75
          : id === 'air_fryer'
          ? 165
          : id === 'stovetop'
          ? 140
          : id === 'frying_pan'
          ? 170
          : id === 'conventional_oven'
          ? 180
          : 175;
      return {
        ...prev,
        bake: { ...prev.bake, appliance: id, temp: defT },
      };
    });
  };

  const handleToggleBakeTimer = () => {
    setState((prev) => {
      if (prev.bake.running) {
        return { ...prev, bake: { ...prev.bake, running: false } };
      }
      const resetIfDone = prev.bake.elapsedMins >= prev.bake.targetMins ? 0 : prev.bake.elapsedMins;
      return {
        ...prev,
        bake: { ...prev.bake, elapsedMins: resetIfDone, completed: false, running: true },
      };
    });
  };

  const handleFastForward = () => {
    setState((prev) => ({
      ...prev,
      bake: {
        ...prev.bake,
        running: false,
        elapsedMins: prev.bake.targetMins,
        completed: true,
      },
    }));
    notify('Baking fast-forwarded to completion!');
  };

  const handleResetTimer = () => {
    setState((prev) => ({
      ...prev,
      bake: { ...prev.bake, running: false, elapsedMins: 0, completed: false },
    }));
  };

  const handleFinishBaking = () => {
    setState((prev) => {
      const nextBake = {
        ...prev.bake,
        running: false,
        completed: true,
        elapsedMins: prev.bake.elapsedMins === 0 ? prev.bake.targetMins : prev.bake.elapsedMins,
      };
      const evaluation = runBakingEvaluation(prev.bowl, prev.prep, nextBake, prev.preCooked);
      return {
        ...prev,
        stage: 4,
        bake: nextBake,
        evaluation,
        finance: { ...prev.finance, initialized: false },
      };
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save / Restart handlers
  const handleSaveCreation = () => {
    const ev =
      state.evaluation ||
      runBakingEvaluation(state.bowl, state.prep, state.bake, state.preCooked);
    const nextItem: SavedCreation = {
      id: Date.now(),
      date: new Date().toLocaleString('id-ID'),
      name: ev.productName,
      score: ev.score,
      cost: ev.ingredientCost,
      ingredientsCount: Object.keys(state.bowl).length,
    };
    const nextList = [nextItem, ...savedList].slice(0, 15);
    setSavedList(nextList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
      notify(`Saved "${ev.productName}" to browser storage!`);
    } catch {
      notify('Browser storage unavailable.');
    }
  };

  const handleClearSaved = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSavedList([]);
  };

  const handleRestart = () => {
    setState(createInitialState());
    setScaleDisplayGrams(0);
    notify('Started a brand new baking session!');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateFinance = (patch: Partial<FinanceParams>) => {
    setState((prev) => ({
      ...prev,
      finance: { ...prev.finance, ...patch },
    }));
  };

  const currentEvaluation =
    state.evaluation ||
    (state.stage >= 4
      ? runBakingEvaluation(state.bowl, state.prep, state.bake, state.preCooked)
      : null);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b-2 border-[#FCE4EC] sticky top-0 z-40 px-4 sm:px-6 py-3 shadow-xs">
        <div className="max-w-[1380px] mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Zone 1: Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F8C8DC] to-[#E88BAE] grid place-items-center shadow-xs">
              <BrandCupcakeLogo />
            </div>
            <div>
              <div className="text-base sm:text-lg font-extrabold tracking-wide text-[#49343B] whitespace-nowrap">
                PINK BAKERY LAB
              </div>
              <div className="text-[11px] font-semibold text-[#7B5D67] hidden sm:block">
                Virtual Baking &amp; Entrepreneurship Simulator
              </div>
            </div>
          </div>

          {/* Zone 2: Stepper */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Simulation Stages">
            {STEP_LABELS.map(({ step, label }) => {
              const isActive = state.stage === step;
              const isDone = state.stage > step;
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => goToStage(step)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap shrink-0 border ${
                    isActive
                      ? 'bg-[#C44676] text-white border-[#C44676] shadow-sm'
                      : isDone
                      ? 'bg-[#F8C8DC] text-[#49343B] border-[#E88BAE]'
                      : 'bg-[#FCE4EC] text-[#7B5D67] border-transparent hover:bg-[#F8C8DC]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSavedModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-[#F8C8DC] hover:bg-[#FCE4EC] text-xs font-bold text-[#49343B] whitespace-nowrap tabular-nums"
            >
              Saved ({savedList.length})
            </button>
            <button
              type="button"
              onClick={handleRestart}
              className="px-3.5 py-1.5 rounded-xl bg-[#fdecef] border border-[#f7c7d1] hover:bg-[#fad8df] text-xs font-bold text-[#9c253f] whitespace-nowrap"
            >
              Restart
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1380px] w-full mx-auto px-4 sm:px-6 py-6 pb-14">
        {state.stage === 1 && (
          <StageMarket
            activeCategory={state.activeCategory}
            basket={state.basket}
            onSelectCategory={handleSelectCategory}
            onChangeQty={handleChangeBasketQty}
            onLoadPreset={handleLoadPreset}
            onProceed={() => goToStage(2)}
          />
        )}

        {state.stage === 2 && (
          <StagePrepLab
            basket={state.basket}
            bowl={state.bowl}
            prep={state.prep}
            preCooked={state.preCooked}
            scaleDisplayGrams={scaleDisplayGrams}
            onBackToMarket={() => goToStage(1)}
            onOpenPreCook={() => setPreCookModalOpen(true)}
            onFinishPrep={handleFinishPreparation}
            onAddToBowl={handleAddToBowl}
            onRemoveBowlItem={handleRemoveBowlItem}
            onClearBowl={handleClearBowl}
            onOpenScale={(id) => {
              setScaleTargetId(id);
              setScaleModalOpen(true);
            }}
            onTareScale={() => {
              setScaleDisplayGrams(0);
              notify('Scale tared to 0.0 g');
            }}
            onSelectToolTab={(tab: ToolCategory) =>
              setState((prev) => ({
                ...prev,
                prep: { ...prev.prep, activeToolTab: tab },
              }))
            }
            onUseTool={handleUseTool}
            onSelectShape={handleSelectShape}
          />
        )}

        {state.stage === 3 && (
          <StageBake
            bowl={state.bowl}
            prep={state.prep}
            bake={state.bake}
            bakeSpeed={bakeSpeed}
            onSetBakeSpeed={setBakeSpeed}
            onBackToPrep={() => goToStage(2)}
            onSelectAppliance={handleSelectAppliance}
            onSelectPan={(pan) =>
              setState((prev) => ({ ...prev, bake: { ...prev.bake, pan } }))
            }
            onChangeTemp={(temp) =>
              setState((prev) => ({ ...prev, bake: { ...prev.bake, temp } }))
            }
            onChangeTargetMins={(targetMins) =>
              setState((prev) => ({ ...prev, bake: { ...prev.bake, targetMins } }))
            }
            onToggleProof={(proofed) =>
              setState((prev) => ({ ...prev, bake: { ...prev.bake, proofed } }))
            }
            onToggleTimer={handleToggleBakeTimer}
            onFastForward={handleFastForward}
            onResetTimer={handleResetTimer}
            onFinishBaking={handleFinishBaking}
          />
        )}

        {state.stage === 4 && currentEvaluation && (
          <StageEvaluate
            bowl={state.bowl}
            prep={state.prep}
            bake={state.bake}
            preCooked={state.preCooked}
            evaluation={currentEvaluation}
            onOpenRecipe={() => setRecipeModalOpen(true)}
            onSaveCreation={handleSaveCreation}
            onBackToMarket={() => goToStage(1)}
            onBackToBake={() => goToStage(3)}
            onProceedBusiness={() => goToStage(5)}
          />
        )}

        {state.stage === 5 && currentEvaluation && (
          <StageBusiness
            evaluation={currentEvaluation}
            finance={state.finance}
            onUpdateFinance={handleUpdateFinance}
            onOpenRecipe={() => setRecipeModalOpen(true)}
            onSaveCreation={handleSaveCreation}
            onBackToMarket={() => goToStage(1)}
            onBackToEval={() => goToStage(4)}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Modals */}
      <ScaleModal
        open={scaleModalOpen}
        basket={state.basket}
        initialId={scaleTargetId}
        onClose={() => setScaleModalOpen(false)}
        onConfirmAdd={handleAddToBowl}
      />

      <PreCookModal
        open={preCookModalOpen}
        basket={state.basket}
        onClose={() => setPreCookModalOpen(false)}
        onExecute={handleExecutePreCook}
      />

      <RecipeModal
        open={recipeModalOpen}
        evaluation={
          currentEvaluation ||
          runBakingEvaluation(state.bowl, state.prep, state.bake, state.preCooked)
        }
        bowl={state.bowl}
        prep={state.prep}
        bake={state.bake}
        onClose={() => setRecipeModalOpen(false)}
      />

      <SavedModal
        open={savedModalOpen}
        savedList={savedList}
        onClose={() => setSavedModalOpen(false)}
        onClearAll={handleClearSaved}
      />

      {/* Toast */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 bg-[#49343B] text-white px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-xl"
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
}
