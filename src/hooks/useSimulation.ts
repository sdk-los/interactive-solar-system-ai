import { useCallback, useEffect, useRef, useState } from "react";
import { BASE_DAYS_PER_SEC } from "../data/planets";

const MIN_SPEED = 0.1;
const MAX_SPEED = 100;

/** Логарифмическая шкала: положение ползунка 0..1000 -> скорость 0,1×..100× */
export function sliderToSpeed(v: number): number {
  return MIN_SPEED * Math.pow(MAX_SPEED / MIN_SPEED, v / 1000);
}

export function speedToSlider(s: number): number {
  return Math.round((1000 * Math.log(s / MIN_SPEED)) / Math.log(MAX_SPEED / MIN_SPEED));
}

export function formatSpeed(s: number): string {
  const v = s < 1 ? s.toFixed(2) : s < 10 ? s.toFixed(1) : String(Math.round(s));
  return v.replace(".", ",");
}

export function useSimulation() {
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(10);
  const [days, setDays] = useState(0);

  const playingRef = useRef(playing);
  const speedRef = useRef(speed);
  playingRef.current = playing;
  speedRef.current = speed;

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (playingRef.current) {
        setDays((d) => d + dt * BASE_DAYS_PER_SEC * speedRef.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const reset = useCallback(() => setDays(0), []);

  return { playing, setPlaying, speed, setSpeed, days, reset };
}
