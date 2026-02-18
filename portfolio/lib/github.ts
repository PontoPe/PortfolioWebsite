import fs from "fs";
import path from "path";
import matter from "gray-matter"; // Você vai precisar instalar: npm install gray-matter

const contentDirectory = path.join(process.cwd(), "_content");

// Lista os arquivos .md
export async function getPostFiles() {
  // Verifica se a pasta existe (para não quebrar em dev local se você não tiver clonado)
  if (!fs.existsSync(contentDirectory)) return [];

  const fileNames = fs.readdirSync(contentDirectory);
  
  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => ({
      name: fileName,
    }));
}

// Lê o conteúdo de um post
export async function getPostContent(slug: string) {
  const fullPath = path.join(contentDirectory, slug);
  
  // Se não achar, retorna vazio
  if (!fs.existsSync(fullPath)) return { meta: {}, content: "" };

  const fileContents = fs.readFileSync(fullPath, "utf8");
  
  // O gray-matter separa o cabeçalho (meta) do corpo (content)
  const { data, content } = matter(fileContents);

  return {
    meta: data,    // Título, data, etc.
    content,       // O texto em Markdown
  };
}