"use client";

import { useState } from "react";
import { Article } from "@/lib/types";
import ArticleCard from "./ArticleCard";
import FilterBar from "./FilterBar";

export default function Feed({ articles }: { articles: Article[] }) {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? articles
      : articles.filter((a) => a.category === filter);

  return (
    <div>
      <div className="mb-6">
        <FilterBar active={filter} onChange={setFilter} />
      </div>
      <div>
        {filtered.length === 0 ? (
          <p className="text-muted text-[14px] py-12 text-center">
            No articles in this category right now.
          </p>
        ) : (
          filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        )}
      </div>
    </div>
  );
}
