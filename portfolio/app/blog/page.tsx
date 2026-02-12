import Link from "next/link";
import { getPostFiles } from "@/lib/github";

export default async function BlogPage() {
  const posts = await getPostFiles();

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-[#B1B1B1] font-mono">
      {/* BARRA LATERAL ESQUERDA (NÚMEROS) */}
      <div className="hidden md:flex flex-col items-center py-32 w-12 border-r border-[#222] text-[#333] select-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="text-xs leading-relaxed">
            {String(i + 1).padStart(2, '0')}
          </span>
        ))}
      </div>

      {/* ÁREA CENTRAL */}
      <main className="flex-1 flex flex-col pt-32 px-6 md:px-20 max-w-5xl">
        {/* HEADER ESTILO TERMINAL */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-[#666] mb-2 text-sm">
            <span className="text-green-500">➜</span>
            <span>~/portfolio/blog</span>
            <span className="animate-pulse">_</span>
          </div>
          <h1 className="text-4xl text-white font-bold tracking-tighter italic">BLOG</h1>
          <div className="h-1 w-20 bg-green-500 mt-2"></div>
        </div>

        {/* LISTA DE POSTS */}
        <div className="space-y-10">
          {posts.length > 0 ? (
            posts.map((post) => {
              const slug = post.name.replace(".md", "");
              return (
                <Link 
                  key={slug} 
                  href={`/blog/${slug}`}
                  className="group block border-l-2 border-[#222] hover:border-green-500 pl-6 transition-all"
                >
                  <span className="text-xs text-[#666] group-hover:text-green-500 transition-colors">
                    [ 12/02/2026 ] {/* Aqui você pode puxar a data real se desejar */}
                  </span>
                  <h2 className="text-2xl text-white group-hover:translate-x-2 transition-transform duration-300 uppercase italic font-black">
                    {slug.replace(/-/g, " ")}
                  </h2>
                  <p className="text-sm text-[#888] mt-2 group-hover:text-[#aaa]">
                    Clique para ler o log completo deste pensamento...
                  </p>
                </Link>
              );
            })
          ) : (
            <p className="text-[#666] italic">nenhum log encontrado no sistema.</p>
          )}
        </div>
      </main>

      {/* BARRA LATERAL DIREITA (DECORAÇÃO) */}
      <div className="hidden lg:block w-32 border-l border-[#222] bg-[#0d0d0d] opacity-50"></div>
    </div>
  );
}