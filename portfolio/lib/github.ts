import fs from "fs";
import path from "path";
import matter from "gray-matter";

const DEFAULT_POST_DATE = "0000-00-00";
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const BR_DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const SAFE_MARKDOWN_FILENAME = /^[^/\\\0]+\.md$/i;

export type PostMeta = {
  title: string;
  date: string;
  dateTimestamp: number;
  description: string;
};

type PostContent = {
  meta: PostMeta;
  content: string;
};

// Ajustamos para procurar dentro de _content/posts se existir, ou _content direto
const rootContent = path.join(process.cwd(), "_content");

function normalizeText(value: unknown, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim();
  return normalized || fallback;
}

function toValidUtcDate(year: number, month: number, day: number) {
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function normalizePostDate(value: unknown) {
  let parsedDate: Date | null = null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    parsedDate = value;
  } else if (typeof value === "string") {
    const normalized = value.trim();
    const isoMatch = ISO_DATE_PATTERN.exec(normalized);
    const brMatch = BR_DATE_PATTERN.exec(normalized);

    if (isoMatch) {
      parsedDate = toValidUtcDate(
        Number(isoMatch[1]),
        Number(isoMatch[2]),
        Number(isoMatch[3]),
      );
    } else if (brMatch) {
      parsedDate = toValidUtcDate(
        Number(brMatch[3]),
        Number(brMatch[2]),
        Number(brMatch[1]),
      );
    }
  }

  if (!parsedDate) {
    return {
      date: DEFAULT_POST_DATE,
      dateTimestamp: 0,
    };
  }

  return {
    date: parsedDate.toISOString().slice(0, 10),
    dateTimestamp: parsedDate.getTime(),
  };
}

function normalizePostMeta(data: Record<string, unknown>, fallbackTitle: string): PostMeta {
  const normalizedDate = normalizePostDate(data.date);

  // TODO(blog-content-schema): If Obsidian frontmatter gains new fields, move this
  // validation into a shared schema with fixtures. Keep support for YAML Date
  // objects because gray-matter parses unquoted ISO dates into Date instances.
  return {
    title: normalizeText(data.title, fallbackTitle),
    date: normalizedDate.date,
    dateTimestamp: normalizedDate.dateTimestamp,
    description: normalizeText(data.description),
  };
}

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

export async function getPostContent(slug: string): Promise<PostContent> {
  const targetDir = getContentDir();
  const isSafeFilename = SAFE_MARKDOWN_FILENAME.test(slug);
  const fullPath = isSafeFilename ? path.join(targetDir, slug) : null;

  if (!fullPath || !fs.existsSync(fullPath)) {
    return {
      meta: {
        title: "Post Not Found",
        date: DEFAULT_POST_DATE,
        dateTimestamp: 0,
        description: "",
      },
      content: "# 404\nPost não encontrado.",
    };
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const fallbackTitle = path.basename(slug, path.extname(slug)).replace(/-/g, " ");

  return {
    meta: normalizePostMeta(data, fallbackTitle),
    content,
  };
}
