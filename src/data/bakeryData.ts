import type {
  Appliance,
  BakePan,
  CategoryId,
  Ingredient,
  LabTool,
  PrepShape,
  ToolCategory,
} from '../types/bakery';

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'A', label: 'A. Basic Baking Ingredients' },
  { id: 'B', label: 'B. Dairy and Eggs' },
  { id: 'C', label: 'C. Flavorings and Seasonings' },
  { id: 'D', label: 'D. Additional Ingredients' },
  { id: 'E', label: 'E. Fruits' },
  { id: 'F', label: 'F. Toppings and Decorations' },
];

export const INGREDIENTS: Ingredient[] = [
  // A. Basic Baking Ingredients (11)
  { id: 'ap_flour', cat: 'A', name: 'All-purpose flour', unitLabel: '1 kg pack', packQty: 1000, unit: 'g', price: 15000, defaultUse: 250, role: 'flour', color: '#f6efe4' },
  { id: 'cake_flour', cat: 'A', name: 'Cake flour', unitLabel: '1 kg pack', packQty: 1000, unit: 'g', price: 16500, defaultUse: 200, role: 'flour', color: '#fbf7ef' },
  { id: 'bread_flour', cat: 'A', name: 'Bread flour', unitLabel: '1 kg pack', packQty: 1000, unit: 'g', price: 19000, defaultUse: 300, role: 'flour', color: '#f3e9d8' },
  { id: 'cornstarch', cat: 'A', name: 'Cornstarch', unitLabel: '250 g box', packQty: 250, unit: 'g', price: 9500, defaultUse: 25, role: 'starch', color: '#ffffff' },
  { id: 'gran_sugar', cat: 'A', name: 'Granulated sugar', unitLabel: '1 kg pack', packQty: 1000, unit: 'g', price: 18500, defaultUse: 150, role: 'sugar', color: '#ffffff' },
  { id: 'pow_sugar', cat: 'A', name: 'Powdered sugar', unitLabel: '500 g pack', packQty: 500, unit: 'g', price: 14500, defaultUse: 100, role: 'sugar', color: '#fffdfd' },
  { id: 'brown_sugar', cat: 'A', name: 'Brown sugar', unitLabel: '500 g pack', packQty: 500, unit: 'g', price: 24000, defaultUse: 100, role: 'sugar', color: '#a56c43' },
  { id: 'baking_powder', cat: 'A', name: 'Baking powder', unitLabel: '45 g bottle', packQty: 45, unit: 'g', price: 8500, defaultUse: 8, role: 'leavener', color: '#f7f5f0' },
  { id: 'baking_soda', cat: 'A', name: 'Baking soda', unitLabel: '81 g bottle', packQty: 81, unit: 'g', price: 6600, defaultUse: 4, role: 'leavener', color: '#f5f5f5' },
  { id: 'salt', cat: 'A', name: 'Salt', unitLabel: '500 g pack', packQty: 500, unit: 'g', price: 6500, defaultUse: 3, role: 'salt', color: '#fafafa' },
  { id: 'yeast', cat: 'A', name: 'Yeast', unitLabel: '44 g box (4x11g)', packQty: 44, unit: 'g', price: 19500, defaultUse: 7, role: 'yeast', color: '#d5b895' },

  // B. Dairy and Eggs (9)
  { id: 'eggs', cat: 'B', name: 'Eggs', unitLabel: '10 pcs tray (~600g)', packQty: 10, unit: 'pcs', price: 24000, defaultUse: 3, role: 'egg', gramsPerPc: 55, color: '#ffd56b' },
  { id: 'butter', cat: 'B', name: 'Butter', unitLabel: '200 g block', packQty: 200, unit: 'g', price: 75000, defaultUse: 115, role: 'fat', color: '#ffe38a' },
  { id: 'margarine', cat: 'B', name: 'Margarine', unitLabel: '200 g sachet', packQty: 200, unit: 'g', price: 9500, defaultUse: 115, role: 'fat', color: '#ffda66' },
  { id: 'milk', cat: 'B', name: 'Milk', unitLabel: '1 L carton', packQty: 1000, unit: 'ml', price: 25500, defaultUse: 150, role: 'liquid', color: '#fffdf7' },
  { id: 'heavy_cream', cat: 'B', name: 'Heavy cream', unitLabel: '200 ml pack', packQty: 200, unit: 'ml', price: 54000, defaultUse: 100, role: 'liquid', color: '#fff8eb' },
  { id: 'whipping_cream', cat: 'B', name: 'Whipping cream', unitLabel: '200 ml pack', packQty: 200, unit: 'ml', price: 58000, defaultUse: 120, role: 'liquid', color: '#fffaf0' },
  { id: 'cream_cheese', cat: 'B', name: 'Cream cheese', unitLabel: '250 g tub', packQty: 250, unit: 'g', price: 62000, defaultUse: 150, role: 'dairy_solid', color: '#fff5dd' },
  { id: 'yogurt', cat: 'B', name: 'Yogurt', unitLabel: '200 ml cup', packQty: 200, unit: 'ml', price: 14500, defaultUse: 80, role: 'acid_liquid', color: '#fcf9f2' },
  { id: 'cond_milk', cat: 'B', name: 'Condensed milk', unitLabel: '370 g can', packQty: 370, unit: 'g', price: 15500, defaultUse: 60, role: 'sugar_liquid', color: '#f9ebc7' },

  // C. Flavorings and Seasonings (10)
  { id: 'vanilla', cat: 'C', name: 'Vanilla extract', unitLabel: '60 ml bottle', packQty: 60, unit: 'ml', price: 22000, defaultUse: 5, role: 'flavor', color: '#78492a' },
  { id: 'cinnamon', cat: 'C', name: 'Cinnamon powder', unitLabel: '50 g jar', packQty: 50, unit: 'g', price: 18000, defaultUse: 8, role: 'flavor', color: '#9e5832' },
  { id: 'nutmeg', cat: 'C', name: 'Nutmeg', unitLabel: '40 g jar', packQty: 40, unit: 'g', price: 17500, defaultUse: 2, role: 'flavor', color: '#8c5b3e' },
  { id: 'cocoa', cat: 'C', name: 'Cocoa powder', unitLabel: '180 g box', packQty: 180, unit: 'g', price: 38000, defaultUse: 35, role: 'chocolate', color: '#5c3424' },
  { id: 'matcha', cat: 'C', name: 'Matcha powder', unitLabel: '50 g pouch', packQty: 50, unit: 'g', price: 45000, defaultUse: 12, role: 'flavor', color: '#6ea854' },
  { id: 'coffee', cat: 'C', name: 'Coffee powder', unitLabel: '100 g jar', packQty: 100, unit: 'g', price: 28000, defaultUse: 6, role: 'flavor', color: '#4e3326' },
  { id: 'choc_chips', cat: 'C', name: 'Chocolate chips', unitLabel: '100 g pack', packQty: 100, unit: 'g', price: 11500, defaultUse: 80, role: 'mixin', color: '#46281c' },
  { id: 'strawb_flavor', cat: 'C', name: 'Strawberry flavoring', unitLabel: '60 ml bottle', packQty: 60, unit: 'ml', price: 12000, defaultUse: 5, role: 'flavor', color: '#f47ca5' },
  { id: 'almond_extract', cat: 'C', name: 'Almond extract', unitLabel: '60 ml bottle', packQty: 60, unit: 'ml', price: 26000, defaultUse: 4, role: 'flavor', color: '#d6b78d' },
  { id: 'lemon_zest', cat: 'C', name: 'Lemon zest', unitLabel: '30 g pack', packQty: 30, unit: 'g', price: 12000, defaultUse: 6, role: 'flavor', color: '#f5dc4c' },

  // D. Additional Ingredients (11)
  { id: 'dark_choc', cat: 'D', name: 'Dark chocolate', unitLabel: '250 g block', packQty: 250, unit: 'g', price: 27000, defaultUse: 150, role: 'chocolate', color: '#3d2218' },
  { id: 'white_choc', cat: 'D', name: 'White chocolate', unitLabel: '250 g block', packQty: 250, unit: 'g', price: 26500, defaultUse: 100, role: 'chocolate', color: '#f5ead4' },
  { id: 'raisins', cat: 'D', name: 'Raisins', unitLabel: '150 g pack', packQty: 150, unit: 'g', price: 18000, defaultUse: 50, role: 'mixin', color: '#683c4e' },
  { id: 'almonds', cat: 'D', name: 'Almonds', unitLabel: '100 g pack', packQty: 100, unit: 'g', price: 28000, defaultUse: 45, role: 'mixin', color: '#d9b489' },
  { id: 'walnuts', cat: 'D', name: 'Walnuts', unitLabel: '100 g pack', packQty: 100, unit: 'g', price: 32000, defaultUse: 45, role: 'mixin', color: '#b58559' },
  { id: 'peanuts', cat: 'D', name: 'Peanuts', unitLabel: '250 g pack', packQty: 250, unit: 'g', price: 16000, defaultUse: 50, role: 'mixin', color: '#cfa26b' },
  { id: 'coconut', cat: 'D', name: 'Coconut flakes', unitLabel: '100 g pack', packQty: 100, unit: 'g', price: 15000, defaultUse: 40, role: 'mixin', color: '#fbfaf5' },
  { id: 'sesame', cat: 'D', name: 'Sesame seeds', unitLabel: '100 g pack', packQty: 100, unit: 'g', price: 12000, defaultUse: 15, role: 'mixin', color: '#e8d5b5' },
  { id: 'sprinkles', cat: 'D', name: 'Sprinkles', unitLabel: '80 g bottle', packQty: 80, unit: 'g', price: 14000, defaultUse: 20, role: 'topping', color: '#ff8fb8' },
  { id: 'honey', cat: 'D', name: 'Honey', unitLabel: '150 ml bottle', packQty: 150, unit: 'ml', price: 29000, defaultUse: 30, role: 'sugar_liquid', color: '#e59d2c' },
  { id: 'jam', cat: 'D', name: 'Jam', unitLabel: '200 g jar', packQty: 200, unit: 'g', price: 23000, defaultUse: 50, role: 'topping', color: '#d94366' },

  // E. Fruits (6)
  { id: 'strawberries', cat: 'E', name: 'Strawberries', unitLabel: '250 g punnet', packQty: 250, unit: 'g', price: 26000, defaultUse: 100, role: 'fruit', color: '#e85478' },
  { id: 'bananas', cat: 'E', name: 'Bananas', unitLabel: '500 g bunch', packQty: 500, unit: 'g', price: 15000, defaultUse: 180, role: 'fruit', color: '#f6da63' },
  { id: 'blueberries', cat: 'E', name: 'Blueberries', unitLabel: '125 g punnet', packQty: 125, unit: 'g', price: 42000, defaultUse: 75, role: 'fruit', color: '#52589e' },
  { id: 'apples', cat: 'E', name: 'Apples', unitLabel: '500 g pack', packQty: 500, unit: 'g', price: 24000, defaultUse: 150, role: 'fruit', color: '#e05b5b' },
  { id: 'lemons', cat: 'E', name: 'Lemons', unitLabel: '250 g pack', packQty: 250, unit: 'g', price: 12000, defaultUse: 30, role: 'acid_fruit', color: '#f5e04c' },
  { id: 'oranges', cat: 'E', name: 'Oranges', unitLabel: '500 g pack', packQty: 500, unit: 'g', price: 19000, defaultUse: 80, role: 'acid_fruit', color: '#f59638' },

  // F. Toppings and Decorations (7)
  { id: 'top_whipped', cat: 'F', name: 'Whipped cream', unitLabel: '250 g piping tub', packQty: 250, unit: 'g', price: 35000, defaultUse: 80, role: 'topping', color: '#fffdf9' },
  { id: 'top_ganache', cat: 'F', name: 'Chocolate ganache', unitLabel: '250 g tub', packQty: 250, unit: 'g', price: 32000, defaultUse: 80, role: 'topping', color: '#45271d' },
  { id: 'top_caramel', cat: 'F', name: 'Caramel', unitLabel: '200 g bottle', packQty: 200, unit: 'g', price: 24000, defaultUse: 50, role: 'topping', color: '#c9792b' },
  { id: 'top_fondant', cat: 'F', name: 'Fondant', unitLabel: '250 g pack', packQty: 250, unit: 'g', price: 26000, defaultUse: 120, role: 'topping', color: '#ffd9e8' },
  { id: 'top_icing', cat: 'F', name: 'Royal icing', unitLabel: '200 g pack', packQty: 200, unit: 'g', price: 22000, defaultUse: 60, role: 'topping', color: '#ffffff' },
  { id: 'top_cheese', cat: 'F', name: 'Cheese', unitLabel: '165 g block', packQty: 165, unit: 'g', price: 21000, defaultUse: 60, role: 'topping', color: '#f7d463' },
  { id: 'top_fruit', cat: 'F', name: 'Fresh fruit toppings', unitLabel: '200 g mix', packQty: 200, unit: 'g', price: 29000, defaultUse: 70, role: 'topping', color: '#f06587' },
];

export const LAB_TOOLS: Record<ToolCategory, LabTool[]> = {
  Mixing: [
    { id: 'mixing_bowls', name: 'Mixing bowls', icon: '🥣', action: 'prep', msg: 'Switched to clean stainless mixing bowl.' },
    { id: 'hand_mixer', name: 'Hand mixer', icon: '🎛️', action: 'mix_electric', msg: 'Mixed batter smoothly with Hand Mixer!' },
    { id: 'stand_mixer', name: 'Stand mixer', icon: '⚙️', action: 'mix_electric', msg: 'Aerated mixture evenly in Stand Mixer!' },
    { id: 'whisk', name: 'Whisk', icon: '🥢', action: 'mix_whisk', msg: 'Whisked ingredients to combine & add light air.' },
    { id: 'spatula', name: 'Spatula', icon: '🥄', action: 'mix_fold', msg: 'Folded batter gently with Silicone Spatula.' },
    { id: 'wooden_spoon', name: 'Wooden spoon', icon: '🪵', action: 'mix_stir', msg: 'Stirred mixture thoroughly with Wooden Spoon.' },
    { id: 'electric_beater', name: 'Electric beater', icon: '⚡', action: 'mix_electric', msg: 'Whipped cream/eggs to silky peaks with Electric Beater!' },
  ],
  Measuring: [
    { id: 'digital_scale', name: 'Digital kitchen scale', icon: '⚖️', action: 'open_scale', msg: 'Opened Digital Kitchen Scale.' },
    { id: 'measuring_cups', name: 'Measuring cups', icon: '🥛', action: 'measure_dry', msg: 'Verified dry cup volume proportions.' },
    { id: 'measuring_spoons', name: 'Measuring spoons', icon: '🥄', action: 'measure_small', msg: 'Calibrated tsp/tbsp leaveners & extracts.' },
    { id: 'liquid_jug', name: 'Liquid measuring jug', icon: '🫗', action: 'measure_liquid', msg: 'Measured liquids cleanly at eye level.' },
    { id: 'thermometer', name: 'Thermometer', icon: '🌡️', action: 'check_temp', msg: 'Checked batter/milk temperature (26°C–38°C ideal).' },
  ],
  Shaping: [
    { id: 'rolling_pin', name: 'Rolling pin', icon: '🥖', action: 'roll_dough', msg: 'Rolled dough evenly with Rolling Pin!' },
    { id: 'dough_scraper', name: 'Dough scraper', icon: '📐', action: 'flatten_dough', msg: 'Shaped & smoothed dough edges with Dough Scraper.' },
    { id: 'cookie_cutters', name: 'Cookie cutters', icon: '⭐', action: 'cut_shapes', msg: 'Stamped cute uniform shapes with Cookie Cutters!' },
    { id: 'pastry_brush', name: 'Pastry brush', icon: '🖌️', action: 'brush_glaze', msg: 'Brushed butter/egg wash/milk glaze evenly.' },
    { id: 'piping_bags', name: 'Piping bags', icon: '🍦', action: 'pipe_decor', msg: 'Loaded frosting/batter into Piping Bag.' },
    { id: 'piping_tips', name: 'Piping tips', icon: '🌸', action: 'pipe_decor', msg: 'Piped decorative rosettes with Star Piping Tip!' },
    { id: 'cake_molds', name: 'Cake molds', icon: '🎂', action: 'mold_cake', msg: 'Transferred batter into lined Cake Mold.' },
    { id: 'bread_molds', name: 'Bread molds', icon: '🍞', action: 'mold_bread', msg: 'Tucked shaped dough into Bread Loaf Mold.' },
    { id: 'baking_trays', name: 'Baking trays', icon: '🍱', action: 'tray_prep', msg: 'Portioned dough onto Baking Tray.' },
  ],
  Cutting: [
    { id: 'chefs_knife', name: "Chef's knife", icon: '🔪', action: 'chop_mixin', msg: "Chopped chocolate/nuts/fruits cleanly with Chef's Knife." },
    { id: 'bread_knife', name: 'Bread knife', icon: '🥖', action: 'score_dough', msg: 'Scored dough top cleanly with serrated Bread Knife.' },
    { id: 'paring_knife', name: 'Paring knife', icon: '🗡️', action: 'trim_fruit', msg: 'Trimmed & sliced fresh fruit toppings with Paring Knife.' },
    { id: 'bench_scraper', name: 'Bench scraper', icon: '🧱', action: 'divide_dough', msg: 'Divided dough into equal bakery portions with Bench Scraper.' },
  ],
  'Other tools': [
    { id: 'sieve', name: 'Sieve', icon: '🕸️', action: 'sift_dry', msg: 'Sifted flour & cocoa powder to remove lumps!' },
    { id: 'pastry_blender', name: 'Pastry blender', icon: '🥐', action: 'cut_butter', msg: 'Cut cold butter into flour for flaky pastry layers!' },
    { id: 'dough_hook', name: 'Dough hook', icon: '🪝', action: 'knead_dough', msg: 'Kneaded dough with Dough Hook until smooth & elastic!' },
    { id: 'cooling_rack', name: 'Cooling rack', icon: '🏁', action: 'ready_rack', msg: 'Prepared Wire Cooling Rack for post-bake airflow.' },
    { id: 'baking_paper', name: 'Baking paper', icon: '📜', action: 'line_paper', msg: 'Lined baking surface with non-stick Parchment Paper!' },
  ],
};

export const PREP_SHAPES: PrepShape[] = [
  { id: 'cake', label: '🎂 Cake Batter', shortName: 'Cake Batter', desc: 'Fluffy layered or sponge cake' },
  { id: 'cookies', label: '🍪 Cookies', shortName: 'Cookies', desc: 'Scooped or cut crispy-chewy cookies' },
  { id: 'bread', label: '🍞 Bread Loaf', shortName: 'Bread Loaf', desc: 'Kneaded & proofed yeast bread' },
  { id: 'cinnamon_roll', label: '🌀 Cinnamon Rolls', shortName: 'Cinnamon Rolls', desc: 'Rolled spiral with cinnamon sugar filling' },
  { id: 'brownies', label: '🍫 Brownies', shortName: 'Brownies', desc: 'Rich fudgy chocolate slab' },
  { id: 'donuts', label: '🍩 Donuts', shortName: 'Donuts', desc: 'Ring-shaped pillowy dough' },
  { id: 'muffins', label: '🧁 Muffins / Cupcakes', shortName: 'Muffins', desc: 'Portioned into muffin cups' },
  { id: 'pastry', label: '🥐 Pastry / Tart', shortName: 'Pastry', desc: 'Flaky laminated or folded pastry' },
];

export const APPLIANCES: Appliance[] = [
  { id: 'conventional_oven', name: 'Conventional oven', icon: '🔥', minT: 100, maxT: 250, defT: 180 },
  { id: 'electric_oven', name: 'Electric oven', icon: '⚡', minT: 80, maxT: 240, defT: 175 },
  { id: 'steamer', name: 'Steamer', icon: '💨', minT: 95, maxT: 105, defT: 100 },
  { id: 'stovetop', name: 'Stovetop', icon: '🍳', minT: 70, maxT: 200, defT: 140 },
  { id: 'frying_pan', name: 'Frying pan', icon: '🥘', minT: 120, maxT: 200, defT: 170 },
  { id: 'saucepan', name: 'Saucepan', icon: '🍲', minT: 70, maxT: 160, defT: 100 },
  { id: 'double_boiler', name: 'Double boiler', icon: '♨️', minT: 60, maxT: 95, defT: 75 },
  { id: 'air_fryer', name: 'Air fryer', icon: '🌀', minT: 80, maxT: 210, defT: 165 },
  { id: 'microwave', name: 'Microwave', icon: '📡', minT: 70, maxT: 120, defT: 100 },
];

export const BAKE_PANS: BakePan[] = [
  { id: 'baking_trays', name: 'Baking trays', icon: '🍱' },
  { id: 'cake_pans', name: 'Cake pans', icon: '🎂' },
  { id: 'muffin_trays', name: 'Muffin trays', icon: '🧁' },
  { id: 'loaf_pan', name: 'Bread loaf pan', icon: '🍞' },
];

export const STARTER_PRESETS: Record<'cinnamon' | 'cake' | 'cookies', string[]> = {
  cinnamon: [
    'bread_flour',
    'gran_sugar',
    'brown_sugar',
    'yeast',
    'salt',
    'eggs',
    'butter',
    'milk',
    'cinnamon',
    'cream_cheese',
    'pow_sugar',
    'vanilla',
  ],
  cake: [
    'cake_flour',
    'gran_sugar',
    'baking_powder',
    'salt',
    'eggs',
    'butter',
    'milk',
    'cocoa',
    'dark_choc',
    'vanilla',
    'top_ganache',
    'sprinkles',
  ],
  cookies: [
    'ap_flour',
    'gran_sugar',
    'brown_sugar',
    'baking_soda',
    'salt',
    'eggs',
    'butter',
    'vanilla',
    'choc_chips',
  ],
};

export const PRE_COOK_OPTIONS: { value: string; label: string; shortLabel: string }[] = [
  {
    value: 'melt_chocolate',
    label: 'Melt Chocolate (Double Boiler — Dark/White Chocolate + Butter)',
    shortLabel: 'Melted Chocolate Base',
  },
  {
    value: 'heat_milk',
    label: 'Heat Milk & Bloom Yeast / Butter',
    shortLabel: 'Warm Milk & Yeast Bloom',
  },
  {
    value: 'fruit_filling',
    label: 'Cook Fruit Filling (Strawberries/Apples/Blueberries + Sugar + Cornstarch)',
    shortLabel: 'Simmered Fruit Filling',
  },
  {
    value: 'caramel',
    label: 'Prepare Caramel Sauce (Sugar + Butter + Cream)',
    shortLabel: 'Golden Caramel Sauce',
  },
  {
    value: 'custard',
    label: 'Make Pastry Custard (Milk + Eggs + Sugar + Cornstarch + Vanilla)',
    shortLabel: 'Silky Pastry Custard',
  },
  {
    value: 'cinnamon_filling',
    label: 'Prepare Warm Cinnamon Filling (Butter + Brown Sugar + Cinnamon)',
    shortLabel: 'Warm Brown Sugar Cinnamon Filling',
  },
];

export function getIngredientById(id: string): Ingredient | undefined {
  return INGREDIENTS.find((item) => item.id === id);
}
