export type CategoryId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type IngredientRole =
  | 'flour'
  | 'starch'
  | 'sugar'
  | 'sugar_liquid'
  | 'leavener'
  | 'salt'
  | 'yeast'
  | 'egg'
  | 'fat'
  | 'liquid'
  | 'dairy_solid'
  | 'acid_liquid'
  | 'flavor'
  | 'chocolate'
  | 'mixin'
  | 'topping'
  | 'fruit'
  | 'acid_fruit';

export interface Ingredient {
  id: string;
  cat: CategoryId;
  name: string;
  unitLabel: string;
  packQty: number;
  unit: 'g' | 'ml' | 'pcs';
  price: number;
  defaultUse: number;
  role: IngredientRole;
  gramsPerPc?: number;
  color: string;
}

export type ToolCategory = 'Mixing' | 'Measuring' | 'Shaping' | 'Cutting' | 'Other tools';

export interface LabTool {
  id: string;
  name: string;
  icon: string;
  action: string;
  msg: string;
}

export type PrepShapeId =
  | 'cake'
  | 'cookies'
  | 'bread'
  | 'cinnamon_roll'
  | 'brownies'
  | 'donuts'
  | 'muffins'
  | 'pastry';

export interface PrepShape {
  id: PrepShapeId;
  label: string;
  shortName: string;
  desc: string;
}

export interface Appliance {
  id: string;
  name: string;
  icon: string;
  minT: number;
  maxT: number;
  defT: number;
}

export interface BakePan {
  id: string;
  name: string;
  icon: string;
}

export interface PreCookItem {
  type: string;
  label: string;
  heat: 'low' | 'medium' | 'high';
  mins: number;
}

export interface PrepState {
  activeToolTab: ToolCategory;
  activeToolId: string | null;
  sifted: boolean;
  mixedLevel: 0 | 1 | 2 | 3;
  kneaded: boolean;
  rolled: boolean;
  flattened: boolean;
  cut: boolean;
  cinnamonSpiral: boolean;
  linedPaper: boolean;
  pipedDecor: boolean;
  brushedGlaze: boolean;
  shape: PrepShapeId;
  logs: string[];
}

export interface BakeState {
  appliance: string;
  pan: string;
  temp: number;
  targetMins: number;
  elapsedMins: number;
  proofed: boolean;
  running: boolean;
  completed: boolean;
}

export type BakeVisualState = 'raw' | 'underbaked' | 'golden' | 'dry' | 'burnt';

export interface EvaluationResult {
  score: number;
  isPerfect: boolean;
  productName: string;
  bakeState: BakeVisualState;
  errors: string[];
  warnings: string[];
  successes: string[];
  ingredientCost: number;
  appearanceDesc: string;
}

export interface SavedCreation {
  id: number;
  date: string;
  name: string;
  score: number;
  cost: number;
  ingredientsCount: number;
}

export interface FinanceParams {
  prodQty: number;
  sellPrice: number;
  soldQty: number;
  packUnit: number;
  varOpUnit: number;
  fixedOp: number;
  sellingExp: number;
  initialized: boolean;
}

export interface BakeryState {
  stage: 1 | 2 | 3 | 4 | 5;
  activeCategory: 'ALL' | CategoryId;
  basket: Record<string, number>;
  bowl: Record<string, number>;
  preCooked: PreCookItem[];
  prep: PrepState;
  bake: BakeState;
  evaluation: EvaluationResult | null;
  finance: FinanceParams;
}
