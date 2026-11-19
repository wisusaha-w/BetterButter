import { APPLIANCES, getIngredientById } from '../data/bakeryData';
import type {
  BakeState,
  BakeVisualState,
  EvaluationResult,
  IngredientRole,
  PreCookItem,
  PrepState,
} from '../types/bakery';

export function formatIDR(num: number): string {
  const rounded = Math.round(num || 0);
  return 'Rp ' + rounded.toLocaleString('id-ID');
}

export function computeBatchIngredientCost(bowl: Record<string, number>): number {
  let total = 0;
  Object.entries(bowl).forEach(([id, amt]) => {
    const ing = getIngredientById(id);
    if (ing) {
      total += (amt / ing.packQty) * ing.price;
    }
  });
  return Math.round(total);
}

export function computeLiveBakeWarnings(
  bowl: Record<string, number>,
  prep: PrepState,
  bake: BakeState
): { lvl: 'ok' | 'warn' | 'danger'; msg: string }[] {
  const { appliance, temp, targetMins, proofed } = bake;
  const shape = prep.shape;
  const hasYeast = Boolean(bowl['yeast']);
  const warns: { lvl: 'ok' | 'warn' | 'danger'; msg: string }[] = [];

  if (appliance === 'steamer' && (shape === 'cookies' || shape === 'pastry')) {
    warns.push({
      lvl: 'danger',
      msg: 'Steaming cookies or flaky pastry makes them soggy instead of crisp!',
    });
  }
  if (appliance === 'double_boiler' && (shape === 'bread' || shape === 'cookies' || shape === 'cake')) {
    warns.push({
      lvl: 'danger',
      msg: 'Double boiler heat is too gentle/wet to bake cakes, cookies, or bread!',
    });
  }
  if (appliance === 'microwave' && (shape === 'bread' || shape === 'pastry')) {
    warns.push({
      lvl: 'warn',
      msg: 'Microwaving yeast bread or pastry produces rubbery texture with no crust.',
    });
  }
  if ((shape === 'cake' || shape === 'brownies' || shape === 'muffins') && temp > 210 && appliance.includes('oven')) {
    warns.push({
      lvl: 'danger',
      msg: `${temp}°C is too hot for ${shape} — outer crust will burn before the center cooks!`,
    });
  }
  if ((shape === 'cake' || shape === 'bread') && temp < 145 && appliance.includes('oven')) {
    warns.push({
      lvl: 'warn',
      msg: `${temp}°C is quite low for oven baking — structure may collapse or underbake.`,
    });
  }
  if (shape === 'cookies' && targetMins > 25 && temp >= 165) {
    warns.push({
      lvl: 'danger',
      msg: `${targetMins} min is too long for cookies at ${temp}°C — risk of burnt bottoms!`,
    });
  }
  if (hasYeast && !proofed) {
    warns.push({
      lvl: 'warn',
      msg: "Yeast dough detected! Enable 'Proof dough' so your bread/cinnamon rolls rise properly.",
    });
  }
  if (appliance === 'steamer' && temp > 115) {
    warns.push({
      lvl: 'warn',
      msg: 'Steamers operate near 100°C boiling steam.',
    });
  }

  return warns;
}

export function runBakingEvaluation(
  bowl: Record<string, number>,
  prep: PrepState,
  bake: BakeState,
  preCooked: PreCookItem[]
): EvaluationResult {
  const amt = (id: string) => bowl[id] || 0;
  const sumRole = (roles: IngredientRole[]) =>
    Object.keys(bowl).reduce((acc, id) => {
      const ing = getIngredientById(id);
      if (!ing || !roles.includes(ing.role)) return acc;
      const g = ing.unit === 'pcs' ? bowl[id] * (ing.gramsPerPc || 55) : bowl[id];
      return acc + g;
    }, 0);

  const flourG = sumRole(['flour']);
  const starchG = sumRole(['starch']);
  const sugarG = sumRole(['sugar', 'sugar_liquid']);
  const fatG = sumRole(['fat']);
  const liquidG = sumRole(['liquid', 'acid_liquid', 'sugar_liquid']);
  const eggPcs = amt('eggs');
  const eggG = eggPcs * 55;
  const saltG = amt('salt');
  const bpG = amt('baking_powder');
  const bsG = amt('baking_soda');
  const yeastG = amt('yeast');
  const chocG = amt('dark_choc') + amt('white_choc') + amt('cocoa');
  const acidG =
    sumRole(['acid_liquid', 'acid_fruit']) +
    (amt('brown_sugar') > 0 ? 15 : 0) +
    (amt('cocoa') > 0 ? 15 : 0);

  const shape = prep.shape;
  const { appliance, temp, elapsedMins, targetMins, proofed } = bake;
  const effectiveMins = elapsedMins > 0 ? elapsedMins : targetMins;

  let score = 100;
  const errors: string[] = [];
  const warnings: string[] = [];
  const successes: string[] = [];

  // 1. Structural foundation
  if (flourG + starchG < 40 && chocG < 100) {
    score -= 40;
    errors.push(
      'Missing base structure: Almost no flour/starch was used. Baked goods need flour (or dense chocolate/egg base) to hold shape.'
    );
  } else {
    successes.push('Good structural flour/base foundation.');
  }

  // 2. Salt & chemical leaveners
  if (saltG > 18) {
    score -= 25;
    errors.push(
      `Too much salt (${saltG} g)! Excessive salt makes the bake overly salty and inhibits yeast.`
    );
  }
  if (bpG + bsG > 25) {
    score -= 22;
    errors.push(
      `Excessive chemical leavener (${bpG + bsG} g baking powder/soda)! This causes a metallic/soapy bitter taste and collapse.`
    );
  }
  if (bsG > 0 && acidG === 0 && shape !== 'cookies') {
    score -= 10;
    warnings.push(
      'Baking soda used without an acidic ingredient (brown sugar, yogurt, lemon, or cocoa) — may leave a slight alkaline aftertaste.'
    );
  }

  // 3. Shape-specific baking chemistry
  if (shape === 'bread' || shape === 'cinnamon_roll' || shape === 'donuts') {
    if (yeastG === 0 && bpG === 0) {
      score -= 28;
      errors.push(
        `No yeast or leavening agent for ${shape.replace('_', ' ')}! Dough will bake into a dense, hard brick.`
      );
    } else if (yeastG > 0 && !proofed) {
      score -= 15;
      warnings.push(
        'Yeast was added but dough was not proofed in Stage 3 — crumb will be tight instead of airy and pillowy.'
      );
    } else if (yeastG > 0 && proofed) {
      successes.push('Proper yeast fermentation & proofing achieved!');
    }
    if (liquidG + eggG < flourG * 0.35 && flourG > 0) {
      score -= 18;
      errors.push(
        'Dough hydration is too dry (insufficient milk/liquid/eggs for the flour weight).'
      );
    }
    if (!prep.kneaded && shape === 'bread') {
      score -= 12;
      warnings.push(
        'Bread dough was not kneaded with the Dough Hook or by hand — gluten network remained weak.'
      );
    }
    if (
      shape === 'cinnamon_roll' &&
      amt('cinnamon') === 0 &&
      !preCooked.some((p) => p.type === 'cinnamon_filling')
    ) {
      score -= 22;
      errors.push(
        'Cinnamon Rolls selected, but no cinnamon powder or cinnamon filling was included!'
      );
    }
  }

  if (shape === 'cake' || shape === 'muffins') {
    if (eggPcs === 0 && sumRole(['acid_liquid']) === 0) {
      score -= 20;
      errors.push(
        'Cakes/muffins need eggs (or yogurt/milk binder) for lift, moisture, and tender crumb.'
      );
    }
    if (fatG < 30) {
      score -= 14;
      warnings.push(
        'Very low butter/margarine — cake texture may feel dry and rubbery.'
      );
    }
    if (bpG === 0 && bsG === 0 && eggPcs < 3) {
      score -= 18;
      errors.push(
        'Missing leavening (baking powder/soda or whipped eggs) for fluffy cake rise.'
      );
    }
    if (sugarG < 40) {
      score -= 12;
      warnings.push(
        'Low sugar ratio — cake will lack sweetness, moisture retention, and golden browning.'
      );
    }
  }

  if (shape === 'cookies') {
    if (fatG < 40) {
      score -= 22;
      errors.push(
        'Cookies need butter or margarine to spread and bake crisp-chewy.'
      );
    }
    if (sugarG < 40) {
      score -= 15;
      errors.push(
        "Too little sugar — cookies won't caramelize or hold chewy edges."
      );
    }
    if (liquidG > flourG * 0.5 && flourG > 0) {
      score -= 18;
      errors.push(
        'Cookie dough has too much liquid (milk/cream) — it turned into runny cake batter instead of scoopable dough!'
      );
    }
  }

  if (shape === 'brownies') {
    if (chocG < 30) {
      score -= 25;
      errors.push(
        'Brownies require cocoa powder or dark chocolate for authentic chocolate structure and flavor!'
      );
    }
    if (fatG < 40) {
      score -= 15;
      errors.push(
        'Insufficient butter/fat — brownies will turn out cakey and dry instead of fudgy.'
      );
    }
  }

  // 4. Mixing technique
  if (prep.mixedLevel === 0) {
    score -= 25;
    errors.push(
      'Ingredients were placed in the bowl but never mixed with a whisk, spatula, or mixer!'
    );
  } else {
    successes.push('Ingredients properly blended during preparation.');
  }

  // 5. Thermal & equipment appropriateness
  let bakeState: BakeVisualState = 'golden';
  if (
    appliance === 'double_boiler' &&
    ['cake', 'cookies', 'bread', 'cinnamon_roll', 'brownies', 'muffins'].includes(shape)
  ) {
    score -= 35;
    bakeState = 'raw';
    errors.push(
      'Inappropriate equipment: A double boiler cannot bake dough or batter — it only melts chocolate or gently warms custard.'
    );
  } else if (appliance === 'steamer' && ['cookies', 'pastry'].includes(shape)) {
    score -= 28;
    bakeState = 'underbaked';
    errors.push(
      `Steaming ${shape} traps moisture and prevents crisp Maillard browning.`
    );
  } else {
    if (shape === 'cookies') {
      if (temp > 210 || (temp >= 175 && effectiveMins > 24)) {
        score -= 30;
        bakeState = 'burnt';
        errors.push(
          `Cookies overbaked/burnt (${temp}°C for ${effectiveMins} min). Ideal is 170–185°C for 10–16 min.`
        );
      } else if (effectiveMins < 7 || temp < 140) {
        score -= 22;
        bakeState = 'underbaked';
        errors.push(
          `Cookies underbaked (${temp}°C for ${effectiveMins} min) — centers remain raw.`
        );
      } else {
        successes.push(
          'Crisp edges & chewy centers from accurate cookie baking temperature and time!'
        );
      }
    } else {
      if (temp > 220 && effectiveMins > 18) {
        score -= 30;
        bakeState = 'burnt';
        errors.push(
          `Temperature too high (${temp}°C for ${effectiveMins} min) — exterior scorched/burnt!`
        );
      } else if (temp < 145 && appliance.includes('oven')) {
        score -= 20;
        bakeState = 'underbaked';
        errors.push(
          `Oven temperature (${temp}°C) too low for proper spring and set.`
        );
      } else if (
        effectiveMins < 14 &&
        (shape === 'cake' || shape === 'bread' || shape === 'brownies')
      ) {
        score -= 25;
        bakeState = 'underbaked';
        errors.push(
          `Duration (${effectiveMins} min) too short — center of ${shape} is still liquid/raw!`
        );
      } else if (effectiveMins > 55 && shape !== 'bread') {
        score -= 18;
        bakeState = 'dry';
        warnings.push(
          `Baked slightly too long (${effectiveMins} min) — crumb may be dry.`
        );
      } else {
        successes.push('Well-balanced baking temperature and cooking duration.');
      }
    }
  }

  // 6. Creative Product Name
  let flavorTag = '';
  if (amt('matcha') > 0) flavorTag += 'Matcha ';
  if (amt('cocoa') > 0 || amt('dark_choc') > 0) flavorTag += 'Dark Chocolate ';
  else if (amt('white_choc') > 0) flavorTag += 'White Chocolate ';
  if (amt('strawberries') > 0 || amt('strawb_flavor') > 0) flavorTag += 'Strawberry ';
  if (amt('bananas') > 0) flavorTag += 'Banana ';
  if (amt('blueberries') > 0) flavorTag += 'Blueberry ';
  if (amt('apples') > 0) flavorTag += 'Apple ';
  if (amt('coffee') > 0) flavorTag += 'Espresso ';
  if (amt('cream_cheese') > 0 && shape !== 'cinnamon_roll') flavorTag += 'Cream Cheese ';
  if (amt('cinnamon') > 0 && shape !== 'cinnamon_roll') flavorTag += 'Cinnamon ';

  const shapeNames: Record<string, string> = {
    cake: 'Sponge Cake',
    cookies: 'Butter Cookies',
    bread: 'Artisan Bread Loaf',
    cinnamon_roll: 'Cinnamon Rolls',
    brownies: 'Fudgy Brownies',
    donuts: 'Bakery Donuts',
    muffins: 'Bakery Muffins',
    pastry: 'Flaky Pastry',
  };

  const cookPrefix =
    appliance === 'steamer'
      ? 'Steamed '
      : appliance === 'air_fryer'
      ? 'Air-Fried '
      : '';
  let productName = `${cookPrefix}${flavorTag}${shapeNames[shape] || 'Baked Creation'}`.trim();
  if (bakeState === 'burnt') productName = `Scorched ${productName}`;
  if (bakeState === 'raw' || bakeState === 'underbaked') {
    productName = `Underbaked ${productName}`;
  }

  score = Math.max(0, Math.min(100, score));
  const isPerfect = score >= 80 && errors.length === 0;

  const appObj = APPLIANCES.find((a) => a.id === appliance);
  if (appObj && appliance === 'steamer' && shape === 'cake') {
    successes.push('Steamer produced a moist steamed sponge cake!');
  }

  return {
    score,
    isPerfect,
    productName,
    bakeState,
    errors,
    warnings,
    successes,
    ingredientCost: computeBatchIngredientCost(bowl),
    appearanceDesc:
      bakeState === 'burnt'
        ? 'Dark charred crust with bitter aroma'
        : bakeState === 'underbaked' || bakeState === 'raw'
        ? 'Pale, collapsed, doughy interior'
        : bakeState === 'dry'
        ? 'Deep golden exterior, slightly crumbly interior'
        : 'Warm golden-brown finish with enticing bakery aroma',
  };
}
