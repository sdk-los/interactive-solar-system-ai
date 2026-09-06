import type { Planet } from "../data/planets";
import { CloseIcon } from "./Icons";

const fmt = (n: number) => n.toLocaleString("ru-RU");

const MIN_D = Math.log(4879); // Меркурий
const MAX_D = Math.log(139820); // Юпитер

function pluralTimes(n: number): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "раз";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "раза";
  return "раз";
}

function ratioCaption(p: Planet): string {
  if (p.id === "earth") return "Эталон сравнения — сама Земля";
  const r = p.diameterKm / 12742;
  if (r >= 1) {
    const n = Math.max(1, Math.round(r));
    return `В ${n} ${pluralTimes(n)} больше Земли`;
  }
  const inv = 1 / r;
  const n = Math.round(inv * 10) / 10;
  return `В ${n.toLocaleString("ru-RU")} ${pluralTimes(Math.round(inv))} меньше Земли`;
}

interface InfoPanelProps {
  body: Planet;
  days: number;
  onClose: () => void;
}

export default function InfoPanel({ body, days, onClose }: InfoPanelProps) {
  const rows =
    body.customRows ??
    [
      { label: "Диаметр", value: `${fmt(body.diameterKm)} км` },
      {
        label: "Расстояние от Солнца",
        value: `${fmt(Math.round(body.distanceMkm * 10) / 10)} млн км · ${body.distanceAU.toLocaleString("ru-RU")} а.е.`,
      },
      { label: "Орбитальный период", value: body.periodLabel },
      { label: "Орбитальная скорость", value: body.orbitalSpeed },
      { label: "Длина суток", value: body.dayLength },
      { label: "Спутники", value: body.moons === 0 ? "нет" : fmt(body.moons) },
      { label: "Температура", value: body.tempC },
    ];

  const hasProgress = body.periodDays > 0;
  const revolutions = hasProgress ? Math.floor(days / body.periodDays) + 1 : 0;
  const pct = hasProgress ? ((days % body.periodDays) / body.periodDays) * 100 : 0;
  const sizePct = ((Math.log(body.diameterKm) - MIN_D) / (MAX_D - MIN_D)) * 100;

  return (
    <>
      {/* затемнение на мобильных, клик закрывает */}
      <button
        type="button"
        aria-label="Закрыть досье"
        onClick={onClose}
        className="fixed inset-0 z-30 cursor-default bg-black/45 md:hidden"
      />
      <aside
        key={body.id}
        className="panel-in fixed inset-x-3 bottom-3 z-40 max-h-[70vh] overflow-y-auto rounded-xl border bg-[#0a0f1f]/97 shadow-2xl md:absolute md:inset-x-auto md:top-3 md:right-3 md:bottom-3 md:max-h-none md:w-[360px]"
        style={{
          borderColor: `color-mix(in srgb, ${body.color} 35%, rgba(255,255,255,0.1))`,
        }}
        aria-label={`Досье: ${body.name}`}
      >
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${body.color}, transparent)`,
          }}
        />

        <div className="relative px-5 pt-4 pb-5">
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-colors hover:border-white/30 hover:text-white"
          >
            <CloseIcon />
          </button>

          <div className="flex items-center gap-2.5">
            <span
              className="num font-display rounded-md border px-2 py-0.5 text-xs font-semibold"
              style={{ color: body.color, borderColor: `${body.color}55` }}
            >
              {body.order === 0 ? "★" : `№ 0${body.order}`}
            </span>
            <span className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
              {body.kind}
            </span>
          </div>

          <h2 className="font-display mt-3 text-[26px] leading-tight font-bold text-white">
            {body.name}
          </h2>
          <p className="mt-0.5 text-sm text-slate-400 italic">
            {body.epithet} · <span className="tracking-[0.14em] uppercase not-italic">{body.latin}</span>
          </p>

          {hasProgress && (
            <div className="mt-4">
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-medium tracking-wider text-slate-500 uppercase">
                  Орбитальный прогресс
                </span>
                <span className="num text-slate-300">
                  оборот №{fmt(revolutions)} · {Math.floor(pct)}%
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: body.color }}
                />
              </div>
            </div>
          )}

          <dl className="mt-4 divide-y divide-white/5 border-t border-white/5">
            {rows.map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-4 py-2.5">
                <dt className="flex shrink-0 items-center gap-2 text-[13px] text-slate-500">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-[2px]"
                    style={{ background: body.color }}
                  />
                  {row.label}
                </dt>
                <dd className="num text-right text-[14px] font-medium text-slate-100">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          {body.id !== "sun" && (
            <div className="mt-4">
              <div className="text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                Диаметр в масштабе модели
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(4, sizePct)}%`,
                    background: `linear-gradient(90deg, ${body.colorDeep}, ${body.color})`,
                  }}
                />
              </div>
              <div className="mt-1.5 text-xs text-slate-400">{ratioCaption(body)}</div>
            </div>
          )}

          <div
            className="mt-5 border-l-2 px-4 py-3"
            style={{
              borderColor: body.color,
              background: `color-mix(in srgb, ${body.color} 9%, transparent)`,
            }}
          >
            <div
              className="text-[10px] font-bold tracking-[0.22em] uppercase"
              style={{ color: body.color }}
            >
              Знаете ли вы?
            </div>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-300">{body.fact}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
