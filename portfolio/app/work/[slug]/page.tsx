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
}

const projectsData: Record<string, Project> = {
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
    demo: "https://github.com/PontoPe/docker-email-read-status.git",
  },
  "hyundai": {
    title: "Hyundai Process Manager",
    category: "Enterprise Automation",
    date: "2023",
    description: `
      A process orchestration system built for automotive manufacturing operations. It acts as a central logic unit, automating decisions ranging from predictive parts inventory for vehicle assembly to dynamic staff allocation on the production line.

      The system also manages administrative workflows, such as hiring and termination processes, standardizing operations to reduce downtime and resource waste.
    `,
    stack: ["Java", "Spring Boot", "AWS", "PostgreSQL"],
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
  "tourneysys": {
    title: "TourneySys",
    category: "SaaS Platform",
    date: "2023",
    description: `
      A SaaS platform for e-sports tournament management. The system includes an algorithmic bracket generator and real-time match updates to replace manual spreadsheet management.

      The interface provides players and spectators with immediate access to results and schedules, supporting both local events and larger scale competitions.
    `,
    stack: ["React", "Node.js", "MongoDB"],
    image: "/projects/tourneysys.png",
    github: "https://github.com/PontoPe/Tournament-System",
  },
  "olamundo": {
    title: "OlaMundo!",
    category: "EdTech / Java GUI",
    date: "2024",
    description: `
      A gamified educational platform for learning programming logic. It features a custom Java-based Graphical User Interface (GUI) that guides users through progressive coding challenges.

      The system abstracts complex syntax to focus on algorithmic reasoning, helping beginners understand core concepts before moving to raw code.
    `,
    stack: ["Java", "Swing/FX", "OOP Patterns"],
    image: "/projects/olamundo.png",
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
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { slug: 'cowrec' },
    { slug: 'hyundai' },
    { slug: 'jbs' },
    { slug: 'tourneysys' },
    { slug: 'olamundo' },
    { slug: 'docker-tracker' },
    { slug: 'portfolio' },
  ];
}
