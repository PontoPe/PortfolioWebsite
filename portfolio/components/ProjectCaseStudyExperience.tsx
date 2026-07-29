"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Code2,
  Copy,
  Database,
  ExternalLink,
  FileText,
  Gamepad2,
  Globe2,
  LockKeyhole,
  Maximize2,
  Minimize2,
  Network,
  Pause,
  Play,
  RotateCcw,
  Server,
  ShieldCheck,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react";
import type {
  ProjectCaseStudyProfile,
  ProjectNode,
  ProjectSource,
  ProjectThreat,
} from "@/lib/projectCaseStudyProfiles";
import ZombiesWebProductDemo from "./ZombiesWebProductDemo";
import styles from "./ProjectCaseStudyExperience.module.css";

type ToolId =
  | "experience"
  | "system"
  | "flow"
  | "threats"
  | "operations"
  | "source"
  | "evidence";
type SectionId =
  | "architecture"
  | "overview"
  | "security"
  | "decisions"
  | "operations"
  | "implementation"
  | "evidence"
  | "results";

type EvidenceView = {
  id: string;
  kind: "image" | "link" | "note";
  label: string;
  title: string;
  detail: string;
  src?: string;
  href?: string;
  alt?: string;
};

const nodeIcons = {
  public: Globe2,
  trusted: Server,
  internal: Database,
};

const sectionLabels: Record<SectionId, string> = {
  architecture: "Architecture",
  overview: "Context",
  security: "Security",
  decisions: "Decisions",
  operations: "Operations",
  implementation: "Implementation",
  evidence: "Evidence",
  results: "Results",
};

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ProjectTopology({
  nodes,
  selectedNodeId,
  highlightedNodeIds,
  onSelectNode,
  compact = false,
}: {
  nodes: ProjectNode[];
  selectedNodeId: string | null;
  highlightedNodeIds: string[];
  onSelectNode: (id: string) => void;
  compact?: boolean;
}) {
  const hasHighlight = highlightedNodeIds.length > 0;

  return (
    <div
      className={joinClasses(styles.topology, compact && styles.topologyCompact)}
      role="group"
      aria-label="Interactive system topology"
    >
      <div className={styles.zoneBand} aria-hidden="true">
        <span>Public</span>
        <span>Trusted boundary</span>
        <span>Internal only</span>
      </div>
      <div className={styles.nodeChain}>
        {nodes.map((node, index) => {
          const Icon = nodeIcons[node.zone];
          const selected = node.id === selectedNodeId;
          const highlighted = highlightedNodeIds.includes(node.id);
          const dimmed = hasHighlight && !highlighted && !selected;

          return (
            <div className={styles.nodeStep} key={node.id}>
              <button
                type="button"
                data-zone={node.zone}
                aria-pressed={selected}
                onClick={() => onSelectNode(node.id)}
                className={joinClasses(
                  styles.node,
                  selected && styles.nodeSelected,
                  highlighted && styles.nodeHighlighted,
                  dimmed && styles.nodeDimmed,
                )}
              >
                <Icon aria-hidden="true" />
                <span>
                  <small>{node.eyebrow}</small>
                  <strong>{node.label}</strong>
                </span>
              </button>
              {index < nodes.length - 1 && (
                <span className={styles.nodeArrow} aria-hidden="true">
                  <ArrowRight />
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.topologyLegend}>
        <span><i data-zone="public" />Public or untrusted</span>
        <span><i data-zone="trusted" />Authenticated boundary</span>
        <span><i data-zone="internal" />Internal-only dependency</span>
      </div>
    </div>
  );
}

function NodeInspector({ node }: { node: ProjectNode }) {
  return (
    <aside className={styles.nodeInspector} aria-label={`${node.label} inspector`}>
      <div className={styles.inspectorLead}>
        <span>{node.zone.replace("-", " ")}</span>
        <h3>{node.label}</h3>
        <p>{node.responsibility}</p>
      </div>
      <dl>
        <div><dt>Data</dt><dd>{node.data}</dd></div>
        <div><dt>Exposure</dt><dd>{node.exposure}</dd></div>
        <div><dt>Failure behavior</dt><dd>{node.failure}</dd></div>
      </dl>
    </aside>
  );
}

function CodePanel({
  project,
  copyStatus,
  onCopy,
}: {
  project: ProjectSource;
  copyStatus: string;
  onCopy: () => void;
}) {
  if (!project.codeSnippet) return null;

  return (
    <div className={styles.codePanel}>
      <div className={styles.codeBar}>
        <span>{project.codeSnippet.filename}</span>
        <button type="button" onClick={onCopy}>
          <Copy aria-hidden="true" />
          Copy
        </button>
      </div>
      <pre>
        <code>
          {project.codeSnippet.code.split("\n").map((line, index) => (
            <span key={`${project.codeSnippet?.filename}-${index}`}>
              <i>{String(index + 1).padStart(2, "0")}</i>
              <b>{line || " "}</b>
            </span>
          ))}
        </code>
      </pre>
      <div className={styles.codeCaption}>
        <span>Representative / sanitized excerpt</span>
        <p>{project.codeSnippet.caption}</p>
      </div>
      <p className={styles.srOnly} aria-live="polite">{copyStatus}</p>
    </div>
  );
}

export default function ProjectCaseStudyExperience({
  project,
  profile,
}: {
  project: ProjectSource;
  profile: ProjectCaseStudyProfile;
}) {
  const availableTools: Array<{ id: ToolId; label: string; short: string; icon: typeof Network }> = [
    ...(profile.slug === "zombiesweb"
      ? [{ id: "experience" as ToolId, label: "Product demo", short: "Demo", icon: Gamepad2 }]
      : []),
    { id: "system", label: "System", short: "Map", icon: Network },
    { id: "flow", label: "Flow", short: "Flow", icon: ArrowRight },
    { id: "threats", label: "Threats", short: "Risk", icon: ShieldCheck },
    { id: "operations", label: "Operations", short: "Ops", icon: RotateCcw },
    ...(!profile.hideSource && project.codeSnippet
      ? [{ id: "source" as ToolId, label: "Source", short: "Code", icon: Code2 }]
      : []),
    { id: "evidence", label: "Evidence", short: "Proof", icon: FileText },
  ];

  const sectionOrder = useMemo(
    () => ["architecture", ...profile.sectionOrder] as SectionId[],
    [profile.sectionOrder],
  );
  const [activeSection, setActiveSection] = useState<SectionId>("architecture");
  const [activeTool, setActiveTool] = useState<ToolId>(
    profile.slug === "zombiesweb" ? "experience" : "system",
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    profile.nodes[0]?.id ?? null,
  );
  const [flowIndex, setFlowIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [threatIndex, setThreatIndex] = useState(0);
  const [operationIndex, setOperationIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [announcement, setAnnouncement] = useState(`${profile.nodes[0]?.label ?? "System"} selected.`);
  const [evidenceView, setEvidenceView] = useState<EvidenceView | null>(null);

  const viewerRef = useRef<HTMLElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const expandRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const evidenceTriggerRef = useRef<HTMLButtonElement | null>(null);

  const selectedNode =
    profile.nodes.find((node) => node.id === selectedNodeId) ?? profile.nodes[0];
  const currentFlow = profile.flow[flowIndex] ?? profile.flow[0];
  const currentThreat = profile.threats[threatIndex] ?? profile.threats[0];
  const currentOperation = profile.operations[operationIndex] ?? profile.operations[0];

  const highlightedNodeIds = useMemo(() => {
    if (activeTool === "flow") return [...(currentFlow?.nodeIds ?? [])];
    if (activeTool === "threats") return [...(currentThreat?.nodeIds ?? [])];
    if (activeTool === "operations") return [...(currentOperation?.nodeIds ?? [])];
    return selectedNodeId ? [selectedNodeId] : [];
  }, [
    activeTool,
    currentFlow?.nodeIds,
    currentOperation?.nodeIds,
    currentThreat?.nodeIds,
    selectedNodeId,
  ]);

  const evidenceItems = useMemo<EvidenceView[]>(() => {
    const items: EvidenceView[] = [
      {
        id: `${profile.slug}-primary`,
        kind: "image",
        label: "Project visual",
        title: project.title,
        detail: `Primary project view for ${project.title}.`,
        src: project.image,
        alt: project.imageAlt || `${project.title} project view`,
      },
      ...profile.evidence.map((item, index) => ({
        id: `${profile.slug}-evidence-${index}`,
        kind: item.href ? ("link" as const) : ("note" as const),
        label: item.label,
        title: item.title,
        detail: item.detail,
        href: item.href,
      })),
      ...(project.gallery ?? []).map((item, index) => ({
        id: `${profile.slug}-gallery-${index}`,
        kind: "image" as const,
        label: "Project evidence",
        title: item.caption,
        detail: item.caption,
        src: item.src,
        alt: item.caption,
      })),
    ];
    return items;
  }, [profile.evidence, profile.slug, project.gallery, project.image, project.imageAlt, project.title]);

  const themeStyle = {
    "--case-accent": profile.theme.accent,
    "--case-accent-2": profile.theme.accent2,
    "--case-danger": profile.theme.danger,
    "--case-glow": profile.theme.glow,
    "--case-page": profile.theme.page,
    "--case-surface": profile.theme.surface,
  } as CSSProperties;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setFlowIndex((index) => {
        if (index >= profile.flow.length - 1) {
          setPlaying(false);
          return index;
        }
        return index + 1;
      });
    }, 900);
    return () => window.clearInterval(timer);
  }, [playing, profile.flow.length]);

  useEffect(() => {
    const elements = sectionOrder
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id as SectionId);
      },
      { rootMargin: "-18% 0px -70% 0px", threshold: [0.05, 0.3, 0.65] },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sectionOrder]);

  useEffect(() => {
    document.body.style.overflow = expanded ? "hidden" : "";
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (dialogRef.current?.open) {
        dialogRef.current.close();
        return;
      }
      if (expanded) {
        setExpanded(false);
        window.setTimeout(() => expandRef.current?.focus(), 0);
        return;
      }
      setSelectedNodeId(null);
      setAnnouncement("System selection cleared.");
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [expanded]);

  const navigateTo = (id: SectionId) => {
    const target = document.getElementById(id);
    if (!target) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.history.replaceState(null, "", `#${id}`);
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    setActiveSection(id);
  };

  const openViewer = (tool: ToolId = "system") => {
    setActiveTool(tool);
    navigateTo("architecture");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => viewerRef.current?.focus(), reduced ? 0 : 300);
  };

  const selectNode = (id: string) => {
    const node = profile.nodes.find((item) => item.id === id);
    setSelectedNodeId(id);
    if (node) setAnnouncement(`${node.label} selected. ${node.responsibility}`);
  };

  const selectFlow = (index: number) => {
    setFlowIndex(index);
    setPlaying(false);
    const step = profile.flow[index];
    setAnnouncement(`Flow step ${index + 1}: ${step.title}. ${step.summary}`);
  };

  const toggleFlow = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const last = profile.flow.length - 1;
      setFlowIndex(last);
      setAnnouncement(`Flow result: ${profile.flow[last].title}.`);
      return;
    }
    setPlaying(true);
  };

  const inspectThreat = (threat: ProjectThreat, index: number) => {
    setThreatIndex(index);
    setActiveTool("threats");
    setAnnouncement(`${threat.title} selected. Related system nodes highlighted.`);
  };

  const openThreatInViewer = (threat: ProjectThreat, index: number) => {
    inspectThreat(threat, index);
    openViewer("threats");
  };

  const openOperationInViewer = (index: number) => {
    setOperationIndex(index);
    setActiveTool("operations");
    setAnnouncement(`${profile.operations[index].question} opened in the operations viewer.`);
    openViewer("operations");
  };

  const copyCode = async () => {
    if (!project.codeSnippet) return;
    try {
      await navigator.clipboard.writeText(project.codeSnippet.code);
      setCopyStatus(`${project.codeSnippet.filename} copied.`);
    } catch {
      setCopyStatus("Copy is unavailable in this browser.");
    }
  };

  const openEvidence = (item: EvidenceView, trigger: HTMLButtonElement) => {
    evidenceTriggerRef.current = trigger;
    setEvidenceView(item);
    window.setTimeout(() => dialogRef.current?.showModal(), 0);
  };

  const cycleEvidence = (direction: -1 | 1) => {
    if (!evidenceView) return;
    const index = evidenceItems.findIndex((item) => item.id === evidenceView.id);
    const next = (index + direction + evidenceItems.length) % evidenceItems.length;
    setEvidenceView(evidenceItems[next]);
  };

  const renderEvidenceCards = (compact = false) => (
    <div className={joinClasses(styles.evidenceGrid, compact && styles.evidenceGridCompact)}>
      {evidenceItems.map((item) => (
        <button
          type="button"
          key={item.id}
          onClick={(event) => openEvidence(item, event.currentTarget)}
        >
          {item.kind === "image" && item.src ? (
            <span className={styles.evidenceThumb}>
              <Image src={item.src} alt="" fill sizes={compact ? "240px" : "(max-width: 800px) 100vw, 33vw"} />
            </span>
          ) : (
            <span className={styles.evidenceIcon}>
              {item.kind === "link" ? <ExternalLink aria-hidden="true" /> : <FileText aria-hidden="true" />}
            </span>
          )}
          <small>{item.label}</small>
          <strong>{item.title}</strong>
          <p>{item.detail}</p>
          <em>Inspect <ArrowRight aria-hidden="true" /></em>
        </button>
      ))}
    </div>
  );

  const renderTool = () => {
    if (activeTool === "experience" && profile.slug === "zombiesweb") {
      return (
        <div className={styles.experienceTool}>
          <ZombiesWebProductDemo />
        </div>
      );
    }

    if (activeTool === "system") {
      return (
        <div className={styles.systemTool}>
          <div className={styles.toolHeading}>
            <div><span>System map</span><h2>Boundaries and responsibilities</h2></div>
            <button
              type="button"
              onClick={() => {
                setSelectedNodeId(null);
                setAnnouncement("System selection cleared.");
              }}
            >
              <RotateCcw aria-hidden="true" />Reset
            </button>
          </div>
          <div className={styles.systemSplit}>
            <ProjectTopology
              nodes={profile.nodes}
              selectedNodeId={selectedNodeId}
              highlightedNodeIds={highlightedNodeIds}
              onSelectNode={selectNode}
            />
            {selectedNode ? (
              <NodeInspector node={selectedNode} />
            ) : (
              <aside className={styles.emptyInspector}>
                <Network aria-hidden="true" />
                <h3>Select a component</h3>
                <p>Inspect what it owns, what it handles, where it is exposed, and how it fails.</p>
              </aside>
            )}
          </div>
        </div>
      );
    }

    if (activeTool === "flow") {
      return (
        <div className={styles.flowTool}>
          <div className={styles.toolHeading}>
            <div><span>Flow player</span><h2>{currentFlow.title}</h2></div>
            <div className={styles.player}>
              <button type="button" disabled={flowIndex === 0} onClick={() => selectFlow(Math.max(0, flowIndex - 1))} aria-label="Previous flow step"><SkipBack /></button>
              <button type="button" onClick={toggleFlow} aria-label={playing ? "Pause flow" : "Play flow"}>{playing ? <Pause /> : <Play />}</button>
              <button type="button" disabled={flowIndex === profile.flow.length - 1} onClick={() => selectFlow(Math.min(profile.flow.length - 1, flowIndex + 1))} aria-label="Next flow step"><SkipForward /></button>
            </div>
          </div>
          <ProjectTopology
            compact
            nodes={profile.nodes}
            selectedNodeId={null}
            highlightedNodeIds={currentFlow.nodeIds}
            onSelectNode={selectNode}
          />
          <div className={styles.flowNarrative}>
            <span>{String(flowIndex + 1).padStart(2, "0")} / {String(profile.flow.length).padStart(2, "0")}</span>
            <div><h3>{currentFlow.title}</h3><p>{currentFlow.summary}</p></div>
          </div>
          <ol className={styles.flowSteps}>
            {profile.flow.map((step, index) => (
              <li key={step.title}>
                <button type="button" aria-current={index === flowIndex ? "step" : undefined} onClick={() => selectFlow(index)}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{step.title}</strong>
                </button>
              </li>
            ))}
          </ol>
        </div>
      );
    }

    if (activeTool === "threats") {
      return (
        <div className={styles.threatTool}>
          <div className={styles.toolHeading}>
            <div><span>Threat view</span><h2>{currentThreat.title}</h2></div>
          </div>
          <ProjectTopology
            compact
            nodes={profile.nodes}
            selectedNodeId={null}
            highlightedNodeIds={currentThreat.nodeIds}
            onSelectNode={selectNode}
          />
          <div className={styles.threatList}>
            {profile.threats.map((threat, index) => (
              <button
                type="button"
                key={threat.title}
                aria-pressed={index === threatIndex}
                onClick={() => inspectThreat(threat, index)}
              >
                <span>{threat.category}</span>
                <strong>{threat.title}</strong>
                <p>{threat.control}</p>
                <small>Residual: {threat.residual}</small>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (activeTool === "operations") {
      return (
        <div className={styles.operationsTool}>
          <div className={styles.toolHeading}>
            <div><span>Failure explorer</span><h2>{currentOperation.question}</h2></div>
          </div>
          <div className={styles.operationLayout}>
            <div className={styles.operationTabs} role="tablist" aria-label="Failure modes">
              {profile.operations.map((operation, index) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={index === operationIndex}
                  key={operation.question}
                  onClick={() => setOperationIndex(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {operation.question}
                  <ChevronRight aria-hidden="true" />
                </button>
              ))}
            </div>
            <div className={styles.operationDetail} role="tabpanel">
              <dl>
                <div><dt>Expected behavior</dt><dd>{currentOperation.behavior}</dd></div>
                <div><dt>Signal</dt><dd>{currentOperation.signal}</dd></div>
                <div><dt>Response</dt><dd>{currentOperation.response}</dd></div>
              </dl>
              <div className={styles.affectedNodes}>
                <span>Affected components</span>
                {currentOperation.nodeIds.map((id) => (
                  <button type="button" key={id} onClick={() => { setSelectedNodeId(id); setActiveTool("system"); }}>
                    {profile.nodes.find((node) => node.id === id)?.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTool === "source" && project.codeSnippet) {
      return (
        <div className={styles.sourceTool}>
          <div className={styles.toolHeading}>
            <div><span>Implementation</span><h2>One excerpt, one engineering argument</h2></div>
          </div>
          <CodePanel project={project} copyStatus={copyStatus} onCopy={copyCode} />
        </div>
      );
    }

    return (
      <div className={styles.evidenceTool}>
        <div className={styles.toolHeading}>
          <div><span>Evidence index</span><h2>What makes the work inspectable</h2></div>
        </div>
        {renderEvidenceCards(true)}
      </div>
    );
  };

  const renderSection = (section: ProjectCaseStudyProfile["sectionOrder"][number], index: number) => {
    const number = String(index + 2).padStart(2, "0");

    if (section === "overview") {
      const paragraphs = project.description
        .trim()
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
        .filter(Boolean);
      return (
        <section id="overview" className={styles.contentSection} key={section}>
          <div className={styles.sectionHeading}><span>{number} / Context</span><h2>The problem behind the system</h2></div>
          <div className={styles.overviewLayout}>
            <div className={styles.overviewCopy}>
              {profile.problem.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <details>
                <summary>Read the full project overview</summary>
                <div>{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
              </details>
            </div>
            <aside className={styles.constraintPanel}>
              <span>Constraints that shaped the design</span>
              <ul>{profile.constraints.map((constraint) => <li key={constraint}><Check aria-hidden="true" />{constraint}</li>)}</ul>
            </aside>
          </div>
        </section>
      );
    }

    if (section === "security") {
      return (
        <section id="security" className={styles.contentSection} key={section}>
          <div className={styles.sectionHeading}><span>{number} / Security</span><h2>Threats, controls, and what remains</h2><p>No control is presented as total risk elimination.</p></div>
          <div className={styles.securityMatrix}>
            {profile.threats.map((threat, threatPosition) => (
              <article key={threat.title}>
                <span>{threat.category}</span>
                <h3>{threat.title}</h3>
                <dl>
                  <div><dt>Control</dt><dd>{threat.control}</dd></div>
                  <div><dt>Residual risk</dt><dd>{threat.residual}</dd></div>
                </dl>
                <button type="button" onClick={() => openThreatInViewer(threat, threatPosition)}>Locate in system <ArrowRight /></button>
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (section === "decisions") {
      return (
        <section id="decisions" className={styles.contentSection} key={section}>
          <div className={styles.sectionHeading}><span>{number} / Decisions</span><h2>The trade-offs that shaped the build</h2></div>
          <div className={styles.decisionGrid}>
            {profile.decisions.map((decision) => (
              <details key={decision.title}>
                <summary>
                  <span>Decision</span>
                  <h3>{decision.title}</h3>
                  <p>{decision.summary}</p>
                  <ChevronRight aria-hidden="true" />
                </summary>
                <div>
                  <dl>
                    <div><dt>Reason</dt><dd>{decision.reason}</dd></div>
                    <div><dt>Trade-off</dt><dd>{decision.tradeoff}</dd></div>
                    <div><dt>Revisit when</dt><dd>{decision.revisit}</dd></div>
                  </dl>
                </div>
              </details>
            ))}
          </div>
        </section>
      );
    }

    if (section === "operations") {
      return (
        <section id="operations" className={styles.contentSection} key={section}>
          <div className={styles.sectionHeading}><span>{number} / Operations</span><h2>The unhappy path is part of the design</h2></div>
          <div className={styles.failureGrid}>
            {profile.operations.map((operation, operationPosition) => (
              <article key={operation.question}>
                <span>{String(operationPosition + 1).padStart(2, "0")}</span>
                <h3>{operation.question}</h3>
                <p>{operation.behavior}</p>
                <dl><div><dt>Signal</dt><dd>{operation.signal}</dd></div><div><dt>Response</dt><dd>{operation.response}</dd></div></dl>
                <button type="button" onClick={() => openOperationInViewer(operationPosition)}>Open failure explorer <ArrowRight /></button>
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (section === "implementation") {
      return (
        <section id="implementation" className={styles.contentSection} key={section}>
          <div className={styles.sectionHeading}><span>{number} / Implementation</span><h2>How the decisions appear in the build</h2></div>
          {!profile.hideSource && project.codeSnippet ? (
            <CodePanel project={project} copyStatus={copyStatus} onCopy={copyCode} />
          ) : (
            <div className={styles.stackArchitecture}>
              <div><span>Architecture profile</span><p>The page itself is generated from typed project data while interaction remains isolated to the system viewer.</p></div>
              <div><span>Delivery model</span><p>Static content remains readable and linkable without requiring the visitor to operate the interactive layer.</p></div>
            </div>
          )}
          <div className={styles.stackStrip}>{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
        </section>
      );
    }

    if (section === "evidence") {
      return (
        <section id="evidence" className={styles.contentSection} key={section}>
          <div className={styles.sectionHeading}><span>{number} / Evidence</span><h2>Proof, source, and inspectable outcomes</h2></div>
          {renderEvidenceCards()}
        </section>
      );
    }

    return (
      <section id="results" className={styles.contentSection} key={section}>
        <div className={styles.sectionHeading}><span>{number} / Results</span><h2>What the project demonstrates</h2></div>
        <div className={styles.resultGrid}>{profile.results.map((result) => <article key={result}><Check aria-hidden="true" /><p>{result}</p></article>)}</div>
        <div className={styles.retrospective}>
          <article><span>What worked</span><ul>{profile.retrospective.worked.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article><span>Next iteration</span><ul>{profile.retrospective.next.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article><span>Professional signal</span><ul>{profile.retrospective.demonstrates.map((item) => <li key={item}>{item}</li>)}</ul></article>
        </div>
      </section>
    );
  };

  return (
    <main
      className={styles.page}
      style={themeStyle}
      data-typography={profile.theme.typography}
      data-visual={profile.theme.visual}
      data-layout={profile.layout}
    >
      <a className={styles.skipLink} href="#project-main">Skip to project</a>
      <header className={styles.siteHeader}>
        <Link href="/"><ArrowLeft aria-hidden="true" /><span>pedromartins.tech</span></Link>
        <div><span aria-hidden="true" /><strong>{profile.status}</strong></div>
      </header>

      <section className={styles.hero} id="project-main" ref={summaryRef}>
        <div className={styles.heroCopy}>
          <div className={styles.heroEyebrow}><span>{project.category}</span><span>{project.date}</span></div>
          {profile.notice && <p className={styles.notice}><LockKeyhole aria-hidden="true" />{profile.notice}</p>}
          <h1>{project.title}</h1>
          {project.subtitle && <p className={styles.subtitle}>{project.subtitle}</p>}
          <p className={styles.outcome}>{profile.outcome}</p>
          <dl className={styles.heroMeta}>
            <div><dt>Role</dt><dd>{profile.role}</dd></div>
            <div><dt>Environment</dt><dd>{profile.environment}</dd></div>
            <div><dt>Ownership</dt><dd>{profile.ownership.join(" · ")}</dd></div>
          </dl>
          <div className={styles.heroActions}>
            <button
              type="button"
              onClick={() => openViewer(profile.slug === "zombiesweb" ? "experience" : "system")}
            >
              {profile.slug === "zombiesweb" ? "Run the product demo" : "Inspect the system"}
              <ArrowRight />
            </button>
            {project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer">Open live project <ExternalLink /></a>}
            {!project.demo && project.github && <a href={project.github} target="_blank" rel="noopener noreferrer">View source <ExternalLink /></a>}
          </div>
        </div>

        <div className={styles.heroVisual}>
          <Image
            src={project.image}
            alt={project.imageAlt || `${project.title} project visual`}
            fill
            priority
            loading="eager"
            sizes="(max-width: 900px) 100vw, 46vw"
          />
          <div className={styles.heroVisualShade} />
          <div className={styles.heroVisualMeta}>
            <span>{profile.vmName}</span>
            <strong>{profile.nodes.length} system boundaries</strong>
          </div>
          <div className={styles.heroMiniFlow}>
            {profile.nodes.slice(0, 4).map((node, index) => (
              <div key={node.id}>
                <span>{node.label}</span>
                {index < Math.min(profile.nodes.length, 4) - 1 && <ArrowRight aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.metrics} aria-label="Project facts">
        {profile.metrics.map((metric) => (
          <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span>{metric.note && <small>{metric.note}</small>}</div>
        ))}
      </section>

      <nav className={styles.caseNav} aria-label="Case study sections">
        <div className={styles.caseNavDesktop}>
          {sectionOrder.map((id) => (
            <button type="button" key={id} aria-current={activeSection === id ? "location" : undefined} onClick={() => navigateTo(id)}>
              <span aria-hidden="true" />{sectionLabels[id]}
            </button>
          ))}
        </div>
        <label className={styles.caseNavMobile}>
          <span>On this page</span>
          <select value={activeSection} onChange={(event) => navigateTo(event.target.value as SectionId)}>
            {sectionOrder.map((id) => <option key={id} value={id}>{sectionLabels[id]}</option>)}
          </select>
        </label>
      </nav>

      <div className={styles.body}>
        <section id="architecture" className={styles.viewerSection} ref={viewerRef} tabIndex={-1}>
          <div className={styles.sectionHeading}><span>01 / Interactive system</span><h2>Inspect what exists, what it trusts, and how it fails</h2></div>
          <div className={joinClasses(styles.viewerFrame, expanded && styles.viewerExpanded)}>
            <div className={styles.viewerHeader}>
              <div className={styles.windowDots} aria-hidden="true"><span /><span /><span /></div>
              <div className={styles.viewerIdentity}><strong>{profile.vmName}</strong><span>{profile.environment} · Read-only</span></div>
              <div className={styles.viewerActions}>
                <span className={styles.viewerStatus}><i />{profile.status}</span>
                <button type="button" ref={expandRef} aria-label={expanded ? "Restore workspace" : "Expand workspace"} onClick={() => setExpanded((value) => !value)}>
                  {expanded ? <Minimize2 /> : <Maximize2 />}<span>{expanded ? "Restore" : "Expand"}</span>
                </button>
                <button type="button" aria-label="Close workspace and return to project summary" onClick={() => { setExpanded(false); summaryRef.current?.scrollIntoView({ behavior: "smooth" }); }}><X /></button>
              </div>
            </div>
            <div className={styles.viewerBody}>
              <div className={styles.toolRail} role="tablist" aria-label="Project inspection tools">
                {availableTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button type="button" role="tab" key={tool.id} aria-selected={activeTool === tool.id} onClick={() => setActiveTool(tool.id)}>
                      <Icon aria-hidden="true" /><span>{tool.label}</span><small>{tool.short}</small>
                    </button>
                  );
                })}
              </div>
              <div className={styles.viewerViewport} role="tabpanel" tabIndex={0}>{renderTool()}</div>
            </div>
            <div className={styles.viewerFooter}>
              <span>READ-ONLY</span><span>{profile.environment}</span><span>tool: {activeTool}</span><span>selection: {selectedNodeId ?? "none"}</span>
            </div>
          </div>
          <p className={styles.srOnly} aria-live="polite">{announcement}</p>
        </section>

        {profile.sectionOrder.map((section, index) => renderSection(section, index))}

        <nav className={styles.projectPager} aria-label="Project navigation">
          <Link href={`/work/${profile.previousSlug}/`}><ArrowLeft /><span><small>Previous project</small>{profile.previousSlug}</span></Link>
          <Link href="/"><span><small>Return to</small>Selected work</span></Link>
          <Link href={`/work/${profile.nextSlug}/`}><span><small>Next project</small>{profile.nextSlug}</span><ArrowRight /></Link>
        </nav>
      </div>

      <dialog
        ref={dialogRef}
        className={styles.evidenceDialog}
        aria-labelledby="evidence-dialog-title"
        onCancel={(event) => { event.preventDefault(); dialogRef.current?.close(); }}
        onClose={() => { setEvidenceView(null); evidenceTriggerRef.current?.focus(); }}
      >
        {evidenceView && (
          <>
            <div className={styles.dialogHeader}>
              <div><span>{evidenceView.label}</span><h2 id="evidence-dialog-title">{evidenceView.title}</h2></div>
              <button type="button" aria-label="Close evidence dialog" onClick={() => dialogRef.current?.close()}><X /></button>
            </div>
            <div className={styles.dialogBody}>
              {evidenceView.kind === "image" && evidenceView.src && (
                <div className={styles.dialogImage}>
                  <Image src={evidenceView.src} alt={evidenceView.alt || evidenceView.title} fill sizes="90vw" />
                </div>
              )}
              <p>{evidenceView.detail}</p>
              {evidenceView.href && (
                <a href={evidenceView.href} target="_blank" rel="noopener noreferrer">Open evidence <ExternalLink /></a>
              )}
            </div>
            <div className={styles.dialogFooter}>
              <button type="button" onClick={() => cycleEvidence(-1)}><ArrowLeft />Previous</button>
              <span>{evidenceItems.findIndex((item) => item.id === evidenceView.id) + 1} / {evidenceItems.length}</span>
              <button type="button" onClick={() => cycleEvidence(1)}>Next<ArrowRight /></button>
            </div>
          </>
        )}
      </dialog>
    </main>
  );
}
