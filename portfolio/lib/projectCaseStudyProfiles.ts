export type ProjectSource = {
  title: string;
  subtitle?: string;
  status?: string;
  category: string;
  date: string;
  description: string;
  stack: string[];
  image: string;
  imageAlt?: string;
  caseStudy?: "truststack";
  github?: string;
  demo?: string;
  codeSnippet?: {
    filename: string;
    caption: string;
    code: string;
  };
  gallery?: {
    src: string;
    caption: string;
    width: number;
    height: number;
  }[];
};

export type ProjectTheme = {
  accent: string;
  accent2: string;
  danger: string;
  glow: string;
  page: string;
  surface: string;
  typography: "technical" | "editorial" | "industrial" | "product";
  visual: "grid" | "ledger" | "radar" | "signal" | "organic" | "timeline";
};

export type ProjectNode = {
  id: string;
  label: string;
  zone: "public" | "trusted" | "internal";
  eyebrow: string;
  responsibility: string;
  data: string;
  exposure: string;
  failure: string;
};

export type ProjectFlowStep = {
  title: string;
  summary: string;
  nodeIds: string[];
};

export type ProjectThreat = {
  category: string;
  title: string;
  control: string;
  residual: string;
  nodeIds: string[];
};

export type ProjectDecision = {
  title: string;
  summary: string;
  reason: string;
  tradeoff: string;
  revisit: string;
  nodeIds: string[];
};

export type ProjectOperation = {
  question: string;
  behavior: string;
  signal: string;
  response: string;
  nodeIds: string[];
};

export type ProjectEvidence = {
  label: string;
  title: string;
  detail: string;
  href?: string;
  nodeIds: string[];
};

export type ProjectCaseStudyProfile = {
  slug: string;
  vmName: string;
  status: string;
  environment: string;
  role: string;
  outcome: string;
  ownership: string[];
  notice?: string;
  theme: ProjectTheme;
  layout:
    | "architecture-first"
    | "incident-first"
    | "evidence-first"
    | "privacy-first"
    | "product-first";
  sectionOrder: Array<
    "overview" | "security" | "decisions" | "operations" | "implementation" | "evidence" | "results"
  >;
  metrics: Array<{ value: string; label: string; note?: string }>;
  problem: string[];
  constraints: string[];
  nodes: ProjectNode[];
  flow: ProjectFlowStep[];
  threats: ProjectThreat[];
  decisions: ProjectDecision[];
  operations: ProjectOperation[];
  evidence: ProjectEvidence[];
  results: string[];
  retrospective: {
    worked: string[];
    next: string[];
    demonstrates: string[];
  };
  previousSlug: string;
  nextSlug: string;
  hideSource?: boolean;
};

const themes = {
  brasilcon: {
    accent: "#86f2b2",
    accent2: "#76baff",
    danger: "#ff7c84",
    glow: "rgba(75, 221, 142, 0.16)",
    page: "#07100c",
    surface: "#101a15",
    typography: "technical",
    visual: "grid",
  },
  pontosv: {
    accent: "#ffb45f",
    accent2: "#f07167",
    danger: "#ff616c",
    glow: "rgba(255, 152, 72, 0.17)",
    page: "#110b07",
    surface: "#1b130e",
    typography: "industrial",
    visual: "signal",
  },
  truststack: {
    accent: "#72ddff",
    accent2: "#a98cff",
    danger: "#ff7394",
    glow: "rgba(71, 183, 255, 0.17)",
    page: "#070b12",
    surface: "#101724",
    typography: "technical",
    visual: "radar",
  },
  ficha: {
    accent: "#c69cff",
    accent2: "#ff98bf",
    danger: "#ff728c",
    glow: "rgba(190, 128, 255, 0.17)",
    page: "#100914",
    surface: "#1a1120",
    typography: "editorial",
    visual: "organic",
  },
  hyundai: {
    accent: "#8ecbff",
    accent2: "#ffb86c",
    danger: "#ff7d7d",
    glow: "rgba(84, 166, 255, 0.17)",
    page: "#07101a",
    surface: "#0f1926",
    typography: "product",
    visual: "ledger",
  },
  fintech: {
    accent: "#c4ff61",
    accent2: "#9b7cff",
    danger: "#ff6c86",
    glow: "rgba(183, 255, 75, 0.15)",
    page: "#0b0c08",
    surface: "#171a10",
    typography: "product",
    visual: "ledger",
  },
  jbs: {
    accent: "#ff756f",
    accent2: "#ffc35c",
    danger: "#ff5964",
    glow: "rgba(255, 86, 77, 0.16)",
    page: "#110807",
    surface: "#1e110f",
    typography: "industrial",
    visual: "signal",
  },
  cowrec: {
    accent: "#b6e36d",
    accent2: "#e8bd65",
    danger: "#ff7f70",
    glow: "rgba(157, 212, 78, 0.16)",
    page: "#0b0f08",
    surface: "#141b10",
    typography: "editorial",
    visual: "organic",
  },
  tracker: {
    accent: "#ff9c5d",
    accent2: "#69e0b2",
    danger: "#ff6c78",
    glow: "rgba(255, 134, 64, 0.16)",
    page: "#100b08",
    surface: "#1b1410",
    typography: "technical",
    visual: "signal",
  },
  owcoach: {
    accent: "#ffb04c",
    accent2: "#6edcff",
    danger: "#ff6f75",
    glow: "rgba(255, 169, 54, 0.17)",
    page: "#0d0b08",
    surface: "#18140e",
    typography: "industrial",
    visual: "radar",
  },
  zombies: {
    accent: "#e8bc64",
    accent2: "#d65252",
    danger: "#ff5252",
    glow: "rgba(218, 74, 65, 0.18)",
    page: "#0f0908",
    surface: "#19110e",
    typography: "editorial",
    visual: "timeline",
  },
  portfolio: {
    accent: "#f0f2f1",
    accent2: "#77e8a6",
    danger: "#ff7b82",
    glow: "rgba(230, 240, 234, 0.1)",
    page: "#0a0b0a",
    surface: "#151716",
    typography: "product",
    visual: "grid",
  },
} satisfies Record<string, ProjectTheme>;

export const projectCaseStudyProfiles: Record<string, ProjectCaseStudyProfile> = {
  brasilcon: {
    slug: "brasilcon",
    vmName: "brasilcon-lab",
    status: "Operating",
    environment: "Live production · Sanitized architecture",
    role: "Infrastructure architect and sole operator",
    outcome:
      "Published a national legal journal from self-hosted infrastructure without exposing a single inbound application port.",
    ownership: ["Architecture", "Deployment", "Hardening", "DNS", "Recovery", "Monitoring", "Runbooks"],
    theme: themes.brasilcon,
    layout: "architecture-first",
    sectionOrder: ["overview", "security", "decisions", "operations", "implementation", "evidence", "results"],
    metrics: [
      { value: "0", label: "published application ports", note: "Architecture property" },
      { value: "3", label: "isolated production containers" },
      { value: "1", label: "operator across day-one and day-two work" },
      { value: "Live", label: "national publishing platform" },
    ],
    problem: [
      "BRASILCON needed a dependable digital workflow for submission, review, editorial rounds, and publication without taking on a conventional hosted-infrastructure budget.",
      "The security challenge was unusually concrete: serve a public institution from residential infrastructure while keeping the origin and application ports out of the normal inbound attack path.",
    ],
    constraints: ["Residential connection", "Minimal operating budget", "Sensitive editorial workflow", "Solo operation", "Unattended reboot recovery"],
    nodes: [
      { id: "reader", label: "Reader", zone: "public", eyebrow: "Public client", responsibility: "Requests journal content over the public web.", data: "HTTP request and published content", exposure: "Untrusted public network", failure: "Receives an edge error; never reaches the origin directly." },
      { id: "edge", label: "Cloudflare Edge", zone: "public", eyebrow: "Public boundary", responsibility: "Terminates public traffic, filters requests, and carries them into the authenticated tunnel.", data: "Encrypted web traffic", exposure: "Only intentional public surface", failure: "Journal becomes unavailable without exposing the host." },
      { id: "tunnel", label: "cloudflared", zone: "trusted", eyebrow: "Outbound connector", responsibility: "Initiates the outbound-only authenticated tunnel from inside the stack.", data: "Proxied journal requests", exposure: "No inbound listener", failure: "Edge path stops; containers remain private." },
      { id: "ojs", label: "OJS", zone: "internal", eyebrow: "Application", responsibility: "Runs the submission, review, editorial, and publication workflow.", data: "Editorial and publication records", exposure: "Internal Docker network only", failure: "Health checks and restart policy govern recovery." },
      { id: "db", label: "MariaDB", zone: "internal", eyebrow: "Persistent state", responsibility: "Stores journal workflow and publication data.", data: "Users, submissions, reviews, issues", exposure: "No host port; OJS-only path", failure: "Persistent volume retains state while OJS waits for health." },
    ],
    flow: [
      { title: "Request reaches the edge", summary: "The reader connects to Cloudflare, not the residential origin.", nodeIds: ["reader", "edge"] },
      { title: "Edge applies the public controls", summary: "TLS termination and traffic filtering happen before the tunnel path.", nodeIds: ["edge"] },
      { title: "Tunnel carries the request inward", summary: "cloudflared uses a connection initiated from inside the network.", nodeIds: ["edge", "tunnel"] },
      { title: "OJS serves the workflow", summary: "The application handles the journal request on the internal network.", nodeIds: ["tunnel", "ojs"] },
      { title: "State stays private", summary: "Only OJS can reach MariaDB; there is no public database route.", nodeIds: ["ojs", "db"] },
    ],
    threats: [
      { category: "Network", title: "Direct origin probing", control: "Outbound-only tunnel and zero published application ports", residual: "Cloudflare account security and provider availability remain dependencies.", nodeIds: ["reader", "edge", "tunnel"] },
      { category: "Data", title: "Direct database access", control: "Internal Docker network with no database host port", residual: "An application compromise may still reach its database dependency.", nodeIds: ["ojs", "db"] },
      { category: "Secrets", title: "Credentials embedded in configuration", control: "Runtime secret files instead of inline production values", residual: "Host-level compromise can still expose mounted secrets.", nodeIds: ["tunnel", "ojs", "db"] },
      { category: "Availability", title: "Incomplete recovery after reboot", control: "Restart policies, health checks, and documented runbooks", residual: "External monitoring is still required to detect partial recovery.", nodeIds: ["tunnel", "ojs", "db"] },
    ],
    decisions: [
      { title: "Outbound-only ingress", summary: "Publish without router port forwarding.", reason: "Reduce direct origin exposure on residential infrastructure.", tradeoff: "Creates a meaningful dependency on tunnel identity and provider uptime.", revisit: "Move to redundant or managed ingress when budget and availability requirements justify it.", nodeIds: ["edge", "tunnel"] },
      { title: "Internal-only database", summary: "Make the application the sole database client.", reason: "There is no operational need for LAN or public database access.", tradeoff: "Administration must occur through controlled host workflows.", revisit: "Add a dedicated management path only if operations require it.", nodeIds: ["ojs", "db"] },
      { title: "Reproducible application image", summary: "Bake configuration and patches at build time.", reason: "Avoid hand-mutated production containers.", tradeoff: "The image build and upstream base must be maintained.", revisit: "Adopt a broader release pipeline if more operators or environments appear.", nodeIds: ["ojs"] },
    ],
    operations: [
      { question: "What if the tunnel disconnects?", behavior: "The public path stops while the origin remains closed to direct inbound traffic.", signal: "Tunnel health and external journal checks fail.", response: "Inspect connector state, credentials, DNS, and edge status before rebuilding.", nodeIds: ["edge", "tunnel"] },
      { question: "What if the host reboots unattended?", behavior: "Container restart policies restore the stack in dependency order.", signal: "Health checks show database readiness and application recovery.", response: "Use the runbook when any service remains unhealthy after restart.", nodeIds: ["tunnel", "ojs", "db"] },
    ],
    evidence: [
      { label: "Institutional proof", title: "Official recognition letter", detail: "Confirms the production deployment and BRASILCON's institutional use.", nodeIds: ["ojs"] },
      { label: "Live service", title: "Published journal", detail: "The public outcome of the architecture is directly inspectable.", href: "https://revistabrasilcon.com/", nodeIds: ["reader", "edge", "ojs"] },
      { label: "Configuration", title: "Sanitized Compose excerpt", detail: "Shows internal networks, runtime secrets, restart behavior, and the absence of a ports block.", nodeIds: ["tunnel", "ojs", "db"] },
    ],
    results: ["National journal workflow operating on infrastructure Pedro owns", "Public access without a direct application-port path to the origin", "Architecture, operation, and recovery owned by one accountable operator"],
    retrospective: {
      worked: ["The exposure model is understandable and enforceable.", "Reproducible containers make recovery less dependent on memory."],
      next: ["External health monitoring", "Encrypted off-site backups", "Scheduled recovery exercises"],
      demonstrates: ["Production ownership", "Linux and container operations", "Security architecture under real constraints"],
    },
    previousSlug: "portfolio",
    nextSlug: "pontosv",
  },

  pontosv: {
    slug: "pontosv",
    vmName: "pontosv-ops",
    status: "Online",
    environment: "Bare-metal Debian · Residential production",
    role: "System owner and sole administrator",
    outcome:
      "Turned a home server into a deliberately operated production system-and traced a recurring network failure to three conflicting owners.",
    ownership: ["Hardware", "Linux", "Networking", "Firewall policy", "Containers", "Incident response", "Runbooks"],
    theme: themes.pontosv,
    layout: "incident-first",
    sectionOrder: ["operations", "overview", "security", "decisions", "implementation", "evidence", "results"],
    metrics: [
      { value: "3", label: "root causes in one recurring incident" },
      { value: "1", label: "authoritative DHCP client after correction" },
      { value: "1", label: "firewall authority after correction" },
      { value: "0", label: "recurrences after the architectural fix" },
    ],
    problem: [
      "pontosv is a live Debian server on a residential connection, hosting real workloads with an intentionally small exposure surface.",
      "Its most valuable story is operational: intermittent connectivity survived repeated reboots until evidence revealed competing DHCP clients, an unwanted route, and overlapping firewall managers.",
    ],
    constraints: ["Residential WAN", "Mixed LAN and public services", "Docker-managed chains", "Solo on-call ownership", "Remote recovery matters"],
    nodes: [
      { id: "wan", label: "Public Internet", zone: "public", eyebrow: "Hostile network", responsibility: "Origin of public traffic and unsolicited probes.", data: "Public requests and voice traffic", exposure: "Untrusted", failure: "External connectivity loss isolates public services." },
      { id: "router", label: "ISP Router", zone: "trusted", eyebrow: "Network edge", responsibility: "Routes the residential network and forwards only justified services.", data: "Routes, DHCP, selected forwards", exposure: "WAN/LAN boundary", failure: "A rogue route can replace the intended default path." },
      { id: "host", label: "Debian Host", zone: "trusted", eyebrow: "System boundary", responsibility: "Owns system services, network configuration, and host firewall policy.", data: "Service traffic and system state", exposure: "Key-only SSH plus documented services", failure: "Competing network owners create non-deterministic behavior." },
      { id: "docker", label: "Docker Networks", zone: "internal", eyebrow: "Workload boundary", responsibility: "Isolates service stacks and manages container forwarding chains.", data: "Application traffic", exposure: "Only explicitly published ports", failure: "Overlapping firewall tools can break expected chains." },
      { id: "lan", label: "LAN Services", zone: "internal", eyebrow: "Private management", responsibility: "Provides admin and file services that must remain local.", data: "Administrative traffic", exposure: "LAN-only by policy", failure: "Incorrect forwarding would expand the public surface." },
    ],
    flow: [
      { title: "WAN traffic reaches the router", summary: "The edge decides which traffic has any path toward the host.", nodeIds: ["wan", "router"] },
      { title: "Host policy evaluates exposure", summary: "nftables and service configuration enforce the documented intent.", nodeIds: ["router", "host"] },
      { title: "Docker owns container forwarding", summary: "Container chains remain the responsibility of one runtime.", nodeIds: ["host", "docker"] },
      { title: "Private services stop at the LAN", summary: "Management surfaces have no justified public route.", nodeIds: ["host", "lan"] },
    ],
    threats: [
      { category: "Exposure", title: "Accidental service publication", control: "Services-and-ports map plus default-drop host policy", residual: "Router configuration remains a separate enforcement layer.", nodeIds: ["wan", "router", "host"] },
      { category: "Identity", title: "Password-based SSH attack", control: "Key-only SSH with password authentication disabled", residual: "Private-key protection and endpoint security remain necessary.", nodeIds: ["wan", "host"] },
      { category: "Availability", title: "Conflicting network managers", control: "Exactly one owner per DHCP and firewall layer", residual: "Future package changes can reintroduce competing services.", nodeIds: ["router", "host", "docker"] },
    ],
    decisions: [
      { title: "One owner per layer", summary: "Remove overlapping network authorities.", reason: "Multiple valid configurations created an invalid combined system.", tradeoff: "Reduces tool flexibility in exchange for deterministic operation.", revisit: "Only when a migration plan names the replacement owner explicitly.", nodeIds: ["router", "host", "docker"] },
      { title: "Document every public port", summary: "Exposure requires a written reason.", reason: "A production host should never rely on accidental or forgotten forwards.", tradeoff: "Adds operational discipline to each service change.", revisit: "Continuously, as services are added or retired.", nodeIds: ["wan", "router", "host"] },
      { title: "Treat documentation as a control", summary: "Make operation recoverable by another competent person.", reason: "Solo knowledge is a continuity risk.", tradeoff: "Runbooks must evolve with the machine.", revisit: "Whenever the topology, incident history, or service inventory changes.", nodeIds: ["host", "docker", "lan"] },
    ],
    operations: [
      { question: "Why did internet disappear every few weeks?", behavior: "Independent DHCP renewals and an unwanted route changed the default path.", signal: "journald recorded route changes at the moment of failure.", response: "Remove duplicate clients and leave one authoritative network owner.", nodeIds: ["router", "host"] },
      { question: "Why did earlier firewall fixes fail?", behavior: "firewalld, ufw, iptables-persistent, and Docker affected overlapping layers.", signal: "Rules changed in one tool while another tool or runtime remained authoritative.", response: "Simplify to one host firewall authority and preserve Docker's chain ownership.", nodeIds: ["host", "docker"] },
    ],
    evidence: [
      { label: "Incident evidence", title: "Sanitized route-change timeline", detail: "Connects the symptom to DHCP and route ownership instead of another reboot.", nodeIds: ["router", "host"] },
      { label: "Policy evidence", title: "Services and ports map", detail: "Makes public, LAN-only, tunnel-only, and internal services explicit.", nodeIds: ["wan", "host", "docker", "lan"] },
      { label: "Operational evidence", title: "Living handbook and runbooks", detail: "Preserves recovery steps, rationale, and risk ownership.", nodeIds: ["host"] },
    ],
    results: ["Recurring connectivity incident stopped after ownership was simplified", "Public and private services now have explicit exposure rationale", "Operational knowledge is preserved in a living system handbook"],
    retrospective: {
      worked: ["Evidence replaced reboot-driven guesswork.", "Layer ownership made the system predictable."],
      next: ["More external observability", "Routine configuration-drift checks", "Scheduled recovery practice"],
      demonstrates: ["Linux troubleshooting", "Incident analysis", "Operational security"],
    },
    previousSlug: "brasilcon",
    nextSlug: "truststack",
  },

  truststack: {
    slug: "truststack",
    vmName: "truststack-control-plane",
    status: "In development",
    environment: "Personal cloud security engineering platform",
    role: "Platform architect and control author",
    outcome:
      "Connected AWS governance, automated response, Kubernetes defense, and signed delivery into one evidence-driven security platform.",
    ownership: ["Threat models", "Terraform", "Detection logic", "Policies", "Attack tests", "CI identity", "Evidence design"],
    theme: themes.truststack,
    layout: "evidence-first",
    sectionOrder: ["evidence", "overview", "security", "decisions", "implementation", "operations", "results"],
    metrics: [
      { value: "4", label: "connected security projects" },
      { value: "6", label: "live AWS Terraform stacks" },
      { value: "167", label: "automated response tests" },
      { value: "0", label: "long-lived CI credentials" },
    ],
    problem: [
      "Security controls are easy to describe and much harder to prove. TrustStack treats evidence as part of implementation: the allowed path, denied path, failure behavior, and audit trail all need an observable result.",
      "The platform connects governance, detection, remediation, cluster policy, runtime observation, and image provenance without pretending that an unfinished control is already complete.",
    ],
    constraints: ["Personal lab scale", "Honest status boundaries", "Least-privilege identities", "Reproducible attack tests", "Evidence before claims"],
    nodes: [
      { id: "org", label: "AWS Landing Zone", zone: "trusted", eyebrow: "Governance", responsibility: "Defines organization guardrails, logging, and account boundaries.", data: "Policies and organization events", exposure: "Cloud control plane", failure: "Mis-scoped policy can block intended work or leave a gap." },
      { id: "detect", label: "Detection Engine", zone: "trusted", eyebrow: "Signal", responsibility: "Turns AWS activity into bounded security findings.", data: "Cloud events and findings", exposure: "Event-driven service path", failure: "Missed or noisy signals reduce response quality." },
      { id: "respond", label: "Response Runner", zone: "internal", eyebrow: "Bounded action", responsibility: "Plans, records, and applies guarded remediations.", data: "Finding context and before-state", exposure: "Least-privilege AWS identity", failure: "Dry-run and circuit breaker stop unsafe mutation." },
      { id: "supply", label: "Signed Pipeline", zone: "trusted", eyebrow: "Provenance", responsibility: "Builds, signs, and attests container artifacts without long-lived CI credentials.", data: "Source identity, signatures, attestations", exposure: "Federated workflow identity", failure: "Verification blocks an untrusted artifact." },
      { id: "cluster", label: "Kubernetes", zone: "internal", eyebrow: "Admission + runtime", responsibility: "Applies workload policy and observes runtime behavior.", data: "Workloads, admission results, runtime events", exposure: "Private lab cluster", failure: "Planned controls remain visibly planned until tested." },
    ],
    flow: [
      { title: "Governance defines the boundary", summary: "Organization policies and logging establish the control plane.", nodeIds: ["org"] },
      { title: "Activity becomes a finding", summary: "Detection logic turns a relevant event into a structured signal.", nodeIds: ["org", "detect"] },
      { title: "Response plans before mutation", summary: "The runner records evidence and checks safeguards before acting.", nodeIds: ["detect", "respond"] },
      { title: "The pipeline proves artifact identity", summary: "Federated CI signs and attests the image.", nodeIds: ["supply"] },
      { title: "The cluster decides what may run", summary: "Admission and runtime controls connect supply-chain trust to execution.", nodeIds: ["supply", "cluster"] },
    ],
    threats: [
      { category: "Governance", title: "Member-account policy bypass", control: "Organization SCPs with explicit negative tests", residual: "Coverage depends on policy scope and service semantics.", nodeIds: ["org"] },
      { category: "Response", title: "Automation causes broader damage", control: "Dry-run, exclusions, before-state, and circuit breaker", residual: "A flawed plan inside allowed bounds can still be wrong.", nodeIds: ["detect", "respond"] },
      { category: "Supply chain", title: "Unsigned artifact reaches runtime", control: "Cosign identity verification and admission policy", residual: "Admission enforcement remains incomplete until all negative paths are captured.", nodeIds: ["supply", "cluster"] },
    ],
    decisions: [
      { title: "Evidence is a deliverable", summary: "A configured control is not automatically a verified control.", reason: "The platform exists to prove behavior, not count YAML files.", tradeoff: "Progress appears slower because untested work remains visibly incomplete.", revisit: "Never; only the evidence format should evolve.", nodeIds: ["org", "detect", "respond", "supply", "cluster"] },
      { title: "Bounded remediation", summary: "Automation must know when not to act.", reason: "A security response can become an incident if scope and rate are uncontrolled.", tradeoff: "More state and tests are required around each action.", revisit: "As event volume and response ownership expand.", nodeIds: ["detect", "respond"] },
      { title: "Federated CI identity", summary: "Remove long-lived credentials from delivery.", reason: "A pipeline should prove its workflow identity at runtime.", tradeoff: "Trust policy and workflow claims must stay synchronized.", revisit: "When moving to a different build identity or isolated builder.", nodeIds: ["supply"] },
    ],
    operations: [
      { question: "What if event volume spikes?", behavior: "Circuit-breaker state can stop repeated mutation while preserving findings.", signal: "Action counts cross the configured window threshold.", response: "Investigate the event source and resume only after scope is understood.", nodeIds: ["detect", "respond"] },
      { question: "What if runtime evidence is missing?", behavior: "The associated control remains planned or in progress.", signal: "Evidence inventory lacks the expected denial, alert, or recovery capture.", response: "Run the controlled scenario and record both positive and negative outcomes.", nodeIds: ["cluster"] },
    ],
    evidence: [
      { label: "AWS controls", title: "Landing-zone evidence set", detail: "SCP denial, organization logging, and retained audit artifacts.", href: "https://github.com/PontoPe/AwLZ/tree/main/docs/evidence", nodeIds: ["org"] },
      { label: "Supply chain", title: "Signature and attestation proof", detail: "Positive verification plus an incorrect-identity negative control.", href: "https://github.com/PontoPe/ProvenancePipeline/blob/main/docs/evidence/supply-chain-verification.md", nodeIds: ["supply", "cluster"] },
      { label: "Tested behavior", title: "Response test suite", detail: "Exercises dry-run, exclusions, failure handling, and event storms.", nodeIds: ["detect", "respond"] },
    ],
    results: ["Four security layers share one trust narrative", "Automated response is constrained by explicit safety mechanisms", "Incomplete controls remain visibly separated from verified evidence"],
    retrospective: {
      worked: ["Evidence status prevents overclaiming.", "Shared trust boundaries connect otherwise separate projects."],
      next: ["Complete Kubernetes negative controls", "Capture runtime interruption evidence", "Expand recovery testing"],
      demonstrates: ["Cloud security engineering", "Detection and response design", "Software supply-chain security"],
    },
    previousSlug: "pontosv",
    nextSlug: "ficha-clinica",
  },

  "ficha-clinica": {
    slug: "ficha-clinica",
    vmName: "ficha-privacy",
    status: "In development",
    environment: "Local-first browser application · Sanitized case study",
    role: "Privacy-focused full-stack engineer",
    outcome:
      "Protected sensitive dental anamnesis by removing the central server, expiring local drafts, and encrypting exports entirely in the browser.",
    ownership: ["Product flow", "Local data lifecycle", "Clinical rules", "Cryptography integration", "Consent design", "Testing"],
    notice: "Clinical examples are fictionalized. This page describes engineering behavior, not medical advice.",
    theme: themes.ficha,
    layout: "privacy-first",
    sectionOrder: ["overview", "security", "implementation", "decisions", "evidence", "operations", "results"],
    metrics: [
      { value: "0", label: "application servers holding patient data" },
      { value: "12h", label: "automatic local draft expiry" },
      { value: "210k", label: "PBKDF2 iterations" },
      { value: "38", label: "privacy and crypto tests" },
    ],
    problem: [
      "Paper pre-consultation forms were incomplete, hard to read, and weakly protected. The product needed to guide the patient while giving the dentist a structured summary.",
      "Because health information is sensitive under LGPD, the architecture starts with a stronger question than where to host it: can the server be removed from the data path entirely?",
    ],
    constraints: ["Sensitive health data", "Shared reception devices", "Intermittent connectivity", "Explicit network consent", "Explainable clinical output"],
    nodes: [
      { id: "patient", label: "Patient", zone: "public", eyebrow: "Data subject", responsibility: "Completes the guided anamnesis on the clinic device.", data: "Fictionalized health answers", exposure: "Local user session", failure: "Can review and correct before export." },
      { id: "browser", label: "Browser App", zone: "trusted", eyebrow: "Local processing", responsibility: "Validates steps and runs the clinical rules locally.", data: "Anamnesis and derived classification", exposure: "No application server", failure: "Core workflow remains available without network services." },
      { id: "draft", label: "Expiring Draft", zone: "internal", eyebrow: "Device state", responsibility: "Keeps temporary progress with a twelve-hour expiry.", data: "Incomplete local form", exposure: "Device-local storage", failure: "Expired drafts are discarded instead of accumulating." },
      { id: "crypto", label: "Encrypted Export", zone: "internal", eyebrow: "Portable record", responsibility: "Encrypts the final JSON with AES-GCM and a PBKDF2-derived key.", data: "Authenticated ciphertext", exposure: "Unreadable without the user PIN", failure: "Wrong PIN fails integrity validation." },
      { id: "lookup", label: "Opt-in Lookup", zone: "public", eyebrow: "Consent boundary", responsibility: "Escalates to external medication lookup only after explicit consent.", data: "Minimum required query", exposure: "Network path off by default", failure: "Local cascade remains the default fallback." },
    ],
    flow: [
      { title: "Patient enters data locally", summary: "The guided form keeps sensitive answers inside the browser.", nodeIds: ["patient", "browser"] },
      { title: "Draft receives an expiry", summary: "Temporary state survives interruption without becoming permanent storage.", nodeIds: ["browser", "draft"] },
      { title: "Rules run on the device", summary: "Classification and local medication checks do not need a server.", nodeIds: ["browser"] },
      { title: "Export is encrypted", summary: "A fresh salt and IV protect each portable record.", nodeIds: ["browser", "crypto"] },
      { title: "Network use requires consent", summary: "External lookup is a visible escalation, not a hidden default.", nodeIds: ["browser", "lookup"] },
    ],
    threats: [
      { category: "Privacy", title: "Central health-data breach", control: "Static local-first architecture with no patient-data server", residual: "A compromised clinic device can still expose active data.", nodeIds: ["browser", "draft"] },
      { category: "Persistence", title: "Stale drafts on a shared device", control: "Automatic twelve-hour expiry", residual: "Data exists during the active window.", nodeIds: ["draft"] },
      { category: "Export", title: "Portable record disclosure", control: "AES-256-GCM with PBKDF2 key derivation", residual: "A weak user PIN reduces effective resistance.", nodeIds: ["crypto"] },
      { category: "Consent", title: "Unexpected network disclosure", control: "Network features off by default and gated by explicit consent", residual: "A user may consent without fully understanding the external service.", nodeIds: ["browser", "lookup"] },
    ],
    decisions: [
      { title: "Remove the server", summary: "Avoid collecting a central health-data database.", reason: "The clinic workflow can be completed locally.", tradeoff: "Cross-device synchronization and centralized recovery are intentionally absent.", revisit: "Only with a formal data-governance model and a justified server-side need.", nodeIds: ["browser", "draft"] },
      { title: "Authenticated encryption", summary: "Detect wrong keys and modified exports.", reason: "Confidentiality without integrity is insufficient for a clinical record.", tradeoff: "Users must manage a PIN and recovery expectations.", revisit: "When a managed key lifecycle becomes available.", nodeIds: ["crypto"] },
      { title: "Consent before escalation", summary: "Make every network path visible.", reason: "Local processing should remain the privacy-preserving default.", tradeoff: "Some advanced lookups require an extra user decision.", revisit: "As local catalog coverage improves.", nodeIds: ["browser", "lookup"] },
    ],
    operations: [
      { question: "What if the user enters the wrong export PIN?", behavior: "AES-GCM authentication fails and no plaintext is returned.", signal: "A generic decryption failure appears locally.", response: "Ask for the correct PIN; do not expose partial data or an oracle.", nodeIds: ["crypto"] },
      { question: "What if the network is unavailable?", behavior: "Form entry, local rules, draft handling, and export continue.", signal: "Only the optional external lookup reports unavailability.", response: "Use the local medication cascade and retry external lookup only with consent.", nodeIds: ["browser", "lookup"] },
    ],
    evidence: [
      { label: "Test evidence", title: "Privacy and crypto test suite", detail: "Covers round trips, parser behavior, local rules, and the versioned encrypted envelope.", nodeIds: ["browser", "crypto"] },
      { label: "Architecture proof", title: "Static deployment model", detail: "Shows that no application server receives patient content.", nodeIds: ["browser", "draft"] },
      { label: "User control", title: "Consent-gated lookup flow", detail: "Demonstrates that the external path is visible and off by default.", nodeIds: ["browser", "lookup"] },
    ],
    results: ["Sensitive form processing stays on the clinic device", "Encrypted exports fail safely when the PIN or ciphertext is wrong", "Clinical output is structured, explainable, and backed by tests"],
    retrospective: {
      worked: ["Privacy requirements shaped the architecture instead of decorating it.", "Local-first behavior reduces both breach surface and operating cost."],
      next: ["Usability testing around PIN recovery", "Broader offline medication coverage", "Formal clinical validation workflow"],
      demonstrates: ["Privacy engineering", "Secure browser architecture", "Product judgment around sensitive data"],
    },
    previousSlug: "truststack",
    nextSlug: "hyundai",
  },

  hyundai: {
    slug: "hyundai",
    vmName: "hyundai-pipeline",
    status: "Delivered",
    environment: "Enterprise integration · Sanitized representation",
    role: "Backend and security automation engineer",
    outcome:
      "Moved employee onboarding from repeated manual PII handling to a validated, minimized, least-privilege automation pipeline.",
    ownership: ["API ingestion", "Validation", "Field minimization", "AWS access", "Idempotency", "Masked logging"],
    notice: "Names, identifiers, exact field mappings, volumes, and proprietary integration contracts are generalized.",
    theme: themes.hyundai,
    layout: "privacy-first",
    sectionOrder: ["overview", "security", "decisions", "implementation", "operations", "evidence", "results"],
    metrics: [
      { value: "3+", label: "destination classes with minimized payloads" },
      { value: "15m", label: "short-lived AWS session example" },
      { value: "0", label: "known data exposure incidents during operation" },
      { value: "PII", label: "masked in structured logs" },
    ],
    problem: [
      "Every new hire generated sensitive identity, document, and banking data that had to reach several internal systems before day one.",
      "Repeated manual entry made the process slow and expanded the number of intermediate PII copies. The pipeline needed to reduce handling without turning the automation layer into a new shadow database.",
    ],
    constraints: ["Enterprise NDA boundaries", "Sensitive employee data", "Multiple destination contracts", "Safe retries", "Auditable failures"],
    nodes: [
      { id: "hr", label: "HR Source", zone: "trusted", eyebrow: "System of record", responsibility: "Produces the authorized onboarding event.", data: "New-hire identity and document references", exposure: "Enterprise internal", failure: "Invalid or incomplete records stop at ingestion." },
      { id: "api", label: "Validation API", zone: "trusted", eyebrow: "Trust gate", responsibility: "Validates types, formats, and allowed fields before business logic.", data: "Validated onboarding envelope", exposure: "Authenticated integration", failure: "Returns a generic error and records internal context safely." },
      { id: "orchestrator", label: "Orchestrator", zone: "internal", eyebrow: "Workflow", responsibility: "Coordinates idempotent actions and destination-specific payloads.", data: "Minimized task state", exposure: "Private service", failure: "Retry uses the same operation identity instead of duplicating employees." },
      { id: "vault", label: "Private S3", zone: "internal", eyebrow: "Document boundary", responsibility: "Stores encrypted documents through a least-privilege role.", data: "Required employee documents", exposure: "Private bucket", failure: "Denied access fails closed and is logged without PII." },
      { id: "systems", label: "Business Systems", zone: "trusted", eyebrow: "Destinations", responsibility: "Receives only the fields needed for payroll, access, or records.", data: "Service-specific minimized payloads", exposure: "Authenticated APIs only", failure: "Destination failure is isolated and retryable." },
    ],
    flow: [
      { title: "HR submits the onboarding event", summary: "The pipeline receives one authorized source record.", nodeIds: ["hr", "api"] },
      { title: "The edge validates hostile input", summary: "Malformed fields stop before workflow execution.", nodeIds: ["api"] },
      { title: "The orchestrator minimizes by purpose", summary: "Each destination receives a separate allow-listed payload.", nodeIds: ["api", "orchestrator"] },
      { title: "Documents use scoped cloud access", summary: "A short-lived role writes only to the required private storage path.", nodeIds: ["orchestrator", "vault"] },
      { title: "Destinations remain retry-safe", summary: "Critical operations use stable identities to avoid duplicate employee records.", nodeIds: ["orchestrator", "systems"] },
    ],
    threats: [
      { category: "Input", title: "Malformed external data", control: "Strict schema validation before business logic", residual: "Valid but incorrect source data still needs business review.", nodeIds: ["hr", "api"] },
      { category: "PII", title: "Logs become a shadow database", control: "Structured logging with CPF and sensitive values masked", residual: "Operational metadata can still reveal process timing and volume.", nodeIds: ["api", "orchestrator"] },
      { category: "Access", title: "Broad cloud credentials", control: "Short-lived service-specific least-privilege role", residual: "A compromised session can act within its temporary scope.", nodeIds: ["orchestrator", "vault"] },
      { category: "Integrity", title: "Retry creates duplicate employees", control: "Idempotent critical operations", residual: "Destination systems must honor the integration contract.", nodeIds: ["orchestrator", "systems"] },
    ],
    decisions: [
      { title: "Minimize by destination", summary: "Build a payload for purpose, not convenience.", reason: "A system needing name and employee ID should not receive CPF or banking data.", tradeoff: "Each integration contract requires explicit maintenance.", revisit: "When a destination's documented purpose changes.", nodeIds: ["orchestrator", "systems"] },
      { title: "APIs, never direct database access", summary: "Keep ownership with each destination.", reason: "Authenticated contracts are safer and more governable than shared schemas.", tradeoff: "The pipeline depends on destination availability and API quality.", revisit: "Only under a formally governed migration path.", nodeIds: ["api", "systems"] },
      { title: "Generic external failures", summary: "Keep internal detail out of client-facing errors.", reason: "Error messages should not become reconnaissance.", tradeoff: "Operators need strong internal correlation and logs.", revisit: "When an authenticated support channel can safely reveal more context.", nodeIds: ["api", "orchestrator"] },
    ],
    operations: [
      { question: "What if the same event is delivered twice?", behavior: "The stable operation identity maps the retry to the existing workflow.", signal: "The audit trail records a duplicate or replay rather than a second employee.", response: "Return the existing result or resume the incomplete step.", nodeIds: ["api", "orchestrator", "systems"] },
      { question: "What if one destination is unavailable?", behavior: "Other completed steps remain recorded while the failed integration stays retryable.", signal: "Structured internal status identifies the destination without exposing PII.", response: "Retry only the failed operation under the same idempotency key.", nodeIds: ["orchestrator", "systems"] },
    ],
    evidence: [
      { label: "Sanitized source", title: "Validation and masking excerpt", detail: "Connects untrusted input handling, PII-safe logs, and short-lived AWS access.", nodeIds: ["api", "orchestrator", "vault"] },
      { label: "Architecture", title: "Field-minimization map", detail: "Shows which destinations receive or never receive each sensitive field class.", nodeIds: ["orchestrator", "systems"] },
      { label: "Operational proof", title: "Idempotent retry sequence", detail: "Explains how repeated delivery avoids a second unmanaged PII copy.", nodeIds: ["api", "orchestrator", "systems"] },
    ],
    results: ["Multi-day manual handling became an automated and traceable workflow", "PII stopped circulating through repeated spreadsheet copies", "Each integration received only the fields required for its function"],
    retrospective: {
      worked: ["Threat modeling shaped contracts, logging, and retry behavior.", "Field minimization made least privilege visible at the data layer."],
      next: ["Formal schema-version negotiation", "Centralized policy tests for field contracts", "More automated recovery exercises"],
      demonstrates: ["Secure enterprise automation", "PII-aware backend design", "Least-privilege cloud integration"],
    },
    previousSlug: "ficha-clinica",
    nextSlug: "fintech",
  },

  fintech: {
    slug: "fintech",
    vmName: "bnpl-ledger",
    status: "Complete",
    environment: "Containerized full-stack demonstration",
    role: "Backend and platform engineer",
    outcome:
      "Built a BNPL microservices platform where money remains exact, retries remain safe, and concurrent payments cannot silently double-apply.",
    ownership: ["Go services", "Transactional model", "Search", "Authentication", "Dashboard", "Docker orchestration", "Tests"],
    theme: themes.fintech,
    layout: "architecture-first",
    sectionOrder: ["overview", "decisions", "security", "implementation", "operations", "evidence", "results"],
    metrics: [
      { value: "3", label: "independently deployed Go services" },
      { value: "24", label: "unit, integration, and HTTP tests" },
      { value: "int64", label: "money representation in cents" },
      { value: "0", label: "floating-point currency operations" },
    ],
    problem: [
      "Installment payments combine money invariants, concurrent requests, authentication, search, and merchant-facing workflow in one compact system.",
      "The project focuses on the failure modes that make finance software difficult: rounding drift, duplicate payment, partial state, and credentials living in the wrong client storage.",
    ],
    constraints: ["Exact currency math", "Concurrent payment requests", "Safe retries", "Protected merchant routes", "Independent services"],
    nodes: [
      { id: "merchant", label: "Merchant UI", zone: "public", eyebrow: "Operator", responsibility: "Searches transactions and inspects installment timelines.", data: "Merchant session and transaction views", exposure: "Browser client", failure: "Protected routes reject missing in-memory identity." },
      { id: "api", label: "Merchant API", zone: "trusted", eyebrow: "Authenticated API", responsibility: "Provides JWT-protected search and aggregate views.", data: "Merchant queries and order summaries", exposure: "Public authenticated service", failure: "Generic API error; service state remains isolated." },
      { id: "engine", label: "BNPL Engine", zone: "trusted", eyebrow: "Money rules", responsibility: "Creates orders, splits cents exactly, and processes installments.", data: "Orders, installments, integer cents", exposure: "Service contract", failure: "Transaction rollback preserves the prior state." },
      { id: "postgres", label: "PostgreSQL", zone: "internal", eyebrow: "Ledger state", responsibility: "Stores order and payment state under transactional locks.", data: "Durable BNPL records", exposure: "Internal service network", failure: "Serializable transaction fails rather than double-applying." },
      { id: "search", label: "Elasticsearch", zone: "internal", eyebrow: "Read model", responsibility: "Supports merchant transaction discovery without owning payment truth.", data: "Searchable transaction projection", exposure: "Internal only", failure: "Search can degrade while the ledger remains authoritative." },
    ],
    flow: [
      { title: "Merchant authenticates", summary: "The dashboard keeps the JWT in memory instead of persistent browser storage.", nodeIds: ["merchant", "api"] },
      { title: "Order reaches the engine", summary: "The service expresses money as integer cents.", nodeIds: ["api", "engine"] },
      { title: "Installments split exactly", summary: "Remainder cents are distributed while the total invariant remains true.", nodeIds: ["engine"] },
      { title: "Payment locks the row", summary: "SELECT FOR UPDATE serializes concurrent payment attempts.", nodeIds: ["engine", "postgres"] },
      { title: "Search stays a projection", summary: "Merchant discovery can use Elasticsearch without becoming the ledger.", nodeIds: ["api", "search", "postgres"] },
    ],
    threats: [
      { category: "Integrity", title: "Double-payment race", control: "Serializable transaction and row-level lock", residual: "External payment providers still need their own idempotency contract.", nodeIds: ["engine", "postgres"] },
      { category: "Accuracy", title: "Currency rounding drift", control: "Integer cents and a tested split invariant", residual: "Currency-specific rules must remain explicit.", nodeIds: ["engine"] },
      { category: "Session", title: "JWT stolen from persistent storage", control: "Token kept in memory rather than localStorage", residual: "An active XSS can still act within the current session.", nodeIds: ["merchant", "api"] },
    ],
    decisions: [
      { title: "Money is integer cents", summary: "Make exactness a type-level convention.", reason: "Binary floating point is the wrong representation for installment invariants.", tradeoff: "Currency scale and formatting remain explicit concerns.", revisit: "When a decimal library is required for multi-currency rules.", nodeIds: ["engine", "postgres"] },
      { title: "Lock before payment", summary: "Serialize the critical state transition.", reason: "Two valid requests must not both observe an unpaid installment.", tradeoff: "Contention is concentrated on the payment row.", revisit: "At scale, after measuring contention and provider semantics.", nodeIds: ["engine", "postgres"] },
      { title: "Search is not the ledger", summary: "Separate discoverability from financial truth.", reason: "A search index should be rebuildable and disposable.", tradeoff: "Projection lag must be visible to the merchant.", revisit: "Never for authoritative payment state.", nodeIds: ["postgres", "search"] },
    ],
    operations: [
      { question: "What if two payments arrive together?", behavior: "One transaction holds the row lock; the other observes the resulting paid state.", signal: "The second request returns the already-paid outcome.", response: "Treat the retry as idempotent instead of issuing another update.", nodeIds: ["engine", "postgres"] },
      { question: "What if search is unavailable?", behavior: "Payment truth remains in PostgreSQL while merchant discovery is degraded.", signal: "Search requests fail independently of ledger writes.", response: "Restore or rebuild the projection without rewriting payment history.", nodeIds: ["api", "postgres", "search"] },
    ],
    evidence: [
      { label: "Public source", title: "FintechDemo repository", detail: "Exposes the service boundaries, transactional implementation, and tests.", href: "https://github.com/PontoPe/FintechDemo", nodeIds: ["api", "engine", "postgres"] },
      { label: "Concurrency proof", title: "Payment transaction excerpt", detail: "Shows serializable isolation, the row lock, and idempotent paid-state handling.", nodeIds: ["engine", "postgres"] },
      { label: "Invariant proof", title: "Exact installment split", detail: "The remainder distribution keeps the installment sum equal to the order total.", nodeIds: ["engine"] },
    ],
    results: ["Payment state remains safe under concurrent requests", "Installment totals remain exact without floating-point arithmetic", "Merchant search and dashboards remain separate from the authoritative ledger"],
    retrospective: {
      worked: ["Financial invariants are visible in the code and tests.", "Service boundaries separate truth, search, and presentation."],
      next: ["Provider-level idempotency integration", "Outbox-driven search projection", "Longer-running concurrency tests"],
      demonstrates: ["Go backend engineering", "Transactional reasoning", "Full-stack service design"],
    },
    previousSlug: "hyundai",
    nextSlug: "jbs",
  },

  jbs: {
    slug: "jbs",
    vmName: "jbs-stream-console",
    status: "Delivered",
    environment: "Sanitized data-engineering case study",
    role: "Data pipeline engineer",
    outcome:
      "Designed a streaming path that decouples production events from analytics and preserves processing continuity during load peaks.",
    ownership: ["Ingestion design", "Kafka consumer behavior", "Transformation", "Durable writes", "Operational visibility"],
    notice: "Topology and operational details are generalized to preserve enterprise boundaries.",
    theme: themes.jbs,
    layout: "evidence-first",
    sectionOrder: ["overview", "operations", "decisions", "security", "implementation", "evidence", "results"],
    metrics: [
      { value: "Kafka", label: "decoupled ingestion backbone" },
      { value: "Manual", label: "offset commit after durable write" },
      { value: "TLS", label: "authenticated and encrypted transport pattern" },
      { value: "Lake", label: "analytics destination" },
    ],
    problem: [
      "Production metrics arrive unevenly, but executive and operational analysis still depends on a complete, ordered-enough history.",
      "The pipeline separates event production from downstream processing so a load peak or consumer interruption does not automatically become data loss.",
    ],
    constraints: ["Bursting event volume", "Durable processing", "Replay safety", "Enterprise confidentiality", "Analytics-oriented output"],
    nodes: [
      { id: "production", label: "Production Systems", zone: "trusted", eyebrow: "Event producers", responsibility: "Emit operational metrics without waiting for analytics.", data: "Production metric events", exposure: "Enterprise network", failure: "Producer retry must not create double-counted outcomes." },
      { id: "kafka", label: "Kafka", zone: "trusted", eyebrow: "Durable buffer", responsibility: "Decouples producers from consumers and absorbs load peaks.", data: "Partitioned metric stream", exposure: "Authenticated cluster path", failure: "Retention preserves events while consumers recover." },
      { id: "consumer", label: "Python Consumer", zone: "internal", eyebrow: "Processing", responsibility: "Decodes, validates, and writes each event before committing its offset.", data: "Validated event and partition metadata", exposure: "Consumer group identity", failure: "An uncommitted event can be replayed safely." },
      { id: "lake", label: "Data Lake", zone: "internal", eyebrow: "Durable analytics", responsibility: "Stores idempotent event records for analysis.", data: "Partitioned production history", exposure: "Analytics boundary", failure: "Upsert key prevents replay from double-counting." },
      { id: "dashboard", label: "Executive Views", zone: "trusted", eyebrow: "Decision surface", responsibility: "Turns durable history into operational efficiency views.", data: "Aggregated metrics", exposure: "Authorized internal users", failure: "Dashboard delay does not stop ingestion." },
    ],
    flow: [
      { title: "Systems emit metrics", summary: "Producers publish without coupling themselves to analytics latency.", nodeIds: ["production", "kafka"] },
      { title: "Kafka absorbs the peak", summary: "Partitions retain work until the consumer can process it.", nodeIds: ["kafka"] },
      { title: "Consumer validates the event", summary: "Malformed data is separated from durable analytics writes.", nodeIds: ["kafka", "consumer"] },
      { title: "Lake write happens first", summary: "The event is upserted before its offset is committed.", nodeIds: ["consumer", "lake"] },
      { title: "Dashboards read the history", summary: "Executive views remain downstream of durable truth.", nodeIds: ["lake", "dashboard"] },
    ],
    threats: [
      { category: "Integrity", title: "Replay double-counts a metric", control: "Idempotent upsert keyed by event identity", residual: "A bad or reused producer ID can still merge distinct events.", nodeIds: ["consumer", "lake"] },
      { category: "Loss", title: "Offset commits before durable write", control: "Manual synchronous commit after the lake write", residual: "A permanently poison event needs a governed dead-letter path.", nodeIds: ["kafka", "consumer", "lake"] },
      { category: "Transport", title: "Stream credentials or data intercepted", control: "Authenticated encrypted Kafka transport pattern", residual: "Broker and client certificate operations remain critical.", nodeIds: ["production", "kafka", "consumer"] },
    ],
    decisions: [
      { title: "Commit after durable write", summary: "Prefer replay over silent loss.", reason: "The offset represents completed work, not merely received work.", tradeoff: "Consumers must make reprocessing safe.", revisit: "Only with a transactional end-to-end processing model.", nodeIds: ["kafka", "consumer", "lake"] },
      { title: "Decouple analytics", summary: "Keep production systems independent from dashboard latency.", reason: "Operational event generation should not block on downstream analysis.", tradeoff: "Dashboards become eventually consistent.", revisit: "When a use case explicitly requires synchronous feedback.", nodeIds: ["production", "kafka", "dashboard"] },
      { title: "Idempotent lake writes", summary: "Give replay an exactly-once effect.", reason: "At-least-once delivery is practical only when repeated work is harmless.", tradeoff: "Event identity quality becomes a core contract.", revisit: "As schemas and partition strategy evolve.", nodeIds: ["consumer", "lake"] },
    ],
    operations: [
      { question: "What if the consumer stops?", behavior: "Kafka retains the backlog while producers continue publishing.", signal: "Consumer lag grows by partition.", response: "Restore processing, watch catch-up rate, and investigate poison events.", nodeIds: ["kafka", "consumer"] },
      { question: "What if a write succeeds before a crash?", behavior: "The uncommitted event is delivered again.", signal: "The same event ID appears in a replay attempt.", response: "Idempotent upsert preserves one analytical record, then commit.", nodeIds: ["consumer", "lake"] },
    ],
    evidence: [
      { label: "Sanitized source", title: "Consumer commit excerpt", detail: "Shows secure transport configuration, manual commits, and idempotent writes.", nodeIds: ["kafka", "consumer", "lake"] },
      { label: "Architecture", title: "Producer-to-dashboard lineage", detail: "Makes the buffering and durable-write boundaries explicit.", nodeIds: ["production", "kafka", "consumer", "lake", "dashboard"] },
    ],
    results: ["Production event generation is decoupled from analytics latency", "Replay can recover work without double-counting the lake record", "Durable history supports granular operational views"],
    retrospective: {
      worked: ["Kafka isolates burst handling from analysis.", "Commit order gives failure behavior a clear rule."],
      next: ["Schema registry governance", "Dead-letter workflow", "Lag-based capacity forecasting"],
      demonstrates: ["Streaming architecture", "Data integrity reasoning", "Operational pipeline design"],
    },
    previousSlug: "fintech",
    nextSlug: "cowrec",
  },

  cowrec: {
    slug: "cowrec",
    vmName: "cowrec-edge",
    status: "Live",
    environment: "Edge computer-vision system",
    role: "Computer vision and backend engineer",
    outcome:
      "Moved livestock recognition and behavioral analysis to the edge so raw video can stay local while useful herd telemetry moves outward.",
    ownership: ["Detection pipeline", "Tracking", "Edge processing", "Telemetry model", "Backend API", "Containerization"],
    theme: themes.cowrec,
    layout: "product-first",
    sectionOrder: ["overview", "decisions", "operations", "implementation", "security", "evidence", "results"],
    metrics: [
      { value: "Edge", label: "primary inference location" },
      { value: "YOLOv8", label: "detection and tracking model" },
      { value: "Local", label: "raw-video processing boundary" },
      { value: "API", label: "aggregated telemetry surface" },
    ],
    problem: [
      "Precision livestock work needs individual-animal signals, but sending continuous barn video to a central platform is expensive and privacy-heavy.",
      "CowRec places inference near the cameras, then promotes only the tracking and behavioral information needed for farm decisions.",
    ],
    constraints: ["Real-time video", "Edge compute limits", "Changing light and occlusion", "Stable animal identity", "Raw-video locality"],
    nodes: [
      { id: "camera", label: "Barn Cameras", zone: "trusted", eyebrow: "Visual input", responsibility: "Provide real-time RTSP frames from the monitored area.", data: "Raw video frames", exposure: "Farm network", failure: "A missing or degraded stream reduces coverage." },
      { id: "capture", label: "Frame Capture", zone: "internal", eyebrow: "Edge ingress", responsibility: "Reads and timestamps frames for local inference.", data: "Current frame and capture metadata", exposure: "Edge box only", failure: "Drops or skips frames rather than blocking the full pipeline." },
      { id: "model", label: "YOLOv8 Tracker", zone: "internal", eyebrow: "Inference", responsibility: "Detects animals and maintains tracking identities across frames.", data: "Boxes, confidence, track IDs", exposure: "Local model runtime", failure: "Low confidence prevents a strong observation." },
      { id: "registry", label: "Animal Registry", zone: "internal", eyebrow: "Behavior state", responsibility: "Connects tracks to per-animal observations and anomaly rules.", data: "Identity, trajectory, behavioral aggregates", exposure: "Edge application state", failure: "Unresolved identity stays unassigned rather than guessed." },
      { id: "telemetry", label: "Telemetry API", zone: "trusted", eyebrow: "Outbound summary", responsibility: "Shares aggregates and review alerts without raw frames.", data: "Health and productivity signals", exposure: "Controlled application surface", failure: "Local inference continues while upload is unavailable." },
    ],
    flow: [
      { title: "Camera provides a frame", summary: "The edge device receives the current barn view.", nodeIds: ["camera", "capture"] },
      { title: "Model detects and tracks", summary: "YOLOv8 produces boxes, confidence, and persistent track IDs.", nodeIds: ["capture", "model"] },
      { title: "Registry resolves identity", summary: "Observations accumulate around a stable animal record.", nodeIds: ["model", "registry"] },
      { title: "Rules flag review candidates", summary: "Behavioral changes become review-oriented alerts, not diagnoses.", nodeIds: ["registry"] },
      { title: "Only aggregates leave", summary: "Telemetry moves outward while raw video remains local.", nodeIds: ["registry", "telemetry"] },
    ],
    threats: [
      { category: "Privacy", title: "Raw farm video leaves the edge", control: "Local inference and aggregate-only telemetry design", residual: "Edge device compromise can still expose local frames.", nodeIds: ["camera", "capture", "model", "telemetry"] },
      { category: "Integrity", title: "Tracking identity drifts", control: "Persistent IDs plus confidence and unresolved-state handling", residual: "Occlusion can still require human review.", nodeIds: ["model", "registry"] },
      { category: "Availability", title: "Network interruption stops analysis", control: "Inference and state processing remain local", residual: "Remote telemetry is delayed until connectivity returns.", nodeIds: ["registry", "telemetry"] },
    ],
    decisions: [
      { title: "Inference at the edge", summary: "Keep the expensive and sensitive stream near its source.", reason: "The useful output is behavior data, not centralized raw footage.", tradeoff: "Deployment and model updates must reach distributed edge boxes.", revisit: "When connectivity, cost, and governance justify centralized processing.", nodeIds: ["camera", "capture", "model"] },
      { title: "Aggregate before export", summary: "Move derived signals, not frames.", reason: "Reduces bandwidth and limits the external data surface.", tradeoff: "Remote teams cannot re-run inference on the original footage.", revisit: "For explicitly consented diagnostic capture workflows.", nodeIds: ["registry", "telemetry"] },
      { title: "Low confidence means review", summary: "Do not turn uncertainty into a hard result.", reason: "Barn conditions vary and identity mistakes compound over time.", tradeoff: "Some observations remain unresolved.", revisit: "As calibration data and model quality improve.", nodeIds: ["model", "registry"] },
    ],
    operations: [
      { question: "What if the camera feed drops?", behavior: "The capture loop marks the stream unavailable and stops creating observations.", signal: "Frame timestamp age exceeds the expected interval.", response: "Recover the feed before treating missing telemetry as animal behavior.", nodeIds: ["camera", "capture"] },
      { question: "What if confidence falls below threshold?", behavior: "The system withholds a strong identity or behavior conclusion.", signal: "Low-confidence detections increase in the local runtime.", response: "Review camera position, lighting, calibration, and model fit.", nodeIds: ["model", "registry"] },
    ],
    evidence: [
      { label: "Public source", title: "CowRec repository", detail: "Shows the computer-vision and backend project structure.", href: "https://github.com/PontoPe/CowRec", nodeIds: ["capture", "model", "registry"] },
      { label: "Live surface", title: "CowRec web experience", detail: "Presents the project and its livestock-tracking outcome.", href: "https://cowrec.com", nodeIds: ["telemetry"] },
      { label: "Implementation", title: "Edge detection excerpt", detail: "Connects tracking, per-animal state, review alerts, and aggregate telemetry.", nodeIds: ["model", "registry", "telemetry"] },
    ],
    results: ["Raw video processing is kept at the edge", "Per-animal observations become useful aggregated telemetry", "Network loss does not automatically stop local inference"],
    retrospective: {
      worked: ["The data boundary matches the useful product output.", "Confidence-aware behavior keeps uncertainty visible."],
      next: ["Stronger long-term identity evaluation", "Field calibration workflow", "Edge deployment observability"],
      demonstrates: ["Computer vision systems", "Edge architecture", "Privacy-aware data reduction"],
    },
    previousSlug: "jbs",
    nextSlug: "docker-tracker",
  },

  "docker-tracker": {
    slug: "docker-tracker",
    vmName: "tracker-request-lab",
    status: "MIT licensed",
    environment: "Local container simulation",
    role: "Backend and DevOps engineer",
    outcome:
      "Separated fast atomic counting from durable auditing in a three-service tracking stack with explicit privacy and failure boundaries.",
    ownership: ["FastAPI endpoint", "Redis counters", "PostgreSQL audit", "Docker networks", "Health checks", "Privacy controls"],
    theme: themes.tracker,
    layout: "architecture-first",
    sectionOrder: ["overview", "security", "operations", "decisions", "implementation", "evidence", "results"],
    metrics: [
      { value: "3", label: "orchestrated services" },
      { value: "1×1", label: "transparent GIF response" },
      { value: "Atomic", label: "Redis counter update" },
      { value: "0", label: "PII values embedded in the URL" },
    ],
    problem: [
      "A tracking pixel looks trivial until counting, durable history, caching, privacy, and partial failure arrive together.",
      "The project uses a small request path to demonstrate clear service responsibilities: FastAPI handles the contract, Redis handles the hot counter, and PostgreSQL keeps the durable audit record.",
    ],
    constraints: ["Fast response path", "Atomic increments", "Durable audit", "No PII in tracking URL", "Container startup ordering"],
    nodes: [
      { id: "email", label: "Email Client", zone: "public", eyebrow: "External requester", responsibility: "Requests the transparent GIF when remote images are loaded.", data: "Opaque token and request metadata", exposure: "Untrusted client behavior", failure: "Caching or image blocking can prevent an event." },
      { id: "api", label: "FastAPI", zone: "trusted", eyebrow: "Request boundary", responsibility: "Validates the token, coordinates storage, and returns hardened GIF headers.", data: "Opaque token and minimized context", exposure: "Public tracking route", failure: "Returns a safe response without leaking internals." },
      { id: "redis", label: "Redis", zone: "internal", eyebrow: "Hot counter", responsibility: "Applies atomic engagement-counter updates.", data: "Counter and hashed client context", exposure: "Internal container network", failure: "Fast counting is unavailable until Redis recovers." },
      { id: "postgres", label: "PostgreSQL", zone: "internal", eyebrow: "Durable audit", responsibility: "Stores the longer-lived event record.", data: "Token reference and event metadata", exposure: "Internal only", failure: "Audit failure remains visible instead of silently claiming durability." },
      { id: "pixel", label: "GIF Response", zone: "trusted", eyebrow: "Hardened output", responsibility: "Returns the fixed 1×1 image with no-store and restrictive headers.", data: "Static GIF bytes", exposure: "Public response", failure: "Client receives a bounded media response." },
    ],
    flow: [
      { title: "Email client requests the pixel", summary: "The URL carries an opaque token, not a recipient's PII.", nodeIds: ["email", "api"] },
      { title: "API validates context", summary: "The public request is treated as untrusted before storage work.", nodeIds: ["api"] },
      { title: "Redis increments atomically", summary: "The fast counter update remains one transaction.", nodeIds: ["api", "redis"] },
      { title: "PostgreSQL records the audit", summary: "Durable history remains separate from the hot counter.", nodeIds: ["api", "postgres"] },
      { title: "Hardened GIF returns", summary: "The client receives a fixed image with restrictive cache and content headers.", nodeIds: ["api", "pixel"] },
    ],
    threats: [
      { category: "Privacy", title: "Tracking URL exposes recipient identity", control: "Opaque token with no PII in the path", residual: "The token still acts as a correlatable identifier.", nodeIds: ["email", "api"] },
      { category: "Data", title: "Client IP becomes sensitive history", control: "Hash before storage and minimize request context", residual: "Hashes of low-entropy addresses can still be sensitive.", nodeIds: ["api", "redis", "postgres"] },
      { category: "Integrity", title: "Concurrent opens lose increments", control: "Atomic Redis pipeline", residual: "Counter and audit stores can temporarily diverge during failure.", nodeIds: ["redis", "postgres"] },
    ],
    decisions: [
      { title: "Split counter and audit", summary: "Use each store for the behavior it serves best.", reason: "Fast atomic updates and durable history have different access patterns.", tradeoff: "The service must make partial failure explicit.", revisit: "When one datastore can satisfy both workloads without losing clarity.", nodeIds: ["redis", "postgres"] },
      { title: "Opaque token only", summary: "Keep identity details out of the URL.", reason: "URLs leak into logs, screenshots, and referrers.", tradeoff: "Token lookup or mapping is required elsewhere.", revisit: "Never for direct PII; only the token format may evolve.", nodeIds: ["email", "api"] },
      { title: "Harden the tiny response", summary: "A one-pixel asset still deserves correct headers.", reason: "Caching and content sniffing can change observed behavior.", tradeoff: "The response path carries a few more explicit rules.", revisit: "When browser behavior or privacy policy changes.", nodeIds: ["api", "pixel"] },
    ],
    operations: [
      { question: "What if Redis is unavailable?", behavior: "The atomic counter cannot be updated.", signal: "Internal connection and health checks fail.", response: "Return a bounded response policy and restore the counter service before claiming the event.", nodeIds: ["api", "redis", "pixel"] },
      { question: "What if PostgreSQL is slow?", behavior: "Durable auditing becomes the long pole in the request path.", signal: "Audit latency rises independently of the Redis increment.", response: "Preserve explicit failure semantics; do not silently present an incomplete audit as durable.", nodeIds: ["api", "postgres"] },
    ],
    evidence: [
      { label: "Public source", title: "Docker tracker repository", detail: "Shows the endpoint, services, and containerized project structure.", href: "https://github.com/PontoPe/docker-email-read-status.git", nodeIds: ["api", "redis", "postgres"] },
      { label: "Implementation", title: "Tracking endpoint excerpt", detail: "Connects atomic counting, hashed context, durable audit, and hardened headers.", nodeIds: ["api", "redis", "postgres", "pixel"] },
      { label: "Architecture", title: "Three-service network map", detail: "Makes the public route and internal-only stores visible.", nodeIds: ["email", "api", "redis", "postgres"] },
    ],
    results: ["Fast counting and durable auditing have explicit responsibilities", "The public URL contains no direct recipient PII", "Container health and network boundaries are part of the application design"],
    retrospective: {
      worked: ["The small system makes datastore trade-offs easy to inspect.", "Privacy choices are visible in the request contract."],
      next: ["Explicit consent and policy documentation", "More failure-injection tests", "Bounded reconciliation between counter and audit"],
      demonstrates: ["FastAPI backend design", "Container orchestration", "Privacy-aware event systems"],
    },
    previousSlug: "cowrec",
    nextSlug: "owcoach",
  },

  owcoach: {
    slug: "owcoach",
    vmName: "owcoach-vision",
    status: "Complete",
    environment: "Windows desktop · Local inference",
    role: "Computer vision and desktop application engineer",
    outcome:
      "Produced real-time coaching suggestions from screen pixels alone-without process-memory access, injection, or live network dependence.",
    ownership: ["Capture", "Calibration", "Template matching", "Rules engine", "Overlay", "Packaging"],
    theme: themes.owcoach,
    layout: "product-first",
    sectionOrder: ["overview", "decisions", "security", "implementation", "operations", "evidence", "results"],
    metrics: [
      { value: "0.87", label: "template-match confidence threshold" },
      { value: "0", label: "game-memory reads" },
      { value: "0", label: "network calls during play" },
      { value: "Local", label: "counter-rules execution" },
    ],
    problem: [
      "A useful coaching overlay needs to understand the visible match state without crossing into game-process inspection or intrusive client behavior.",
      "OWCoach treats terms-of-service safety as an architectural constraint: it reads the screen, evaluates a local ruleset, and renders a click-through recommendation surface.",
    ],
    constraints: ["Multiple resolutions", "Fast local feedback", "No memory reads", "No injection", "No live network dependence"],
    nodes: [
      { id: "screen", label: "Game Screen", zone: "public", eyebrow: "Visible pixels", responsibility: "Provides the scoreboard and killcam regions already visible to the player.", data: "Rendered screen image", exposure: "User-visible desktop", failure: "Occluded or changed UI reduces detection confidence." },
      { id: "capture", label: "Screen Capture", zone: "trusted", eyebrow: "Local input", responsibility: "Captures only the calibrated screen region.", data: "Local pixel buffer", exposure: "Desktop process", failure: "Calibration can be re-run when the region is invalid." },
      { id: "vision", label: "Template Matcher", zone: "internal", eyebrow: "Detection", responsibility: "Matches authorized hero templates above the confidence threshold.", data: "Hero labels and confidence", exposure: "Local computation", failure: "Low confidence withholds the detection." },
      { id: "rules", label: "Counter Rules", zone: "internal", eyebrow: "Recommendation", responsibility: "Maps the detected enemy composition to local suggestions.", data: "Hero composition and counters", exposure: "No live API", failure: "Falls back to no recommendation when evidence is weak." },
      { id: "overlay", label: "Click-through Overlay", zone: "trusted", eyebrow: "User output", responsibility: "Renders suggestions without intercepting game input.", data: "Local recommendation view", exposure: "Desktop overlay", failure: "Can be hidden without affecting the game." },
    ],
    flow: [
      { title: "Capture the visible region", summary: "Only screen pixels enter the pipeline.", nodeIds: ["screen", "capture"] },
      { title: "Calibrate for the resolution", summary: "The relevant HUD area is located before matching.", nodeIds: ["capture"] },
      { title: "Match above threshold", summary: "Weak candidates stay unresolved rather than becoming false heroes.", nodeIds: ["capture", "vision"] },
      { title: "Evaluate local counters", summary: "The rules engine makes no network request during play.", nodeIds: ["vision", "rules"] },
      { title: "Render without stealing input", summary: "The overlay remains click-through.", nodeIds: ["rules", "overlay"] },
    ],
    threats: [
      { category: "TOS", title: "Tool crosses into game memory", control: "Screen-space capture only; no process-memory access or injection", residual: "Game policy can still change and should be reviewed.", nodeIds: ["screen", "capture"] },
      { category: "Privacy", title: "Live session data leaves the device", control: "Local rules and zero network calls during play", residual: "Offline data refresh still needs an explicit update path.", nodeIds: ["vision", "rules"] },
      { category: "Integrity", title: "False-positive hero detection", control: "Calibration plus a 0.87 confidence threshold", residual: "UI changes and visual overlap can still reduce accuracy.", nodeIds: ["capture", "vision"] },
    ],
    decisions: [
      { title: "Screen-space only", summary: "Use what the player can already see.", reason: "Avoid process inspection, injection, and hidden game-state access.", tradeoff: "Visual detection is less reliable than direct internal data.", revisit: "Never toward memory access; only improve the visual pipeline.", nodeIds: ["screen", "capture", "vision"] },
      { title: "Local rules during play", summary: "Keep the match path independent from external services.", reason: "Latency, privacy, and availability all improve when recommendations stay local.", tradeoff: "Rules need an offline update mechanism.", revisit: "Only for clearly disclosed, non-match-time data refresh.", nodeIds: ["rules"] },
      { title: "Confidence before recommendation", summary: "Prefer no answer to a confident-looking wrong answer.", reason: "Bad detections undermine the entire coaching layer.", tradeoff: "Some match states produce no suggestion.", revisit: "As calibration and template quality improve.", nodeIds: ["vision", "rules"] },
    ],
    operations: [
      { question: "What if calibration is wrong?", behavior: "The matcher sees the wrong pixels and confidence falls.", signal: "Expected hero candidates disappear or stay below threshold.", response: "Re-run local calibration for the current resolution and UI layout.", nodeIds: ["capture", "vision"] },
      { question: "What if no hero clears the threshold?", behavior: "The pipeline withholds the affected recommendation.", signal: "The low-confidence state remains visible in diagnostics.", response: "Keep the overlay quiet and wait for a clearer frame.", nodeIds: ["vision", "rules", "overlay"] },
    ],
    evidence: [
      { label: "Implementation", title: "Screen-space detection excerpt", detail: "Shows local capture, calibration, thresholding, rules, and overlay output.", nodeIds: ["capture", "vision", "rules", "overlay"] },
      { label: "Architecture", title: "Screen-only trust boundary", detail: "Makes the absence of memory and live-network paths explicit.", nodeIds: ["screen", "capture", "rules"] },
      { label: "Product behavior", title: "Packaged Windows overlay", detail: "Demonstrates the click-through desktop delivery model.", nodeIds: ["overlay"] },
    ],
    results: ["Recommendations use visible pixels rather than hidden process state", "The match-time path runs locally without network calls", "Low-confidence input fails quietly instead of inventing certainty"],
    retrospective: {
      worked: ["Safety constraints produced a cleaner architecture.", "Calibration and thresholds keep uncertainty explicit."],
      next: ["Broader resolution testing", "Authorized visual regression fixtures", "Clearer offline data-update provenance"],
      demonstrates: ["Real-time computer vision", "Desktop application design", "Constraint-driven engineering"],
    },
    previousSlug: "docker-tracker",
    nextSlug: "zombiesweb",
  },

  zombiesweb: {
    slug: "zombiesweb",
    vmName: "kronorium-index",
    status: "Live",
    environment: "Dual-mode static-first web product",
    role: "Product designer and frontend architect",
    outcome:
      "Designed ZombiesWeb as two purpose-built products within one project: an exploratory lore system for time-rich sessions and a rapid field manual for players already mid-round.",
    ownership: ["Product strategy", "Information architecture", "Astro build", "React islands", "Timeline interaction", "Field manuals", "Performance"],
    theme: themes.zombies,
    layout: "product-first",
    sectionOrder: ["overview", "decisions", "evidence", "implementation", "operations", "security", "results"],
    metrics: [
      { value: "2", label: "products inside one connected project" },
      { value: "Explore", label: "Kronorium interaction mode", note: "Between sessions or on a larger screen" },
      { value: "Retrieve", label: "Field Manual interaction mode", note: "During a live round on phone or second monitor" },
      { value: "Static", label: "default delivery outside interactive islands" },
    ],
    problem: [
      "ZombiesWeb serves an overlapping audience in two incompatible moments. A lore fan between sessions wants to wander, compare eras, follow branches, and tolerate complexity. The same person during round 18 wants one shield location immediately and cannot afford to explore.",
      "Treating both moments as one conventional website would make the Kronorium too shallow and the Field Manual too slow. ZombiesWeb is therefore structured as two complementary sites within one project, sharing a universe and routes while using different information density, navigation, typography, interaction, and technical delivery.",
      "The visual split is functional rather than cosmetic: the Kronorium behaves like an archival knowledge graph; the Field Manual behaves like operational documentation under time pressure.",
    ],
    constraints: ["Overlapping users with different intent", "Between-session exploration", "Mid-round time pressure", "Phone or second-monitor use", "Large lore graph", "Selective hydration", "Fan-project asset boundaries"],
    nodes: [
      { id: "fan", label: "Player", zone: "public", eyebrow: "Reader", responsibility: "Browses lore or checks a guide while playing.", data: "Navigation and local interaction state", exposure: "Public web", failure: "Static content remains readable when an island fails." },
      { id: "astro", label: "Astro Pages", zone: "trusted", eyebrow: "Static shell", responsibility: "Ships fast HTML for guides, navigation, and project content.", data: "Prebuilt content", exposure: "Public static site", failure: "Pages remain available without app-wide hydration." },
      { id: "kronorium", label: "Kronorium Island", zone: "trusted", eyebrow: "Interactive graph", responsibility: "Supports pan, zoom, drag, and storyline traversal.", data: "Timeline nodes and edges", exposure: "Hydrated React island", failure: "Only the interactive timeline is affected." },
      { id: "guides", label: "Field Manuals", zone: "trusted", eyebrow: "Mid-round reference", responsibility: "Presents one task, part, or location as a fast, independently routable answer.", data: "Static guide content", exposure: "Public pages", failure: "Individual content remains independently routable." },
      { id: "assets", label: "Content Assets", zone: "internal", eyebrow: "Build inputs", responsibility: "Feeds optimized images and structured lore content into the static build.", data: "Images and content data", exposure: "Build-time source", failure: "A missing asset fails the affected build or route." },
    ],
    flow: [
      { title: "The moment defines the product", summary: "A visitor chooses between understanding the universe and solving an immediate in-game problem.", nodeIds: ["fan", "astro"] },
      { title: "Field Manual answers immediately", summary: "Static routes, anchor navigation, scan-friendly headings, and location images minimize time away from play.", nodeIds: ["astro", "guides"] },
      { title: "Kronorium invites exploration", summary: "React Flow hydrates where pan, zoom, selection, filtering, and graph traversal add meaning.", nodeIds: ["astro", "kronorium"] },
      { title: "Story relationships stay spatial", summary: "Directional edges and distinct node types expose branches, fractures, eras, and convergence.", nodeIds: ["kronorium"] },
      { title: "One content system supports both", summary: "Structured lore and media feed two interfaces without forcing them into the same interaction model.", nodeIds: ["assets", "astro", "kronorium", "guides"] },
    ],
    threats: [
      { category: "Performance", title: "Interactive graph slows every page", control: "Static-first delivery with selective island hydration", residual: "The Kronorium itself remains a heavier route.", nodeIds: ["astro", "kronorium"] },
      { category: "Web security", title: "Fan content expands script or framing risk", control: "Restrictive CSP and frame protections in the deployment design", residual: "Third-party media and future integrations need review.", nodeIds: ["astro", "assets"] },
      { category: "Product fit", title: "One interface serves both moments poorly", control: "Separate exploratory and retrieval modes under one shared information architecture", residual: "Some visitors still need clear orientation when moving between them.", nodeIds: ["fan", "kronorium", "guides"] },
    ],
    decisions: [
      { title: "Structure one project as two products", summary: "Let the user's moment, not visual consistency, choose the interface.", reason: "The audience overlaps, but available attention, device posture, and desired outcome change completely between lore exploration and live play.", tradeoff: "The two design systems need to feel connected without making either product compromise its purpose.", revisit: "When research shows users regularly need a third mode or cannot identify which side fits their task.", nodeIds: ["fan", "astro", "kronorium", "guides"] },
      { title: "Make the Kronorium spatial and editorial", summary: "Use a full-canvas graph, pan and zoom, branching paths, archival gold, and progressive detail.", reason: "Its job is sensemaking: visitors need to see relationships and are willing to spend time exploring them.", tradeoff: "The flagship route carries more JavaScript, more density, and works best with space.", revisit: "As the graph grows or mobile exploration becomes a stronger requirement.", nodeIds: ["kronorium"] },
      { title: "Make Field Manuals linear and operational", summary: "Use static routes, strong anchors, compact headings, orange wayfinding, and image-first location cards.", reason: "Its job is retrieval: a player should reach one actionable answer with minimal reading and no canvas interaction.", tradeoff: "The format deliberately sacrifices narrative immersion and cross-story context.", revisit: "As new guide types reveal different mid-round lookup patterns.", nodeIds: ["fan", "astro", "guides"] },
    ],
    operations: [
      { question: "What if a mid-round answer takes too long to find?", behavior: "The guide has failed its primary job even when every fact is correct.", signal: "Long scans, repeated backtracking, or players returning to search.", response: "Shorten the path, strengthen anchors, and put location imagery beside the instruction it proves.", nodeIds: ["fan", "guides"] },
      { question: "What if the Kronorium graph grows?", behavior: "Node and edge density increases visual and runtime pressure.", signal: "Longer interaction startup and crowded navigation.", response: "Partition story eras, lazy-load detail, and preserve filters, minimap navigation, and direct guide routes.", nodeIds: ["kronorium", "assets"] },
    ],
    evidence: [
      { label: "Live product system", title: "One project, two interfaces", detail: "The production site makes the exploratory Kronorium and retrieval-focused Field Manuals directly comparable.", href: "https://zombies-web.vercel.app/", nodeIds: ["fan", "astro", "kronorium", "guides"] },
      { label: "Public source", title: "ZombiesWeb repository", detail: "Shows the Astro, React, and content architecture.", href: "https://github.com/PontoPe/ZombiesWeb", nodeIds: ["astro", "kronorium", "assets"] },
      { label: "Interactive proof", title: "Kronorium and Richtofen's lab", detail: "Project gallery captures the two most visual interaction surfaces.", nodeIds: ["kronorium"] },
    ],
    results: ["One audience can move between discovery and utility without forcing either moment into a compromise interface", "The Kronorium makes branching lore explorable through spatial interaction", "Field Manuals remain fast, direct, and usable during active play"],
    retrospective: {
      worked: ["The two products feel connected while each remains optimized for a different job.", "The architecture spends hydration only where exploration earns it."],
      next: ["Measure transitions between the two modes", "More graph partitioning", "Formal lookup-time testing on guide pages"],
      demonstrates: ["Product strategy", "Context-driven interaction design", "Frontend architecture"],
    },
    previousSlug: "owcoach",
    nextSlug: "portfolio",
  },

  portfolio: {
    slug: "portfolio",
    vmName: "portfolio-meta",
    status: "Live",
    environment: "Next.js static portfolio",
    role: "Designer and frontend engineer",
    outcome:
      "Built a terminal-inspired portfolio that connects engineering claims to inspectable systems, decisions, source excerpts, and evidence.",
    ownership: ["Visual system", "Next.js architecture", "Interactive terminal", "Project content", "Responsive behavior", "Accessibility"],
    theme: themes.portfolio,
    layout: "evidence-first",
    sectionOrder: ["overview", "decisions", "implementation", "evidence", "operations", "security", "results"],
    metrics: [
      { value: "12", label: "project case-study routes" },
      { value: "Static", label: "exported page architecture" },
      { value: "Local", label: "interactive terminal filesystem" },
      { value: "A11y", label: "keyboard-first control model" },
    ],
    problem: [
      "Backend and cybersecurity work is difficult to present because the most valuable parts are often invisible: boundaries, ownership, failure handling, and proof.",
      "The portfolio combines a strong terminal identity with project-specific case studies that let a visitor inspect the system instead of translating dense prose alone.",
    ],
    constraints: ["Static deployment", "Many project types", "Fast first read", "Keyboard and mobile access", "No sensitive production details"],
    nodes: [
      { id: "visitor", label: "Visitor", zone: "public", eyebrow: "Recruiter or engineer", responsibility: "Moves between selected work, writing, and the interactive terminal.", data: "Navigation and local interaction", exposure: "Public web", failure: "Core links and content remain normal HTML." },
      { id: "next", label: "Next.js App", zone: "trusted", eyebrow: "Static shell", responsibility: "Builds the portfolio routes and shared presentation system.", data: "Project profiles and page metadata", exposure: "Public static output", failure: "A route can fail independently during build validation." },
      { id: "profiles", label: "Case-study Data", zone: "internal", eyebrow: "Structured content", responsibility: "Keeps architecture, threats, decisions, and evidence relationships reusable.", data: "Sanitized project narratives", exposure: "Build-time module", failure: "Missing data is caught during type checking." },
      { id: "viewer", label: "System Viewer", zone: "trusted", eyebrow: "Interactive island", responsibility: "Cross-highlights topology, flow, threats, source, and evidence.", data: "Device-local selection state", exposure: "Browser interaction", failure: "Semantic page sections remain readable." },
      { id: "assets", label: "Project Evidence", zone: "internal", eyebrow: "Public artifacts", responsibility: "Provides screenshots, code excerpts, links, and documents.", data: "Sanitized public evidence", exposure: "Static assets and external links", failure: "Captions preserve what each item is meant to prove." },
    ],
    flow: [
      { title: "Visitor chooses a project", summary: "A normal static route opens with the outcome and ownership.", nodeIds: ["visitor", "next"] },
      { title: "Profile shapes the page", summary: "Structured content defines theme, order, system, risks, and decisions.", nodeIds: ["next", "profiles"] },
      { title: "Viewer connects the details", summary: "One selection highlights related elements across the case study.", nodeIds: ["profiles", "viewer"] },
      { title: "Evidence supports the claim", summary: "Screenshots, links, and excerpts explain what they demonstrate.", nodeIds: ["viewer", "assets"] },
      { title: "Static sections remain readable", summary: "The narrative does not depend on operating the viewer.", nodeIds: ["next", "visitor"] },
    ],
    threats: [
      { category: "Credibility", title: "Claims lack inspectable support", control: "Evidence captions and linked implementation context", residual: "Some enterprise details must remain generalized.", nodeIds: ["profiles", "assets"] },
      { category: "Privacy", title: "Case studies expose sensitive infrastructure", control: "Sanitized content and explicit NDA boundaries", residual: "Every new asset still requires review before publication.", nodeIds: ["profiles", "assets"] },
      { category: "Accessibility", title: "Technical interaction becomes mouse-only", control: "Native controls, visible focus, text fallbacks, and reduced motion", residual: "Complex diagrams still require ongoing assistive-technology testing.", nodeIds: ["viewer", "visitor"] },
    ],
    decisions: [
      { title: "One system, many identities", summary: "Reuse behavior while varying visual and narrative emphasis.", reason: "Consistency builds trust, but identical pages flatten the work.", tradeoff: "The content model needs disciplined project-specific profiles.", revisit: "As new project families expose missing components.", nodeIds: ["profiles", "viewer"] },
      { title: "Static content first", summary: "Keep the case study useful before interaction.", reason: "SEO, performance, and accessibility all benefit from real HTML.", tradeoff: "Interactive relationships need a focused client component.", revisit: "Only for tools that genuinely require server state.", nodeIds: ["next", "viewer"] },
      { title: "Sanitize before publishing", summary: "Redaction is a content operation, not a CSS effect.", reason: "A security portfolio cannot leak what it claims to protect.", tradeoff: "Some evidence must remain summarized instead of shown.", revisit: "For every artifact independently.", nodeIds: ["profiles", "assets"] },
    ],
    operations: [
      { question: "What if an interactive tool fails?", behavior: "The semantic case-study sections still explain the project.", signal: "The viewer does not update or hydrate.", response: "Keep the static content path complete and fix the isolated interaction.", nodeIds: ["next", "viewer", "visitor"] },
      { question: "What if a project profile is incomplete?", behavior: "Typed build validation surfaces missing required content.", signal: "The production build fails before the route is published.", response: "Add verified content or deliberately omit the unsupported tool.", nodeIds: ["profiles", "next"] },
    ],
    evidence: [
      { label: "Live artifact", title: "The portfolio itself", detail: "The current page is both the delivery surface and a demonstration of the system.", nodeIds: ["visitor", "next", "viewer"] },
      { label: "Architecture", title: "Typed project profiles", detail: "Show how shared behavior and distinct visual identities are defined from data.", nodeIds: ["profiles", "viewer"] },
      { label: "Interaction", title: "Terminal and case-study tools", detail: "Demonstrate keyboard-accessible, device-local interfaces without external state.", nodeIds: ["visitor", "viewer"] },
    ],
    results: ["Invisible engineering work becomes inspectable", "Project pages share a professional system without becoming identical", "The portfolio remains static, responsive, and grounded in sanitized content"],
    retrospective: {
      worked: ["The terminal identity carries across very different project families.", "Structured profiles make variation intentional instead of ad hoc."],
      next: ["Automated visual regression checks", "Per-project social cards", "More public evidence where confidentiality allows"],
      demonstrates: ["Design systems", "Technical storytelling", "Accessible frontend engineering"],
    },
    previousSlug: "zombiesweb",
    nextSlug: "brasilcon",
    hideSource: true,
  },
};

// TODO(project-case-studies): Review every profile with Pedro before the
// redesigned routes replace the current production portfolio.
