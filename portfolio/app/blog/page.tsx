import Link from "next/link";
import { getPostFiles, getPostContent } from "@/lib/github";

export default async function BlogPage() {
  const files = await getPostFiles();

  const posts = await Promise.all(
    files.map(async (file) => {
      const postData = await getPostContent(file.name);
      return postData;
    })
  );

  const sortedPosts = posts.sort((a, b) => {
    return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
  });

  // enough lines to cover the tallest possible post list
  const lines = Array.from({ length: Math.max(100, sortedPosts.length * 15) }, (_, i) => i + 1);

  return (
    <div className="h-screen w-full bg-[#181818] text-[#B1B1B1] font-mono overflow-hidden flex selection:bg-white/20 selection:text-black">

      <aside className="w-85 hidden lg:flex flex-col p-10 h-full border-r border-white/5 bg-[#181818] z-20">
      </aside>

      <main className="flex-1 h-full flex flex-col relative min-w-0 bg-[#1F1F1F]">
        <header className="h-11 flex-none flex items-center justify-between px-10 border-b border-white/5 bg-[#181818] z-10 text-xs tracking-[0.2em] font-bold text-[#555]">
          <div className="flex gap-8">
                <Link href="../" className="flex items-center gap-3 text-[#555] hover:text-white transition-colors cursor-pointer">pontope.info</Link>
                <span className="text-white cursor-pointer">pontope.blog</span>
            </div>
          <div className="flex items-center gap-8">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-white hidden md:inline opacity-50">status = all.systems.online</span>
            </div>
        </header>

        <div className="flex-1 relative h-full overflow-y-auto scroll-smooth bg-[#1F1F1F]">
          <div className="min-h-full flex flex-row">
            <div className="absolute left-0 top-0 h-full overflow-hidden opacity-50 w-10 py-4 flex flex-col items-end pr-2 border-r border-[#f8f8f81c] select-none bg-[#1F1F1F]">
              {lines.map((num) => (
                <span key={num} className="text-[10px] text-white leading-6 font-mono">{num}</span>
              ))}
            </div>

            <div className="flex-1 py-16 md:py-24 pr-8 md:pr-12 w-full max-w-[95%] mx-auto pl-12">
              <section className="mb-20">
                <p className="text-sm text-[#555] mb-10 font-mono">&lt;!-- Blog directory --&gt;</p>
                <h1 className="text-7xl md:text-5xl font-bold text-white tracking-tighter mb-12 italic">/var/log/blog</h1>
              </section>

              <div className="space-y-0 border-t border-white/5">
                {sortedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col md:flex-row md:items-baseline justify-between py-10 border-b border-white/5 hover:bg-white/2 transition-colors px-6 -mx-6"
                  >
                    <span className="font-mono text-base text-[#555] w-64 mb-2 md:mb-0">
                      {post.meta.date || "0000-00-00"}
                    </span>

                    <span className="font-sans font-bold text-white text-3xl flex-1 group-hover:translate-x-4 transition-transform duration-300 italic ">
                      {post.meta.title || post.slug.replace(/-/g, " ")}<br /><br />
                      <p className="font-mono text-base text-[#555] w-full mb-2 md:mb-0">
                        {post.meta.description || " "}
                    </p>
                    </span>

                    <span className="text-green-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      read_log
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="h-16 flex-none flex items-center justify-between px-10 border-t border-white/5 bg-[#181818] z-10 text-xs uppercase tracking-widest text-[#555]">
        </footer>
      </main>

      <aside className="w-60 hidden xl:flex flex-col p-10 h-full border-l border-white/5 bg-[#181818] pt-32 z-20">
      </aside>
    </div>
  );
}
