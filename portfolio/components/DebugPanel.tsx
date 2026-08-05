"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Activity } from "lucide-react";

type Primitive = string | number | boolean | null | undefined;

const format = (value: Primitive): string => {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : value.toFixed(2);
  return value;
};

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-baseline justify-between gap-4 leading-5">
    <span className="text-[#555] shrink-0">{label}</span>
    <span className="text-green-400 tabular-nums truncate">{children}</span>
  </div>
);

/**
 * Live telemetry readout for the index sidebar. Built-in metrics (pointer, scroll, fps,
 * viewport, uptime) are sampled inside one rAF loop and written straight to the
 * DOM - they never re-render React. Anything passed via `...props` is plain
 * React state and renders normally.
 */
export default function DebugPanel({
  className = "",
  scrollSelector = "[data-portfolio-scroll]",
  ...props
}: {
  className?: string;
  scrollSelector?: string;
} & Record<string, Primitive>) {
  const [open, setOpen] = useState(true);

  const mouseRef = useRef<HTMLSpanElement>(null);
  const scrollRef = useRef<HTMLSpanElement>(null);
  const fpsRef = useRef<HTMLSpanElement>(null);
  const viewportRef = useRef<HTMLSpanElement>(null);
  const uptimeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const pointer = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const mounted = performance.now();
    let frames = 0;
    let lastFpsSample = mounted;
    let fps = 0;
    let raf = 0;

    // textContent is only touched when the rendered string actually changes,
    // so an idle panel costs nothing beyond the rAF tick itself.
    const write = (ref: React.RefObject<HTMLSpanElement | null>, next: string) => {
      if (ref.current && ref.current.textContent !== next) ref.current.textContent = next;
    };

    const sample = (now: number) => {
      const pane = document.querySelector<HTMLElement>(scrollSelector);
      const max = pane ? pane.scrollHeight - pane.clientHeight : 0;
      const progress = pane && max > 0 ? Math.round((pane.scrollTop / max) * 100) : 0;

      write(mouseRef, `${pointer.x}, ${pointer.y}`);
      write(scrollRef, `${progress}%`);
      write(fpsRef, String(fps));
      write(viewportRef, `${window.innerWidth}x${window.innerHeight}`);
      write(uptimeRef, `${((now - mounted) / 1000).toFixed(1)}s`);
    };

    const tick = (now: number) => {
      frames += 1;
      if (now - lastFpsSample >= 500) {
        fps = Math.round((frames * 1000) / (now - lastFpsSample));
        frames = 0;
        lastFpsSample = now;
      }
      sample(now);
      raf = requestAnimationFrame(tick);
    };

    sample(mounted); // seed so the panel never paints a frame of zeroes
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [scrollSelector]);

  return (
    <div
      className={`mt-auto -mx-3 bg-black/20 border border-white/10 font-mono text-[10px] select-none ${className}`}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-3 py-2 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 uppercase tracking-[0.2em] text-[#777] font-bold">
          <Activity className="w-3 h-3 text-green-500 animate-pulse" />
          debug
        </span>
        <ChevronDown
          className={`w-3 h-3 text-[#555] transition-transform duration-300 ${open ? "" : "-rotate-90"}`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="px-3 py-2.5 space-y-0.5">
            <Row label="pointer">
              <span ref={mouseRef}>0, 0</span>
            </Row>
            <Row label="scroll">
              <span ref={scrollRef}>0%</span>
            </Row>
            <Row label="fps">
              <span ref={fpsRef}>0</span>
            </Row>
            <Row label="viewport">
              <span ref={viewportRef}>0x0</span>
            </Row>
            <Row label="uptime">
              <span ref={uptimeRef}>0.0s</span>
            </Row>
            {Object.entries(props).map(([key, value]) => (
              <Row key={key} label={key}>
                {format(value)}
              </Row>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
