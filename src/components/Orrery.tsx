import { useState } from "react";
import { PLANETS, SUN_AS_PLANET, type Planet } from "../data/planets";

const C = 350; // центр сцены 700×700

interface OrreryProps {
  days: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  showLabels: boolean;
  showOrbits: boolean;
}

const rad = (deg: number) => (deg * Math.PI) / 180;

function positionOf(p: Planet, days: number) {
  const a = rad(p.initialAngle + (days / p.periodDays) * 360);
  return { x: C + p.orbitR * Math.cos(a), y: C + p.orbitR * Math.sin(a) };
}

export default function Orrery({ days, selectedId, onSelect, showLabels, showOrbits }: OrreryProps) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  const selected =
    selectedId === "sun" ? SUN_AS_PLANET : PLANETS.find((p) => p.id === selectedId) ?? null;
  const selPos = selected && selected.periodDays > 0 ? positionOf(selected, days) : null;

  return (
    <svg
      viewBox="0 0 700 700"
      className="h-full w-full overflow-visible select-none"
      onClick={() => onSelect(null)}
      role="img"
      aria-label="Модель Солнечной системы: Солнце и восемь планет на орбитах"
    >
      <defs>
        {PLANETS.map((p) => (
          <radialGradient key={p.id} id={`g-${p.id}`} cx="35%" cy="32%" r="78%">
            <stop offset="0%" stopColor={p.colorLight} />
            <stop offset="55%" stopColor={p.color} />
            <stop offset="100%" stopColor={p.colorDeep} />
          </radialGradient>
        ))}
        <radialGradient id="g-sun" cx="42%" cy="40%" r="72%">
          <stop offset="0%" stopColor="#fffbe9" />
          <stop offset="45%" stopColor="#ffd27a" />
          <stop offset="85%" stopColor="#f59b23" />
          <stop offset="100%" stopColor="#e07b00" />
        </radialGradient>
        <radialGradient id="sun-halo">
          <stop offset="0%" stopColor="rgba(255,196,92,0.5)" />
          <stop offset="55%" stopColor="rgba(255,160,60,0.16)" />
          <stop offset="100%" stopColor="rgba(255,150,50,0)" />
        </radialGradient>
        <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(150,120,70,0)" />
          <stop offset="22%" stopColor="#b3935c" />
          <stop offset="50%" stopColor="#ecd9a8" />
          <stop offset="78%" stopColor="#b3935c" />
          <stop offset="100%" stopColor="rgba(150,120,70,0)" />
        </linearGradient>
      </defs>

      {/* Орбиты */}
      {showOrbits &&
        PLANETS.map((p) => {
          const active = selectedId === p.id;
          return (
            <circle
              key={`o-${p.id}`}
              cx={C}
              cy={C}
              r={p.orbitR}
              fill="none"
              stroke={active ? p.color : "rgba(148,163,196,0.22)"}
              strokeWidth={active ? 1.5 : 1}
              strokeOpacity={active ? 0.9 : selectedId ? 0.45 : 1}
              strokeDasharray={active ? "5 7" : undefined}
              className={active ? "orbit-active" : undefined}
              style={{ transition: "stroke .3s ease, stroke-opacity .3s ease" }}
            />
          );
        })}

      {/* Линия «Солнце — выбранная планета» с расстоянием */}
      {selPos && selected && (
        <g pointerEvents="none">
          <line
            x1={C}
            y1={C}
            x2={selPos.x}
            y2={selPos.y}
            stroke={selected.color}
            strokeOpacity={0.45}
            strokeDasharray="2 6"
            strokeWidth={1.2}
          />
          <text
            className="dist-label"
            x={(C + selPos.x) / 2}
            y={(C + selPos.y) / 2 - 9}
            textAnchor="middle"
          >
            {selected.distanceMkm.toLocaleString("ru-RU")} млн км
          </text>
        </g>
      )}

      {/* Солнце */}
      <g
        className="sun-g"
        transform={`translate(${C} ${C})`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(selectedId === "sun" ? null : "sun");
        }}
        onMouseEnter={() => setHoverId("sun")}
        onMouseLeave={() => setHoverId(null)}
      >
        <circle r={88} fill="url(#sun-halo)" className="sun-halo slow" opacity={0.7} />
        <circle r={52} fill="url(#sun-halo)" className="sun-halo" />
        <circle r={27} fill="url(#g-sun)" className="sun-body" />
        {selectedId === "sun" && (
          <circle
            r={37}
            className="halo-ring"
            fill="none"
            stroke="#f5b942"
            strokeWidth={1.3}
            strokeDasharray="3 6"
          />
        )}
        {(showLabels || hoverId === "sun" || selectedId === "sun") && (
          <text className="orbit-label" y={-48} textAnchor="middle">
            Солнце
          </text>
        )}
        <circle r={42} fill="transparent" />
      </g>

      {/* Планеты */}
      {PLANETS.map((p) => {
        const { x, y } = positionOf(p, days);
        const active = selectedId === p.id;
        const hovered = hoverId === p.id;
        const dimmed = !!selectedId && !active;
        const ringRx = p.r * 2.05;
        const ringRy = p.r * 0.6;

        return (
          <g
            key={p.id}
            transform={`translate(${x} ${y})`}
            className="planet-g"
            opacity={dimmed ? 0.5 : 1}
            style={{ transition: "opacity .3s ease" }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(active ? null : p.id);
            }}
            onMouseEnter={() => setHoverId(p.id)}
            onMouseLeave={() => setHoverId(null)}
          >
            {/* увеличенная зона клика */}
            <circle r={p.r + 10} fill="transparent" />

            {active && (
              <circle
                r={p.r + 7.5}
                className="halo-ring"
                fill="none"
                stroke={p.color}
                strokeWidth={1.4}
                strokeDasharray="3 5"
              />
            )}
            {hovered && !active && (
              <circle r={p.r + 5} fill="none" stroke={p.color} strokeOpacity={0.55} strokeWidth={1} />
            )}

            {p.ringed && (
              <g transform="rotate(-18)" pointerEvents="none">
                <ellipse
                  rx={ringRx}
                  ry={ringRy}
                  fill="none"
                  stroke="url(#ring-grad)"
                  strokeWidth={p.r * 0.42}
                  opacity={0.85}
                />
              </g>
            )}

            <circle
              className="planet-body"
              r={p.r}
              fill={`url(#g-${p.id})`}
              stroke="rgba(255,255,255,0.28)"
              strokeWidth={0.5}
            />

            {p.ringed && (
              <g transform="rotate(-18)" pointerEvents="none">
                <path
                  d={`M ${-ringRx} 0 A ${ringRx} ${ringRy} 0 0 0 ${ringRx} 0`}
                  fill="none"
                  stroke="url(#ring-grad)"
                  strokeWidth={p.r * 0.42}
                  opacity={0.95}
                />
              </g>
            )}

            {/* Луна у Земли */}
            {p.id === "earth" &&
              (() => {
                const ma = rad((days / 27.3) * 360);
                const mx = 14 * Math.cos(ma);
                const my = 14 * Math.sin(ma);
                return (
                  <g pointerEvents="none">
                    <circle r={14} fill="none" stroke="rgba(207,214,228,0.22)" strokeWidth={0.6} />
                    <circle
                      cx={mx}
                      cy={my}
                      r={2.1}
                      fill="#cfd6e4"
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth={0.4}
                    />
                  </g>
                );
              })()}

            {(showLabels || active || hovered) && (
              <text className="orbit-label" y={-(p.r + 12)} textAnchor="middle">
                {p.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
