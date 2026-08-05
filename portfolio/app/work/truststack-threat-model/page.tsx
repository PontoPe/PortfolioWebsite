import fs from "fs";
import path from "path";
import Link from "next/link";
import type { Metadata } from "next";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type DocMeta = {
  title: string;
  subtitle: string;
  date: string;
  description: string;
};

function readDoc() {
  const filePath = path.join(process.cwd(), "_docs", "truststack-threat-model.md");
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const meta = data as Partial<DocMeta>;

  return {
    meta: {
      title: meta.title || "TrustStack — Program Threat Model",
      subtitle: meta.subtitle || "",
      date: meta.date || "",
      description: meta.description || "",
    },
    content,
  };
}

const canonical = "https://pedromartins.tech/work/truststack-threat-model/";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = readDoc();

  return {
    title: `${meta.title} | Pedro Martins`,
    description: meta.description,
    alternates: { canonical },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      url: canonical,
    },
  };
}

export default function TrustStackThreatModelPage() {
  const { meta, content } = readDoc();

  return (
    <div className="min-h-screen w-full bg-[#181818] text-[#B1B1B1] font-mono">
      <div className="mx-auto flex max-w-6xl flex-col lg:flex-row">
        <aside className="hidden w-64 flex-none border-r border-white/5 p-10 lg:block">
          <Link
            href="/work/truststack"
            className="mb-10 block text-sm font-bold text-green-500 transition-colors hover:text-white"
          >
            &lt; cd ../truststack
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#555]">
            Document
          </p>
          <p className="mt-2 mb-8 text-xs leading-relaxed">
            Program-level threat model. Component models remain authoritative inside their own
            scope.
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#555]">
            Repositories
          </p>
          <ul className="mt-2 space-y-1 text-xs">
            {["AwLZ", "ProvenancePipeline", "KateClusters", "PontoAntiCrack"].map((repo) => (
              <li key={repo}>
                <a
                  href={`https://github.com/PontoPe/${repo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-500 hover:underline"
                >
                  {repo}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <main className="min-w-0 flex-1 bg-[#1F1F1F]">
          <header className="flex h-11 items-center border-b border-white/5 bg-[#181818] px-8 text-[10px] font-bold uppercase tracking-widest text-[#555]">
            File:
            <span className="ml-2 text-white">docs/threat-model.md</span>
          </header>

          <div className="min-w-0 max-w-full px-6 py-16 md:px-16 md:py-24">
            <Link
              href="/work/truststack"
              className="mb-10 inline-block text-sm font-bold text-green-500 hover:text-white lg:hidden"
            >
              &lt; cd ../truststack
            </Link>

            <h1 className="mb-4 text-4xl font-bold uppercase italic tracking-tighter text-white md:text-6xl">
              {meta.title}
            </h1>
            {meta.subtitle ? (
              <p className="mb-4 text-lg text-[#B1B1B1]">{meta.subtitle}</p>
            ) : null}
            <p className="mb-16 text-xs font-bold uppercase tracking-widest text-[#555]">
              {`${meta.date} // STRIDE // 8 cross-boundary threats, 5 without a control`}
            </p>

            <article
              className="prose prose-invert prose-green max-w-none
                prose-headings:text-white prose-headings:italic prose-headings:tracking-tighter
                prose-h2:mt-16 prose-h2:mb-6 prose-h3:mt-10 prose-h3:mb-4
                [&>p]:leading-loose [&>p]:mb-6
                prose-pre:bg-[#181818] prose-pre:border prose-pre:border-white/5 prose-pre:text-xs
                prose-pre:max-w-full prose-pre:overflow-x-auto
                prose-li:marker:text-green-500 prose-ul:pl-5
                prose-hr:border-white/10
                prose-th:text-white prose-th:text-left
                prose-td:align-top"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: (props) => (
                    <a
                      {...props}
                      target="_blank"
                      rel="noreferrer"
                      className="text-green-500 hover:underline"
                    />
                  ),
                  table: (props) => (
                    <div className="my-8 max-w-full overflow-x-auto">
                      <table {...props} className="w-max min-w-full text-xs" />
                    </div>
                  ),
                  pre: (props) => (
                    <pre
                      {...props}
                      className="my-8 max-w-full overflow-x-auto border border-white/5 bg-[#181818] p-4 text-xs"
                    />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </article>
          </div>
        </main>
      </div>
    </div>
  );
}
