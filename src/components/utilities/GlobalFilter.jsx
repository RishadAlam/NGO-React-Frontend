import { TextField } from '@mui/material'

export default function GlobalFilter({ filter, setFilter, t }) {
  return (
    <div className="search">
      <TextField
        id="standard-search"
        variant="standard"
        type="search"
        label={t('common.search_placeholder')}
        value={filter || ''}
        onChange={(e) => setFilter(e.target.value)}
      />
    </div>
  )
}
