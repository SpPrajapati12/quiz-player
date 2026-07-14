const COLORS = ['#F2B705', '#2DD4BF', '#FB6F92', '#F5F3FF']

export default function Confetti({ count = 40 }) {
  const pieces = Array.from({ length: count }, (_, i) => {
    const left = Math.random() * 100
    const delay = Math.random() * 0.6
    const duration = 1.8 + Math.random() * 1.2
    const color = COLORS[i % COLORS.length]
    const size = 6 + Math.random() * 6
    return { id: i, left, delay, duration, color, size }
  })

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 animate-confettiFall rounded-sm"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.4,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
