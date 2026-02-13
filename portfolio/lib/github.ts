import matter from "gray-matter";

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  download_url: string;
}

const REPO_OWNER = "PontoPe";
const REPO_NAME = "ObsidianGit";
const FOLDER_PATH = "posts";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function getPostFiles(): Promise<GitHubFile[]> {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FOLDER_PATH}`;

  console.log(`[DEBUG] Tentando acessar: ${url}`);
  console.log(`[DEBUG] Token presente: ${GITHUB_TOKEN ? "SIM" : "NÃO"}`);

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "force-cache",
    });

    if (!res.ok) {
      console.error(`[ERRO GITHUB] Status: ${res.status} - ${res.statusText}`);
      console.error(`[ERRO DETALHE] ${await res.text()}`);
      return [];
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
        console.error("[ERRO GITHUB] A resposta não é uma lista (array). Recebi:", data);
        return [];
    }

    const files = data as GitHubFile[];
    const posts = files.filter((f) => f.name.endsWith(".md"));

    console.log(`[SUCESSO] Encontrados ${posts.length} posts.`);
    return posts;

  } catch (error) {
    console.error("[ERRO FATAL] Falha na conexão:", error);
    return [];
  }
}

export async function getPostContent(filename: string) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FOLDER_PATH}/${filename}`;

  try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          // raw media type returns file content directly instead of base64
          Accept: "application/vnd.github.v3.raw",
        },
      });

      if (!res.ok) {
          return { meta: { title: "Erro ao carregar", date: "" }, content: "Erro ao baixar conteúdo.", slug: "error" };
      }

      const rawMD = await res.text();
      const { data, content } = matter(rawMD);

      return {
        meta: data,
        content,
        slug: filename.replace(".md", ""),
      };
  } catch (error) {
      return { meta: { title: "Erro", date: error }, content: "Erro de conexão.", slug: "error" };
  }
}
