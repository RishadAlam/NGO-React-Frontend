import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import tsNumbers from '../../../libs/tsNumbers'

export default function ShowingRows({ pageSize, setPageSize, t }) {
  return (
    <>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">{t('common.Showing_Up')}</InputLabel>
        <Select
          value={pageSize}
          onChange={(e) => setPageSize(e.target.value)}
          label={t('common.Showing_Up')}>
          <MenuItem value={10}>{tsNumbers(10)}</MenuItem>
          <MenuItem value={20}>{tsNumbers(20)}</MenuItem>
          <MenuItem value={30}>{tsNumbers(30)}</MenuItem>
          <MenuItem value={50}>{tsNumbers(50)}</MenuItem>
          <MenuItem value={100}>{tsNumbers(100)}</MenuItem>
          <MenuItem value={500}>{tsNumbers(500)}</MenuItem>
        </Select>
      </FormControl>
    </>
  )
}
