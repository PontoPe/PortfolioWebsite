import { getPostFiles, getPostContent } from "@/lib/github";
import ReactMarkdown from "react-markdown"; 

export async function generateStaticParams() {
  const files = await getPostFiles();
  
  // Removemos ": any"
  return files.map((file) => ({
    slug: file.name.replace(".md", ""),
  }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { meta, content } = await getPostContent(`${params.slug}.md`);

  return (
    <div className="min-h-screen bg-[#111] text-[#B1B1B1] font-mono p-10 pt-32 max-w-4xl mx-auto">
      <h1 className="text-4xl text-white mb-4">{meta.title}</h1>
      <p className="text-xs text-[#666] mb-10">{meta.date}</p>
      <article className="prose prose-invert">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}