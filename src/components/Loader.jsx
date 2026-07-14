export default function Loader({ label = 'Loading' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-stage-line border-t-gold" />
      </div>
      <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">{label}&hellip;</p>
    </div>
  )
}
