"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  Map,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";
import styles from "./ZombiesWebProductDemo.module.css";

type DemoMode = "kronorium" | "midround";

const timelineEvents = [
  {
    eyebrow: "Aether story",
    title: "Origins",
    date: "June 4th, 1918",
    location: "Excavation Site 64, France",
    note: "The Primis story begins inside a timeline already shaped by cycles, fractures, and intervention.",
  },
  {
    eyebrow: "Aether story",
    title: "Mob of the Dead",
    date: "December 31st, 1933",
    location: "Alcatraz Island, USA",
    note: "A self-contained purgatorial loop becomes a branch point with consequences beyond Alcatraz.",
  },
  {
    eyebrow: "Hidden record",
    title: "Richtofen's Lab",
    date: "1940s",
    location: "Richtofen's hidden laboratory",
    note: "A classified side record connects experiments and events that the main chronology only hints at.",
  },
  {
    eyebrow: "Aether story",
    title: "Blood of the Dead",
    date: "July 4th, 1941",
    location: "Alcatraz Island, USA",
    note: "The crew returns to Alcatraz and the cycle becomes a decision rather than a fixed destination.",
  },
  {
    eyebrow: "Dimension 63",
    title: "Shadows of Evil",
    date: "April 25th, 1944",
    location: "Morg City, USA",
    note: "A separate cast and dimension reconnect the larger story through a new route into the Aether.",
  },
] as const;

const shieldLocations = [
  {
    label: "Generator Room",
    detail: "Rested on the wall near the room entrance.",
    image: "https://zombies-web.vercel.app/images/parts/external-migrated/V6EK0sF.jpg",
  },
  {
    label: "Citadel Tunnels",
    detail: "Near the elevator on the bottom floor.",
    image: "https://zombies-web.vercel.app/images/parts/external-migrated/nDBt7ug.jpg",
  },
  {
    label: "Citadel Staircase",
    detail: "Leaning on a wall along the staircase.",
    image: "https://zombies-web.vercel.app/images/parts/external-migrated/GfaT17o.jpg",
  },
] as const;

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotionSnapshot() {
  return false;
}

export default function ZombiesWebProductDemo() {
  const [mode, setMode] = useState<DemoMode>("kronorium");
  const [activeEvent, setActiveEvent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [panOffset, setPanOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const contentRef = useRef<HTMLElement>(null);
  const dragState = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startOffset: 0,
  });
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
  const timelineRunning = playing && !reducedMotion;

  useEffect(() => {
    if (!timelineRunning || mode !== "kronorium") return;
    const timer = window.setInterval(() => {
      setActiveEvent((index) => (index + 1) % timelineEvents.length);
    }, 1800);
    return () => window.clearInterval(timer);
  }, [mode, timelineRunning]);

  const selectMode = (nextMode: DemoMode, reveal = false) => {
    setMode(nextMode);
    if (nextMode === "midround") setPlaying(false);
    if (reveal) {
      window.setTimeout(() => {
        contentRef.current?.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }, 0);
    }
  };

  const moveEvent = (direction: -1 | 1) => {
    setPlaying(false);
    setPanOffset(0);
    setActiveEvent(
      (index) => (index + direction + timelineEvents.length) % timelineEvents.length,
    );
  };

  const trackStyle = {
    transform: `translateX(calc(50% - ${activeEvent * 18.5 + 6.25}rem)) translateX(${panOffset}px)`,
  } as CSSProperties;

  const startTimelineDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("button, a")) return;

    setPlaying(false);
    setDragging(true);
    dragState.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startOffset: panOffset,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveTimelineDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active || dragState.current.pointerId !== event.pointerId) return;
    const nextOffset =
      dragState.current.startOffset + event.clientX - dragState.current.startX;
    setPanOffset(Math.max(-720, Math.min(720, nextOffset)));
  };

  const stopTimelineDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active || dragState.current.pointerId !== event.pointerId) return;
    dragState.current.active = false;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className={styles.demoShell}>
      <div className={styles.demoIntro}>
        <div>
          <span>Interactive product miniature</span>
          <h2>One project. Two products. Different moments.</h2>
          <p>
            The audience overlaps; the job, attention, and device context do not.
            The interface changes because the moment changes-not for visual novelty.
          </p>
        </div>
        <div className={styles.modeSwitch} role="group" aria-label="Choose product demo">
          <button
            type="button"
            aria-pressed={mode === "kronorium"}
            onClick={() => selectMode("kronorium")}
          >
            <BookOpen aria-hidden="true" />
            <span><small>Between sessions</small>Kronorium</span>
          </button>
          <button
            type="button"
            aria-pressed={mode === "midround"}
            onClick={() => selectMode("midround")}
          >
            <Map aria-hidden="true" />
            <span><small>During a live round</small>Field Manual</span>
          </button>
        </div>
      </div>

      {mode === "kronorium" ? (
        <section ref={contentRef} className={styles.kronoriumDemo} aria-label="Kronorium timeline demonstration">
          <header className={styles.demoHeader}>
            <div>
              <span>Ω / Aether timeline</span>
              <h3>Trace a story, not a list</h3>
            </div>
            <div className={styles.timelineControls}>
              <button type="button" onClick={() => moveEvent(-1)} aria-label="Previous lore event">
                <SkipBack aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setPlaying((value) => !value)}
                disabled={reducedMotion}
                aria-label={
                  reducedMotion
                    ? "Timeline animation disabled by reduced-motion preference"
                    : timelineRunning
                      ? "Pause timeline demonstration"
                      : "Play timeline demonstration"
                }
              >
                {timelineRunning ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
              </button>
              <button type="button" onClick={() => moveEvent(1)} aria-label="Next lore event">
                <SkipForward aria-hidden="true" />
              </button>
            </div>
          </header>

          <div
            className={styles.timelineViewport}
            data-dragging={dragging}
            onPointerDown={startTimelineDrag}
            onPointerMove={moveTimelineDrag}
            onPointerUp={stopTimelineDrag}
            onPointerCancel={stopTimelineDrag}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                setPlaying(false);
                setPanOffset((offset) => Math.min(720, offset + 72));
              }
              if (event.key === "ArrowRight") {
                event.preventDefault();
                setPlaying(false);
                setPanOffset((offset) => Math.max(-720, offset - 72));
              }
              if (event.key === "Home") {
                event.preventDefault();
                setPanOffset(0);
              }
            }}
            tabIndex={0}
            aria-label="Draggable Kronorium timeline. Drag left or right, or use the arrow keys to pan."
          >
            <span className={styles.dragHint}>Drag left or right to explore</span>
            <div className={styles.timelineTrack} data-dragging={dragging} style={trackStyle}>
              <div className={`${styles.branchPath} ${styles.originBranch}`} aria-hidden="true">
                <span className={styles.branchLead} />
                <span className={styles.branchStart} />
                <span className={styles.branchHorizontal} />
                <span className={styles.branchEnd} />
                <span className={styles.branchTail} />
              </div>
              <div className={`${styles.branchPath} ${styles.bloodBranch}`} aria-hidden="true">
                <span className={styles.branchLead} />
                <span className={styles.branchStart} />
                <span className={styles.branchHorizontal} />
                <span className={styles.branchEnd} />
                <span className={styles.branchTail} />
              </div>
              {timelineEvents.map((event, index) => (
                <button
                  type="button"
                  className={styles.timelineNode}
                  data-active={index === activeEvent}
                  aria-pressed={index === activeEvent}
                  onClick={() => {
                    setActiveEvent(index);
                    setPlaying(false);
                    setPanOffset(0);
                  }}
                  key={event.title}
                >
                  <small>{event.eyebrow}</small>
                  <strong>{event.title}</strong>
                  <span>{event.date}</span>
                  <em>{event.location}</em>
                </button>
              ))}
            </div>
            <div className={styles.timelineLegend} aria-hidden="true">
              <span>Aether story</span>
              <span>Branch crossing</span>
              <span>Cycle break</span>
            </div>
          </div>

          <div className={styles.eventReadout} aria-live="polite">
            <span>{String(activeEvent + 1).padStart(2, "0")} / {String(timelineEvents.length).padStart(2, "0")}</span>
            <div>
              <small>{timelineEvents[activeEvent].date} · {timelineEvents[activeEvent].location}</small>
              <h4>{timelineEvents[activeEvent].title}</h4>
              <p>{timelineEvents[activeEvent].note}</p>
            </div>
            <a href="https://zombies-web.vercel.app/kronorium" target="_blank" rel="noopener noreferrer">
              Open the full Kronorium <ExternalLink aria-hidden="true" />
            </a>
          </div>
        </section>
      ) : (
        <section ref={contentRef} className={styles.midroundDemo} aria-label="Mid-round map guide demonstration">
          <header className={styles.fieldHeader}>
            <div>
              <span>← All maps</span>
              <strong>[ Field manual ]</strong>
              <span>Mob of the Dead</span>
            </div>
            <small>One map · one task · no lore detour</small>
          </header>

          <div className={styles.guideHeading}>
            <span>Field manual - Equipment</span>
            <h3>Shield</h3>
            <p>
              Protects your back while stowed and works as a melee or
              distraction tool when equipped. The reference notes it breaks
              after roughly 15 hits.
            </p>
          </div>

          <div className={styles.locationGrid}>
            {shieldLocations.map((location) => (
              <article key={location.image}>
                <div
                  className={styles.locationImage}
                  role="img"
                  aria-label={`${location.label}: ${location.detail}`}
                  style={{ backgroundImage: `url("${location.image}")` }}
                />
                <span>{location.label}</span>
                <p>{location.detail}</p>
              </article>
            ))}
          </div>

          <div className={styles.guideFooter}>
            <div><strong>3</strong><span>spawn locations visible at once</span></div>
            <div><strong>~15</strong><span>hits before replacement</span></div>
            <a href="https://zombies-web.vercel.app/maps/mob-of-the-dead" target="_blank" rel="noopener noreferrer">
              Open the full map guide <ExternalLink aria-hidden="true" />
            </a>
          </div>
        </section>
      )}

      <div className={styles.comparison}>
        <button
          type="button"
          data-active={mode === "kronorium"}
          aria-pressed={mode === "kronorium"}
          onClick={() => selectMode("kronorium", true)}
        >
          <BookOpen aria-hidden="true" />
          <div><span>Kronorium</span><p>Navigate relationships, branches, eras, and consequences.</p></div>
          <ArrowRight aria-hidden="true" />
          <strong>Explore</strong>
        </button>
        <button
          type="button"
          data-active={mode === "midround"}
          aria-pressed={mode === "midround"}
          onClick={() => selectMode("midround", true)}
        >
          <Map aria-hidden="true" />
          <div><span>Mid-round</span><p>Find one part, route, or setup answer without leaving the game for long.</p></div>
          <ArrowRight aria-hidden="true" />
          <strong>Retrieve</strong>
        </button>
      </div>
    </div>
  );
}
