import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Github, Globe } from "lucide-react";

// 1. DEFINIR A INTERFACE
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

// 2. DADOS DOS PROJETOS
const projectsData: Record<string, Project> = {
  "cowrec": {
    title: "CowRec System",
    category: "Computer Vision / AI",
    date: "2024",
    description: `
      O CowRec não é apenas um sistema de monitoramento; é a aplicação de Visão Computacional de ponta para revolucionar a pecuária de precisão. 
      
      Utilizando o poder do YOLOv8 e redes neurais convolucionais, o sistema processa feeds de vídeo em tempo real para identificar, rastrear e analisar o comportamento individual de cada animal no rebanho.
      
      A arquitetura foi desenhada para operar em ambientes hostis (Edge Computing), garantindo que dados vitais sobre saúde e produtividade sejam coletados instantaneamente, permitindo uma tomada de decisão baseada em dados que maximiza a eficiência da produção leiteira.
    `,
    stack: ["Python", "YOLOv8", "OpenCV", "FastAPI", "Docker"],
    image: "/projects/cow1.jpeg", 
    github: "https://github.com/PontoPe/CowRec", 
    demo: "https://cowrec.com", 
  },
  "hyundai": {
    title: "Hyundai Process Manager",
    category: "Enterprise Automation",
    date: "2023",
    description: `
      Uma solução de orquestração de processos massiva, desenvolvida para eliminar gargalos operacionais em uma das maiores montadoras do mundo.
      
      Este sistema atua como o "cérebro digital" da fábrica, automatizando decisões complexas de ponta a ponta: desde o cálculo preditivo de estoque de peças para a montagem de um veículo específico até a alocação dinâmica de engenheiros e técnicos na linha de produção.
      
      Além do chão de fábrica, a arquitetura se estende aos processos administrativos, gerindo fluxos de contratação e desligamento com a mesma precisão cirúrgica aplicada à montagem de automóveis, resultando em uma redução drástica de desperdício e tempo ocioso.
    `,
    stack: ["Java", "Spring Boot", "AWS", "PostgreSQL"],
    image: "/projects/hyundai.png",
  },
  "jbs": {
    title: "JBS Data Pipeline",
    category: "Data Engineering",
    date: "2023",
    description: `
      Em operações de escala global, milissegundos importam. Este projeto consistiu na arquitetura de um pipeline de dados de altíssimo throughput, capaz de ingerir e processar terabytes de informações de produção em tempo real.
      
      Utilizando Apache Kafka como espinha dorsal, o sistema desacopla a produção da análise, garantindo que nenhum dado crítico seja perdido, mesmo sob picos extremos de carga.
      
      O resultado é um Data Lake robusto e confiável que alimenta dashboards executivos com métricas precisas, permitindo que a gigante da alimentação monitore sua eficiência operacional com granularidade sem precedentes.
    `,
    stack: ["Python", "Apache Kafka", "Pandas", "SQL"],
    image: "/projects/jbs.png",
  },
  "tourneysys": {
    title: "TourneySys",
    category: "SaaS Platform",
    date: "2023",
    description: `
      Gerenciar campeonatos de e-sports exige mais do que planilhas; exige uma infraestrutura capaz de suportar a intensidade da competição.
      
      O TourneySys é uma plataforma SaaS completa projetada para organizadores de torneios. Com um algoritmo robusto de geração de chaves (brackets) e atualizações em tempo real, ele elimina o caos da gestão manual.
      
      A interface reativa garante que jogadores e espectadores tenham acesso instantâneo a resultados e próximos confrontos, criando uma experiência profissional e fluida, seja para campeonatos locais ou torneios de larga escala.
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
      Desmistificando a complexidade do código para a próxima geração de desenvolvedores. O "OlaMundo!" é uma plataforma educacional gamificada que transforma o aprendizado de lógica de programação em uma experiência visual e intuitiva.
      
      Inspirado na pedagogia interativa de apps como Duolingo, desenvolvi uma interface gráfica completa (GUI) em Java que guia novatos através de desafios progressivos.
      
      O sistema abstrai a sintaxe difícil inicial, focando na construção do raciocínio algorítmico, criando uma base sólida e encorajadora para quem está escrevendo suas primeiras linhas de código.
    `,
    stack: ["Java", "Swing/FX", "OOP Patterns"],
    image: "/projects/olamundo.png",
  },
  "portfolio": {
    title: "Portfolio Pessoal",
    category: "Web Development",
    date: "2025",
    description: `
      Este site não é apenas uma vitrine, é uma declaração de capacidade técnica. Construído sobre o ecossistema moderno do Next.js 14+, ele combina performance extrema com design "Hacker/Terminal".
      
      Cada interação foi micro-otimizada: do sistema de arquivos virtual simulado no terminal aos efeitos de texto criptografado. A arquitetura utiliza Server Components para carregamento instantâneo e Tailwind CSS para um design system consistente e responsivo.
      
      Mais do que mostrar projetos, este portfólio demonstra na prática o domínio sobre Frontend, UX Design e Engenharia de Software moderna.
    `,
    stack: ["Next.js", "Tailwind CSS", "TypeScript"],
    image: "/projects/portfolio.png",
  }
};

// 3. COMPONENTE DE PÁGINA (SERVER COMPONENT)
// Note que agora é 'async' e recebe 'params' como Promise
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  
  // No Next.js 15+, params é uma Promise, precisamos do await
  const { slug } = await params;
  const project = projectsData[slug];

  // 404
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

// 4. GERAÇÃO ESTÁTICA (Isso funciona porque removemos o "use client")
export async function generateStaticParams() {
  return [
    { slug: 'cowrec' },
    { slug: 'hyundai' },
    { slug: 'jbs' },
    { slug: 'tourneysys' },
    { slug: 'olamundo' },
    { slug: 'portfolio' },
  ];
}