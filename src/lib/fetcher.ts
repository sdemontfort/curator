import { Article } from "./types";
import { NEWS_SOURCES } from "./sources";

interface RSSItem {
  title?: string;
  link?: string;
  contentSnippet?: string;
  content?: string;
  isoDate?: string;
  pubDate?: string;
  imageUrl?: string;
}

interface RSSFeed {
  items: RSSItem[];
}

function extractImage(itemXml: string): string | undefined {
  // <media:content url="...">
  const media = itemXml.match(/<media:content[^>]+url=["']([^"']+)["']/);
  if (media) return media[1];

  // <media:thumbnail url="...">
  const thumb = itemXml.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/);
  if (thumb) return thumb[1];

  // <enclosure url="..." type="image/...">
  const enc = itemXml.match(
    /<enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']image\/[^"']+["']/
  );
  if (enc) return enc[1];

  // <enclosure url="..."> (without explicit type check, fallback)
  const encFallback = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["']/);
  if (encFallback) {
    const url = encFallback[1];
    if (/\.(jpg|jpeg|png|webp|gif)/i.test(url)) return url;
  }

  // <img src="..."> inside content
  const img = itemXml.match(/<img[^>]+src=["']([^"']+)["']/);
  if (img) return img[1];

  return undefined;
}

async function parseFeed(url: string): Promise<RSSFeed> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Stockade/1.0" },
  });
  const xml = await res.text();

  const items: RSSItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const getTag = (tag: string) => {
      const m = itemXml.match(
        new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`)
      );
      if (m) return m[1].trim();
      const m2 = itemXml.match(
        new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)
      );
      return m2 ? m2[1].trim() : undefined;
    };

    items.push({
      title: getTag("title"),
      link: getTag("link"),
      contentSnippet: getTag("description"),
      content: getTag("content:encoded") || getTag("description"),
      isoDate: getTag("pubDate"),
      pubDate: getTag("pubDate"),
      imageUrl: extractImage(itemXml),
    });
  }

  return { items };
}

function stripHtml(html: string): string {
  return (
    html
      // First decode HTML entities that might be wrapping tags
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      // Remove all HTML tags (including <a href="...">, <img>, etc.)
      .replace(/<[^>]*?>/g, "")
      // Clean up remaining entities
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      // Collapse whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}

function generateId(title: string, url: string): string {
  const str = `${title}-${url}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function scoreArticle(title: string, summary: string): number {
  const text = `${title} ${summary}`.toLowerCase();
  let score = 0;

  const highValue = [
    "asx 200",
    "asx200",
    "stock pick",
    "buy",
    "sell",
    "portfolio",
    "dividend",
    "earnings",
    "profit",
    "growth stock",
    "value stock",
    "market update",
    "rba",
    "interest rate",
    "investor",
    "investing",
    "shares",
    "superannuation",
    "etf",
    "ipo",
    "blue chip",
    "small cap",
    "market rally",
    "market crash",
    "bull",
    "bear",
    "analysis",
    "forecast",
    "outlook",
    "commonwealth bank",
    "bhp",
    "rio tinto",
    "csl",
    "westpac",
    "anz",
    "nab",
    "macquarie",
    "fortescue",
    "woodside",
    "telstra",
  ];

  const lowValue = [
    "sponsored",
    "advertisement",
    "podcast transcript",
    "click here",
    "subscribe now",
  ];

  for (const keyword of highValue) {
    if (text.includes(keyword)) score += 2;
  }

  for (const keyword of lowValue) {
    if (text.includes(keyword)) score -= 5;
  }

  if (title.length > 20 && title.length < 150) score += 1;
  if (summary.length > 50) score += 1;

  return score;
}

export async function fetchArticles(): Promise<Article[]> {
  const allArticles: Article[] = [];
  const now = new Date();

  const feedPromises = NEWS_SOURCES.map(async (source) => {
    try {
      const feed = await parseFeed(source.feedUrl);
      return feed.items
        .filter((item) => item.title && item.link)
        .map((item) => {
          const title = stripHtml(item.title || "");
          const summary = stripHtml(
            item.contentSnippet || item.content || ""
          ).slice(0, 300);
          const url = item.link || "";

          return {
            id: generateId(title, url),
            title,
            summary,
            url,
            source: source.name,
            imageUrl: item.imageUrl || null,
            publishedAt: item.isoDate || item.pubDate || now.toISOString(),
            category: source.category,
            curatedAt: now.toISOString(),
            _score: scoreArticle(title, summary),
          };
        });
    } catch {
      console.error(`Failed to fetch ${source.name}`);
      return [];
    }
  });

  const results = await Promise.all(feedPromises);
  const scored = results.flat();

  scored.sort((a, b) => b._score - a._score);

  const seen = new Set<string>();
  for (const article of scored) {
    const key = article.title.toLowerCase().slice(0, 60);
    if (!seen.has(key)) {
      seen.add(key);
      const { _score, ...clean } = article;
      void _score;
      allArticles.push(clean);
    }
  }

  return allArticles.slice(0, 30);
}
