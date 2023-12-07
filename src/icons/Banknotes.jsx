export default function Banknotes({ size = 24, stroke = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="none" fill={stroke}>
      <path
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={2}
        d="M1 24h52v26H1z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={2}
        d="M11 22v-8h52v26h-8"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={2}
        d="M10 46c0-3-2-4-5-4V32c3 0 5-1 5-4h35c0 3 2 4 4 4v10c-2 0-4 1-4 4H10z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={2}
        d="M32 37 A5 5 0 0 1 27 42 A5 5 0 0 1 22 37 A5 5 0 0 1 32 37 z"
      />
    </svg>
  )
}
