import { fetchArticles } from "@/lib/fetcher";
import { Article } from "@/lib/types";
import Feed from "@/components/Feed";
import SubscribeForm from "@/components/SubscribeForm";

export const revalidate = 3600;

export default async function Home() {
  let articles: Article[];
  try {
    articles = await fetchArticles();
  } catch {
    articles = [];
  }

  const now = new Date();
  const formatted = now.toLocaleDateString("en-AU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Australia/Sydney",
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-2xl mx-auto px-5 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[24px] font-bold tracking-tight text-foreground">
                The ASX Curator
              </h1>
              <p className="text-[13px] text-muted mt-0.5">{formatted}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
              <span className="text-[11px] font-medium text-green">Live</span>
            </div>
          </div>
          <p className="text-[14px] text-muted mt-3 leading-relaxed max-w-md">
            The essential Australian stock market read. Top stories and
            analysis, curated hourly.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-5 py-8">
        {/* Subscribe CTA */}
        <div className="mb-10">
          <SubscribeForm />
        </div>

        {/* Article Feed */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted">
              Today&apos;s Picks
            </h2>
            <span className="text-[12px] text-muted/60">
              {articles.length} articles
            </span>
          </div>
        </div>

        <Feed articles={articles} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="max-w-2xl mx-auto px-5 py-8">
          <div className="flex items-center justify-between">
            <p className="text-[12px] text-muted/60">
              &copy; {now.getFullYear()} The ASX Curator
            </p>
            <p className="text-[11px] text-muted/40">
              Updated hourly. Not financial advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
