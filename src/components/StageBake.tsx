import React from 'react';
import { ArrowLeft, ArrowRight, Play, Pause, RotateCcw, FastForward, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { APPLIANCES, BAKE_PANS } from '../data/bakeryData';
import type { BakeState, PrepState } from '../types/bakery';
import { computeLiveBakeWarnings } from '../utils/evaluation';
import { OvenChamberSvg } from './SvgArtwork';

interface StageBakeProps {
  bowl: Record<string, number>;
  prep: PrepState;
  bake: BakeState;
  bakeSpeed: 1 | 2;
  onSetBakeSpeed: (spd: 1 | 2) => void;
  onBackToPrep: () => void;
  onSelectAppliance: (id: string) => void;
  onSelectPan: (id: string) => void;
  onChangeTemp: (temp: number) => void;
  onChangeTargetMins: (mins: number) => void;
  onToggleProof: (proofed: boolean) => void;
  onToggleTimer: () => void;
  onFastForward: () => void;
  onResetTimer: () => void;
  onFinishBaking: () => void;
}

export const StageBake: React.FC<StageBakeProps> = ({
  bowl,
  prep,
  bake,
  bakeSpeed,
  onSetBakeSpeed,
  onBackToPrep,
  onSelectAppliance,
  onSelectPan,
  onChangeTemp,
  onChangeTargetMins,
  onToggleProof,
  onToggleTimer,
  onFastForward,
  onResetTimer,
  onFinishBaking,
}) => {
  const warnings = computeLiveBakeWarnings(bowl, prep, bake);
  const pct = Math.min(100, (bake.elapsedMins / Math.max(1, bake.targetMins)) * 100);
  const internalT = Math.round(26 + (pct / 100) * Math.min(98, bake.temp * 0.52));

  let statusDesc = 'Place your prepared batter or dough inside and press Start.';
  if (pct > 0 && pct < 35) {
    statusDesc = 'Warming up — fats melting & leaveners activating!';
  } else if (pct >= 35 && pct < 75) {
    statusDesc = 'Rising & setting crumb structure...';
  } else if (pct >= 75) {
    const isHotLong =
      (bake.temp > 210 && pct > 80) ||
      (prep.shape === 'cookies' && bake.targetMins > 25 && pct > 75);
    statusDesc = isHotLong
      ? 'Smoking! Edges are scorching!'
      : 'Golden brown & aromatic!';
  }

  return (
    <section className="space-y-5">
      {/* Banner */}
      <div className="bg-white rounded-[24px] px-6 py-5 border-2 border-[#FCE4EC] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#49343B] tracking-tight">
            Stage 3: Baking &amp; Cooking Kitchen
          </h1>
          <p className="text-sm text-[#7B5D67] mt-0.5">
            Choose your heating appliance and bakeware, set temperature &amp; duration, and monitor real-time baking progress.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onBackToPrep}
            className="px-4 py-2.5 rounded-xl bg-white border-2 border-[#F8C8DC] hover:bg-[#FCE4EC] text-xs sm:text-sm font-bold text-[#49343B] flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Prep Lab</span>
          </button>
          <button
            type="button"
            onClick={onFinishBaking}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E88BAE] to-[#C44676] text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg flex items-center gap-1.5 transition-all"
          >
            <span>FINISH BAKING</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Controls & Live Chamber */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-5 items-start">
        <div className="space-y-4">
          {/* 1. Appliances */}
          <div className="bg-white rounded-[20px] p-5 border border-[#FCE4EC] shadow-sm">
            <h2 className="text-base font-extrabold text-[#49343B] mb-3">1. Heating Appliance</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {APPLIANCES.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => onSelectAppliance(app.id)}
                  className={`rounded-2xl border-2 p-3 flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                    bake.appliance === app.id
                      ? 'bg-[#FCE4EC] border-[#C44676] shadow-sm'
                      : 'bg-[#FFF9F5] border-[#F8C8DC] hover:bg-[#FCE4EC]'
                  }`}
                >
                  <span className="text-2xl leading-none">{app.icon}</span>
                  <span className="text-[#49343B] text-center">{app.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Baking Pan */}
          <div className="bg-white rounded-[20px] p-5 border border-[#FCE4EC] shadow-sm">
            <h2 className="text-base font-extrabold text-[#49343B] mb-3">2. Baking Pan / Tray / Vessel</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {BAKE_PANS.map((pan) => (
                <button
                  key={pan.id}
                  type="button"
                  onClick={() => onSelectPan(pan.id)}
                  className={`rounded-2xl border-2 p-3 flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                    bake.pan === pan.id
                      ? 'bg-[#FCE4EC] border-[#C44676] shadow-sm'
                      : 'bg-[#FFF9F5] border-[#F8C8DC] hover:bg-[#FCE4EC]'
                  }`}
                >
                  <span className="text-2xl leading-none">{pan.icon}</span>
                  <span className="text-[#49343B] text-center">{pan.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Temperature, Proofing & Duration */}
          <div className="bg-white rounded-[20px] p-5 border border-[#FCE4EC] shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-[#49343B]">
              3. Temperature, Proofing &amp; Duration
            </h2>

            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <label htmlFor="bakeTempSlider">Cooking Temperature</label>
                <span className="text-[#C44676] tabular-nums">{bake.temp} °C</span>
              </div>
              <input
                id="bakeTempSlider"
                type="range"
                min={60}
                max={250}
                step={5}
                value={bake.temp}
                onChange={(e) => onChangeTemp(Number(e.target.value))}
                className="w-full accent-[#C44676]"
              />
              <div className="flex justify-between text-[11px] text-[#7B5D67] tabular-nums">
                <span>60°C</span>
                <span>150°C</span>
                <span>250°C</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <label htmlFor="bakeTimeSlider">Target Duration (minutes)</label>
                <span className="text-[#C44676] tabular-nums">{bake.targetMins} min</span>
              </div>
              <input
                id="bakeTimeSlider"
                type="range"
                min={1}
                max={90}
                step={1}
                value={bake.targetMins}
                onChange={(e) => onChangeTargetMins(Number(e.target.value))}
                className="w-full accent-[#C44676]"
              />
              <div className="flex justify-between text-[11px] text-[#7B5D67] tabular-nums">
                <span>1 min</span>
                <span>45 min</span>
                <span>90 min</span>
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-sm font-bold text-[#49343B] cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={bake.proofed}
                onChange={(e) => onToggleProof(e.target.checked)}
                className="w-4 h-4 accent-[#C44676] rounded"
              />
              <span>Proof dough (35–40°C warm rise for 45 min before baking)</span>
            </label>

            {/* Live Warnings */}
            <div className="space-y-2 pt-1">
              {warnings.length === 0 ? (
                <div className="rounded-xl p-3 bg-[#eaf9f0] border border-[#b3e8cb] text-[#206b45] text-xs font-bold flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Temperature, equipment, and duration look well-suited for{' '}
                    {prep.shape.replace('_', ' ')}!
                  </span>
                </div>
              ) : (
                warnings.map((w, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl p-3 text-xs font-bold flex items-start gap-2 border ${
                      w.lvl === 'danger'
                        ? 'bg-[#fdecef] border-[#f5bcc8] text-[#9c253f]'
                        : 'bg-[#fff5e6] border-[#f7d5a3] text-[#8c5310]'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Warning: {w.msg}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Live Chamber Monitor */}
        <div className="bg-white rounded-[20px] p-5 border border-[#FCE4EC] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-[#49343B]">Live Baking Monitor</h2>
            <span className="text-xs font-bold text-[#C44676]">
              {bake.running ? 'Baking Live...' : bake.completed ? 'Bake Complete' : 'Ready'}
            </span>
          </div>

          <div className="bg-[#3d2a31] rounded-[22px] p-5 border-[5px] border-[#F8C8DC] relative overflow-hidden min-h-[250px] flex flex-col items-center justify-center text-white">
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                bake.running ? 'opacity-100 animate-oven-glow' : 'opacity-0'
              }`}
              style={{
                background:
                  'radial-gradient(circle at center, rgba(255, 162, 82, 0.38), transparent 70%)',
              }}
            />
            <div className="relative z-10">
              <OvenChamberSvg
                pct={pct}
                temp={bake.temp}
                targetMins={bake.targetMins}
                proofed={bake.proofed}
                shape={prep.shape}
                bowl={bowl}
              />
            </div>
            <div className="relative z-10 mt-2 text-center">
              <div className="text-lg font-extrabold tabular-nums">
                {bake.elapsedMins} / {bake.targetMins} min
              </div>
              <div className="text-xs text-white/85 mt-0.5">{statusDesc}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3.5 bg-[#FCE4EC] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#F8C8DC] to-[#C44676] transition-all duration-200"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onToggleTimer}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E88BAE] to-[#C44676] text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5"
              >
                {bake.running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{bake.running ? 'Pause' : 'Start Baking'}</span>
              </button>
              <button
                type="button"
                onClick={onFastForward}
                className="px-3.5 py-2 rounded-xl bg-[#FCE4EC] hover:bg-[#F8C8DC] text-[#49343B] text-xs font-bold flex items-center gap-1"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Fast-Forward</span>
              </button>
              <button
                type="button"
                onClick={onResetTimer}
                className="px-3.5 py-2 rounded-xl bg-white border border-[#F8C8DC] hover:bg-[#FFF9F5] text-[#49343B] text-xs font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Timer</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg bg-[#FCE4EC] p-0.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => onSetBakeSpeed(1)}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    bakeSpeed === 1 ? 'bg-white text-[#C44676] shadow-xs' : 'text-[#49343B]'
                  }`}
                >
                  1x
                </button>
                <button
                  type="button"
                  onClick={() => onSetBakeSpeed(2)}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    bakeSpeed === 2 ? 'bg-white text-[#C44676] shadow-xs' : 'text-[#49343B]'
                  }`}
                >
                  2x
                </button>
              </div>
              <span className="text-xs font-bold text-[#7B5D67] tabular-nums">
                Internal Temp: {internalT}°C
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
