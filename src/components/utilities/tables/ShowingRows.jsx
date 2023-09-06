import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

export default function ShowingRows({ pageSize, setPageSize, t }) {
  return (
    <>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">{t('common.Showing_Up')}</InputLabel>
        <Select
          value={pageSize}
          onChange={(e) => setPageSize(e.target.value)}
          label={t('common.Showing_Up')}>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={30}>30</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={500}>500</MenuItem>
        </Select>
      </FormControl>
    </>
  )
}
