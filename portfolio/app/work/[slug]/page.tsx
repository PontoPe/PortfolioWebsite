import Link from "next/link";
import type { Metadata } from "next";
import ProjectCaseStudyExperience from "@/components/ProjectCaseStudyExperience";
import {
  projectCaseStudyProfiles,
  type ProjectSource,
} from "@/lib/projectCaseStudyProfiles";

const projectsData: Record<string, ProjectSource> = {
  "brasilcon": {
    title: "Revista BRASILCON",
    category: "Secure Self-Hosted Infrastructure / Academic Publishing",
    date: "2026 - present",
    description: `
      Volunteer build of the editorial management platform for the Revista de Direito do Consumidor - the journal of BRASILCON, the Brazilian Institute of Consumer Policy and Law. There was no system to migrate: the journal had no digital editorial platform, so I built one from scratch on my own server - a self-hosted Open Journal Systems (OJS) stack, now live at revistabrasilcon.com. I architected it, run it in production solo, and BRASILCON formally recognized the work in an official letter (Ofício nº 13/2026) signed by its President, the journal's Director-General, and its Secretary-General.

      ZERO-OPEN-PORT INGRESS - The core security decision: the journal is published to the internet without a single inbound port. Ingress is an outbound-only Cloudflare Tunnel - the cloudflared container dials out to Cloudflare's edge, and all public traffic rides back down that authenticated connection. No port-forwards, no exposed origin IP, no direct attack surface on a residential network. TLS terminates at Cloudflare's edge, which also provides DDoS absorption and traffic filtering for free.

      DEFENSE IN DEPTH BY ARCHITECTURE - The stack is three Docker containers on an isolated bridge network: a custom-built OJS 3.4 image (configuration and patches baked in at build time - the running container is reproducible, not hand-mutated), MariaDB for the editorial database, and cloudflared. The compose file publishes zero host ports: the database is reachable only by the OJS container on the internal Docker network, and OJS itself is reachable only through the tunnel. Even someone on the LAN cannot talk to the database directly.

      OPERATIONS - All three containers restart automatically and survive reboots unattended. Day-2 work is mine alone: image rebuilds, DNS, tunnel health monitoring, incident documentation and runbooks. The platform digitizes the journal's full academic workflow - article submission, double-blind peer review, editorial rounds, and publication - for a national legal institute, running on hardware I own.
    `,
    stack: ["OJS 3.4", "PHP", "MariaDB", "Docker Compose", "Cloudflare Tunnel", "Zero-Trust Ingress", "Debian", "Self-Hosted"],
    image: "/projects/brasilcon.png",
    demo: "https://revistabrasilcon.com/",
    codeSnippet: {
      filename: "docker-compose.yml",
      caption: "Zero published host ports - ingress is an outbound-only Cloudflare Tunnel.",
      code: `# Zero published host ports. The journal is reachable ONLY through the tunnel.
services:
  ojs:
    build: ./ojs                       # OJS 3.4 - patches baked in at build time
    depends_on:
      db: { condition: service_healthy }
    networks: [internal]               # no route to the outside world
    restart: unless-stopped
    # NOTE: no \`ports:\` block - nothing is ever bound to the host.

  db:
    image: mariadb:11
    environment:
      MARIADB_PASSWORD_FILE: /run/secrets/db_pass   # secret, never inline
    secrets: [db_pass]
    networks: [internal]               # reachable only by the ojs container
    volumes: [ojs_db:/var/lib/mysql]
    restart: unless-stopped

  cloudflared:
    image: cloudflare/cloudflared:latest
    command: tunnel --no-autoupdate run
    environment:
      TUNNEL_TOKEN_FILE: /run/secrets/cf_token
    secrets: [cf_token]
    networks: [edge, internal]         # dials OUT to Cloudflare's edge
    restart: unless-stopped

networks:
  edge: {}                             # cloudflared egress only
  internal: { internal: true }         # air-gapped from the public internet

secrets:
  db_pass:  { file: ./secrets/db_pass.txt }
  cf_token: { file: ./secrets/cf_token.txt }`,
    },
    gallery: [
      { src: "/projects/brasilcon-letter.png", caption: "Official recognition letter from BRASILCON (Ofício nº 13/2026)", width: 1310, height: 1852 },
    ],
  },
  "pontosv": {
    title: "pontosv - Hardened Home Server",
    category: "Linux Hardening / DevSecOps / Self-Hosted Infrastructure",
    date: "2025 - present",
    description: `
      A bare-metal Debian 12 server I built and administer solo - the production machine behind the BRASILCON OJS journal. Intel i5-14400, 32 GiB RAM, 1 TB NVMe, on a residential connection in Curitiba. It is my live laboratory for the discipline that actually matters in security: deciding what gets exposed, why, and proving it.

      EXPOSURE AS A DELIBERATE DECISION - The threat model is simple: assume the WAN is hostile and minimize what it can see. The flagship service (the journal) reaches the internet through an outbound-only Cloudflare Tunnel - zero inbound ports for the box's most valuable workload. The only two ports forwarded on the router exist for the self-hosted TeamSpeak 6 voice server (Docker), and each is documented with its justification. Everything else - admin panels, Cockpit, file sharing (NFS/Samba), the web file manager - is LAN-only by policy, with an explicit written rule of what must never be forwarded. SSH is key-only; password authentication is disabled in sshd config.

      LEAST PRIVILEGE IN THE SMALL THINGS - The DuckDNS dynamic-DNS updater runs as a dedicated unprivileged system user via a systemd timer, with its token in a root-owned config file at mode 640 - not as a root cron job with the secret inline, which is how most self-hosters do it. TeamSpeak runs containerized with only its two required ports published. The Docker stacks publish no other host ports.

      INCIDENT FORENSICS - THE STORY I TELL IN INTERVIEWS - For ten weeks the server "randomly lost internet" every 1–2 weeks, and reboots only reset the clock. Instead of another reboot, I dug through journald and the packet path and found three stacked root causes: two DHCP clients racing on one NIC with independent renew schedules; a rogue DHCP server on the ISP modem that hijacked the default route (the smoking gun was a single journal line at 3:24 AM); and three firewall managers - firewalld, ufw, iptables-persistent - silently fighting each other and Docker, so every previous "fix" had edited a layer that wasn't doing the blocking. The cure was architectural: exactly one owner per layer. One DHCP client, one firewall authority, Docker managing its own chains. Zero recurrences since.

      OPERATIONS AS CODE-ADJACENT DISCIPLINE - The server is governed by a living handbook: services-and-ports map, firewall policy with rationale, full incident history with root-cause analysis, an honest risk register, and triage runbooks ordered by likelihood - written so that any competent human or AI agent could operate the machine cold. Documentation is a security control; this box treats it like one.
    `,
    stack: ["Debian 12", "Docker", "Cloudflare Tunnel", "systemd", "SSH Hardening", "nginx", "DuckDNS", "DNS / SRV", "Incident Response"],
    image: "/projects/pontosv.png",
    codeSnippet: {
      filename: "/etc/nftables.conf",
      caption: "Default-drop ruleset. The journal has no inbound rule - it rides the tunnel.",
      code: `#!/usr/sbin/nft -f
# Default-drop. The journal has NO inbound rule (it rides the Cloudflare Tunnel).
# Exactly one firewall authority owns this box - no ufw, no firewalld fighting Docker.
flush ruleset

table inet filter {
  chain input {
    type filter hook input priority 0; policy drop;

    ct state invalid drop
    ct state established,related accept
    iif "lo" accept
    ip protocol icmp accept

    # Management surface is LAN-only by policy (SSH, Samba, Cockpit).
    ip saddr 192.168.0.0/16 tcp dport { 22, 445, 9090 } accept

    # SSH: key-only (PasswordAuthentication no in sshd_config).
    tcp dport 22 accept

    # The ONLY two WAN-forwarded services: TeamSpeak 6 voice - documented + justified.
    udp dport 9987  accept             # TS6 voice
    tcp dport 30033 accept             # TS6 file transfer

    counter comment "dropped-inbound" drop
  }

  chain forward { type filter hook forward priority 0; policy drop; }
  chain output  { type filter hook output  priority 0; policy accept; }
}`,
    },
  },
  "truststack": {
    title: "TrustStack",
    subtitle: "Four applied security layers for cloud governance, response, runtime, and supply-chain assurance",
    status: "Applied",
    category: "Cloud Security / DevSecOps / Detection Engineering",
    date: "2026",
    description: `
      TrustStack is four public repositories that each answer one question about a system's trust: can an account do something nobody watches (AwLZ), do I know where this container came from (ProvenancePipeline), if something breaks in does anyone find out (KateClusters), and when something is found what happens automatically (PontoAntiCrack). All four are applied to real infrastructure - a live five-account AWS organization, a real kubeadm cluster, and a signed release path into GHCR - and all four meet the same definition of finished, agreed before any of the work started: code applied, evidence artifacts committed, a recorded demo, a threat model whose residual risks are stated rather than implied, and a public repository.

      THE RULE, AND WHAT IT COSTS - The deliverable is not working infrastructure. Anyone can apply a Terraform module or install a Helm chart. The deliverable is reproducible infrastructure plus evidence that the controls do what the documentation claims, including where they do not. The part worth reading in each repository is docs/evidence/, and the part worth reading there is the entries recording a control failing, a claim being wrong, or a number coming back worse than promised. That rule has a price: three of the four layers had to publish a result less flattering than the one originally advertised.

      AWLZ - CLOUD GOVERNANCE - Six independent Terraform stacks and ten modules build a multi-account landing zone: two organizational units, five accounts, four service control policies, an organization CloudTrail whose Object Lock archive lives in a separate log-archive account under its own key, and GuardDuty, Security Hub, Config and Access Analyzer all delegated to a security account. Root credentials are deleted from every member account, so the only interactive way in is IAM Identity Center, and there are no static AWS access keys anywhere - CI plans through GitHub OIDC with a read-only role and applies through a role gated behind a protected environment. Every SCP was probed from inside a member account while holding administrator there, because an SCP is the only mechanism that can deny an account administrator and a test as anything less privileged would prove nothing.

      PONTOANTICRACK - DETECTION AND RESPONSE - Detection-as-code with automated remediation, named after the anti-cheat: the game keeps running, the cheater gets caught and kicked. Three detections - public S3 exposure, leaked IAM keys, world-open security groups - each a complete unit of EventBridge pattern, Lambda handler, scoped execution role, fixtures, and tests for both what it catches and what it must not. Every detection runs through one runtime, and the order is the security property: plan read-only, honour the exclusion tag, snapshot to the audit table, check the circuit breaker, pass the dry-run gate, apply, close the audit record, alert. Handlers implement plan() and apply() and nothing else, so they cannot get the order wrong. 185 tests, and a measured 5.97 seconds from an attacker's API call to the offending rule being revoked.

      KATECLUSTERS - KUBERNETES RUNTIME - A kubeadm cluster on a dedicated Debian 13 VM, hardened against the CIS benchmark from PASS 67 / FAIL 12 to PASS 86 / FAIL 0, with each remediation linked to the manifest that fixed it. Pod Security Admission at restricted, least-privilege RBAC, Calico default-deny networking, SOPS-encrypted secrets, and Falco watching syscalls through eBPF while the API server writes an audit log - both shipped by promtail into Loki, with Grafana dashboards, alerts, and a dead-man's switch that fires when Falco stops reporting. Then attacked on purpose four times: container escape, cryptominer, service-account token abuse, and killing Falco itself, each with the raw captured output committed alongside the write-up.

      PROVENANCEPIPELINE - SOFTWARE SUPPLY CHAIN - Build, syft SBOMs in two formats, grype and trivy failing at CRITICAL with no soft-fail, push to GHCR, cosign keyless signature through Fulcio recorded in the public Rekor transparency log, then SLSA provenance and SBOM attestations - and a Kyverno policy in Enforce with failurePolicy: Fail that refuses anything it cannot verify. The deliverable is the rejection, not the pipeline: four images, one policy. Ours by digest is admitted. An unsigned image is denied. A genuinely Sigstore-signed image with a genuinely public Rekor entry is denied because the identity is not ours - a policy that only asked "is this signed" would have let it in. Ours by tag instead of digest is denied.

      WHAT PROVING IT ACTUALLY FOUND - AwLZ's promised CIS before-and-after was not obtainable, so a control experiment ran on the throwaway account instead: measure with the guardrails, detach them from that account only, measure again, reattach. All 35 controls were identical in both states, because no CIS v3.0.0 control reads a service control policy - the original claim was measuring the wrong thing. PontoAntiCrack was fully tested and completely blind twice: a loop guard that matched on the principal ARN could be bypassed by anyone passing --role-session-name pac-anything, and a pattern built entirely from AWS CLI fixtures had never seen the legacy encoding of the same API, so port 22 was opened to the internet and the rule did not match. ProvenancePipeline's design assumption about which attestation the cluster can enforce turned out to be exactly backwards, and the correction is recorded as ADR-009 with the original left visible.

      HONESTY, MECHANISED - Rules that are only written down stop being true within a month. Every fixture carries a provenance marker and the command that would capture the real event, and a test fails if the marker is missing or contradicts the detection metadata - that gate fired three separate times in the final session and was right every time. CI fails any pattern test with no negative assertion, because a pattern tested only for what it catches matches everything, forever, silently. Every scanner suppression carries an inline justification. Third-party CI actions are pinned to commit SHAs, not tags. PontoAntiCrack's evidence directory stayed empty for the entire build, with a README saying what would land in it, because a table of realistic-looking latency numbers would have been trivial to write and would have made every other number in the portfolio worthless.

      COST - A hard shared ceiling of USD 20/month across the two AWS layers, with budget alerts at 85% and 100% of actual plus 100% of forecast; the cluster and the pipeline cost nothing, running on a local VM and free-tier CI. Security Hub was the lever: CIS v3.0.0 in all five accounts projected USD 24.77/month, over the ceiling, so the five-account configuration was kept alive only long enough to capture the control experiment and then reduced to the delegated security account - and what was lost is stated: there is no longer a live per-account CIS score.

      WHAT THE FIRST CLOSED BILLING WINDOW SAID - The projection was USD 13.73/month. The measured run rate is USD 6.38, and the interesting part is not that it came in under. Measuring it correctly took two attempts. Grouping AWS Cost Explorer by service without filtering the record type sums credits into the same row as usage, so every service in the organization reported USD 0 - and a Config recorder that was healthily recording 325 configuration items was indistinguishable from a broken one. Filtered to usage only, July's real cost was USD 1.48 and credits covered all of it. The invoice said zero. Reporting that number alone would have understated the model by the entire amount it existed to measure.

      Three lines of the model were wrong, and the reasons are worth more than the figures. KMS matched to the cent. Config was over-projected threefold because the estimate extrapolated a deployment day across a month - Config bills per configuration item recorded and per rule evaluation, and the boundary rules are change-triggered, so a month in which nothing changes bills nothing. Config cost tracks what an organization does, not how long it exists. PontoAntiCrack's nine CloudWatch alarms billed zero because nine falls inside a ten-alarm free tier the estimate never applied - which makes the tenth alarm free and the eleventh a cliff, so the next detection carries a cost the original table could not have predicted. And Secrets Manager was missing from the model entirely at USD 0.40/month: invisible rather than estimated low, which is the worse of the two failures.

      One item stays open, and it is a calendar rather than work. GuardDuty and Security Hub are both inside 30-day trials until late August, so no month measured before September 2026 is a steady state, and the repository says so instead of quoting the low number.
    `,
    stack: [
      "Terraform",
      "AWS Organizations / SCP",
      "CloudTrail + Object Lock",
      "GuardDuty",
      "Python / Lambda",
      "EventBridge",
      "DynamoDB",
      "Kubernetes (kubeadm)",
      "Kyverno",
      "Falco / eBPF",
      "Loki + Grafana",
      "Cosign / Sigstore",
      "SLSA",
      "GitHub OIDC",
    ],
    image: "/projects/truststack.svg",
    imageAlt:
      "TrustStack architecture connecting AWS governance and automated response to a signed software supply chain and Kubernetes runtime security",
    codeSnippet: {
      filename: "remediations/common/runtime.py",
      caption:
        "The pipeline every PontoAntiCrack detection runs through. Order is the security property, so it is written once, in one place - and handlers never call the audit log, the breaker, or the notifier themselves.",
      code: `# Condensed from PontoAntiCrack. Handlers implement plan() and apply() and
# nothing else, so a handler cannot get this order wrong.
def execute(detection, raw_event, config, aws, notifier) -> Outcome:
    event = event_parser.parse(raw_event)
    audit = AuditLog(aws.table(config.table_name), config.detection_id)

    # 1. Loop prevention - compared against the ROLE NAME only. An earlier
    #    version tested \`"pac-" in arn\`, and an assumed-role ARN ends in a
    #    session name the CALLER chooses: anyone passing
    #    --role-session-name pac-anything was classified as our own
    #    automation and skipped. Found by detonating a real technique.
    if event.principal.is_pac_automation():
        return _skip(config, "triggered by this system's own remediation role")

    # 2. Plan is read-only. None means the resource state is not dangerous.
    plan = detection.plan(event, aws)
    if plan is None:
        return _skip(config, "resource state is not dangerous")

    # 3. Snapshot BEFORE any mutation. Everything after this line may fail
    #    without destroying the rollback source or the incident evidence.
    key = audit.open(event, plan, dry_run=config.dry_run)

    # 4. Circuit breaker: 5 actions per 5-minute window, dry runs counted.
    state = CircuitBreaker(...).check_and_increment()
    if state.open:
        return _close(audit, key, Status.BLOCKED, plan, state.reason)

    # 5. Dry run is the DEFAULT. Opting out is explicit, per detection.
    if config.dry_run:
        return _close(audit, key, Status.DRY_RUN, plan, plan.reason)

    # 6. Apply. A failure here still closes the audit record and alerts -
    #    a failed remediation must be visible, not a crashed Lambda.
    actions = detection.apply(plan, aws)
    return _close(audit, key, Status.APPLIED, plan, plan.reason, actions)`,
    },
  },
  "ficha-clinica": {
    title: "Clinical Chart",
    category: "Privacy Engineering / Health-Tech / Local-First",
    date: "2026",
    description: `
      A privacy-first digital pre-consultation system for small dental clinics, built and deployed as a university extension practice (100h, PUCPR) at a real partner clinic. The patient fills a guided nine-step anamnesis before the appointment; the dentist receives a structured clinical summary - automatic ASA physical-status classification, dentistry-specific drug-interaction alerts, and a local-anesthetic safety evaluation with per-carpule epinephrine math. It replaces paper forms that were incomplete, illegible, and stored with no encryption at all - out of compliance with Brazil's LGPD.

      LOCAL-FIRST BY LAW, NOT BY PREFERENCE - Health data is LGPD Article 11 "sensitive data." The architectural answer: there is no server. The app is 100% static; every byte of patient data lives and dies in the browser. Drafts persist in localStorage with automatic 12-hour expiry, so a shared reception tablet never accumulates a shadow database of patient records.

      ENCRYPTION AT THE EDGE - Export is a .json file encrypted entirely client-side with AES-256-GCM, the key derived from a user PIN via PBKDF2 (SHA-256, 210,000 iterations), with a random salt and IV per file, all through the native Web Crypto API. GCM's authentication tag doubles as the wrong-PIN detector - a bad PIN fails the integrity check, so there is no decryption oracle and no silent garbage output. Any feature that touches the network sits behind an explicit consent toggle that is OFF by default.

      THE MEDICATION-ANALYSIS CASCADE - Drug analysis degrades gracefully from free-and-offline to paid-and-online, escalating only with consent: local catalog (~90 drugs) → local interaction rules → on-device parsing of the ANVISA package-insert PDF (pdf.js, regex over the regulator-mandated section headers) → RxNav/RxNorm public API (opt-in) → Claude API (opt-in, last resort). Patients rarely know their drug's active compound but they have the box - so the app reads the bula PDF in-browser and cross-references it locally, never sending anything unless the scanned-image fallback forces an explicit, disclosed AI escalation.

      ENGINEERING DISCIPLINE - 38 Vitest tests cover the risk surface: crypto round-trips, the ANVISA PDF parser, interaction rules, and the versioned encrypted-file envelope. CI on GitHub Actions. The clinical logic is a real rules engine, not a lookup - ASA classification emits the class, the determining factors, and a written rationale the dentist can defend.
    `,
    stack: ["React 18", "TypeScript", "Vite 7", "Web Crypto API", "AES-256-GCM", "PBKDF2", "pdf.js", "Tailwind", "Vitest"],
    image: "/projects/ficha-clinica.png",
    codeSnippet: {
      filename: "src/utils/fichaCrypto.ts",
      caption: "AES-256-GCM + PBKDF2, entirely in-browser. Sensitive health data never leaves the device.",
      code: `// Health data (LGPD art. 11) never leaves the device. All crypto runs in-browser
// via the native Web Crypto API - the exported .json is unreadable without the PIN.
const KDF_ITERATIONS = 210_000;   // PBKDF2 - high cost against offline brute force

export async function encryptFicha(data: unknown, pin: string): Promise<EncryptedPayload> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv   = crypto.getRandomValues(new Uint8Array(12));   // per-file, never reused

  const baseKey = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveKey"],
  );
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: KDF_ITERATIONS },
    baseKey, { name: "AES-GCM", length: 256 }, false, ["encrypt"],
  );

  const plaintext = new TextEncoder().encode(JSON.stringify(data));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);

  // GCM's auth tag doubles as the wrong-PIN detector: a bad PIN fails the
  // integrity check and decrypt() throws - no oracle, no silent garbage output.
  return {
    _type: "ficha-clinica", _version: 1, encrypted: true,
    savedAt: new Date().toISOString(),
    kdf: { name: "PBKDF2", hash: "SHA-256", iterations: KDF_ITERATIONS, salt: b64(salt) },
    iv: b64(iv),
    ciphertext: b64(new Uint8Array(cipher)),
  };
}`,
    },
  },
  "hyundai": {
    title: "Hyundai Onboarding Pipeline",
    category: "Enterprise Automation / Security Engineering",
    date: "2024 - 2025",
    description: `
      End-to-end automation of Hyundai's employee onboarding flow, built at Way-V. Every new hire generates a burst of sensitive data - full name, national ID (CPF), personal documents, banking details - that must land in multiple internal systems (HR, payroll, access management) before day one. Part of that flow was manual: PII copied between spreadsheets, forms, and systems. A security problem wearing an efficiency costume.

      THREAT MODEL FIRST - Before writing integration code, the question was: how does this pipeline fail, and what does it expose when it does? The controls weren't a compliance checklist bolted on at the end - they were the architecture.

      THE CONTROLS - All external input treated as hostile: schema validation, type checking, and sanitization at the edge before anything touches business logic. Documents in private S3 buckets with encryption at rest, accessed through a service-specific least-privilege IAM role - never user-bound credentials. Data minimization per integration: each destination system receives only the fields it actually needs, so a system that needs name and employee ID never sees CPF or banking data. Integrations exclusively through authenticated APIs with defined contracts - never direct database access. Secrets injected via environment configuration, never in code or Git history. PII-masked structured logging: full operational traceability without the logs becoming a shadow database of personal data. Generic external errors (internal detail goes to internal logs - error messages are free reconnaissance otherwise). Idempotent critical operations, because retries are not optional and a duplicated employee record is a second, unmanaged copy of someone's PII.

      RESULTS - Onboarding went from a multi-day manual process to an automated, consistent, traceable pipeline. PII stopped circulating through spreadsheets, intermediate copies dropped sharply, and each system's access shrank to exactly what its function required. Zero data exposure incidents across the period I operated it.
    `,
    stack: ["Python", "FastAPI", "AWS S3", "IAM", "Docker", "PostgreSQL"],
    image: "/projects/hyundai.png",
    codeSnippet: {
      filename: "onboarding/ingest.py",
      caption: "Validate at the edge, assume a short-lived least-privilege role, mask PII in logs.",
      code: `# Every external input is hostile until proven otherwise.
import structlog, boto3
from pydantic import BaseModel, field_validator

log = structlog.get_logger()
sts = boto3.client("sts")

class NewHire(BaseModel):
    """Edge schema - validation runs BEFORE anything touches business logic."""
    full_name: str
    cpf: str                 # Brazilian national ID - never logged in clear
    bank_account: str

    @field_validator("cpf")
    @classmethod
    def valid_cpf(cls, v: str) -> str:
        if not _cpf_check_digits(v):
            raise ValueError("invalid_cpf")     # generic - no reconnaissance leak
        return v

def _mask(cpf: str) -> str:
    return f"***.***.***-{cpf[-2:]}"            # PII-masked structured logging

def onboard(raw: dict) -> None:
    hire = NewHire.model_validate(raw)          # rejects malformed input at the edge
    log.info("onboarding.start", cpf=_mask(hire.cpf))

    # Service-specific, least-privilege role - short-lived, never user-bound creds.
    creds = sts.assume_role(
        RoleArn="arn:aws:iam::****:role/onboarding-writer",
        RoleSessionName="onboarding",
        DurationSeconds=900,                    # auto-expiring session
    )["Credentials"]

    # Data minimization: payroll gets name + employee_id, never CPF or banking.
    payroll.push(name=hire.full_name, employee_id=_derive_id(hire), creds=creds)`,
    },
  },
  "fintech": {
    title: "BNPL Platform",
    category: "FinTech / Microservices",
    date: "2026",
    description: `
      A full-stack Buy Now, Pay Later (BNPL) microservices platform modeled after services like Sezzle. Three independently deployed Go services backed by a React/TypeScript merchant dashboard, all orchestrated with Docker Compose.

      The BNPL Engine handles order creation and installment payment processing. Money is stored as integers (cents) - never floats - to avoid IEEE 754 rounding errors. Payment splitting guarantees the sum always equals the original total: remainder cents are distributed to the earliest installments. SELECT FOR UPDATE row locks prevent double-payment race conditions under concurrent load. The service ships with 24 tests across unit, integration (real Postgres), and full HTTP end-to-end layers.

      The Merchant API adds JWT authentication, Elasticsearch-powered transaction search, and Postgres aggregate stats. The React dashboard surfaces these through debounced search, paginated transaction tables, an installment timeline per order, and protected routes - JWT stored in memory, never localStorage, to avoid XSS exposure.
    `,
    stack: ["Go", "PostgreSQL", "Elasticsearch", "Docker", "React", "TypeScript", "JWT", "Vite"],
    image: "/projects/fintech.png",
    github: "https://github.com/PontoPe/FintechDemo",
    codeSnippet: {
      filename: "bnpl/engine.go",
      caption: "Serializable tx + row lock kills double-payment; integer cents keep the split exact.",
      code: `// Money is int64 cents, never float. The installment sum is an invariant.
func (e *Engine) PayInstallment(ctx context.Context, id InstallmentID) error {
    tx, err := e.db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelSerializable})
    if err != nil {
        return err
    }
    defer tx.Rollback()

    // Row lock prevents a double-payment race under concurrent load.
    var status string
    err = tx.QueryRowContext(ctx,
        \`SELECT status FROM installments WHERE id = $1 FOR UPDATE\`,
        id).Scan(&status)
    if err != nil {
        return err
    }
    if status == "paid" {
        return ErrAlreadyPaid          // idempotent: retries are safe
    }

    if _, err = tx.ExecContext(ctx,
        \`UPDATE installments SET status = 'paid', paid_at = now() WHERE id = $1\`,
        id); err != nil {
        return err
    }
    return tx.Commit()
}

// splitCents distributes a total so the parts ALWAYS sum back to the original.
func splitCents(total int64, n int) []int64 {
    base, rem := total/int64(n), total%int64(n)
    out := make([]int64, n)
    for i := range out {
        out[i] = base
        if int64(i) < rem {            // remainder to the earliest installments
            out[i]++
        }
    }
    return out                          // sum(out) == total, guaranteed
}`,
    },
  },
  "jbs": {
    title: "JBS Data Pipeline",
    category: "Data Engineering",
    date: "2023",
    description: `
      A high-throughput data pipeline architecture designed to ingest and process production metrics in real-time.

      Built on Apache Kafka, the system decouples data production from analysis, preventing data loss during high load peaks. It feeds a Data Lake that drives executive dashboards, providing granular monitoring of operational efficiency.
    `,
    stack: ["Python", "Apache Kafka", "Pandas", "SQL"],
    image: "/projects/jbs.png",
    codeSnippet: {
      filename: "pipeline/consumer.py",
      caption: "Encrypted + authenticated transport, manual commits, idempotent upserts.",
      code: `# Decouple production from analysis; survive load peaks without losing events.
from confluent_kafka import Consumer

consumer = Consumer({
    "bootstrap.servers": BROKERS,
    "group.id": "metrics-ingest",
    "enable.auto.commit": False,             # commit only AFTER a durable write
    "security.protocol": "SASL_SSL",         # encrypted + authenticated transport
    "sasl.mechanism": "SCRAM-SHA-512",
    "ssl.ca.location": "/etc/kafka/ca.pem",
})
consumer.subscribe(["production.metrics"])

while True:
    msg = consumer.poll(1.0)
    if msg is None:
        continue
    if msg.error():
        log.error("kafka.error", err=str(msg.error()))
        continue

    event = decode(msg.value())
    # Idempotent upsert keyed on event id - reprocessing never double-counts.
    lake.upsert(key=event.id, payload=event, partition=msg.partition())
    consumer.commit(msg, asynchronous=False)  # at-least-once, exactly-once effect`,
    },
  },
  "cowrec": {
    title: "CowRec System",
    category: "Computer Vision / AI",
    date: "2024",
    description: `
      A computer vision system designed for precision livestock farming. It uses YOLOv8 and convolutional neural networks to process real-time video feeds, allowing for the identification, tracking, and behavioral analysis of individual animals.

      The architecture runs in edge computing environments, collecting health and productivity data locally to enable data-driven decisions in dairy production.
    `,
    stack: ["Python", "YOLOv8", "OpenCV", "FastAPI", "Docker"],
    image: "/projects/cow1.jpeg",
    github: "https://github.com/PontoPe/CowRec",
    demo: "https://cowrec.com",
    codeSnippet: {
      filename: "edge/detect.py",
      caption: "Real-time per-animal tracking at the edge - only aggregates leave the box, never raw video.",
      code: `# Real-time herd inference at the edge. Raw video never leaves the farm.
from ultralytics import YOLO

model = YOLO("weights/cowrec-v8.pt")           # fine-tuned on the on-farm dataset

for frame in stream.read():                     # RTSP feed from barn cameras
    result = model.track(frame, persist=True, conf=0.6, verbose=False)[0]

    for box, tid in zip(result.boxes.xyxy, result.boxes.id):
        cow = registry.resolve(int(tid))        # stable per-animal identity
        cow.observe(bbox=box, at=frame.ts)
        if cow.gait_anomaly():                   # early lameness / health signal
            alerts.enqueue(cow.id, kind="gait", severity="review")

    # Only aggregated telemetry leaves the edge box - never raw frames.
    telemetry.flush(registry.snapshot())`,
    },
  },
  "docker-tracker": {
    title: "Docker Email Tracker",
    category: "Docker / Backend / FastAPI / DevOps",
    date: "2026",
    description: `
      An independent pixel tracking system for monitoring email engagement. It captures "email open" metrics by serving a 1x1 transparent image that triggers a backend event when loaded by a client.

      The infrastructure uses Docker Compose to orchestrate three services: FastAPI for logic, Redis for high-performance counting, and PostgreSQL for persistent logging. Key features include isolated networks for security, persistent volumes for data integrity, and custom healthchecks to manage service startup order.
    `,
    stack: ["Python", "FastAPI", "uvicorn", "HTML", "PostgreSQL", "Redis"],
    image: "/projects/docker-tracker.png",
    github: "https://github.com/PontoPe/docker-email-read-status.git",
    demo: "https://github.com/PontoPe/docker-email-read-status.git",
    codeSnippet: {
      filename: "app/main.py",
      caption: "Atomic Redis counting, hashed client IP, hardened response headers, no PII in the URL.",
      code: `# 1x1 pixel beacon. Atomic counting, isolated network, no PII in the URL.
from fastapi import FastAPI, Response, Request
import redis.asyncio as redis

app = FastAPI()
r = redis.from_url("redis://redis:6379", decode_responses=True)  # internal net only

PIXEL = bytes.fromhex("47494638396101000100800000000000ffffff21f9040100"
                      "0000002c00000000010001000002024401003b")

@app.get("/o/{token}.gif")
async def open_pixel(token: str, request: Request) -> Response:
    async with r.pipeline(transaction=True) as pipe:      # atomic multi-op
        await (pipe.hincrby(f"evt:{token}", "opens", 1)
                   .hset(f"evt:{token}", "last_ip_hash", _hash(request.client.host))
                   .execute())
    await audit.log(token=token, event="open")            # durable in Postgres
    return Response(
        content=PIXEL, media_type="image/gif",
        headers={
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
            "Content-Security-Policy": "default-src 'none'",
        },
    )`,
    },
  },
  "owcoach": {
    title: "OWCoach",
    category: "Computer Vision / Desktop App",
    date: "2025",
    description: `
      A real-time Overwatch coaching overlay that reads the game screen - not its memory - to recommend hero counters as a match unfolds. A Python detection engine captures the scoreboard/killcam region, matches hero portraits with template matching, infers the enemy composition, and renders click-through suggestions through an Overwolf overlay. Packaged as a standalone Windows desktop app.

      SAFE BY DESIGN - The whole thing is deliberately screen-space only. It never reads or writes game process memory, never injects into the client, and makes zero network calls during play - so it is not a cheat and stays inside the game's terms of service by construction. The counter logic is a local ruleset; nothing about the player's session is uploaded.

      ENGINEERING - Auto-calibration locates the relevant HUD region across resolutions, template matching runs above a 0.87 confidence threshold to avoid false positives, and the overlay stays click-through so it never intercepts input. The build ships as a PyInstaller executable with a desktop shortcut and icon, plus a small stats-fetcher that pulls aggregate hero data offline.
    `,
    stack: ["Python", "OpenCV", "mss", "NumPy", "Overwolf", "PyInstaller"],
    image: "/projects/owcoach.png",
    codeSnippet: {
      filename: "owlive/detect.py",
      caption: "Screen-space only - never touches game memory, makes zero network calls. TOS-safe by construction.",
      code: `# Reads the SCREEN locally - never game memory, never the network. TOS-safe.
import mss, numpy as np

# Screen-space template matching only: no process-memory reads, no injection.
HERO_ICONS = load_templates("hero_names.json")

with mss.mss() as sct:
    region = calibrate(sct)                  # auto-locate the killcam / scoreboard
    while running:
        frame = np.asarray(sct.grab(region))
        matches = match_templates(frame, HERO_ICONS, threshold=0.87)

        enemy = [m.hero for m in matches if m.team == "enemy"]
        counters = suggest_counters(enemy)   # local ruleset - zero API calls
        overlay.render(counters)             # click-through Overwolf overlay`,
    },
  },
  "zombiesweb": {
    title: "ZombiesWeb",
    category: "Web / Fan Project",
    date: "2026",
    description: `
      ZombiesWeb is deliberately built as two products within one project for an audience whose needs change with the moment. Between sessions, a lore fan wants to explore the universe, compare eras, and understand how branches reconnect. During a live round, often on a phone or second monitor, the same person wants one location or setup answer immediately. The interfaces diverge because the jobs diverge - not simply to create visual variety.

      THE KRONORIUM - The exploratory side is a pan, drag, filter, and zoom knowledge graph built with React Flow. A full-canvas spatial interface, archival typography, gold story nodes, fractures, branch reasons, minimap navigation, and progressive lore detail encourage visitors to wander and build a mental model of the timeline. This route accepts greater density and selective React hydration because interaction is the product.

      FIELD MANUALS - The mid-round side reverses those decisions. Static Astro routes, direct URLs, strong section anchors, compact industrial typography, orange wayfinding, and image-first location cards minimize time away from play. Easter egg steps, buildable parts, routes, and key locations are deliberately linear and scannable. No graph navigation is required to retrieve one answer.

      SHARED PROJECT, DIFFERENT DELIVERY - Both products draw from the same content universe, but Astro's static-first architecture lets each route pay only for the interaction it needs. Field Manuals arrive as useful HTML with little or no hydration; the Kronorium hydrates its graph because spatial exploration genuinely earns the JavaScript cost.
    `,
    stack: ["Astro", "React", "TypeScript", "React Flow", "Tailwind CSS v4", "GSAP"],
    image: "/projects/zombiesweb.png",
    github: "https://github.com/PontoPe/ZombiesWeb",
    demo: "https://zombies-web.vercel.app/",
    codeSnippet: {
      filename: "astro.config.ts",
      caption: "Static-first output with a locked-down CSP - React hydrates only where it must.",
      code: `// Static-first + a locked-down CSP. React hydrates only on interactive islands.
export default defineConfig({
  output: "static",
  integrations: [react(), tailwind()],
  vite: {
    plugins: [{
      name: "security-headers",
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          res.setHeader(
            "Content-Security-Policy",
            "default-src 'self'; img-src 'self' data:; script-src 'self'; " +
            "frame-ancestors 'none'; base-uri 'self'",
          );
          res.setHeader("X-Frame-Options", "DENY");
          res.setHeader("Referrer-Policy", "no-referrer");
          next();
        });
      },
    }],
  },
});`,
    },
    gallery: [
      { src: "/projects/zombiesweb2.png", caption: "The Kronorium - interactive lore timeline built with React Flow", width: 1622, height: 918 },
      { src: "/projects/zombiesweb3.png", caption: "Richtofen's lab - an interactive 3D experience to reveal the deepest secrets zombies can offer", width: 1282, height: 903 },
    ],
  },
  "portfolio": {
    title: "Personal Portfolio",
    category: "Web / Content Pipeline / CI-CD",
    date: "2026",
    description: `
      This site. A statically exported Next.js 16 application that doubles as the delivery surface for everything else in this portfolio: project case studies driven by typed data, long-form security write-ups, a markdown blog, and an interactive terminal with its own virtual filesystem.

      OBSIDIAN IS THE CMS - Posts are written as plain markdown notes in a private Obsidian vault that is itself a git repository (PontoPe/ObsidianGit). There is no admin panel, no database, and no headless CMS to keep online. Publishing is "commit the note". A push in the vault fires a repository_dispatch event at the website repository, and the deploy pipeline checks the vault out into portfolio/_content with a scoped token, copies any referenced images into public/blog-images, and builds the blog routes from frontmatter using gray-matter.

      SCHEDULED WITHOUT A SERVER - Frontmatter carries an ISO date. Future-dated notes are filtered out of both the blog index and generateStaticParams, and dynamicParams is disabled, so an unpublished post is not merely hidden - the route does not exist. Because a static export cannot decide at request time that "today" has changed, the deploy workflow also runs on a nightly cron at 00:17 America/Sao_Paulo: a post scheduled for a given date goes live on that date even if nobody commits anything.

      CI/CD - One GitHub Actions workflow composes two repositories into one artifact: checkout public site, checkout private vault, npm ci on Node 24, collect images, next build (output: "export"), then FTP the out/ directory to the host. Triggers are push to main, the vault's repository_dispatch, the nightly cron, and manual dispatch. Every third-party action is pinned to a full commit SHA, the job runs with permissions: contents: read, and persist-credentials is disabled so the checkout token is never left behind in the runner's git config.

      THE TERMINAL - The homepage carries "PontoPe OS", a client-side shell over a virtual filesystem defined in lib/virtualFS.ts: ls (with -a), cd, cat, tab completion for both commands and paths, plus shortcuts that route to the blog and a set of easter eggs ending in a Konami-code BSOD. It has no shell, no eval, and no network calls - the filesystem is a static object shipped with the page, so the whole thing is a self-contained interaction rather than an attack surface.

      DELIVERY - Static export with trailingSlash for the FTP host, unoptimized images, hardened response headers, and no server runtime at all: the published artifact is a directory of HTML, CSS, JS, and images.
    `,
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "GitHub Actions", "Obsidian + Markdown"],
    image: "/projects/portfolio.png",
    imageAlt: "Current pedromartins.tech home page: profile sidebar, featured work grid, and section index rail",
    codeSnippet: {
      filename: ".github/workflows/deploy.yml",
      caption: "Two repositories, one artifact: the private Obsidian vault is checked out into the site, then the static export is shipped. Actions pinned by SHA, read-only permissions, credentials never persisted.",
      code: `# Publishing = committing a note. The vault dispatches; this workflow builds.
on:
  push: { branches: [main] }
  repository_dispatch: { types: [update_blog] }   # fired by the Obsidian vault
  schedule:
    - cron: '17 0 * * *'                          # future-dated posts go live
      timezone: "America/Sao_Paulo"
  workflow_dispatch:

permissions:
  contents: read                                  # least privilege for the job

jobs:
  web-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1  # v7.0.1
        with: { persist-credentials: false }      # no token left in .git/config

      - name: Get private content (Obsidian)
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1  # v7.0.1
        with:
          repository: PontoPe/ObsidianGit         # private vault = the CMS
          token: \${{ secrets.GH_PAT }}
          path: portfolio/_content
          persist-credentials: false

      - run: npm ci && npm run build              # next build -> static export`,
    },
  }
};

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectsData[slug];
  const profile = projectCaseStudyProfiles[slug];

  if (!project || !profile) {
    return (
      <div className="h-screen w-full bg-[#181818] flex flex-col items-center justify-center text-white font-mono">
        <h1 className="text-4xl mb-4">404 - Project Not Found</h1>
        <Link href="/" className="text-green-500 hover:underline">&lt; Return Home</Link>
      </div>
    );
  }

  return <ProjectCaseStudyExperience project={project} profile={profile} />;
}

export async function generateStaticParams() {
  return Object.keys(projectsData).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsData[slug];
  const profile = projectCaseStudyProfiles[slug];

  if (!project || !profile) {
    return {};
  }

  const title = `${project.title} | ${project.category} | Pedro Martins`;
  const description = profile.outcome;
  const canonical = `https://pedromartins.tech/work/${slug}/`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      images: [
        {
          url: `https://pedromartins.tech${project.image}`,
          alt: project.imageAlt || `${project.title} project visual`,
        },
      ],
    },
  };
}
