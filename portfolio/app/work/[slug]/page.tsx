import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Github, Globe } from "lucide-react";

interface Project {
  title: string;
  category: string;
  date: string;
  description: string;
  stack: string[];
  image: string;
  github?: string;
  demo?: string;
  gallery?: { src: string; caption: string; width: number; height: number }[];
}

const projectsData: Record<string, Project> = {
  "brasilcon": {
    title: "Revista BRASILCON — OJS",
    category: "Secure Self-Hosted Infrastructure / Academic Publishing",
    date: "2026 - present",
    description: `
      Volunteer migration of the editorial management system of the Revista de Direito do Consumidor — the journal of BRASILCON, the Brazilian Institute of Consumer Policy and Law — to a self-hosted Open Journal Systems (OJS) platform, now live at revistabrasilcon.com. I architected it, run it in production solo, and BRASILCON formally recognized the work in an official letter (Ofício nº 13/2026) signed by its President, the journal's Director-General, and its Secretary-General.

      ZERO-OPEN-PORT INGRESS — The core security decision: the journal is published to the internet without a single inbound port. Ingress is an outbound-only Cloudflare Tunnel — the cloudflared container dials out to Cloudflare's edge, and all public traffic rides back down that authenticated connection. No port-forwards, no exposed origin IP, no direct attack surface on a residential network. TLS terminates at Cloudflare's edge, which also provides DDoS absorption and traffic filtering for free.

      DEFENSE IN DEPTH BY ARCHITECTURE — The stack is three Docker containers on an isolated bridge network: a custom-built OJS 3.4 image (configuration and patches baked in at build time — the running container is reproducible, not hand-mutated), MariaDB for the editorial database, and cloudflared. The compose file publishes zero host ports: the database is reachable only by the OJS container on the internal Docker network, and OJS itself is reachable only through the tunnel. Even someone on the LAN cannot talk to the database directly.

      OPERATIONS — All three containers restart automatically and survive reboots unattended. Day-2 work is mine alone: image rebuilds, DNS, tunnel health monitoring, incident documentation and runbooks. The platform digitizes the journal's full academic workflow — article submission, double-blind peer review, editorial rounds, and publication — for a national legal institute, running on hardware I own.
    `,
    stack: ["OJS 3.4", "PHP", "MariaDB", "Docker Compose", "Cloudflare Tunnel", "Zero-Trust Ingress", "Debian", "Self-Hosted"],
    image: "/projects/brasilcon.png",
    demo: "https://revistabrasilcon.com/",
    gallery: [
      { src: "/projects/brasilcon-letter.png", caption: "Official recognition letter from BRASILCON (Ofício nº 13/2026)", width: 1310, height: 1852 },
    ],
  },
  "pontosv": {
    title: "pontosv — Hardened Home Server",
    category: "Linux Hardening / DevSecOps / Self-Hosted Infrastructure",
    date: "2025 - present",
    description: `
      A bare-metal Debian 12 server I built and administer solo — the production machine behind the BRASILCON OJS journal. Intel i5-14400, 32 GiB RAM, 1 TB NVMe, on a residential connection in Curitiba. It is my live laboratory for the discipline that actually matters in security: deciding what gets exposed, why, and proving it.

      EXPOSURE AS A DELIBERATE DECISION — The threat model is simple: assume the WAN is hostile and minimize what it can see. The flagship service (the journal) reaches the internet through an outbound-only Cloudflare Tunnel — zero inbound ports for the box's most valuable workload. The only two ports forwarded on the router exist for the self-hosted TeamSpeak 6 voice server (Docker), and each is documented with its justification. Everything else — admin panels, Cockpit, file sharing (NFS/Samba), the web file manager — is LAN-only by policy, with an explicit written rule of what must never be forwarded. SSH is key-only; password authentication is disabled in sshd config.

      LEAST PRIVILEGE IN THE SMALL THINGS — The DuckDNS dynamic-DNS updater runs as a dedicated unprivileged system user via a systemd timer, with its token in a root-owned config file at mode 640 — not as a root cron job with the secret inline, which is how most self-hosters do it. TeamSpeak runs containerized with only its two required ports published. The Docker stacks publish no other host ports.

      INCIDENT FORENSICS — THE STORY I TELL IN INTERVIEWS — For ten weeks the server "randomly lost internet" every 1–2 weeks, and reboots only reset the clock. Instead of another reboot, I dug through journald and the packet path and found three stacked root causes: two DHCP clients racing on one NIC with independent renew schedules; a rogue DHCP server on the ISP modem that hijacked the default route (the smoking gun was a single journal line at 3:24 AM); and three firewall managers — firewalld, ufw, iptables-persistent — silently fighting each other and Docker, so every previous "fix" had edited a layer that wasn't doing the blocking. The cure was architectural: exactly one owner per layer. One DHCP client, one firewall authority, Docker managing its own chains. Zero recurrences since.

      OPERATIONS AS CODE-ADJACENT DISCIPLINE — The server is governed by a living handbook: services-and-ports map, firewall policy with rationale, full incident history with root-cause analysis, an honest risk register, and triage runbooks ordered by likelihood — written so that any competent human or AI agent could operate the machine cold. Documentation is a security control; this box treats it like one.
    `,
    stack: ["Debian 12", "Docker", "Cloudflare Tunnel", "systemd", "SSH Hardening", "nginx", "DuckDNS", "DNS / SRV", "Incident Response"],
    image: "/projects/pontosv.png",
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
  },
  "fintech": {
    title: "BNPL Platform",
    category: "FinTech / Microservices",
    date: "2026",
    description: `
      A full-stack Buy Now, Pay Later (BNPL) microservices platform modeled after services like Sezzle. Three independently deployed Go services backed by a React/TypeScript merchant dashboard, all orchestrated with Docker Compose.

      The BNPL Engine handles order creation and installment payment processing. Money is stored as integers (cents) — never floats — to avoid IEEE 754 rounding errors. Payment splitting guarantees the sum always equals the original total: remainder cents are distributed to the earliest installments. SELECT FOR UPDATE row locks prevent double-payment race conditions under concurrent load. The service ships with 24 tests across unit, integration (real Postgres), and full HTTP end-to-end layers.

      The Merchant API adds JWT authentication, Elasticsearch-powered transaction search, and Postgres aggregate stats. The React dashboard surfaces these through debounced search, paginated transaction tables, an installment timeline per order, and protected routes — JWT stored in memory, never localStorage, to avoid XSS exposure.
    `,
    stack: ["Go", "PostgreSQL", "Elasticsearch", "Docker", "React", "TypeScript", "JWT", "Vite"],
    image: "/projects/fintech.png",
    github: "https://github.com/PontoPe/FintechDemo",
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
  },
  "hyundai": {
    title: "Hyundai Onboarding Pipeline",
    category: "Enterprise Automation / Security Engineering",
    date: "2024 - 2025",
    description: `
      End-to-end automation of Hyundai's employee onboarding flow, built at Way-V. Every new hire generates a burst of sensitive data — full name, national ID (CPF), personal documents, banking details — that must land in multiple internal systems (HR, payroll, access management) before day one. Part of that flow was manual: PII copied between spreadsheets, forms, and systems. A security problem wearing an efficiency costume.

      THREAT MODEL FIRST — Before writing integration code, the question was: how does this pipeline fail, and what does it expose when it does? The controls weren't a compliance checklist bolted on at the end — they were the architecture.

      THE CONTROLS — All external input treated as hostile: schema validation, type checking, and sanitization at the edge before anything touches business logic. Documents in private S3 buckets with encryption at rest, accessed through a service-specific least-privilege IAM role — never user-bound credentials. Data minimization per integration: each destination system receives only the fields it actually needs, so a system that needs name and employee ID never sees CPF or banking data. Integrations exclusively through authenticated APIs with defined contracts — never direct database access. Secrets injected via environment configuration, never in code or Git history. PII-masked structured logging: full operational traceability without the logs becoming a shadow database of personal data. Generic external errors (internal detail goes to internal logs — error messages are free reconnaissance otherwise). Idempotent critical operations, because retries are not optional and a duplicated employee record is a second, unmanaged copy of someone's PII.

      RESULTS — Onboarding went from a multi-day manual process to an automated, consistent, traceable pipeline. PII stopped circulating through spreadsheets, intermediate copies dropped sharply, and each system's access shrank to exactly what its function required. Zero data exposure incidents across the period I operated it.
    `,
    stack: ["Python", "FastAPI", "AWS S3", "IAM", "Docker", "PostgreSQL"],
    image: "/projects/hyundai.png",
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
  },
  "zombiesweb": {
    title: "ZombiesWeb",
    category: "Web / Fan Project",
    date: "2026",
    description: `
      A fan website for Call of Duty Zombies players, built for speed — users browse it on a phone or second monitor while actively playing, so every millisecond matters. Astro's static-first architecture keeps pages as plain HTML by default, hydrating React only where interactivity is needed.

      The centerpiece is the Kronorium: a pan, drag, and zoom lore timeline built with React Flow. It maps the full CoD Zombies narrative across every map, with events rendered as custom nodes and color-coded by story thread (Aether in gold, Chaos in crimson). Directional edges let fans trace exactly how the two storylines branch and converge across decades of in-game lore.

      The Map Guides section provides fast-loading, mobile-friendly references for each map — easter egg steps, buildable parts, and key locations — so players can navigate without leaving their game.
    `,
    stack: ["Astro", "React", "TypeScript", "React Flow", "Tailwind CSS v4", "GSAP"],
    image: "/projects/zombiesweb.png",
    github: "https://github.com/PontoPe/ZombiesWeb",
    demo: "https://zombies-web.vercel.app/",
    gallery: [
      { src: "/projects/zombiesweb2.png", caption: "The Kronorium — interactive lore timeline built with React Flow", width: 1622, height: 918 },
      { src: "/projects/zombiesweb3.png", caption: "Richtofen's lab - an interactive 3D experience to reveal the deepest secrets zombies can offer", width: 1282, height: 903 },
    ],
  },
  "portfolio": {
    title: "Personal Portfolio",
    category: "Web Development",
    date: "2025",
    description: `
      A personal portfolio website built on Next.js 14+. It utilizes Server Components for fast initial loading and Tailwind CSS for styling.

      Features include a simulated terminal file system and text decryption effects. The project focuses on performance optimization and responsive design across devices.
    `,
    stack: ["Next.js", "Tailwind CSS", "TypeScript"],
    image: "/projects/portfolio.png",
  }
};

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectsData[slug];

  if (!project) {
    return (
      <div className="h-screen w-full bg-[#181818] flex flex-col items-center justify-center text-white font-mono">
        <h1 className="text-4xl mb-4">404 - Project Not Found</h1>
        <Link href="/" className="text-green-500 hover:underline">&lt; Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#181818] text-[#B1B1B1] font-mono selection:bg-white/20 selection:text-black">
      <div className="fixed top-8 left-8 z-50">
        <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-black/50 border border-white/10 rounded text-sm hover:bg-white hover:text-black transition-colors backdrop-blur">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto pt-32 pb-20 px-6">
        <div className="mb-12">
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#555] mb-4">
                <span>{project.category}</span>
                <span>•</span>
                <span>{project.date}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">{project.title}</h1>
            <div className="flex flex-wrap gap-2">
                {project.stack?.map((tech: string) => (
                    <span key={tech} className="px-3 py-1 bg-[#222] border border-white/5 rounded text-xs text-[#888]">
                        {tech}
                    </span>
                ))}
            </div>
        </div>

        <div className="w-full aspect-video bg-[#111] border border-white/10 rounded-lg overflow-hidden mb-16 relative">
             <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
             />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
                <h2 className="text-white text-xl font-bold mb-6">Overview</h2>
                <p className="text-lg leading-relaxed text-[#999] whitespace-pre-line">
                    {project.description}
                </p>
            </div>
            <div className="space-y-6">
                <h2 className="text-white text-xl font-bold mb-6">Links</h2>
                {project.github && (
                    <a href={project.github} target="_blank" className="flex items-center justify-between w-full p-4 border border-white/10 rounded hover:bg-white hover:text-black transition-colors group">
                        <span>Source Code</span>
                        <Github className="w-4 h-4" />
                    </a>
                )}
                {project.demo && (
                    <a href={project.demo} target="_blank" className="flex items-center justify-between w-full p-4 border border-white/10 rounded hover:bg-white hover:text-black transition-colors group">
                        <span>Live Demo</span>
                        <Globe className="w-4 h-4" />
                    </a>
                )}
            </div>
        </div>

        {project.gallery && project.gallery.length > 0 && (
            <div className="mt-20 space-y-12">
                {project.gallery.map((item) => (
                    <figure key={item.src}>
                        <div className="w-full bg-[#111] border border-white/10 rounded-lg overflow-hidden relative">
                            <Image
                                src={item.src}
                                alt={item.caption}
                                width={item.width}
                                height={item.height}
                                className="w-full h-auto"
                            />
                        </div>
                        <figcaption className="text-sm text-[#666] mt-4 text-center">{item.caption}</figcaption>
                    </figure>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { slug: 'brasilcon' },
    { slug: 'pontosv' },
    { slug: 'cowrec' },
    { slug: 'fintech' },
    { slug: 'hyundai' },
    { slug: 'jbs' },
    { slug: 'zombiesweb' },
    { slug: 'docker-tracker' },
    { slug: 'portfolio' },
  ];
}
