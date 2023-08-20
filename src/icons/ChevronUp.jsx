export default function ChevronUp({ size = 24, stroke = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke}>
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  )
}
