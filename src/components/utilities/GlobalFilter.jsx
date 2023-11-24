import { TextField } from '@mui/material'
import tsNumbers from '../../libs/tsNumbers'

export default function GlobalFilter({ filter, setFilter, t }) {
  return (
    <div className="search">
      <TextField
        id="standard-search"
        variant="standard"
        type="search"
        label={t('common.search_placeholder')}
        value={filter ? tsNumbers(filter) : ''}
        onChange={(e) => setFilter(tsNumbers(e.target.value, true))}
      />
    </div>
  )
}
