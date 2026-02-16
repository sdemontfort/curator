export interface Article {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  imageUrl: string | null;
  publishedAt: string;
  category: "markets" | "analysis" | "company" | "economy" | "opinion";
  curatedAt: string;
}

export interface Subscriber {
  email: string;
  subscribedAt: string;
  active: boolean;
}
