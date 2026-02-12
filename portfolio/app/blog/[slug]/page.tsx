import Link from "next/link";
import { getPostFiles, getPostContent } from "@/lib/github";
import ReactMarkdown from "react-markdown"; 

// --- ÁREA 1: IMPORTS E CONFIGURAÇÕES ---

// ERRO COMUM: Não coloque essa função dentro do "export default function BlogPost"
// ELA TEM QUE FICAR AQUI FORA:
export async function generateStaticParams() {
  const files = await getPostFiles();
  
  // Se não houver posts, retorna lista vazia para não quebrar o build
  if (!files) return [];

  return files.map((file) => ({
    slug: file.name.replace(".md", ""),
  }));
}

// --- ÁREA 2: O COMPONENTE DA PÁGINA ---

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { meta, content } = await getPostContent(`${params.slug}.md`);

  return (
    <div className="min-h-screen bg-[#111] text-[#B1B1B1] font-mono p-10 pt-32 max-w-4xl mx-auto">
      <Link href="/blog" className="text-green-500 hover:underline mb-8 block w-fit">
        &lt; cd ..
      </Link>
      
      <h1 className="text-4xl text-white mb-4">{meta.title}</h1>
      <p className="text-xs text-[#666] mb-10">{meta.date}</p>
      
      <article className="prose prose-invert prose-green max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}