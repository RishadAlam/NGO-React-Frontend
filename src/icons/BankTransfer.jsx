export default function BankTransfer({ size = 24, stroke = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke="none" fill={stroke}>
      <path d="M15 14v-3h3V9l4 3.5-4 3.5v-2h-3m-1-6.3V9H2V7.7L8 4l6 3.7M7 10h2v5H7v-5m-4 0h2v5H3v-5m10 0v2.5l-2 1.8V10h2m-3.9 6l-.6.5 1.7 1.5H2v-2h7.1m7.9-1v3h-3v2l-4-3.5 4-3.5v2h3z" />
    </svg>
  )
}
