export interface NewsSource {
  name: string;
  feedUrl: string;
  category: "markets" | "analysis" | "company" | "economy" | "opinion";
}

export const NEWS_SOURCES: NewsSource[] = [
  {
    name: "AFR Markets",
    feedUrl: "https://www.afr.com/rss/markets",
    category: "markets",
  },
  {
    name: "AFR Wealth",
    feedUrl: "https://www.afr.com/rss/wealth",
    category: "analysis",
  },
  {
    name: "AFR Companies",
    feedUrl: "https://www.afr.com/rss/companies",
    category: "company",
  },
  {
    name: "ASX News (Google)",
    feedUrl:
      "https://news.google.com/rss/search?q=ASX+stock+market+Australia&hl=en-AU&gl=AU&ceid=AU:en",
    category: "markets",
  },
  {
    name: "Australian Investing (Google)",
    feedUrl:
      "https://news.google.com/rss/search?q=Australia+investing+shares&hl=en-AU&gl=AU&ceid=AU:en",
    category: "analysis",
  },
  {
    name: "Livewire Markets",
    feedUrl: "https://www.livewiremarkets.com/rss",
    category: "opinion",
  },
  {
    name: "Australian Economy (Google)",
    feedUrl:
      "https://news.google.com/rss/search?q=Australian+economy+RBA+interest+rates&hl=en-AU&gl=AU&ceid=AU:en",
    category: "economy",
  },
];
