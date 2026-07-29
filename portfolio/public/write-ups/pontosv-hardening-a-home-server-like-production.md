---
title: "pontosv: Hardening a Home Server Like It's Production (Because It Is)"
date: "2026-07-14"
description: "Ten weeks of mystery outages, three stacked root causes, and the security doctrine that came out of running a real production workload on hardware I own."
---

*pontosv is my bare-metal Debian 12 server - the machine that hosts the BRASILCON journal in production. This is what running it solo has taught me about hardening, incident response, and why documentation is a security control.*

## A home server with a production job

Most home labs serve their owner. Mine serves a national legal institute: the **Revista BRASILCON** journal runs here, in Docker, published through an outbound Cloudflare Tunnel. That changes the stakes. Downtime isn't "my movie server is off" - it's an academic institution's publication being unreachable. So the box gets treated like production: deliberate exposure decisions, least privilege, incident write-ups, runbooks.

## Doctrine #1: exposure is a decision, not a default

The threat model is blunt: assume the WAN is hostile, and minimize what it can see.

- The **most valuable workload** (the journal) has **zero inbound ports** - ingress is outbound-only via Cloudflare Tunnel. The origin IP isn't in public DNS. There is nothing to scan.
- The **only** ports forwarded on the router serve one service: a self-hosted TeamSpeak 6 voice server running in Docker. Two ports, each documented with its justification. That's the entire deliberate inbound surface of the network.
- Everything else - admin panels, the web console, file sharing, internal web UIs - is **LAN-only by written policy**, with an explicit list of things that must *never* be forwarded. Some panels speak plain HTTP; that's acceptable on a trusted LAN and catastrophic on the internet, so the policy exists precisely to keep that line bright.
- **SSH is key-only.** Password authentication is disabled in the SSH daemon's configuration. Bots can knock all day.

## Doctrine #2: least privilege, even for the boring stuff

The dynamic-DNS updater is a good example of security in the small things. The common self-hoster pattern is a root cron job with the API token pasted inline. Here, it runs as a **dedicated unprivileged system user** under a systemd timer, and the token lives in a root-owned config file with `640` permissions. If that little script is ever compromised, it can update a DNS record - and nothing else.

Same idea in the container layer: the voice server publishes exactly its two required ports; every other stack publishes none.

## The incident: ten weeks of "the internet randomly dies"

The best learning on this machine came from its worst period. For about ten weeks, the server lost internet connectivity every one to two weeks. The pattern was maddening: a reboot always "fixed" it, until it didn't. The tunnel would collapse, the journal would go dark, and nothing obvious explained why.

The lazy fix was another reboot. Instead I went into the journals and the packet path, and found **three stacked root causes**:

1. **Two DHCP clients racing on one NIC.** A second client had been installed months earlier alongside desktop packages. Two clients, two identities, independent renew schedules - each periodically rewriting the address and default route out from under the other.
2. **A rogue DHCP server on the LAN.** The ISP's modem was answering DHCP when it shouldn't. The smoking gun was a single journal line at 3:24 AM: one of the clients accepted a lease from the wrong network and *replaced the default route*, killing internet for the ~21 hours until the bogus lease expired. Reboots "worked" because they re-ran the DHCP race from scratch - sometimes the right server won.
3. **Three firewall managers fighting.** firewalld, ufw leftovers, and iptables-persistent were all present, layered over Docker's own rules - and firewalld's nftables table was invisible to the `iptables` commands being used to "fix" things. Every previous intervention had edited a layer that wasn't doing the blocking. Bonus trap: the persistent-rules service was silently killed by systemd at every boot due to a unit conflict, so the "saved" firewall state never loaded anyway.

**The cure was architectural, not a patch: exactly one owner per layer.** One DHCP client. One firewall authority (Docker managing its own chains, everything redundant purged or disabled). One documented reason for every rule that remains. Zero recurrences since.

That investigation taught me more about real-world incident response than any tutorial: symptoms lie, fixes that "work" hide root causes, and the config you *think* is active may have been dead at boot for months.

## Doctrine #3: documentation is a security control

Everything above lives in a **living handbook** on the server: a services-and-ports map, the firewall policy *with its rationale*, the full incident history with root-cause analysis, an honest risk register of what's still weak, and triage runbooks ordered by likelihood ("internet down? check these four things in this order").

It's written so that any competent human - or AI agent - could operate the machine cold. That's not bureaucracy. An undocumented system can't be audited, can't be handed over, and gets "fixed" by guesswork at 3 AM, which is exactly how the firewall mess accumulated in the first place. The handbook is the control that prevents the next incident from being caused by the response to the last one.

## Why this matters

Anyone can list AWS services on a CV. Running your own metal - where *you* are the security team, the network team, and the on-call rotation - forces you to actually own the questions cloud providers usually answer for you: what is exposed, who has privilege, what happens when it breaks, and how would the next person know? Those are the questions I want at the center of my work.
