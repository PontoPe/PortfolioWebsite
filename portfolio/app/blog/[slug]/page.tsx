/* eslint-disable react/jsx-no-comment-textnodes */
import Link from "next/link";
import { getPostFiles, getPostContent } from "@/lib/github";
import ReactMarkdown from "react-markdown";

export async function generateStaticParams() {
  const files = await getPostFiles();
  return files.map((file) => ({ slug: file.name.replace(".md", "") }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const { meta, content } = await getPostContent(`${decodedSlug}.md`);
  const lines = Array.from({ length: 200 }, (_, i) => i + 1);

  return (
    <div className="h-screen w-full bg-[#181818] text-[#B1B1B1] font-mono overflow-hidden flex">
      {/* SIDEBAR ESQUERDA (MANTIDA PARA PADRÃO) */}
      <aside className="w-85 hidden lg:flex flex-col p-10 h-full border-r border-white/5 bg-[#181818] z-20">
         <Link href="/blog" className="text-green-500 hover:text-white transition-colors mb-10 text-sm font-bold">
           &lt; cd ../
         </Link>
      </aside>

      {/* COLUNA CENTRAL (Onde o blog acontece) */}
      <main className="flex-1 h-full flex flex-col relative min-w-0 bg-[#1F1F1F]">
        <header className="h-11 flex-none flex items-center px-10 border-b border-white/5 bg-[#181818] z-10 text-[10px] font-bold text-[#555] tracking-widest">
          File: <span className="text-white ml-2">{decodedSlug}.md</span> _| Size: <span className="text-white ml-2">{content.length} bytes</span> _| Type: <span className="text-white ml-2">text/markdown</span>
        </header>

        <div className="flex-1 relative h-full overflow-y-auto scroll-smooth bg-[#1F1F1F] custom-scrollbar">
          <div className="min-h-full flex flex-row">
            {/* GUTTER DE NÚMEROS IGUAL À HOME */}
            <div className="flex-none opacity-50 w-10 py-4 flex flex-col items-end pr-2 border-r border-[#f8f8f81c] select-none">
              {lines.map((num) => (
                <span key={num} className="text-[10px] text-white leading-6 font-mono">{num}</span>
              ))}
            </div>

            {/* ARTIGO */}
            <div className="flex-1 py-16 md:py-24 px-8 md:px-20 max-w-4xl">
              <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tighter mb-4">
                {meta.title || decodedSlug.replace(/-/g, " ")}
              </h1>
              <p className="text-xs text-[#555] mb-16 font-bold uppercase tracking-widest">
                Published: {meta.date || "2026.02.12"} // Root Access: Granted
              </p>
              <p className="text-xs text-[#555] mb-16 font-bold uppercase tracking-widest">
              </p>

              <article className="prose prose-invert prose-green max-w-none 
                prose-headings:text-white prose-headings:italic prose-headings:tracking-tighter
                prose-p:text-[#B1B1B1] prose-p:leading-relaxed
                prose-pre:bg-[#181818] prose-pre:border prose-pre:border-white/5">
                <ReactMarkdown>{content}</ReactMarkdown>
              </article>
            </div>
          </div>
        </div>
      </main>

      <aside className="w-60 hidden xl:block h-full border-l border-white/5 bg-[#181818] z-20 opacity-30"></aside>
    </div>
  );
}