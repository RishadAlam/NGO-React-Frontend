export default function Taka({ size = 24, stroke = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <circle cx="16.5" cy="15.5" r="1"></circle>
      <path d="M7 7a2 2 0 1 1 4 0v9a3 3 0 0 0 6 0v-.5"></path>
      <path d="M8 11h6"></path>
    </svg>
  )
}