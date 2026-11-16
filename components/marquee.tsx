export function Marquee({ items }: { items: string[] }) {
  if (!items.length) return null
  const row = [...items, ...items]
  return (
    <div className="overflow-hidden bg-primary py-4 text-white" aria-hidden>
      <div className="marquee flex w-max gap-12 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-12 font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.2em]">{t}<span className="h-1.5 w-1.5 rounded-full bg-white/70" /></span>
        ))}
      </div>
    </div>
  )
}
