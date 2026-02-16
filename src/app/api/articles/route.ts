import { NextRequest, NextResponse } from "next/server";
import { fetchArticles } from "@/lib/fetcher";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  try {
    let articles = await fetchArticles();

    if (category && category !== "all") {
      articles = articles.filter((a) => a.category === category);
    }

    return NextResponse.json({ articles, updatedAt: new Date().toISOString() });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
