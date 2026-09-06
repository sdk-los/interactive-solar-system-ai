import { memo, useEffect, useRef, useState, type CSSProperties } from "react";
import { PLANETS } from "../data/planets";
import { ArrowIcon } from "./Icons";

interface DossierStripProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

function DossierStrip({ selectedId, onSelect }: DossierStripProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-4 pb-12 md:px-8">
      <div
        ref={ref}
        className={`reveal ${visible ? "is-visible" : ""} flex flex-wrap items-end justify-between gap-3`}
      >
        <div>
          <div className="text-[11px] font-semibold tracking-[0.3em] text-solar-500 uppercase">
            Каталог · 8 объектов
          </div>
          <h2 className="font-display mt-2 text-2xl font-bold text-white md:text-3xl">
            Досье планет
          </h2>
        </div>
        <p className="hidden text-sm text-slate-500 sm:block">
          Нажмите на карточку, чтобы открыть полное досье в модели
        </p>
      </div>

      <div className="strip -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pt-1 pb-4 md:-mx-2 md:px-2">
        {PLANETS.map((p, i) => {
          const active = selectedId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              style={
                {
                  "--pc": p.color,
                  transitionDelay: `${i * 60}ms`,
                  borderColor: active ? `${p.color}99` : undefined,
                } as CSSProperties
              }
              className={`dossier-card reveal ${visible ? "is-visible" : ""} group relative w-[248px] shrink-0 snap-start rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.015] p-5 text-left`}
            >
              <div className="flex items-start justify-between">
                <span
                  className="font-display text-4xl font-black"
                  style={{ WebkitTextStroke: "1px rgba(148,163,196,0.38)", color: "transparent" }}
                >
                  0{p.order}
                </span>
                <span
                  className="mt-1.5 h-3.5 w-3.5 rounded-full"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, ${p.colorLight}, ${p.color} 58%, ${p.colorDeep})`,
                    boxShadow: `0 0 14px ${p.color}88`,
                  }}
                />
              </div>

              <div className="font-display mt-3 text-lg font-semibold text-white">{p.name}</div>
              <div className="text-[12.5px] text-slate-400 italic">{p.epithet}</div>

              <div className="mt-4 space-y-1.5 border-t border-white/5 pt-3 text-xs">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Диаметр</span>
                  <span className="num text-slate-200">{p.diameterKm.toLocaleString("ru-RU")} км</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">До Солнца</span>
                  <span className="num text-slate-200">
                    {p.distanceMkm.toLocaleString("ru-RU")} млн км
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Год</span>
                  <span className="num text-slate-200">{p.periodLabel}</span>
                </div>
              </div>

              <div
                className="mt-4 flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors"
                style={{ color: active ? p.color : undefined }}
              >
                <span className={active ? "" : "text-slate-500 group-hover:text-slate-300"}>
                  {active ? "Открыто в модели" : "Открыть досье"}
                </span>
                <span
                  className={
                    active ? "" : "text-slate-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-slate-300"
                  }
                  style={active ? { color: p.color } : undefined}
                >
                  <ArrowIcon />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default memo(DossierStrip);
