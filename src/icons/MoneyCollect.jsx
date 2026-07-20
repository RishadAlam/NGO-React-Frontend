export default function MoneyCollect({ size = 24, stroke = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M12 2v8" />
      <path d="m8.5 6.5 3.5 3.5 3.5-3.5" />
      <rect x="3" y="12" width="18" height="9" rx="2.5" />
      <circle cx="12" cy="16.5" r="2" />
      <path d="M6 15.5h.01M18 17.5h.01" />
    </svg>
  )
}
