import { Article } from "@/lib/types";

const CATEGORY_LABELS: Record<Article["category"], string> = {
  markets: "Markets",
  analysis: "Analysis",
  company: "Company",
  economy: "Economy",
  opinion: "Opinion",
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <article className="py-6 border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[11px] font-medium tracking-wide uppercase text-muted">
            {CATEGORY_LABELS[article.category]}
          </span>
          <span className="text-[11px] text-muted/60">{"/"}</span>
          <span className="text-[11px] text-muted/80">{article.source}</span>
          <span className="text-[11px] text-muted/60 ml-auto">
            {timeAgo(article.publishedAt)}
          </span>
        </div>
        <h3 className="text-[17px] leading-snug font-medium text-foreground group-hover:text-accent transition-colors mb-1.5">
          {article.title}
        </h3>
        {article.summary && (
          <p className="text-[14px] leading-relaxed text-muted line-clamp-2">
            {article.summary}
          </p>
        )}
        <span className="inline-block mt-2 text-[12px] font-medium text-accent/70 group-hover:text-accent transition-colors">
          Read article &rarr;
        </span>
      </article>
    </a>
  );
}
