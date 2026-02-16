"use client";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "markets", label: "Markets" },
  { value: "analysis", label: "Analysis" },
  { value: "company", label: "Company" },
  { value: "economy", label: "Economy" },
  { value: "opinion", label: "Opinion" },
] as const;

export default function FilterBar({
  active,
  onChange,
}: {
  active: string;
  onChange: (cat: string) => void;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors whitespace-nowrap ${
            active === cat.value
              ? "bg-accent text-white"
              : "text-muted hover:text-foreground hover:bg-accent-light"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
