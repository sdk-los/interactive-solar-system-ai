import { useCallback, useEffect, useState } from "react";
import ControlDeck from "./components/ControlDeck";
import DossierStrip from "./components/DossierStrip";
import { OrbitGlyph } from "./components/Icons";
import InfoPanel from "./components/InfoPanel";
import Orrery from "./components/Orrery";
import Starfield from "./components/Starfield";
import { PLANETS, SUN_AS_PLANET } from "./data/planets";
import { useSimulation } from "./hooks/useSimulation";

export default function App() {
  const { playing, setPlaying, speed, setSpeed, days, reset } = useSimulation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);

  const handleSelect = useCallback((id: string | null) => setSelectedId(id), []);
  const handleDossierSelect = useCallback((id: string) => {
    setSelectedId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const closePanel = useCallback(() => setSelectedId(null), []);
  const togglePlay = useCallback(() => setPlaying((p) => !p), [setPlaying]);
  const toggleLabels = useCallback(() => setShowLabels((v) => !v), []);
  const toggleOrbits = useCallback(() => setShowOrbits((v) => !v), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "BUTTON" || tag === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.code === "KeyR") {
        reset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setPlaying, reset]);

  const selectedBody =
    selectedId === "sun" ? SUN_AS_PLANET : PLANETS.find((p) => p.id === selectedId) ?? null;

  const years = days / 365.25;

  return (
    <div className="font-body relative min-h-dvh text-slate-200">
      {/* ---- фоновые слои ---- */}
      <Starfield />
      <div className="nebula nebula-a -top-[18%] -left-[14%] h-[60vh] w-[58vw] bg-[radial-gradient(circle,rgba(38,84,124,0.30),transparent_65%)]" />
      <div className="nebula nebula-b -right-[12%] -bottom-[22%] h-[68vh] w-[52vw] bg-[radial-gradient(circle,rgba(146,84,28,0.16),transparent_65%)]" />
      <div className="nebula bottom-[8%] -left-[10%] h-[42vh] w-[40vw] bg-[radial-gradient(circle,rgba(28,106,106,0.13),transparent_60%)]" />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_52%,rgba(3,5,12,0.6)_100%)]" />

      <div className="relative z-10 flex min-h-dvh flex-col">
        {/* ---- шапка ---- */}
        <header className="mx-auto flex w-full max-w-7xl flex-wrap items-end justify-between gap-x-6 gap-y-4 px-4 pt-6 pb-2 md:px-8">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] text-solar-500 uppercase">
              <OrbitGlyph className="h-4 w-4" />
              Интерактивная модель
            </div>
            <h1 className="font-display mt-2 text-[26px] leading-tight font-extrabold text-white md:text-4xl">
              Солнечная <span className="text-solar-400">система</span>
            </h1>
            <p className="mt-1.5 hidden max-w-md text-sm leading-relaxed text-slate-400 md:block">
              Восемь планет в обращении вокруг Солнца. Нажмите на планету, чтобы открыть её досье.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] tracking-[0.22em] text-slate-500 uppercase">
                Симуляция · сутки
              </div>
              <div className="num font-display text-xl font-semibold text-solar-300 md:text-2xl">
                {Math.floor(days).toLocaleString("ru-RU")}
              </div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-right">
              <div className="text-[10px] tracking-[0.22em] text-slate-500 uppercase">
                Земных лет
              </div>
              <div className="num font-display text-xl font-semibold text-slate-200 md:text-2xl">
                {years.toFixed(1).replace(".", ",")}
              </div>
            </div>
            <span className="relative ml-1 flex h-2.5 w-2.5" title={playing ? "Идёт" : "Пауза"}>
              {playing && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-solar-500 opacity-60" />
              )}
              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                  playing ? "bg-solar-400" : "bg-slate-600"
                }`}
              />
            </span>
          </div>
        </header>

        {/* ---- сцена с моделью ---- */}
        <main className="mx-auto w-full max-w-7xl flex-1 px-2 md:px-6">
          <div className="relative h-[64vh] min-h-[520px] md:h-[calc(100dvh-150px)] md:min-h-[560px]">
            <Orrery
              days={days}
              selectedId={selectedId}
              onSelect={handleSelect}
              showLabels={showLabels}
              showOrbits={showOrbits}
            />
            <ControlDeck
              playing={playing}
              onTogglePlay={togglePlay}
              speed={speed}
              onSpeed={setSpeed}
              onReset={reset}
              showLabels={showLabels}
              onToggleLabels={toggleLabels}
              showOrbits={showOrbits}
              onToggleOrbits={toggleOrbits}
            />
            {selectedBody && (
              <InfoPanel body={selectedBody} days={days} onClose={closePanel} />
            )}
          </div>
        </main>

        {/* ---- каталог планет ---- */}
        <DossierStrip selectedId={selectedId} onSelect={handleDossierSelect} />

        {/* ---- подвал ---- */}
        <footer className="relative z-10 border-t border-white/5 bg-[#05070f]/80">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2.5 px-4 py-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between md:px-8">
            <p className="max-w-2xl leading-relaxed">
              Расстояния и размеры показаны не в масштабе — при точном масштабе планеты были бы
              невидимы. Орбиты упрощены до окружностей, но периоды обращения соблюдены.
            </p>
            <p className="num flex shrink-0 items-center gap-3">
              <span>
                <kbd>Пробел</kbd> — пауза
              </span>
              <span>
                <kbd>R</kbd> — сброс времени
              </span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
