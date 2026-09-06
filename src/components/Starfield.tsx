import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; ph: number; sp: number; base: number };
type Meteor = { x: number; y: number; vx: number; vy: number; life: number; max: number };

/** Полноэкранное живое звёздное небо: мерцание + редкие «падающие звёзды». */
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let stars: Star[] = [];
    let meteor: Meteor | null = null;
    let nextMeteor = performance.now() + 3000;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 6200);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.25 + 0.3,
        ph: Math.random() * Math.PI * 2,
        sp: 0.4 + Math.random() * 1.4,
        base: 0.22 + Math.random() * 0.6,
      }));
    };

    const tick = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      const t = now / 1000;

      for (const s of stars) {
        const a = s.base * (0.55 + 0.45 * Math.sin(t * s.sp + s.ph));
        ctx.globalAlpha = Math.max(0.04, a);
        ctx.fillStyle = s.r > 1.05 ? "#cfe2ff" : "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!meteor && now > nextMeteor) {
        meteor = {
          x: Math.random() * w * 0.6,
          y: Math.random() * h * 0.3,
          vx: 330 + Math.random() * 260,
          vy: 120 + Math.random() * 100,
          life: 0,
          max: 0.9 + Math.random() * 0.5,
        };
      }
      if (meteor) {
        meteor.life += 1 / 60;
        meteor.x += meteor.vx / 60;
        meteor.y += meteor.vy / 60;
        const p = meteor.life / meteor.max;
        if (p >= 1 || meteor.x > w + 60 || meteor.y > h + 60) {
          meteor = null;
          nextMeteor = now + 4500 + Math.random() * 6000;
        } else {
          const alpha = Math.sin(Math.PI * p);
          const tailX = meteor.x - meteor.vx * 0.22;
          const tailY = meteor.y - meteor.vy * 0.22;
          const grad = ctx.createLinearGradient(tailX, tailY, meteor.x, meteor.y);
          grad.addColorStop(0, "rgba(255,255,255,0)");
          grad.addColorStop(1, `rgba(214,231,255,${0.85 * alpha})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(meteor.x, meteor.y);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" />;
}
