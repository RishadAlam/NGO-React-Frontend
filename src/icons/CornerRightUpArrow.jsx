export default function CornerRightUpArrow({ size = 24, stroke = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke}>
      <polyline points="10 9 15 4 20 9"></polyline>
      <path d="M4 20h7a4 4 0 0 0 4-4V4"></path>
    </svg>
  )
}
