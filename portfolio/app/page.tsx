"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { 
  Github, Linkedin, Mail, MapPin, Phone, 
  Download, Clock, ArrowRight, Instagram,
  Globe,
} from "lucide-react";

// --- COMPONENTES AUXILIARES ---

// 1. COMPONENTE DE TEXTO HACKER (CORRIGIDO)
const ScrambleText = ({ text, className }: { text: string, className?: string }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isVisible, setIsVisible] = useState(false);
  const chars = "!@#$%^&*()_+-=[]{}|;':\",./<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Pequeno delay para evitar o erro de "Synchronous setState"
    const startDelay = setTimeout(() => {
        // 1. Gera a bagunça inicial
        const randomStart = text.split("").map((char) => {
            if (char === " ") return " ";
            return chars[Math.floor(Math.random() * chars.length)];
        }).join("");
        
        setDisplayText(randomStart);
        setIsVisible(true);

        // 2. Inicia a animação de resolução
        let iteration = 0;
        
        // Aguarda um pouco com o texto bagunçado antes de resolver
        setTimeout(() => {
            interval = setInterval(() => {
                setDisplayText(() => 
                    text.split("").map((letter, index) => {
                        if (letter === " ") return " ";
                        if (index < iteration) return text[index];
                        return chars[Math.floor(Math.random() * chars.length)];
                    }).join("")
                );
    
                if (iteration >= text.length) clearInterval(interval);
                iteration += 1 / 3; 
            }, 30);
        }, 500);

    }, 0);

    return () => {
        clearInterval(interval);
        clearTimeout(startDelay);
    };
  }, [text]);  

  return (
    <span 
      className={`${className} transition-opacity duration-100 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
        {displayText}
    </span>
  );
};

// 2. Componente Link do Índice
const IndexLink = ({ 
    id, 
    label, 
    activeSection, 
    onClick 
}: { 
    id: string, 
    label: string, 
    activeSection: string, 
    onClick: (id: string) => void 
}) => {
    const isActive = activeSection === id;
    return (
      <a 
        href={`#${id}`} 
        onClick={() => onClick(id)}
        className={`flex items-center gap-3 transition-all duration-300 
          ${isActive 
            ? "text-white -ml-4 font-bold" 
            : "text-[#555] hover:text-white hover:translate-x-2"
          }`}
      >
        <span className={`w-1.5 h-1.5 bg-white rounded-full transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0 w-0"}`}></span>
        {label}
      </a>
    );
};

// 3. Card de Projeto
const ProjectCard = ({ 
    title, 
    subtitle, 
    status, 
    slug, 
    children 
}: { 
    title: string, 
    subtitle?: string, 
    status?: string, 
    slug: string, 
    children: React.ReactNode 
}) => (
  <Link 
    href={`/work/${slug}`} 
    className="group relative flex flex-col bg-[#181818] border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer"
  >
    <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#181818] z-10">
        <h3 className="text-white font-bold font-mono text-xl tracking-wide">{title}</h3>
        <ArrowRight className="w-6 h-6 text-[#666] group-hover:text-white group-hover:-rotate-45 transition-all duration-300" />
    </div>
    
    <div className="aspect-video w-full bg-[#111] overflow-hidden relative">
        {status && (
            <div className="absolute top-6 right-6 z-20">
                <span className="text-xs font-bold uppercase tracking-widest bg-black/60 backdrop-blur text-white border border-white/20 px-3 py-1.5 rounded-sm">
                    {status}
                </span>
            </div>
        )}
        <div className="w-full h-full group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0 relative">
            {children}
        </div>
    </div>

    {subtitle && (
        <div className="p-6 border-t border-white/5 bg-[#181818]">
            <p className="text-base text-[#888] font-mono leading-relaxed">{subtitle}</p>
        </div>
    )}
  </Link>
);

// 4. Card de Tech Stack
const TechCard = ({ name, percent, icon }: { name: string, percent: string, icon: string }) => (
    <div className="aspect-16/10 bg-[#181818] border border-white/5 p-5 flex flex-col justify-between relative hover:border-white/20 transition-colors group cursor-default">
       <span className="text-sm text-[#888] font-mono group-hover:text-white transition-colors">{name}</span>
       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-12 h-12">
            <Image 
                src={icon} 
                alt={name} 
                fill 
                className="object-contain opacity-50 group-hover:opacity-100 transition-opacity duration-300" 
            />
          </div>
       </div>
       <span className="text-xs text-[#444] font-mono self-end z-10">{percent}</span>
    </div>
);

// 5. COMPONENTE TERMINAL
const TerminalSection = () => {
    const router = useRouter();
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<string[]>([
        "PontoPe OS [Version 1.0.0]", 
        "(c) Pedro Martins. All rights reserved.",
        "Type 'help' to see available commands."
    ]);
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const command = input.trim().toLowerCase();
            const newHistory = [...history, `C:\\Users\\Guest> ${input}`];

            switch(command) {
                case 'help':
                case '?':
                    newHistory.push("Available commands:");
                    newHistory.push("  blog      - Read my thoughts & articles");
                    newHistory.push("  youtube   - Visit my channel");
                    newHistory.push("  twitch    - Watch me code live");
                    newHistory.push("  mimiza    - Check out my girl's art");
                    newHistory.push("  secret    - ?????");
                    newHistory.push("  clear     - Clear terminal");
                    break;
                case 'blog':
                    newHistory.push("Redirecting to /blog...");
                    router.push('/blog');
                    break;
                case 'youtube':
                    newHistory.push("Opening YouTube channel...");
                    window.open('https://youtube.com/@pontopepe', '_blank');
                    break;
                case 'twitch':
                    newHistory.push("Opening Twitch.tv...");
                    window.open('https://twitch.tv/pontope', '_blank');
                    break;
                case 'mimiza':
                    newHistory.push("Opening Behance portfolio...");
                    window.open('https://behance.net/milenacaldas', '_blank');
                    break;
                case 'secret':
                    newHistory.push("Unlock sequence initiated...");
                    window.open('https://youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
                    break;
                case 'clear':
                    setHistory([]);
                    setInput("");
                    return; 
                case '':
                    break;
                default:
                    newHistory.push(`'${command}' is not recognized as an internal or external command.`);
                    newHistory.push("Type 'help' for a list of commands.");
            }

            setHistory(newHistory);
            setInput("");
        }
    };

    return (
        <section className="mt-20 border-t border-white/5 pt-10 pb-20" onClick={() => inputRef.current?.focus()}>
            <div 
                ref={terminalRef} 
                className="w-full bg-black/50 p-6 font-mono text-sm border border-white/10 h-75 overflow-y-auto text-green-500 cursor-text custom-scrollbar"
            >
                <div className="space-y-1 mb-2">
                    {history.map((line, i) => (
                        <div key={i} className="wrap-break-word">{line}</div>
                    ))}
                </div>
                <div className="flex items-center flex-nowrap">
                    <span className="mr-2 whitespace-nowrap shrink-0">C:\Users\Guest&gt;</span>
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleCommand}
                        className="bg-transparent border-none outline-none text-green-500 w-full caret-green-500"
                        spellCheck={false}
                        autoComplete="off"
                    />
                </div>
            </div>
            <p className="text-xs text-[#444] mt-2 font-mono text-center">
                * Click terminal to type. Try &apos;help&apos;.
            </p>
        </section>
    );
};

// 6. COMPONENTE COLOR SPOTTER GAME (CORRIGIDO)
const ColorSpotter = () => {
  const [score, setScore] = useState(0);
  // Inicia com cores padrão para evitar erro de hidratação, depois muda no useEffect
  const [colors, setColors] = useState({ main: "#222", diff: "#222" });
  const [diffIndex, setDiffIndex] = useState(0);
  const [shake, setShake] = useState(false);

  // Função para gerar cores HSL aleatórias
  const generateColors = (currentScore: number) => {
    const hue = Math.floor(Math.random() * 360);
    const sat = 75 + Math.floor(Math.random() * 25);
    const light = 40 + Math.floor(Math.random() * 40);

    const difference = Math.max(2, 20 - currentScore); 
    
    const isLighter = Math.random() > 0.5;
    const diffLight = isLighter 
        ? Math.min(95, light + difference) 
        : Math.max(5, light - difference);

    return {
        main: `hsl(${hue}, ${sat}%, ${light}%)`,
        diff: `hsl(${hue}, ${sat}%, ${diffLight}%)`
    };
  };

  const startRound = (reset = false) => {
    const newScore = reset ? 0 : score + 1;
    setScore(newScore);
    setColors(generateColors(newScore));
    setDiffIndex(Math.floor(Math.random() * 6));
  };

  // Inicializa o jogo ao carregar (CORRIGIDO)
  useEffect(() => {
    // Timeout resolve o erro de "SetState synchronously"
    const timer = setTimeout(() => {
        startRound(true);
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleClick = (index: number) => {
    if (index === diffIndex) {
        startRound();
    } else {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setScore(0);
        startRound(true);
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto p-6 bg-[#111] border border-white/10 rounded-xl ${shake ? "animate-pulse border-red-500" : ""}`}>
        <div className="flex justify-between items-end mb-6 font-mono">
            <div>
                <h3 className="text-white font-bold text-xl">Color Spotter</h3>
                <p className="text-xs text-[#666] mt-1">Find the different block</p>
            </div>
            <div className="text-right">
                <span className="text-xs text-[#444] block uppercase tracking-widest">Score</span>
                <span className="text-4xl font-bold text-white">{score}</span>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-3 aspect-3/2">
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    onClick={() => handleClick(i)}
                    style={{ 
                        backgroundColor: i === diffIndex ? colors.diff : colors.main,
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)" 
                    }}
                    className="w-full h-full rounded-lg cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform duration-100 ease-out"
                />
            ))}
        </div>
        <p className="text-center text-[#333] text-xs mt-6 font-mono">
            {score > 5 && score < 10 && "Getting harder..."}
            {score >= 10 && score < 15 && "Expert eyes!"}
            {score >= 15 && "Godlike vision."}
        </p>
    </div>
  );
};

// 7. COMPONENTE TECH QUIZ
const TechQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  const questions = [
    {
      question: "Qual estrutura de dados utiliza o conceito LIFO (Last In, First Out)?",
      options: ["Queue (Fila)", "Stack (Pilha)", "Linked List", "Hash Map"],
      answer: 1 // Stack
    },
    {
      question: "No contexto de APIs REST, qual método HTTP é tipicamente Idempotente?",
      options: ["POST", "PUT", "PATCH", "CONNECT"],
      answer: 1 // PUT
    },
    {
      question: "O que significa o 'A' em ACID (banco de dados)?",
      options: ["Availability", "Accuracy", "Atomicity", "Authorization"],
      answer: 2 // Atomicity
    },
    {
      question: "Em Machine Learning, o que ocorre quando o modelo decora o ruído em vez do padrão?",
      options: ["Underfitting", "Backpropagation", "Gradient Descent", "Overfitting"],
      answer: 3 // Overfitting
    },
    {
      question: "Qual destes NÃO é um princípio do SOLID?",
      options: ["Single Responsibility", "Open/Closed", "Loop Invariance", "Dependency Inversion"],
      answer: 2 // Loop Invariance
    }
  ];

  const handleAnswerClick = (index: number) => {
    if (status !== "idle") return; // Previne cliques múltiplos

    setSelectedAnswer(index);

    if (index === questions[currentQuestion].answer) {
      setStatus("correct");
      setTimeout(() => {
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
          setCurrentQuestion(nextQuestion);
          setStatus("idle");
          setSelectedAnswer(null);
        } else {
          setScore(score + 1);
          setShowScore(true);
        }
      }, 800); // Espera um pouco para mostrar o verde
    } else {
      setStatus("wrong");
      setTimeout(() => {
        setStatus("idle");
        setSelectedAnswer(null);
      }, 800); // Mostra o vermelho e reseta
    }
  };

  const restartQuiz = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowScore(false);
    setStatus("idle");
    setSelectedAnswer(null);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-[#111] border border-white/10 rounded-xl font-mono">
      {showScore ? (
        <div className="text-center py-10">
          <h3 className="text-2xl text-white font-bold mb-4">Quiz Completed!</h3>
          <p className="text-[#888] mb-8">You reached the end of the challenge.</p>
          <button 
            onClick={restartQuiz}
            className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors rounded-sm"
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
            <span className="text-xs text-[#666] uppercase tracking-widest">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-xs text-[#444] uppercase tracking-widest">Tech Trivia</span>
          </div>

          <h3 className="text-white text-lg font-bold mb-8 min-h-15">
            {questions[currentQuestion].question}
          </h3>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => {
              let btnClass = "border-white/10 hover:bg-white/5 text-[#999]";
              
              if (selectedAnswer === index) {
                if (status === "correct") btnClass = "bg-green-500/20 border-green-500 text-green-500";
                if (status === "wrong") btnClass = "bg-red-500/20 border-red-500 text-red-500 animate-shake";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  className={`w-full text-left p-4 border rounded transition-all duration-200 text-sm ${btnClass}`}
                >
                  <span className="mr-3 opacity-50">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// --- PÁGINA PRINCIPAL ---

export default function Home() {
  const [time, setTime] = useState("");
  const [activeSection, setActiveSection] = useState("hero");
  
  const lines = Array.from({ length: 310 }, (_, i) => i + 1);

  const stackData = [
    { name: "Python", percent: "87%", icon: "/stack/python.png" },
    { name: "FastAPI", percent: "76%", icon: "/stack/fastapi.png" },
    { name: "Github", percent: "75%", icon: "/stack/github.png" },
    { name: "Java", percent: "72%", icon: "/stack/java.png" },
    { name: "Docker", percent: "68%", icon: "/stack/docker.png" },
    { name: "OpenCV", percent: "64%", icon: "/stack/opencv.png" },
    { name: "AWS", percent: "63%", icon: "/stack/aws.png" },
    { name: "SQL", percent: "63%", icon: "/stack/sql.png" },
    { name: "Slack", percent: "62%", icon: "/stack/slack.png" },
    { name: "Terraform", percent: "59%", icon: "/stack/terraform.png" },
    { name: "React", percent: "57%", icon: "/stack/react.png" },
    { name: "Go", percent: "57%", icon: "/stack/go.png" },
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    document.querySelectorAll("section[id], footer[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="h-screen w-full bg-[#181818] text-[#B1B1B1] font-mono overflow-hidden flex selection:bg-white/20 selection:text-black">

      {/* --- SIDEBAR ESQUERDA --- */}
      <aside className="w-85 hidden lg:flex flex-col justify-between p-10 h-full border-r border-white/5 bg-[#181818] z-20 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col gap-10">
            <div className="flex items-center gap-5">
                <div className="w-16 h-16 overflow-hidden shrink-0 flex items-center justify-center relative rounded-full">
                     <Image 
                        src="/Pedro.jpg" 
                        alt="profilePic"
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <h2 className="text-white font-bold font-mono text-lg">PontoPe</h2>
                    <p className="text-xs uppercase tracking-widest text-[#666] mt-1 font-bold"><ScrambleText text="Backend & AI Dev" /></p>
                </div>
            </div>

            <p className="text-base leading-relaxed text-[#999] font-mono">
                I’m Pedro Martins, a backend developer bringing elegant solutions to messy, complicated problems.
            </p>

            <div className="flex flex-col gap-5 text-sm font-medium text-[#777]">
                <div className="flex items-center gap-4 hover:text-white transition-colors cursor-default">
                    <Clock className="w-5 h-5 shrink-0" />
                    <span>2+ years of experience</span>
                </div>
                <div className="flex items-center gap-4 hover:text-white transition-colors cursor-default">
                    <MapPin className="w-5 h-5 shrink-0" />
                    <span>Curitiba, Brazil</span>
                </div>
                
                <div className="flex items-start gap-4 hover:text-white transition-colors cursor-default">
                    <Globe className="w-5 h-5 shrink-0 mt-1" />
                    <span className="text-xs leading-relaxed">
                        English, Portuguese, Italian, French, Spanish, German, Japanese
                    </span>
                </div>

                <a href="mailto:pegradowski@hotmail.com" className="flex items-center gap-4 hover:text-white transition-colors">
                    <Mail className="w-5 h-5 shrink-0" />
                    <span>pegradowski@hotmail.com</span>
                </a>
                <div className="flex items-center gap-4 hover:text-white transition-colors cursor-default">
                    <Phone className="w-5 h-5 shrink-0" />
                    <span>+55 (41) 99986-3595</span>
                </div>
            </div>

            <button className="flex items-center justify-between w-full px-6 py-4 border border-white/10 rounded-sm hover:bg-white/5 transition-colors group mt-2">
                <span className="text-sm font-bold text-white font-mono tracking-widest">Download CV</span>
                <Download className="w-5 h-5 text-[#666] group-hover:text-white group-hover:translate-y-0.5 transition-transform" />
            </button>
        </div>

        <div className="flex flex-col gap-3 mt-10">
             <button className="w-full py-4 bg-white text-black font-mono font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-gray-200 transition-colors">
                Schedule a call
             </button>
             <button className="w-full py-4 border border-white/10 text-white font-mono font-bold text-sm uppercase tracking-widest rounded-sm hover:bg-white/5 transition-colors">
                Work with me
             </button>
        </div>
      </aside>

      {/* --- COLUNA CENTRAL --- */}
      <main className="flex-1 h-full flex flex-col relative min-w-0 bg-[#1F1F1F]"> 
        
        <header className="h-11 flex-none flex items-center justify-between px-10 border-b border-white/5 bg-[#181818] z-10 text-xs tracking-[0.2em] font-bold text-[#555]">
            <div className="flex gap-8">
                <span className="text-white cursor-pointer">pontope.info</span>
            </div>
            <div className="flex items-center gap-8">
                <span className="flex items-center gap-3 text-green-400 bg-green-900/10 px-3 py-1.5 rounded-full border border-green-900/20">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Open to work
                </span>
                <span className="text-white hidden md:inline opacity-50">my.local.time = {time}</span>
            </div>
        </header>

        <div className="flex-1 relative h-full overflow-y-auto scroll-smooth bg-[#1F1F1F]">
            <div className="min-h-full flex flex-row">
                
                <div className="flex-none opacity-50 w-10 py-4 flex flex-col items-end pr-2 border-r border-[#f8f8f81c] select-none bg-[#1F1F1F]">
                    {lines.map((num) => (
                        <span key={num} className="text-[10px] text-white leading-6 font-mono">
                            {num}
                        </span>
                    ))}
                </div>

                <div className="flex-1 py-16 md:py-24 pr-8 md:pr-12 w-full max-w-[95%] mx-auto pl-8"> 
                    
                    {/* 1. HERO SECTION */}
                    <section id="hero" className="mb-48 scroll-mt-32">
                        <p className="text-sm text-[#555] mb-10 font-mono">&lt;!-- Hero section --&gt;</p>
                        <h1 className="text-7xl md:text-9xl font-bold text-white font-sans leading-[0.9] tracking-tighter mb-12">
                            <ScrambleText text="BackEnd" /> <span className="text-[#444]">&</span><br/>
                            <ScrambleText text="AI " /><span className="text-[#444]"><ScrambleText text="Engineer" /></span>
                        </h1>
                        <p className="text-2xl md:text-l text-[#999] max-w-4xl leading-relaxed font-mono font-thin">
                            I’m Pedro Martins, a passionate backend developer creating elegant, simple solutions to messy, complicated problems.
                        </p>
                    </section>

                    {/* 2. WORK SECTION */}
                    <section id="work" className="mb-48 scroll-mt-24">
                        <div className="flex justify-between items-end mb-10">
                            <p className="text-sm text-[#555] font-mono">&lt;!-- Featured work --&gt;</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                            <ProjectCard title="CowRec" slug="cowrec" status="Live" subtitle="Computer Vision backend for livestock tracking">
                                <Image src="/projects/cow1.jpeg" alt="CowRec Project" fill className="object-cover" />
                            </ProjectCard>
                            <ProjectCard title="Hyundai Backend" slug="hyundai" subtitle="Enterprise scalable API architecture">
                                <Image src="/projects/hyundai.png" alt="Hyundai Project" fill className="object-cover" />
                            </ProjectCard>
                            <ProjectCard title="JBS Backend" slug="jbs" subtitle="High-throughput data processing system">
                                <Image src="/projects/jbs.png" alt="JBS Project" fill className="object-cover" />
                            </ProjectCard>
                            <ProjectCard title="TourneySys" slug="tourneysys" subtitle="SaaS platform for e-sports tournaments">
                                <Image src="/projects/tourneysys.png" alt="TourneySys Project" fill className="object-cover" />
                            </ProjectCard>
                            <ProjectCard title="OlaMundo!" slug="olamundo" subtitle="Educational platform backend">
                                <Image src="/projects/olamundo.png" alt="OlaMundo Project" fill className="object-cover" />
                            </ProjectCard>
                            <ProjectCard title="Portfolio Website" slug="portfolio" subtitle="Next.js & Tailwind Personal Site">
                                <Image src="/projects/portfolio.png" alt="Portfolio Project" fill className="object-cover" />
                            </ProjectCard>
                        </div>
                    </section>

                    {/* 3. ABOUT SECTION */}
                    <section id="about" className="mb-48 scroll-mt-24">
                        <p className="text-sm text-[#555] mb-10 font-mono">&lt;!-- About me --&gt;</p>
                        <h2 className="text-5xl md:text-7xl font-bold text-white font-sans mb-16 tracking-tight">
                            Inside My <span className="text-[#444]">Creative Core</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-[#B1B1B1] leading-relaxed text-lg md:text-xl">
                            <div className="space-y-8">
                                <p>
                                    I’m an <span className="text-white bg-[#333] px-1 font-medium">Automation & AI Engineer</span> with a passion for architecting systems that are as creative as they are functional. My approach is built on a simple philosophy: <span className="text-white underline decoration-white/30 underline-offset-4">no problem is too complex if you know how to break it down.</span>
                                </p>
                            </div>
                            <div className="space-y-8">
                                <p>
                                    I leverage an innovative mindset — sparked during a <span className="text-white bg-[#333] px-1 font-medium">2017 Game Development course at Berkeley</span> — to build robust backends and intelligent agents. Today, I use tools like <span className="text-white font-bold">Python, FastAPI, and NLP</span> to deliver scalable workflows for global clients.
                                </p>
                            </div>
                        </div>
                    </section>
                    
                    {/* 4. EXPERIENCE SECTION */}
                    <section id="experience" className="mb-48 scroll-mt-24">
                        <p className="text-sm text-[#555] mb-10 font-mono">&lt;!-- Professional history --&gt;</p>
                        <div className="space-y-0 border-t border-white/5">
                            {[
                                { year: "2025 - present", role: "Backend Developer", company: "Way-V" },
                                { year: "2024 - 2025", role: "AI Engineer", company: "DeGOES Optimize" },
                                { year: "2022 - 2025", role: "Freelance Developer", company: "WebNexa" }
                            ].map((job, i) => (
                                <div key={i} className="group flex flex-col md:flex-row md:items-baseline justify-between py-10 border-b border-white/5 hover:bg-white/2 transition-colors px-6 -mx-6 cursor-default">
                                    <span className="font-mono text-base text-[#555] w-64 mb-2 md:mb-0">{job.year}</span>
                                    <span className="font-sans font-bold text-white text-3xl flex-1 group-hover:translate-x-4 transition-transform duration-300">{job.role}</span>
                                    <span className="font-mono text-base text-[#888]">{job.company}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 5. WHAT I DO SECTION */}
                    <section id="what-i-do" className="mb-48 scroll-mt-24">
                        <p className="text-sm text-[#555] mb-10 font-mono">&lt;!-- What I do --&gt;</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                            <div>
                                <h3 className="text-white text-xl font-bold mb-8 font-sans border-l-2 border-[#333] pl-4">Backend<br/>Developer</h3>
                                <ul className="space-y-4 text-base text-[#888]">
                                    <li className="hover:text-white transition-colors">Scalable API Architecture</li>
                                    <li className="hover:text-white transition-colors">Microservices & Integration</li>
                                    <li className="hover:text-white transition-colors">Cloud Infrastructure</li>
                                    <li className="hover:text-white transition-colors">Database Management</li>
                                    <li className="hover:text-white transition-colors">System Reliability</li>
                                    <li className="hover:text-white transition-colors">CI/CD & DevOps</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-white text-xl font-bold mb-8 font-sans border-l-2 border-[#333] pl-4">AI<br/>Engineer</h3>
                                <ul className="space-y-4 text-base text-[#888]">
                                    <li className="hover:text-white transition-colors">Natural Language Processing</li>
                                    <li className="hover:text-white transition-colors">Computer Vision (OpenCV)</li>
                                    <li className="hover:text-white transition-colors">LLM Integration</li>
                                    <li className="hover:text-white transition-colors">Predictive Modeling</li>
                                    <li className="hover:text-white transition-colors">Process Automation</li>
                                    <li className="hover:text-white transition-colors">Conversational AI Agents</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-white text-xl font-bold mb-8 font-sans border-l-2 border-[#333] pl-4">Web<br/>Developer</h3>
                                <ul className="space-y-4 text-base text-[#888]">
                                    <li className="hover:text-white transition-colors">Next.js & React</li>
                                    <li className="hover:text-white transition-colors">Tailwind CSS</li>
                                    <li className="hover:text-white transition-colors">Interactive UI</li>
                                    <li className="hover:text-white transition-colors">Full-Stack Integration</li>
                                    <li className="hover:text-white transition-colors">Security & Auth</li>
                                    <li className="hover:text-white transition-colors">Automated Testing</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 6. STACK SECTION */}
                    <section id="stack" className="mb-32 scroll-mt-24">
                        <p className="text-sm text-[#555] mb-10 font-mono">&lt;!-- My tech stack --&gt;</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-l border-t border-white/5">
                            {stackData.map((tech) => (
                                <TechCard 
                                    key={tech.name} 
                                    name={tech.name} 
                                    percent={tech.percent} 
                                    icon={tech.icon} 
                                />
                            ))}
                        </div>
                    </section>


                    {/* 7. COLOR GAME SECTION */}
                    <section id="game" className="mb-48 scroll-mt-24">
                        <p className="text-sm text-[#555] mb-10 font-mono">&lt;!-- Take a break --&gt;</p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-5xl md:text-7xl font-bold text-white font-sans mb-8 tracking-tight">
                                    Pixel <br />
                                    <span className="text-[#444]">Perfect</span>
                                </h2>
                                <p className="text-lg text-[#888] leading-relaxed max-w-md">
                                    Think you have an eye for detail? Spot the square with the slightly different color. The higher the score, the smaller the difference.
                                </p>
                            </div>
                            <div className="flex justify-center lg:justify-end">
                                <ColorSpotter />
                            </div>
                        </div>
                    </section>

                    {/* 8. QUIZ SECTION */}
                    <section id="quiz" className="mb-48 scroll-mt-24">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
                                <TechQuiz />
                            </div>
                            <div className="order-1 lg:order-2 text-right">
                                <h2 className="text-5xl md:text-7xl font-bold text-white font-sans mb-8 tracking-tight">
                                    Knowledge <br />
                                    <span className="text-[#444]">Check</span>
                                </h2>
                                <p className="text-lg text-[#888] leading-relaxed max-w-md ml-auto">
                                    Validating backend concepts and architecture patterns. Test your knowledge against these technical interview questions.
                                </p>
                            </div>
                        </div>
                    </section>
                    
                    {/* 7. CONTACT SECTION */}
                    <section id="contact" className="mb-24 scroll-mt-24">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                            <div>
                                <p className="text-sm text-[#555] mb-10 font-mono">&lt;!-- Get in Touch --&gt;</p>
                                <h2 className="text-5xl md:text-7xl font-bold text-white font-sans mb-8 tracking-tight">
                                    Let&apos;s Work <br />
                                    <span className="text-[#444]">Together</span>
                                </h2>
                            </div>

                            <form 
                                action="https://formsubmit.co/pegradowski@hotmail.com" 
                                method="POST"
                                className="space-y-8 pt-16"
                            >
                                <input type="hidden" name="_template" value="table" />
                                <input type="hidden" name="_captcha" value="false" />
                                <input type="hidden" name="_next" value="https://pontope.info" /> 
                                <input type="hidden" name="_subject" value="Novo Contato do Portfólio!" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-[#666] uppercase tracking-wider">First name*</label>
                                        <input type="text" name="firstName" required placeholder="Mazakine" className="w-full bg-[#181818] border border-white/5 p-4 text-white placeholder:text-[#444] focus:border-white/20 outline-none transition-colors font-mono text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-[#666] uppercase tracking-wider">Last name*</label>
                                        <input type="text" name="lastName" required placeholder="Reed" className="w-full bg-[#181818] border border-white/5 p-4 text-white placeholder:text-[#444] focus:border-white/20 outline-none transition-colors font-mono text-sm" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-[#666] uppercase tracking-wider">Email address*</label>
                                    <input type="email" name="email" required placeholder="example@gmail.com" className="w-full bg-[#181818] border border-white/5 p-4 text-white placeholder:text-[#444] focus:border-white/20 outline-none transition-colors font-mono text-sm" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-[#666] uppercase tracking-wider">Subject*</label>
                                    <input type="text" name="subject" required placeholder="State your purpose" className="w-full bg-[#181818] border border-white/5 p-4 text-white placeholder:text-[#444] focus:border-white/20 outline-none transition-colors font-mono text-sm" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-[#666] uppercase tracking-wider">Message</label>
                                    <textarea name="message" required rows={6} placeholder="Write your message here" className="w-full bg-[#181818] border border-white/5 p-4 text-white placeholder:text-[#444] focus:border-white/20 outline-none transition-colors font-mono text-sm resize-none"></textarea>
                                </div>

                                <button type="submit" className="px-8 py-4 bg-white text-black font-bold font-mono text-sm uppercase tracking-widest hover:bg-[#e0e0e0] transition-colors">
                                    Send message
                                </button>
                            </form>
                        </div>
                    </section>

                    {/* 8. TERMINAL SECTION (CMD) */}
                    <TerminalSection />

                </div>
            </div>
        </div>

        {/* RODAPÉ DO FRAME */}
        <footer className="h-16 flex-none flex items-center justify-between px-10 border-t border-white/5 bg-[#181818] z-10 text-xs uppercase tracking-widest text-[#555]">
            <span className="font-bold text-[#777]"></span>
            <div className="flex items-center gap-8">
                <div className="flex gap-6">
                    <a href="https://github.com/PontoPe" target="_blank" rel="noopener noreferrer">
                        <Github className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                    </a>
                    <a href="https://instagram.com/pontope.gg" target="_blank" rel="noopener noreferrer">
                        <Instagram className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                    </a>
                    <a href="https://linkedin.com/in/pedro-g-martins" target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                    </a>    
                    <a href="mailto:pegradowski@hotmail.com" target="_blank" rel="noopener noreferrer">
                        <Mail className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                    </a>        
                </div>
            </div>
        </footer>

      </main>

      {/* --- SIDEBAR DIREITA --- */}
      <aside className="w-60 hidden xl:flex flex-col p-10 h-full border-l border-white/5 bg-[#181818] pt-32 z-20">
        <h3 className="text-white font-mono font-bold mb-10 uppercase tracking-widest">Index</h3>
        <nav className="flex flex-col gap-6 text-xs font-mono font-bold tracking-wider">
            <IndexLink id="hero" label="PontoPe" activeSection={activeSection} onClick={setActiveSection} />
            <IndexLink id="work" label="Featured Work" activeSection={activeSection} onClick={setActiveSection} />
            <IndexLink id="about" label="About me" activeSection={activeSection} onClick={setActiveSection} />
            <IndexLink id="experience" label="Experience" activeSection={activeSection} onClick={setActiveSection} />
            <IndexLink id="what-i-do" label="What I Do" activeSection={activeSection} onClick={setActiveSection} />
            <IndexLink id="stack" label="Tech Stack" activeSection={activeSection} onClick={setActiveSection} />
            <IndexLink id="game" label="Mini Game" activeSection={activeSection} onClick={setActiveSection} />
            <IndexLink id="quiz" label="Quiz" activeSection={activeSection} onClick={setActiveSection} />
            <div className="mt-8">
                 <IndexLink id="contact" label="Contact me" activeSection={activeSection} onClick={setActiveSection} />
            </div>
        </nav>
      </aside>

    </div>
  );
}