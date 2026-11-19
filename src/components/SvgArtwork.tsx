import React from 'react';
import { getIngredientById } from '../data/bakeryData';
import type { EvaluationResult, PrepShapeId } from '../types/bakery';

export const BrandCupcakeLogo: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M7 16C7 10 11 6 16 6C21 6 25 10 25 16H7Z" fill="#FFF9F5" />
    <circle cx="16" cy="5.5" r="2.5" fill="#C44676" />
    <path d="M9 16L11 26H21L23 16H9Z" fill="#FCE4EC" stroke="#49343B" strokeWidth="1.7" />
    <path d="M13 19V23M16 19V23M19 19V23" stroke="#E88BAE" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

export const IngredientIconSvg: React.FC<{
  id: string;
  role: string;
  color: string;
}> = ({ id, role, color }) => {
  if (role === 'flour' || role === 'starch') {
    return (
      <svg width="56" height="56" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="15" y="14" width="34" height="40" rx="8" fill={color} stroke="#49343B" strokeWidth="2.2" />
        <path d="M19 14L23 8H41L45 14" fill="#FCE4EC" stroke="#49343B" strokeWidth="2" />
        <circle cx="32" cy="34" r="9" fill="#F8C8DC" />
        <path d="M32 28V40M28 32L32 28L36 32" stroke="#49343B" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === 'eggs') {
    return (
      <svg width="56" height="56" viewBox="0 0 64 64" aria-hidden="true">
        <ellipse cx="25" cy="36" rx="11" ry="15" fill="#ffe6b3" stroke="#49343B" strokeWidth="2.2" />
        <ellipse cx="40" cy="34" rx="11" ry="15" fill="#ffd28a" stroke="#49343B" strokeWidth="2.2" />
        <circle cx="36" cy="28" r="3" fill="#fff" opacity="0.7" />
      </svg>
    );
  }
  if (role === 'fat' || id === 'cream_cheese' || id === 'top_cheese') {
    return (
      <svg width="56" height="56" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M12 34L24 22H52L40 34H12Z" fill={color} stroke="#49343B" strokeWidth="2" />
        <rect x="12" y="34" width="28" height="16" rx="2" fill={color} stroke="#49343B" strokeWidth="2" />
        <path d="M40 34L52 22V38L40 50V34Z" fill="#f3c65f" stroke="#49343B" strokeWidth="2" />
      </svg>
    );
  }
  if (role === 'liquid' || role === 'acid_liquid' || role === 'sugar_liquid') {
    return (
      <svg width="56" height="56" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="20" y="14" width="24" height="38" rx="6" fill={color} stroke="#49343B" strokeWidth="2.2" />
        <rect x="24" y="8" width="16" height="6" rx="2" fill="#E88BAE" stroke="#49343B" strokeWidth="2" />
        <rect x="23" y="26" width="18" height="14" rx="3" fill="#FCE4EC" />
      </svg>
    );
  }
  if (role === 'fruit' || role === 'acid_fruit') {
    return (
      <svg width="56" height="56" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="36" r="15" fill={color} stroke="#49343B" strokeWidth="2.2" />
        <path d="M32 21C32 15 38 12 41 15C38 19 34 21 32 21Z" fill="#6ea854" stroke="#49343B" strokeWidth="1.8" />
        <circle cx="27" cy="32" r="2.5" fill="#fff" opacity="0.65" />
      </svg>
    );
  }
  if (role === 'chocolate' || id === 'choc_chips') {
    return (
      <svg width="56" height="56" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="16" y="14" width="32" height="38" rx="5" fill={color} stroke="#49343B" strokeWidth="2.2" />
        <path d="M16 26H48M16 38H48M32 14V52" stroke="#7d5342" strokeWidth="1.8" />
        <path d="M14 36L50 32V52H14V36Z" fill="#F8C8DC" stroke="#49343B" strokeWidth="2" />
      </svg>
    );
  }
  if (role === 'topping') {
    return (
      <svg width="56" height="56" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M16 42C16 32 22 28 32 28C42 28 48 32 48 42H16Z" fill={color} stroke="#49343B" strokeWidth="2" />
        <path d="M22 28C22 20 28 16 32 14C36 16 42 20 42 28" fill={color} stroke="#49343B" strokeWidth="2" />
        <circle cx="32" cy="12" r="4" fill="#E88BAE" />
      </svg>
    );
  }
  return (
    <svg width="56" height="56" viewBox="0 0 64 64" aria-hidden="true">
      <rect x="18" y="18" width="28" height="32" rx="8" fill={color} stroke="#49343B" strokeWidth="2.2" />
      <rect x="21" y="11" width="22" height="7" rx="3" fill="#E88BAE" stroke="#49343B" strokeWidth="2" />
      <circle cx="32" cy="34" r="6" fill="#FCE4EC" stroke="#49343B" strokeWidth="1.5" />
    </svg>
  );
};

export const MixingBowlSvg: React.FC<{
  bowl: Record<string, number>;
  mixedLevel: number;
  rolled: boolean;
  cinnamonSpiral: boolean;
  linedPaper: boolean;
  shape: PrepShapeId;
}> = ({ bowl, mixedLevel, rolled, cinnamonSpiral, linedPaper, shape }) => {
  const ids = Object.keys(bowl);
  const hasItems = ids.length > 0;

  let fill = '#f7ead9';
  if (bowl['cocoa'] || bowl['dark_choc']) fill = '#6b4130';
  else if (bowl['matcha']) fill = '#84b86a';
  else if (bowl['strawb_flavor'] || bowl['strawberries']) fill = '#f7a8c4';
  else if (bowl['cinnamon'] || bowl['brown_sugar']) fill = '#d6a478';
  else if (bowl['butter'] || bowl['eggs']) fill = '#fce49c';

  const isRolled = rolled || shape === 'cinnamon_roll';

  if (hasItems && isRolled && (cinnamonSpiral || shape === 'cinnamon_roll')) {
    return (
      <svg width="230" height="170" viewBox="0 0 230 170" className="mx-auto" aria-label="Rolled cinnamon spiral dough">
        <rect
          x="20"
          y="25"
          width="190"
          height="120"
          rx="18"
          fill={linedPaper ? '#fffdf5' : '#fce4ec'}
          stroke="#49343B"
          strokeWidth="2.5"
        />
        <g transform="translate(65, 85)">
          <circle r="34" fill={fill} stroke="#49343B" strokeWidth="2.2" />
          <path
            d="M0 0 C6 -6 14 0 10 10 C4 18 -14 14 -16 0 C-18 -18 14 -26 24 -8"
            fill="none"
            stroke="#8c4c27"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
        <g transform="translate(155, 85)">
          <circle r="34" fill={fill} stroke="#49343B" strokeWidth="2.2" />
          <path
            d="M0 0 C6 -6 14 0 10 10 C4 18 -14 14 -16 0 C-18 -18 14 -26 24 -8"
            fill="none"
            stroke="#8c4c27"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      </svg>
    );
  }

  return (
    <svg width="230" height="170" viewBox="0 0 230 170" className="mx-auto" aria-label="Mixing bowl">
      <ellipse cx="115" cy="56" rx="86" ry="24" fill="#FCE4EC" stroke="#49343B" strokeWidth="2.5" />
      {hasItems && <ellipse cx="115" cy="60" rx="74" ry="18" fill={fill} />}
      {hasItems && mixedLevel >= 2 && (
        <path d="M68 58 Q115 46 162 58 Q115 70 68 58" fill="rgba(255,255,255,0.35)" />
      )}
      {hasItems &&
        mixedLevel === 0 &&
        ids.slice(0, 6).map((id, idx) => {
          const ing = getIngredientById(id);
          return (
            <circle
              key={id}
              cx={72 + idx * 17}
              cy={58 + (idx % 2) * 5}
              r="7"
              fill={ing?.color || '#ffffff'}
              stroke="#49343B"
              strokeWidth="1"
            />
          );
        })}
      <path
        d="M29 56 C29 124 66 150 115 150 C164 150 201 124 201 56 C180 74 148 80 115 80 C82 80 50 74 29 56 Z"
        fill="#F8C8DC"
        stroke="#49343B"
        strokeWidth="2.5"
      />
      <ellipse cx="115" cy="150" rx="46" ry="7" fill="#E88BAE" stroke="#49343B" strokeWidth="2" />
    </svg>
  );
};

export const OvenChamberSvg: React.FC<{
  pct: number;
  temp: number;
  targetMins: number;
  proofed: boolean;
  shape: PrepShapeId;
  bowl: Record<string, number>;
}> = ({ pct, temp, targetMins, proofed, shape, bowl }) => {
  let doughColor = '#f7ead9';
  if (pct > 0 && pct < 35) doughColor = '#f4dfb8';
  else if (pct >= 35 && pct < 75) doughColor = '#e7b97c';
  else if (pct >= 75) {
    const isHotLong = (temp > 210 && pct > 80) || (shape === 'cookies' && targetMins > 25 && pct > 75);
    doughColor = isHotLong ? '#5e3622' : '#d4914c';
  }

  if (bowl['cocoa'] || bowl['dark_choc']) {
    doughColor = pct > 80 && temp > 215 ? '#21110c' : '#5e3624';
  }

  const scaleRise = 1 + (pct / 100) * (proofed ? 0.25 : 0.14);

  return (
    <svg width="200" height="125" viewBox="0 0 200 125" aria-label="Baking progress preview">
      <rect x="20" y="96" width="160" height="14" rx="4" fill="#d9c2cb" stroke="#fff" strokeWidth="1.5" />
      <g transform={`translate(100, 96) scale(1, ${scaleRise.toFixed(2)}) translate(-100, -96)`}>
        <path
          d="M44 96 C44 52 70 40 100 40 C130 40 156 52 156 96 Z"
          fill={doughColor}
          stroke="#49343B"
          strokeWidth="2.2"
        />
        {shape === 'cinnamon_roll' && (
          <path
            d="M78 72 C88 60 112 60 118 74"
            fill="none"
            stroke="#854422"
            strokeWidth="4"
            strokeLinecap="round"
          />
        )}
      </g>
    </svg>
  );
};

export const FinalProductSvg: React.FC<{
  ev: EvaluationResult;
  shape: PrepShapeId;
  bowl: Record<string, number>;
}> = ({ ev, shape, bowl }) => {
  let baseColor = '#e7b273';
  if (ev.bakeState === 'burnt') baseColor = '#3d2419';
  else if (ev.bakeState === 'raw' || ev.bakeState === 'underbaked') baseColor = '#f5e6c8';
  else if (bowl['cocoa'] || bowl['dark_choc']) baseColor = '#5e3624';
  else if (bowl['matcha']) baseColor = '#7db562';
  else if (bowl['strawberries'] || bowl['strawb_flavor']) baseColor = '#f29ab8';

  const hasCream = Boolean(
    bowl['top_whipped'] || bowl['cream_cheese'] || bowl['top_icing'] || bowl['whipping_cream']
  );
  const hasGanache = Boolean(bowl['top_ganache'] || bowl['dark_choc']);
  const hasSprinkles = Boolean(bowl['sprinkles']);
  const hasFruit = Boolean(bowl['top_fruit'] || bowl['strawberries'] || bowl['blueberries']);

  return (
    <svg width="230" height="210" viewBox="0 0 230 210" aria-label={ev.productName}>
      <ellipse cx="115" cy="164" rx="92" ry="18" fill="#ffffff" stroke="#E88BAE" strokeWidth="3" />
      <ellipse cx="115" cy="160" rx="76" ry="12" fill="#FCE4EC" />

      {shape === 'cookies' && (
        <g>
          <circle cx="88" cy="122" r="34" fill={baseColor} stroke="#49343B" strokeWidth="2.5" />
          <circle cx="145" cy="112" r="34" fill={baseColor} stroke="#49343B" strokeWidth="2.5" />
          <circle cx="116" cy="142" r="34" fill={baseColor} stroke="#49343B" strokeWidth="2.5" />
          {bowl['choc_chips'] ? (
            <>
              <circle cx="80" cy="114" r="4" fill="#3b2016" />
              <circle cx="100" cy="128" r="4" fill="#3b2016" />
              <circle cx="148" cy="108" r="4" fill="#3b2016" />
              <circle cx="114" cy="144" r="4" fill="#3b2016" />
            </>
          ) : null}
        </g>
      )}

      {shape === 'cinnamon_roll' && (
        <g transform="translate(115, 118)">
          <ellipse cx="0" cy="18" rx="68" ry="30" fill={baseColor} stroke="#49343B" strokeWidth="2.5" />
          <ellipse cx="0" cy="0" rx="66" ry="32" fill={baseColor} stroke="#49343B" strokeWidth="2.5" />
          <path
            d="M0 0 C12 -10 26 2 18 14 C6 24 -28 18 -30 -2 C-32 -24 22 -30 40 -8"
            fill="none"
            stroke="#85421f"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {hasCream && (
            <path
              d="M-45 -8 Q-15 16 12 -6 Q34 14 48 -6"
              fill="none"
              stroke="#fff9f5"
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0.92"
            />
          )}
        </g>
      )}

      {shape === 'donuts' && (
        <g>
          <ellipse cx="115" cy="122" rx="68" ry="42" fill={baseColor} stroke="#49343B" strokeWidth="2.5" />
          <ellipse
            cx="115"
            cy="116"
            rx="64"
            ry="34"
            fill={hasGanache ? '#45271d' : '#F8C8DC'}
            stroke="#49343B"
            strokeWidth="2"
          />
          <ellipse cx="115" cy="120" rx="22" ry="12" fill="#FCE4EC" stroke="#49343B" strokeWidth="2.2" />
        </g>
      )}

      {shape !== 'cookies' && shape !== 'cinnamon_roll' && shape !== 'donuts' && (
        <g>
          <rect x="46" y="88" width="138" height="62" rx="14" fill={baseColor} stroke="#49343B" strokeWidth="2.5" />
          <path
            d="M46 98 C46 72 184 72 184 98"
            fill={hasGanache ? '#422419' : hasCream ? '#fffdf9' : baseColor}
            stroke="#49343B"
            strokeWidth="2.2"
          />
          {hasCream && (
            <path
              d="M52 96 Q75 114 96 96 Q118 114 138 96 Q160 114 178 96"
              fill="none"
              stroke="#fffdf9"
              strokeWidth="8"
              strokeLinecap="round"
            />
          )}
        </g>
      )}

      {hasFruit && (
        <g>
          <circle cx="96" cy="78" r="8" fill="#e84f73" stroke="#49343B" strokeWidth="1.5" />
          <circle cx="132" cy="78" r="8" fill="#52589e" stroke="#49343B" strokeWidth="1.5" />
        </g>
      )}

      {hasSprinkles && (
        <g>
          <rect x="85" y="92" width="8" height="3" rx="1.5" fill="#ff73a8" transform="rotate(20 85 92)" />
          <rect x="132" y="95" width="8" height="3" rx="1.5" fill="#ffd166" transform="rotate(-25 132 95)" />
          <rect x="112" y="86" width="8" height="3" rx="1.5" fill="#70d6ff" />
        </g>
      )}

      {ev.isPerfect && (
        <g>
          <text x="182" y="42" fontSize="22">✨</text>
          <text x="32" y="52" fontSize="18">💖</text>
        </g>
      )}
    </svg>
  );
};
