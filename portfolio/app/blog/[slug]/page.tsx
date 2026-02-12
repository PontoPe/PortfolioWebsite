import Link from "next/link";
import { getPostFiles, getPostContent } from "@/lib/github";
import ReactMarkdown from "react-markdown";

export async function generateStaticParams() {
  const files = await getPostFiles();
  return files.map((file) => ({
    slug: file.name.replace(".md", ""),
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const { meta, content } = await getPostContent(`${decodedSlug}.md`);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-[#B1B1B1] font-mono">
      
      {/* 1. CALHA LATERAL ESQUERDA (NÚMEROS DE LINHA) */}
      <div className="hidden md:flex flex-col items-center py-32 w-12 border-r border-[#222] text-[#333] select-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i} className="text-xs leading-relaxed">
            {String(i + 1).padStart(2, '0')}
          </span>
        ))}
      </div>

      {/* 2. ÁREA DE CONTEÚDO CENTRAL */}
      <main className="flex-1 flex flex-col pt-32 px-6 md:px-20 max-w-5xl pb-20">
        
        {/* NAVEGAÇÃO / HEADER */}
        <div className="mb-12">
          <Link 
            href="/blog" 
            className="flex items-center gap-2 text-green-500 hover:text-green-400 mb-6 w-fit transition-colors"
          >
            <span>&lt; cd ..</span>
          </Link>

          <div className="flex items-center gap-2 text-[#444] mb-2 text-sm">
            <span>FILE:</span>
            <span className="text-[#888]">{decodedSlug}.md</span>
          </div>
          
          <h1 className="text-4xl text-white font-bold tracking-tighter italic uppercase">
            {meta.title || decodedSlug.replace(/-/g, " ")}
          </h1>
          
          <div className="flex items-center gap-4 mt-4 text-[10px] text-[#666]">
            <span>DATE: {meta.date || "2026-02-12"}</span>
            <span>STATUS: STABLE</span>
            <div className="h-[1px] flex-1 bg-[#222]"></div>
          </div>
        </div>

        {/* ARTIGO (MARKDOWN) */}
        <article className="prose prose-invert prose-green max-w-none 
          prose-headings:italic prose-headings:tracking-tighter
          prose-pre:bg-[#0d0d0d] prose-pre:border prose-pre:border-[#222]">
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>

      </main>

      {/* 3. BARRA LATERAL DIREITA (DECORAÇÃO) */}
      <div className="hidden lg:block w-32 border-l border-[#222] bg-[#0d0d0d] opacity-50"></div>
    </div>
  );
}