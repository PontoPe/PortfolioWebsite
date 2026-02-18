import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Define o caminho. Note que em produção (Vercel/GitHub Actions) o cwd pode variar,
// mas geralmente isso aponta para a raiz do projeto onde o package.json está.
const contentDirectory = path.join(process.cwd(), "_content");

export async function getPostFiles() {
  try {
    // 1. SEGURANÇA: Se a pasta não existe, retorna vazio e avisa no log.
    // Isso impede o erro "missing generateStaticParams" de acontecer por crash.
    if (!fs.existsSync(contentDirectory)) {
      console.warn(`[AVISO] A pasta de conteúdo não foi encontrada em: ${contentDirectory}`);
      console.warn("[AVISO] O build vai continuar, mas sem gerar posts de blog.");
      return [];
    }

    const fileNames = fs.readdirSync(contentDirectory);

    return fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => ({
        name: fileName,
      }));
      
  } catch (error) {
    console.error("[ERRO CRÍTICO] Falha ao ler arquivos do blog:", error);
    return []; // Retorna vazio em caso de erro bizarro para não derrubar o site
  }
}

export async function getPostContent(slug: string) {
  const fullPath = path.join(contentDirectory, slug);
  
  if (!fs.existsSync(fullPath)) {
    return {
      meta: { title: "Post Not Found", date: "0000-00-00" },
      content: "# Erro 404\nPost não encontrado ou arquivo ausente.",
    };
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    meta: data,
    content,
  };
}