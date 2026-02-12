import Link from "next/link";
import { getPostFiles, getPostContent } from "@/lib/github";
import ReactMarkdown from "react-markdown";

export async function generateStaticParams() {
  const files = await getPostFiles();
  return files.map((file) => ({
    slug: file.name.replace(".md", ""),
  }));
}

// Em Next.js 15/16, 'params' PRECISA ser tratado como uma Promise
export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  
  // 1. Aguardamos o slug chegar
  const { slug } = await params;
  
  // 2. Decodificamos o slug (para transformar %20 de volta em espaço, se houver)
  const decodedSlug = decodeURIComponent(slug);
  
  // 3. Buscamos o conteúdo
  const { meta, content } = await getPostContent(`${decodedSlug}.md`);

  return (
    <div className="min-h-screen bg-[#111] text-[#B1B1B1] font-mono p-10 pt-32 max-w-4xl mx-auto">
      <Link href="/blog" className="text-green-500 hover:underline mb-8 block w-fit">
        &lt; cd ..
      </Link>
      
      <h1 className="text-4xl text-white mb-4">{meta.title || decodedSlug}</h1>
      <p className="text-xs text-[#666] mb-10">{meta.date}</p>
      
      <article className="prose prose-invert prose-green max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}