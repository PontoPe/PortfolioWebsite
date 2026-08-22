# pontosv portfolio entry — what's out of date

Compiled 2026-08-21. Source: `github.com/PontoPe/PortfolioWebsite`,
`portfolio/lib/projectCaseStudyProfiles.ts`, the `pontosv:` object
(currently lines ~356–419). Cross-checked against the live server and its
handbook (`pontosv-server-handbook.md`), not against memory of either.

The entry is built entirely around the June 2026 DHCP/firewall incident
("three conflicting network owners"). That story is still accurate and
still a good incident-response case study — nothing below says to remove
it. The gap is everything that's happened since, none of which the entry
reflects.

---

## 1. Factually stale, not just incomplete

**`retrospective.next`** currently reads:

```ts
next: ["More external observability", "Routine configuration-drift checks", "Scheduled recovery practice"]
```

All three are done:

| Listed as "next" | Actually shipped |
|---|---|
| More external observability | UptimeRobot + healthchecks.io (2026-08-15, two-tier dead-man's-switch design); Uptime Kuma added 2026-08-21 with real uptime/response-time trend data |
| Routine configuration-drift checks | `~/Coding/pontosv-ansible` (2026-08-21) — `ansible-playbook --check --diff` against the live box reported `changed=0` on every task, i.e. drift detection actually running, not aspirational |
| Scheduled recovery practice | Restic backups have been restore-tested since 2026-07-18 (predates this list) |

This section should not say "next" for things that are done — it reads as
either unaware of the later work or (worse) as if the work never happened.

---

## 2. Skill categories missing entirely

`ownership` and `retrospective.demonstrates` list categories from the
network-incident story only. Three real, evidenced categories have no
representation anywhere in this entry:

- **Detection engineering** — CrowdSec live since 2026-08-21. Correctly
  handles this box having no `/var/log/auth.log` (no rsyslog installed;
  everything's in journald) via a `journalctl_filter` acquisition.
  Verified two ways, not asserted: a real SSH connection traced end-to-end
  through the pipeline, and `cscli explain` confirmed all six
  ssh-bruteforce scenarios match an attack-shaped synthetic log line
  without needing to throw a real attack at production sshd.
- **Vulnerability management** — Trivy, scheduled weekly
  (`pontosv-check-trivy.timer`), diffs CRITICAL CVE IDs against the last
  run rather than alerting on raw totals (the totals-mislead lesson —
  same one TrustStack's write-up makes about CIS scores). A real CRITICAL,
  `CVE-2026-31789` (OpenSSL heap overflow), was found and patched same-day
  — measured before/after: CRITICAL count 8 → 5 on the next scan, not
  claimed.
- **Infrastructure as code** — first Ansible role, proven idempotent
  against the actual production box (see table above), not a toy demo.

---

## 3. The entry doesn't say what's actually running

`problem` currently says "hosting real workloads" with no specifics. What's
actually there:

- **OJS** — a real academic journal (Revista de Direito do Consumidor,
  institutional client BRASILCON), live production, 26 submissions / 78
  registered users as of 2026-08-21, not a demo install.
- **Nextcloud**, **TeamSpeak 6**, and now a **public status dashboard**.

The dashboard specifically is worth naming: **`sv.pegradowski.com`**, live
right now, publicly reachable, showing real container health, security
posture (CrowdSec/Trivy/SSH), a node-graph of backup history (built from
real `restic diff` output — what changed between snapshots, not just that
they exist), and system stats. It's a clickable artifact a reader can
open themselves — currently absent from the case study, and probably the
single strongest "don't take my word for it" element available for this
project. Worth linking directly.

Its architecture is also itself a demonstrable security decision: a
root-run collector on a timer gathers privileged data (Docker, journald,
`cscli`, `restic`) and writes one JSON snapshot; the actual internet-facing
process runs as a dedicated unprivileged system user with no sudo, no
docker group, no log access — it only ever reads that file. If the public
half is ever compromised, the blast radius is "read one status file," not
"call `sudo docker`." That's a concrete least-privilege design decision,
not a talking point.

---

## 4. `metrics` is scoped 100% to the June incident

Current:

```ts
metrics: [
  { value: "3", label: "root causes in one recurring incident" },
  { value: "1", label: "authoritative DHCP client after correction" },
  { value: "1", label: "firewall authority after correction" },
  { value: "0", label: "recurrences after the architectural fix" },
]
```

Real numbers available for a second set, if the entry gets a second act
(see §5):

- CRITICAL CVEs on the OJS image: 8 → 5 (one root-caused and patched
  same-day; five require an OJS 3.5 upgrade, already scoped in a written
  runbook, not yet executed)
- CrowdSec: 8 collections enabled, 6 attack scenarios verified against
  synthetic input, 0 alerts to date (clean signal, not "nothing built")
- 13 snapshots in the restic/B2 repo, 6.8 GB, 1.74× compression
- Ansible role: `changed=0` on a real run against production — the
  idempotency claim measured, not asserted

---

## 5. The actual open question: extend, or a second case study?

`layout: "incident-first"` is doing real narrative work for the June
story — a focused incident write-up reads better than a kitchen sink.
The August work (detection, vuln management, IaC, public observability)
is different *in kind*, not a continuation of the same story: "I found and
fixed one network conflict" vs. "I operate this box as a monitored,
detected, patched, reproducible platform." Two options, not a
recommendation either way:

- **Extend this entry** — add a second `metrics` row or a "since then"
  section, update `ownership`/`demonstrates`, fix `retrospective.next`,
  link the dashboard. Lower effort, keeps one entry, but the
  `layout: "incident-first"` structure may need to flex to hold both
  stories without diluting the original one.
- **New case study** — a distinct entry for the operational-maturity
  story, cross-linked from this one (`nextSlug`/`previousSlug` or an
  inline reference). Matches how TrustStack is itself split into four
  layers/repos rather than one mega-entry. Higher effort, cleaner
  separation, and gives the dashboard link and the detection/vuln-mgmt/IaC
  material room to be a proof-driven story on its own terms rather than a
  bolt-on to the DHCP incident.

Not decided here on purpose — this is a framing choice, not a factual one.
