import Link from "next/link";
import { getPostFiles, getPostContent } from "@/lib/github";

export default async function BlogPage() {
  // 1. Pegamos a lista de arquivos
  const files = await getPostFiles();

  // 2. Buscamos o metadado (title, date, etc) de cada arquivo individualmente
  const posts = await Promise.all(
    files.map(async (file) => {
      const postData = await getPostContent(file.name);
      return postData;
    })
  );

  // 3. Opcional: Ordenar por data (da mais nova para a mais antiga)
  const sortedPosts = posts.sort((a, b) => {
    return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
  });

  const lines = Array.from({ length: Math.max(100, sortedPosts.length * 15) }, (_, i) => i + 1);
  return (
    <div className="h-screen w-full bg-[#181818] text-[#B1B1B1] font-mono overflow-hidden flex selection:bg-white/20 selection:text-black">
      
      {/* SIDEBAR ESQUERDA (ESTÁTICA) */}
      <aside className="w-85 hidden lg:flex flex-col justify-between p-10 h-full border-r border-white/5 bg-[#181818] z-20">
        <div className="flex flex-col gap-10">
          <div>
            
          </div>
          <p className="text-base leading-relaxed text-[#999]">
            
          </p>
        </div>
        <Link href="/" className="w-full py-4 border border-white/10 text-white text-center font-bold text-sm uppercase tracking-widest hover:bg-white/5 transition-colors">
          Back to Home
        </Link>
      </aside>

      {/* COLUNA CENTRAL */}
      <main className="flex-1 h-full flex flex-col relative min-w-0 bg-[#1F1F1F]"> 
        <header className="h-11 flex-none flex items-center justify-between px-10 border-b border-white/5 bg-[#181818] z-10 text-xs tracking-[0.2em] font-bold text-[#555]">
          <span className="text-white">pontope.info / blog</span>
          <span className="text-white opacity-50"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>status: system_online</span>
        </header>

        <div className="flex-1 relative h-full overflow-y-auto scroll-smooth bg-[#1F1F1F]">
          <div className="min-h-full flex flex-row">
            {/* NUMERAÇÃO DE LINHAS (ESTILO VSCODE) */}
            <div className="flex-none opacity-50 w-10 py-4 flex flex-col items-end pr-2 border-r border-[#f8f8f81c] select-none bg-[#1F1F1F]">
              {lines.map((num) => (
                <span key={num} className="text-[10px] text-white leading-6 font-mono">{num}</span>
              ))}
            </div>

            {/* CONTEÚDO DOS POSTS */}
            <div className="flex-1 py-16 md:py-24 pr-8 md:pr-12 w-full max-w-[95%] mx-auto pl-8">
              <section className="mb-20">
                <p className="text-sm text-[#555] mb-10 font-mono">&lt;!-- Blog directory --&gt;</p>
                <h1 className="text-7xl md:text-3xl font-bold text-white tracking-tighter mb-12 italic">/var/log/blog</h1>
              </section>

              <div className="space-y-0 border-t border-white/5">
                {sortedPosts.map((post) => (
                  <Link 
                    key={post.slug} 
                    href={`/blog/${post.slug}`} 
                    className="group flex flex-col md:flex-row md:items-baseline justify-between py-10 border-b border-white/5 hover:bg-white/2 transition-colors px-6 -mx-6"
                  >
                    {/* DATA REAL DO POST */}
                    <span className="font-mono text-base text-[#555] w-64 mb-2 md:mb-0">
                      {post.meta.date || "0000-00-00"}
                    </span>

                    {/* TÍTULO REAL DO POST (OU SLUG SE NÃO HOUVER TÍTULO) */}
                    <span className="font-sans font-bold text-white text-3xl flex-1 group-hover:translate-x-4 transition-transform duration-300 italic uppercase">
                      {post.meta.title || post.slug.replace(/-/g, " ")}
                    </span>
                    
                    <span className="text-green-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      READ_LOG
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="h-16 flex-none flex items-center justify-between px-10 border-t border-white/5 bg-[#181818] z-10 text-xs uppercase tracking-widest text-[#555]">
          <span className="font-bold text-[#777]">Pedro Martins © 2026</span>
        </footer>
      </main>

      {/* SIDEBAR DIREITA */}
      <aside className="w-60 hidden xl:flex flex-col p-10 h-full border-l border-white/5 bg-[#181818] pt-32 z-20">
        
      </aside>
    </div>
  );
}