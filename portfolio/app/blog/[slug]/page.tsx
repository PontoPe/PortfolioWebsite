import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";

interface BlogPost {
  title: string;
  date: string;
  author: string;
  readTime: string;
  content: string;
}

const blogData: Record<string, BlogPost> = {
  // ARTIGO 1: CS:GO & Computer Vision
  "csgo-yolov8-analysis": {
    title: "YOLOv8 vs. Global Elites: Analyzing CS:GO Demos with Computer Vision",
    date: "15 Jan 2026",
    author: "Pedro Martins",
    readTime: "8 min read",
    content: `
      As a former professional CS:GO player, I know the difference between victory and defeat is measured in milliseconds and pixels. But as an AI Engineer, I asked myself: "Can a machine identify tactical patterns we miss?"

      The Challenge:
      Replay files (.dem) are just raw vector data. They don't show "what the player saw." To truly analyze aim efficiency and crosshair placement, I needed to process the rendered video frame by frame.

      The Architecture:
      I trained a custom YOLOv8n (Nano) model focused exclusively on character "hitboxes" in low-contrast environments (like Dust2's tunnels).
      
      The pipeline was built in Python:
      1. Video ingestion via OpenCV (cv2).
      2. Real-time inference using CUDA (GPU acceleration).
      3. IoU (Intersection over Union) calculation to determine if the crosshair was on the model *before* the shot was fired.

      Results:
      The system generated "pre-visualization" heatmaps, revealing that Tier 1 players keep their crosshair in high-probability appearance zones 87% of the time, compared to 62% for amateur players—even when no enemy is visible.
      
      This proves that "Game Sense" can, indeed, be mathematically quantified.
    `,
  },

  // ARTIGO 2: Kafka & High Performance Backend
  "kafka-event-driven": {
    title: "Killing the Monolith: Event-Driven Architecture with Kafka & Python",
    date: "22 Dec 2025",
    author: "Pedro Martins",
    readTime: "12 min read",
    content: `
      The most common mistake junior backend developers make is assuming the database is infinite. In enterprise systems (like those I architected for Hyundai and JBS), attempting a synchronous write to Postgres for every sensor event is architectural suicide.

      The Latency Problem:
      When dealing with 50,000 requests per second (RPS), database locks create a cascading effect. The API chokes, the Load Balancer times out, and the system crashes.

      The Solution: Asynchronous Decoupling.
      I implemented an architecture where the API (FastAPI) is "dumb and fast." It essentially receives the JSON, validates the schema (Pydantic), and pushes the message to an Apache Kafka topic. Response time: < 15ms.

      On the other side, we have Python "Consumers" running in isolated Docker containers. They read from Kafka at a pace the database can handle (Backpressure Handling).

      Patterns Used:
      - CQRS (Command Query Responsibility Segregation): Separating read and write operations to optimize heavy queries.
      - Dead Letter Queues: If a message fails processing, it doesn't block the queue; it's sent to a DLQ for later analysis.

      This approach transformed a fragile system into a fortress capable of processing Terabytes of data without losing a single packet.
    `,
  },

  // ARTIGO 3: Local AI Agents & RAG
  "local-rag-agents": {
    title: "Data Sovereignty: Running Local RAG Agents with Llama-3 & LangChain",
    date: "05 Nov 2025",
    author: "Pedro Martins",
    readTime: "10 min read",
    content: `
      The cloud is convenient, but privacy is non-negotiable. Recently, I was challenged to build an AI assistant for analyzing sensitive legal contracts. Sending this data to OpenAI via API was out of the question.

      The "Offline" Stack:
      To solve this, I built a RAG (Retrieval-Augmented Generation) system running entirely locally on a single RTX 4090 GPU.

      1. The LLM: I used Llama-3-8B quantized to 4-bits (GGUF). Quantization is magic: we lose less than 2% accuracy to gain 4x speed and drastically reduce VRAM usage.
      2. Vector Store: ChromaDB running in a container to index the contract PDFs.
      3. Orchestration: LangChain to connect the nodes.

      The Agent:
      I didn't just build a chatbot. I implemented a "ReAct" (Reasoning + Acting) pattern. The model doesn't just answer; it "thinks":
      Thought: The user wants to know the termination clause.
      Action: Search VectorDB for "termination" and "fine".
      Observation: Found paragraph 4.2.
      Final Answer: The fine is 10%...

      The future of AI isn't just bigger models, but specialized models running at the edge (Edge AI), where user data remains secure.
    `,
  },
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogData[slug];

  if (!post) {
    return (
      <div className="h-screen w-full bg-[#181818] flex flex-col items-center justify-center text-white font-mono">
        <h1 className="text-4xl mb-4">404 - Article Not Found</h1>
        <Link href="/blog" className="text-green-500 hover:underline">&lt; Return to Blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#181818] text-[#B1B1B1] font-mono selection:bg-white/20 selection:text-black">
      <div className="fixed top-8 left-8 z-50">
        <Link href="/blog" className="flex items-center gap-2 px-4 py-2 bg-black/50 border border-white/10 rounded text-sm hover:bg-white hover:text-black transition-colors backdrop-blur">
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto pt-32 pb-20 px-6">
        <div className="border-b border-white/10 pb-8 mb-12">
            <div className="flex flex-wrap gap-6 text-xs font-bold uppercase tracking-widest text-[#555] mb-6">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                </div>
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                {post.title}
            </h1>
        </div>

        <article className="prose prose-invert prose-lg max-w-none whitespace-pre-line text-[#999] leading-relaxed">
            {post.content}
        </article>

        <div className="mt-20 pt-10 border-t border-white/10">
            <p className="text-sm text-[#555] mb-4">Thanks for reading.</p>
            <Link href="/blog" className="text-white font-bold hover:text-green-500 transition-colors">
                &larr; Read more articles
            </Link>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { slug: 'csgo-yolov8-analysis' },
    { slug: 'kafka-event-driven' },
    { slug: 'local-rag-agents' },
  ];
}