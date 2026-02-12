import Link from "next/link";
import { getPostFiles, getPostContent } from "@/lib/github";

export default async function BlogIndex() {
  const files = await getPostFiles();
  
  // Removemos o ": any". O TS infere o tipo automaticamente agora.
  const posts = await Promise.all(
    files.map(async (file) => {
      const { meta, slug } = await getPostContent(file.name);
      return { meta, slug };
    })
  );

  return (
    <div className="min-h-screen bg-[#111] text-[#B1B1B1] font-mono p-10 pt-32">
      <h1 className="text-4xl text-white mb-10">/var/log/thoughts</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <div key={post.slug} className="border-b border-white/10 pb-8">
             <Link href={`/blog/${post.slug}`} className="text-2xl text-white hover:text-green-500 transition-colors">
               {post.meta.title}
             </Link>
             <p className="text-sm mt-2">{post.meta.date}</p>
             <p className="mt-4">{post.meta.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}