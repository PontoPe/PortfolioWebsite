import matter from "gray-matter";

// 1. Criamos o "Molde" do que o GitHub nos manda
export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  download_url: string;
}

const REPO_OWNER = "PontoPe"; // Seu usuário
const REPO_NAME = "BlogPosts"; // Nome do repo privado (exemplo)
const FOLDER_PATH = "posts"; 
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; 

export async function getPostFiles(): Promise<GitHubFile[]> {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FOLDER_PATH}`;
  
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
    next: { revalidate: 60 }, 
  });

  if (!res.ok) return [];
  
  // Aqui dizemos ao TS que a resposta é uma lista de GitHubFile
  const files: GitHubFile[] = await res.json();
  
  return files.filter((f) => f.name.endsWith(".md"));
}

export async function getPostContent(filename: string) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FOLDER_PATH}/${filename}`;
  
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3.raw", 
    },
  });

  const rawMD = await res.text();
  const { data, content } = matter(rawMD);
  
  return {
    meta: data,
    content,
    slug: filename.replace(".md", ""),
  };
}