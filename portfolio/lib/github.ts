import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Ajustamos para procurar dentro de _content/posts se existir, ou _content direto
const rootContent = path.join(process.cwd(), "_content");

function getContentDir() {
  // Se existir a pasta 'posts' (padrão do ObsidianGit), usa ela
  const postsDir = path.join(rootContent, "posts");
  if (fs.existsSync(postsDir)) {
    return postsDir;
  }
  // Se não, usa a raiz _content mesmo
  return rootContent;
}

export async function getPostFiles() {
  const targetDir = getContentDir();

  try {
    if (!fs.existsSync(targetDir)) {
      console.warn(`[AVISO] Pasta não encontrada: ${targetDir}`);
      return [];
    }

    const fileNames = fs.readdirSync(targetDir);

    // Filtra apenas arquivos .md
    return fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => ({
        name: fileName,
      }));
      
  } catch (error) {
    console.error("[ERRO CRÍTICO] Falha ao ler arquivos:", error);
    return [];
  }
}

export async function getPostContent(slug: string) {
  const targetDir = getContentDir();
  const fullPath = path.join(targetDir, slug);
  
  if (!fs.existsSync(fullPath)) {
    return {
      meta: { title: "Post Not Found", date: "0000-00-00" },
      content: "# 404\nPost não encontrado.",
    };
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    meta: data,
    content,
  };
}