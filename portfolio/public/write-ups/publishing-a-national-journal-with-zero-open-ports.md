---
title: "Publishing a National Journal With Zero Open Ports"
date: "2026-07-13"
description: "How Revista BRASILCON runs on hardware I own, serves readers worldwide, and exposes not a single inbound port to the internet."
---

*How the journal of BRASILCON — the Brazilian Institute of Consumer Policy and Law — runs in production on a self-hosted server, and why its entire public ingress is an outbound connection.*

## The project

In early 2026 I volunteered to migrate the editorial management of the **Revista de Direito do Consumidor** to a self-hosted **Open Journal Systems (OJS)** platform. The result is live at [revistabrasilcon.com](https://revistabrasilcon.com/): article submission, double-blind peer review, editorial rounds, and publication — the full academic workflow for a national legal institute. BRASILCON formally recognized the work in an official letter (Ofício nº 13/2026) signed by its President, the journal's Director-General, and its Secretary-General.

The interesting part, though, is *where* it runs: on a Debian server I built and administer myself, sitting on a residential internet connection. That constraint forced the best security decision in the whole project.

## The threat model of self-hosting

Hosting a public website at home traditionally means port-forwarding: you open a hole in your router, point it at your web server, and now the entire internet can reach a machine inside your house. Your home IP becomes the origin. Scanners find you within minutes. Every CVE in your web stack is now a potential foothold on your LAN.

I wanted the opposite: a journal reachable from anywhere, with an attack surface as close to zero as possible.

## Zero-open-port ingress

The answer is an **outbound-only tunnel**. A `cloudflared` container inside the stack dials *out* to Cloudflare's edge and keeps that connection alive. When a reader requests the journal, Cloudflare routes the request back down the already-established tunnel.

What this buys, concretely:

- **No inbound ports.** The router forwards nothing for the journal. There is no listening service for the internet to scan, probe, or exploit directly.
- **No exposed origin IP.** The public DNS resolves to Cloudflare, not to my connection. You cannot DDoS or portscan what you cannot address.
- **TLS and edge filtering for free.** HTTPS terminates at Cloudflare's edge, which also absorbs volumetric attacks and filters obvious junk before it ever reaches the tunnel.
- **A single, authenticated path in.** The only way traffic enters is through a tunnel the origin itself established and authenticated.

## Defense in depth inside the stack

The tunnel is the outer wall; the inside is layered too. The stack is three containers on an isolated Docker bridge network:

1. **OJS 3.4** — built as a custom image with configuration and patches baked in at build time. The running container is reproducible from source, not a hand-mutated snowflake. Rebuilding it is routine, not archaeology.
2. **MariaDB** — the editorial database.
3. **cloudflared** — the ingress.

The compose file publishes **zero host ports**. The database is reachable only by the OJS container over the internal Docker network — not from the internet, and not even from other machines on the LAN. OJS itself is reachable only through the tunnel. Every component can talk to exactly what it needs and nothing else.

## Operations

All three containers restart automatically and survive reboots unattended. Day-2 operations are mine alone: image rebuilds when OJS is patched, DNS, tunnel health monitoring, and incident documentation. The whole environment is described in a living handbook with runbooks, so the system can be operated — and audited — by someone who isn't me.

## The takeaway

"Self-hosted" and "hardened" are not opposites. A home server can publish a national institution's journal with a smaller inbound attack surface than many cloud deployments — **if exposure is treated as a design decision instead of a default**. The most secure port is the one that was never opened.
