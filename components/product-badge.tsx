interface Props {
  type: "new" | "sale" | "trending" | "bestseller"
}

export function ProductBadge({ type }: Props) {
  const badges = {
    new: { text: "NEW", bg: "bg-blue-500" },
    sale: { text: "SALE", bg: "bg-red-500" },
    trending: { text: "🔥 TRENDING", bg: "bg-orange-500" },
    bestseller: { text: "⭐ BESTSELLER", bg: "bg-purple-500" }
  }

  const badge = badges[type]

  return (
    <span className={`${badge.bg} text-white text-xs font-bold px-2 py-1 rounded`}>
      {badge.text}
    </span>
  )
}
