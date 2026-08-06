"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Activity } from "lucide-react";

type Primitive = string | number | boolean | null | undefined;

/**
 * Most important first. Short sidebars drop rows off the tail of this list, so
 * whatever stays visible is always the most useful readout for the space.
 */
const PRIORITY = ["pointer", "scroll", "clicks", "section", "viewport", "uptime", "theme", "fps"] as const;

const ROW_HEIGHT = 20; // text-[10px] + leading-5
const CONTENT_PADDING = 20; // py-2.5 on the rows container
const BREATHING_ROOM = 8;

/**
 * Below this the panel is not worth the space - it hides entirely rather than
 * showing a stub, so short screens get a clean sidebar instead of two rows.
 */
const MIN_ROWS = 4;

const format = (value: Primitive): string => {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : value.toFixed(2);
  return value;
};

const rank = (key: string) => {
  const index = (PRIORITY as readonly string[]).indexOf(key);
  return index === -1 ? PRIORITY.length : index; // unknown props sort to the tail
};

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-baseline justify-between gap-4 leading-5">
    <span className="text-[#555] shrink-0">{label}</span>
    <span className="text-green-400 tabular-nums truncate">{children}</span>
  </div>
);

/**
 * Live telemetry readout for the index sidebar. Built-in metrics (pointer, scroll,
 * clicks, fps, viewport, uptime) are sampled inside one rAF loop and written straight
 * to the DOM - they never re-render React. Anything passed via `...props` is plain
 * React state and renders normally.
 *
 * The row count adapts to the height left over in the sidebar, so the panel never
 * spills past the bottom on short screens.
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
  const [maxRows, setMaxRows] = useState<number>(PRIORITY.length);

  const wrapRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLButtonElement>(null);
  const mouseRef = useRef<HTMLSpanElement>(null);
  const scrollRef = useRef<HTMLSpanElement>(null);
  const clicksRef = useRef<HTMLSpanElement>(null);
  const fpsRef = useRef<HTMLSpanElement>(null);
  const viewportRef = useRef<HTMLSpanElement>(null);
  const uptimeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const pointer = { x: 0, y: 0 };
    let clicks = 0;

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const onClick = () => {
      clicks += 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("click", onClick, { passive: true });

    const mounted = performance.now();
    let frames = 0;
    let lastFpsSample = mounted;
    let fps = 0;
    let raf = 0;

    // textContent is only touched when the rendered string actually changes,
    // so an idle panel costs nothing beyond the rAF tick itself. Rows trimmed
    // for height have no ref attached, and write() simply skips them.
    const write = (ref: React.RefObject<HTMLSpanElement | null>, next: string) => {
      if (ref.current && ref.current.textContent !== next) ref.current.textContent = next;
    };

    const sample = (now: number) => {
      const pane = document.querySelector<HTMLElement>(scrollSelector);
      const max = pane ? pane.scrollHeight - pane.clientHeight : 0;
      const progress = pane && max > 0 ? Math.round((pane.scrollTop / max) * 100) : 0;

      write(mouseRef, `${pointer.x}, ${pointer.y}`);
      write(scrollRef, `${progress}%`);
      write(clicksRef, String(clicks));
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
      window.removeEventListener("click", onClick);
    };
  }, [scrollSelector]);

  // Fit the row list to whatever vertical space the sidebar has left. Measured
  // from the sibling above rather than from the panel itself, so growing or
  // shrinking the panel can never feed back into its own measurement.
  useEffect(() => {
    const el = wrapRef.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    let lastAvailable = Number.NaN;

    const measure = () => {
      const style = getComputedStyle(parent);
      const parentRect = parent.getBoundingClientRect();
      const previous = el.previousElementSibling;

      const bottomLimit = parentRect.bottom - parseFloat(style.paddingBottom || "0");
      const topLimit = previous
        ? previous.getBoundingClientRect().bottom
        : parentRect.top + parseFloat(style.paddingTop || "0");

      const header = headerRef.current?.offsetHeight ?? 30;
      const available = bottomLimit - topLimit - header - CONTENT_PADDING - BREATHING_ROOM;

      // Sub-pixel churn (font metrics, scrollbar widths) must not restart the
      // measure -> resize -> measure cycle.
      if (Math.abs(available - lastAvailable) < 1) return;
      lastAvailable = available;

      const raw = Math.max(0, Math.min(PRIORITY.length, Math.floor(available / ROW_HEIGHT)));
      const fits = raw < MIN_ROWS ? 0 : raw; // too cramped to be useful - hide instead

      setMaxRows((prev) => {
        if (fits === prev) return prev;
        // Shrink the moment a row stops fitting, but demand a spare half-row
        // before growing back. Without that gap a layout sitting exactly on a
        // row boundary flips between two counts every frame - the flashing.
        if (fits < prev) return fits;
        return available - fits * ROW_HEIGHT >= ROW_HEIGHT / 2 ? fits : prev;
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(parent);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const rows: { key: string; node: React.ReactNode }[] = [
    { key: "pointer", node: <span ref={mouseRef}>0, 0</span> },
    { key: "scroll", node: <span ref={scrollRef}>0%</span> },
    { key: "clicks", node: <span ref={clicksRef}>0</span> },
    { key: "viewport", node: <span ref={viewportRef}>0x0</span> },
    { key: "uptime", node: <span ref={uptimeRef}>0.0s</span> },
    { key: "fps", node: <span ref={fpsRef}>0</span> },
    ...Object.entries(props).map(([key, value]) => ({ key, node: format(value) })),
  ]
    .sort((a, b) => rank(a.key) - rank(b.key))
    .slice(0, maxRows);

  return (
    // Absolutely positioned on purpose. As a flex item its height fed back into
    // the sidebar's layout (flex-shrink squeezed the nav above, which freed room,
    // which grew the panel again) and the row count oscillated. Out of flow, the
    // measurement inputs cannot be moved by the thing being measured.
    // Stays mounted when hidden so it can measure its way back once space returns.
    <div
      ref={wrapRef}
      className={`absolute bottom-10 left-7 right-7 bg-black/20 border border-white/10 font-mono text-[10px] select-none ${maxRows === 0 ? "hidden" : ""} ${className}`}
    >
      <button
        ref={headerRef}
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
            {rows.map(({ key, node }) => (
              <Row key={key} label={key}>
                {node}
              </Row>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
