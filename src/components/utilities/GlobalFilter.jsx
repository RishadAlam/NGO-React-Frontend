import { TextField } from '@mui/material'

export default function GlobalFilter({ filter, setFilter }) {
  return (
    <div className="search">
      <TextField
        id="standard-search"
        variant="standard"
        type="search"
        label="Search"
        value={filter || ''}
        onChange={(e) => setFilter(e.target.value)}
      />
    </div>
  )
}
