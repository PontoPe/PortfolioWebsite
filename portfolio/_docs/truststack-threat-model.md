---
title: "TrustStack — Program Threat Model"
subtitle: "STRIDE over the seams between four repositories"
date: "2026-08-04"
description: "A published threat model for a four-layer cloud security program: eight cross-boundary threats that no component model can see from the inside, five of them with no control yet."
---

Four repositories, each with its own threat model, each internally sound. This document
models what happens **between** them.

It exists because a per-component model cannot see a threat that lives between components.
Every one of the four is correctly scoped, and the gaps below are in the space no scope
claims. Five of the eight cross-boundary threats have **no control yet** — they are stated
rather than mitigated, and marked as such.

Component models remain the authority inside their own scope:
[AwLZ](https://github.com/PontoPe/AwLZ/blob/main/docs/threat-model.md) ·
[ProvenancePipeline](https://github.com/PontoPe/ProvenancePipeline/blob/main/docs/threat-model.md) ·
[KateClusters](https://github.com/PontoPe/KateClusters/blob/main/docs/threat-model.md) ·
[PontoAntiCrack](https://github.com/PontoPe/PontoAntiCrack/blob/main/docs/threat-model.md)

---

## 1. Scope

**In scope.** The trust boundaries between the four layers: what crosses them, who owns the
control on each side, and what happens when one side changes without the other knowing. Plus
the assets shared by all four, which no single repository treats as its own.

**Out of scope.** Anything wholly inside one layer — duplicating those models here would
create a second copy to keep in sync. AWS's own control-plane integrity. Upstream CVEs in
Kubernetes, Terraform, or the Debian package set.

**Deliberately reclaimed into scope:** the operator workstation. All four repositories place
it out of scope, individually with good reason. X8 is about what that sums to.

---

## 2. Data flow and trust boundaries

```text
                    ┌──────────────────────────────────────┐
                    │   Operator workstation               │
                    │   IdC session · GitHub creds         │
                    │   kubeconfig · SSH to cluster host   │
                    └───┬──────────────┬───────────────┬───┘
                        │      B5      │      B5       │  B5
                        ▼              ▼               ▼
              ┌──────────────────┐     │       ┌───────────────┐
              │ GitHub — PontoPe │     │       │  Workstation  │
              │  4 repos, ONE    │     │       │      VM       │
              │    identity      │     │       │               │
              └───┬──────────┬───┘     │       │  KateClusters │
             B4   │          │   B4    │       │  kubeadm      │
        ┌─────────┘          └───────┐ │       │  PSA restricted│
        ▼                            ▼ │       │       ▲       │
  ┌───────────┐              ┌──────────────┐  │       │       │
  │   AwLZ    │              │ Provenance   │  │  ┌────┴─────┐ │
  │ 2 OU · 4  │              │ SBOM · grype │  │  │ Kyverno  │ │
  │ acct · SCP│              │ cosign· SLSA │  │  │verifyImgs│ │
  └─────┬─────┘              └──────┬───────┘  │  └────▲─────┘ │
        │ B2                        ▼          │       │  B1   │
        ▼                    ┌─────────────┐   │       │       │
  ┌───────────┐              │ GHCR + Rekor├───┼───────┘       │
  │ Org Trail │              └─────────────┘   │               │
  │ ObjectLock│                                │  ┌──────────┐ │
  └─────┬─────┘                                │  │  Falco + │ │
        │ B2                                   │  │  audit → │ │
        ▼                                      │  │  Loki    │ │
  ┌───────────┐        ┌──────────────┐        │  │  (local) │ │
  │ PontoAnti │───────▶│ Audit table  │        │  └────┬─────┘ │
  │  Crack    │        │  no TTL      │        └───────┼───────┘
  └───────────┘        └──────────────┘                │
                                                       ╎
        EVIDENCE PLANE A  ◀╌╌╌╌ no path exists (§6) ╌╌╌╯
                                            EVIDENCE PLANE B
```

| # | Boundary | Crossed by | Owner, side A | Owner, side B |
|---|---|---|---|---|
| **B1** | ProvenancePipeline → KateClusters | An image pull, gated at admission | ProvenancePipeline (policy) | KateClusters (cluster) |
| **B2** | AwLZ → PontoAntiCrack | Org trail delivery + the lab account | AwLZ (trail, SCPs) | PontoAntiCrack (detections) |
| **B3** | PontoAntiCrack → AWS resources | A scoped IAM role performing a write | PontoAntiCrack | The target account |
| **B4** | GitHub → AWS *and* → Sigstore | OIDC token exchange, twice, for different purposes | GitHub | AwLZ / ProvenancePipeline |
| **B5** | Operator workstation → all of it | Interactive sessions of four different kinds | *Unowned* | *Unowned* |

B5 has no owner on either side. That is the finding, not an omission in the table.

---

## 3. Shared assets

Each is the kind of thing a component model correctly treats as an input, and therefore
never protects.

| Asset | Why it is program-level | If compromised |
|---|---|---|
| The GitHub account | Trust anchor for **two unrelated capabilities**: applying Terraform to a live AWS organization, and signing container images as an identity a cluster enforces | Infrastructure takeover *and* the ability to mint images that pass admission — simultaneously |
| The operator workstation | Holds every credential that reaches any layer | All four layers at once, with no boundary between them |
| The org CloudTrail archive | AwLZ produces it; PontoAntiCrack consumes it; both treat it as given | The only forensic record for evidence plane A |
| The single operator | Every repository lists "one operator, no team to catch a mistake" as a constraint | No dual control exists on any boundary in the program |

---

## 4. STRIDE coverage, per boundary

The point of this table is the empty cells. A model that claims every category on every
boundary has not been thought about. Exclusions are argued; genuine gaps say **gap**.

| Boundary | S | T | R | I | D | E |
|---|---|---|---|---|---|---|
| **B1** Provenance → cluster | X1 | X2 | *n/a¹* | *n/a²* | X3 | X1 |
| **B2** AwLZ → PAC | X5 | X4 | X4 | *n/a³* | X5 | X5 |
| **B3** PAC → resources | — | *see R2* | X7 | — | *see R2* | *see R1* |
| **B4** GitHub → AWS + Sigstore | X6 | X6 | **gap⁴** | — | — | X6 |
| **B5** Workstation → all | X8 | X8 | X8 | X8 | X8 | X8 |

1. **Repudiation, B1.** Every admission decision is written to the Kubernetes audit log and
   every signature to the public Rekor transparency log. Denying that an image was admitted
   requires forging two independent append-only records, one of which is not ours.
2. **Information disclosure, B1.** Everything crossing this boundary is public by
   construction — a public registry, a public transparency log, a public SBOM attestation.
   There is nothing on it to disclose.
3. **Information disclosure, B2.** Delivery is one-directional into an account whose bucket
   policy and key policy both deny cross-account read. AwLZ T4 owns this and closes it.
4. **Repudiation, B4 — real gap, accepted.** GitHub's audit log is the only record that a
   workflow file changed or that a repository's visibility flipped. It is retained by GitHub,
   under the same account whose compromise is the threat, and is not shipped anywhere this
   program controls.

Categories marked `—` are covered inside a component model and are not restated here.

---

## 5. Threats that only exist between components

### X1 — The enforcement policy is deleted and both repositories stay green

**B1 · Spoofing, Elevation · Likelihood Med · Impact High · Control: none**

`verify-provenance` is authored in ProvenancePipeline and installed in KateClusters.
ProvenancePipeline's CI tests policy *files*; KateClusters' CI tests cluster *manifests* and
does not know the policy exists. `kubectl delete clusterpolicy verify-provenance` removes
admission control while **every gate in the program continues to pass.**

The deny-path tests are real and they work — against the policy as a file, not against the
live cluster. Neither repository is wrong. The check belongs to a boundary neither owns.

*Residual:* **open.** Closing it needs one assertion that the live `ClusterPolicy` exists, is
in `Enforce`, and carries the pinned identity — and it must live in the repository that owns
the *cluster*, because that is the one whose CI would notice.

### X2 — A repository setting, not code, breaks admission

**B1 · Tampering · Likelihood Med · Impact High**

ProvenancePipeline's GitHub provenance step is gated on the repo being public, and that
bundle is the only attestation Kyverno can discover on GHCR. Making the repository private
denies every subsequently built image at admission. No commit, no review, no CI run is
involved — a settings page.

*Residual:* **open, deliberately.** The program-level addition is that the blast radius lands
in a *different* repository than the one where the change is made, so the component model
understates it.

### X3 — The exclusion list ages against a cluster it does not own

**B1 · Denial of service · Likelihood High · Impact Med**

The policy excludes `kube-system`, `kyverno`, `calico-system`, `tigera-operator`, and applies
the deny-all-unsigned rule **opt-in by namespace label**. Which namespaces exist is
KateClusters' decision; which are excluded is ProvenancePipeline's. A namespace added on one
side is unprotected until someone remembers the other.

*Residual:* **open.** A test asserts the namespace gate works — not that the list is still
correct. An unlabelled namespace runs third-party images freely and nothing reports it.

### X4 — Asymmetric retention: an audit record outlives its evidence

**B2 · Tampering, Repudiation · Likelihood High · Impact Med**

PontoAntiCrack's audit table has no TTL, by design — it is the rollback source. AwLZ expires
Config history at 90 days and the CloudWatch tail at 14, and Object Lock COMPLIANCE holds for
30. After 90 days an audit record says a resource was auto-changed, and the CloudTrail
evidence justifying it may be gone.

*Residual:* **open.** During an incident review the two records disagree by construction, and
the disagreement looks like tampering rather than retention policy. Either the retentions
align or the mismatch is stated where an investigator will read it. The second is cheaper and
is what this paragraph is.

### X5 — Protection by naming convention, enforced in another repository

**B2 · Spoofing, DoS, Elevation · Likelihood Med · Impact High**

AwLZ's SCP protects `pac-*` resources — that is PontoAntiCrack's control against having its
detection path deleted. A PAC resource created without the prefix is silently unprotected,
and AwLZ has no test that PAC's resources match the pattern its policy assumes.

*Residual:* **open, and already realised in the mirror image.** `awlz-config-aggregator`
matched the protected `awlz-*` prefix and the guardrails blocked their own deployment.
Prefix-based policy fails in both directions — over-matching breaks deployment, under-matching
removes protection — **and only the first one is loud.**

### X6 — One account is both infrastructure takeover and a signing capability

**B4 · Spoofing, Tampering, Elevation · Likelihood Low · Impact Critical**

AwLZ trusts GitHub OIDC to apply Terraform to a live organization. ProvenancePipeline trusts
GitHub OIDC as the Sigstore identity a cluster enforces. Each model is correct on its own —
AwLZ conditions the role on an exact `sub` claim, ProvenancePipeline observes that keyless
signing leaves no key to steal. **Neither can see that both trust the same account.**

Existing controls are real: 2FA, branch protection, and an OIDC `sub` that embeds immutable
numeric owner and repo IDs so a rename cannot silently transfer trust.

*Residual:* **partly open, and asymmetric.** Terraform apply is gated behind a protected
environment. **Image signing is gated on a push to `main` and nothing else** — the weaker
gate guards the thing that mints artifacts a cluster is configured to trust. Aligning them
means gating the release workflow on the same environment approval.

### X7 — Two independent alert paths with no correlation

**B3 · Repudiation · Likelihood Low · Impact Med**

AwLZ's break-glass alarm and PontoAntiCrack's circuit breaker both notify, through different
topics, with no shared identifier. An incident that trips both produces two unlinked stories.

*Residual:* **accepted.** At one operator and this volume, correlation is a human reading two
messages. It stops being acceptable the moment a second responder exists.

### X8 — Four "out of scope" declarations compose into one unowned asset

**B5 · All six categories · Likelihood Low · Impact Critical**

Every repository excludes operator endpoint security, and each is right to. The workstation
holds the Identity Center session, the GitHub credentials, the kubeconfig, and the SSH key to
the cluster host. It is the only asset from which all four layers are reachable, and the only
one no model claims.

*Residual:* **open, and stated here precisely because the composition is invisible from inside
any single repository.** Nothing in the program detects use of the workstation's credentials
as anomalous — every layer treats them as the legitimate operator by construction.

---

## 6. The finding with no threat ID: two disjoint evidence planes

AwLZ and PontoAntiCrack share the org CloudTrail. KateClusters and ProvenancePipeline share
nothing with them.

Falco events and the Kubernetes audit log terminate in a **local** Loki on the workstation VM.
Nothing forwards them to AWS, and nothing in AWS knows the cluster exists. The dotted line in
§2 is not a link that broke — it is a link that was never built.

The consequence is not that either plane is weak. Both work and both have measured evidence.
It is that **no query spans them.** An attacker who obtains the operator's credentials and
moves between the AWS organization and the cluster produces two unrelated halves of a story,
in two systems, with no shared identifier and no single place a responder would look.

This is a design consequence, not a defect: shipping cluster telemetry into AWS costs money
against a USD 20/month ceiling and crosses the one boundary the program deliberately keeps
free of paid cloud. **The trade is defensible. Making it silently is not** — which is the only
reason this section exists.

---

## 7. Accepted risks

Consolidated across all four repositories, because a risk accepted in one and unknown in the
others is not really accepted.

| Risk | Origin | Why it stands | What closes it |
|---|---|---|---|
| **SLSA Build L2, not L3** | ProvenancePipeline | The provenance predicate is assembled in the same job that builds the image, so anything compromising that job can write its own provenance | `slsa-github-generator` in an isolated context. Stated in the strong form rather than claimed as "SLSA compliant" |
| **Attestation gated on repo visibility** (X2) | ProvenancePipeline | GitHub's bundle is the only one Kyverno can discover on GHCR; the original design assumption was backwards and the correction is recorded with the original left visible | Pin cosign 2.x and enforce on cosign's own attestation |
| **Nothing asserts the live policy exists** (X1) | This model | Newly identified; not previously owned by either repository | One live-cluster check in KateClusters' CI |
| **No dead-man's-switch on the detection path** | PontoAntiCrack | A deleted EventBridge rule produces no metric, so the error alarm never fires. The largest open gap in that model | A heartbeat event on a schedule, alarmed on absence |
| **Fixture provenance** | PontoAntiCrack | Two of seventeen fixtures remain documentation-derived; a test fails if the marker stops being accurate | Detonating the remaining two techniques |
| **Cryptominer detection is one rule, not two** | KateClusters | The outbound rule cannot fire when egress default-deny succeeds — prevention and that detection are not independent layers, and the CPU-anomaly panel named in the original table does not exist | A CPU signal, or accepting that a process rename defeats it |
| **NetworkPolicy is namespaced, not cluster-wide** | KateClusters | A fresh namespace is fully open until policy is applied | A Calico `GlobalNetworkPolicy`, if arbitrary namespace creation enters scope |
| **~25 min detection blind window** | KateClusters | A `[15m]` query window plus `for: 10m` means the last heartbeat must age out before the timer starts. Measured at 24m36s, not the ~15 min originally documented | A shorter window, at the cost of false positives on transient gaps |
| **Management account root is a standing credential** | AwLZ | Member accounts have no root credentials at all; the management account must keep one. Hardware MFA on two devices, password stored separately | Nothing — AWS requires it. Bounded, not closed |
| **Signing gate weaker than the apply gate** (X6) | This model | Newly identified by composing two individually correct models | Gate the release workflow on the same protected environment as Terraform apply |
| **The workstation** (X8) | This model | Four correct exclusions summing to one uncovered asset | Out of proportion to a single-operator lab; named so it is a decision rather than an oversight |
| **No multi-tenant isolation** | KateClusters | Single node, lab cluster, claimed nowhere | Not a goal |

---

## 8. What this model does not prove

- It does not prove the four layers are individually secure. That is what the component
  models are for, and they are the authority.
- It does not prove the cross-boundary controls **work**, because five of the eight threats
  have no control yet. X1, X3, X4, X5 and X8 are stated, not mitigated.
- Nothing here has been exercised end-to-end across a boundary. The per-layer evidence is real
  and measured; **cross-layer evidence does not exist.** The honest next artifact is a single
  exercise that crosses B1 and B2 in one run.
- It says nothing about AWS's control plane, upstream CVEs, or the correctness of Sigstore's
  own trust root.

---

## 9. Revisit conditions

Not a date — a list of changes that invalidate something above.

- A **fifth repository**, or any new coupling between two existing ones. Every threat here
  came from a coupling.
- A **second operator.** X7 becomes unacceptable immediately, and X8 changes shape rather
  than degree.
- **KateClusters gains a namespace**, which ages X3 the day it happens.
- **Either repository's visibility changes** — X2.
- **The release workflow gains an approval gate**, which closes half of X6 and should be
  recorded rather than absorbed.
- **Retention changes on either side of B2** — X4 is a comparison, so moving either number
  moves the finding.
