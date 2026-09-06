import { memo, type CSSProperties } from "react";
import { formatSpeed, sliderToSpeed, speedToSlider } from "../hooks/useSimulation";
import { PauseIcon, PlayIcon, ResetIcon } from "./Icons";

interface ControlDeckProps {
  playing: boolean;
  onTogglePlay: () => void;
  speed: number;
  onSpeed: (s: number) => void;
  onReset: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  showOrbits: boolean;
  onToggleOrbits: () => void;
}

const PRESETS = [1, 10, 100];

function ControlDeck({
  playing,
  onTogglePlay,
  speed,
  onSpeed,
  onReset,
  showLabels,
  onToggleLabels,
  showOrbits,
  onToggleOrbits,
}: ControlDeckProps) {
  const sliderValue = speedToSlider(speed);

  const pill = (active: boolean) =>
    `rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-200 ${
      active
        ? "border-solar-500/50 bg-solar-500/15 text-solar-300"
        : "border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200"
    }`;

  return (
    <div className="deck-in absolute bottom-3 left-1/2 z-20 flex w-max max-w-[calc(100vw-1rem)] flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-xl border border-white/10 bg-[#0a0f1f]/95 px-4 py-3 shadow-[0_24px_70px_-24px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onReset}
          title="Сбросить время (R)"
          aria-label="Сбросить время"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-slate-300 transition-all duration-200 hover:rotate-[-40deg] hover:border-solar-500/50 hover:text-solar-300 active:scale-90"
        >
          <ResetIcon />
        </button>
        <button
          type="button"
          onClick={onTogglePlay}
          title={playing ? "Пауза (Пробел)" : "Воспроизвести (Пробел)"}
          aria-label={playing ? "Пауза" : "Воспроизвести"}
          className={`flex h-12 w-12 items-center justify-center rounded-full bg-solar-500 text-[#1a1204] transition-all duration-200 hover:bg-solar-400 active:scale-90 ${
            playing ? "playing-pulse" : ""
          }`}
        >
          {playing ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5 translate-x-[1px]" />}
        </button>
      </div>

      <div className="hidden h-9 w-px bg-white/10 sm:block" />

      <div className="flex items-center gap-3">
        <span className="text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
          Скорость
        </span>
        <input
          type="range"
          min={0}
          max={1000}
          value={sliderValue}
          onChange={(e) => onSpeed(sliderToSpeed(Number(e.target.value)))}
          className="speed w-32 sm:w-40"
          style={{ "--fill": `${sliderValue / 10}%` } as CSSProperties}
          aria-label="Скорость симуляции"
        />
        <span className="num w-11 text-right text-sm font-semibold text-solar-300">
          ×{formatSpeed(speed)}
        </span>
        <div className="hidden items-center gap-1 md:flex">
          {PRESETS.map((v) => {
            const active = Math.abs(speed - v) < v * 0.06;
            return (
              <button
                key={v}
                type="button"
                onClick={() => onSpeed(v)}
                className={`num rounded-full border px-2 py-0.5 text-[11px] transition-colors duration-200 ${
                  active
                    ? "border-solar-500/60 bg-solar-500/20 text-solar-300"
                    : "border-white/10 text-slate-500 hover:border-white/25 hover:text-slate-300"
                }`}
              >
                {v}×
              </button>
            );
          })}
        </div>
      </div>

      <div className="hidden h-9 w-px bg-white/10 sm:block" />

      <div className="flex items-center gap-1.5">
        <button type="button" onClick={onToggleLabels} className={pill(showLabels)}>
          Подписи
        </button>
        <button type="button" onClick={onToggleOrbits} className={pill(showOrbits)}>
          Орбиты
        </button>
      </div>
    </div>
  );
}

export default memo(ControlDeck);
