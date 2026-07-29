export type ExposureLevel = "public" | "trusted" | "internal-only";

export type ArchitectureNode = {
  id: string;
  label: string;
  eyebrow: string;
  kind: "client" | "edge" | "service" | "queue" | "worker" | "database";
  zone: ExposureLevel;
  x: number;
  y: number;
  responsibility: string;
  dataHandled: string[];
  inbound: string[];
  outbound: string[];
  exposure: string;
  authentication: string;
  secrets: string;
  failureBehavior: string;
  evidenceIds: string[];
};

export type ArchitectureEdge = {
  id: string;
  from: string;
  to: string;
  label: string;
  protocol: string;
  status: "allowed" | "dependency" | "blocked";
  encrypted: boolean;
  authenticated: boolean;
  crossesTrustBoundary: boolean;
  path: string;
  explanation: string;
};

export type FlowStep = {
  id: string;
  number: string;
  title: string;
  summary: string;
  nodeIds: string[];
  edgeId?: string;
};

export type ThreatControl = {
  id: string;
  category: "Network" | "Input" | "Identity" | "Availability";
  threat: string;
  asset: string;
  entryPoint: string;
  control: string;
  residualRisk: string;
  evidence: string;
  nodeIds: string[];
};

export type Decision = {
  id: string;
  title: string;
  summary: string;
  outcome: string;
  reason: string;
  alternatives: string[];
  chosenApproach: string;
  tradeoff: string;
  revisitWhen: string;
  nodeIds: string[];
};

export type EvidenceItem = {
  id: string;
  type: "Architecture contract" | "Negative test" | "Recovery rehearsal";
  title: string;
  caption: string;
  detail: string;
  excerpt: string;
  proves: string;
  nodeIds: string[];
};

export type SourceCallout = {
  id: string;
  title: string;
  detail: string;
  lineStart: number;
  lineEnd: number;
  nodeIds: string[];
};

export type SourceFile = {
  id: string;
  label: string;
  language: string;
  code: string;
  callouts: SourceCallout[];
};

// TODO(test-project): Replace this fictional content only after Pedro approves the
// layout, interaction density, visual language, and reusable component boundaries.
export const testProjectCaseStudy = {
  slug: "test-project",
  category: "Interactive Prototype / Security Architecture",
  title: "Aegis Relay",
  dates: "Fictional prototype · 2026",
  status: "Concept test",
  oneLineOutcome:
    "A fictional event-intake system that makes trust boundaries, failure behavior, and proof visible before a single real project is redesigned.",
  role: "Case-study system designer",
  environment: "Local visual simulation",
  responsibilities: [
    "Architecture narrative",
    "Interaction model",
    "Threat mapping",
    "Accessible technical communication",
  ],
  stack: ["Next.js", "React", "TypeScript", "CSS Modules", "Accessible HTML"],
  metrics: [
    {
      value: "6",
      label: "selectable system components",
      note: "Prototype property, not a production metric.",
    },
    {
      value: "0",
      label: "direct routes to the audit store",
      note: "Architecture rule shown in the diagram.",
    },
    {
      value: "4",
      label: "modeled threat scenarios",
      note: "Fictional scenarios for testing the interaction.",
    },
    {
      value: "100%",
      label: "local read-only simulation",
      note: "The page makes no API calls and mutates no external data.",
    },
  ],
  problem: [
    "Architecture-heavy portfolio projects often ask the visitor to reconstruct the system from paragraphs. Aegis Relay exists only to test a different presentation: show the system first, then let each decision reveal its context.",
    "The prototype also tests whether a recruiter can move from outcome to topology, threat model, source excerpt, evidence, and retrospective without feeling trapped inside a fake operating system.",
  ],
  constraints: [
    "No real customer or production data",
    "No external API calls",
    "One primary selection at a time",
    "Keyboard and touch parity",
    "Useful at 320px without shrinking desktop UI",
    "Motion must explain state and stop",
  ],
  architecture: {
    nodes: [
      {
        id: "client",
        label: "Event client",
        eyebrow: "Untrusted input",
        kind: "client",
        zone: "public",
        x: 8,
        y: 50,
        responsibility: "Submits a fictional event envelope to the public edge.",
        dataHandled: ["Event type", "Opaque request ID", "Synthetic payload"],
        inbound: ["None"],
        outbound: ["HTTPS request to Edge Shield"],
        exposure: "Public and untrusted.",
        authentication: "Short-lived demo credential.",
        secrets: "No persistent secret in the browser.",
        failureBehavior: "A rejected request receives a generic response with no internal detail.",
        evidenceIds: ["negative-path"],
      },
      {
        id: "edge",
        label: "Edge Shield",
        eyebrow: "Public boundary",
        kind: "edge",
        zone: "public",
        x: 27,
        y: 50,
        responsibility: "Terminates the public connection and applies coarse request limits.",
        dataHandled: ["Headers", "Request size", "Credential metadata"],
        inbound: ["HTTPS from Event client"],
        outbound: ["Authenticated request to Intake API"],
        exposure: "Only intentionally public component.",
        authentication: "Validates the short-lived credential before forwarding.",
        secrets: "Provider-managed signing material, represented only conceptually.",
        failureBehavior: "Rejects excess or unauthenticated traffic before it reaches the trusted zone.",
        evidenceIds: ["architecture-contract", "negative-path"],
      },
      {
        id: "gateway",
        label: "Intake API",
        eyebrow: "Validation gate",
        kind: "service",
        zone: "trusted",
        x: 49,
        y: 28,
        responsibility: "Validates the envelope, normalizes allowed fields, and assigns an idempotency key.",
        dataHandled: ["Validated event", "Request ID", "Idempotency key"],
        inbound: ["Authenticated request from Edge Shield"],
        outbound: ["Normalized message to Durable Queue"],
        exposure: "Private service reachable only through the edge boundary.",
        authentication: "Mutual service identity from the edge.",
        secrets: "Runtime-injected service identity; never shown in this prototype.",
        failureBehavior: "Fails closed with a generic client error and structured internal reason.",
        evidenceIds: ["architecture-contract", "negative-path"],
      },
      {
        id: "queue",
        label: "Durable Queue",
        eyebrow: "Async boundary",
        kind: "queue",
        zone: "internal-only",
        x: 49,
        y: 72,
        responsibility: "Decouples acceptance from processing and contains temporary worker failure.",
        dataHandled: ["Normalized event", "Retry metadata", "Idempotency key"],
        inbound: ["Messages from Intake API"],
        outbound: ["Leased messages to Policy Worker"],
        exposure: "Internal-only; no route from the public network.",
        authentication: "Service identity with publish/consume permissions separated.",
        secrets: "Runtime-managed queue credentials.",
        failureBehavior: "Retains the message for bounded retry instead of losing accepted work.",
        evidenceIds: ["recovery-rehearsal"],
      },
      {
        id: "worker",
        label: "Policy Worker",
        eyebrow: "Processing",
        kind: "worker",
        zone: "internal-only",
        x: 72,
        y: 50,
        responsibility: "Applies deterministic policy and emits a sanitized audit record.",
        dataHandled: ["Normalized event", "Policy outcome", "Sanitized reason"],
        inbound: ["Leased message from Durable Queue"],
        outbound: ["Append operation to Audit Store"],
        exposure: "Internal-only workload with no public listener.",
        authentication: "Consume-only queue identity and append-only audit identity.",
        secrets: "Separate least-privilege runtime identities.",
        failureBehavior: "Returns the message to the queue and never exposes a partial result.",
        evidenceIds: ["recovery-rehearsal"],
      },
      {
        id: "audit",
        label: "Audit Store",
        eyebrow: "Protected evidence",
        kind: "database",
        zone: "internal-only",
        x: 91,
        y: 50,
        responsibility: "Stores append-only fictional decision records for later validation.",
        dataHandled: ["Request ID", "Decision", "Timestamp", "Sanitized reason"],
        inbound: ["Append-only writes from Policy Worker"],
        outbound: ["Read-only evidence export"],
        exposure: "No direct public or trusted-zone route.",
        authentication: "Append-only worker identity; separate read-only evidence identity.",
        secrets: "Managed identity represented without real credentials.",
        failureBehavior: "Worker retries are bounded; duplicates are suppressed by request ID.",
        evidenceIds: ["architecture-contract", "recovery-rehearsal"],
      },
    ] satisfies ArchitectureNode[],
    edges: [
      {
        id: "client-edge",
        from: "client",
        to: "edge",
        label: "Submit event",
        protocol: "HTTPS",
        status: "allowed",
        encrypted: true,
        authenticated: true,
        crossesTrustBoundary: false,
        path: "M 120 240 L 230 240",
        explanation: "The only public path in the model.",
      },
      {
        id: "edge-gateway",
        from: "edge",
        to: "gateway",
        label: "Forward validated request",
        protocol: "mTLS",
        status: "allowed",
        encrypted: true,
        authenticated: true,
        crossesTrustBoundary: true,
        path: "M 310 225 C 370 220, 405 165, 455 145",
        explanation: "Crosses into the trusted service boundary after edge checks.",
      },
      {
        id: "gateway-queue",
        from: "gateway",
        to: "queue",
        label: "Publish normalized event",
        protocol: "Private queue protocol",
        status: "dependency",
        encrypted: true,
        authenticated: true,
        crossesTrustBoundary: true,
        path: "M 490 180 L 490 300",
        explanation: "The queue separates acceptance from processing.",
      },
      {
        id: "queue-worker",
        from: "queue",
        to: "worker",
        label: "Lease work",
        protocol: "Private queue protocol",
        status: "dependency",
        encrypted: true,
        authenticated: true,
        crossesTrustBoundary: false,
        path: "M 535 335 C 590 330, 630 270, 680 250",
        explanation: "The worker receives a bounded processing lease.",
      },
      {
        id: "worker-audit",
        from: "worker",
        to: "audit",
        label: "Append decision",
        protocol: "TLS",
        status: "dependency",
        encrypted: true,
        authenticated: true,
        crossesTrustBoundary: false,
        path: "M 755 240 L 860 240",
        explanation: "The worker can append but cannot rewrite prior evidence.",
      },
      {
        id: "client-audit-blocked",
        from: "client",
        to: "audit",
        label: "No direct route",
        protocol: "Blocked",
        status: "blocked",
        encrypted: false,
        authenticated: false,
        crossesTrustBoundary: true,
        path: "M 105 410 L 890 410",
        explanation: "The public client has no network path to the audit store.",
      },
    ] satisfies ArchitectureEdge[],
    textFallback: [
      "The Event client sends a fictional HTTPS request to the public Edge Shield.",
      "The Edge Shield validates coarse limits and service identity before forwarding.",
      "The private Intake API validates and normalizes only allowed fields.",
      "The Durable Queue separates acceptance from downstream processing.",
      "The Policy Worker evaluates the event and emits a sanitized result.",
      "Only the worker can append to the internal Audit Store; the client has no direct route.",
    ],
  },
  flow: [
    {
      id: "receive",
      number: "01",
      title: "Receive at the edge",
      summary: "The only public component accepts the synthetic event over HTTPS.",
      nodeIds: ["client", "edge"],
      edgeId: "client-edge",
    },
    {
      id: "validate-edge",
      number: "02",
      title: "Cross the trust boundary",
      summary: "The edge forwards only an authenticated, size-bounded request.",
      nodeIds: ["edge", "gateway"],
      edgeId: "edge-gateway",
    },
    {
      id: "normalize",
      number: "03",
      title: "Validate and normalize",
      summary: "The intake service rejects unknown fields before publishing a normalized message.",
      nodeIds: ["gateway", "queue"],
      edgeId: "gateway-queue",
    },
    {
      id: "process",
      number: "04",
      title: "Process asynchronously",
      summary: "The worker leases the message, applies policy, and can safely retry.",
      nodeIds: ["queue", "worker"],
      edgeId: "queue-worker",
    },
    {
      id: "record",
      number: "05",
      title: "Append evidence",
      summary: "A sanitized decision record is appended without exposing the store publicly.",
      nodeIds: ["worker", "audit"],
      edgeId: "worker-audit",
    },
  ] satisfies FlowStep[],
  threats: [
    {
      id: "malformed-input",
      category: "Input",
      threat: "Malformed or oversized event",
      asset: "Intake API",
      entryPoint: "Public request body",
      control: "Size limit, strict schema, unknown-field rejection",
      residualRisk: "Valid but adversarial payloads may still consume bounded processing time.",
      evidence: "Negative-path transcript",
      nodeIds: ["client", "edge", "gateway"],
    },
    {
      id: "direct-store-probing",
      category: "Network",
      threat: "Direct probing of the audit store",
      asset: "Audit Store",
      entryPoint: "Public network",
      control: "No route; internal-only addressability; append identity isolated to worker",
      residualRisk: "A compromised worker identity could still append misleading records.",
      evidence: "Architecture contract",
      nodeIds: ["client", "worker", "audit"],
    },
    {
      id: "event-replay",
      category: "Identity",
      threat: "Replay of a previously accepted event",
      asset: "Policy outcome",
      entryPoint: "Valid request credential",
      control: "Request ID validation and idempotent processing",
      residualRisk: "The retention window limits how long prior IDs can be recognized.",
      evidence: "Negative-path transcript",
      nodeIds: ["edge", "gateway", "worker", "audit"],
    },
    {
      id: "worker-outage",
      category: "Availability",
      threat: "Worker unavailable after acceptance",
      asset: "Accepted event",
      entryPoint: "Internal workload failure",
      control: "Durable queue, bounded lease, visible retry state",
      residualRisk: "A prolonged outage can exhaust retention or create processing delay.",
      evidence: "Recovery rehearsal",
      nodeIds: ["queue", "worker"],
    },
  ] satisfies ThreatControl[],
  decisions: [
    {
      id: "public-edge-only",
      title: "One intentionally public edge",
      summary: "Keep the application and evidence layers off the public network.",
      outcome: "Smaller surface",
      reason: "The prototype must make exposure legible at a glance.",
      alternatives: ["Expose the Intake API directly", "Put every service behind one shared proxy"],
      chosenApproach: "Only Edge Shield receives public traffic; all later hops use private identities.",
      tradeoff: "The edge becomes a critical dependency and needs careful identity management.",
      revisitWhen: "A second independent ingress path is justified by availability requirements.",
      nodeIds: ["edge", "gateway"],
    },
    {
      id: "async-processing",
      title: "Accept before processing",
      summary: "Use a durable queue to contain worker failure.",
      outcome: "Failure contained",
      reason: "A policy worker should not determine whether a valid event can be accepted.",
      alternatives: ["Synchronous processing", "Fire-and-forget background task"],
      chosenApproach: "Validate, publish, then process with a bounded lease.",
      tradeoff: "The system becomes eventually consistent and must expose queue health.",
      revisitWhen: "The outcome must be returned synchronously to the caller.",
      nodeIds: ["gateway", "queue", "worker"],
    },
    {
      id: "strict-envelope",
      title: "Allow-list the envelope",
      summary: "Reject unknown fields before they enter the internal system.",
      outcome: "Trust established",
      reason: "External input stays untrusted until its shape and bounds are verified.",
      alternatives: ["Pass the raw event through", "Sanitize only during worker processing"],
      chosenApproach: "Strict parsing at Intake API with generic client errors.",
      tradeoff: "Schema changes require explicit versioning and coordinated rollout.",
      revisitWhen: "Multiple producer versions need a controlled compatibility window.",
      nodeIds: ["gateway"],
    },
    {
      id: "append-only-evidence",
      title: "Append-only evidence",
      summary: "Separate the ability to record a decision from the ability to rewrite history.",
      outcome: "Auditable path",
      reason: "Evidence is useful only when normal processing cannot silently alter prior records.",
      alternatives: ["General-purpose database credentials", "Application logs as the only evidence"],
      chosenApproach: "Worker gets append-only access; review uses a separate read-only identity.",
      tradeoff: "Corrections become compensating records instead of in-place edits.",
      revisitWhen: "Formal retention and legal-hold requirements define a different evidence store.",
      nodeIds: ["worker", "audit"],
    },
  ] satisfies Decision[],
  evidence: [
    {
      id: "architecture-contract",
      type: "Architecture contract",
      title: "Exposure rules",
      caption: "A fictional contract showing that only the edge is public and the store has no direct route.",
      detail:
        "This artifact is deliberately simulated. It demonstrates how a real case study could connect an exposure claim to a readable, inspectable source.",
      excerpt:
        "public: [edge-shield]\nprivate: [intake-api]\ninternal_only: [durable-queue, policy-worker, audit-store]\nforbidden_paths: [client -> audit-store]",
      proves: "The page can attach a concrete artifact to an architecture claim.",
      nodeIds: ["edge", "gateway", "audit"],
    },
    {
      id: "negative-path",
      type: "Negative test",
      title: "Rejected malformed event",
      caption: "A sanitized fictional test showing that unknown fields fail before queue publication.",
      detail:
        "The response remains generic while the internal result records a useful reason. No external service is called.",
      excerpt:
        "request_id=demo-0042\nclient_status=400\nclient_error=invalid_request\ninternal_reason=unknown_field\nqueue_publish=false",
      proves: "Input failure is contained before the trusted processing path.",
      nodeIds: ["edge", "gateway", "queue"],
    },
    {
      id: "recovery-rehearsal",
      type: "Recovery rehearsal",
      title: "Worker interruption",
      caption: "A local simulation showing an accepted message returning to the queue after a worker stop.",
      detail:
        "The timestamps and identifiers are synthetic. The purpose is to test how operational evidence is presented.",
      excerpt:
        "00:00 message accepted\n00:03 lease acquired\n00:05 worker interrupted\n00:35 lease expired\n00:36 message available\n00:41 processing complete",
      proves: "The interface can explain failure behavior, not only the happy path.",
      nodeIds: ["queue", "worker", "audit"],
    },
  ] satisfies EvidenceItem[],
  operations: [
    {
      question: "What if the worker stops?",
      behavior: "The leased message becomes visible again after a bounded timeout.",
      signal: "Queue age and retry count increase.",
      recovery: "Restore the worker, inspect the reason, then resume consumption.",
      limitation: "A long outage can exceed the fictional retention window.",
      nodeIds: ["queue", "worker"],
    },
    {
      question: "What if the audit store is slow?",
      behavior: "The worker does not acknowledge the message until the append succeeds.",
      signal: "Append latency and queue age rise together.",
      recovery: "Pause consumption if the store remains degraded; preserve queued work.",
      limitation: "Backpressure delays downstream evidence availability.",
      nodeIds: ["worker", "audit"],
    },
    {
      question: "What if input validation fails?",
      behavior: "The request ends at the Intake API with a generic client response.",
      signal: "A categorized internal counter increases without logging the raw payload.",
      recovery: "Fix the producer or introduce a versioned schema intentionally.",
      limitation: "Strict validation can reject a legitimate uncoordinated producer change.",
      nodeIds: ["edge", "gateway"],
    },
  ],
  sourceFiles: [
    {
      id: "route",
      label: "intake/route.ts",
      language: "TypeScript",
      code: `const EventEnvelope = z.object({
  requestId: z.string().uuid(),
  type: z.enum(["policy.check", "policy.refresh"]),
  payload: z.record(z.string(), z.unknown()),
}).strict();

export async function acceptEvent(raw: unknown) {
  const parsed = EventEnvelope.safeParse(raw);
  if (!parsed.success) {
    auditReason("input_rejected", parsed.error.issues);
    return { ok: false, error: "invalid_request" };
  }

  const message = normalizeAllowedFields(parsed.data);
  await queue.publish(message, { dedupeKey: message.requestId });
  return { ok: true, requestId: message.requestId };
}`,
      callouts: [
        {
          id: "strict-schema",
          title: "Trust no input",
          detail: "The strict schema rejects unknown fields before business logic or queue publication.",
          lineStart: 1,
          lineEnd: 5,
          nodeIds: ["gateway"],
        },
        {
          id: "safe-failure",
          title: "Safe client failure",
          detail: "The external response stays generic while the internal reason remains useful.",
          lineStart: 8,
          lineEnd: 11,
          nodeIds: ["gateway"],
        },
        {
          id: "idempotent-publish",
          title: "Bounded publish contract",
          detail: "Only normalized fields are published and the request ID becomes the deduplication key.",
          lineStart: 14,
          lineEnd: 16,
          nodeIds: ["gateway", "queue"],
        },
      ],
    },
    {
      id: "worker",
      label: "worker/process.ts",
      language: "TypeScript",
      code: `export async function process(message: NormalizedEvent) {
  const decision = evaluatePolicy(message);
  const record = {
    requestId: message.requestId,
    outcome: decision.outcome,
    reasonCode: decision.reasonCode,
    evaluatedAt: clock.now().toISOString(),
  };

  await auditStore.append(record);
  return { acknowledged: true };
}`,
      callouts: [
        {
          id: "sanitized-record",
          title: "Minimized evidence",
          detail: "The record keeps decision context without copying the original payload.",
          lineStart: 2,
          lineEnd: 8,
          nodeIds: ["worker", "audit"],
        },
        {
          id: "append-before-ack",
          title: "Evidence before acknowledgement",
          detail: "The message is acknowledged only after the append operation succeeds.",
          lineStart: 10,
          lineEnd: 11,
          nodeIds: ["queue", "worker", "audit"],
        },
      ],
    },
  ] satisfies SourceFile[],
  results: [
    {
      label: "Understanding",
      value: "The public path and protected store are visible without reading the full case study.",
    },
    {
      label: "Interaction",
      value: "Nodes, threats, flow steps, code callouts, and evidence share the same relationship IDs.",
    },
    {
      label: "Safety",
      value: "Every claim and artifact is explicitly fictional, sanitized, and local to the browser.",
    },
    {
      label: "Reuse",
      value: "The page structure can accept real project data after the prototype is approved.",
    },
  ],
  retrospective: {
    worked: [
      "The single lab shell gives technical content a clear place without hiding the normal page.",
      "One shared selection model turns separate sections into a connected explanation.",
    ],
    difficult: [
      "Keeping a dense technical viewer useful on mobile without shrinking desktop UI.",
      "Showing depth without turning every section into another dashboard.",
    ],
    changeNext: [
      "Tune information density after Pedro reviews the desktop and phone layouts.",
      "Replace fictional evidence shapes with the approved real project asset patterns.",
      "Decide whether the final flagship page should open the VM immediately or after a short summary.",
    ],
    demonstrates: [
      "Architecture communication",
      "Threat modeling",
      "Accessible interaction design",
      "Evidence-driven storytelling",
    ],
  },
} as const;
