"use client";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react"; 

const posts = [
  {
    slug: "csgo-yolov8-analysis",
    title: "YOLOv8 vs. Global Elites: Analyzing CS:GO Demos with Computer Vision",
    date: "15 Jan 2026",
    excerpt: "Can an AI see what a Pro Player misses? I trained a custom YOLO model to analyze crosshair placement efficiency in real-time replay parsing.",
  },
  {
    slug: "kafka-event-driven",
    title: "Killing the Monolith: Event-Driven Architecture with Kafka & Python",
    date: "22 Dec 2025",
    excerpt: "How to handle 50k RPS without crashing the database. A deep dive into asynchronous consumers, backpressure handling, and CQRS patterns.",
  },
  {
    slug: "local-rag-agents",
    title: "Data Sovereignty: Running Local RAG Agents with Llama-3 & LangChain",
    date: "05 Nov 2025",
    excerpt: "Privacy is non-negotiable. Building a fully offline legal assistant using 4-bit quantization and vector stores on a single GPU.",
  },
];

export default function BlogIndex() {
  return (
    <div className="min-h-screen w-full bg-[#181818] text-[#B1B1B1] font-mono selection:bg-white/20 selection:text-black">
      
      {/* Botão Voltar */}
      <div className="fixed top-8 left-8 z-50">
        <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-black/50 border border-white/10 rounded text-sm hover:bg-white hover:text-black transition-colors backdrop-blur">
            <ArrowLeft className="w-4 h-4" />
            <span>Terminal</span>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto pt-32 pb-20 px-6">
        <h1 className="text-6xl font-bold text-white mb-4">/blog</h1>
        <p className="text-[#666] mb-16 border-b border-white/10 pb-8">
            Thoughts, tutorials, and rants about code.
        </p>

        <div className="space-y-12">
            {posts.map((post) => (
                <Link 
                    key={post.slug} 
                    href={`/blog/${post.slug}`}
                    className="block group cursor-pointer"
                >
                    <div className="flex items-center gap-2 text-xs text-[#555] mb-2">
                        <Calendar className="w-3 h-3" />
                        <span>{post.date}</span>
                    </div>
                    <h2 className="text-2xl text-white font-bold mb-3 group-hover:text-green-500 transition-colors">
                        {post.title}
                    </h2>
                    <p className="text-[#888] leading-relaxed">
                        {post.excerpt}
                    </p>
                    <div className="mt-4 text-xs font-bold uppercase tracking-widest text-[#444] group-hover:text-white transition-colors">
                        Read Article &rarr;
                    </div>
                </Link>
            ))}
        </div>
      </div>
    </div>
  );
}