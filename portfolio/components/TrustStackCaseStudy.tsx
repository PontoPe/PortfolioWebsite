import { ExternalLink, Github, LockKeyhole } from "lucide-react";

type VerificationStatus =
  | "VERIFIED"
  | "TESTED LOCALLY"
  | "IMPLEMENTED"
  | "IN PROGRESS"
  | "PLANNED";

const metrics = [
  { value: "4", label: "connected security projects" },
  { value: "6", label: "live AWS Terraform stacks" },
  { value: "3", label: "AWS detection units" },
  { value: "167", label: "automated PAC tests" },
  { value: "0", label: "long-lived CI credentials" },
];

const layers: Array<{
  name: string;
  boundary: string;
  status: VerificationStatus;
  description: string;
  controls: string[];
  proof: string;
}> = [
  {
    name: "AwLZ",
    boundary: "AWS GOVERNANCE",
    status: "VERIFIED",
    description:
      "A Terraform-built multi-account landing zone that separates management, security, logging, and workloads, then applies organization-wide guardrails.",
    controls: [
      "AWS Organizations and Service Control Policies",
      "Organization CloudTrail with KMS and Object Lock",
      "Delegated GuardDuty, Security Hub, Config, and Access Analyzer",
      "GitHub Actions OIDC with separate plan and apply roles",
    ],
    proof:
      "All six stacks are applied to real AWS. SCP, centralized logging, and cross-account detection evidence are captured; longer-running CIS and cost evidence remains follow-up work.",
  },
  {
    name: "PontoAntiCrack",
    boundary: "DETECTION AND RESPONSE",
    status: "TESTED LOCALLY",
    description:
      "Three least-privilege AWS detections with negative tests, dry-run, before-state snapshots, a circuit breaker, and human escalation when automation is unsafe.",
    controls: [
      "Public S3 access",
      "Leaked IAM access keys",
      "Dangerous Security Group exposure",
      "Snapshot-before-mutation audit pipeline",
    ],
    proof:
      "All 167 automated tests pass and Terraform validates. The system has not yet been applied to AWS, so live event capture and remediation evidence are not claimed.",
  },
  {
    name: "KateClusters",
    boundary: "KUBERNETES SECURITY",
    status: "IN PROGRESS",
    description:
      "A kubeadm environment for control-plane hardening, restricted workload identity, default-deny networking, auditability, and eBPF runtime detection.",
    controls: [
      "CIS-oriented kubeadm hardening",
      "Pod Security Admission and least-privilege RBAC",
      "Calico NetworkPolicy and secret encryption",
      "Falco, Loki, Grafana, and controlled attacks",
    ],
    proof:
      "Baseline cluster evidence and the first escape-path capture now exist locally. The remaining attacks, hardened benchmark delta, and full detection-interruption exercise are still in progress.",
  },
  {
    name: "ProvenancePipeline",
    boundary: "SOFTWARE SUPPLY CHAIN",
    status: "IMPLEMENTED",
    description:
      "A release path that binds an image digest to its source, components, vulnerability result, signing identity, and build provenance.",
    controls: [
      "SPDX and CycloneDX SBOMs",
      "Grype vulnerability gate",
      "Cosign keyless signing and Rekor transparency",
      "SLSA Build L2 provenance and independent verification",
    ],
    proof:
      "CI signing, attestations, and positive and negative identity verification are captured. Kyverno admission enforcement and unsigned-image denial remain planned.",
  },
];

const lifecycle = [
  {
    step: "01",
    name: "DEFINE",
    description: "State the threat, trust boundary, and intended result.",
  },
  {
    step: "02",
    name: "IMPLEMENT",
    description: "Apply the narrowest control with secure defaults and least privilege.",
  },
  {
    step: "03",
    name: "ATTACK",
    description: "Exercise the allowed, denied, and failure paths.",
  },
  {
    step: "04",
    name: "PRESERVE",
    description: "Keep the observed result and before-state without exposing secrets.",
  },
];

const verificationRows: Array<{
  layer: string;
  control: string;
  test: string;
  evidence: string;
  status: VerificationStatus;
}> = [
  {
    layer: "AWS governance",
    control: "Organization SCP",
    test: "Forbidden action from a member account",
    evidence: "Denied API output and CloudTrail record",
    status: "VERIFIED",
  },
  {
    layer: "AWS logging",
    control: "Object Lock archive",
    test: "Cross-account organization trail delivery",
    evidence: "Retained object and retention metadata",
    status: "VERIFIED",
  },
  {
    layer: "AWS response",
    control: "Bounded remediation",
    test: "Dry-run, exclusions, failures, and event storms",
    evidence: "167 tests with preserved before-state",
    status: "TESTED LOCALLY",
  },
  {
    layer: "Kubernetes admission",
    control: "Pod Security Admission",
    test: "Privileged escape-path workload",
    evidence: "First denial and detection capture recorded locally",
    status: "IN PROGRESS",
  },
  {
    layer: "Kubernetes runtime",
    control: "Falco interruption alert",
    test: "Stop the expected heartbeat",
    evidence: "Alert and recovery capture still required",
    status: "PLANNED",
  },
  {
    layer: "Supply chain",
    control: "Image identity",
    test: "Expected and incorrect workflow identities",
    evidence: "Cosign verification and negative control",
    status: "VERIFIED",
  },
  {
    layer: "Supply-chain admission",
    control: "Kyverno verifyImages",
    test: "Submit an unsigned image",
    evidence: "Admission denial and absent pod still required",
    status: "PLANNED",
  },
];

const statusClasses: Record<VerificationStatus, string> = {
  VERIFIED: "border-green-500/40 bg-green-500/10 text-green-300",
  "TESTED LOCALLY": "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
  IMPLEMENTED: "border-blue-500/40 bg-blue-500/10 text-blue-300",
  "IN PROGRESS": "border-amber-500/40 bg-amber-500/10 text-amber-200",
  PLANNED: "border-white/15 bg-white/5 text-[#999]",
};

const testedRuntimeExcerpt = `def execute(detection, raw_event, config, aws, notifier):
    event = event_parser.parse(raw_event)
    audit = AuditLog(aws.table(config.table_name), config.detection_id)

    # Read-only planning happens before any mutation.
    plan = detection.plan(event, aws)
    if plan is None:
        return record_safe_skip(audit, event, config)

    # Preserve the original state first. Every later step may fail without
    # destroying the rollback source or the incident evidence.
    key = audit.open(event, plan, dry_run=config.dry_run)

    breaker = CircuitBreaker(
        aws.table(config.table_name),
        config.detection_id,
        limit=config.circuit_breaker_max_actions,
        window_seconds=config.circuit_breaker_window_seconds,
    )
    state = breaker.check_and_increment()
    if state.open:
        outcome = blocked_outcome(plan, state.reason)
        audit.close(key, outcome)
        notifier.notify(event, outcome, plan)
        return outcome

    if config.dry_run:
        outcome = dry_run_outcome(plan)
        audit.close(key, outcome)
        notifier.notify(event, outcome, plan)
        return outcome

    actions = detection.apply(plan, aws)
    outcome = applied_outcome(plan, actions)
    audit.close(key, outcome)
    notifier.notify(event, outcome, plan)
    return outcome`;

function StatusBadge({ status }: { status: VerificationStatus }) {
  return (
    <span
      className={`inline-flex w-fit border px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}

export default function TrustStackCaseStudy() {
  // TODO(truststack): Keep the public status "In Development" until the
  // Kyverno unsigned-image denial, the remaining Kubernetes attack captures,
  // and the hardened kube-bench delta are committed to the evidence set.
  return (
    <div className="space-y-24">
      <section className="grid grid-cols-1 gap-12 md:grid-cols-3">
        <div className="space-y-8 md:col-span-2">
          <div>
            <h2 className="mb-6 text-xl font-bold text-white">Overview</h2>
            <p className="text-lg leading-relaxed text-[#999]">
              TrustStack is a hands-on cloud security engineering platform I
              designed to test trust across the full path from cloud governance
              to a running container. It connects an AWS landing zone, an AWS
              detection and response system, a hardened Kubernetes cluster, and
              a signed software-supply-chain pipeline.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-white">
              The security rule
            </h3>
            <p className="leading-relaxed text-[#999]">
              A control is not complete because its configuration exists. I test
              the allowed path, the denied path, the failure behavior, and the
              evidence the control leaves behind.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-white">
              My role
            </h3>
            <p className="leading-relaxed text-[#999]">
              I designed the architecture, threat models, infrastructure code,
              detection framework, policies, test fixtures, controlled attack
              scenarios, CI workflows, operational safeguards, and evidence
              plan. I also document where the lab stops instead of turning
              incomplete controls into production claims.
            </p>
          </div>
        </div>

        <aside>
          <h2 className="mb-6 text-xl font-bold text-white">Repositories</h2>
          <div className="space-y-3">
            <a
              href="https://github.com/PontoPe/AwLZ"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between rounded border border-white/10 p-4 transition-colors hover:bg-white hover:text-black"
            >
              <span>AwLZ Source</span>
              <Github className="h-4 w-4" />
            </a>
            <div className="flex w-full items-center justify-between rounded border border-white/10 p-4 text-[#777]">
              <span>PontoAntiCrack · Private</span>
              <LockKeyhole className="h-4 w-4" />
            </div>
            <div className="flex w-full items-center justify-between rounded border border-white/10 p-4 text-[#777]">
              <span>KateClusters · Private</span>
              <LockKeyhole className="h-4 w-4" />
            </div>
            <a
              href="https://github.com/PontoPe/ProvenancePipeline"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between rounded border border-white/10 p-4 transition-colors hover:bg-white hover:text-black"
            >
              <span>Provenance Source</span>
              <Github className="h-4 w-4" />
            </a>
          </div>
        </aside>
      </section>

      <section aria-labelledby="truststack-proof">
        <div className="mb-8 flex items-baseline gap-3">
          <h2 id="truststack-proof" className="text-xl font-bold text-white">
            Proof at a glance
          </h2>
          <span className="text-xs uppercase tracking-widest text-[#555]">
            {"// current evidence"}
          </span>
        </div>
        <div className="grid grid-cols-2 border-l border-t border-white/10 md:grid-cols-5">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="border-b border-r border-white/10 bg-[#151515] p-5"
            >
              <p className="mb-2 text-3xl font-bold text-white">{metric.value}</p>
              <p className="text-xs leading-relaxed text-[#777]">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="truststack-layers">
        <div className="mb-8">
          <h2 id="truststack-layers" className="mb-3 text-xl font-bold text-white">
            Four connected trust boundaries
          </h2>
          <p className="max-w-3xl leading-relaxed text-[#777]">
            AwLZ governs AWS. AWS activity feeds PontoAntiCrack.
            ProvenancePipeline produces a signed and attested image.
            KateClusters decides what may enter and observes what runs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {layers.map((layer) => (
            <article
              key={layer.name}
              className="flex flex-col border border-white/10 bg-[#151515] p-6"
            >
              <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-[10px] font-bold tracking-[0.2em] text-[#666]">
                    {layer.boundary}
                  </p>
                  <h3 className="text-2xl font-bold text-white">{layer.name}</h3>
                </div>
                <StatusBadge status={layer.status} />
              </div>

              <p className="mb-6 leading-relaxed text-[#999]">
                {layer.description}
              </p>

              <ul className="mb-6 space-y-2 text-sm text-[#888]">
                {layer.controls.map((control) => (
                  <li key={control} className="flex gap-3">
                    <span aria-hidden="true" className="text-green-500">
                      +
                    </span>
                    <span>{control}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-auto border-t border-white/10 pt-5 text-sm leading-relaxed text-[#777]">
                {layer.proof}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="truststack-evidence-lifecycle">
        <h2
          id="truststack-evidence-lifecycle"
          className="mb-8 text-xl font-bold text-white"
        >
          How a control becomes evidence
        </h2>
        <div className="grid grid-cols-1 border-l border-t border-white/10 md:grid-cols-4">
          {lifecycle.map((item) => (
            <div
              key={item.name}
              className="border-b border-r border-white/10 bg-[#151515] p-6"
            >
              <span className="mb-8 block text-xs text-green-500">{item.step}</span>
              <h3 className="mb-3 font-bold tracking-widest text-white">
                {item.name}
              </h3>
              <p className="text-sm leading-relaxed text-[#777]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm leading-relaxed text-[#666]">
          TrustStack treats evidence as part of implementation, not documentation
          collected after the demo.
        </p>
      </section>

      <section aria-labelledby="truststack-verification">
        <div className="mb-8">
          <h2
            id="truststack-verification"
            className="mb-3 text-xl font-bold text-white"
          >
            Current verification status
          </h2>
          <p className="max-w-3xl leading-relaxed text-[#777]">
            Status follows observed evidence. Planned controls stay visibly
            planned until both their success and failure paths are captured.
          </p>
        </div>

        <div className="overflow-x-auto border border-white/10">
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <thead className="bg-black/40 text-[10px] uppercase tracking-widest text-[#666]">
              <tr>
                <th className="border-b border-white/10 p-4">Layer</th>
                <th className="border-b border-white/10 p-4">Control</th>
                <th className="border-b border-white/10 p-4">Test</th>
                <th className="border-b border-white/10 p-4">Evidence</th>
                <th className="border-b border-white/10 p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {verificationRows.map((row) => (
                <tr key={`${row.layer}-${row.control}`} className="bg-[#151515]">
                  <td className="border-b border-white/10 p-4 text-white">
                    {row.layer}
                  </td>
                  <td className="border-b border-white/10 p-4 text-[#999]">
                    {row.control}
                  </td>
                  <td className="border-b border-white/10 p-4 text-[#777]">
                    {row.test}
                  </td>
                  <td className="border-b border-white/10 p-4 text-[#777]">
                    {row.evidence}
                  </td>
                  <td className="border-b border-white/10 p-4">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="truststack-implementation">
        <div className="mb-6 flex items-baseline gap-3">
          <h2
            id="truststack-implementation"
            className="text-xl font-bold text-white"
          >
            Implementation
          </h2>
          <span className="text-xs uppercase tracking-widest text-[#555]">
            {"// tested excerpt"}
          </span>
        </div>
        <div className="overflow-hidden rounded-lg border border-white/10 bg-[#0d0d0d]">
          <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-3">
            <div className="flex items-center gap-2" aria-hidden="true">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            </div>
            <span className="text-xs text-[#888]">
              remediations/common/runtime.py
            </span>
            <span className="w-12" />
          </div>
          <pre className="overflow-x-auto p-6 text-[13px] leading-relaxed text-[#c9d1d9]">
            <code>{testedRuntimeExcerpt}</code>
          </pre>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-[#666]">
          Faithfully shortened from the private PontoAntiCrack runner. Evidence
          is written before mutation, while dry-run and the circuit breaker can
          stop a change without losing the audit path.
        </p>
      </section>

      <section
        aria-labelledby="truststack-limitations"
        className="border-l-2 border-amber-500/50 pl-6"
      >
        <h2
          id="truststack-limitations"
          className="mb-5 text-xl font-bold text-white"
        >
          Scope and limitations
        </h2>
        <div className="space-y-5 leading-relaxed text-[#888]">
          <p>
            TrustStack is a personal engineering lab, not a claim of production
            scale. The AWS organization is intentionally small. KateClusters is
            a single-node environment and does not prove high availability or
            hostile multi-tenant isolation. Detection tuning has not seen
            enterprise event volume.
          </p>
          <p>
            ProvenancePipeline targets SLSA Build Level 2 because its builder is
            not isolated enough for a Level 3 claim. Scaling these controls would
            require production change management, recovery exercises, longer
            cost data, larger event volumes, and team-operated incident response.
          </p>
        </div>
      </section>

      <section aria-labelledby="truststack-public-evidence">
        <h2
          id="truststack-public-evidence"
          className="mb-6 text-xl font-bold text-white"
        >
          Public evidence
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <a
            href="https://github.com/PontoPe/AwLZ/tree/main/docs/evidence"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between border border-white/10 bg-[#151515] p-5 transition-colors hover:border-white/30 hover:text-white"
          >
            <div>
              <p className="mb-1 text-white">AwLZ control evidence</p>
              <p className="text-xs text-[#666]">SCP, logging, and detection</p>
            </div>
            <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href="https://github.com/PontoPe/ProvenancePipeline/blob/main/docs/evidence/supply-chain-verification.md"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between border border-white/10 bg-[#151515] p-5 transition-colors hover:border-white/30 hover:text-white"
          >
            <div>
              <p className="mb-1 text-white">Supply-chain verification</p>
              <p className="text-xs text-[#666]">
                Signature, attestations, and negative control
              </p>
            </div>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
