"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_LINE_COUNT = 100;
const MAX_SAFE_LINE_COUNT = 10_000;

type LineNumberGutterProps = {
  initialCount?: number;
  placement?: "absolute" | "flow";
};

function normalizeLineCount(value: number) {
  if (!Number.isFinite(value)) {
    return DEFAULT_LINE_COUNT;
  }

  return Math.min(MAX_SAFE_LINE_COUNT, Math.max(1, Math.ceil(value)));
}

export default function LineNumberGutter({
  initialCount = DEFAULT_LINE_COUNT,
  placement = "absolute",
}: LineNumberGutterProps) {
  const gutterRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(() => normalizeLineCount(initialCount));
  const lines = useMemo(
    () => Array.from({ length: lineCount }, (_, index) => index + 1),
    [lineCount],
  );

  useEffect(() => {
    const gutter = gutterRef.current;
    const layout = gutter?.closest<HTMLElement>("[data-line-number-layout]");
    const content = layout?.querySelector<HTMLElement>("[data-line-number-content]");
    const scrollViewport = layout?.parentElement;

    if (!gutter || !layout || !content) {
      return;
    }

    let animationFrame = 0;

    const updateLineCount = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const gutterStyles = window.getComputedStyle(gutter);
        const parsedLineHeight = Number.parseFloat(gutterStyles.lineHeight);
        const parsedPaddingTop = Number.parseFloat(gutterStyles.paddingTop);
        const lineHeight = Number.isFinite(parsedLineHeight) ? parsedLineHeight : 24;
        const paddingTop = Number.isFinite(parsedPaddingTop) ? parsedPaddingTop : 0;
        const contentHeight = Math.max(
          content.scrollHeight,
          content.getBoundingClientRect().height,
          scrollViewport?.clientHeight ?? 0,
        );
        const nextCount = normalizeLineCount((contentHeight - paddingTop) / lineHeight);

        setLineCount((currentCount) =>
          currentCount === nextCount ? currentCount : nextCount,
        );
      });
    };

    updateLineCount();

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateLineCount);

    resizeObserver?.observe(content);
    if (scrollViewport) {
      resizeObserver?.observe(scrollViewport);
    }
    window.addEventListener("resize", updateLineCount);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateLineCount);
    };
  }, []);

  // TODO(line-number-virtualization): Virtualize the gutter if a future post
  // needs more than MAX_SAFE_LINE_COUNT entries instead of growing the DOM.
  const placementClasses =
    placement === "flow" ? "flex-none" : "absolute left-0 top-0";

  return (
    <div
      ref={gutterRef}
      aria-hidden="true"
      className={`${placementClasses} opacity-50 w-10 py-4 flex flex-col items-end pr-2 border-r border-[#f8f8f81c] select-none bg-[#1F1F1F]`}
    >
      {lines.map((lineNumber) => (
        <span
          key={lineNumber}
          className="text-[10px] text-white leading-6 font-mono"
        >
          {lineNumber}
        </span>
      ))}
    </div>
  );
}
