"use client";

import type { CSSProperties } from "react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Copy,
  Database,
  FileCode2,
  FileText,
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
import {
  testProjectCaseStudy,
  type ArchitectureEdge,
  type ArchitectureNode,
  type EvidenceItem,
  type SourceFile,
  type ThreatControl,
} from "@/lib/testProjectCaseStudy";
import styles from "./TestProjectCaseStudy.module.css";

type ToolId =
  | "topology"
  | "flow"
  | "threats"
  | "operations"
  | "source"
  | "evidence";

const project = testProjectCaseStudy;
const sectionLinks = [
  { id: "architecture", label: "Architecture" },
  { id: "problem", label: "Problem" },
  { id: "security", label: "Security" },
  { id: "decisions", label: "Decisions" },
  { id: "operations", label: "Operations" },
  { id: "implementation", label: "Implementation" },
  { id: "evidence", label: "Evidence" },
  { id: "results", label: "Results" },
] as const;

const tools: Array<{
  id: ToolId;
  label: string;
  shortLabel: string;
  icon: typeof Network;
}> = [
  { id: "topology", label: "Topology", shortLabel: "Map", icon: Network },
  { id: "flow", label: "Request flow", shortLabel: "Flow", icon: ArrowRight },
  { id: "threats", label: "Threats", shortLabel: "Threats", icon: ShieldCheck },
  { id: "operations", label: "Operations", shortLabel: "Ops", icon: RotateCcw },
  { id: "source", label: "Source", shortLabel: "Code", icon: FileCode2 },
  { id: "evidence", label: "Evidence", shortLabel: "Proof", icon: FileText },
];

const nodeIcons = {
  client: Globe2,
  edge: ShieldCheck,
  service: Server,
  queue: Network,
  worker: FileCode2,
  database: Database,
};

const zoneLabels = {
  public: "Public",
  trusted: "Trusted service",
  "internal-only": "Internal only",
};

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ArchitectureCanvas({
  highlightedNodeIds,
  selectedNodeId,
  selectedEdgeId,
  activeEdgeId,
  onSelectNode,
  onSelectEdge,
}: {
  highlightedNodeIds: readonly string[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  activeEdgeId?: string;
  onSelectNode: (nodeId: string) => void;
  onSelectEdge: (edgeId: string) => void;
}) {
  const hasHighlight = highlightedNodeIds.length > 0;

  return (
    <div className={styles.diagramFrame}>
      <div
        className={styles.diagram}
        role="group"
        aria-label="Interactive Aegis Relay architecture diagram"
      >
        <div className={styles.publicZone} aria-hidden="true">
          <span>Public zone</span>
        </div>
        <div className={styles.trustedZone} aria-hidden="true">
          <span>Trusted boundary</span>
        </div>
        <div className={styles.internalZone} aria-hidden="true">
          <span>Internal-only zone</span>
        </div>

        <svg
          className={styles.topologyLines}
          viewBox="0 0 1000 480"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <defs>
            <marker
              id="test-project-arrow"
              markerWidth="10"
              markerHeight="10"
              refX="8"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,6 L9,3 z" className={styles.arrowHead} />
            </marker>
            <marker
              id="test-project-block"
              markerWidth="12"
              markerHeight="12"
              refX="6"
              refY="6"
              orient="auto"
            >
              <path d="M2,2 L10,10 M10,2 L2,10" className={styles.blockMark} />
            </marker>
          </defs>
          {project.architecture.edges.map((edge) => {
            const isActive = edge.id === activeEdgeId || edge.id === selectedEdgeId;
            return (
              <path
                key={edge.id}
                d={edge.path}
                className={joinClasses(
                  styles.edge,
                  styles[`edge_${edge.status}`],
                  isActive && styles.edgeActive,
                )}
                markerEnd={
                  edge.status === "blocked"
                    ? "url(#test-project-block)"
                    : "url(#test-project-arrow)"
                }
              />
            );
          })}
        </svg>

        <div className={styles.nodeLayer}>
          {project.architecture.nodes.map((node) => {
            const Icon = nodeIcons[node.kind];
            const isSelected = node.id === selectedNodeId;
            const isHighlighted = highlightedNodeIds.includes(node.id);
            const isDimmed = hasHighlight && !isHighlighted && !isSelected;
            const nodeStyle = {
              "--node-x": `${node.x}%`,
              "--node-y": `${node.y}%`,
            } as CSSProperties;

            return (
              <button
                key={node.id}
                type="button"
                style={nodeStyle}
                className={joinClasses(
                  styles.architectureNode,
                  styles[`zone_${node.zone.replace("-", "_")}`],
                  isSelected && styles.nodeSelected,
                  isHighlighted && styles.nodeHighlighted,
                  isDimmed && styles.nodeDimmed,
                )}
                aria-pressed={isSelected}
                onClick={() => onSelectNode(node.id)}
              >
                <Icon aria-hidden="true" />
                <span>
                  <small>{node.eyebrow}</small>
                  <strong>{node.label}</strong>
                </span>
              </button>
            );
          })}
        </div>

        <div className={styles.blockedLabel} aria-hidden="true">
          <X />
          No direct client → audit route
        </div>
      </div>

      <div className={styles.diagramLegend} aria-label="Architecture legend">
        <span><i className={styles.legendAllowed} />Allowed authenticated flow</span>
        <span><i className={styles.legendInternal} />Internal dependency</span>
        <span><i className={styles.legendBlocked} />Blocked path</span>
      </div>

      <details className={styles.connectionDetails}>
        <summary>Inspect connections</summary>
        <div className={styles.connectionList}>
          {project.architecture.edges.map((edge) => (
            <button
              type="button"
              key={edge.id}
              className={joinClasses(
                styles.connectionButton,
                selectedEdgeId === edge.id && styles.connectionSelected,
              )}
              aria-pressed={selectedEdgeId === edge.id}
              onClick={() => onSelectEdge(edge.id)}
            >
              <span>{edge.label}</span>
              <small>{edge.protocol} · {edge.status}</small>
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}

function NodeInspector({ node }: { node: ArchitectureNode }) {
  return (
    <div className={styles.inspectorContent}>
      <div className={styles.inspectorHeading}>
        <span className={styles.zonePill}>{zoneLabels[node.zone]}</span>
        <h3>{node.label}</h3>
        <p>{node.responsibility}</p>
      </div>
      <dl className={styles.inspectorList}>
        <div>
          <dt>Exposure</dt>
          <dd>{node.exposure}</dd>
        </div>
        <div>
          <dt>Authentication</dt>
          <dd>{node.authentication}</dd>
        </div>
        <div>
          <dt>Data handled</dt>
          <dd>{node.dataHandled.join(" · ")}</dd>
        </div>
        <div>
          <dt>Failure behavior</dt>
          <dd>{node.failureBehavior}</dd>
        </div>
      </dl>
    </div>
  );
}

function EdgeInspector({ edge }: { edge: ArchitectureEdge }) {
  return (
    <div className={styles.inspectorContent}>
      <div className={styles.inspectorHeading}>
        <span className={styles.zonePill}>{edge.status}</span>
        <h3>{edge.label}</h3>
        <p>{edge.explanation}</p>
      </div>
      <dl className={styles.inspectorList}>
        <div>
          <dt>Path</dt>
          <dd>{edge.from} → {edge.to}</dd>
        </div>
        <div>
          <dt>Protocol</dt>
          <dd>{edge.protocol}</dd>
        </div>
        <div>
          <dt>Authentication</dt>
          <dd>{edge.authenticated ? "Required" : "No path available"}</dd>
        </div>
        <div>
          <dt>Trust boundary</dt>
          <dd>{edge.crossesTrustBoundary ? "Crosses a boundary" : "Remains in zone"}</dd>
        </div>
      </dl>
    </div>
  );
}

function SourceExplorer({
  compact = false,
  sourceId,
  calloutId,
  onSourceChange,
  onCalloutChange,
  onCopy,
  copyStatus,
}: {
  compact?: boolean;
  sourceId: string;
  calloutId: string;
  onSourceChange: (sourceId: string) => void;
  onCalloutChange: (file: SourceFile, calloutId: string) => void;
  onCopy: (source: SourceFile) => void;
  copyStatus: string;
}) {
  const activeFile =
    project.sourceFiles.find((file) => file.id === sourceId) ?? project.sourceFiles[0];
  const activeCallout =
    activeFile.callouts.find((callout) => callout.id === calloutId) ??
    activeFile.callouts[0];

  return (
    <div className={joinClasses(styles.sourceExplorer, compact && styles.sourceCompact)}>
      <div className={styles.fileTabs} role="tablist" aria-label="Source files">
        {project.sourceFiles.map((file) => (
          <button
            type="button"
            role="tab"
            aria-selected={file.id === activeFile.id}
            key={file.id}
            onClick={() => onSourceChange(file.id)}
          >
            {file.label}
          </button>
        ))}
        <button
          type="button"
          className={styles.copyButton}
          onClick={() => onCopy(activeFile)}
          aria-label={`Copy ${activeFile.label}`}
        >
          <Copy aria-hidden="true" />
          Copy
        </button>
      </div>

      <div className={styles.sourceLayout}>
        <div className={styles.codeWindow}>
          <div className={styles.codeTitlebar}>
            <span>{activeFile.language}</span>
            <span>fictional · sanitized</span>
          </div>
          <pre>
            <code>
              {activeFile.code.split("\n").map((line, index) => {
                const lineNumber = index + 1;
                const isHighlighted =
                  lineNumber >= activeCallout.lineStart &&
                  lineNumber <= activeCallout.lineEnd;
                return (
                  <span
                    key={`${activeFile.id}-${lineNumber}`}
                    className={isHighlighted ? styles.codeLineHighlighted : undefined}
                  >
                    <i>{String(lineNumber).padStart(2, "0")}</i>
                    <b>{line || " "}</b>
                  </span>
                );
              })}
            </code>
          </pre>
        </div>
        <div className={styles.codeCallouts}>
          {activeFile.callouts.map((callout, index) => (
            <button
              type="button"
              key={callout.id}
              className={joinClasses(
                callout.id === activeCallout.id && styles.calloutSelected,
              )}
              aria-pressed={callout.id === activeCallout.id}
              onClick={() => onCalloutChange(activeFile, callout.id)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{callout.title}</strong>
              <small>{callout.detail}</small>
              <em>Lines {callout.lineStart}–{callout.lineEnd}</em>
            </button>
          ))}
        </div>
      </div>
      <p className={styles.srStatus} aria-live="polite">{copyStatus}</p>
    </div>
  );
}

export default function TestProjectCaseStudy() {
  const [activeTool, setActiveTool] = useState<ToolId>("topology");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("gateway");
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [currentFlowStep, setCurrentFlowStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedThreatId, setSelectedThreatId] = useState<string | null>(
    "direct-store-probing",
  );
  const [threatFilter, setThreatFilter] = useState<string>("All");
  const [selectedOperation, setSelectedOperation] = useState(0);
  const [sourceId, setSourceId] = useState(project.sourceFiles[0].id);
  const [calloutId, setCalloutId] = useState(project.sourceFiles[0].callouts[0].id);
  const [copyStatus, setCopyStatus] = useState("");
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [activeSection, setActiveSection] = useState("architecture");
  const [expanded, setExpanded] = useState(false);
  const [announcement, setAnnouncement] = useState(
    "Intake API selected. Trusted service.",
  );

  const vmRef = useRef<HTMLElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const expandButtonRef = useRef<HTMLButtonElement>(null);
  const evidenceDialogRef = useRef<HTMLDialogElement>(null);
  const evidenceTriggerRef = useRef<HTMLButtonElement | null>(null);

  const selectedNode =
    project.architecture.nodes.find((node) => node.id === selectedNodeId) ??
    project.architecture.nodes[2];
  const selectedEdge =
    project.architecture.edges.find((edge) => edge.id === selectedEdgeId) ?? null;
  const flowStep = project.flow[currentFlowStep];
  const selectedThreat =
    project.threats.find((threat) => threat.id === selectedThreatId) ??
    project.threats[0];
  const activeOperation = project.operations[selectedOperation];
  const activeFile =
    project.sourceFiles.find((file) => file.id === sourceId) ?? project.sourceFiles[0];
  const activeCallout =
    activeFile.callouts.find((callout) => callout.id === calloutId) ??
    activeFile.callouts[0];

  const highlightedNodeIds = useMemo(() => {
    if (activeTool === "flow") return flowStep.nodeIds;
    if (activeTool === "threats") return selectedThreat.nodeIds;
    if (activeTool === "operations") return activeOperation.nodeIds;
    if (activeTool === "source") return activeCallout.nodeIds;
    if (activeTool === "evidence" && selectedEvidence) return selectedEvidence.nodeIds;
    return selectedNodeId ? [selectedNodeId] : [];
  }, [
    activeCallout.nodeIds,
    activeOperation.nodeIds,
    activeTool,
    flowStep.nodeIds,
    selectedEvidence,
    selectedNodeId,
    selectedThreat.nodeIds,
  ]);

  const filteredThreats = useMemo(
    () =>
      threatFilter === "All"
        ? project.threats
        : project.threats.filter((threat) => threat.category === threatFilter),
    [threatFilter],
  );

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setCurrentFlowStep((step) => {
        if (step >= project.flow.length - 1) {
          setIsPlaying(false);
          return step;
        }
        return step + 1;
      });
    }, 900);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    const targets = sectionLinks
      .map((section) => document.getElementById(section.id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target.id) return;
        setActiveSection(visible.target.id);
      },
      { rootMargin: "-20% 0px -68% 0px", threshold: [0.05, 0.25, 0.6] },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (evidenceDialogRef.current?.open) {
        evidenceDialogRef.current.close();
        return;
      }
      if (expanded) {
        setExpanded(false);
        window.setTimeout(() => expandButtonRef.current?.focus(), 0);
        return;
      }
      if (selectedEdgeId || selectedNodeId) {
        setSelectedEdgeId(null);
        setSelectedNodeId(null);
        setAnnouncement("Architecture selection cleared.");
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [expanded, selectedEdgeId, selectedNodeId]);

  useEffect(() => {
    document.body.style.overflow = expanded ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [expanded]);

  const selectNode = (nodeId: string) => {
    const node = project.architecture.nodes.find((item) => item.id === nodeId);
    setSelectedNodeId(nodeId);
    setSelectedEdgeId(null);
    if (node) {
      setAnnouncement(`${node.label} selected. ${zoneLabels[node.zone]}.`);
    }
  };

  const selectEdge = (edgeId: string) => {
    const edge = project.architecture.edges.find((item) => item.id === edgeId);
    setSelectedEdgeId(edgeId);
    setSelectedNodeId(null);
    if (edge) setAnnouncement(`${edge.label} selected. ${edge.explanation}`);
  };

  const selectFlowStep = (index: number) => {
    setCurrentFlowStep(index);
    setIsPlaying(false);
    const step = project.flow[index];
    setAnnouncement(`Flow step ${index + 1}: ${step.title}. ${step.summary}`);
  };

  const toggleFlowPlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const lastStep = project.flow.length - 1;
      setCurrentFlowStep(lastStep);
      setAnnouncement(
        `Reduced motion flow result: ${project.flow[lastStep].title}. ${project.flow[lastStep].summary}`,
      );
      return;
    }
    setIsPlaying(true);
  };

  const selectThreat = (threat: ThreatControl) => {
    setSelectedThreatId(threat.id);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setAnnouncement(`${threat.threat} selected. Affected components highlighted.`);
  };

  const openVmTool = (tool: ToolId) => {
    setActiveTool(tool);
    if (tool === "flow") {
      setAnnouncement(`Request flow open. Step ${currentFlowStep + 1} of ${project.flow.length}.`);
    } else if (tool === "threats") {
      setAnnouncement("Threat view open. Select a threat to cross-highlight the topology.");
    } else {
      setAnnouncement(`${tools.find((item) => item.id === tool)?.label} tool open.`);
    }
  };

  const openEvidence = (item: EvidenceItem, trigger: HTMLButtonElement) => {
    evidenceTriggerRef.current = trigger;
    setSelectedEvidence(item);
    window.setTimeout(() => evidenceDialogRef.current?.showModal(), 0);
  };

  const closeEvidence = () => {
    evidenceDialogRef.current?.close();
  };

  const cycleEvidence = (direction: -1 | 1) => {
    if (!selectedEvidence) return;
    const currentIndex = project.evidence.findIndex(
      (item) => item.id === selectedEvidence.id,
    );
    const nextIndex =
      (currentIndex + direction + project.evidence.length) % project.evidence.length;
    setSelectedEvidence(project.evidence[nextIndex]);
  };

  const copySource = async (source: SourceFile) => {
    try {
      await navigator.clipboard.writeText(source.code);
      setCopyStatus(`${source.label} copied.`);
    } catch {
      setCopyStatus("Copy is unavailable in this browser.");
    }
  };

  const changeSource = (nextSourceId: string) => {
    const nextFile =
      project.sourceFiles.find((file) => file.id === nextSourceId) ??
      project.sourceFiles[0];
    setSourceId(nextFile.id);
    setCalloutId(nextFile.callouts[0].id);
    setAnnouncement(`${nextFile.label} opened in the source explorer.`);
  };

  const selectCallout = (file: SourceFile, nextCalloutId: string) => {
    const callout = file.callouts.find((item) => item.id === nextCalloutId);
    setSourceId(file.id);
    setCalloutId(nextCalloutId);
    if (callout) {
      setAnnouncement(`${callout.title}. Lines ${callout.lineStart} through ${callout.lineEnd}.`);
    }
  };

  const navigateToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.history.replaceState(null, "", `#${id}`);
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    setActiveSection(id);
  };

  const openWorkspace = () => {
    navigateToSection("architecture");
    window.setTimeout(() => vmRef.current?.focus(), 350);
  };

  const inspectThreatInVm = (threat: ThreatControl) => {
    selectThreat(threat);
    setActiveTool("threats");
    openWorkspace();
  };

  const renderToolPanel = () => {
    if (activeTool === "topology") {
      return (
        <div className={styles.topologyTool}>
          <div className={styles.toolHeader}>
            <div>
              <span>Architecture mode</span>
              <h2>Exposure and trust boundaries</h2>
            </div>
            <button
              type="button"
              className={styles.resetButton}
              onClick={() => {
                setSelectedNodeId(null);
                setSelectedEdgeId(null);
                setAnnouncement("Architecture selection cleared.");
              }}
            >
              <RotateCcw aria-hidden="true" />
              Reset
            </button>
          </div>
          <div className={styles.workspaceSplit}>
            <ArchitectureCanvas
              highlightedNodeIds={highlightedNodeIds}
              selectedNodeId={selectedNodeId}
              selectedEdgeId={selectedEdgeId}
              onSelectNode={selectNode}
              onSelectEdge={selectEdge}
            />
            <aside className={styles.inspector} aria-label="Architecture inspector">
              {selectedEdge ? (
                <EdgeInspector edge={selectedEdge} />
              ) : selectedNodeId ? (
                <NodeInspector node={selectedNode} />
              ) : (
                <div className={styles.emptyInspector}>
                  <Network aria-hidden="true" />
                  <h3>Select a component</h3>
                  <p>Use the map or the connection list to inspect responsibility, exposure, and failure behavior.</p>
                </div>
              )}
            </aside>
          </div>
          <details className={styles.textFallback}>
            <summary>Read the architecture as text</summary>
            <ol>
              {project.architecture.textFallback.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </details>
        </div>
      );
    }

    if (activeTool === "flow") {
      return (
        <div className={styles.flowTool}>
          <div className={styles.toolHeader}>
            <div>
              <span>Request flow</span>
              <h2>Follow one synthetic event</h2>
            </div>
            <div className={styles.playerControls} aria-label="Flow playback controls">
              <button
                type="button"
                onClick={() => selectFlowStep(Math.max(0, currentFlowStep - 1))}
                disabled={currentFlowStep === 0}
                aria-label="Previous flow step"
              >
                <SkipBack aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={toggleFlowPlayback}
                aria-label={isPlaying ? "Pause flow" : "Play flow"}
              >
                {isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
              </button>
              <button
                type="button"
                onClick={() =>
                  selectFlowStep(Math.min(project.flow.length - 1, currentFlowStep + 1))
                }
                disabled={currentFlowStep === project.flow.length - 1}
                aria-label="Next flow step"
              >
                <SkipForward aria-hidden="true" />
              </button>
              <button type="button" onClick={() => selectFlowStep(0)}>
                Reset
              </button>
            </div>
          </div>
          <div className={styles.flowLayout}>
            <ArchitectureCanvas
              highlightedNodeIds={flowStep.nodeIds}
              activeEdgeId={flowStep.edgeId}
              selectedNodeId={null}
              selectedEdgeId={null}
              onSelectNode={selectNode}
              onSelectEdge={selectEdge}
            />
            <div className={styles.flowSteps}>
              <div className={styles.flowNarrative}>
                <span>Step {currentFlowStep + 1} of {project.flow.length}</span>
                <h3>{flowStep.title}</h3>
                <p>{flowStep.summary}</p>
              </div>
              <ol>
                {project.flow.map((step, index) => (
                  <li key={step.id}>
                    <button
                      type="button"
                      aria-current={index === currentFlowStep ? "step" : undefined}
                      onClick={() => selectFlowStep(index)}
                    >
                      <span>{step.number}</span>
                      <strong>{step.title}</strong>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      );
    }

    if (activeTool === "threats") {
      const categories = ["All", "Network", "Input", "Identity", "Availability"];
      return (
        <div className={styles.threatTool}>
          <div className={styles.toolHeader}>
            <div>
              <span>Threat view</span>
              <h2>Control placement and residual risk</h2>
            </div>
          </div>
          <ArchitectureCanvas
            highlightedNodeIds={selectedThreat.nodeIds}
            selectedNodeId={null}
            selectedEdgeId={null}
            onSelectNode={selectNode}
            onSelectEdge={selectEdge}
          />
          <div className={styles.filterRow} aria-label="Filter threats by category">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                aria-pressed={category === threatFilter}
                onClick={() => setThreatFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className={styles.threatCards}>
            {filteredThreats.map((threat) => (
              <button
                type="button"
                key={threat.id}
                aria-pressed={threat.id === selectedThreat.id}
                onClick={() => selectThreat(threat)}
              >
                <span>{threat.category}</span>
                <strong>{threat.threat}</strong>
                <small>{threat.control}</small>
                <em>Residual: {threat.residualRisk}</em>
              </button>
            ))}
          </div>
          <p className={styles.filterStatus} aria-live="polite">
            Showing {filteredThreats.length} of {project.threats.length} threats.
          </p>
        </div>
      );
    }

    if (activeTool === "operations") {
      return (
        <div className={styles.operationsTool}>
          <div className={styles.toolHeader}>
            <div>
              <span>Failure explorer</span>
              <h2>What happens when a dependency fails?</h2>
            </div>
          </div>
          <div className={styles.operationsLayout}>
            <div className={styles.operationQuestions} role="tablist" aria-label="Failure modes">
              {project.operations.map((operation, index) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={index === selectedOperation}
                  key={operation.question}
                  onClick={() => {
                    setSelectedOperation(index);
                    setAnnouncement(`${operation.question} ${operation.behavior}`);
                  }}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {operation.question}
                  <ChevronRight aria-hidden="true" />
                </button>
              ))}
            </div>
            <div className={styles.operationDetail} role="tabpanel">
              <span>Selected failure mode</span>
              <h3>{activeOperation.question}</h3>
              <dl>
                <div><dt>Expected behavior</dt><dd>{activeOperation.behavior}</dd></div>
                <div><dt>Monitoring signal</dt><dd>{activeOperation.signal}</dd></div>
                <div><dt>Recovery action</dt><dd>{activeOperation.recovery}</dd></div>
                <div><dt>Known limitation</dt><dd>{activeOperation.limitation}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      );
    }

    if (activeTool === "source") {
      return (
        <div className={styles.sourceTool}>
          <div className={styles.toolHeader}>
            <div>
              <span>Sanitized source</span>
              <h2>Implementation tied to decisions</h2>
            </div>
          </div>
          <SourceExplorer
            compact
            sourceId={sourceId}
            calloutId={calloutId}
            onSourceChange={changeSource}
            onCalloutChange={selectCallout}
            onCopy={copySource}
            copyStatus={copyStatus}
          />
        </div>
      );
    }

    return (
      <div className={styles.evidenceTool}>
        <div className={styles.toolHeader}>
          <div>
            <span>Evidence mount</span>
            <h2>What would prove each claim?</h2>
          </div>
        </div>
        <div className={styles.evidenceGrid}>
          {project.evidence.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={(event) => openEvidence(item, event.currentTarget)}
            >
              <FileText aria-hidden="true" />
              <span>{item.type}</span>
              <strong>{item.title}</strong>
              <small>{item.caption}</small>
              <em>Inspect artifact <ArrowRight aria-hidden="true" /></em>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#main-content">Skip to case study</a>

      <header className={styles.siteHeader}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft aria-hidden="true" />
          <span>pedromartins.tech</span>
        </Link>
        <div className={styles.prototypeBadge}>
          <span aria-hidden="true" />
          Isolated test route
        </div>
      </header>

      <section className={styles.hero} id="main-content" ref={summaryRef}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrowRow}>
            <span>{project.category}</span>
            <span>{project.dates}</span>
            <span>{project.status}</span>
          </div>
          <div className={styles.fictionNotice}>
            <ShieldCheck aria-hidden="true" />
            <p>
              <strong>Fictional system.</strong> This page tests the presentation and
              interactions only. It contains no production claims, identifiers, or live data.
            </p>
          </div>
          <h1>{project.title}</h1>
          <p className={styles.heroOutcome}>{project.oneLineOutcome}</p>
          <dl className={styles.heroMeta}>
            <div><dt>Role</dt><dd>{project.role}</dd></div>
            <div><dt>Environment</dt><dd>{project.environment}</dd></div>
            <div><dt>Focus</dt><dd>{project.responsibilities.join(" · ")}</dd></div>
          </dl>
          <div className={styles.heroActions}>
            <button type="button" className={styles.primaryAction} onClick={openWorkspace}>
              Inspect the system
              <ArrowRight aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.secondaryAction}
              onClick={() => navigateToSection("problem")}
            >
              Read the case study
            </button>
          </div>
          <div className={styles.stackList} aria-label="Prototype technology stack">
            {project.stack.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>

        <div className={styles.heroVisual} aria-label="Simplified Aegis Relay architecture">
          <div className={styles.heroTerminalBar}>
            <span>architecture.preview</span>
            <span>read-only</span>
          </div>
          <div className={styles.heroDiagram}>
            <div className={styles.heroZoneLabel}>PUBLIC</div>
            <div className={styles.heroChain}>
              <span>Client</span><i>→</i><span>Edge</span><i>→</i><span>Intake</span>
            </div>
            <div className={styles.heroBoundary}>
              <LockKeyhole aria-hidden="true" />
              authenticated boundary
            </div>
            <div className={styles.heroChain}>
              <span>Queue</span><i>→</i><span>Worker</span><i>→</i><span>Audit</span>
            </div>
            <div className={styles.heroBlocked}>
              <X aria-hidden="true" />
              Client has no direct route to Audit
            </div>
          </div>
          <div className={styles.heroStatus}>
            <span>model: sanitized</span>
            <span>network: simulated</span>
          </div>
        </div>
      </section>

      <section className={styles.metricStrip} aria-label="Prototype facts">
        {project.metrics.map((metric) => (
          <div key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
            <small>{metric.note}</small>
          </div>
        ))}
      </section>

      <nav className={styles.caseStudyNav} aria-label="Case study sections">
        <div className={styles.desktopNav}>
          {sectionLinks.map((section) => (
            <button
              type="button"
              key={section.id}
              aria-current={activeSection === section.id ? "location" : undefined}
              onClick={() => navigateToSection(section.id)}
            >
              <span aria-hidden="true" />
              {section.label}
            </button>
          ))}
        </div>
        <label className={styles.mobileNav}>
          <span>On this page</span>
          <select
            value={activeSection}
            onChange={(event) => navigateToSection(event.target.value)}
          >
            {sectionLinks.map((section) => (
              <option key={section.id} value={section.id}>{section.label}</option>
            ))}
          </select>
        </label>
      </nav>

      <div className={styles.caseStudyBody}>
        <section
          id="architecture"
          className={joinClasses(styles.section, styles.vmSection)}
          ref={vmRef}
          tabIndex={-1}
          aria-labelledby="architecture-heading"
        >
          <div className={styles.sectionIntro}>
            <span>01 / Interactive workspace</span>
            <h2 id="architecture-heading">Open the system, not a screenshot</h2>
            <p>
              One lab header frames the architecture, flow, threats, operations,
              source, and evidence without placing the viewer inside a decorative desktop.
            </p>
          </div>

          <div className={joinClasses(styles.vmFrame, expanded && styles.vmExpanded)}>
            <div className={styles.vmHostBar}>
              <div className={styles.windowDots} aria-hidden="true">
                <span /><span /><span />
              </div>
              <div className={styles.vmIdentity}>
                <strong>aegis-relay-lab</strong>
                <span>Ubuntu-inspired guest · Read-only · Sanitized</span>
              </div>
              <div className={styles.vmHostActions}>
                <span className={styles.runningStatus}><i />Running</span>
                <button
                  type="button"
                  ref={expandButtonRef}
                  onClick={() => {
                    setExpanded((value) => !value);
                    setAnnouncement(expanded ? "Workspace restored." : "Workspace expanded.");
                  }}
                  aria-label={expanded ? "Restore workspace" : "Expand workspace"}
                >
                  {expanded ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
                  <span>{expanded ? "Restore" : "Expand"}</span>
                </button>
              </div>
            </div>

            <div className={styles.viewerSurface}>
              <div className={styles.vmApplication}>
                <div className={styles.appBody}>
                  <div
                    className={styles.toolRail}
                    role="tablist"
                    aria-label="Project inspection tools"
                  >
                    {tools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <button
                          type="button"
                          role="tab"
                          key={tool.id}
                          aria-selected={activeTool === tool.id}
                          aria-controls="project-tool-panel"
                          onClick={() => openVmTool(tool.id)}
                        >
                          <Icon aria-hidden="true" />
                          <span>{tool.label}</span>
                          <small>{tool.shortLabel}</small>
                        </button>
                      );
                    })}
                  </div>
                  <div
                    id="project-tool-panel"
                    className={styles.appViewport}
                    role="tabpanel"
                    tabIndex={0}
                  >
                    {renderToolPanel()}
                  </div>
                </div>

                <div className={styles.vmStatusBar}>
                  <span>READ-ONLY</span>
                  <span>SANITIZED MODEL</span>
                  <span>tool: {activeTool}</span>
                  <span>selection: {selectedNodeId ?? selectedThreatId ?? "none"}</span>
                </div>
              </div>
            </div>
          </div>
          <p className={styles.srStatus} aria-live="polite">{announcement}</p>
        </section>

        <section id="problem" className={styles.section} aria-labelledby="problem-heading">
          <div className={styles.sectionIntro}>
            <span>02 / Problem and constraints</span>
            <h2 id="problem-heading">Can a technical case study explain itself?</h2>
          </div>
          <div className={styles.problemGrid}>
            <div className={styles.problemCopy}>
              {project.problem.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <details>
                <summary>Why this prototype is intentionally fictional</summary>
                <p>
                  It isolates design feedback from factual review. You can judge density,
                  hierarchy, motion, and interaction before any real project content is migrated.
                </p>
              </details>
            </div>
            <div className={styles.constraintPanel}>
              <span>Design constraints</span>
              <ul>
                {project.constraints.map((constraint) => (
                  <li key={constraint}><Check aria-hidden="true" />{constraint}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="walkthrough-heading">
          <div className={styles.sectionIntro}>
            <span>03 / System walkthrough</span>
            <h2 id="walkthrough-heading">One event, five inspectable steps</h2>
            <p>Selecting a step opens the same relationship inside the VM flow tool.</p>
          </div>
          <ol className={styles.walkthrough}>
            {project.flow.map((step, index) => (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => {
                    selectFlowStep(index);
                    setActiveTool("flow");
                    openWorkspace();
                  }}
                >
                  <span>{step.number}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.summary}</p>
                  </div>
                  <ArrowRight aria-hidden="true" />
                </button>
              </li>
            ))}
          </ol>
        </section>

        <section id="security" className={styles.section} aria-labelledby="security-heading">
          <div className={styles.sectionIntro}>
            <span>04 / Security model</span>
            <h2 id="security-heading">Controls shown where they act</h2>
            <p>
              Residual risk stays visible. Selecting a row opens the related nodes in the
              threat view.
            </p>
          </div>
          <div className={styles.threatTable} role="table" aria-label="Threat and control matrix">
            <div className={styles.threatTableHeader} role="row">
              <span role="columnheader">Threat</span>
              <span role="columnheader">Control</span>
              <span role="columnheader">Residual risk</span>
              <span role="columnheader">Inspect</span>
            </div>
            {project.threats.map((threat) => (
              <div className={styles.threatTableRow} role="row" key={threat.id}>
                <div role="cell"><small>{threat.category}</small><strong>{threat.threat}</strong></div>
                <div role="cell">{threat.control}</div>
                <div role="cell">{threat.residualRisk}</div>
                <div role="cell">
                  <button type="button" onClick={() => inspectThreatInVm(threat)}>
                    Inspect in VM
                    <ArrowRight aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="decisions" className={styles.section} aria-labelledby="decisions-heading">
          <div className={styles.sectionIntro}>
            <span>05 / Engineering decisions</span>
            <h2 id="decisions-heading">Trade-offs, not a stack of nouns</h2>
          </div>
          <div className={styles.decisionGrid}>
            {project.decisions.map((decision) => (
              <details key={decision.id} className={styles.decisionCard}>
                <summary>
                  <span>{decision.outcome}</span>
                  <strong>{decision.title}</strong>
                  <p>{decision.summary}</p>
                  <ChevronRight aria-hidden="true" />
                </summary>
                <div>
                  <dl>
                    <div><dt>Reason</dt><dd>{decision.reason}</dd></div>
                    <div><dt>Chosen approach</dt><dd>{decision.chosenApproach}</dd></div>
                    <div><dt>Trade-off</dt><dd>{decision.tradeoff}</dd></div>
                    <div><dt>Revisit when</dt><dd>{decision.revisitWhen}</dd></div>
                  </dl>
                  <div>
                    <span>Alternatives considered</span>
                    <ul>{decision.alternatives.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section id="operations" className={styles.section} aria-labelledby="operations-heading">
          <div className={styles.sectionIntro}>
            <span>06 / Failure and operations</span>
            <h2 id="operations-heading">The unhappy path gets equal space</h2>
          </div>
          <div className={styles.failureGrid}>
            {project.operations.map((operation, index) => (
              <article key={operation.question}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{operation.question}</h3>
                <dl>
                  <div><dt>Expected</dt><dd>{operation.behavior}</dd></div>
                  <div><dt>Signal</dt><dd>{operation.signal}</dd></div>
                  <div><dt>Recovery</dt><dd>{operation.recovery}</dd></div>
                </dl>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOperation(index);
                    setActiveTool("operations");
                    openWorkspace();
                  }}
                >
                  Open failure explorer <ArrowRight aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section
          id="implementation"
          className={styles.section}
          aria-labelledby="implementation-heading"
        >
          <div className={styles.sectionIntro}>
            <span>07 / Implementation</span>
            <h2 id="implementation-heading">Code with an argument attached</h2>
            <p>
              Callouts explain why a line exists and which architecture nodes it affects.
            </p>
          </div>
          <SourceExplorer
            sourceId={sourceId}
            calloutId={calloutId}
            onSourceChange={changeSource}
            onCalloutChange={selectCallout}
            onCopy={copySource}
            copyStatus={copyStatus}
          />
        </section>

        <section id="evidence" className={styles.section} aria-labelledby="evidence-heading">
          <div className={styles.sectionIntro}>
            <span>08 / Evidence and validation</span>
            <h2 id="evidence-heading">Claims earn an artifact</h2>
            <p>
              These artifacts are fictional by design. Their captions show exactly what a
              real item would prove.
            </p>
          </div>
          <div className={styles.evidenceGrid}>
            {project.evidence.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={(event) => openEvidence(item, event.currentTarget)}
              >
                <FileText aria-hidden="true" />
                <span>{item.type}</span>
                <strong>{item.title}</strong>
                <small>{item.caption}</small>
                <em>Inspect artifact <ArrowRight aria-hidden="true" /></em>
              </button>
            ))}
          </div>
        </section>

        <section id="results" className={styles.section} aria-labelledby="results-heading">
          <div className={styles.sectionIntro}>
            <span>09 / Prototype results</span>
            <h2 id="results-heading">What this test page is meant to validate</h2>
          </div>
          <div className={styles.resultsGrid}>
            {project.results.map((result) => (
              <article key={result.label}>
                <span>{result.label}</span>
                <p>{result.value}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="retrospective-heading">
          <div className={styles.sectionIntro}>
            <span>10 / Retrospective</span>
            <h2 id="retrospective-heading">What to keep, tune, or remove</h2>
          </div>
          <div className={styles.retrospectiveGrid}>
            <article>
              <span>What worked</span>
              <ul>{project.retrospective.worked.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article>
              <span>What was difficult</span>
              <ul>{project.retrospective.difficult.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article>
              <span>Next iteration</span>
              <ul>{project.retrospective.changeNext.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article>
              <span>Demonstrates</span>
              <ul>{project.retrospective.demonstrates.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </div>
        </section>

        <nav className={styles.projectPager} aria-label="Project navigation">
          <Link href="/">
            <ArrowLeft aria-hidden="true" />
            <span><small>Return to</small>Selected work</span>
          </Link>
          <Link href="/work/brasilcon/">
            <span><small>Possible first real migration</small>BRASILCON</span>
            <ArrowRight aria-hidden="true" />
          </Link>
        </nav>
      </div>

      <dialog
        ref={evidenceDialogRef}
        className={styles.evidenceDialog}
        aria-labelledby="evidence-dialog-title"
        onCancel={(event) => {
          event.preventDefault();
          closeEvidence();
        }}
        onClose={() => {
          setSelectedEvidence(null);
          evidenceTriggerRef.current?.focus();
        }}
      >
        {selectedEvidence && (
          <>
            <div className={styles.dialogHeader}>
              <div>
                <span>{selectedEvidence.type} · Fictional artifact</span>
                <h2 id="evidence-dialog-title">{selectedEvidence.title}</h2>
              </div>
              <button type="button" onClick={closeEvidence} aria-label="Close evidence dialog">
                <X aria-hidden="true" />
              </button>
            </div>
            <div className={styles.dialogBody}>
              <p>{selectedEvidence.detail}</p>
              <pre><code>{selectedEvidence.excerpt}</code></pre>
              <div>
                <span>What this proves</span>
                <p>{selectedEvidence.proves}</p>
              </div>
            </div>
            <div className={styles.dialogFooter}>
              <button type="button" onClick={() => cycleEvidence(-1)}>
                <ArrowLeft aria-hidden="true" />Previous
              </button>
              <span>
                {project.evidence.findIndex((item) => item.id === selectedEvidence.id) + 1}
                {" / "}
                {project.evidence.length}
              </span>
              <button type="button" onClick={() => cycleEvidence(1)}>
                Next<ArrowRight aria-hidden="true" />
              </button>
            </div>
          </>
        )}
      </dialog>
    </main>
  );
}
